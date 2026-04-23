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
  const [isSaving, setIsSaving] = useState(false)
  const [rowError, setRowError] = useState('')

  const startEdit = () => {
    setRowError('')
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
    setRowError('')
    setDraft(null)
    setEditing(false)
  }

  const saveEdit = async () => {
    if (!draft) return

    if (!draft.company.trim() || !draft.role.trim() || !draft.dateApplied) {
      setRowError('Company, role, and date applied are required.')
      return
    }

    setIsSaving(true)
    setRowError('')

    try {
      const didSave = await onUpdate(application.id, {
        company: draft.company.trim(),
        role: draft.role.trim(),
        jobType: draft.jobType,
        dateApplied: draft.dateApplied,
        status: draft.status,
        notes: draft.notes.trim(),
      })

      if (didSave) {
        cancelEdit()
      } else {
        setRowError('Could not save your changes. Please try again.')
      }
    } catch {
      setRowError('Could not save your changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleBookmark = async () => {
    setRowError('')
    const didUpdate = await onUpdate(application.id, {
      bookmarked: !application.bookmarked,
    })
    if (!didUpdate) {
      setRowError('Could not update the bookmark right now.')
    }
  }

  if (editing && draft) {
    return (
      <>
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
              disabled={isSaving}
              value={draft.company}
              onChange={(e) =>
                setDraft((d) => ({ ...d, company: e.target.value }))
              }
            />
          </td>
          <td>
            <Form.Control
              size="sm"
              disabled={isSaving}
              value={draft.role}
              onChange={(e) =>
                setDraft((d) => ({ ...d, role: e.target.value }))
              }
            />
          </td>
          <td>
            <Form.Select
              size="sm"
              disabled={isSaving}
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
              disabled={isSaving}
              value={draft.dateApplied}
              onChange={(e) =>
                setDraft((d) => ({ ...d, dateApplied: e.target.value }))
              }
            />
          </td>
          <td>
            <Form.Select
              size="sm"
              disabled={isSaving}
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
              disabled={isSaving}
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
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              type="button"
              onClick={cancelEdit}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </td>
        </tr>
        {rowError ? (
          <tr className="app-table-error-row">
            <td colSpan={8} className="small text-danger">
              {rowError}
            </td>
          </tr>
        ) : null}
      </>
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
        <td className="small text-muted">{application.notes || '-'}</td>
        <td className="text-nowrap text-end">
          <Button
            variant="outline-primary"
            size="sm"
            className="me-1"
            type="button"
            onClick={startEdit}
            disabled={isSaving}
          >
            Edit
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={isSaving}
          >
            Delete
          </Button>
        </td>
      </tr>
      {rowError ? (
        <tr className="app-table-error-row">
          <td colSpan={8} className="small text-danger">
            {rowError}
          </td>
        </tr>
      ) : null}
      <Modal show={confirmDelete} onHide={() => setConfirmDelete(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete application?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Remove <strong>{application.company}</strong> - {application.role} from your tracker?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => setConfirmDelete(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={isSaving}
            onClick={async () => {
              setIsSaving(true)
              setRowError('')

              try {
                const didDelete = await onDelete(application.id)
                if (didDelete) {
                  setConfirmDelete(false)
                } else {
                  setRowError('Could not delete this application right now.')
                }
              } catch {
                setRowError('Could not delete this application right now.')
              } finally {
                setIsSaving(false)
              }
            }}
          >
            {isSaving ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default ApplicationRow
