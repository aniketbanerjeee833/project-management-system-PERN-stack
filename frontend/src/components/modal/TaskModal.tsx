// src/components/modals/TaskModal.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";


// ─── Types ────────────────────────────────────────────────────────────────────

export interface Employee {
  user_id: number;
  name:    string;
}

export type Priority = "low" | "medium" | "high" | "urgent";

export interface TaskFormData {
  title:        string;
  description:  string;
  priority:     Priority;
  assignee_id:  number | "";
  due_date:     string;
}

interface TaskModalProps {
  open:       boolean;
  onClose:    () => void;
  employees:  Employee[];
  onSubmit:   (data: TaskFormData) => Promise<void>;
  loading?:   boolean;
  /** Pre-fill status column the task will land in — display only */
  defaultStatusLabel?: string;
}

const EMPTY: TaskFormData = {
  title:       "",
  description: "",
  priority:    "medium",
  assignee_id: "",
  due_date:    "",
};

const PRIORITIES: { value: Priority; label: string; cls: string }[] = [
  { value: "low",    label: "Low",    cls: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" },
  { value: "medium", label: "Medium", cls: "border-amber-300 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" },
  { value: "high",   label: "High",   cls: "border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
  { value: "urgent", label: "Urgent", cls: "border-red-300 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const TaskModal: React.FC<TaskModalProps> = ({
  open, onClose, employees, onSubmit, loading = false, defaultStatusLabel = "To Do",
}) => {
  const [form, setForm]     = useState<TaskFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});
   
  useEffect(() => {
    if (open) {
      setForm(EMPTY);
      setErrors({});
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const set = <K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.title.trim()) errs.title = "Task title is required.";
    if (form.title.length > 300) errs.title = "Max 300 characters.";
    if (form.description.length > 2000) errs.description = "Max 2000 characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const inputBase =
    "w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 " +
    "px-3 py-2 text-sm text-slate-800 dark:text-slate-200 outline-none " +
    "focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors disabled:opacity-50";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">New task</h2>
                <p className="text-xs text-slate-400 mt-0.5">Will be added to "{defaultStatusLabel}"</p>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">

                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Task title <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputBase}
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. Fix login page bug"
                    disabled={loading}
                    maxLength={300}
                  />
                  {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Description
                  </label>
                  <textarea
                    className={`${inputBase} resize-none`}
                    rows={3}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="What needs to be done?"
                    disabled={loading}
                    maxLength={2000}
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Priority
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {PRIORITIES.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => set("priority", p.value)}
                        disabled={loading}
                        className={`px-2 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          form.priority === p.value
                            ? p.cls
                            : "border-slate-200 dark:border-slate-700 text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Assign to
                  </label>
                  <select
                    className={inputBase}
                    value={form.assignee_id}
                    onChange={(e) =>
                      set("assignee_id", e.target.value === "" ? "" : Number(e.target.value))
                    }
                    disabled={loading}
                  >
                    <option value="">— Unassigned —</option>
                    {employees.map((e) => (
                      <option key={e.user_id} value={e.user_id}>{e.name}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-400">
                    Only employees in this workspace appear here.
                  </p>
                </div>

                {/* Due date */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Due date
                  </label>
                  <input
                    type="date"
                    className={inputBase}
                    value={form.due_date}
                    onChange={(e) => set("due_date", e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-60"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  Create task
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal;