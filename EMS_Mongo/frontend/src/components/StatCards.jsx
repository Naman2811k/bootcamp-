import React, { useMemo } from 'react';

const STAT_DEFS = [
  {
    key: 'total',
    label: 'Total Employees',
    icon: '👥',
    iconClass: 'purple',
    format: (v) => v,
  },
  {
    key: 'departments',
    label: 'Departments',
    icon: '🏬',
    iconClass: 'blue',
    format: (v) => v,
  },
  {
    key: 'avgSalary',
    label: 'Avg. Salary',
    icon: '💰',
    iconClass: 'green',
    format: (v) =>
      '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 }),
  },
  {
    key: 'topSalary',
    label: 'Highest Salary',
    icon: '🏆',
    iconClass: 'amber',
    format: (v) =>
      '₹' + Number(v).toLocaleString('en-IN', { maximumFractionDigits: 0 }),
  },
];

export default function StatCards({ employees }) {
  const stats = useMemo(() => {
    if (!employees.length) return { total: 0, departments: 0, avgSalary: 0, topSalary: 0 };
    const total = employees.length;
    const departments = new Set(employees.map((e) => e.department)).size;
    const avgSalary = employees.reduce((s, e) => s + e.salary, 0) / total;
    const topSalary = Math.max(...employees.map((e) => e.salary));
    return { total, departments, avgSalary, topSalary };
  }, [employees]);

  return (
    <div className="stats-grid">
      {STAT_DEFS.map((def, i) => (
        <div className="stat-card" key={def.key} style={{ animationDelay: `${i * 0.07}s` }}>
          <div className={`stat-icon ${def.iconClass}`}>{def.icon}</div>
          <div className="stat-info">
            <div className="stat-value">{def.format(stats[def.key])}</div>
            <div className="stat-label">{def.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
