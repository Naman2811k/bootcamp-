import React from 'react';

const NAV_ITEMS = [
  { icon: '👥', label: 'Employees', page: 'employees' },
  { icon: '📊', label: 'Dashboard', page: 'dashboard' },
  { icon: '⚙️', label: 'Settings',  page: 'settings'  },
];

export default function Navbar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">🏢</div>
        <div className="logo-text">
          <span className="logo-title">EMS</span>
          <span className="logo-sub">Management Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav-section">
        <p className="nav-label">Menu</p>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.page}
            className={`nav-item ${activePage === item.page ? 'active' : ''}`}
            onClick={() => onNavigate(item.page)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="server-status">
          <div className="status-dot" />
          <span>API Connected</span>
        </div>
      </div>
    </aside>
  );
}
