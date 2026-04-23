import { Alert, Button, Container } from 'react-bootstrap'
import PageHero from '../components/PageHero'
import StatsBar from '../components/StatsBar'
import { useAuthContext } from '../context/authContext'
import { useApplicationsContext } from '../context/applicationsContext'

function DashboardPage() {
  const {
    authConfigured,
    authError,
    authLoading,
    user,
    signInWithGoogle,
  } = useAuthContext()
  const { storageMode } = useApplicationsContext()

  let description =
    'Live stats from your application list: totals, response rate, and offers.'

  if (!authConfigured || storageMode === 'local') {
    description =
      'This build can still run in local demo mode, but Firebase is ready when your VITE_FIREBASE_* keys are configured.'
  } else if (authLoading) {
    description =
      'Checking your Firebase session before loading cloud-backed tracker data.'
  } else if (user) {
    description = `Your tracker is syncing through Firestore for ${user.email || user.displayName || 'this Google account'}.`
  } else {
    description =
      'Sign in with Google to load your Firestore-backed application data and keep it synced across sessions.'
  }

  return (
    <Container className="page-section">
      <PageHero title="Dashboard" description={description}>
        {!authConfigured ? (
          <Button variant="outline-secondary" disabled>
            Local demo mode
          </Button>
        ) : authLoading ? (
          <Button variant="outline-secondary" disabled>
            Checking session...
          </Button>
        ) : !user ? (
          <Button variant="primary" onClick={signInWithGoogle}>
            Sign in with Google
          </Button>
        ) : null}
      </PageHero>
      {authError ? <Alert variant="danger">{authError}</Alert> : null}
      <StatsBar />
    </Container>
  )
}

export default DashboardPage
