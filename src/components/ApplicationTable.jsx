import { Table } from 'react-bootstrap'
import { BsSortDown, BsSortUp } from 'react-icons/bs'
import ApplicationRow from './ApplicationRow'

function SortHeader({ column, label, sortKey, sortDir, onSort }) {
  const active = sortKey === column

  return (
    <th
      scope="col"
      aria-sort={
        active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
      }
    >
      <button
        type="button"
        className="sort-button"
        onClick={() => onSort(column)}
        aria-label={`Sort by ${label}`}
      >
        {label}{' '}
        {active ? (
          sortDir === 'asc' ? (
            <BsSortUp aria-hidden />
          ) : (
            <BsSortDown aria-hidden />
          )
        ) : null}
      </button>
    </th>
  )
}

function ApplicationTable({
  applications,
  sortKey,
  sortDir,
  onSort,
  onUpdateRow,
  onDeleteRow,
}) {
  if (!applications.length) {
    return (
      <p className="text-muted mb-0">
        No applications match these filters yet - add one or broaden your search.
      </p>
    )
  }

  return (
    <div className="table-responsive">
      <Table striped hover className="align-middle mb-0">
        <caption className="visually-hidden">Application tracker table</caption>
        <thead>
          <tr>
            <th className="app-table-bookmark" scope="col">
              <span className="visually-hidden">Bookmarked</span>
            </th>
            <SortHeader
              column="company"
              label="Company"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
            <SortHeader
              column="role"
              label="Role"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
            <SortHeader
              column="jobType"
              label="Type"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
            <SortHeader
              column="dateApplied"
              label="Date applied"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
            <SortHeader
              column="status"
              label="Status"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={onSort}
            />
            <th scope="col">Notes</th>
            <th scope="col" className="text-end">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <ApplicationRow
              key={application.id}
              application={application}
              onUpdate={onUpdateRow}
              onDelete={onDeleteRow}
            />
          ))}
        </tbody>
      </Table>
    </div>
  )
}

export default ApplicationTable
