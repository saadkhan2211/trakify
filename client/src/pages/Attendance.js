// src/pages/Attendance.js — upgraded with calendar heatmap + CSV export
import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Trash2,
  CalendarCheck,
  TrendingUp,
  Grid3x3,
  List,
  Download,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";
import api from "../api/axios";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const toKey = (d) => {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
};

const exportCSV = (attendance) => {
  const rows = attendance
    .map(
      (a) =>
        `"${a.employee?.name || a.employee}","${formatDate(a.date)}","${a.status}"`,
    )
    .join("\n");
  const blob = new Blob(["Employee,Date,Status\n" + rows], {
    type: "text/csv",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "attendance.csv";
  a.click();
  URL.revokeObjectURL(url);
  toast.success("CSV exported.");
};

/* ── Calendar Heatmap ────────────────────────────── */
const CalendarHeatmap = ({ records, year }) => {
  const map = {};
  records.forEach((r) => {
    map[toKey(r.date)] = r.status;
  });

  const months = Array.from({ length: 12 }, (_, m) => {
    const first = new Date(year, m, 1);
    const days = [];
    for (let p = 0; p < first.getDay(); p++) days.push(null);
    for (let d = 1; d <= new Date(year, m + 1, 0).getDate(); d++)
      days.push(new Date(year, m, d));
    return { label: MONTHS[m], days };
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[520px]">
        <div className="flex gap-1 mb-1 pl-10">
          {DAYS.map((d) => (
            <div key={d} className="w-6 text-center text-[9px] text-zinc-600">
              {d}
            </div>
          ))}
        </div>
        <div className="space-y-1.5">
          {months.map(({ label, days }) => (
            <div key={label} className="flex items-center gap-1">
              <span className="w-8 shrink-0 text-[10px] text-zinc-600 text-right pr-2">
                {label}
              </span>
              <div className="flex flex-wrap gap-1">
                {days.map((day, i) => {
                  if (!day)
                    return (
                      <div key={i} className="h-6 w-6 rounded-sm opacity-0" />
                    );
                  const key = toKey(day),
                    status = map[key];
                  return (
                    <div
                      key={key}
                      title={`${day.toDateString()} — ${status || "No record"}`}
                      className={cn(
                        "h-6 w-6 rounded-sm transition-all cursor-default",
                        status === "Present" &&
                          "bg-emerald-500/80 hover:bg-emerald-400",
                        status === "Absent" && "bg-red-500/60 hover:bg-red-400",
                        !status && "bg-zinc-800/80 hover:bg-zinc-700",
                      )}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 text-[10px] text-zinc-600">
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-zinc-800" /> No record
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-emerald-500/80" /> Present
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-red-500/60" /> Absent
          </span>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════ */
const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState({ employee: "", status: "Present" });
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("table");
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  const fetchAttendance = async () => {
    try {
      const res = await api.get("/attendance");
      setAttendance(res.data);
    } catch {
      toast.error("Failed to load attendance data.");
    }
  };

  const handleSubmit = async () => {
    if (!form.employee.trim()) {
      toast.error("Enter employee name or ID.");
      return;
    }
    setLoading(true);
    const payload = {
      ...(form.employee.match(/^[0-9a-fA-F]{24}$/)
        ? { employee: form.employee }
        : { employeeName: form.employee }),
      status: form.status,
      date: new Date(),
    };
    try {
      const res = await api.post("/attendance", payload);
      if (res.status === 201) {
        toast.success("Attendance marked.");
        setForm({ employee: "", status: "Present" });
        fetchAttendance();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to mark attendance.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/attendance/${id}`);
      toast.success("Record deleted.");
      fetchAttendance();
    } catch {
      toast.error("Failed to delete record.");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const presentCount = attendance.filter((a) => a.status === "Present").length;
  const absentCount = attendance.filter((a) => a.status === "Absent").length;
  const rate = attendance.length
    ? Math.round((presentCount / attendance.length) * 100)
    : 0;

  return (
    <main className="mx-auto max-w-screen-xl px-6 py-10 animate-fade-in">
      <div className="page-header flex items-start justify-between flex-wrap gap-4">
        <div>
          <p className="section-label mb-1.5">HR</p>
          <h1 className="page-title">Attendance Tracker</h1>
          <p className="page-subtitle">
            Record, monitor, and export employee attendance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportCSV(attendance)}
            className="btn-ghost text-xs gap-1.5"
          >
            <Download size={13} /> Export CSV
          </button>
          <div className="flex rounded-lg border border-zinc-700 overflow-hidden">
            {[
              ["table", <List size={13} />],
              ["calendar", <Grid3x3 size={13} />],
            ].map(([v, icon]) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors capitalize",
                  view === v
                    ? "bg-zinc-700 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                {icon}
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-4">
        {[
          ["Total Records", attendance.length, "text-zinc-100"],
          ["Present", presentCount, "text-emerald-400"],
          ["Absent", absentCount, "text-red-400"],
        ].map(([label, val, cls]) => (
          <div key={label} className="card p-4 text-center">
            <p className="text-xs text-zinc-500 mb-1">{label}</p>
            <p className={cn("text-2xl font-semibold", cls)}>{val}</p>
          </div>
        ))}
      </div>

      {attendance.length > 0 && (
        <div className="card mb-8 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <TrendingUp size={14} className="text-emerald-400" />
              Overall Attendance Rate
            </div>
            <span
              className={cn(
                "text-sm font-semibold",
                rate >= 80
                  ? "text-emerald-400"
                  : rate >= 60
                    ? "text-amber-400"
                    : "text-red-400",
              )}
            >
              {rate}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-zinc-800">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                rate >= 80
                  ? "bg-emerald-500"
                  : rate >= 60
                    ? "bg-amber-500"
                    : "bg-red-500",
              )}
              style={{ width: `${rate}%` }}
            />
          </div>
        </div>
      )}

      <div className="card mb-8 p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-600">
          Mark Attendance
        </p>
        <div className="flex flex-wrap gap-3 items-center">
          <input
            className="input flex-1 min-w-[220px]"
            placeholder="Employee name or MongoDB ID"
            value={form.employee}
            onChange={(e) => setForm({ ...form, employee: e.target.value })}
          />
          <div className="flex rounded-lg border border-zinc-700 overflow-hidden shrink-0">
            {["Present", "Absent"].map((s) => (
              <button
                key={s}
                onClick={() => setForm({ ...form, status: s })}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium transition-all duration-150 flex items-center gap-2",
                  form.status === s
                    ? s === "Present"
                      ? "bg-emerald-600 text-white"
                      : "bg-red-600 text-white"
                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800",
                )}
              >
                {s === "Present" ? (
                  <CheckCircle2 size={14} />
                ) : (
                  <XCircle size={14} />
                )}
                {s}
              </button>
            ))}
          </div>
          <button
            className="btn-primary shrink-0"
            onClick={handleSubmit}
            disabled={loading}
          >
            <CalendarCheck size={15} />
            {loading ? "Saving…" : "Mark"}
          </button>
        </div>
      </div>

      {view === "calendar" && (
        <div className="card p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium text-zinc-300">
              Attendance Heatmap — {calYear}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCalYear((y) => y - 1)}
                className="btn-ghost text-xs px-2 py-1"
              >
                ← {calYear - 1}
              </button>
              <button
                onClick={() => setCalYear((y) => y + 1)}
                className="btn-ghost text-xs px-2 py-1"
              >
                {calYear + 1} →
              </button>
            </div>
          </div>
          <CalendarHeatmap
            records={attendance.filter(
              (a) => new Date(a.date).getFullYear() === calYear,
            )}
            year={calYear}
          />
        </div>
      )}

      {view === "table" && (
        <div className="table-wrapper">
          <table className="tbl">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendance.length > 0 ? (
                attendance.map((a) => (
                  <tr key={a._id}>
                    <td className="font-medium text-zinc-200">
                      {a.employee?.name || a.employee}
                    </td>
                    <td className="text-zinc-500 text-xs font-mono">
                      {formatDate(a.date)}
                    </td>
                    <td>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
                          a.status === "Present"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400",
                        )}
                      >
                        {a.status === "Present" ? (
                          <CheckCircle2 size={11} />
                        ) : (
                          <XCircle size={11} />
                        )}
                        {a.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(a._id)}
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-zinc-600">
                    No attendance records yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
};

export default Attendance;
