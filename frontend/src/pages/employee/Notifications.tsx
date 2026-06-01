import React from 'react'
import { motion } from 'framer-motion'
import { CheckCheck } from 'lucide-react'
import { notifications } from '../../data/mockData'
import Avatar from '../../components/shared/Avatar'

const typeIcon: Record<string, string> = {
  task:     '📋',
  comment:  '💬',
  deadline: '⏰',
  mention:  '@',
  system:   '✓',
}

const typeColor: Record<string, string> = {
  task:     'bg-indigo-500',
  comment:  'bg-purple-500',
  deadline: 'bg-amber-500',
  mention:  'bg-blue-500',
  system:   'bg-emerald-500',
}

const myNotifs = notifications.filter(n => n.userId === 'u3')
const unreadCount = myNotifs.filter(n => !n.read).length

const Notifications: React.FC = () => {
  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Notifications</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{unreadCount} unread notifications</p>
        </div>
        {unreadCount > 0 && (
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/15 rounded-xl transition-colors">
            <CheckCheck size={14} />
            Mark all read
          </button>
        )}
      </motion.div>

      <div className="bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl overflow-hidden shadow-sm">
        {myNotifs.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className={`flex gap-4 p-4 ${i > 0 ? 'border-t border-slate-100 dark:border-slate-700/50' : ''} ${!notif.read ? 'bg-indigo-50/40 dark:bg-indigo-500/5' : 'hover:bg-slate-50 dark:hover:bg-slate-700/20'} transition-colors`}
          >
            {/* Avatar + type dot */}
            <div className="relative flex-shrink-0">
              <Avatar initials={notif.actorAvatar} size="sm" />
              <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 ${typeColor[notif.type]} rounded-full flex items-center justify-center text-white text-[8px] border-2 border-white dark:border-slate-800`}>
                {typeIcon[notif.type]}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={`text-sm font-semibold ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                  {!notif.read && (
                    <span className="inline-block w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2 align-middle" />
                  )}
                  {notif.title}
                </p>
                <span className="text-[10px] text-slate-400 flex-shrink-0">
                  {new Date(notif.createdAt).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Notifications