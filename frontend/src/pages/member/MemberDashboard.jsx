import { useCallback, useEffect, useState } from "react";
import api from "../../api/client.js";
import { notifyMemberStatsChanged } from "../../utils/memberStatsEvents.js";
import { formatDisplayDate } from "../../utils/dates.js";

export default function MemberDashboard() {
  const [bundle, setBundle] = useState(null);
  const [stats, setStats] = useState(null);
  const [err, setErr] = useState("");

  const load = useCallback(() => {
    Promise.all([
      api.get("/member/my-tasks"),
      api.get("/member/project-stats"),
    ])
      .then(([t, s]) => {
        setBundle(t.data);
        setStats(s.data);
      })
      .catch((e) => setErr(e.response?.data?.error || "Could not load"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateTaskLocal = useCallback((projectId, taskId, status) => {
    setBundle((prev) => {
      if (!prev) return prev;
      return {
        projects: prev.projects.map((g) =>
          g.project_id !== projectId
            ? g
            : {
                ...g,
                tasks: g.tasks.map((t) =>
                  t.id !== taskId
                    ? t
                    : {
                        ...t,
                        status,
                        is_overdue:
                          status === "completed"
                            ? false
                            : calcOverdue(t.due_date),
                      }
                ),
              }
        ),
      };
    });
  }, []);

  if (err) return <div className="banner error">{err}</div>;
  if (!bundle) return <p className="muted">Loading your tasks…</p>;

  return (
    <div className="stack-lg">
      <div className="stats-row cols-3 member-summary">
        <div className="stat-card subtle">
          <div className="stat-label">Open tasks</div>
          <div className="stat-num">{stats?.open_tasks ?? "—"}</div>
        </div>
        <div className="stat-card subtle">
          <div className="stat-label">Completed</div>
          <div className="stat-num">{stats?.completed_tasks ?? "—"}</div>
        </div>
        <div className="stat-card subtle">
          <div className="stat-label">Overdue</div>
          <div className="stat-num urgent">{stats?.overdue_tasks ?? "—"}</div>
        </div>
      </div>

      {bundle.projects.length === 0 && (
        <div className="card empty-note">No tasks assigned yet.</div>
      )}

      <div className="stack-lg">
        {bundle.projects.map((group) => (
          <section key={group.project_id} className="card proj-group">
            <div className="proj-group-head">
              <h2 className="subsection-title">{group.project_name}</h2>
              <span className="pill ghost">{group.tasks.length} tasks</span>
            </div>
            <ul className="task-mini-list">
              {group.tasks.map((t) => (
                <li key={t.id} className="task-mini">
                  <div className="task-mini-main">
                    <span className="task-bullet" />
                    <div>
                      <div className="task-title">{t.title}</div>
                      <div className="muted sm">
                        Due {formatDisplayDate(t.due_date)}
                      </div>
                    </div>
                  </div>
                  <div className="task-mini-tail">
                    {t.is_overdue && <span className="pill overdue">Overdue</span>}
                    <StatusPill status={t.status} />
                    <MemberStatusSelect
                      task={t}
                      onUpdated={async (tid, status) => {
                        await api.patch(`/tasks/${tid}`, { status });
                        updateTaskLocal(group.project_id, tid, status);
                        const { data } = await api.get("/member/project-stats");
                        setStats(data);
                        notifyMemberStatsChanged();
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function calcOverdue(dueIso) {
  if (!dueIso) return false;
  const d = new Date(dueIso + "T12:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return d < now;
}

function StatusPill({ status }) {
  const cls =
    status === "completed"
      ? "pill done"
      : status === "in_progress"
        ? "pill progress"
        : "pill pending";
  const label =
    status === "in_progress"
      ? "In progress"
      : status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={cls}>{label}</span>;
}

function MemberStatusSelect({ task, onUpdated }) {
  const [busy, setBusy] = useState(false);
  async function change(e) {
    const status = e.target.value;
    setBusy(true);
    try {
      await onUpdated(task.id, status);
    } finally {
      setBusy(false);
    }
  }

  return (
    <select
      className="status-select-compact"
      value={task.status}
      disabled={busy}
      onChange={change}
      aria-label="Update status"
    >
      <option value="pending">Pending</option>
      <option value="in_progress">In progress</option>
      <option value="completed">Completed</option>
    </select>
  );
}
