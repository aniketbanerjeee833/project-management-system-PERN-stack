import React from 'react'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'
import type { Task } from '../../types'
import Avatar from '../shared/Avatar'
import { priorityConfig, statusConfig, getDaysUntil } from '../../utils'

interface TaskCardProps {
  task: Task
  delay?: number
  compact?: boolean
}

const TaskCard: React.FC<TaskCardProps> = ({ task, delay = 0, compact = false }) => {
  const p = priorityConfig[task.priority]
  const s = statusConfig[task.status]
  const daysLeft = getDaysUntil(task.dueDate)
  const isOverdue = daysLeft < 0
  const isUrgent = daysLeft >= 0 && daysLeft <= 2

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.01 }}
      className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start gap-3">
        <div className={`w-1 min-h-12 rounded-full flex-shrink-0 self-stretch ${p.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{task.title}</h4>
            <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full flex-shrink-0 ${p.bg} ${p.color}`}>{p.label}</span>
          </div>

          {!compact && (
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">{task.description}</p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">{task.projectName}</span>
            <div className={`flex items-center gap-1 text-[10px] font-medium ${isOverdue ? 'text-red-500' : isUrgent ? 'text-amber-500' : 'text-slate-400'}`}>
              <Clock size={10} />
              {isOverdue ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Due today' : `${daysLeft}d left`}
            </div>
          </div>

          {!compact && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5">
                <Avatar initials={task.assignedByName.split(' ').map((n: string) => n[0]).join('')} size="xs" />
                <span className="text-[10px] text-slate-400">by {task.assignedByName}</span>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full ${s.bg} ${s.color}`}>{s.label}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default TaskCard