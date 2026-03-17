// src/components/EditModal.js
// ─────────────────────────────────────────────────────
// Generic reusable edit modal.
// Usage:
//   <EditModal
//     open={editTarget !== null}
//     title="Edit Employee"
//     fields={[{ key:"name", label:"Full Name", type:"text" }, ...]}
//     values={editTarget}
//     onClose={() => setEditTarget(null)}
//     onSave={handleSave}
//     loading={saving}
//   />
// ─────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import { X, Save } from "lucide-react";
import { cn } from "../lib/utils";

export const EditModal = ({
  open,
  title,
  fields = [],
  values = {},
  onClose,
  onSave,
  loading = false,
}) => {
  const [form, setForm] = useState(values);

  // sync when values changes (new target selected)
  useEffect(() => {
    setForm(values);
  }, [values]);

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      {/* Modal */}
      <div
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-md",
          "-translate-x-1/2 -translate-y-1/2",
          "card p-6 shadow-2xl animate-slide-up",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-300 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  className="input resize-none h-20"
                  value={form[field.key] || ""}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder || ""}
                />
              ) : field.type === "select" ? (
                <select
                  className="input"
                  value={form[field.key] || ""}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  className="input"
                  value={form[field.key] || ""}
                  onChange={(e) =>
                    setForm({ ...form, [field.key]: e.target.value })
                  }
                  placeholder={field.placeholder || ""}
                />
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Save size={14} />
              )}
              {loading ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
