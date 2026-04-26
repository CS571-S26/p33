import { Col, Form, InputGroup, Row } from 'react-bootstrap'
import { BsSearch } from 'react-icons/bs'
import {
  APPLICATION_STATUSES,
  JOB_TYPES,
  formatStatusLabel,
} from '../constants/applications'

function FilterBar({
  statusFilter,
  jobTypeFilter,
  searchQuery,
  bookmarkedOnly,
  onStatusFilterChange,
  onJobTypeFilterChange,
  onSearchQueryChange,
  onBookmarkedOnlyChange,
}) {
  return (
    <Row className="g-2 mb-3 align-items-end">
      <Form.Group as={Col} sm={6} lg={3} controlId="filter-status">
        <Form.Label className="small text-muted mb-1">Status</Form.Label>
        <Form.Select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
        >
          <option value="all">All statuses</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {formatStatusLabel(s)}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group as={Col} sm={6} lg={3} controlId="filter-job-type">
        <Form.Label className="small text-muted mb-1">Job type</Form.Label>
        <Form.Select
          value={jobTypeFilter}
          onChange={(e) => onJobTypeFilterChange(e.target.value)}
        >
          <option value="all">All types</option>
          {JOB_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
      <Form.Group as={Col} sm={12} lg={4} controlId="filter-search">
        <Form.Label className="small text-muted mb-1">Search</Form.Label>
        <InputGroup>
          <InputGroup.Text className="bg-white" aria-hidden>
            <BsSearch aria-hidden />
          </InputGroup.Text>
          <Form.Control
            type="search"
            placeholder="Company or role"
            aria-label="Search by company or role"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
          />
        </InputGroup>
      </Form.Group>
      <Col sm={12} lg={2}>
        <Form.Check
          type="switch"
          id="filter-bookmarked"
          className="mt-4 mt-lg-2"
          label="Starred only"
          checked={bookmarkedOnly}
          onChange={(e) => onBookmarkedOnlyChange(e.target.checked)}
        />
      </Col>
    </Row>
  )
}

export default FilterBar
