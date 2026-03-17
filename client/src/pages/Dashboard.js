import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  FolderKanban,
  CalendarCheck,
  Building2,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Activity,
} from "lucide-react";
import { cn } from "../lib/utils";
import api from "../api/axios";

/* ── tiny sparkline via SVG ──────────────────────── */
const Sparkline = ({ data = [], color = "#6366f1" }) => {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const w = 80,
    h = 28;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - (v / max) * h}`)
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".8"
      />
    </svg>
  );
};

/* ── stat card ───────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, sub, iconColor, spark, to }) => (
  <Link
    to={to}
    className="card p-5 flex flex-col gap-4 hover:border-zinc-700
    transition-all duration-200 group no-underline"
  >
    <div className="flex items-start justify-between">
      <div className={cn("p-2.5 rounded-lg", iconColor)}>
        <Icon size={16} />
      </div>
      {spark && (
        <Sparkline
          data={spark}
          color={
            iconColor.includes("violet")
              ? "#818cf8"
              : iconColor.includes("emerald")
                ? "#34d399"
                : iconColor.includes("amber")
                  ? "#fbbf24"
                  : "#60a5fa"
          }
        />
      )}
    </div>
    <div>
      <p className="text-3xl font-semibold tracking-tight text-zinc-100">
        {value}
      </p>
      <p className="text-sm text-zinc-500 mt-0.5">{label}</p>
    </div>
    {sub && (
      <p className="text-xs text-zinc-600 flex items-center gap-1.5 mt-auto">
        {sub}
        <ArrowRight
          size={11}
          className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
        />
      </p>
    )}
  </Link>
);

/* ── donut chart (SVG) ───────────────────────────── */
const DonutChart = ({ data }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 40,
    cx = 52,
    cy = 52,
    stroke = 28;
  const circ = 2 * Math.PI * r;
  let cumulative = 0;
  const COLORS = ["#6366f1", "#f59e0b", "#34d399"];
  const slices = data.map((d, i) => {
    const pct = d.value / total;
    const offset = circ - cumulative * circ;
    const dash = pct * circ;
    cumulative += pct;
    return { ...d, offset, dash, color: COLORS[i] };
  });
  return (
    <div className="flex items-center gap-6">
      <svg width="104" height="104" viewBox="0 0 104 104">
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#27272a"
          strokeWidth={stroke}
        />
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${s.dash} ${circ - s.dash}`}
            strokeDashoffset={s.offset}
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center",
              transition: "stroke-dasharray .6s ease",
            }}
          />
        ))}
        <text
          x={cx}
          y={cy + 4}
          textAnchor="middle"
          fill="#f4f4f5"
          fontSize="14"
          fontWeight="600"
        >
          {total}
        </text>
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          fill="#71717a"
          fontSize="8"
        >
          tasks
        </text>
      </svg>
      <div className="flex flex-col gap-2.5">
        {slices.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 text-xs text-zinc-400"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: s.color }}
            />
            <span className="text-zinc-500">{s.label}</span>
            <span className="ml-auto font-medium text-zinc-300">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── activity item ───────────────────────────────── */
const ActivityItem = ({ icon: Icon, iconClass, text, time }) => (
  <div className="flex items-start gap-3 py-3 border-b border-zinc-800/60 last:border-0">
    <div className={cn("mt-0.5 p-1.5 rounded-md", iconClass)}>
      <Icon size={12} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm text-zinc-300 leading-snug">{text}</p>
      <p className="text-xs text-zinc-600 mt-0.5">{time}</p>
    </div>
  </div>
);

/* ════════════════════════════════════════════════════
   DASHBOARD PAGE
════════════════════════════════════════════════════ */
const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    departments: 0,
    projects: 0,
    tasks: [],
    attendance: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [empR, deptR, projR, taskR, attR] = await Promise.all([
          api.get("/employees"),
          api.get("/departments"),
          api.get("/projects"),
          api.get("/tasks"),
          api.get("/attendance"),
        ]);
        setStats({
          employees: empR.data,
          departments: deptR.data,
          projects: projR.data,
          tasks: taskR.data,
          attendance: attR.data,
        });
      } catch {
        /* silently degrade */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const tasksByStatus = [
    {
      label: "Pending",
      value: stats.tasks.filter((t) => t.status === "Pending").length,
    },
    {
      label: "In Progress",
      value: stats.tasks.filter((t) => t.status === "In Progress").length,
    },
    {
      label: "Completed",
      value: stats.tasks.filter((t) => t.status === "Completed").length,
    },
  ];

  const presentToday = stats.attendance.filter((a) => {
    const d = new Date(a.date);
    const today = new Date();
    return d.toDateString() === today.toDateString() && a.status === "Present";
  }).length;

  const attRate = stats.attendance.length
    ? Math.round(
        (stats.attendance.filter((a) => a.status === "Present").length /
          stats.attendance.length) *
          100,
      )
    : 0;

  // fake sparkline seeds (replace with real time-series when available)
  const empSpark = [2, 3, 3, 4, 4, 5, stats.employees.length || 4];
  const projSpark = [1, 1, 2, 2, 3, 3, stats.projects.length || 3];

  // recent activity feed (derived from data)
  const recentActivity = [
    ...stats.attendance.slice(-3).map((a) => ({
      icon: CalendarCheck,
      iconClass:
        a.status === "Present"
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-red-500/15 text-red-400",
      text: `${a.employee?.name || "Employee"} marked ${a.status}`,
      time: new Date(a.date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    })),
    ...stats.tasks
      .filter((t) => t.status === "Completed")
      .slice(-2)
      .map((t) => ({
        icon: CheckCircle2,
        iconClass: "bg-violet-500/15 text-violet-400",
        text: `Task "${t.title}" completed`,
        time: new Date(t.updatedAt || t.createdAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
        }),
      })),
  ].slice(0, 6);

  if (loading) {
    return (
      <main className="mx-auto max-w-screen-xl px-6 py-10">
        <div className="flex items-center justify-center h-64">
          <div className="h-6 w-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-screen-xl px-6 py-10 animate-fade-in">
      {/* Header */}
      <div className="page-header flex items-start justify-between">
        <div>
          <p className="section-label mb-1.5">Overview</p>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div
          className="flex items-center gap-2 rounded-xl border border-zinc-800
          bg-zinc-900 px-3 py-2"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-zinc-400">Live</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Employees"
          value={stats.employees.length}
          iconColor="bg-violet-500/15 text-violet-400"
          spark={empSpark}
          sub="View all employees"
          to="/"
        />
        <StatCard
          icon={Building2}
          label="Departments"
          value={stats.departments.length}
          iconColor="bg-blue-500/15 text-blue-400"
          sub="Manage structure"
          to="/departments"
        />
        <StatCard
          icon={FolderKanban}
          label="Projects"
          value={stats.projects.length}
          iconColor="bg-amber-500/15 text-amber-400"
          spark={projSpark}
          sub="View projects"
          to="/projects"
        />
        <StatCard
          icon={CalendarCheck}
          label="Present Today"
          value={presentToday}
          iconColor="bg-emerald-500/15 text-emerald-400"
          sub="Track attendance"
          to="/attendance"
        />
      </div>

      {/* Middle row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Task breakdown */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-medium text-zinc-300">Task Breakdown</p>
            <Link
              to="/tasks"
              className="text-xs text-zinc-600 hover:text-accent transition-colors flex items-center gap-1"
            >
              Board <ArrowRight size={11} />
            </Link>
          </div>
          <DonutChart data={tasksByStatus} />
        </div>

        {/* Attendance rate */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-medium text-zinc-300">Attendance Rate</p>
            <span
              className={cn(
                "text-sm font-semibold",
                attRate >= 80
                  ? "text-emerald-400"
                  : attRate >= 60
                    ? "text-amber-400"
                    : "text-red-400",
              )}
            >
              {attRate}%
            </span>
          </div>
          <div className="space-y-3">
            {[
              {
                label: "Present",
                count: stats.attendance.filter((a) => a.status === "Present")
                  .length,
                color: "bg-emerald-500",
              },
              {
                label: "Absent",
                count: stats.attendance.filter((a) => a.status === "Absent")
                  .length,
                color: "bg-red-500",
              },
            ].map((row) => (
              <div key={row.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-500">{row.label}</span>
                  <span className="text-zinc-400">{row.count}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-zinc-800">
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-700",
                      row.color,
                    )}
                    style={{
                      width: `${stats.attendance.length ? (row.count / stats.attendance.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 pt-4 border-t border-zinc-800">
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <TrendingUp size={12} className="text-emerald-400" />
              {stats.attendance.length} total records logged
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="card p-5">
          <p className="text-sm font-medium text-zinc-300 mb-4">Quick Access</p>
          <div className="space-y-2">
            {[
              {
                label: "Employees",
                sub: `${stats.employees.length} members`,
                icon: Users,
                to: "/",
                color: "bg-violet-500/10 text-violet-400",
              },
              {
                label: "Task Board",
                sub: `${tasksByStatus[1].value} in progress`,
                icon: Activity,
                to: "/tasks",
                color: "bg-indigo-500/10 text-indigo-400",
              },
              {
                label: "Projects",
                sub: `${stats.projects.length} active`,
                icon: FolderKanban,
                to: "/projects",
                color: "bg-amber-500/10 text-amber-400",
              },
              {
                label: "Attendance",
                sub: `${presentToday} present today`,
                icon: CalendarCheck,
                to: "/attendance",
                color: "bg-emerald-500/10 text-emerald-400",
              },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-zinc-800/60
                  transition-colors group no-underline"
              >
                <div className={cn("p-2 rounded-lg", item.color)}>
                  <item.icon size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-300">
                    {item.label}
                  </p>
                  <p className="text-xs text-zinc-600">{item.sub}</p>
                </div>
                <ArrowRight
                  size={13}
                  className="text-zinc-700 group-hover:text-zinc-400
                  group-hover:translate-x-0.5 transition-all"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-zinc-300 flex items-center gap-2">
            <Clock size={14} className="text-zinc-600" />
            Recent Activity
          </p>
        </div>
        {recentActivity.length > 0 ? (
          <div className="divide-y divide-zinc-800/60">
            {recentActivity.map((a, i) => (
              <ActivityItem key={i} {...a} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-zinc-600 py-8 text-center">
            No recent activity — start adding data.
          </p>
        )}
      </div>
    </main>
  );
};

export default Dashboard;
