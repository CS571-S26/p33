import { Container } from 'react-bootstrap'
import PageHero from '../components/PageHero'
import StatsBar from '../components/StatsBar'

function DashboardPage() {
  return (
    <Container className="page-section">
      <PageHero
        title="Dashboard"
        description="Live stats from your application list: totals, response rate (interviewing + offer + rejected over all rows), and offers."
      />
      <StatsBar />
    </Container>
  )
}

export default DashboardPage
