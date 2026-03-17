import React, { useEffect, useState } from "react";
import { FolderPlus, Trash2, FolderKanban, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { EditModal } from "../components/EditModal";

const STATUS_COLORS = [
  "border-l-violet-500",
  "border-l-blue-500",
  "border-l-emerald-500",
  "border-l-amber-500",
  "border-l-rose-500",
  "border-l-cyan-500",
];
const EDIT_FIELDS = [
  {
    key: "name",
    label: "Project Name",
    type: "text",
    placeholder: "My Project",
  },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    placeholder: "What is this project about?",
  },
];

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch {
      toast.error("Failed to load projects.");
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.description.trim()) {
      toast.error("Please fill all fields.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/projects", form);
      toast.success("Project created.");
      setForm({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding project.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success("Project deleted.");
      fetchProjects();
    } catch {
      toast.error("Failed to delete project.");
    }
  };

  const handleEdit = async (updated) => {
    setSaving(true);
    try {
      await api.put(`/projects/${editTarget._id}`, updated);
      toast.success("Project updated.");
      setEditTarget(null);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <main className="mx-auto max-w-screen-xl px-6 py-10 animate-fade-in">
      <EditModal
        open={editTarget !== null}
        title="Edit Project"
        fields={EDIT_FIELDS}
        values={editTarget || {}}
        onClose={() => setEditTarget(null)}
        onSave={handleEdit}
        loading={saving}
      />

      <div className="page-header flex items-start justify-between">
        <div>
          <p className="section-label mb-1.5">Workspace</p>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">
            Track active projects across your organization.
          </p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-center">
          <p className="text-xl font-semibold text-zinc-100">
            {projects.length}
          </p>
          <p className="text-xs text-zinc-500">projects</p>
        </div>
      </div>

      <div className="card mb-10 p-5">
        <p className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-600">
          New Project
        </p>
        <div className="flex flex-wrap gap-3">
          <input
            className="input flex-1 min-w-[180px]"
            placeholder="Project name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="input flex-[2] min-w-[220px]"
            placeholder="Short description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button
            className="btn-primary shrink-0"
            onClick={handleSubmit}
            disabled={loading}
          >
            <FolderPlus size={15} />
            {loading ? "Creating…" : "Create Project"}
          </button>
        </div>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <div
              key={p._id}
              className={`card border-l-4 ${STATUS_COLORS[i % STATUS_COLORS.length]} p-5 group hover:border-zinc-700 transition-all duration-150 animate-slide-up`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800">
                  <FolderKanban size={18} className="text-zinc-400" />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="btn-ghost text-xs py-1 px-2"
                    onClick={() => setEditTarget(p)}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    className="btn-danger py-1 px-2 text-xs"
                    onClick={() => handleDelete(p._id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold text-zinc-100 mb-1 leading-snug">
                {p.name}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {p.description}
              </p>
              <div className="mt-4 h-1 w-full rounded-full bg-zinc-800">
                <div
                  className="h-1 rounded-full bg-accent/60"
                  style={{ width: `${30 + ((i * 17) % 60)}%` }}
                />
              </div>
              <p className="mt-1.5 text-right text-[10px] text-zinc-600">
                {30 + ((i * 17) % 60)}% complete
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 py-20 text-center">
          <FolderKanban size={32} className="mb-3 text-zinc-700" />
          <p className="text-sm text-zinc-600">No projects yet.</p>
        </div>
      )}
    </main>
  );
};

export default Projects;
