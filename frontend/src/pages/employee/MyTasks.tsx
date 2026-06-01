import React from 'react'
import { motion } from 'framer-motion'
import { tasks } from '../../data/mockData'
import TaskCard from '../../components/cards/TaskCard'
import type { Priority } from '../../types'

const myTasks = tasks.filter(t => t.assigneeId === 'u3')

const priorityOrder: Priority[] = ['critical', 'high', 'medium', 'low']

const priorityLabel: Record<Priority, string> = {
  critical: '🔴 Critical',
  high:     '🟠 High',
  medium:   '🟡 Medium',
  low:      '🟢 Low',
}

const MyTasks: React.FC = () => {
  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Tasks</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{myTasks.length} tasks assigned to you</p>
      </motion.div>

      {priorityOrder.map(priority => {
        const group = myTasks.filter(t => t.priority === priority)
        if (group.length === 0) return null
        return (
          <div key={priority}>
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
              {priorityLabel[priority]}
            </h3>
            <div className="space-y-3">
              {group.map((task, i) => (
                <TaskCard key={task.id} task={task} delay={i * 0.06} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MyTasks