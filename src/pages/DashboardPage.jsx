import { Alert, Col, Container, Row } from 'react-bootstrap'
import PageHero from '../components/PageHero'
import PriorityList from '../components/PriorityList'
import StatsBar from '../components/StatsBar'
import StatusSummary from '../components/StatusSummary'
import { useAuthContext } from '../context/authContext'
import { useApplicationsContext } from '../context/applicationsContext'

function DashboardPage() {
  const {
    authConfigured,
    authError,
    authLoading,
    user,
  } = useAuthContext()
  const { storageMode } = useApplicationsContext()

  let description =
    'Live stats from your application list: totals, response rate, and offers.'

  if (authConfigured && authLoading) {
    description =
      'Checking your Firebase session before loading tracker data.'
  } else if (storageMode === 'local') {
    description =
      authConfigured
        ? 'Use the tracker in local demo mode now, or sign in with Google to sync your applications through Firestore.'
        : 'This build is using local demo mode because Firebase keys are not configured.'
  } else if (user) {
    description = `Your tracker is syncing through Firestore for ${user.email || user.displayName || 'this Google account'}.`
  } else {
    description =
      'Sign in with Google to load your Firestore-backed application data and keep it synced across sessions.'
  }

  return (
    <Container className="page-section">
      <PageHero title="Dashboard" description={description} />
      {authError ? <Alert variant="danger">{authError}</Alert> : null}
      <StatsBar />
      <Row className="g-4 mt-1">
        <Col lg={5}>
          <StatusSummary />
        </Col>
        <Col lg={7}>
          <PriorityList />
        </Col>
      </Row>
    </Container>
  )
}

export default DashboardPage
