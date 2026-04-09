import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from './firebase-config'

const COLLECTION_NAME = 'applications'

export function subscribeToApplications(onChange) {
  if (!db) {
    return () => {}
  }
  const ref = collection(db, COLLECTION_NAME)
  return onSnapshot(ref, (snapshot) => {
    const rows = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }))
    onChange(rows)
  })
}

export async function addApplication(data) {
  if (!db) throw new Error('Firestore is not configured')
  return addDoc(collection(db, COLLECTION_NAME), {
    ...data,
    createdAt: serverTimestamp(),
  })
}

export async function updateApplication(id, fields) {
  if (!db) throw new Error('Firestore is not configured')
  const ref = doc(db, COLLECTION_NAME, id)
  return updateDoc(ref, fields)
}

export async function deleteApplication(id) {
  if (!db) throw new Error('Firestore is not configured')
  return deleteDoc(doc(db, COLLECTION_NAME, id))
}
