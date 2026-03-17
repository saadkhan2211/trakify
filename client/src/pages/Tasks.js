import React, { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Pencil } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";
import api from "../api/axios";
import { EditModal } from "../components/EditModal";

const COLUMNS = [
  {
    id: "Pending",
    label: "Pending",
    dot: "bg-zinc-500",
    titleClass: "text-zinc-400",
    count: "bg-zinc-800 text-zinc-400",
  },
  {
    id: "In Progress",
    label: "In Progress",
    dot: "bg-amber-400",
    titleClass: "text-amber-400",
    count: "bg-amber-500/15 text-amber-400",
  },
  {
    id: "Completed",
    label: "Completed",
    dot: "bg-emerald-400",
    titleClass: "text-emerald-400",
    count: "bg-emerald-500/15 text-emerald-400",
  },
];

const EDIT_FIELDS = [
  { key: "title", label: "Title", type: "text", placeholder: "Task title" },
  {
    key: "description",
    label: "Description",
    type: "textarea",
    placeholder: "Optional description",
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: COLUMNS.map((c) => ({ value: c.id, label: c.label })),
  },
];

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "Pending",
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch {
      toast.error("Failed to fetch tasks");
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      toast.error("Task title is required");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/tasks", form);
      if (res.status === 201) {
        toast.success("Task created");
        setForm({ title: "", description: "", status: "Pending" });
        setShowForm(false);
        fetchTasks();
      }
    } catch {
      toast.error("Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleEdit = async (updated) => {
    setSaving(true);
    try {
      await api.put(`/tasks/${editTarget._id}`, updated);
      toast.success("Task updated");
      setEditTarget(null);
      fetchTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  };

  const handleDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    setTasks((prev) =>
      prev.map((t) =>
        t._id === draggableId ? { ...t, status: destination.droppableId } : t,
      ),
    );
    try {
      await api.patch(`/tasks/${draggableId}`, {
        status: destination.droppableId,
      });
      toast.success("Task moved");
    } catch {
      toast.error("Failed to update task");
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const colTasks = (colId) => tasks.filter((t) => t.status === colId);

  return (
    <main className="mx-auto max-w-screen-xl px-6 py-10 animate-fade-in">
      <EditModal
        open={editTarget !== null}
        title="Edit Task"
        fields={EDIT_FIELDS}
        values={editTarget || {}}
        onClose={() => setEditTarget(null)}
        onSave={handleEdit}
        loading={saving}
      />

      {/* Header */}
      <div className="page-header flex items-start justify-between">
        <div>
          <p className="section-label mb-1.5">Workflow</p>
          <h1 className="page-title">Task Board</h1>
          <p className="page-subtitle">
            Drag cards between columns to update status.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
          <Plus size={15} />
          New Task
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card mb-8 p-5 animate-slide-up">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-zinc-600">
            New Task
          </p>
          <div className="flex flex-wrap gap-3">
            <input
              className="input flex-1 min-w-[180px]"
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              className="input flex-[2] min-w-[220px]"
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <select
              className="input w-40"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {COLUMNS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                className="btn-primary"
                onClick={handleSubmit}
                disabled={loading}
              >
                <Plus size={14} />
                {loading ? "Adding…" : "Add"}
              </button>
              <button className="btn-ghost" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {COLUMNS.map((col) => (
            <div key={col.id} className="kanban-col">
              <div className="kanban-col-title">
                <span className={cn("h-2 w-2 rounded-full", col.dot)} />
                <span className={cn("flex-1", col.titleClass)}>
                  {col.label}
                </span>
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] font-semibold",
                    col.count,
                  )}
                >
                  {colTasks(col.id).length}
                </span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 rounded-lg transition-colors duration-150 min-h-[60px]",
                      snapshot.isDraggingOver && "bg-zinc-800/40",
                    )}
                  >
                    {colTasks(col.id).map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={cn(
                              "kanban-card group",
                              snapshot.isDragging &&
                                "rotate-1 shadow-card-hover border-zinc-600",
                            )}
                          >
                            <div className="flex items-start gap-2">
                              <div
                                {...provided.dragHandleProps}
                                className="mt-0.5 shrink-0 text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
                              >
                                <GripVertical size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm text-zinc-200 leading-snug">
                                  {task.title}
                                </p>
                                {task.description && (
                                  <p className="mt-1 text-xs text-zinc-500 leading-relaxed line-clamp-2">
                                    {task.description}
                                  </p>
                                )}
                              </div>
                              {/* Action buttons — show on hover */}
                              <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                  className="p-1 text-zinc-600 hover:text-zinc-300 transition-colors"
                                  onClick={() => setEditTarget(task)}
                                >
                                  <Pencil size={12} />
                                </button>
                                <button
                                  className="p-1 text-zinc-700 hover:text-red-400 transition-colors"
                                  onClick={() => handleDelete(task._id)}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {colTasks(col.id).length === 0 &&
                      !snapshot.isDraggingOver && (
                        <div className="flex items-center justify-center h-20 rounded-lg border border-dashed border-zinc-800">
                          <p className="text-xs text-zinc-700">
                            Drop tasks here
                          </p>
                        </div>
                      )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </main>
  );
};

export default Tasks;
