import { startTransition, useCallback, useEffect, useMemo, useState } from 'react'
import { JOB_TYPES, normalizeStatus } from '../constants/applications'
import { useAuthContext } from '../context/authContext'
import {
  addApplication as addRemoteApplication,
  deleteApplication as deleteRemoteApplication,
  subscribeToApplications,
  updateApplication as updateRemoteApplication,
} from '../firebase/applications'
import { isFirebaseConfigured } from '../firebase/firebase-config'

const STORAGE_KEY = 'job-tracker-applications-v2'
const LEGACY_STORAGE_KEY = 'job-tracker-applications-v1'
const FIREBASE_ENABLED = isFirebaseConfigured()

const DEFAULT_APPLICATIONS = [
  {
    id: 'seed-1',
    company: 'Figma',
    role: 'Product Design Intern',
    jobType: 'Internship',
    dateApplied: '2026-03-10',
    status: 'applied',
    notes: '',
    bookmarked: false,
  },
  {
    id: 'seed-2',
    company: 'Microsoft',
    role: 'Software Engineer Intern',
    jobType: 'Internship',
    dateApplied: '2026-03-08',
    status: 'interviewing',
    notes: 'Recruiter screen booked.',
    bookmarked: true,
  },
]

function migrateRawItem(raw) {
  if (!raw || typeof raw !== 'object') return null
  const jobType =
    raw.jobType && JOB_TYPES.includes(raw.jobType) ? raw.jobType : 'Internship'
  return {
    id: String(raw.id),
    company: String(raw.company ?? ''),
    role: String(raw.role ?? ''),
    jobType,
    dateApplied: String(raw.dateApplied ?? ''),
    status: normalizeStatus(raw.status),
    notes: String(raw.notes ?? ''),
    bookmarked: Boolean(raw.bookmarked),
  }
}

function loadApplications() {
  try {
    const tryParse = (key) => {
      const raw = localStorage.getItem(key)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return null
      return parsed.map(migrateRawItem).filter(Boolean)
    }

    let list = tryParse(STORAGE_KEY)
    if (list?.length) return list

    const legacy = tryParse(LEGACY_STORAGE_KEY)
    if (legacy?.length) {
      saveApplications(legacy)
      localStorage.removeItem(LEGACY_STORAGE_KEY)
      return legacy
    }
    return null
  } catch {
    return null
  }
}

function saveApplications(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function getErrorMessage(error, fallbackMessage) {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallbackMessage
}

function normalizeJobType(jobType) {
  return JOB_TYPES.includes(jobType) ? jobType : 'Internship'
}

function normalizeApplicationDraft(draft) {
  return {
    company: String(draft.company ?? '').trim(),
    role: String(draft.role ?? '').trim(),
    jobType: normalizeJobType(draft.jobType),
    dateApplied: String(draft.dateApplied ?? ''),
    status: normalizeStatus(draft.status),
    notes: String(draft.notes ?? '').trim(),
    bookmarked: Boolean(draft.bookmarked),
  }
}

function normalizeApplicationFields(fields) {
  const next = { ...fields }

  if (Object.hasOwn(next, 'company')) {
    next.company = String(fields.company ?? '').trim()
  }
  if (Object.hasOwn(next, 'role')) {
    next.role = String(fields.role ?? '').trim()
  }
  if (Object.hasOwn(next, 'jobType')) {
    next.jobType = normalizeJobType(fields.jobType)
  }
  if (Object.hasOwn(next, 'dateApplied')) {
    next.dateApplied = String(fields.dateApplied ?? '')
  }
  if (Object.hasOwn(next, 'status')) {
    next.status = normalizeStatus(fields.status)
  }
  if (Object.hasOwn(next, 'notes')) {
    next.notes = String(fields.notes ?? '').trim()
  }
  if (Object.hasOwn(next, 'bookmarked')) {
    next.bookmarked = Boolean(fields.bookmarked)
  }

  return next
}

export function useApplications() {
  const { authLoading, user } = useAuthContext()
  const [applications, setApplications] = useState(() => {
    if (FIREBASE_ENABLED) {
      return []
    }
    const stored = loadApplications()
    return stored?.length ? stored : DEFAULT_APPLICATIONS
  })
  const [loadedUserId, setLoadedUserId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!FIREBASE_ENABLED) {
      return undefined
    }

    if (authLoading) {
      return undefined
    }

    if (!user) {
      startTransition(() => {
        const stored = loadApplications()
        setApplications(stored?.length ? stored : DEFAULT_APPLICATIONS)
        setLoadedUserId(null)
        setError('')
      })
      return undefined
    }

    return subscribeToApplications(
      user.uid,
      (rows) => {
        startTransition(() => {
          setApplications(rows)
          setLoadedUserId(user.uid)
          setError('')
        })
      },
      (nextError) => {
        setError(
          getErrorMessage(
            nextError,
            'Could not load your applications from Firestore.',
          ),
        )
        setLoadedUserId(user.uid)
      },
    )
  }, [authLoading, user])

  const persistLocal = useCallback((updater) => {
    setApplications((current) => {
      const next =
        typeof updater === 'function' ? updater(current) : updater
      saveApplications(next)
      return next
    })
  }, [])

  const addApplication = useCallback(
    (draft) => {
      const nextDraft = {
        ...normalizeApplicationDraft(draft),
        bookmarked: false,
      }

      setError('')

      if (!FIREBASE_ENABLED || !user) {
        persistLocal((current) => [
          ...current,
          {
            id: makeId(),
            ...nextDraft,
          },
        ])
        return Promise.resolve(true)
      }

      if (!user) {
        setError('Sign in with Google to add applications.')
        return Promise.resolve(false)
      }

      return addRemoteApplication(user.uid, nextDraft)
        .then(() => true)
        .catch((nextError) => {
          setError(
            getErrorMessage(nextError, 'Could not add the application.'),
          )
          return false
        })
    },
    [persistLocal, user],
  )

  const updateApplication = useCallback(
    (id, fields) => {
      const nextFields = normalizeApplicationFields(fields)

      setError('')

      if (!FIREBASE_ENABLED || !user) {
        persistLocal((current) =>
          current.map((application) =>
            application.id === id
              ? { ...application, ...nextFields }
              : application,
          ),
        )
        return Promise.resolve(true)
      }

      if (!user) {
        setError('Sign in with Google to update applications.')
        return Promise.resolve(false)
      }

      return updateRemoteApplication(user.uid, id, nextFields)
        .then(() => true)
        .catch((nextError) => {
          setError(
            getErrorMessage(nextError, 'Could not update the application.'),
          )
          return false
        })
    },
    [persistLocal, user],
  )

  const removeApplication = useCallback(
    (id) => {
      setError('')

      if (!FIREBASE_ENABLED || !user) {
        persistLocal((current) => current.filter((a) => a.id !== id))
        return Promise.resolve(true)
      }

      if (!user) {
        setError('Sign in with Google to delete applications.')
        return Promise.resolve(false)
      }

      return deleteRemoteApplication(user.uid, id)
        .then(() => true)
        .catch((nextError) => {
          setError(
            getErrorMessage(nextError, 'Could not delete the application.'),
          )
          return false
        })
    },
    [persistLocal, user],
  )

  const visibleApplications = useMemo(() => {
    if (FIREBASE_ENABLED && user && loadedUserId !== user.uid) {
      return []
    }
    return applications
  }, [applications, loadedUserId, user])

  const stats = useMemo(() => {
    const total = visibleApplications.length
    const interviewing = visibleApplications.filter(
      (a) => a.status === 'interviewing',
    ).length
    const offer = visibleApplications.filter((a) => a.status === 'offer').length
    const rejected = visibleApplications.filter((a) => a.status === 'rejected').length
    const offers = offer
    const responded = interviewing + offer + rejected
    const responseRate =
      total === 0 ? 0 : Math.round((responded / total) * 100)
    return { total, offers, responseRate }
  }, [visibleApplications])

  const isLoading =
    FIREBASE_ENABLED && (authLoading || Boolean(user && loadedUserId !== user.uid))
  const storageMode = FIREBASE_ENABLED && user ? 'cloud' : 'local'

  return {
    applications: visibleApplications,
    addApplication,
    updateApplication,
    removeApplication,
    stats,
    error,
    isLoading,
    storageMode,
    requiresSignIn: false,
  }
}
