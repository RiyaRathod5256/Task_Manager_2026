import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isAuthenticated, isAdmin, ready } = useAuth();
  const [fullName, setFullName] = useState("");
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
      await register({
        full_name: fullName.trim(),
        email: email.trim(),
        password,
      });
      navigate("/member/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h1 className="auth-heading">Create account</h1>
        <p className="auth-sub">Join as a team member.</p>
        <form onSubmit={submit} className="auth-form">
          {error && <div className="banner error">{error}</div>}
          <label className="field">
            <span>Full name</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </label>
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
              minLength={6}
              autoComplete="new-password"
            />
          </label>
          <button className="btn primary block" disabled={loading} type="submit">
            {loading ? "Creating…" : "Sign up"}
          </button>
        </form>
        <p className="auth-foot">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
