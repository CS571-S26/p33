import { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import {
  APPLICATION_STATUSES,
  JOB_TYPES,
  formatStatusLabel,
} from '../constants/applications'

const emptyForm = {
  company: '',
  role: '',
  jobType: 'Internship',
  dateApplied: '',
  status: 'applied',
  notes: '',
}

function AddApplicationModal({ show, onHide, onSave }) {
  const [form, setForm] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.company.trim() || !form.role.trim() || !form.dateApplied) return

    setIsSaving(true)
    setSubmitError('')

    try {
      const didSave = await onSave(form)
      if (didSave) {
        setForm(emptyForm)
        onHide()
      } else {
        setSubmitError('Could not save this application. Please try again.')
      }
    } catch {
      setSubmitError('Could not save this application. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    if (isSaving) return
    setForm(emptyForm)
    setSubmitError('')
    onHide()
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop={isSaving ? 'static' : true}
      keyboard={!isSaving}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add application</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body className="d-flex flex-column gap-3">
          {submitError ? <Alert variant="danger">{submitError}</Alert> : null}
          <Form.Group controlId="add-company">
            <Form.Label>Company</Form.Label>
            <Form.Control
              required
              disabled={isSaving}
              value={form.company}
              onChange={(e) =>
                setForm((f) => ({ ...f, company: e.target.value }))
              }
              placeholder="e.g. Acme Corp"
            />
          </Form.Group>
          <Form.Group controlId="add-role">
            <Form.Label>Role</Form.Label>
            <Form.Control
              required
              disabled={isSaving}
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              placeholder="e.g. Software Engineer Intern"
            />
          </Form.Group>
          <Form.Group controlId="add-type">
            <Form.Label>Job type</Form.Label>
            <Form.Select
              disabled={isSaving}
              value={form.jobType}
              onChange={(e) =>
                setForm((f) => ({ ...f, jobType: e.target.value }))
              }
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="add-date">
            <Form.Label>Date applied</Form.Label>
            <Form.Control
              required
              type="date"
              disabled={isSaving}
              value={form.dateApplied}
              onChange={(e) =>
                setForm((f) => ({ ...f, dateApplied: e.target.value }))
              }
            />
          </Form.Group>
          <Form.Group controlId="add-status">
            <Form.Label>Status</Form.Label>
            <Form.Select
              disabled={isSaving}
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value }))
              }
            >
              {APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {formatStatusLabel(s)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="add-notes">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              disabled={isSaving}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="Interview contacts, links, follow-ups..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            type="button"
            onClick={handleClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default AddApplicationModal
