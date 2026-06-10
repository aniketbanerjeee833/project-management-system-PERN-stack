import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, Bell, Sun, Moon, Search, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useDarkMode } from '../../hooks/useDarkMode'
import type { Role } from '../../types'
import Avatar from '../shared/Avatar'
import { notifications } from '../../data/mockData'
import { useAuth } from '../../hooks/AuthContext'

interface NavbarProps {
  onMenuToggle: () => void
  title: string
}

const roleOptions: { role: Role; label: string; name: string; avatar: string }[] = [
  { role: 'admin',    label: 'Admin',    name: 'Rahul Sharma', avatar: 'RS' },
  { role: 'manager',  label: 'Manager',  name: 'Priya Verma',  avatar: 'PV' },
  { role: 'employee', label: 'Employee', name: 'Arjun Singh',  avatar: 'AS' },
]

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle, title }) => {

  const { user, role, setRole } = useAuth()
  console.log(user)
  const { isDark, toggle } = useDarkMode()
  const [showSwitcher, setShowSwitcher] = useState(false)
  const switcherRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const unread = notifications.filter(n => !n.read).length

  const handleRoleSwitch = (r: Role) => {
    setRole(r)
    setShowSwitcher(false)
    navigate(`/${r}`)
  }

  useEffect(() => {
    if (!showSwitcher) return

    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setShowSwitcher(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSwitcher])

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60">
      <div className="flex items-center gap-3 px-4 h-14">
        <button onClick={onMenuToggle} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 transition-colors">
          <Menu size={18} />
        </button>

        {/* <h1 className="font-semibold text-slate-900 dark:text-white text-sm hidden sm:block">{title}</h1> */}

        {/* <div className="flex-1 max-w-xs mx-4 hidden md:block">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 placeholder-slate-400 rounded-xl border border-transparent focus:border-indigo-300 dark:focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all"
            />
          </div>
        </div> */}

        <div className="ml-auto flex items-center gap-2">
          {/* Role Switcher */}
          <div className="relative" ref={switcherRef}>
            <button
              onClick={() => setShowSwitcher(v => !v)}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/15 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-semibold transition-colors"
            >
              <span className="hidden sm:inline">Switch Role</span>
              <span className="sm:hidden capitalize">{role}</span>
              <ChevronDown size={12} className={`transition-transform ${showSwitcher ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showSwitcher && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl shadow-slate-900/10 overflow-hidden z-50"
                >
                  <div className="p-1.5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1.5">Switch Dashboard</p>
                    {roleOptions.map(opt => (
                      <button
                        key={opt.role}
                        onClick={() => handleRoleSwitch(opt.role)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                          role === opt.role
                            ? 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <Avatar initials={opt.avatar} size="xs" />
                        <div className="text-left">
                          <p className="font-medium text-xs leading-tight">{opt.name}</p>
                          <p className="text-[10px] text-slate-400">{opt.label}</p>
                        </div>
                        {role === opt.role && <div className="ml-auto w-1.5 h-1.5 bg-indigo-500 rounded-full" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button onClick={toggle} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-400 transition-colors">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-500 dark:text-slate-400 transition-colors">
            <Bell size={16} />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>
            )}
          </button>

          <Avatar initials={user?.name. split(" ") .map(word => word[0].toLocaleUpperCase()) .join("")} size="sm" />
        </div>
      </div>
    </header>
  )
}

export default Navbar