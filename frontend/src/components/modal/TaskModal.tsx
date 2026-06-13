// src/components/modals/TaskModal.tsx

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";

export interface Employee {
  user_id: number;
  name: string;
}

export type Priority = "low" | "medium" | "high" | "urgent";

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  assignee_id: number | "";
  due_date: string;
}

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  employees: Employee[];
  onSubmit: (data: TaskFormData) => Promise<void>;
  loading?: boolean;
  defaultStatusLabel?: string;
}

const PRIORITIES: {
  value: Priority;
  label: string;
  cls: string;
}[] = [
    {
      value: "low",
      label: "Low",
      cls: "border-emerald-300 bg-emerald-50 text-emerald-700",
    },
    {
      value: "medium",
      label: "Medium",
      cls: "border-amber-300 bg-amber-50 text-amber-700",
    },
    {
      value: "high",
      label: "High",
      cls: "border-orange-300 bg-orange-50 text-orange-700",
    },
    {
      value: "urgent",
      label: "Urgent",
      cls: "border-red-300 bg-red-50 text-red-700",
    },
  ];

const TaskModal: React.FC<TaskModalProps> = ({
  open,
  onClose,
  employees,
  onSubmit,
  loading = false,
  defaultStatusLabel = "To Do",
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TaskFormData>({
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      assignee_id: "",
      due_date: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [open, onClose]);

  const selectedPriority = watch("priority");

  const onFormSubmit = async (data: TaskFormData) => {
    await onSubmit(data);
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
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
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
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                  New Task
                </h2>

                <p className="text-xs text-slate-400 mt-0.5">
                  Will be added to "{defaultStatusLabel}"
                </p>
              </div>

              <button
                onClick={onClose}
                disabled={loading}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onFormSubmit)}
              noValidate
            >
              <div className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">

                {/* TITLE */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Task Title *
                  </label>

                  <input
                    className={inputBase}
                    placeholder="Fix login page bug"
                    disabled={loading}
                    {...register("title", {
                      required: "Task title is required",
                      maxLength: {
                        value: 300,
                        message: "Maximum 300 characters allowed",
                      },
                    })}
                  />

                  {errors.title && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* DESCRIPTION */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Description
                  </label>

                  <textarea
                    rows={3}
                    className={`${inputBase} resize-none`}
                    placeholder="What needs to be done?"
                    disabled={loading}
                    {...register("description", {
                      maxLength: {
                        value: 2000,
                        message: "Maximum 2000 characters allowed",
                      },
                    })}
                  />

                  {errors.description && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* PRIORITY */}
                <div>
                  <label className="block text-xs font-medium mb-2">
                    Priority
                  </label>

                  <input
                    type="hidden"
                    {...register("priority")}
                  />

                  <div className="grid grid-cols-4 gap-2">
                    {PRIORITIES.map((priority) => (
                      <button
                        key={priority.value}
                        type="button"
                        disabled={loading}
                        onClick={() =>
                          setValue("priority", priority.value)
                        }
                        className={`px-2 py-2 rounded-xl border text-xs font-semibold transition-all ${selectedPriority === priority.value
                            ? priority.cls
                            : "border-slate-200 text-slate-400"
                          }`}
                      >
                        {priority.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ASSIGNEE */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Assign To
                  </label>

                  {/* <select
                    className={inputBase}
                    disabled={loading}
                    {...register("assignee_id", {
                      setValueAs: (value) =>
                        value === "" ? "" : Number(value),
                      message: "Assignee is required",
                    })}
                  >
                    <option value="">
                      — Unassigned —
                    </option>

                    {employees.map((employee) => (
                      <option
                        key={employee.user_id}
                        value={employee.user_id}
                      >
                        {employee.name}
                      </option>
                    ))}
                  </select> */}
                  <select
                    className={inputBase}
                    disabled={loading}
                    {...register("assignee_id", {
                      required: "Assignee is required",
                      setValueAs: (value) =>
                        value === "" ? "" : Number(value),
                    })}
                  >
                    <option value="">— Select Assignee —</option>

                    {employees.map((employee) => (
                      <option
                        key={employee.user_id}
                        value={employee.user_id}
                      >
                        {employee.name}
                      </option>
                    ))}
                  </select>

                  <p className="mt-1 text-xs text-slate-400">
                    Only employees in this workspace appear here.
                  </p>
                  {errors.assignee_id && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.assignee_id.message}
                    </p>
                  )}
                </div>

                {/* DUE DATE */}
                <div>
                  <label className="block text-xs font-medium mb-1">
                    Due Date
                  </label>

                  <input
                    type="date"
                    className={inputBase}
                    disabled={loading}
                    {...register("due_date")}
                  />
                </div>
              </div>

              {/* FOOTER */}
              <div className="flex justify-end gap-2 px-5 py-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl text-sm"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white"
                >
                  {loading && (
                    <Loader2
                      size={14}
                      className="animate-spin"
                    />
                  )}

                  Create Task
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