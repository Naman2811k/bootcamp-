import React, { useState, useEffect } from 'react';

const DEPARTMENTS = ['IT', 'HR', 'Marketing', 'Finance', 'Operations', 'Sales'];

const EMPTY_FORM = { name: '', department: '', salary: '' };

export default function EmployeeModal({ isOpen, mode, employee, onClose, onSave }) {
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (mode === 'edit' && employee) {
      setForm({
        name:       employee.name,
        department: employee.department,
        salary:     String(employee.salary),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [mode, employee, isOpen]);

  if (!isOpen) return null;

  function validate() {
    const errs = {};
    if (!form.name.trim())       errs.name       = 'Name is required';
    if (!form.department)        errs.department  = 'Department is required';
    if (!form.salary)            errs.salary      = 'Salary is required';
    else if (isNaN(Number(form.salary)) || Number(form.salary) <= 0)
      errs.salary = 'Salary must be a positive number';
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    try {
      await onSave({
        name:       form.name.trim(),
        department: form.department,
        salary:     Number(form.salary),
      });
    } finally {
      setSaving(false);
    }
  }

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'add' ? '➕ Add Employee' : '✏️ Edit Employee'}
          </h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              className={`form-input ${errors.name ? 'error' : ''}`}
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          {/* Department */}
          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              className={`form-select ${errors.department ? 'error' : ''}`}
              value={form.department}
              onChange={(e) => handleChange('department', e.target.value)}
            >
              <option value="">Select department…</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.department && <p className="form-error">{errors.department}</p>}
          </div>

          {/* Salary */}
          <div className="form-group">
            <label className="form-label">Salary (₹)</label>
            <input
              className={`form-input ${errors.salary ? 'error' : ''}`}
              type="number"
              placeholder="e.g. 50000"
              min="1"
              value={form.salary}
              onChange={(e) => handleChange('salary', e.target.value)}
            />
            {errors.salary && <p className="form-error">{errors.salary}</p>}
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? '⏳ Saving…' : mode === 'add' ? '➕ Add Employee' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
