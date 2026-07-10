/**
 * Sidebar.jsx
 * Left navigation panel showing conversation history.
 * Conversations are stored in localStorage and passed via props.
 */

function Sidebar({ conversations, activeId, onSelect, onNew, onDelete, collapsed }) {
  // Group conversations by date for a cleaner UX
  const groupByDate = (convs) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterday = today - 86_400_000;
    const sevenDaysAgo = today - 7 * 86_400_000;

    const groups = { Today: [], Yesterday: [], "Previous 7 Days": [], Older: [] };

    convs.forEach((c) => {
      const d = c.updatedAt;
      if (d >= today)            groups.Today.push(c);
      else if (d >= yesterday)   groups.Yesterday.push(c);
      else if (d >= sevenDaysAgo) groups["Previous 7 Days"].push(c);
      else                        groups.Older.push(c);
    });

    return groups;
  };

  const groups = groupByDate(conversations);
  const hasConversations = conversations.length > 0;

  return (
    <nav className={`sidebar${collapsed ? " collapsed" : ""}`} aria-label="Conversation history">
      <div className="sidebar-header">
        <span className="sidebar-logo">
          <span className="sidebar-logo-icon">
            {/* Cyber / AI logo mark */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              <path d="M4.9 4.9l2.1 2.1M16.9 16.9l2.1 2.1M4.9 19.1l2.1-2.1M16.9 7.1l2.1-2.1" />
            </svg>
          </span>
          <span style={{ background: 'linear-gradient(90deg, #8b5cf6 0%, #c4b5fd 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>CampusAI</span>
        </span>
      </div>

      {/* New Chat */}
      <button className="new-chat-btn" onClick={onNew} title="Start a new conversation">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New chat
      </button>

      {/* Conversation List */}
      <div className="conversation-list" role="list">
        {!hasConversations && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", padding: "12px 16px", lineHeight: 1.5 }}>
            No conversations yet. Start a new chat above.
          </p>
        )}

        {Object.entries(groups).map(([label, items]) =>
          items.length === 0 ? null : (
            <div key={label}>
              <p className="sidebar-section-label">{label}</p>
              {items.map((conv) => (
                <ConversationItem
                  key={conv.id}
                  conv={conv}
                  isActive={conv.id === activeId}
                  onSelect={() => onSelect(conv.id)}
                  onDelete={(e) => { e.stopPropagation(); onDelete(conv.id); }}
                />
              ))}
            </div>
          )
        )}
      </div>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-info">
          <div className="sidebar-footer-avatar">U</div>
          <span className="sidebar-footer-name">Mistral AI</span>
        </div>
      </div>
    </nav>
  );
}

function ConversationItem({ conv, isActive, onSelect, onDelete }) {
  return (
    <div
      className={`conversation-item${isActive ? " active" : ""}`}
      onClick={onSelect}
      role="listitem"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="conversation-item-icon">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </span>
      <span className="conversation-item-title" title={conv.title}>
        {conv.title}
      </span>
      <div className="conversation-item-actions">
        <button
          className="conversation-action-btn delete"
          onClick={onDelete}
          title="Delete conversation"
          aria-label={`Delete conversation: ${conv.title}`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
