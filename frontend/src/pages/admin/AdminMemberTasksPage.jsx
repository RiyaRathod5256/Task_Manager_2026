import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/client.js";
import { formatDisplayDate } from "../../utils/dates.js";

export default function AdminMemberTasksPage() {
  const { projectId, memberId } = useParams();
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    api
      .get(`/projects/${projectId}/members/${memberId}/tasks`)
      .then(({ data }) => setPayload(data))
      .catch((e) => setError(e.response?.data?.error || "Unable to load"));
  }, [projectId, memberId]);

  async function changeStatus(taskId, status) {
    setBusyId(taskId);
    try {
      await api.patch(`/tasks/${taskId}`, { status });
      const { data } = await api.get(
        `/projects/${projectId}/members/${memberId}/tasks`
      );
      setPayload(data);
    } finally {
      setBusyId(null);
    }
  }

  if (error) return <div className="banner error">{error}</div>;
  if (!payload) return <p className="muted">Loading tasks…</p>;

  return (
    <div className="stack-lg">
      <div className="crumbs">
        <Link to="/admin/dashboard">Dashboard</Link>
        <span className="crumb-div">/</span>
        <Link to={`/admin/project/${projectId}`}>{payload.project.name}</Link>
        <span className="crumb-div">/</span>
        <span>{payload.member.full_name}</span>
      </div>

      <header className="member-profile-head card">
        <span
          className="avatar lg"
          style={{ background: payload.member.avatar_color }}
        >
          {payload.member.full_name[0]}
        </span>
        <div>
          <h1 className="section-title mb-0">{payload.member.full_name}</h1>
          <p className="muted">{payload.member.email}</p>
        </div>
      </header>

      <section className="card">
        <h2 className="card-title-sm">Tasks in project</h2>
        {!payload.tasks.length && (
          <p className="muted sm">No tasks assigned yet for this person.</p>
        )}
        <ul className="admin-task-ul">
          {payload.tasks.map((t) => (
            <li key={t.id} className="admin-task-li">
              <div>
                <strong>{t.title}</strong>
                <div className="muted sm">Due {formatDisplayDate(t.due_date)}</div>
              </div>
              <div className="admin-task-tail">
                {t.is_overdue && <span className="pill overdue">Overdue</span>}
                <select
                  className="status-select-compact"
                  value={t.status}
                  disabled={busyId === t.id}
                  onChange={(e) => changeStatus(t.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
