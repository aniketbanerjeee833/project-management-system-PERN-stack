import React from 'react'
import { motion } from 'framer-motion'
import { Mail, Building, Calendar, User, Shield, CheckSquare } from 'lucide-react'
import Avatar from '../../components/shared/Avatar'

import { currentUsers, tasks } from '../../data/mockData'
import { formatDate } from '../../utils'

const user = currentUsers.employee
const myTasks = tasks.filter(t => t.assigneeId === 'u3')
const doneTasks = myTasks.filter(t => t.status === 'done')

const infoRows = [
  { icon: User,        label: 'Full Name',   value: user.name },
  { icon: Mail,        label: 'Email',        value: user.email },
  { icon: Building,    label: 'Department',   value: user.department },
  { icon: Calendar,    label: 'Joined',       value: formatDate(user.joinedDate) },
  { icon: Shield,      label: 'Role',         value: 'Employee' },
  { icon: CheckSquare, label: 'Tasks Done',   value: `${doneTasks.length} / ${myTasks.length}` },
]

const Profile: React.FC = () => {
  return (
    <div className="space-y-5 max-w-lg">
      {/* Profile banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-indigo-500/20"
      >
        <div className="flex justify-center mb-3">
          <Avatar initials={user.avatar} size="xl" />
        </div>
        <h2 className="text-xl font-bold">{user.name}</h2>
        <p className="text-white/70 text-sm mt-1">{user.email}</p>
        <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
          {['🎨 Design', 'Employee', 'Active'].map(tag => (
            <span key={tag} className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold">{tag}</span>
          ))}
        </div>
      </motion.div>

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm"
      >
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Personal Information</h3>
        <div className="space-y-1">
          {infoRows.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                <Icon size={14} />
                <span className="text-sm">{label}</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-5 shadow-sm"
      >
        <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Task Stats</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total',       value: myTasks.length,                  color: 'text-slate-900 dark:text-white' },
            { label: 'Completed',   value: doneTasks.length,                color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Completion',  value: `${Math.round((doneTasks.length / myTasks.length) * 100)}%`, color: 'text-indigo-600 dark:text-indigo-400' },
          ].map(stat => (
            <div key={stat.label} className="text-center bg-slate-50 dark:bg-slate-700/40 rounded-xl p-3">
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Profile