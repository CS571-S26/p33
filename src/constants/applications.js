/** @typedef {'applied'|'interviewing'|'offer'|'rejected'|'withdrawn'} ApplicationStatus */

export const APPLICATION_STATUSES = [
  'applied',
  'interviewing',
  'offer',
  'rejected',
  'withdrawn',
]

export const JOB_TYPES = [
  'Internship',
  'Full-time',
  'Part-time',
  'Co-op',
  'Contract',
]

const LEGACY_STATUS = {
  Applied: 'applied',
  Interviewing: 'interviewing',
  Offer: 'offer',
  Rejected: 'rejected',
  Withdrawn: 'withdrawn',
}

export function normalizeStatus(value) {
  if (value == null) return 'applied'
  if (LEGACY_STATUS[value] != null) return LEGACY_STATUS[value]
  const lower = String(value).toLowerCase()
  return APPLICATION_STATUSES.includes(lower) ? lower : 'applied'
}

export function formatStatusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1)
}
