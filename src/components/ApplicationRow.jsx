import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'
import {
  APPLICATION_STATUSES,
  JOB_TYPES,
  formatStatusLabel,
} from '../constants/applications'
import BookmarkButton from './BookmarkButton'
import StatusBadge from './StatusBadge'

function ApplicationRow({ application, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const startEdit = () => {
    setDraft({
      company: application.company,
      role: application.role,
      jobType: application.jobType,
      dateApplied: application.dateApplied,
      status: application.status,
      notes: application.notes ?? '',
    })
    setEditing(true)
  }

  const cancelEdit = () => {
    setDraft(null)
    setEditing(false)
  }

  const saveEdit = () => {
    if (!draft) return
    onUpdate(application.id, {
      company: draft.company.trim(),
      role: draft.role.trim(),
      jobType: draft.jobType,
      dateApplied: draft.dateApplied,
      status: draft.status,
      notes: draft.notes.trim(),
    })
    cancelEdit()
  }

  const toggleBookmark = () => {
    onUpdate(application.id, { bookmarked: !application.bookmarked })
  }

  if (editing && draft) {
    return (
      <tr>
        <td>
          <BookmarkButton
            bookmarked={application.bookmarked}
            onToggle={toggleBookmark}
          />
        </td>
        <td>
          <Form.Control
            size="sm"
            value={draft.company}
            onChange={(e) =>
              setDraft((d) => ({ ...d, company: e.target.value }))
            }
          />
        </td>
        <td>
          <Form.Control
            size="sm"
            value={draft.role}
            onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))}
          />
        </td>
        <td>
          <Form.Select
            size="sm"
            value={draft.jobType}
            onChange={(e) =>
              setDraft((d) => ({ ...d, jobType: e.target.value }))
            }
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Form.Select>
        </td>
        <td>
          <Form.Control
            size="sm"
            type="date"
            value={draft.dateApplied}
            onChange={(e) =>
              setDraft((d) => ({ ...d, dateApplied: e.target.value }))
            }
          />
        </td>
        <td>
          <Form.Select
            size="sm"
            value={draft.status}
            onChange={(e) =>
              setDraft((d) => ({ ...d, status: e.target.value }))
            }
          >
            {APPLICATION_STATUSES.map((s) => (
              <option key={s} value={s}>
                {formatStatusLabel(s)}
              </option>
            ))}
          </Form.Select>
        </td>
        <td>
          <Form.Control
            as="textarea"
            rows={2}
            size="sm"
            value={draft.notes}
            onChange={(e) =>
              setDraft((d) => ({ ...d, notes: e.target.value }))
            }
          />
        </td>
        <td className="text-nowrap text-end">
          <Button
            variant="success"
            size="sm"
            className="me-1"
            type="button"
            onClick={saveEdit}
          >
            Save
          </Button>
          <Button variant="outline-secondary" size="sm" type="button" onClick={cancelEdit}>
            Cancel
          </Button>
        </td>
      </tr>
    )
  }

  return (
    <>
      <tr>
        <td>
          <BookmarkButton bookmarked={application.bookmarked} onToggle={toggleBookmark} />
        </td>
        <td>{application.company}</td>
        <td>{application.role}</td>
        <td>{application.jobType}</td>
        <td>{application.dateApplied}</td>
        <td>
          <StatusBadge status={application.status} />
        </td>
        <td className="small text-muted">{application.notes || '—'}</td>
        <td className="text-nowrap text-end">
          <Button
            variant="outline-primary"
            size="sm"
            className="me-1"
            type="button"
            onClick={startEdit}
          >
            Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            type="button"
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </Button>
        </td>
      </tr>
      <Modal show={confirmDelete} onHide={() => setConfirmDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete application?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Remove <strong>{application.company}</strong> — {application.role} from your tracker?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setConfirmDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onDelete(application.id)
              setConfirmDelete(false)
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ApplicationRow
