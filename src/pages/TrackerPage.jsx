import { useCallback, useMemo, useState } from 'react'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import AddApplicationModal from '../components/AddApplicationModal'
import ApplicationTable from '../components/ApplicationTable'
import FilterBar from '../components/FilterBar'
import PageHero from '../components/PageHero'
import { useApplicationsContext } from '../context/applicationsContext'

function TrackerPage() {
  const {
    applications,
    addApplication,
    updateApplication,
    removeApplication,
  } = useApplicationsContext()

  const [modalOpen, setModalOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [jobTypeFilter, setJobTypeFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [bookmarkedOnly, setBookmarkedOnly] = useState(false)
  const [sortKey, setSortKey] = useState('company')
  const [sortDir, setSortDir] = useState('asc')

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
      list = list.filter((a) => a.status === statusFilter)
    }
    if (jobTypeFilter !== 'all') {
      list = list.filter((a) => a.jobType === jobTypeFilter)
    }
    if (bookmarkedOnly) {
      list = list.filter((a) => a.bookmarked)
    }

    const q = searchQuery.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (a) =>
          a.company.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q),
      )
    }

    const mult = sortDir === 'asc' ? 1 : -1
    return [...list].sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      if (av < bv) return -1 * mult
      if (av > bv) return 1 * mult
      return 0
    })
  }, [
    applications,
    statusFilter,
    jobTypeFilter,
    bookmarkedOnly,
    searchQuery,
    sortKey,
    sortDir,
  ])

  return (
    <Container className="page-section">
      <PageHero
        title="Application tracker"
        description="Your list is saved in this browser for now. Filter, sort, star favorites, and edit rows in place. Hooking up Firebase is the next backend step."
      >
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Add application
        </Button>
      </PageHero>

      <AddApplicationModal
        show={modalOpen}
        onHide={() => setModalOpen(false)}
        onSave={addApplication}
      />

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
                  No applications yet — add your first one!
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
              <Card.Title>Tips</Card.Title>
              <Card.Text className="small">
                Use the star column for roles you want to revisit. Combine filters
                with search to narrow a long list. Firebase wiring lives in{' '}
                <code>src/firebase/</code> when you are ready to sync to the cloud
                (set <code>VITE_FIREBASE_*</code> keys locally; do not commit them).
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default TrackerPage
