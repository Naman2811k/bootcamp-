/**
 * App.jsx — Root shell.
 * Renders the two-column ChatGPT-style layout:
 *   • Left:  Sidebar with conversation history
 *   • Right: Chat panel (topbar + ChatWindow)
 */
import { useState, useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import { useConversations } from "./hooks/useConversations.js";

function App() {
  const {
    conversations,
    activeId,
    activeConversation,
    createConversation,
    updateMessages,
    selectConversation,
    deleteConversation,
  } = useConversations();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  /* On first load, create an initial conversation if none exist */
  useEffect(() => {
    if (conversations.length === 0) {
      createConversation();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Handle "New Chat" — always create a fresh one */
  const handleNew = () => {
    createConversation();
    setMobileOpen(false);
  };

  /* Select existing */
  const handleSelect = (id) => {
    selectConversation(id);
    setMobileOpen(false);
  };

  /* Desktop toggle vs mobile overlay */
  const toggleSidebar = () => {
    const isMobile = window.innerWidth <= 720;
    if (isMobile) {
      setMobileOpen((v) => !v);
    } else {
      setSidebarCollapsed((v) => !v);
    }
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 720;
  const effectiveCollapsed = isMobile ? !mobileOpen : sidebarCollapsed;

  return (
    <div className="app-shell">
      {/* Mobile overlay to close sidebar */}
      <div
        className={`sidebar-overlay${mobileOpen ? " visible" : ""}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* ── Left Sidebar ── */}
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onNew={handleNew}
        onSelect={handleSelect}
        onDelete={deleteConversation}
        collapsed={effectiveCollapsed}
      />

      {/* ── Right Chat Panel ── */}
      <main className="chat-panel" role="main">
        {/* Topbar */}
        <header className="topbar">
          <button
            className="topbar-toggle-btn"
            onClick={toggleSidebar}
            aria-label={effectiveCollapsed ? "Open sidebar" : "Close sidebar"}
            title="Toggle sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <span className="topbar-title">
            {activeConversation?.title
              ? activeConversation.title
              : <span style={{ background: 'linear-gradient(90deg, #8b5cf6 0%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CampusAI</span>
            }
          </span>

          <span className="topbar-model-badge">Mistral AI</span>
        </header>

        {/* Chat content — welcome screen or messages + input */}
        <ChatWindow
          key={activeId}
          conversation={activeConversation}
          onMessagesUpdate={updateMessages}
        />
      </main>
    </div>
  );
}

export default App;
