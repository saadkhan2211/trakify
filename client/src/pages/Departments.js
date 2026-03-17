import React, { useEffect, useState } from "react";
import { Building2, Plus, Trash2, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { EditModal } from "../components/EditModal";

const DEPT_ICONS = ["🏗️", "💻", "📊", "🎨", "🔬", "📦", "🤝", "⚙️"];
const EDIT_FIELDS = [
  {
    key: "name",
    label: "Department Name",
    type: "text",
    placeholder: "Engineering",
  },
];

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments");
      setDepartments(res.data);
    } catch {
      toast.error("Failed to fetch departments.");
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Enter a department name.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/departments", { name });
      toast.success("Department created.");
      setName("");
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding department.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;
    try {
      await api.delete(`/departments/${id}`);
      toast.success("Department deleted.");
      fetchDepartments();
    } catch {
      toast.error("Failed to delete department.");
    }
  };

  const handleEdit = async (updated) => {
    setSaving(true);
    try {
      await api.put(`/departments/${editTarget._id}`, updated);
      toast.success("Department updated.");
      setEditTarget(null);
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <main className="mx-auto max-w-screen-xl px-6 py-10 animate-fade-in">
      <EditModal
        open={editTarget !== null}
        title="Edit Department"
        fields={EDIT_FIELDS}
        values={editTarget || {}}
        onClose={() => setEditTarget(null)}
        onSave={handleEdit}
        loading={saving}
      />

      <div className="page-header">
        <p className="section-label mb-1.5">Structure</p>
        <h1 className="page-title">Departments</h1>
        <p className="page-subtitle">
          Organize your company into functional teams.
        </p>
      </div>

      <div className="card mb-10 p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-600">
          New Department
        </p>
        <div className="flex gap-3">
          <input
            className="input flex-1"
            placeholder="e.g. Engineering, Marketing, Finance…"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button
            className="btn-primary shrink-0"
            onClick={handleSubmit}
            disabled={loading}
          >
            <Plus size={15} />
            {loading ? "Creating…" : "Create"}
          </button>
        </div>
      </div>

      {departments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, i) => (
            <div
              key={dept._id}
              className="card flex items-center justify-between p-5 animate-slide-up group hover:border-zinc-700 transition-all duration-150"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-800 text-xl">
                  {DEPT_ICONS[i % DEPT_ICONS.length]}
                </div>
                <div>
                  <p className="font-semibold text-zinc-100">{dept.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Department</p>
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="btn-ghost text-xs py-1.5 px-2"
                  onClick={() => setEditTarget(dept)}
                >
                  <Pencil size={13} />
                </button>
                <button
                  className="btn-danger py-1.5 px-2"
                  onClick={() => handleDelete(dept._id)}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-20 text-center">
          <Building2 size={32} className="mb-3 text-zinc-700" />
          <p className="text-sm text-zinc-600">No departments yet.</p>
        </div>
      )}
    </main>
  );
};

export default Departments;
