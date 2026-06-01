import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '../../components/sidebar/Sidebar'
import Navbar from '../../components/navbar/Navbar'

const titleMap: Record<string, string> = {
  '/admin':              'Admin Dashboard',
  '/admin/members':      'Members',
  '/admin/projects':     'Projects',
  '/admin/analytics':    'Analytics',
  '/admin/reports':      'Reports',
  '/admin/settings':     'Settings',
  '/manager':            'Manager Dashboard',
  '/manager/projects':   'My Projects',
  '/manager/kanban':     'Kanban Board',
  '/manager/team':       'Team',
  '/manager/reports':    'Reports',
  '/employee':           'My Dashboard',
  '/employee/tasks':     'My Tasks',
  '/employee/notifications': 'Notifications',
  '/employee/profile':   'Profile',
}

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const title = titleMap[location.pathname] || 'Dashboard'

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar onMenuToggle={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout