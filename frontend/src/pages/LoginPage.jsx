import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin, ready } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (ready && isAuthenticated) {
    return <Navigate to={isAdmin ? "/admin/dashboard" : "/member/dashboard"} replace />;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const u = await login(email.trim(), password);
      navigate(u.role === "admin" ? "/admin/dashboard" : "/member/dashboard", {
        replace: true,
      });
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="land-home auth-land auth-land-login">
      <header className="land-nav">
        <Link to="/" className="land-brand">
          <span className="land-brand-pink">TASK</span>
          <span className="land-brand-navy"> TRACKER</span>
        </Link>
        <nav className="land-nav-links">
          <Link to="/">Home</Link>
          <Link to="/#features">Features</Link>
          <Link to="/#about">About</Link>
          <Link to="/login">Login</Link>
          <Link to="/register" className="land-nav-cta">
            Register
          </Link>
        </nav>
      </header>

      <div className="auth-land-wrap">
        <div className="auth-land-info">
          <h1>Welcome back</h1>
          <p className="auth-land-desc" style={{ fontSize: "1.08rem", color: "#373a55", margin: "12px 0 0 0", lineHeight: 1.7 }}>
            Sign in to continue managing projects, assigning tasks, and tracking progress with your team.
          </p>
     
        </div>

        <div className="auth-card card auth-land-card">
          <h2 className="auth-heading">Sign in</h2>
          <p className="auth-sub">Access your Team Task Manager workspace.</p>
          <form onSubmit={submit} className="auth-form">
            {error && <div className="banner error">{error}</div>}
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="Enter your email"
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter your password"
              />
            </label>
            <button className="btn primary block" disabled={loading} type="submit">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <p className="auth-foot">
            New here?{" "}
            <Link to="/register" className="link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}