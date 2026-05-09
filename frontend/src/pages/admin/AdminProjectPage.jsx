import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../api/client.js";

export default function AdminProjectPage() {
  const { projectId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [memberIds, setMemberIds] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api
      .get(`/projects/${projectId}`)
      .then(({ data }) => setData(data))
      .catch((e) => setError(e.response?.data?.error || "Not found"));
    api.get("/users/for-assignment").then(({ data }) => {
      setAllMembers(data.members);
    });
  }, [projectId]);

  async function addMembers(e) {
    e.preventDefault();
    if (!memberIds.length) return;
    setMsg("");
    try {
      const { data } = await api.post(`/projects/${projectId}/members`, {
        member_ids: memberIds,
      });
      setData(data.project);
      setMemberIds([]);
    } catch (ex) {
      setMsg(ex.response?.data?.error || "Could not update");
    }
  }

  async function removeMember(mid) {
    setMsg("");
    try {
      const { data } = await api.delete(`/projects/${projectId}/members/${mid}`);
      setData(data.project);
    } catch (ex) {
      setMsg(ex.response?.data?.error || "Could not remove");
    }
  }

  const existingIds = new Set((data?.members || []).map((m) => m.id));
  const selectable = allMembers.filter((m) => !existingIds.has(m.id));

  if (error) return <div className="banner error">{error}</div>;
  if (!data) return <p className="muted">Loading project…</p>;

  return (
    <div className="stack-lg">
      <div className="crumbs">
        <Link to="/admin/dashboard">Dashboard</Link>
        <span className="crumb-div">/</span>
        <span>{data.name}</span>
      </div>

      <header className="page-head-simple">
        <div>
          <h1 className="section-title">{data.name}</h1>
          <p className="muted">{data.description || "No description"}</p>
          <div className="hero-meta">
            <span className="pill ghost">
              Tasks {data.tasks_summary.done}/{data.tasks_summary.total}
            </span>
            <span className={`pill ${data.status === "completed" ? "done" : "progress"}`}>
              {data.status === "completed" ? "Completed" : "In progress"}
            </span>
          </div>
        </div>
      </header>

      {msg && <div className="banner compact error">{msg}</div>}

      <div className="card">
        <h2 className="card-title-sm">Project members</h2>
        <p className="muted sm mb-md">
          Open a teammate to inspect their tasks inside this project.
        </p>
        <ul className="member-drill-list">
          {data.members.map((m) => (
            <li key={m.id} className="member-drill-row">
              <Link
                className="member-drill-link"
                to={`/admin/project/${projectId}/member/${m.id}`}
              >
                <span className="avatar sm" style={{ background: m.avatar_color }}>
                  {m.full_name[0]}
                </span>
                <div>
                  <div className="name">{m.full_name}</div>
                  <div className="muted sm">
                    {m.email} · {m.projects_count}{" "}
                    {m.projects_count === 1 ? "project" : "projects"}
                  </div>
                </div>
              </Link>
              <button
                type="button"
                className="btn ghost sm warn"
                onClick={() => removeMember(m.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        {data.members.length === 0 && (
          <p className="muted sm">No members yet. Assign below.</p>
        )}

        <form className="stack-md add-members-form mt-lg" onSubmit={addMembers}>
          <label className="field">
            <span>Add existing members</span>
            <select
              multiple
              value={memberIds.map(String)}
              size={Math.min(selectable.length + 1, 6)}
              onChange={(e) =>
                setMemberIds(
                  Array.from(e.target.selectedOptions).map((o) => Number(o.value))
                )
              }
              className="multi"
            >
              {selectable.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.full_name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn primary sm" disabled={!memberIds.length}>
            Add to project
          </button>
        </form>
      </div>
    </div>
  );
}
