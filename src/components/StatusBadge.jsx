import { formatStatusLabel } from '../constants/applications'

function StatusBadge({ status }) {
  const safeStatus = status || 'applied'
  return (
    <span className={`status-badge status-badge--${safeStatus}`}>
      {formatStatusLabel(safeStatus)}
    </span>
  )
}

export default StatusBadge
