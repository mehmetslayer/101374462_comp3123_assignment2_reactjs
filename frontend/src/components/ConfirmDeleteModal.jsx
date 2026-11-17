import { Button, Modal, Spinner } from 'react-bootstrap';

export default function ConfirmDeleteModal({ name, show, deleting, onConfirm, onCancel }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete <strong>{name}</strong>? This cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel} disabled={deleting}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={deleting}>
          {deleting ? <Spinner size="sm" animation="border" /> : 'Delete'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}