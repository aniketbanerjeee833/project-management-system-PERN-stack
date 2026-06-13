// // src/pages/manager/ProjectKanban.tsx
// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Plus, ArrowLeft, Loader2 } from "lucide-react";
// import { useAuth } from "../../hooks/AuthContext";
// import { useMemberQueries } from "../../hooks/api/useMemberQueries";
// import { useTaskQueries } from "../../hooks/api/useTaskQueries";
// import TaskModal, { type TaskFormData } from "../../components/modal/TaskModal";
// import Avatar from "../../components/shared/Avatar";
// import type { Task } from "../../types";


// // ─── Column config ──────────────────────────────────────────────────────────────

// const columns: { id: Task["status"]; label: string; color: string }[] = [
//   { id: "todo",        label: "To Do",       color: "bg-blue-400"   },
//   { id: "in_progress", label: "In Progress", color: "bg-indigo-500" },
//   { id: "review",      label: "Review",      color: "bg-purple-500" },
//   { id: "done",        label: "Done",        color: "bg-emerald-500" },
// ];

// const priorityCls: Record<Task["priority"], string> = {
//   low:    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
//   medium: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
//   high:   "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300",
//   urgent: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300",
// };

// // ─── Task card ────────────────────────────────────────────────────────────────

// const KanbanCard: React.FC<{ task: Task; index: number }> = ({ task, index }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     transition={{ delay: index * 0.04 }}
//     whileHover={{ y: -2, boxShadow: "0 20px 45px rgba(15,23,42,0.08)" }}
//     className="bg-white dark:bg-slate-700/80 border border-slate-200/60 dark:border-slate-600/60 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all"
//   >
//     <div className="flex items-start justify-between mb-2.5">
//       <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug flex-1 pr-2">
//         {task.title}
//       </h4>
//       <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 capitalize ${priorityCls[task.priority]}`}>
//         {task.priority}
//       </span>
//     </div>

//     {task.description && (
//       <p className="text-[10px] text-slate-400 mb-3 line-clamp-2">{task.description}</p>
//     )}

//     <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-600/50">
//       {task?.assignee_name ? (
//         <div className="flex items-center gap-1.5">
//           <Avatar
//             initials={task?.assignee_name.split(" ").map((n) => n[0]).join("").toUpperCase()}
//             size="xs"
//           />
//           <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[80px]">
//             {task?.assignee_name}
//           </span>
//         </div>
//       ) : (
//         <span className="text-[10px] text-slate-300 dark:text-slate-600 italic">Unassigned</span>
//       )}

//       {task.due_date && (
//         <span className="text-[10px] text-slate-400">
//           {new Date(task.due_date).toLocaleDateString("en", { month: "short", day: "numeric" })}
//         </span>
//       )}
//     </div>
//   </motion.div>
// );

// // ─── Page ─────────────────────────────────────────────────────────────────────

// const ProjectKanban: React.FC = () => {
//   const { slug, projectId } = useParams<{ slug: string; projectId: string }>();
//   const navigate = useNavigate();
//   const { workspace ,role} = useAuth();
//   const workspaceId = Number(workspace?.id);
//   const projectIdNum = Number(projectId);

//   const [modalOpen, setModalOpen] = useState(false);
//   const [targetStatus, setTargetStatus] = useState<Task["status"]>("todo");

//   // ── Data ──────────────────────────────────────────────────────────────────
//   const { employees } = useMemberQueries({workspaceId,role:role!});
//   // const { tasks, createTask } = useTaskQueries(workspaceId, projectIdNum);
//  const { createTask , tasks} = useTaskQueries(workspaceId, projectIdNum);
//   const taskList = tasks.data ?? [];
//   const employeeList = employees.data ?? [];
//   ///console.log(employeeList, "employeeList",taskList);

//   // ── Handlers ──────────────────────────────────────────────────────────────
//   const openAddTask = (status: Task["status"]) => {
//     setTargetStatus(status);
//     setModalOpen(true);
//   };

//   const handleCreateTask = async (form: TaskFormData) => {
//     await createTask.mutateAsync({
//   project_id: projectIdNum,
//   title: form.title,
//   description: form.description || undefined,
//   priority: form.priority,
//   assignee_id:form.assignee_id === ""? undefined: form.assignee_id,
//   due_date: form.due_date || undefined,
// });
//     // await createTask.mutateAsync({
//     //   title:       form.title,
//     //   description: form.description || undefined,
//     //   priority:    form.priority,
//     //   assignee_id: form.assignee_id === "" ? undefined : form.assignee_id,
//     //   due_date:    form.due_date || undefined,
//     //   // status not sent — backend defaults to 'todo'
//     //   // If you want per-column "Add" to set initial status,
//     //   // your createTaskService needs to accept `status` too.
//     // });
//     setModalOpen(false);
//   };

//   // ── Loading ───────────────────────────────────────────────────────────────
//   if (tasks.isLoading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <Loader2 className="animate-spin text-indigo-500" size={28} />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 h-full">
//       {/* Header */}
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => navigate(`/${slug}/manager/projects`)}
//             className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
//           >
//             <ArrowLeft size={16} className="text-slate-500" />
//           </button>
//           <div>
//             <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kanban Board</h2>
//             <p className="text-sm text-slate-500 dark:text-slate-400">
//               {taskList.length} task{taskList.length !== 1 && "s"} in this project
//             </p>
//           </div>
//         </div>

//         <button
//           onClick={() => openAddTask("todo")}
//           className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-500/25"
//         >
//           <Plus size={15} />
//           Add Task
//         </button>
//       </motion.div>

//       {/* Columns */}
//       <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
//         {columns.map((col, ci) => {
//           const colTasks = taskList.filter((t) => t.status === col.id);
//           return (
//             <motion.div
//               key={col.id}
//               initial={{ opacity: 0, x: 20 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ delay: ci * 0.06 }}
//               className="flex-shrink-0 w-72 flex flex-col"
//             >
//               {/* Column header */}
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
//                   <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{col.label}</span>
//                   <span className="w-5 h-5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center text-[10px] font-bold">
//                     {colTasks.length}
//                   </span>
//                 </div>
//                 <button
//                   onClick={() => openAddTask(col.id)}
//                   className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
//                 >
//                   <Plus size={13} className="text-slate-400" />
//                 </button>
//               </div>

//               {/* Cards */}
//               <div className="flex-1 space-y-2.5 bg-slate-100/50 dark:bg-slate-800/40 rounded-2xl p-2.5 min-h-[400px]">
//                 {colTasks.map((task, i) => (
//                   <KanbanCard key={task.id} task={task} index={i} />
//                 ))}
//                 {colTasks.length === 0 && (
//                   <div className="flex items-center justify-center h-24 text-slate-300 dark:text-slate-600 text-xs">
//                     No tasks
//                   </div>
//                 )}
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>

//       {/* Add Task Modal */}
//       <TaskModal
//         open={modalOpen}
//         onClose={() => setModalOpen(false)}
//         employees={employeeList}
//         onSubmit={handleCreateTask}
//         loading={createTask.isPending}
//         defaultStatusLabel={columns.find((c) => c.id === targetStatus)?.label ?? "To Do"}
//       />
//     </div>
//   );
// };

// export default ProjectKanban;

// src/pages/ProjectKanban.tsx
// SHARED between manager and employee — same component, different permissions

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2, Plus, Calendar, AlertCircle } from "lucide-react";
import type { Task } from "../../types";
import { useAuth } from "../../hooks/AuthContext";
import { useTaskQueries } from "../../hooks/api/useTaskQueries";


// ─── Column definitions ───────────────────────────────────────────────────────

// const COLUMNS: { id: TaskStatus; label: string; color: string; dot: string }[] = [
//   { id: "todo",        label: "To do",       color: "bg-slate-100   dark:bg-slate-800/40",    dot: "bg-slate-400" },
//   { id: "in_progress", label: "In progress", color: "bg-blue-50/60  dark:bg-blue-900/10",     dot: "bg-blue-500"  },
//   { id: "review",      label: "Review",      color: "bg-amber-50/60 dark:bg-amber-900/10",    dot: "bg-amber-500" },
//   { id: "done",        label: "Done",        color: "bg-emerald-50/60 dark:bg-emerald-900/10", dot: "bg-emerald-500" },
// ];

// // ─── Priority styles ──────────────────────────────────────────────────────────

// const PRIORITY_CLS: Record<Priority, string> = {
//   low:    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
//   medium: "bg-amber-50   text-amber-700   dark:bg-amber-900/30   dark:text-amber-300",
//   high:   "bg-orange-50  text-orange-700  dark:bg-orange-900/30  dark:text-orange-300",
//   urgent: "bg-red-50     text-red-700     dark:bg-red-900/30     dark:text-red-300",
// };

const COLUMNS: { id: Task["status"]; label: string; color: string }[] = [
  { id: "todo",        label: "To Do",       color: "bg-blue-400"   },
  { id: "in_progress", label: "In Progress", color: "bg-indigo-500" },
  { id: "review",      label: "Review",      color: "bg-purple-500" },
  { id: "done",        label: "Done",        color: "bg-emerald-500" },
];

const PRIORITY_CLS: Record<Task["priority"], string> = {
  low:    "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
  medium: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
  high:   "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300",
  urgent: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300",
};
// ─── Helpers ──────────────────────────────────────────────────────────────────

const initials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

const isOverdue = (due: string) =>
  due && new Date(due) < new Date();

const formatDate = (due: string) => {
  if (!due) return null;
  return new Date(due).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ─── Task card ────────────────────────────────────────────────────────────────

interface TaskCardProps {
  task:        Task;
  draggable:   boolean;
  isMine:      boolean;
  isEmployee:  boolean;
  onDragStart: (e: React.DragEvent) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task, draggable, isMine, isEmployee, onDragStart,
}) => {
  const overdue = isOverdue(task.due_date);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      draggable={draggable}
      onDragStart={onDragStart}
      className={[
        "bg-white dark:bg-slate-800 border rounded-xl p-3.5 shadow-sm",
        "transition-shadow relative select-none",
        draggable
          ? "border-slate-200 dark:border-slate-700 cursor-grab active:cursor-grabbing hover:shadow-md"
          : "border-slate-200/50 dark:border-slate-700/50 opacity-60 cursor-default",
      ].join(" ")}
    >
      {/* "mine" dot — employee view */}
      {isEmployee && isMine && (
        <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-indigo-500" />
      )}

      {/* Title + priority */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug flex-1">
          {task.title}
        </h4>
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 capitalize ${PRIORITY_CLS[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {/* Description preview */}
      {task.description && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 line-clamp-2 mb-2.5 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer: assignee + due date */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-700/50">

        {/* Assignee */}
        {task.assignee_name ? (
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 text-[9px] font-bold flex items-center justify-center shrink-0">
              {initials(task.assignee_name)}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[90px]">
              {task.assignee_name}
            </span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-300 dark:text-slate-600 italic">Unassigned</span>
        )}

        {/* Due date */}
        {task.due_date && (
          <div className={`flex items-center gap-1 text-[10px] font-medium ${
            overdue
              ? "text-red-500 dark:text-red-400"
              : "text-slate-400 dark:text-slate-500"
          }`}>
            {overdue && <AlertCircle size={10} />}
            {!overdue && <Calendar size={10} />}
            {formatDate(task.due_date)}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Column ───────────────────────────────────────────────────────────────────

interface ColumnProps {
  col:        typeof COLUMNS[number];
  tasks:      Task[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop:     (e: React.DragEvent) => void;
  canDrag:    (task: Task) => boolean;
  isMine:     (task: Task) => boolean;
  isEmployee: boolean;
  isDropTarget: boolean;
}

const KanbanColumn: React.FC<ColumnProps> = ({
  col, tasks, onDragOver, onDrop, canDrag, isMine, isEmployee, isDropTarget,
}) => (
  <div
    onDragOver={onDragOver}
    onDrop={onDrop}
    className={[
      col.color,
      "rounded-2xl p-2.5 min-h-[320px] transition-all duration-150",
      isDropTarget ? "ring-2 ring-indigo-400 ring-offset-1" : "",
    ].join(" ")}
  >
    {/* Column header */}
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${col.dot}`} />
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
          {col.label}
        </span>
      </div>
      <span className="min-w-[20px] h-5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center text-[10px] font-bold px-1.5">
        {tasks.length}
      </span>
    </div>

    {/* Cards */}
    <div className="space-y-2.5">
      <AnimatePresence>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            draggable={canDrag(task)}
            isMine={isMine(task)}
            isEmployee={isEmployee}
            onDragStart={(e) => {
              if (!canDrag(task)) { e.preventDefault(); return; }
              e.dataTransfer.setData("taskId", String(task.id));
            }}
          />
        ))}
      </AnimatePresence>

      {tasks.length === 0 && (
        <div className="flex items-center justify-center h-20 text-slate-300 dark:text-slate-600 text-xs rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700">
          Drop here
        </div>
      )}
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const ProjectKanban: React.FC = () => {
  const { projectId }  = useParams<{ slug: string; projectId: string }>();
  const navigate       = useNavigate();
  const { role, user, workspace } = useAuth();

  const workspaceId  = Number(workspace?.id);
  const projectIdNum = Number(projectId);

  const { tasks,  } = useTaskQueries(workspaceId, projectIdNum);
  const taskList = tasks.data ?? [];

  const isManager  = role === "manager";
  const isEmployee = role === "employee";

  // active drop-target column for highlight
  const [dropTarget, setDropTarget] = useState<TaskStatus | null>(null);

  // ── Permissions ────────────────────────────────────────────────────────────
  const canDrag = (task: Task): boolean => {
    if (isManager)  return true;
    if (isEmployee) return task.assigneeId === String(user?.id);
    return false;
  };

  const isMine = (task: Task) => task.assigneeId === String(user?.id);

  // ── Drop handler ───────────────────────────────────────────────────────────
  const handleDrop = (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    setDropTarget(null);

    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    const task = taskList.find((t) => String(t.id) === taskId);
    if (!task || !canDrag(task)) return;
    if (task.status === newStatus) return;

    // Optimistic update — board moves immediately
    // PATCH /workspaces/:wsId/projects/:pId/tasks/:taskId/status
    //updateTaskStatus.mutate({ taskId: Number(taskId), status: newStatus });
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (tasks.isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (tasks.isError) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <AlertCircle size={32} className="text-red-400" />
        <p className="text-sm text-slate-500 dark:text-slate-400">Failed to load tasks</p>
        <button
          onClick={() => tasks.refetch()}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Stats ──────────────────────────────────────────────────────────────────
  const totalTasks = taskList.length;
  const doneTasks  = taskList.filter((t) => t.status === "done").length;
  const progress   = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <ArrowLeft size={16} className="text-slate-500" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Project board
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isEmployee
                ? "Drag your tasks to update progress — teammates' tasks are view-only"
                : "Drag any task to move it through the workflow"}
            </p>
          </div>
        </div>

        {isManager && (
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm shadow-indigo-500/20">
            <Plus size={15} /> Add task
          </button>
        )}
      </motion.div>

      {/* Progress bar */}
      {totalTasks > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 flex items-center gap-4">
          <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">
            {doneTasks}/{totalTasks} done · {progress}%
          </span>
        </div>
      )}

      {/* Board */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {COLUMNS.map((col) => {
          const colTasks = taskList.filter((t) => t.status === col.id);
          return (
            <KanbanColumn
              key={col.id}
              col={col}
              tasks={colTasks}
              isDropTarget={dropTarget === col.id}
              canDrag={canDrag}
              isMine={isMine}
              isEmployee={isEmployee}
              onDragOver={(e) => { e.preventDefault(); setDropTarget(col.id); }}
              onDrop={(e) => handleDrop(e, col.id)}
            />
          );
        })}
      </div>

      {/* Empty state */}
      {totalTasks === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">📋</p>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">No tasks yet</p>
          {isManager && (
            <p className="text-xs text-slate-400 mt-1">Click "Add task" to get started</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectKanban;