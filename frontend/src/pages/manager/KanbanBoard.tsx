import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { TaskStatus, Task } from '../../types';
import { tasks } from '../../data/mockData';
import { priorityConfig } from '../../utils';
import Avatar from '../../components/shared/Avatar';

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'backlog', label: 'Backlog', color: 'bg-slate-400' },
  { id: 'todo', label: 'To Do', color: 'bg-blue-400' },
  { id: 'in-progress', label: 'In Progress', color: 'bg-indigo-500' },
  { id: 'review', label: 'Review', color: 'bg-purple-500' },
  { id: 'done', label: 'Done', color: 'bg-emerald-500' },
];

const KanbanCard: React.FC<{ task: Task; index: number }> = ({ task, index }) => {
  const p = priorityConfig[task.priority];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -2, boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)' }}
      className="bg-white dark:bg-slate-700/80 border border-slate-200/60 dark:border-slate-600/60 rounded-xl p-3.5 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
    >
      <div className="flex items-start justify-between mb-2.5">
        <h4 className="text-xs font-semibold text-slate-900 dark:text-white leading-snug flex-1 pr-2">{task.title}</h4>
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0 ${p.bg} ${p.color}`}>{p.label}</span>
      </div>

      <p className="text-[10px] text-slate-400 mb-3 line-clamp-2">{task.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {task.tags.map(tag => (
          <span key={tag} className="px-1.5 py-0.5 text-[9px] font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-full">{tag}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-slate-600/50">
        <Avatar initials={task.assigneeName.split(' ').map(n=>n[0]).join('')} size="xs" />
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <span>{new Date(task.dueDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
        </div>
      </div>
    </motion.div>
  );
};

const KanbanBoard: React.FC = () => {
  const [taskList] = useState(tasks);

  return (
    <div className="space-y-4 h-full">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Kanban Board</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Drag and drop tasks across stages</p>
      </motion.div>

      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[600px]">
        {columns.map((col, ci) => {
          const colTasks = taskList.filter(t => t.status === col.id);
          return (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: ci * 0.06 }}
              className="flex-shrink-0 w-72 flex flex-col"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{col.label}</span>
                  <span className="w-5 h-5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full flex items-center justify-center text-[10px] font-bold">{colTasks.length}</span>
                </div>
                <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
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
    </div>
  );
};

export default KanbanBoard;