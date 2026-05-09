import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";
import Header from "../components/Header.jsx";

export default function Layout({ variant }) {
  return (
    <div className="app-shell">
      <Sidebar variant={variant} />
      <div className="main-column">
        <Header variant={variant} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
