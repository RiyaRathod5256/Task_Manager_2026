import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import api from "../../api/client.js";
import { formatDisplayDate } from "../../utils/dates.js";

export default function AdminDashboard() {
  const location = useLocation();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [q, setQ] = useState("");
  const [dropdowns, setDropdowns] = useState({ projects: [], members: [] });
  const [projectsErr, setProjectsErr] = useState("");
  const [assignmentMembers, setAssignmentMembers] = useState([]);
  const [form, setForm] = useState({
    project_id: "",
    assigned_to_user_id: "",
    title: "",
    due_date: "",
  });

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    member_ids: [],
  });
  const [formMsg, setFormMsg] = useState("");

  const loadDashboard = useCallback(async () => {
    setProjectsErr("");
    const [{ data: s }, { data: p }, { data: d }] = await Promise.all([
      api.get("/admin/dashboard-stats"),
      api.get("/projects"),
      api.get("/users/for-assignment"),
    ]);
    setStats(s);
    setProjects(p.projects);
    setDropdowns({ projects: d.projects, members: d.members });
  }, []);

  const refreshTasks = useCallback(async () => {
    try {
      const [{ data: taskData }, { data: s }] = await Promise.all([
        api.get("/tasks/recent", { params: { q } }),
        api.get("/admin/dashboard-stats"),
      ]);
      setTasks(taskData.tasks);
      setStats(s);
    } catch {
      setTasks([]);
    }
  }, [q]);

  useEffect(() => {
    loadDashboard().catch((e) => setProjectsErr(e.response?.data?.error || "Load failed"));
  }, [loadDashboard]);

  useEffect(() => {
    function onVisible() {
      if (document.visibilityState !== "visible") return;
      if (location.pathname !== "/admin/dashboard") return;
      loadDashboard().catch(() => {});
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [location.pathname, loadDashboard]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      refreshTasks().catch(() => setTasks([]));
    }, 250);
    return () => window.clearTimeout(id);
  }, [refreshTasks]);

  async function refreshProjectMembers(projectId) {
    if (!projectId) {
      setAssignmentMembers([]);
      return;
    }
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setAssignmentMembers(data.members || []);
    } catch {
      setAssignmentMembers([]);
    }
  }

  useEffect(() => {
    if (form.project_id) refreshProjectMembers(form.project_id);
    else setAssignmentMembers([]);
  }, [form.project_id]);

  async function submitAssignment(e) {
    e.preventDefault();
    setFormMsg("");
    try {
      await api.post("/tasks", {
        title: form.title.trim(),
        project_id: Number(form.project_id),
        assigned_to_user_id: Number(form.assigned_to_user_id),
        due_date: form.due_date,
      });
      setFormMsg("Task assigned.");
      setForm((f) => ({ ...f, title: "", due_date: "" }));
      refreshTasks();
      loadDashboard();
    } catch (err) {
      setFormMsg(err.response?.data?.error || "Assign failed.");
    }
  }

  async function submitNewProject(ev) {
    ev.preventDefault();
    setProjectsErr("");
    try {
      await api.post("/projects", {
        name: newProject.name.trim(),
        description: newProject.description.trim() || null,
        member_ids: newProject.member_ids,
      });
      setShowProjectModal(false);
      setNewProject({ name: "", description: "", member_ids: [] });
      loadDashboard();
    } catch (e) {
      setProjectsErr(e.response?.data?.error || "Could not create project");
    }
  }

  function toggleMember(mid) {
    setNewProject((np) => {
      const next = np.member_ids.includes(mid)
        ? np.member_ids.filter((x) => x !== mid)
        : [...np.member_ids, mid];
      return { ...np, member_ids: next };
    });
  }

  async function deleteProject(projectId, projectName) {
    if (
      !window.confirm(
        `Delete project "${projectName}"? All tasks in this project will be removed.`
      )
    ) {
      return;
    }
    setProjectsErr("");
    try {
      await api.delete(`/projects/${projectId}`);
      if (String(form.project_id) === String(projectId)) {
        setForm((f) => ({ ...f, project_id: "", assigned_to_user_id: "" }));
        setAssignmentMembers([]);
      }
      await loadDashboard();
      await refreshTasks();
    } catch (e) {
      setProjectsErr(e.response?.data?.error || "Could not delete project");
    }
  }
  async function toggleProjectStatus(
    projectId,
    newStatus
  ) {
    try {
      await api.patch(
        `/projects/${projectId}`,
        {
          status: newStatus,
        }
      );
  
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId
            ? {
                ...project,
                status: newStatus,
              }
            : project
        )
      );
      await loadDashboard();
      await refreshTasks();
    } catch (err) {
      setProjectsErr(
        err.response?.data?.error ||
          "Could not update project status"
      );
    }
  }
  const chartPieces = useMemo(() => {
    if (!stats) return [];
    return [
      {
        key: "completed",
        name: `Completed (${stats.completed_tasks})`,
        value: stats.completed_tasks,
        color: "#22c55e",
      },
      {
        key: "in_progress",
        name: `In progress (${stats.in_progress_tasks})`,
        value: stats.in_progress_tasks,
        color: "#6366f1",
      },
      {
        key: "pending",
        name: `Pending (${stats.pending_tasks})`,
        value: stats.pending_tasks,
        color: "#f59e0b",
      },
    ].filter((d) => d.value > 0);
  }, [stats]);

  const [hiddenSlices, setHiddenSlices] = useState({});
  const visibleData = chartPieces.filter((d) => !hiddenSlices[d.key]);
  const totalVisible = visibleData.reduce((a, d) => a + d.value, 0);

  function toggleSlice(key) {
    setHiddenSlices((h) => ({ ...h, [key]: !h[key] }));
  }

  if (!stats) {
    return projectsErr ? (
      <div className="banner error">{projectsErr}</div>
    ) : (
      <p className="muted">Loading dashboard…</p>
    );
  }

  return (
    <div className="stack-xl">
      <div className="dashboard-toolbar">
        <button type="button" className="btn primary sm" onClick={() => setShowProjectModal(true)}>
          + New project
        </button>
      </div>

      {projectsErr && <div className="banner error">{projectsErr}</div>}

      <section className="stats-row cols-4">
        <StatCard label="Total projects" value={stats.total_projects} icon="📁" foot="Manage projects →" />
        <StatCard label="Total tasks" value={stats.total_tasks} icon="✓" foot="Across all teams →" />
        <StatCard
          label="Projects in progress"
          value={stats.projects_in_progress ?? stats.in_progress_tasks}
          icon="◷"
          foot="Matches project status →"
        />
        <StatCard
          label="Projects completed"
          value={stats.projects_completed ?? stats.completed_tasks}
          icon="◎"
          foot="Matches project status →"
        />
      </section>

      <div className="grid-2-large">
        <div className="card table-card projects-table-card">
          <header className="card-head-split">
            <h2 className="card-title-sm">Projects</h2>
            <span className="muted sm">{projects.length} total</span>
          </header>
          <div className="table-responsive-shell">
            <table className="nice-table nice-table-projects">
              <colgroup>
                <col className="col-project-main" />
                <col className="col-team-compact" />
                {/* <col className="col-tasks-compact" /> */}
                <col className="col-status-compact" />
                <col className="col-actions-col" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Project</th>
                  <th scope="col">Team</th>
                  {/* <th scope="col">Tasks</th> */}
                  <th scope="col">Status</th>
                  <th scope="col" className="col-actions-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link className="row-link table-title" to={`/admin/project/${p.id}`}>
                      <span
                        className="thumb-placeholder"
                        style={{ background: p.thumbnail_color }}
                      />
                      <span className="project-cell-name">{p.name}</span>
                    </Link>
                  </td>
                  <td>
                    <div className="avatar-stack">
                      {[...Array(Math.min(p.member_count, 4))].map((_, i) => (
                        <span key={i} className="avatar-stack-item" aria-hidden />
                      ))}
                      {p.member_count > 4 && (
                        <span className="avatar-overflow">
                          +{p.member_count - 4}
                        </span>
                      )}
                      {p.member_count === 0 && (
                        <span className="muted sm">Add members</span>
                      )}
                    </div>
                  </td>
                  {/* <td>
                    <span className="mono-muted">
                      {p.tasks_summary.done}/{p.tasks_summary.total || 0}
                    </span>
                  </td> */}
              
                  <td className="col-status-cell">
                    <select
                      className="status-select-compact"
                      value={p.status}
                      onChange={(e) =>
                        toggleProjectStatus(p.id, e.target.value)
                      }
                    >
                      <option value="in_progress">Ongoing</option>
                      <option value="completed">Complete</option>
                    </select>
                  </td>
                  <td className="col-actions-right">
                    <button
                      type="button"
                      className="btn danger sm"
                      onClick={() => deleteProject(p.id, p.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="stack-md">
          <div className="card table-card">
            <header className="card-head-split">
              <h2 className="card-title-sm">Recent tasks</h2>
              <input
                className="search-input"
                placeholder="Filter by title or project…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </header>
            <div className="table-scroll">
              <table className="nice-table tight">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Project</th>
                    <th>Assigned</th>
                    <th>Due</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <span className="radio-plate" />
                        {t.title}
                      </td>
                      <td>{t.project_name}</td>
                      <td title={t.assigned_name}>
                        <span className="avatar sm inline">{t.assigned_name?.[0] || "?"}</span>
                      </td>
                      <td>{formatDisplayDate(t.due_date)}</td>
                      <td>
                        <Badge status={normalizeStatusForBadge(t.status)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid-2-eq split-bottom">
            <div className="card task-assignment-card">
              <h2 className="card-title-sm">Task assignment</h2>
              <p className="muted sm mb-md-form">
                Choose a project, enter the task title, then pick who will do it.
              </p>
              <form className="stack-md form-compact" onSubmit={submitAssignment}>
                <label className="field">
                  <span>Select project</span>
                  <select
                    required
                    value={form.project_id}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        project_id: e.target.value,
                        assigned_to_user_id: "",
                      }))
                    }
                  >
                    <option value="">—</option>
                    {dropdowns.projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Task title</span>
                  <input
                    required
                    value={form.title}
                    placeholder="e.g. Design homepage wireframes"
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </label>
                <label className="field">
                  <span>Assign to</span>
                  <select
                    required
                    value={form.assigned_to_user_id}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, assigned_to_user_id: e.target.value }))
                    }
                  >
                    <option value="">
                      {form.project_id
                        ? assignmentMembers.length
                          ? "— choose member —"
                          : "No members on this project — add them from the project page"
                        : "— select a project first —"}
                    </option>
                    {assignmentMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.full_name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Due date</span>
                  <input
                    type="date"
                    required
                    value={form.due_date}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, due_date: e.target.value }))
                    }
                  />
                </label>
                {formMsg && (
                  <div className={`banner compact ${formMsg.includes("assigned") ? "ok" : "error"}`}>
                    {formMsg}
                  </div>
                )}
                <button type="submit" className="btn primary block">
                  Assign task
                </button>
              </form>
            </div>

            <div className="card chart-card">
              <h2 className="card-title-sm">Tasks overview</h2>
              <p className="muted sm chart-caption">
                Donut reflects task status (pending / in progress / completed).
              </p>
              <div className="chart-zone">
                {totalVisible > 0 ? (
                  <ResponsiveContainer
                    width="100%"
                    height={220}
                    key={`overview-${stats.completed_tasks}-${stats.in_progress_tasks}-${stats.pending_tasks}`}
                  >
                    <PieChart>
                      <Pie
                        data={visibleData}
                        nameKey="name"
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={58}
                        outerRadius={82}
                        paddingAngle={2}
                      >
                        {visibleData.map((entry) => (
                          <Cell key={entry.key} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="muted center">Hide all segments or no data.</p>
                )}
              </div>
              <ul className="legend-check">
                {chartPieces.map((d) => (
                  <li key={d.key}>
                    <label>
                      <input
                        type="checkbox"
                        checked={!hiddenSlices[d.key]}
                        onChange={() => toggleSlice(d.key)}
                      />{" "}
                      <span className="dot" style={{ background: d.color }} />
                      <span>{d.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showProjectModal && (
        <Modal title="New project" onClose={() => setShowProjectModal(false)}>
          <form className="stack-md" onSubmit={submitNewProject}>
            <label className="field">
              <span>Project name</span>
              <input
                required
                value={newProject.name}
                onChange={(e) =>
                  setNewProject((np) => ({ ...np, name: e.target.value }))
                }
              />
            </label>
            <label className="field">
              <span>Description</span>
              <textarea
                rows={3}
                value={newProject.description}
                onChange={(e) =>
                  setNewProject((np) => ({ ...np, description: e.target.value }))
                }
              />
            </label>
            <div className="member-pick-label">Members</div>
            <div className="member-pick-grid">
              {dropdowns.members.map((m) => (
                <label key={m.id} className="chk">
                  <input
                    type="checkbox"
                    checked={newProject.member_ids.includes(m.id)}
                    onChange={() => toggleMember(m.id)}
                  />
                  {m.full_name}
                </label>
              ))}
              {dropdowns.members.length === 0 && (
                <p className="muted sm">Invite members via registration first.</p>
              )}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn ghost" onClick={() => setShowProjectModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn primary">
                Create project
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Badge({ status }) {
  const map = {
    completed: ["Completed", "pill done"],
    in_progress: ["In progress", "pill progress"],
    pending: ["Pending", "pill pending"],
  };
  const [label, cls] = map[status] || ["—", "pill ghost"];
  return <span className={cls}>{label}</span>;
}

function normalizeStatusForBadge(s) {
  if (s === "completed") return "completed";
  if (s === "in_progress") return "in_progress";
  return "pending";
}

function StatCard({ label, value, icon, foot = "" }) {
  return (
    <div className="stat-card elevated">
      <div className="stat-card-top">
        <span>{icon}</span>
        <div className="stat-label">{label}</div>
      </div>
      <div className="stat-num lg">{value}</div>
      {foot && <div className="stat-foot muted sm">{foot}</div>}
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel card elevated"
        role="dialog"
        aria-labelledby="dlg-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-head">
          <h3 id="dlg-title">{title}</h3>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
