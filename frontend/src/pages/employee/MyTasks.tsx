// import React from 'react'
// import { motion } from 'framer-motion'
// import { tasks } from '../../data/mockData'
// import TaskCard from '../../components/cards/TaskCard'
// import type { Priority } from '../../types'

// const employeeTasks = tasks.filter(t => t.assigneeId === 'u3')

// const priorityOrder: Priority[] = ['critical', 'high', 'medium', 'low']

// const priorityLabel: Record<Priority, string> = {
//   critical: '🔴 Critical',
//   high:     '🟠 High',
//   medium:   '🟡 Medium',
//   low:      '🟢 Low',
// }

// const MyTasks: React.FC = () => {
//   return (
//     <div className="space-y-5">
//       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//         <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Task</h2>
//         <p className="text-sm text-slate-500 dark:text-slate-400">{employeeTasks.length} tasks assigned to you</p>
//       </motion.div>

//       {priorityOrder.map(priority => {
//         const group = employeeTasks.filter(t => t.priority === priority)
//         if (group.length === 0) return null
//         return (
//           <div key={priority}>
//             <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
//               {priorityLabel[priority]}
//             </h3>
//             <div className="space-y-3">
//               {group.map((task, i) => (
//                 <TaskCard key={task.id} task={task} delay={i * 0.06} />
//               ))}
//             </div>
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// export default MyTasks
// src/pages/employee/MyTasks.tsx
import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Calendar } from "lucide-react";
import { useAuth } from "../../hooks/AuthContext";
import type { Task } from "../../types";
import { useEmployeeTasks } from "../../hooks/api/useEmployeeTaskQueries";
// import { useMyTasks } from "../../hooks/api/useMyTasks";
// import type { Task } from "../../types/task.types";

const priorityOrder: Task["priority"][] = ["urgent", "high", "medium", "low"];

const priorityLabel: Record<Task["priority"], string> = {
  urgent: "Urgent",
  high:   "High",
  medium: "Medium",
  low:    "Low",
};

const statusCls: Record<Task["status"], string> = {
  todo:        "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  in_progress: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  review:      "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  done:        "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
};

const statusLabel: Record<Task["status"], string> = {
  todo: "To do", in_progress: "In progress", review: "Review", done: "Done",
};

const MyTasks: React.FC = () => {
  const { workspace } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const workspaceId = Number(workspace?.id);

  const { employeeTasks } = useEmployeeTasks(workspaceId);
  const taskList = employeeTasks.data ?? [];

  if (employeeTasks.isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-indigo-500" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Task</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {taskList.length} tasks assigned to you. Click any task to update its status.
        </p>
      </motion.div>

      {priorityOrder.map((priority) => {
        const group = taskList.filter((t) => t.priority === priority);
        if (group.length === 0) return null;

        return (
          <div key={priority}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              {priorityLabel[priority]}
            </h3>
            <div className="space-y-2.5">
              {group.map((task) => (
                <div
                  key={task.id}
                  // onClick={() => navigate(`/${slug}/employee/projects/${task?.project_id}/kanban`)}
                    onClick={() => navigate(`/${slug}/manager/projects/${task?.project_id}/kanban`)}
                  className="flex items-center gap-3 bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl px-4 py-3 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      Project #{task?.project_id}
                    </p>
                  </div>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium flex-shrink-0 
                    ${statusCls[task.status]}`}>
                    {statusLabel[task.status]}
                  </span>
                  {task.due_date && (
                    <div className="flex items-center gap-1 text-xs text-slate-400 flex-shrink-0">
                      <Calendar size={11} />
                      {new Date(task.due_date).toLocaleDateString("en", { month: "short", day: "numeric" })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {taskList.length === 0 && (
        <div className="text-center py-16">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No tasks assigned to you yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyTasks;