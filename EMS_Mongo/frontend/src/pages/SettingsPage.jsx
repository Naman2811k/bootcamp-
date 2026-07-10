import React from 'react';

const SETTINGS_SECTIONS = [
  {
    title: 'General',
    icon: '🏢',
    items: [
      { label: 'Company Name',    value: 'My Company Ltd.',     type: 'text'   },
      { label: 'Time Zone',       value: 'Asia/Kolkata (IST)',  type: 'select' },
      { label: 'Currency',        value: 'INR (₹)',             type: 'select' },
    ],
  },
  {
    title: 'Data',
    icon: '💾',
    items: [
      { label: 'Storage Mode',   value: 'In-memory (resets on restart)', type: 'badge' },
      { label: 'API Base URL',   value: 'http://localhost:5000',          type: 'badge' },
      { label: 'API Version',    value: 'v1.0.0',                         type: 'badge' },
    ],
  },
];

export default function SettingsPage() {
  return (
    <>
      {/* Topbar */}
      <header className="topbar">
        <div className="topbar-left">
          <h1 className="page-title">Settings</h1>
          <span className="route-chip">Configuration</span>
        </div>
      </header>

      <main className="page-body">
        <div style={{ maxWidth: 680 }}>
          {SETTINGS_SECTIONS.map((section) => (
            <div key={section.title} className="card" style={{ marginBottom: 24 }}>
              <div className="card-header">
                <h2 className="card-title">{section.icon}&nbsp;&nbsp;{section.title}</h2>
              </div>
              <div style={{ padding: '8px 0' }}>
                {section.items.map((item, i) => (
                  <div key={item.label} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 24px',
                    borderBottom: i < section.items.length - 1 ? '1px solid var(--border)' : 'none',
                  }}>
                    <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-secondary)' }}>
                      {item.label}
                    </span>

                    {item.type === 'badge' ? (
                      <span style={{
                        fontSize: 12, fontWeight: 600,
                        padding: '4px 12px',
                        background: 'var(--accent-bg)',
                        color: 'var(--accent)',
                        borderRadius: 20,
                        border: '1.5px solid rgba(99,102,241,0.2)',
                        fontFamily: 'Courier New, monospace',
                      }}>
                        {item.value}
                      </span>
                    ) : (
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.value}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Info box */}
          <div style={{
            background: 'var(--info-bg)',
            border: '1.5px solid rgba(37,99,235,0.2)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 22px',
            display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>ℹ️</span>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--info)', marginBottom: 4 }}>
                About this app
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                This Employee Management System uses an in-memory store. All data resets when the backend server restarts.
                To add persistence, connect a database like <strong>MongoDB</strong> or <strong>SQLite</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
