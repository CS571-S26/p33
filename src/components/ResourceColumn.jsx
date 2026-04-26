import { Card, ListGroup } from 'react-bootstrap'
import { BsBoxArrowUpRight } from 'react-icons/bs'

function ResourceColumn({ title, links }) {
  return (
    <Card className="info-card shadow-sm h-100">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
      </Card.Body>
      <ListGroup variant="flush">
        {links.map((item) => (
          <ListGroup.Item
            key={item.label}
            className="d-flex justify-content-between align-items-center gap-3"
          >
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            ) : (
              item.label
            )}
            {item.href ? (
              <BsBoxArrowUpRight className="text-muted flex-shrink-0" aria-hidden />
            ) : null}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  )
}

export default ResourceColumn
