import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap'

const mockApplications = [
  {
    id: 1,
    company: 'Figma',
    role: 'Product Design Intern',
    jobType: 'Internship',
    dateApplied: '2026-03-10',
    status: 'Applied',
  },
  {
    id: 2,
    company: 'Microsoft',
    role: 'Software Engineer Intern',
    jobType: 'Internship',
    dateApplied: '2026-03-08',
    status: 'Interviewing',
  },
]

function TrackerPage() {
  return (
    <Container className="page-section">
      <section className="page-hero d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3">
        <div>
          <h1>Application Tracker</h1>
          <p>
            This route will become the spreadsheet-style tracker with CRUD,
            search, sorting, filtering, and bookmarking.
          </p>
        </div>
        <Button variant="primary" disabled>
          Add Application
        </Button>
      </section>

      <Row className="g-4">
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="section-title">
                Tracker Preview
              </Card.Title>
              <div className="table-responsive">
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Role</th>
                      <th>Type</th>
                      <th>Date Applied</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockApplications.map((application) => (
                      <tr key={application.id}>
                        <td>{application.company}</td>
                        <td>{application.role}</td>
                        <td>{application.jobType}</td>
                        <td>{application.dateApplied}</td>
                        <td>{application.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="info-card shadow-sm">
            <Card.Body>
              <Card.Title>Phase 1 Status</Card.Title>
              <Card.Text>
                Routing, layout, and Bootstrap styling are in place. The table
                is currently mock data only.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default TrackerPage
