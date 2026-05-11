import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    isAuthenticated,                                                  
    isAdmin,
    ready,
  } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Email regex
  const emailPattern =
    /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9]+([.-][A-Za-z0-9]+)*\.[A-Za-z]{2,}$/;

  // Password regex
  // Requirements:
  // - 8 to 15 characters
  // - at least 1 uppercase
  // - at least 1 lowercase
  // - at least 1 number
  // - at least 1 special character
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

  // Redirect if already logged in
  if (ready && isAuthenticated) {
    return (
      <Navigate
        to={
          isAdmin
            ? "/admin/dashboard"
            : "/member/dashboard"
        }
        replace
      />
    );
  }

  async function submit(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();

    // Full Name Validation
    if (!cleanName) {
      setError("Full name is required.");
      setLoading(false);
      return;
    }

    // Email Validation
    if (!emailPattern.test(cleanEmail)) {
      setError(
        "Invalid email format.\n\nExample: john123@gmail.com"
      );

      setLoading(false);
      return;
    }

    // Password Validation
    if (!passwordPattern.test(password)) {
      setError(
        "Password must be 8-15 characters long and include:\n\n" +
        "• 1 uppercase letter\n" +
        "• 1 lowercase letter\n" +
        "• 1 number\n" +
        "• 1 special character (@$!%*?&)\n\n" +
        "Example: John@123"
      );

      setLoading(false);
      return;
    }

    try {
      await register({
        full_name: cleanName,
        email: cleanEmail,
        password,
      });

      navigate("/member/dashboard", {
        replace: true,
      });
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Registration failed.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="land-home auth-land auth-land-register">
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
          <h1>Create your account</h1>
          <p className="auth-land-desc" style={{ fontSize: "1.08rem", color: "#373a55", margin: "12px 0 0 0", lineHeight: 1.7 }}>
            Join your team workspace and start collaborating on tasks,
            assignments, and project milestones.
          </p>
        </div>

        <div className="auth-card card auth-land-card">
          <h2 className="auth-heading">Sign up</h2>
          <p className="auth-sub">Register as a team member.</p>

          <form onSubmit={submit} className="auth-form">
            {error && (
              <div className="banner error" style={{ whiteSpace: "pre-line" }}>
                {error}
              </div>
            )}

            <label className="field">
              <span>Full name</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                autoComplete="name"
                placeholder="Enter your full name"
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
                autoComplete="new-password"
                placeholder="Create a password"
              />
            </label>

            <button className="btn primary block" disabled={loading} type="submit">
              {loading ? "Creating..." : "Sign up"}
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
    </div>
  );
}