import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from './firebase-config'

export function subscribeToAuth(onChange) {
  if (!auth) {
    onChange(null)
    return () => {}
  }

  return onAuthStateChanged(auth, onChange)
}

export async function signInWithGoogle() {
  if (!auth || !googleProvider) {
    throw new Error('Firebase is not configured in this project.')
  }

  return signInWithPopup(auth, googleProvider)
}

export async function signOutUser() {
  if (!auth) {
    return
  }

  return signOut(auth)
}
