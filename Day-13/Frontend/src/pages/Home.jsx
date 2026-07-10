import useAuth from "../hooks/useAuth";
import "../styles/home.css";

export default function Home() {
  const { user, handleLogout } = useAuth();

  return (
    <div className="home">
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon">M</div>
          MyApp
        </div>
        <div className="nav-links">
          {user ? (
            <>
              <span className="nav-username">👋 {user.username || user.email}</span>
              <button className="btn-logout" onClick={handleLogout}>Log out</button>
            </>
          ) : (
            <>
              <a href="/login">Sign in</a>
              <a href="/register" className="btn-signup">Get started free</a>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        {user ? (
          <>
            <div className="hero-badge">
              <div className="badge-dot" />
              You're back
            </div>
            <h1>
              Good to see you,<br />
              <span>{user.username || user.email}.</span>
            </h1>
            <p>Pick up right where you left off. Your workspace is ready and waiting.</p>
            <div className="hero-btns">
              <a href="/dashboard" className="btn-primary">Go to Dashboard</a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
              <div className="stat">
                <span className="stat-num">24/7</span>
                <span className="stat-label">Support</span>
              </div>
              <div className="stat">
                <span className="stat-num">∞</span>
                <span className="stat-label">Potential</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="hero-badge">
              <div className="badge-dot" />
              Now in public beta
            </div>
            <h1>
              The smartest way<br />
              to <span>get things done.</span>
            </h1>
            <p>
              MyApp helps you collaborate, ship faster, and build better products — all in one place.
            </p>
            <div className="hero-btns">
              <a href="/register" className="btn-primary">Start for free →</a>
              <a href="/login" className="btn-outline">Sign in</a>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-num">10K+</span>
                <span className="stat-label">Users</span>
              </div>
              <div className="stat">
                <span className="stat-num">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
              <div className="stat">
                <span className="stat-num">4.9★</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </>
        )}
      </section>

      <footer className="footer">© 2026 MyApp, Inc. All rights reserved.</footer>
    </div>
  );
}