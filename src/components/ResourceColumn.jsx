import { Card, ListGroup } from 'react-bootstrap'

function ResourceColumn({ title, links }) {
  return (
    <Card className="info-card shadow-sm h-100">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
      </Card.Body>
      <ListGroup variant="flush">
        {links.map((item) => (
          <ListGroup.Item key={item.label} className="d-flex">
            {item.href ? (
              <a href={item.href} target="_blank" rel="noopener noreferrer">
                {item.label}
              </a>
            ) : (
              item.label
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  )
}

export default ResourceColumn
