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
    <div className="auth-page">
      <div className="auth-card card">
        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-sub">Sign in to Team Task Manager</p>
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
            />
          </label>
          <button className="btn primary block" disabled={loading} type="submit">
            {loading ? "Signing in…" : "Sign in"}
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
  );
}
