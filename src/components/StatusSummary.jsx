import { Card, ListGroup } from 'react-bootstrap'
import {
  APPLICATION_STATUSES,
  formatStatusLabel,
} from '../constants/applications'
import { useApplicationsContext } from '../context/applicationsContext'
import StatusBadge from './StatusBadge'

function StatusSummary() {
  const { applications } = useApplicationsContext()

  const counts = APPLICATION_STATUSES.map((status) => ({
    status,
    count: applications.filter((application) => application.status === status)
      .length,
  }))

  return (
    <Card className="info-card">
      <Card.Body>
        <Card.Title as="h2" className="h5">
          Status breakdown
        </Card.Title>
        <Card.Text className="text-muted small">
          A quick view of where applications currently stand.
        </Card.Text>
      </Card.Body>
      <ListGroup variant="flush" className="summary-list">
        {counts.map(({ status, count }) => (
          <ListGroup.Item
            key={status}
            className="d-flex align-items-center justify-content-between gap-3"
          >
            <StatusBadge status={status} />
            <span aria-label={`${count} ${formatStatusLabel(status)} applications`}>
              {count}
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  )
}

export default StatusSummary
