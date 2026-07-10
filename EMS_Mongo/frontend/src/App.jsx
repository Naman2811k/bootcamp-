import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import DashboardSummaryPage from './pages/DashboardSummaryPage';
import SettingsPage from './pages/SettingsPage';
import './index.css';

const PAGES = {
  employees: <DashboardPage />,
  dashboard: <DashboardSummaryPage />,
  settings:  <SettingsPage />,
};

export default function App() {
  const [activePage, setActivePage] = useState('employees');

  return (
    <div className="app-shell">
      <Navbar activePage={activePage} onNavigate={setActivePage} />
      <div className="main-content">
        {PAGES[activePage]}
      </div>
    </div>
  );
}
