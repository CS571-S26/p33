import { Col, Row } from 'react-bootstrap'
import StatCard from './StatCard'
import { useApplicationsContext } from '../context/applicationsContext'

function StatsBar() {
  const { stats } = useApplicationsContext()

  return (
    <Row className="g-4">
      <Col md={4}>
        <StatCard
          title="Total applications"
          value={stats.total}
          description="Everything currently loaded into the tracker."
        />
      </Col>
      <Col md={4}>
        <StatCard
          title="Response rate"
          value={`${stats.responseRate}%`}
          description="Share of applications that reached interviewing, an offer, or a rejection."
        />
      </Col>
      <Col md={4}>
        <StatCard
          title="Offers"
          value={stats.offers}
          description='Count of rows with status "offer".'
        />
      </Col>
    </Row>
  )
}

export default StatsBar
