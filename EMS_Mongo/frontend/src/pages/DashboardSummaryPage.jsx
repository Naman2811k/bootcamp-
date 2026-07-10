import React, { useState, useEffect } from 'react';
import api from '../api/axiosInstance';

function MetricCard({ icon, iconClass, label, value, sub, delay }) {
  return (
    <div className="stat-card" style={{ animationDelay: `${delay}s` }}>
      <div className={`stat-icon ${iconClass}`}>{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
      </div>
    </div>
  );
}

const DEPT_COLORS = {
  IT:         { bg: '#eff6ff', color: '#2563eb', bar: '#2563eb' },
  HR:         { bg: '#faf5ff', color: '#7c3aed', bar: '#7c3aed' },
  Marketing:  { bg: '#f0fdf4', color: '#15803d', bar: '#15803d' },
  Finance:    { bg: '#fffbeb', color: '#d97706', bar: '#d97706' },
  Operations: { bg: '#fff1f2', color: '#e11d48', bar: '#e11d48' },
  Sales:      { bg: '#f0fdfa', color: '#0d9488', bar: '#0d9488' },
};

function normalizeEmployee(employee) {
  return {
    ...employee,
    id: employee._id || employee.id,
  };
}

export default function DashboardSummaryPage() {
  const [employees, setEmployees] = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    api.get('/').then(({ data }) => {
      setEmployees((data.data || []).map(normalizeEmployee));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner" />
        <p className="spinner-text">Loading dashboard…</p>
      </div>
    );
  }

  const total    = employees.length;
  const avgSal   = total ? Math.round(employees.reduce((s, e) => s + e.salary, 0) / total) : 0;
  const topSal   = total ? Math.max(...employees.map(e => e.salary)) : 0;
  const deptMap  = employees.reduce((acc, e) => {
    acc[e.department] = (acc[e.department] || 0) + 1;
    return acc;
  }, {});
  const depts      = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);
  const topDept    = depts[0]?.[0] || '—';

  // Sort employees by salary desc for leaderboard
  const topEarners = [...employees].sort((a, b) => b.salary - a.salary).slice(0, 5);

  function getInitials(name = '') {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
  function fmt(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  return (
    <>
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-left">
          <h1 className="page-title">Dashboard</h1>
          <span className="route-chip">Overview</span>
        </div>
      </header>

      <main className="page-body">
        {/* Metrics */}
        <div className="stats-grid">
          <MetricCard icon="👥" iconClass="purple" label="Total Employees"  value={total}    sub="Active headcount"                    delay={0}    />
          <MetricCard icon="🏬" iconClass="blue"   label="Departments"      value={depts.length} sub={`Top: ${topDept}`}              delay={0.07} />
          <MetricCard icon="💰" iconClass="green"  label="Average Salary"   value={fmt(avgSal)} sub="Across all staff"               delay={0.14} />
          <MetricCard icon="🏆" iconClass="amber"  label="Highest Salary"   value={fmt(topSal)} sub={topEarners[0]?.name || '—'}    delay={0.21} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Department Breakdown */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Department Breakdown</h2>
            </div>
            <div style={{ padding: '20px 24px' }}>
              {depts.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No data</p>
              ) : depts.map(([dept, count]) => {
                const pct   = Math.round((count / total) * 100);
                const style = DEPT_COLORS[dept] || { bg: '#f8f9fe', color: '#6b7280', bar: '#9ca3af' };
                return (
                  <div key={dept} style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: style.color }}>
                        {dept}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                        {count} employee{count > 1 ? 's' : ''} · {pct}%
                      </span>
                    </div>
                    <div style={{ height: 8, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: style.bar,
                        borderRadius: 99,
                        transition: 'width 0.6s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Earners */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Top Earners</h2>
            </div>
            <div style={{ padding: '8px 0' }}>
              {topEarners.map((emp, i) => (
                <div key={emp._id || emp.id} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '13px 24px',
                  borderBottom: i < topEarners.length - 1 ? '1px solid var(--border)' : 'none',
                }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: i === 0 ? '#fef9c3' : 'var(--bg-subtle)',
                    color:      i === 0 ? '#d97706' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <div className="emp-avatar" style={{ width: 36, height: 36, fontSize: 12 }}>
                    {getInitials(emp.name)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{emp.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{emp.department}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--success)' }}>
                    {fmt(emp.salary)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
