import { Card } from 'react-bootstrap'

function StatCard({ title, value, description }) {
  return (
    <Card className="info-card shadow-sm">
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        {value != null && value !== '' ? (
          <Card.Text className="display-6 fs-2 stat-card-value mb-2">
            {value}
          </Card.Text>
        ) : null}
        {description ? <Card.Text className="text-muted">{description}</Card.Text> : null}
      </Card.Body>
    </Card>
  )
}

export default StatCard
