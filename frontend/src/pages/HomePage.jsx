import { Link } from "react-router-dom";

function IconFolder({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7">
      <path d="M3 7h7l2 2h9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" fill="currentColor" fillOpacity="0.15" />
    </svg>
  );
}

function IconCheckCircle({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="22" height="22" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconPeople({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="22" height="22" fill="currentColor" fillOpacity="0.9">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

function IconBolt({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
      <path d="M11 21l1-7H7.5l5-10h2.5l-1 7h4L11 21z" />
    </svg>
  );
}

const heroHighlights = [
  {
    tint: "hero-icon-purple",
    Icon: IconFolder,
    title: "Manage projects",
    desc: "Create projects, add members, and keep work scoped.",
  },
  {
    tint: "hero-icon-teal",
    Icon: IconCheckCircle,
    title: "Assign & track tasks",
    desc: "Due dates, status, and overdue alerts built in.",
  },
  {
    tint: "hero-icon-pink",
    Icon: IconPeople,
    title: "Collaborate seamlessly",
    desc: "Role-based dashboards for admins and members.",
  },
  {
    tint: "hero-icon-orange",
    Icon: IconBolt,
    title: "Automate workflows",
    desc: "Keep momentum from pending through completion.",
  },
];

const featureCards = [
  {
    tint: "feat-icon-purple",
    Icon: IconFolder,
    title: "Project management",
    desc: "Spin up projects, invite your team, and see progress at a glance.",
  },
  {
    tint: "feat-icon-teal",
    Icon: IconCheckCircle,
    title: "Task tracking",
    desc: "Assign ownership, set priorities, and watch every task to the finish line.",
  },
  {
    tint: "feat-icon-pink",
    Icon: IconPeople,
    title: "Team collaboration",
    desc: "Everyone sees what matters with clear roles and shared context.",
  },
  {
    tint: "feat-icon-orange",
    Icon: IconBolt,
    title: "Workflow speed",
    desc: "Fast updates and real-time lists so nothing slips through the cracks.",
  },
];

const hiwSteps = [
  {
    n: 1,
    color: "#7c3aed",
    title: "Create account",
    desc: "Sign up as a member or use your org’s admin setup.",
  },
  {
    n: 2,
    color: "#06b6d4",
    title: "Create projects",
    desc: "Admins add projects and pull in the right people.",
  },
  {
    n: 3,
    color: "#ec4899",
    title: "Assign tasks",
    desc: "Set titles, owners, and due dates that everyone can follow.",
  },
  {
    n: 4,
    color: "#f97316",
    title: "Track & deliver",
    desc: "Update status from start to done with clarity on what’s left.",
  },
];

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <div className="land-home">
      <header className="land-nav">
        <Link to="/" className="land-brand">
          <span className="land-brand-pink">TASK</span>
          <span className="land-brand-navy"> MANAGER</span>
        </Link>
        <nav className="land-nav-links">
          <Link to="/">Home</Link>
          <a href="#features">Features</a>
          <a href="#about">About</a>
          <Link to="/login">Login</Link>
          <Link to="/register" className="land-nav-cta">
            Register
          </Link>
        </nav>
      </header>

      <section className="land-hero">
        <div className="land-hero-inner">
          <div className="land-hero-copy">
            <div className="land-hero-badge">
              <span className="land-badge-icon" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                </svg>
              </span>
              Built for productive teams
            </div>
            <h1 className="land-hero-title">
              <span className="land-t-pink">Simplify.</span>{" "}
              <span className="land-t-navy">Organize.</span>{" "}
              <span className="land-t-teal">Automate.</span>
            </h1>
            <p className="land-hero-lead">
              Track tasks, coordinate teams, and monitor progress in one place.
            </p>
            <p className="land-hero-body">
              Team Task Manager helps admins and members work together across
              projects. Create workstreams, assign tasks, track deadlines, and
              stay aligned with role-based dashboards.
            </p>
            <div className="land-hero-actions">
              <Link to="/register" className="land-btn land-btn-primary-solid">
                Get started 
              </Link>
              <Link to="/login" className="land-btn land-btn-outline">
                Sign in
              </Link>
            </div>
            <ul className="land-trust-row">
              <li>
                <span className="land-trust-ic green">✓</span> Easy to use
              </li>
              <li>
                <span className="land-trust-ic blue">⚡</span> Real-time updates
              </li>
              <li>
                <span className="land-trust-ic purple">🛡</span> Secure &amp; reliable
              </li>
            </ul>
          </div>

          <div className="land-hero-panel">
            <div className="land-hero-card">
              <ul className="land-hero-list">
                {heroHighlights.map(({ tint, Icon, title, desc }) => (
                  <li key={title} className="land-hero-list-item">
                    <span className={`land-hero-icon-tile ${tint}`} aria-hidden>
                      <Icon />
                    </span>
                    <div>
                      <div className="land-hero-list-title">{title}</div>
                      <p className="land-hero-list-desc">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="land-features">
        <h2 className="land-section-title">
          Powerful features to help{" "}
          <span className="land-accent-purple">your team</span> succeed
        </h2>
        <p className="land-section-sub">
          Everything you need to plan, track, and deliver work faster.
        </p>
        <div className="land-features-grid">
          {featureCards.map(({ tint, Icon, title, desc }) => (
            <article key={title} className="land-feature-card">
              <div className={`land-feature-icon ${tint}`} aria-hidden>
                <Icon />
              </div>
              <h3 className="land-feature-card-title">{title}</h3>
              <p className="land-feature-card-desc">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="land-hiw">
        <h2 className="land-section-title">
          How it <span className="land-accent-purple">works</span>
        </h2>
        <p className="land-section-sub">Get started in just a few simple steps.</p>
        <div className="land-hiw-track">
          <div className="land-hiw-line" aria-hidden />
          <div className="land-hiw-steps">
            {hiwSteps.map((s) => (
              <div key={s.n} className="land-hiw-step">
                <div
                  className="land-hiw-circle"
                  style={{ background: s.color }}
                >
                  {s.n}
                </div>
                <h4 className="land-hiw-step-title">{s.title}</h4>
                <p className="land-hiw-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="land-about">
        <h2 className="land-section-title">About</h2>
        <p className="land-about-text">
          Task Manager is a team task management app with a React front end, Flask
          API, and SQL storage — focused on assignment, progress, and overdue
          visibility for distributed teams.
        </p>
      </section>

      <section className="land-cta-wrap">
        <div className="land-cta">
          <div className="land-cta-text">
            <h2 className="land-cta-title">Ready to boost your team&apos;s productivity?</h2>
            <p className="land-cta-desc">
              Join teams who use Task Manager to ship work on time with less
              overhead. Create an account or sign in to get going.
            </p>
          </div>
          <div className="land-cta-buttons">
            <Link to="/register" className="land-btn land-btn-white">
              Get started 
            </Link>
            
          </div>
        </div>
      </section>
      <footer className="land-footer">
        <div className="land-footer-top">
          <div className="land-footer-brand">
            <span className="land-brand-pink">TASK</span>
            <span className="land-footer-brand-navy"> MANAGER</span>
          </div>
          {/* <nav className="land-footer-links" aria-label="Footer">
            <a href="#features">Features</a>
            <a href="#about">About</a>
            <span className="land-footer-note">Pricing</span>
            <span className="land-footer-note">Blog</span>
            <a href="mailto:support@tasktracker.com">Contact</a>
          </nav> */}
          <div className="land-footer-social" aria-label="Social">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="X">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.5 21.5h4V7.5h-4v14zM8 7.5v14h4v-7.5c0-2 1-3 2.5-3s2 1 2 2.5V21.5h4v-8.5c0-3.5-2-5-4.5-5-2 0-3.5 1-4 2.5V7.5H8z" />
              </svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.02c0 4.43 2.865 8.18 6.839 9.5.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.755 0 1.266-.012 2.286-.012 2.596 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.02C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
          </div>
        </div>
        <p className="land-footer-copy">
          &copy; {year} Task Manager. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
