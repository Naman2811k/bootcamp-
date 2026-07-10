import React, { useState } from 'react';

export default function DeleteModal({ isOpen, employee, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen || !employee) return null;

  async function handleConfirm() {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal delete-modal">
        <div className="delete-icon-wrap">⚠️</div>
        <h2 className="delete-title">Delete Employee?</h2>
        <p className="delete-desc">
          Are you sure you want to remove{' '}
          <span className="delete-name">{employee.name}</span> from the system?
          <br />
          This action cannot be undone.
        </p>

        <div className="form-actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={deleting}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleConfirm} disabled={deleting}>
            {deleting ? '⏳ Deleting…' : '🗑️ Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
