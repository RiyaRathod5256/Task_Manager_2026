import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Header({ variant }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const title = variant === "admin" ? "Admin Dashboard" : "My workspace";

  return (
    <header className="top-header">
      <div className="top-header-left">
        <button
          type="button"
          className="icon-btn"
          aria-label="Menu"
          onClick={() => document.body.classList.toggle("sidebar-collapsed")}
        >
          ☰
        </button>
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="top-header-right">
        <button type="button" className="icon-btn muted" aria-label="Notifications">
          🔔
        </button>

        <div className="header-profile-wrap">
          <button
            type="button"
            className="header-profile"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="avatar sm">{user?.full_name?.[0] || "A"}</span>
            <span className="header-profile-label">
              {user?.role === "admin" ? "Admin" : "Member"}
            </span>
          </button>
          {open && (
            <div className="header-dropdown">
              <button type="button" onClick={() => setOpen(false)}>
                Profile
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
