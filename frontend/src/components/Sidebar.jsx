import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const adminLinks = [
  { to: "/admin/dashboard", label: "Dashboard" },
];

function NavIconDashboard() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export default function Sidebar({ variant }) {
  const { user, logout } = useAuth();
  const isAdmin = variant === "admin";

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">TeamTasks</div>
      <div className="sidebar-user">
        <div className="avatar sm" aria-hidden>
          {(user?.full_name || "U")[0]}
        </div>
        <div className="sidebar-user-text">
          <div className="name">{user?.full_name}</div>
          <div className="email">{user?.email}</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {isAdmin
          ? adminLinks.map(({ to, label }) => (
              <NavLink key={to} to={to} className={({ isActive }) => `nav-row ${isActive ? "active" : ""}`}>
                <NavIconDashboard />
                <span>{label}</span>
              </NavLink>
            ))
          : (
            <NavLink to="/member/dashboard" className={({ isActive }) => `nav-row ${isActive ? "active" : ""}`}>
              <NavIconDashboard />
              <span>My tasks</span>
            </NavLink>
          )}
      </nav>

      <button type="button" className="btn-logout" onClick={() => logout()}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Logout
      </button>
    </aside>
  );
}
