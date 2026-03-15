import { Card, Col, Container, ListGroup, Row } from 'react-bootstrap'

function ResourcesPage() {
  return (
    <Container className="page-section">
      <section className="page-hero">
        <h1>Resources</h1>
        <p>
          Recruiting resources, resume help, and
          interview prep links. (I was running out of ideas for a third page)
        </p>
      </section>

      <Row className="g-4">
        <Col md={6}>
          <Card className="info-card shadow-sm">
            <Card.Body>
              <Card.Title>Job Boards</Card.Title>
            </Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>Handshake</ListGroup.Item>
              <ListGroup.Item>LinkedIn Jobs</ListGroup.Item>
              <ListGroup.Item>Indeed</ListGroup.Item>
              <ListGroup.Item>Levels.fyi</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="info-card shadow-sm">
            <Card.Body>
              <Card.Title>Interview Prep</Card.Title>
            </Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>Behavioral question practice</ListGroup.Item>
              <ListGroup.Item>Resume review checklist</ListGroup.Item>
              <ListGroup.Item>Mock interview scheduling</ListGroup.Item>
              <ListGroup.Item>Networking outreach tips</ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default ResourcesPage
