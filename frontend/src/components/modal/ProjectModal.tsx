import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Manager {
  id: number;
  name: string;
  user_id: number;
}

export interface ProjectFormData {
  name: string;
  description: string;
  manager_id: number | '';
  start_date: string;
  due_date: string;
  status: 'active' | 'hold' | 'completed' 
}

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * Pass a project to edit it, omit (or pass null) to create a new one.
   * Only the fields present in ProjectFormData are needed.
   */
  project?: (ProjectFormData & { id: number }) | null;
  /** Workspace managers fetched from the backend */
  managers: Manager[];
  onSubmit: (data: ProjectFormData) => Promise<void>;
  /** If true the submit button shows a spinner and inputs are disabled */
  loading?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const EMPTY: ProjectFormData = {
  name: '',
  description: '',
  manager_id: '',
  start_date: '',
  due_date: '',
  status: 'active',
};

// ─── Component ────────────────────────────────────────────────────────────────

const ProjectModal = ({
  open,
  onClose,
  project,
  managers,
  onSubmit,
  loading = false,
}: ProjectModalProps) => {
  const isEdit = Boolean(project);

  const [form, setForm] = useState<ProjectFormData>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});
  console.log(managers);
  // Populate form when editing, reset when creating
  useEffect(() => {
    if (open) {
      setForm(project ? { ...project } : { ...EMPTY });
      setErrors({});
    }
  }, [open, project]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // const set = <K extends keyof ProjectFormData>(key: K, value: ProjectFormData[K]) => {
  //   setForm(prev => ({ ...prev, [key]: value }));
  //   if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  // };
// const [name, setName] = useState("");
// const [description, setDescription] = useState("");
// const [managerId, setManagerId] = useState<number | "">("");
// const [startDate, setStartDate] = useState("");
// const [dueDate, setDueDate] = useState("");
// const [status, setStatus] = useState("active");
  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = 'Project name is required.';
    if (form.name.length > 200) newErrors.name = 'Max 200 characters.';
    if (form.description.length > 2000) newErrors.description = 'Max 2000 characters.';
    if (form.start_date && form.due_date && form.due_date < form.start_date)
      newErrors.due_date = 'Due date must be after start date.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const inputBase =
    'w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 ' +
    'px-3 py-2 text-sm text-slate-800 dark:text-slate-200 ' +
    'outline-none focus:border-indigo-400 dark:focus:border-indigo-500 transition-colors ' +
    'disabled:opacity-50 disabled:cursor-not-allowed';

  const fieldError = (key: keyof ProjectFormData) =>
    errors[key] ? (
      <p className="mt-1 text-xs text-red-500">{errors[key]}</p>
    ) : null;
    console.log(form);
  return (
    <AnimatePresence>
      {open && (
        // Backdrop
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {isEdit ? 'Edit project' : 'New project'}
              </h2>
              <button
                onClick={onClose}
                disabled={loading}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate>
              <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">

                {/* Name */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Project name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={inputBase}
                    value={form.name}
                    // onChange={e => set('name', e.target.value)}
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} // inline set to avoid creating set function 
                    placeholder="e.g. Website Redesign"
                    disabled={loading}
                    maxLength={200}
                  />
                  {fieldError('name')}
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
                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What is this project about?"
                    disabled={loading}
                    maxLength={2000}
                  />
                  <p className="mt-0.5 text-right text-xs text-slate-400">
                    {form.description.length}/2000
                  </p>
                  {fieldError('description')}
                </div>

                {/* Manager */}
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Assign manager
                  </label>
                  <select
                    className={inputBase}
                    value={form.manager_id}
                    onChange={e => setForm(prev => ({ ...prev, manager_id: e.target.value === '' ? 
                      '' : Number(e.target.value) }))}
                    disabled={loading}
                  >
                    <option value="">— No manager yet —</option>
                    {managers.map(m => (
                      <option key={m?.user_id} value={m?.user_id}>{m.name}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-slate-400">
                    Only workspace members with role "manager" appear here.
                  </p>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Start date
                    </label>
                    <input
                      type="date"
                      className={inputBase}
                      value={form.start_date}
                      // onChange={e => set('start_date', e.target.value)}
                      onChange={e => setForm(prev => ({ ...prev, start_date: e.target.value }))}
                      disabled={loading}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Due date
                    </label>
                    <input
                      type="date"
                      className={inputBase}
                      value={form.due_date}
                      // onChange={e => set('due_date', e.target.value)}
                      onChange={e => setForm(prev => ({ ...prev, due_date: e.target.value }))}
                      disabled={loading}
                    />
                    {fieldError('due_date')}
                  </div>
                </div>

                {/* Status — only shown when editing */}
                {isEdit && (
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Status
                    </label>
                    <select
                      className={inputBase}
                      value={form.status}
                      // onChange={e => set('status', e.target.value as ProjectFormData['status'])}
                      onChange={e => setForm(prev => ({ ...prev, status: e.target.value as ProjectFormData['status'] }))}
                      disabled={loading}
                    >
                      <option value="active">Active</option>
                      <option value="on_hold">On hold</option>
                      <option value="completed">Completed</option>
                     
                    </select>
                  </div>
                )}
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
                  {isEdit ? 'Save changes' : 'Create project'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;