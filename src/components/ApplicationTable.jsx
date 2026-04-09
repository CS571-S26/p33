import { Table } from 'react-bootstrap'
import { BsSortDown, BsSortUp } from 'react-icons/bs'
import ApplicationRow from './ApplicationRow'

function SortHeader({ column, label, sortKey, sortDir, onSort }) {
  const active = sortKey === column
  return (
    <th
      role="columnheader"
      aria-sort={
        active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'
      }
      className="user-select-none app-table-sort"
      onClick={() => onSort(column)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSort(column)
        }
      }}
      tabIndex={0}
    >
      <span className="d-inline-flex align-items-center gap-1">
        {label}{' '}
        {active ? (
          sortDir === 'asc' ? (
            <BsSortUp aria-hidden />
          ) : (
            <BsSortDown aria-hidden />
          )
        ) : null}
      </span>
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
        No applications match these filters yet — add one or broaden your search.
      </p>
    )
  }

  return (
    <div className="table-responsive">
      <Table striped hover className="align-middle mb-0">
        <thead>
          <tr>
            <th className="app-table-bookmark" scope="col">
              {/* bookmark */}
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
