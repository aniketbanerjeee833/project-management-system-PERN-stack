import React from 'react'
import { motion } from 'framer-motion'
import Avatar from '../../components/shared/Avatar'
import Badge from '../../components/shared/Badge'
import { teamMembers } from '../../data/mockData'

const statusConfig = {
  available: { label: 'Available', variant: 'success' as const },
  busy:      { label: 'Busy',      variant: 'warning' as const },
  away:      { label: 'Away',      variant: 'default' as const },
}

const ManagerTeam: React.FC = () => {
  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Team</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">{teamMembers.length} members in your team</p>
      </motion.div>

      <div className="space-y-3">
        {teamMembers.map((member, i) => {
          const s = statusConfig[member.status]
          return (
            <motion.div
              key={member.userId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <Avatar initials={member.avatar} size="lg" />

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white">{member.name}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{member.currentTask}</p>

                <div className="flex items-center gap-2 mt-2.5">
                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${member.completionRate}%` }}
                      transition={{ duration: 0.8, delay: i * 0.07 + 0.2 }}
                      className="h-full bg-indigo-500 rounded-full"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-8 text-right">
                    {member.completionRate}%
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <Badge variant={s.variant} size="sm" dot>{s.label}</Badge>
                <span className="text-xs text-slate-400">{member.assignedTasks} tasks</span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default ManagerTeam