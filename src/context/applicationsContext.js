import { createContext, useContext } from 'react'

export const ApplicationsContext = createContext(null)

export function useApplicationsContext() {
  const ctx = useContext(ApplicationsContext)
  if (!ctx) {
    throw new Error(
      'useApplicationsContext must be used within ApplicationsProvider',
    )
  }
  return ctx
}
