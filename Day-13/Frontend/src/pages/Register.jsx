import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

export default function Register() {
  const [payload, setPayload] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();
  const { handleRegister, loading, error } = useAuth();

  async function handleClick(e) {
    e.preventDefault();
    const res = await handleRegister(payload);
    if (res?.success) navigate("/home");
  }

  return (
    <div className="auth-container">
      <div className="animated-bg"></div>
      
      <div className="auth-card">
        <div className="auth-header">
          <h2>JOIN US</h2>
          <p>BECOME A PART OF THE NETWORK</p>
        </div>

        {error && (
          <div className="error-alert">
            {error}
          </div>
        )}

        <form onSubmit={handleClick} className="auth-form">
          <div className="input-group">
            <label htmlFor="username">FULL NAME</label>
            <div className="input-wrapper">
              <input
                id="username"
                type="text"
                placeholder="JOHN DOE"
                value={payload.username}
                onChange={(e) => setPayload({ ...payload, username: e.target.value })}
                required
              />
            </div>
          </div>

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
            <label htmlFor="password">PASSWORD</label>
            <div className="input-wrapper">
              <input
                id="password"
                type="password"
                placeholder="MIN. 8 CHARACTERS"
                value={payload.password}
                onChange={(e) => setPayload({ ...payload, password: e.target.value })}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <div className="spinner"></div> : <span>INITIALIZE</span>}
          </button>
        </form>

        <p className="auth-footer">
          ALREADY ONLINE? <Link to="/login">LOG IN</Link>
        </p>
      </div>
    </div>
  );
}
