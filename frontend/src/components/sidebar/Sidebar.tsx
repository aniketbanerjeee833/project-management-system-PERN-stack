import React from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, FolderOpen, BarChart3, FileText,
  Settings, Kanban, Bell, User, X, Zap,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../shared/Avatar'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const navByRole = {
  admin: [
    { to: '/admin',            icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/members',    icon: Users,           label: 'Members'   },
    { to: '/admin/projects',   icon: FolderOpen,      label: 'Projects'  },
    { to: '/admin/analytics',  icon: BarChart3,       label: 'Analytics' },
    { to: '/admin/reports',    icon: FileText,        label: 'Reports'   },
    { to: '/admin/settings',   icon: Settings,        label: 'Settings'  },
  ],
  manager: [
    { to: '/manager',           icon: LayoutDashboard, label: 'Dashboard'    },
    { to: '/manager/projects',  icon: FolderOpen,      label: 'Projects'     },
    { to: '/manager/kanban',    icon: Kanban,          label: 'Kanban Board' },
    { to: '/manager/team',      icon: Users,           label: 'Team'         },
    { to: '/manager/reports',   icon: FileText,        label: 'Reports'      },
  ],
  employee: [
    { to: '/employee',                icon: LayoutDashboard, label: 'Dashboard'     },
    { to: '/employee/tasks',          icon: FolderOpen,      label: 'My Tasks'      },
    { to: '/employee/notifications',  icon: Bell,            label: 'Notifications' },
    { to: '/employee/profile',        icon: User,            label: 'Profile'       },
  ],
}

const roleLabel = {
  admin:    '⚙ Admin View',
  manager:  '📋 Manager View',
  employee: '👤 Employee View',
}

const SidebarContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { user, role } = useAuth()
  const nav = navByRole[role]

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white tracking-tight">WorkSpace</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg lg:hidden">
            <X size={15} className="text-slate-500" />
          </button>
        )}
      </div>

      {/* Role label */}
      <div className="px-4 pt-4 pb-1">
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {roleLabel[role]}
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto py-2">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length === 2}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={isActive ? 'text-indigo-500' : ''} />
                <span className="flex-1">{label}</span>
                {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
          <Avatar initials={user.avatar} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
          </div>
          <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => (
  <>
    {/* Desktop */}
    <aside className="hidden lg:flex w-56 flex-shrink-0 h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-700/60 flex-col">
      <SidebarContent />
    </aside>

    {/* Mobile drawer */}
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed left-0 top-0 bottom-0 w-60 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-700/60 z-50 lg:hidden flex flex-col"
          >
            <SidebarContent onClose={onClose} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  </>
)

export default Sidebar