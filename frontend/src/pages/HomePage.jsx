import { Link } from "react-router-dom";

function IconBox() {
  return (
    <span className="feature-icon-wrap" aria-hidden>
      <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
        <path
          d="M4 7h16v10H4V7z"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="#f59e0b"
          fillOpacity="0.35"
        />
        <path
          d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </span>
  );
}

function IconPause() {
  return (
    <span className="feature-icon-wrap" aria-hidden>
      <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
        <rect x="6" y="5" width="4" height="14" rx="1" fill="#fff" />
        <rect x="14" y="5" width="4" height="14" rx="1" fill="#fff" />
      </svg>
    </span>
  );
}

function IconChart() {
  return (
    <span className="feature-icon-wrap" aria-hidden>
      <svg viewBox="0 0 24 24" width="28" height="28">
        <rect x="4" y="14" width="4" height="6" rx="1" fill="#22c55e" />
        <rect x="10" y="10" width="4" height="10" rx="1" fill="#f59e0b" />
        <rect x="16" y="6" width="4" height="14" rx="1" fill="#6366f1" />
      </svg>
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="public-home">
      <header className="marketing-nav">
        <Link to="/" className="brand-mark brand-mark-link">
          <span className="brand-pink">TASK</span>{" "}
          <span className="brand-blue">TRACKER</span>
        </Link>
        <nav className="marketing-links">
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
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

      <section id="features" className="features-section">
        <h2 className="features-heading">Features</h2>
        <p className="features-sub">
          Everything you need to run projects and track work in one place.
        </p>
        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-card-accent" aria-hidden />
            <IconBox />
            <h3 className="feature-card-title">Project tracking</h3>
            <p className="feature-card-desc">
              Organize work by project. Admins create projects, assign members,
              and see workload at a glance.
            </p>
          </article>
          <article className="feature-card">
            <div className="feature-card-accent" aria-hidden />
            <IconPause />
            <h3 className="feature-card-title">Flexible task flow</h3>
            <p className="feature-card-desc">
              Set status from pending to in progress to completed. Reassign or
              remove tasks when priorities change.
            </p>
          </article>
          <article className="feature-card">
            <div className="feature-card-accent" aria-hidden />
            <IconChart />
            <h3 className="feature-card-title">Progress insights</h3>
            <p className="feature-card-desc">
              Dashboard summaries and overdue flags help teams stay on track
              and finish on time.
            </p>
          </article>
        </div>
      </section>

      {/* <section id="about" className="about-strip">
        <h3>About</h3>
        <p>
          Built with React + Flask + SQL, this app focuses on clean task
          assignment and progress tracking for teams.
        </p>
      </section>

      <section id="how-it-works" className="how-it-works-strip">
        <h3 className="how-it-works-title">How it works</h3>
        <ol className="how-it-works-list">
          <li>
            <strong>Sign up</strong> — members create an account; admin can be
            seeded for your organization.
          </li>
          <li>
            <strong>Build projects</strong> — admins add members and assign
            tasks with due dates.
          </li>
          <li>
            <strong>Track &amp; deliver</strong> — everyone updates status;
            overdue items stay visible until done.
          </li>
        </ol>
      </section> */}

      <footer className="marketing-footer">
        <div className="marketing-footer-inner">
          <div className="footer-col footer-brand">
            <div className="footer-logo">
              <span className="brand-pink">TASK</span>{" "}
              <span className="text-white">TRACKER</span>
            </div>
            <p className="footer-tagline">
              Manage projects, tasks, and team progress in one place.
            </p>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#how-it-works">How it works</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-contact">
              <li>
                <span className="footer-contact-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7l9 6 9-6" />
                  </svg>
                </span>
                <a href="mailto:support@tasktracker.com">support@tasktracker.com</a>
              </li>
              <li>
                <span className="footer-contact-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.63 2.63a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.45-1.2a2 2 0 0 1 2.11-.45c.85.3 1.73.51 2.63.63A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <a href="tel:+919999999999">+91 99999 99999</a>
              </li>
              <li>
                <span className="footer-contact-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 2.2c3 0 3.2.01 4.3.06 1.1.04 1.7.24 2.1.4.5.2.9.45 1.3.85.4.4.65.8.85 1.3.16.4.36 1 .4 2.1.05 1.1.06 1.3.06 4.3s-.01 3.2-.06 4.3c-.04 1.1-.24 1.7-.4 2.1-.2.5-.45.9-.85 1.3-.4.4-.8.65-1.3.85-.4.16-1 .36-2.1.4-1.1.05-1.3.06-4.3.06s-3.2-.01-4.3-.06c-1.1-.04-1.7-.24-2.1-.4-.5-.2-.9-.45-1.3-.85-.4-.4-.65-.8-.85-1.3-.16-.4-.36-1-.4-2.1-.05-1.1-.06-1.3-.06-4.3s.01-3.2.06-4.3c.04-1.1.24-1.7.4-2.1.2-.5.45-.9.85-1.3.4-.4.8-.65 1.3-.85.4-.16 1-.36 2.1-.4 1.1-.05 1.3-.06 4.3-.06zm0 1.8c-3 0-3.2 0-4.3.05-.9.05-1.4.22-1.7.37-.4.17-.7.36-1 .66-.3.3-.49.6-.66 1-.15.3-.32.8-.37 1.7C2 8.8 2 9 2 12s0 3.2.05 4.3c.05.9.22 1.4.37 1.7.17.4.36.7.66 1 .3.3.6.49 1 .66.3.15.8.32 1.7.37 1.1.05 1.3.06 4.3.06s3.2 0 4.3-.05c.9-.05 1.4-.22 1.7-.37.4-.17.7-.36 1-.66.3-.3.49-.6.66-1 .15-.3.32-.8.37-1.7.05-1.1.06-1.3.06-4.3s0-3.2-.05-4.3c-.05-.9-.22-1.4-.37-1.7-.17-.4-.36-.7-.66-1-.3-.3-.6-.49-1-.66-.3-.15-.8-.32-1.7-.37-1.1-.05-1.3-.06-4.3-.06Zm0 3.4a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8Zm0 1.8a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm5.76-4.64a1.26 1.26 0 1 1-2.52 0 1.26 1.26 0 0 1 2.52 0Z" />
                  </svg>
                </span>
                <span>@task_tracker</span>
              </li>
              <li>
                <span className="footer-contact-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </span>
                <span>@task_tracker</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-rule" />
        <p className="footer-copy">&copy; {new Date().getFullYear()} Task Tracker</p>
      </footer>
    </div>
  );
}
