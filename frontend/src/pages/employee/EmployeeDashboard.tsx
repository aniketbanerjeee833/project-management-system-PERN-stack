import React from 'react'
import { motion } from 'framer-motion'
import { Clock, AlertCircle, CheckCircle, Eye } from 'lucide-react'
import StatCard from '../../components/cards/StatCard'
import TaskCard from '../../components/cards/TaskCard'
import { tasks } from '../../data/mockData'
import { getDaysUntil } from '../../utils'

const myTasks = tasks.filter(t => t.assigneeId === 'u3')
const dueToday = myTasks.filter(t => getDaysUntil(t.dueDate) === 0)
const overdue  = myTasks.filter(t => getDaysUntil(t.dueDate) < 0 && t.status !== 'done')
const doneTasks = myTasks.filter(t => t.status === 'done')
const inReview  = myTasks.filter(t => t.status === 'review')
const activeTasks = myTasks.filter(t => t.status !== 'done').slice(0, 4)

const EmployeeDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Good morning, Arjun 👋</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Here are your tasks for today.</p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Due Today"           value={dueToday.length}  icon={Clock}        color="rose"    delay={0}    />
        <StatCard title="Overdue"             value={overdue.length}   icon={AlertCircle}  color="amber"   delay={0.05} />
        <StatCard title="Done This Week"      value={doneTasks.length} icon={CheckCircle}  color="emerald" delay={0.1}  />
        <StatCard title="Pending Review"      value={inReview.length}  icon={Eye}          color="indigo"  delay={0.15} />
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 dark:text-white mb-3">My Active Tasks</h3>
        <div className="space-y-3">
          {activeTasks.map((task, i) => (
            <TaskCard key={task.id} task={task} delay={i * 0.07} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default EmployeeDashboard