import { useCallback, useDeferredValue, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Row,
  Spinner,
} from 'react-bootstrap'
import AddApplicationModal from '../components/AddApplicationModal'
import ApplicationTable from '../components/ApplicationTable'
import FilterBar from '../components/FilterBar'
import PageHero from '../components/PageHero'
import { useAuthContext } from '../context/authContext'
import { useApplicationsContext } from '../context/applicationsContext'

function TrackerPage() {
  const {
    applications,
    addApplication,
    updateApplication,
    removeApplication,
    error,
    isLoading,
    requiresSignIn,
    storageMode,
  } = useApplicationsContext()
  const { authConfigured, authError, authLoading, user, signInWithGoogle } =
    useAuthContext()
  const canManageApplications = !authConfigured || Boolean(user)

  const [modalOpen, setModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [jobTypeFilter, setJobTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const [sortKey, setSortKey] = useState('company')
  const [sortDir, setSortDir] = useState('asc')
  const deferredSearchQuery = useDeferredValue(searchQuery)

  const handleSort = useCallback(
    (column) => {
      if (column === sortKey) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
      } else {
        setSortKey(column)
        setSortDir('asc')
      }
    },
    [sortKey],
  )

  const filtered = useMemo(() => {
    let list = applications

    if (statusFilter !== 'all') {
      list = list.filter((application) => application.status === statusFilter)
    }
    if (jobTypeFilter !== 'all') {
      list = list.filter((application) => application.jobType === jobTypeFilter)
    }
    if (bookmarkedOnly) {
      list = list.filter((application) => application.bookmarked)
    }

    const query = deferredSearchQuery.trim().toLowerCase()
    if (query) {
      list = list.filter(
        (application) =>
          application.company.toLowerCase().includes(query) ||
          application.role.toLowerCase().includes(query),
      )
    }

    const multiplier = sortDir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      const left = a[sortKey] ?? ''
      const right = b[sortKey] ?? ''
      if (left < right) return -1 * multiplier
      if (left > right) return 1 * multiplier
      return 0
    })
  }, [
    applications,
    statusFilter,
    jobTypeFilter,
    bookmarkedOnly,
    deferredSearchQuery,
    sortKey,
    sortDir,
  ])

  let heroDescription =
    'Filter, sort, bookmark, and edit your application list in one place.'

  if (!authConfigured || storageMode === 'local') {
    heroDescription =
      'Firebase is not configured here yet, so the tracker is using local browser storage as a fallback.'
  } else if (user) {
    heroDescription = `Signed in as ${user.email || user.displayName || 'your Google account'}. Your tracker now syncs to Firestore.`
  } else if (requiresSignIn) {
    heroDescription =
      'Sign in with Google to load and sync your application tracker from Firestore.'
  }

  return (
    <Container className="page-section">
      <PageHero title="Application tracker" description={heroDescription}>
        {authLoading && authConfigured ? (
          <Button variant="outline-secondary" disabled>
            Checking session...
          </Button>
        ) : requiresSignIn ? (
          <Button variant="primary" onClick={signInWithGoogle}>
            Sign in with Google
          </Button>
        ) : (
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Add application
          </Button>
        )}
      </PageHero>

      {authError ? <Alert variant="danger">{authError}</Alert> : null}
      {error ? <Alert variant="danger">{error}</Alert> : null}

      {canManageApplications ? (
        <AddApplicationModal
          show={modalOpen}
          onHide={() => setModalOpen(false)}
          onSave={addApplication}
        />
      ) : null}

      {requiresSignIn ? (
        <Card className="info-card shadow-sm">
          <Card.Body>
            <Card.Title>Why sign in?</Card.Title>
            <Card.Text className="small mb-2">
              Google sign-in unlocks Firestore-backed storage so your tracker is
              tied to your account instead of one browser session.
            </Card.Text>
            <Card.Text className="small text-muted mb-0">
              After signing in, you can add, edit, bookmark, and delete rows just
              like before, but the data will persist across reloads.
            </Card.Text>
          </Card.Body>
        </Card>
      ) : isLoading ? (
        <Card className="shadow-sm loading-panel">
          <Card.Body className="d-flex align-items-center gap-3">
            <Spinner animation="border" role="status" />
            <div>
              <Card.Title className="mb-1">Loading applications</Card.Title>
              <Card.Text className="text-muted mb-0">
                Pulling the latest data for your tracker.
              </Card.Text>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <Row className="g-4">
          <Col lg={9}>
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title className="section-title mb-3">Applications</Card.Title>
                <FilterBar
                  statusFilter={statusFilter}
                  jobTypeFilter={jobTypeFilter}
                  searchQuery={searchQuery}
                  bookmarkedOnly={bookmarkedOnly}
                  onStatusFilterChange={setStatusFilter}
                  onJobTypeFilterChange={setJobTypeFilter}
                  onSearchQueryChange={setSearchQuery}
                  onBookmarkedOnlyChange={setBookmarkedOnly}
                />
                {applications.length === 0 ? (
                  <p className="text-muted mb-0">
                    No applications yet - add your first one.
                  </p>
                ) : (
                  <ApplicationTable
                    applications={filtered}
                    sortKey={sortKey}
                    sortDir={sortDir}
                    onSort={handleSort}
                    onUpdateRow={updateApplication}
                    onDeleteRow={removeApplication}
                  />
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={3}>
            <Card className="info-card shadow-sm">
              <Card.Body>
                <Card.Title>Sync details</Card.Title>
                <Card.Text className="small mb-2">
                  {storageMode === 'cloud' && user
                    ? `This tracker is currently syncing through Firestore for ${user.email || user.displayName || 'your Google account'}.`
                    : 'This tracker is currently using local storage in the browser.'}
                </Card.Text>
                <Card.Text className="small text-muted mb-0">
                  Use the star column for priority roles. Combine filters with
                  search to narrow a longer list.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  )
}

export default TrackerPage
