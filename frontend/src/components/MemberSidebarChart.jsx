import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import api from "../api/client.js";
import { MEMBER_STATS_CHANGED_EVENT } from "../utils/memberStatsEvents.js";

export default function MemberSidebarChart() {
  const [stats, setStats] = useState(null);
  const [hiddenSlices, setHiddenSlices] = useState({});

  const load = useCallback(async () => {
    try {
      const { data } = await api.get("/member/project-stats");
      setStats(data);
    } catch {
      setStats(null);
    }
  }, []);

  useEffect(() => {
    load();
    window.addEventListener(MEMBER_STATS_CHANGED_EVENT, load);
    return () => window.removeEventListener(MEMBER_STATS_CHANGED_EVENT, load);
  }, [load]);

  const chartPieces = useMemo(() => {
    if (!stats) return [];
    return [
      {
        key: "completed",
        name: `Done (${stats.completed_tasks ?? 0})`,
        value: stats.completed_tasks ?? 0,
        color: "#22c55e",
      },
      {
        key: "in_progress",
        name: `In progress (${stats.in_progress_tasks ?? 0})`,
        value: stats.in_progress_tasks ?? 0,
        color: "#a5b4fc",
      },
      {
        key: "pending",
        name: `Pending (${stats.pending_tasks ?? 0})`,
        value: stats.pending_tasks ?? 0,
        color: "#fbbf24",
      },
    ].filter((d) => d.value > 0);
  }, [stats]);

  const visibleData = chartPieces.filter((d) => !hiddenSlices[d.key]);
  const totalVisible = visibleData.reduce((a, d) => a + d.value, 0);

  function toggleSlice(key) {
    setHiddenSlices((h) => ({ ...h, [key]: !h[key] }));
  }

  if (!stats) {
    return (
      <div className="sidebar-chart-block">
        <div className="sidebar-chart-title">Tasks overview</div>
        <p className="sidebar-chart-muted">Loading…</p>
      </div>
    );
  }

  const totalAssigned =
    (stats.completed_tasks ?? 0) +
    (stats.in_progress_tasks ?? 0) +
    (stats.pending_tasks ?? 0);

  return (
    <div className="sidebar-chart-block">
      <div className="sidebar-chart-title">Tasks overview</div>
      <p className="sidebar-chart-caption">
        Your assigned tasks by status.
      </p>
      <div className="sidebar-chart-zone">
        {totalVisible > 0 ? (
          <ResponsiveContainer
            width="100%"
            height={160}
            key={`sb-${stats.completed_tasks}-${stats.in_progress_tasks}-${stats.pending_tasks}`}
          >
            <PieChart>
              <Pie
                data={visibleData}
                nameKey="name"
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={42}
                outerRadius={62}
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
          <p className="sidebar-chart-muted center">
            {totalAssigned === 0
              ? "No tasks yet."
              : "Adjust legend filters."}
          </p>
        )}
      </div>
      <ul className="sidebar-legend-check">
        {[
          {
            key: "completed",
            name: `Done (${stats.completed_tasks ?? 0})`,
            color: "#22c55e",
            value: stats.completed_tasks ?? 0,
          },
          {
            key: "in_progress",
            name: `In progress (${stats.in_progress_tasks ?? 0})`,
            color: "#a5b4fc",
            value: stats.in_progress_tasks ?? 0,
          },
          {
            key: "pending",
            name: `Pending (${stats.pending_tasks ?? 0})`,
            color: "#fbbf24",
            value: stats.pending_tasks ?? 0,
          },
        ].map((d) => (
          <li key={d.key}>
            <label>
              <input
                type="checkbox"
                checked={!hiddenSlices[d.key]}
                onChange={() => toggleSlice(d.key)}
                disabled={d.value === 0}
              />{" "}
              <span className="dot" style={{ background: d.color }} />
              <span>{d.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
