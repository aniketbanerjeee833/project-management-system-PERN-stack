import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './hooks/AuthProvider'
import DashboardLayout from './app/layouts/DashboardLayout'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminMembers from './pages/admin/AdminMembers'
import AdminProjects from './pages/admin/AdminProjects'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import { AdminReports, AdminSettings } from './pages/admin/AdminReportsSettings'

// Manager pages
import ManagerDashboard from './pages/manager/ManagerDashboard'
import KanbanBoard from './pages/manager/KanbanBoard'
import ManagerProjects from './pages/manager/ManagerProjects'
import ManagerTeam from './pages/manager/ManagerTeam'
import ManagerReports from './pages/manager/ManagerReports'

// Employee pages
import EmployeeDashboard from './pages/employee/EmployeeDashboard'
import MyTasks from './pages/employee/MyTasks'
import Notifications from './pages/employee/Notifications'
import Profile from './pages/employee/Profile'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Admin Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/members" element={<AdminMembers />} />
            <Route path="/admin/projects" element={<AdminProjects />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>

          {/* Manager Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/manager" element={<ManagerDashboard />} />
            <Route path="/manager/projects" element={<ManagerProjects />} />
            <Route path="/manager/kanban" element={<KanbanBoard />} />
            <Route path="/manager/team" element={<ManagerTeam />} />
            <Route path="/manager/reports" element={<ManagerReports />} />
          </Route>

          {/* Employee Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/employee" element={<EmployeeDashboard />} />
            <Route path="/employee/tasks" element={<MyTasks />} />
            <Route path="/employee/notifications" element={<Notifications />} />
            <Route path="/employee/profile" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}