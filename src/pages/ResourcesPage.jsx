import { Col, Container, Row } from 'react-bootstrap'
import PageHero from '../components/PageHero'
import ResourceColumn from '../components/ResourceColumn'

const JOB_BOARD_LINKS = [
  { label: 'Handshake', href: 'https://joinhandshake.com/' },
  { label: 'LinkedIn Jobs', href: 'https://www.linkedin.com/jobs/' },
  { label: 'Indeed', href: 'https://www.indeed.com/' },
  { label: 'Levels.fyi', href: 'https://www.levels.fyi/' },
]

const RESUME_LINKS = [
  {
    label: 'One-page resume basics',
    href: 'https://www.themuse.com/advice/43-resume-tips',
  },
  {
    label: 'Action verbs for bullet points',
    href: 'https://old.gmu.edu/public/english/englishdepartment/careers/resume_guide/verbs.pdf',
  },
  {
    label: 'Portfolio / GitHub polish',
    href: 'https://docs.github.com/en/get-started',
  },
]

const INTERVIEW_LINKS = [
  {
    label: 'Pramp — mock interviews',
    href: 'https://www.pramp.com/',
  },
  {
    label: 'LeetCode — technical practice',
    href: 'https://leetcode.com/',
  },
  {
    label: 'STAR method overview',
    href: 'https://www.themuse.com/advice/star-interview-method',
  },
]

const NETWORKING_LINKS = [
  {
    label: 'Informational interview guide',
    href: 'https://www.indeed.com/career-advice/interviewing/guide-to-informational-Interviews',
  },
  {
    label: 'LinkedIn outreach templates',
    href: 'https://www.linkedin.com/business/talent/blog/product-tips/candidate-outreach-best-practices',
  },
  {
    label: 'Career fair follow-ups',
    href: 'https://www.themuse.com/advice/job-fair-follow-up-emails',
  },
]

function ResourcesPage() {
  return (
    <Container className="page-section">
      <PageHero
        title="Resources"
        description="Static job boards, resume tips, interview prep, and networking ideas — swap in your school's career center links anytime."
      />

      <Row className="g-4 mb-4">
        <Col md={6}>
          <ResourceColumn title="Job boards" links={JOB_BOARD_LINKS} />
        </Col>
        <Col md={6}>
          <ResourceColumn title="Resume tips" links={RESUME_LINKS} />
        </Col>
      </Row>
      <Row className="g-4">
        <Col md={6}>
          <ResourceColumn title="Interview prep" links={INTERVIEW_LINKS} />
        </Col>
        <Col md={6}>
          <ResourceColumn
            title="Networking advice"
            links={NETWORKING_LINKS}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default ResourcesPage
