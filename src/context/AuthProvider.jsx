import { useCallback, useEffect, useMemo, useState } from 'react'
import { signInWithGoogle as signInWithGooglePopup, signOutUser as signOutFirebaseUser, subscribeToAuth } from '../firebase/auth'
import { isFirebaseConfigured } from '../firebase/firebase-config'
import { AuthContext } from './authContext'

const FIREBASE_ENABLED = isFirebaseConfigured()

function getErrorMessage(error, fallbackMessage) {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallbackMessage
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(FIREBASE_ENABLED)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    if (!FIREBASE_ENABLED) {
      return undefined
    }

    return subscribeToAuth((nextUser) => {
      setUser(nextUser)
      setAuthLoading(false)
      setAuthError('')
    })
  }, [])

  const clearAuthError = useCallback(() => {
    setAuthError('')
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!FIREBASE_ENABLED) {
      setAuthError('Firebase is not configured in this project.')
      return false
    }

    setAuthError('')
    try {
      await signInWithGooglePopup()
      return true
    } catch (error) {
      setAuthError(
        getErrorMessage(error, 'Google sign-in failed. Please try again.'),
      )
      return false
    }
  }, [])

  const signOutUser = useCallback(async () => {
    if (!FIREBASE_ENABLED) {
      return true
    }

    setAuthError('')
    try {
      await signOutFirebaseUser()
      return true
    } catch (error) {
      setAuthError(
        getErrorMessage(error, 'Sign-out failed. Please try again.'),
      )
      return false
    }
  }, [])

  const value = useMemo(
    () => ({
      authConfigured: FIREBASE_ENABLED,
      user,
      authLoading,
      authError,
      clearAuthError,
      signInWithGoogle,
      signOutUser,
    }),
    [authError, authLoading, clearAuthError, signInWithGoogle, signOutUser, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
