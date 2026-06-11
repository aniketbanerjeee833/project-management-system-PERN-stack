// src/pages/manager/ProjectKanban.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "../../hooks/AuthContext";
import { useMemberQueries } from "../../hooks/api/useMemberQueries";
import { useTaskQueries } from "../../hooks/api/useTaskQueries";
import TaskModal, { type TaskFormData } from "../../components/modal/TaskModal";
import Avatar from "../../components/shared/Avatar";
import type { Task } from "../../types";


// ─── Column config ──────────────────────────────────────────────────────────────

const columns: { id: Task["status"]; label: string; color: string }[] = [
  { id: "todo",        label: "To Do",       color: "bg-blue-400"   },
  { id: "in_progress", label: "In Progress", color: "bg-indigo-500" },
  { id: "review",      label: "Review",      color: "bg-purple-500" },
  { id: "done",        label: "Done",        color: "bg-emerald-500" },
];

const priorityCls: Record<Task["priority"], string> = {
  low:    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
  medium: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
  high:   "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300",
  urgent: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300",
};

// ─── Task card ────────────────────────────────────────────────────────────────

const KanbanCard: React.FC<{ task: Task; index: number }> = ({ task, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04 }}
    whileHover={{ y: -2, boxShadow: "0 20px 45px rgba(15,23,42,0.08)" }}
    className="bg-white dark:bg-slate-700/80 border border-slate-200/60 dark:border-slate-600/60 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all"
  >
    <div className="flex items-start justify-between mb-2.5">
      <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug flex-1 pr-2">
        {task.title}
      </h4>
      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 capitalize ${priorityCls[task.priority]}`}>
        {task.priority}
      </span>
    </div>

    {task.description && (
      <p className="text-[10px] text-slate-400 mb-3 line-clamp-2">{task.description}</p>
    )}

    <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-600/50">
      {task?.assignee_name ? (
        <div className="flex items-center gap-1.5">
          <Avatar
            initials={task?.assignee_name.split(" ").map((n) => n[0]).join("").toUpperCase()}
            size="xs"
          />
          <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[80px]">
            {task?.assignee_name}
          </span>
        </div>
      ) : (
        <span className="text-[10px] text-slate-300 dark:text-slate-600 italic">Unassigned</span>
      )}

      {task.due_date && (
        <span className="text-[10px] text-slate-400">
          {new Date(task.due_date).toLocaleDateString("en", { month: "short", day: "numeric" })}
        </span>
      )}
    </div>
  </motion.div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const ProjectKanban: React.FC = () => {
  const { slug, projectId } = useParams<{ slug: string; projectId: string }>();
  const navigate = useNavigate();
  const { workspace ,role} = useAuth();
  const workspaceId = Number(workspace?.id);
  const projectIdNum = Number(projectId);

  const [modalOpen, setModalOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<Task["status"]>("todo");

  // ── Data ──────────────────────────────────────────────────────────────────
  const { employees } = useMemberQueries({workspaceId,role:role!});
  // const { tasks, createTask } = useTaskQueries(workspaceId, projectIdNum);
 const { createTask , tasks} = useTaskQueries(workspaceId, projectIdNum);
  const taskList = tasks.data ?? [];
  const employeeList = employees.data ?? [];
  console.log(employeeList, "employeeList",taskList);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openAddTask = (status: Task["status"]) => {
    setTargetStatus(status);
    setModalOpen(true);
  };

  const handleCreateTask = async (form: TaskFormData) => {
    await createTask.mutateAsync({
  project_id: projectIdNum,
  title: form.title,
  description: form.description || undefined,
  priority: form.priority,
  assignee_id:form.assignee_id === ""? undefined: form.assignee_id,
  due_date: form.due_date || undefined,
});
    // await createTask.mutateAsync({
    //   title:       form.title,
    //   description: form.description || undefined,
    //   priority:    form.priority,
    //   assignee_id: form.assignee_id === "" ? undefined : form.assignee_id,
    //   due_date:    form.due_date || undefined,
    //   // status not sent — backend defaults to 'todo'
    //   // If you want per-column "Add" to set initial status,
    //   // your createTaskService needs to accept `status` too.
    // });
    setModalOpen(false);
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (tasks.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/${slug}/manager/projects`)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft size={16} className="text-slate-500" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kanban Board</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {taskList.length} task{taskList.length !== 1 && "s"} in this project
            </p>
          </div>
        </div>

        <button
          onClick={() => openAddTask("todo")}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-500/25"
        >
          <Plus size={15} />
          Add Task
        </button>
      </motion.div>

      {/* Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
        {columns.map((col, ci) => {
          const colTasks = taskList.filter((t) => t.status === col.id);
          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: ci * 0.06 }}
              className="flex-shrink-0 w-72 flex flex-col"
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{col.label}</span>
                  <span className="w-5 h-5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center text-[10px] font-bold">
                    {colTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => openAddTask(col.id)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Plus size={13} className="text-slate-400" />
                </button>
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-2.5 bg-slate-100/50 dark:bg-slate-800/40 rounded-2xl p-2.5 min-h-[400px]">
                {colTasks.map((task, i) => (
                  <KanbanCard key={task.id} task={task} index={i} />
                ))}
                {colTasks.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-slate-300 dark:text-slate-600 text-xs">
                    No tasks
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <TaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        employees={employeeList}
        onSubmit={handleCreateTask}
        loading={createTask.isPending}
        defaultStatusLabel={columns.find((c) => c.id === targetStatus)?.label ?? "To Do"}
      />
    </div>
  );
};

export default ProjectKanban;