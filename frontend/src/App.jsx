import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminProjectPage from "./pages/admin/AdminProjectPage.jsx";
import AdminMemberTasksPage from "./pages/admin/AdminMemberTasksPage.jsx";
import MemberDashboard from "./pages/member/MemberDashboard.jsx";
import Layout from "./layout/Layout.jsx";

function Splash() {
  return <div className="splash">Loading…</div>;
}

function ProtectedAdmin({ children }) {
  const { ready, isAuthenticated, isAdmin } = useAuth();
  if (!ready) return <Splash />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/member/dashboard" replace />;
  return children;
}

function ProtectedMember({ children }) {
  const { ready, isAuthenticated, isAdmin } = useAuth();
  if (!ready) return <Splash />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  return children;
}

function HomeRedirect() {
  const { ready, isAuthenticated, isAdmin } = useAuth();
  if (!ready) return <Splash />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <Navigate to={isAdmin ? "/admin/dashboard" : "/member/dashboard"} replace />
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/app" element={<HomeRedirect />} />

      <Route
        element={
          <ProtectedAdmin>
            <Layout variant="admin" />
          </ProtectedAdmin>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/project/:projectId" element={<AdminProjectPage />} />
        <Route
          path="/admin/project/:projectId/member/:memberId"
          element={<AdminMemberTasksPage />}
        />
      </Route>

      <Route
        element={
          <ProtectedMember>
            <Layout variant="member" />
          </ProtectedMember>
        }
      >
        <Route path="/member/dashboard" element={<MemberDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
