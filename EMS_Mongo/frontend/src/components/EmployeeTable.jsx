import React, { useState, useMemo } from 'react';

const DEPT_COLORS = {
  IT:         'dept-IT',
  HR:         'dept-HR',
  Marketing:  'dept-Marketing',
  Finance:    'dept-Finance',
  Operations: 'dept-Operations',
  Sales:      'dept-Sales',
};

function getInitials(name = '') {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function formatSalary(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN');
}

function getEmployeeId(emp) {
  return emp._id || emp.id;
}

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const departments = useMemo(
    () => [...new Set(employees.map((e) => e.department))].sort(),
    [employees]
  );

  const filtered = useMemo(() => {
    let data = employees;
    if (search)     data = data.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
    if (deptFilter) data = data.filter((e) => e.department === deptFilter);
    return data;
  }, [employees, search, deptFilter]);

  return (
    <div className="card">
      {/* Card Header */}
      <div className="card-header">
        <h2 className="card-title">
          All Employees
          <span style={{ marginLeft: 10, fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>
            ({filtered.length})
          </span>
        </h2>
        <div className="card-controls">
          <input
            className="search-input"
            type="text"
            placeholder="🔍 Search by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No employees found</div>
            <div className="empty-desc">
              Try adjusting your search or filter
            </div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={getEmployeeId(emp)}>
                  <td>
                    <div className="emp-cell">
                      <div className="emp-avatar">{getInitials(emp.name)}</div>
                      <div>
                        <div className="emp-name">{emp.name}</div>
                        <div className="emp-id">ID #{getEmployeeId(emp)}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`dept-pill ${DEPT_COLORS[emp.department] || 'dept-default'}`}>
                      {emp.department}
                    </span>
                  </td>
                  <td>
                    <span className="salary">{formatSalary(emp.salary)}</span>
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="action-btn edit"
                        title="Edit"
                        onClick={() => onEdit(emp)}
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete"
                        title="Delete"
                        onClick={() => onDelete(emp)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
