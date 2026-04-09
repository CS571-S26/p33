import { useCallback, useMemo, useState } from 'react'
import {
  APPLICATION_STATUSES,
  JOB_TYPES,
  normalizeStatus,
} from '../constants/applications'

const STORAGE_KEY = 'job-tracker-applications-v2'
const LEGACY_STORAGE_KEY = 'job-tracker-applications-v1'

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

export function useApplications() {
  const [applications, setApplications] = useState(() => {
    const stored = loadApplications()
    return stored?.length ? stored : DEFAULT_APPLICATIONS
  })

  const persist = useCallback((next) => {
    setApplications(next)
    saveApplications(next)
  }, [])

  const addApplication = useCallback(
    (draft) => {
      const status = APPLICATION_STATUSES.includes(draft.status)
        ? draft.status
        : normalizeStatus(draft.status)
      persist([
        ...applications,
        {
          id: makeId(),
          company: draft.company.trim(),
          role: draft.role.trim(),
          jobType: draft.jobType,
          dateApplied: draft.dateApplied,
          status,
          notes: (draft.notes ?? '').trim(),
          bookmarked: false,
        },
      ])
    },
    [applications, persist],
  )

  const updateApplication = useCallback(
    (id, fields) => {
      persist(
        applications.map((a) => {
          if (a.id !== id) return a
          const next = { ...a, ...fields }
          if (fields.status != null) {
            next.status = normalizeStatus(fields.status)
          }
          if (fields.notes != null) {
            next.notes = String(fields.notes)
          }
          return next
        }),
      )
    },
    [applications, persist],
  )

  const removeApplication = useCallback(
    (id) => {
      persist(applications.filter((a) => a.id !== id))
    },
    [applications, persist],
  )

  const stats = useMemo(() => {
    const total = applications.length
    const interviewing = applications.filter(
      (a) => a.status === 'interviewing',
    ).length
    const offer = applications.filter((a) => a.status === 'offer').length
    const rejected = applications.filter((a) => a.status === 'rejected').length
    const offers = offer
    const responded = interviewing + offer + rejected
    const responseRate =
      total === 0 ? 0 : Math.round((responded / total) * 100)
    return { total, offers, responseRate }
  }, [applications])

  return {
    applications,
    addApplication,
    updateApplication,
    removeApplication,
    stats,
  }
}
