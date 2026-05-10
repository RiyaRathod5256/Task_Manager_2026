import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="public-home">
      <header className="marketing-nav">
        <div className="brand-mark">
          <span className="brand-pink">TASK</span>{" "}
          <span className="brand-blue">TRACKER</span>
        </div>
        <nav className="marketing-links">
          <Link to="/">Home</Link>
          <a href="#about">About</a>
          <Link to="/login">Login</Link>
          <Link to="/register" className="marketing-cta">
            Register
          </Link>
        </nav>
      </header>

      <main className="marketing-hero-wrap">
        <section className="marketing-hero-left">
          <h1 className="marketing-title">
            <span className="brand-pink">Simplify.</span>{" "}
            <span className="brand-blue">Organize.</span>{" "}
            <span className="brand-cyan">Automate.</span>
          </h1>
          <h2 className="marketing-subtitle">
            Track tasks, coordinate teams, and monitor progress in one place.
          </h2>
          <p className="marketing-copy">
            Team Task Manager helps admins and members work together across
            multiple projects. Create projects, assign tasks, track deadlines,
            and keep everyone aligned with role-based dashboards.
          </p>
          <div className="marketing-actions">
            <Link to="/register" className="btn primary">
              Get started
            </Link>
            <Link to="/login" className="btn ghost">
              Sign in
            </Link>
          </div>
        </section>
        <section className="marketing-hero-right">
          <div className="hero-card">
            <h3>Smart team workflow</h3>
            <ul>
              <li>Admin creates projects and adds members</li>
              <li>Tasks are assigned with due dates</li>
              <li>Members update status in real-time</li>
              <li>Overdue work is highlighted automatically</li>
            </ul>
          </div>
        </section>
      </main>

      <section id="about" className="about-strip">
        <h3>About</h3>
        <p>
          Built with React + Flask + SQL, this app focuses on clean task
          assignment and progress tracking for teams.
        </p>
      </section>
    </div>
  );
}
