import React, { useEffect, useState } from "react";
import { UserPlus, Trash2, Users, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { EditModal } from "../components/EditModal";

const avatarColor = (name) => {
  const colors = [
    "bg-violet-500/20 text-violet-400",
    "bg-blue-500/20 text-blue-400",
    "bg-emerald-500/20 text-emerald-400",
    "bg-amber-500/20 text-amber-400",
    "bg-rose-500/20 text-rose-400",
    "bg-cyan-500/20 text-cyan-400",
  ];
  return colors[(name?.charCodeAt(0) || 0) % colors.length];
};
const initials = (name) =>
  name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

const EDIT_FIELDS = [
  { key: "name", label: "Full Name", type: "text", placeholder: "Jane Doe" },
  {
    key: "email",
    label: "Email Address",
    type: "email",
    placeholder: "jane@company.com",
  },
  {
    key: "position",
    label: "Position / Role",
    type: "text",
    placeholder: "Senior Engineer",
  },
];

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", position: "" });
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch {
      toast.error("Failed to load employees.");
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.email.trim() || !form.position.trim()) {
      toast.error("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/employees", form);
      toast.success("Employee added.");
      setForm({ name: "", email: "", position: "" });
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding employee.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      toast.success("Employee removed.");
      fetchEmployees();
    } catch {
      toast.error("Failed to delete employee.");
    }
  };

  const handleEdit = async (updated) => {
    setSaving(true);
    try {
      await api.put(`/employees/${editTarget._id}`, updated);
      toast.success("Employee updated.");
      setEditTarget(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <main className="mx-auto max-w-screen-xl px-6 py-10 animate-fade-in">
      <EditModal
        open={editTarget !== null}
        title="Edit Employee"
        fields={EDIT_FIELDS}
        values={editTarget || {}}
        onClose={() => setEditTarget(null)}
        onSave={handleEdit}
        loading={saving}
      />

      <div className="page-header flex items-start justify-between">
        <div>
          <p className="section-label mb-1.5">People</p>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">
            Manage your organization's team members.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
          <Users size={16} className="text-zinc-500" />
          <span className="text-sm font-semibold text-zinc-100">
            {employees.length}
          </span>
          <span className="text-xs text-zinc-500">total</span>
        </div>
      </div>

      <div className="card mb-8 p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-600">
          Add New Employee
        </p>
        <div className="flex flex-wrap gap-3">
          <input
            className="input flex-1 min-w-[180px]"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input flex-1 min-w-[180px]"
            placeholder="Email address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="input flex-1 min-w-[180px]"
            placeholder="Position / Role"
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
          />
          <button
            className="btn-primary shrink-0"
            onClick={handleSubmit}
            disabled={loading}
          >
            <UserPlus size={15} />
            {loading ? "Adding..." : "Add Employee"}
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="tbl">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Email</th>
              <th>Position</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp._id} className="animate-slide-up">
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold ${avatarColor(emp.name)}`}
                      >
                        {initials(emp.name)}
                      </div>
                      <span className="font-medium text-zinc-200">
                        {emp.name}
                      </span>
                    </div>
                  </td>
                  <td className="text-zinc-400 font-mono text-xs">
                    {emp.email}
                  </td>
                  <td>
                    <span className="inline-flex rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                      {emp.position}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="btn-ghost text-xs py-1.5 px-2.5"
                        onClick={() => setEditTarget(emp)}
                      >
                        <Pencil size={13} />
                        Edit
                      </button>
                      <button
                        className="btn-danger"
                        onClick={() => handleDelete(emp._id)}
                      >
                        <Trash2 size={13} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-16 text-center text-zinc-600">
                  No employees yet — add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Employees;
