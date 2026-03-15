import { Card, Col, Container, Row } from 'react-bootstrap'

function DashboardPage() {
  return (
    <Container className="page-section">
      <section className="page-hero">
        <h1>Dashboard</h1>
        <p>
          Track your recruiting season in one place with live stats, recent
          activity, and quick access to your application workflow.
        </p>
      </section>

      <Row className="g-4">
        <Col md={4}>
          <Card className="info-card shadow-sm">
            <Card.Body>
              <Card.Title>Total Applications</Card.Title>
              <Card.Text>
                A live stat card will go here in Phase 2 once Firestore is
                connected.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="info-card shadow-sm">
            <Card.Body>
              <Card.Title>Response Rate</Card.Title>
              <Card.Text>
                This will summarize how many applications have moved beyond the
                applied stage.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="info-card shadow-sm">
            <Card.Body>
              <Card.Title>Offers</Card.Title>
              <Card.Text>
                The final stat card will highlight offers so students can see
                progress at a glance.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default DashboardPage
