import { Badge } from 'react-bootstrap'

const VARIANT_BY_STATUS = {
  applied: 'primary',
  interviewing: 'warning',
  offer: 'success',
  rejected: 'danger',
  withdrawn: 'secondary',
}

function StatusBadge({ status }) {
  const variant = VARIANT_BY_STATUS[status] ?? 'secondary'
  return <Badge bg={variant}>{status}</Badge>
}

export default StatusBadge
