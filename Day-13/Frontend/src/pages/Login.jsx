import { useState } from "react";
import "../styles/auth.css";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [payload, setPayload] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { handleLogin, loading, error } = useAuth();

  async function handleClick(e) {
    e.preventDefault();
    const res = await handleLogin(payload);
    if (res?.success) navigate("/home");
  }

  return (
    <div className="auth-container">
      <div className="animated-bg"></div>
      
      <div className="auth-card">
        <div className="auth-header">
          <h2>SIGN IN</h2>
          <p>ENTER THE SYSTEM</p>
        </div>

        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        <form onSubmit={handleClick} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">EMAIL</label>
            <div className="input-wrapper">
              <input
                id="email"
                type="email"
                placeholder="YOU@EXAMPLE.COM"
                value={payload.email}
                onChange={(e) => setPayload({ ...payload, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <div className="label-row">
              <label htmlFor="password">PASSWORD</label>
              <a href="#" className="forgot-link">FORGOT PASSWORD?</a>
            </div>
            <div className="input-wrapper">
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={payload.password}
                onChange={(e) => setPayload({ ...payload, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : <span>ACCESS DENIED? NAH.</span>}
          </button>
        </form>

        <p className="auth-footer">
          NEW HERE? <Link to="/register">JOIN US</Link>
        </p>
      </div>
    </div>
  );
}
