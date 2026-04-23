import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { normalizeStatus } from '../constants/applications'
import { db } from './firebase-config'

const COLLECTION_NAME = 'applications'
const USERS_COLLECTION = 'users'

function getApplicationsCollection(uid) {
  if (!db || !uid) {
    throw new Error('Firestore is not configured')
  }

  return collection(db, USERS_COLLECTION, uid, COLLECTION_NAME)
}

function getApplicationDocument(uid, id) {
  if (!db || !uid) {
    throw new Error('Firestore is not configured')
  }

  return doc(db, USERS_COLLECTION, uid, COLLECTION_NAME, id)
}

function normalizeApplicationDoc(snapshot) {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    company: String(data.company ?? ''),
    role: String(data.role ?? ''),
    jobType: String(data.jobType ?? 'Internship'),
    dateApplied: String(data.dateApplied ?? ''),
    status: normalizeStatus(data.status),
    notes: String(data.notes ?? ''),
    bookmarked: Boolean(data.bookmarked),
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  }
}

export function subscribeToApplications(uid, onChange, onError) {
  if (!db || !uid) {
    return () => {}
  }

  const ref = getApplicationsCollection(uid)
  return onSnapshot(ref, (snapshot) => {
    const rows = snapshot.docs.map(normalizeApplicationDoc)
    onChange(rows)
  }, onError)
}

export async function addApplication(uid, data) {
  if (!db) throw new Error('Firestore is not configured')

  return addDoc(getApplicationsCollection(uid), {
    ...data,
    status: normalizeStatus(data.status),
    notes: String(data.notes ?? ''),
    bookmarked: Boolean(data.bookmarked),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateApplication(uid, id, fields) {
  if (!db) throw new Error('Firestore is not configured')

  const nextFields = {
    ...fields,
    updatedAt: serverTimestamp(),
  }

  if (fields.status != null) {
    nextFields.status = normalizeStatus(fields.status)
  }
  if (fields.notes != null) {
    nextFields.notes = String(fields.notes)
  }
  if (fields.bookmarked != null) {
    nextFields.bookmarked = Boolean(fields.bookmarked)
  }

  return updateDoc(getApplicationDocument(uid, id), nextFields)
}

export async function deleteApplication(uid, id) {
  if (!db) throw new Error('Firestore is not configured')
  return deleteDoc(getApplicationDocument(uid, id))
}
