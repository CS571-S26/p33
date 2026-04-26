import { Card, ListGroup } from 'react-bootstrap'
import { useApplicationsContext } from '../context/applicationsContext'
import StatusBadge from './StatusBadge'

function PriorityList() {
  const { applications } = useApplicationsContext()
  const priorityApplications = applications
    .filter((application) => application.bookmarked)
    .slice(0, 4)

  return (
    <Card className="info-card">
      <Card.Body>
        <Card.Title as="h2" className="h5">
          Starred applications
        </Card.Title>
        <Card.Text className="text-muted small">
          Roles marked as important in the tracker.
        </Card.Text>
      </Card.Body>
      {priorityApplications.length ? (
        <ListGroup variant="flush">
          {priorityApplications.map((application) => (
            <ListGroup.Item
              key={application.id}
              className="d-flex align-items-center justify-content-between gap-3"
            >
              <span>
                <span className="priority-company">{application.company}</span>
                <span className="priority-role">{application.role}</span>
              </span>
              <StatusBadge status={application.status} />
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <Card.Body className="pt-0">
          <p className="text-muted small mb-0">
            Star an application from the Applications page to keep it here.
          </p>
        </Card.Body>
      )}
    </Card>
  )
}

export default PriorityList
