import { Col, Row } from 'react-bootstrap'
import { useAuthContext } from '../context/authContext'
import StatCard from './StatCard'
import { useApplicationsContext } from '../context/applicationsContext'

function StatsBar() {
  const { stats, storageMode } = useApplicationsContext()
  const { authConfigured, authLoading, user } = useAuthContext()

  let syncValue = 'Local demo'
  let syncDescription = 'This tracker is saving application data in local storage.'

  if (authConfigured && authLoading) {
    syncValue = 'Checking...'
    syncDescription = 'Looking up your Firebase session before loading tracker data.'
  } else if (authConfigured && user) {
    syncValue = 'Cloud sync'
    syncDescription = `Connected to Firestore as ${user.email || user.displayName || 'your Google account'}.`
  } else if (authConfigured && storageMode === 'local') {
    syncValue = 'Local demo'
    syncDescription = 'Sign in with Google when you want to sync through Firestore.'
  }

  return (
    <Row className="g-4">
      <Col md={6} xl={3}>
        <StatCard
          title="Total applications"
          value={stats.total}
          description="Everything currently loaded into the tracker."
        />
      </Col>
      <Col md={6} xl={3}>
        <StatCard
          title="Response rate"
          value={`${stats.responseRate}%`}
          description="Share of applications that reached interviewing, an offer, or a rejection."
        />
      </Col>
      <Col md={6} xl={3}>
        <StatCard
          title="Offers"
          value={stats.offers}
          description='Count of rows with status "offer".'
        />
      </Col>
      <Col md={6} xl={3}>
        <StatCard
          title="Sync status"
          value={syncValue}
          description={syncDescription}
        />
      </Col>
    </Row>
  )
}

export default StatsBar
