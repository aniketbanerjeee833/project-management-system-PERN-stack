// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { AuthProvider } from './hooks/AuthProvider'
// import DashboardLayout from './app/layouts/DashboardLayout'

// // Admin pages
// import AdminDashboard from './pages/admin/AdminDashboard'
// import AdminMembers from './pages/admin/AdminMembers'
// import AdminProjects from './pages/admin/AdminProjects'
// import AdminAnalytics from './pages/admin/AdminAnalytics'
// import { AdminReports, AdminSettings } from './pages/admin/AdminReportsSettings'

// // Manager pages
// import ManagerDashboard from './pages/manager/ManagerDashboard'
// import KanbanBoard from './pages/manager/KanbanBoard'
// import ManagerProjects from './pages/manager/ManagerProjects'
// import ManagerTeam from './pages/manager/ManagerTeam'
// import ManagerReports from './pages/manager/ManagerReports'

// // Employee pages
// import EmployeeDashboard from './pages/employee/EmployeeDashboard'
// import MyTasks from './pages/employee/MyTasks'
// import Notifications from './pages/employee/Notifications'
// import Profile from './pages/employee/Profile'

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<Navigate to="/admin" replace />} />

//           {/* Admin Routes */}
//           <Route element={<DashboardLayout />}>
//             <Route path="/admin" element={<AdminDashboard />} />
//             <Route path="/admin/members" element={<AdminMembers />} />
//             <Route path="/admin/projects" element={<AdminProjects />} />
//             <Route path="/admin/analytics" element={<AdminAnalytics />} />
//             <Route path="/admin/reports" element={<AdminReports />} />
//             <Route path="/admin/settings" element={<AdminSettings />} />
//           </Route>

//           {/* Manager Routes */}
//           <Route element={<DashboardLayout />}>
//             <Route path="/manager" element={<ManagerDashboard />} />
//             <Route path="/manager/projects" element={<ManagerProjects />} />
//             <Route path="/manager/kanban" element={<KanbanBoard />} />
//             <Route path="/manager/team" element={<ManagerTeam />} />
//             <Route path="/manager/reports" element={<ManagerReports />} />
//           </Route>

//           {/* Employee Routes */}
//           <Route element={<DashboardLayout />}>
//             <Route path="/employee" element={<EmployeeDashboard />} />
//             <Route path="/employee/tasks" element={<MyTasks />} />
//             <Route path="/employee/notifications" element={<Notifications />} />
//             <Route path="/employee/profile" element={<Profile />} />
//           </Route>

//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/admin" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   )
// }
// src/App.tsx
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// // import { AuthProvider, useAuth } from "./context/AuthContext";
// import { Loader2 } from "lucide-react";

// // Layouts
// // import DashboardLayout from "./components/layout/DashboardLayout";

// // Auth pages
// // import LoginPage           from "./pages/auth/LoginPage";
// // import InvitePage          from "./pages/auth/InvitePage";
// // import CreateWorkspacePage from "./pages/auth/CreateWorkspacePage";
// import React from "react";
// // Admin pages
// import AdminDashboard  from "./pages/admin/AdminDashboard";
// import AdminMembers    from "./pages/admin/AdminMembers";
// import AdminProjects   from "./pages/admin/AdminProjects";
// import AdminAnalytics  from "./pages/admin/AdminAnalytics";
// // import AdminReports    from "./pages/admin/AdminReports";
// // import AdminSettings   from "./pages/admin/AdminSettings";

// // Manager pages
// import ManagerDashboard from "./pages/manager/ManagerDashboard";
// import ManagerProjects  from "./pages/manager/ManagerProjects";
// import KanbanBoard      from "./pages/manager/KanbanBoard";
// import ManagerTeam      from "./pages/manager/ManagerTeam";
// import ManagerReports   from "./pages/manager/ManagerReports";

// // Employee pages
// import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
// import MyTasks           from "./pages/employee/MyTasks";
// import Notifications     from "./pages/employee/Notifications";
// import Profile           from "./pages/employee/Profile";
// import { AuthProvider, useAuth } from "./hooks/AuthContext";
// import DashboardLayout from "./app/layouts/DashboardLayout";
// import LoginPage from "./pages/LoginPage";

// const InvitePage = React.lazy(() => import("./pages/InvitePage"))

// // ─── Role-based home redirect ─────────────────────────────────────────────────
// // Called at "/" — sends each role to their own dashboard
// const RoleRedirect: React.FC = () => {
//   const { role, isAuthenticated, isLoading, needsWorkspace } = useAuth();

//   if (isLoading) return <FullPageSpinner />;

//   if (!isAuthenticated) return <Navigate to="/login" replace />;
//   if (needsWorkspace)   return <Navigate to="/create-workspace" replace />;

//   if (role === "admin")    return <Navigate to="/admin" replace />;
//   if (role === "manager")  return <Navigate to="/manager" replace />;
//   if (role === "employee") return <Navigate to="/employee" replace />;

//   return <Navigate to="/login" replace />;
// };

// // ─── Guards ───────────────────────────────────────────────────────────────────

// // Redirects to /login if not authenticated
// const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, isLoading, needsWorkspace } = useAuth();
//   if (isLoading)        return <FullPageSpinner />;
//   // if (!isAuthenticated) return <div>Please Login</div>;
//   if (!isAuthenticated) return <Navigate to="/login" replace />;
//   //if(needsWorkspace)   return <div>Please Create Workspace</div>
//   if (needsWorkspace)   return <Navigate to="/create-workspace" replace />;
//   return <>{children}</>;
// };

// // Redirects wrong role away (e.g. employee trying to access /admin)
// const RequireRole: React.FC<{
//   allowed: ("admin" | "manager" | "employee")[];
//   children: React.ReactNode;
// }> = ({ allowed, children }) => {
//   const { role } = useAuth();
//   if (!role)
//   return <div>Loading Role...</div>;

// // if (!allowed.includes(role))
// //   return <div>Unauthorized</div>;
//   if (!role || !allowed.includes(role)) return <Navigate to="/" replace />;
//   return <>{children}</>;
// };

// // ─── App ─────────────────────────────────────────────────────────────────────

// function AppRoutes() {
//   return (
//     <Routes>
//       {/* Root → role-based redirect */}
//       <Route path="/" element={<RoleRedirect />} />

//       {/* Public routes */}
//       <Route path="/login"  element={<LoginPage/>} />
//       <Route path="/invite" element={<InvitePage/>} />  
//       {/* /invite?token=...  */}

//       {/* Fresh admin — has JWT but no workspace yet */}
//       {/* <Route
//         path="/create-workspace"
//         element={
//           <RequireAuth>
//             <CreateWorkspacePage />
//           </RequireAuth>
//         }
//       /> */}

//       {/* ── Admin routes ── */}
//       <Route
//         element={
//           <RequireAuth>
//             <RequireRole allowed={["admin"]}>
//               <DashboardLayout />
//             </RequireRole>
//           </RequireAuth>
//         }
//       >
//         <Route path="/admin"           element={<AdminDashboard />} />
//         <Route path="/admin/members"   element={<AdminMembers />} />
//         <Route path="/admin/projects"  element={<AdminProjects />} />
//         <Route path="/admin/analytics" element={<AdminAnalytics />} />
//         {/* <Route path="/admin/reports"   element={<AdminReports />} />
//         <Route path="/admin/settings"  element={<AdminSettings />} /> */}
//       </Route>

//       {/* ── Manager routes ── */}
//       <Route
//         element={
//           <RequireAuth>
//             <RequireRole allowed={["manager"]}>
//               <DashboardLayout />
//             </RequireRole>
//           </RequireAuth>
//         }
//       >
//         <Route path="/manager"          element={<ManagerDashboard />} />
//         <Route path="/manager/projects" element={<ManagerProjects />} />
//         <Route path="/manager/kanban"   element={<KanbanBoard />} />
//         <Route path="/manager/team"     element={<ManagerTeam />} />
//         <Route path="/manager/reports"  element={<ManagerReports />} />
//       </Route>

//       {/* ── Employee routes ── */}
//       <Route
//         element={
//           <RequireAuth>
//             <RequireRole allowed={["employee"]}>
//               <DashboardLayout />
//             </RequireRole>
//           </RequireAuth>
//         }
//       >
//         <Route path="/employee"               element={<EmployeeDashboard />} />
//         <Route path="/employee/tasks"         element={<MyTasks />} />
//         <Route path="/employee/notifications" element={<Notifications />} />
//         <Route path="/employee/profile"       element={<Profile />} />
//       </Route>

//       {/* Fallback */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }

// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const FullPageSpinner: React.FC = () => (
//   <div className="min-h-screen flex items-center justify-center">
//     <Loader2 size={28} className="animate-spin text-indigo-500" />
//   </div>
// );
// import React, { Suspense } from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { Loader2 } from "lucide-react";
// import { AuthProvider, useAuth } from "./hooks/AuthContext";
// import DashboardLayout from "./app/layouts/DashboardLayout";

// // ── Auth pages ────────────────────────────────────────────────────────────────
// import LoginPage from "./pages/LoginPage";
// const InvitePage          = React.lazy(() => import("./pages/InvitePage"));
// // const CreateWorkspacePage = React.lazy(() => import("./pages/auth/CreateWorkspacePage"));

// // ── Admin pages ───────────────────────────────────────────────────────────────
// import AdminDashboard  from "./pages/admin/AdminDashboard";
// import AdminMembers    from "./pages/admin/AdminMembers";
// import AdminProjects   from "./pages/admin/AdminProjects";
// import AdminAnalytics  from "./pages/admin/AdminAnalytics";

// // ── Manager pages ─────────────────────────────────────────────────────────────
// import ManagerDashboard from "./pages/manager/ManagerDashboard";
// import ManagerProjects  from "./pages/manager/ManagerProjects";
// import KanbanBoard      from "./pages/manager/KanbanBoard";
// import ManagerTeam      from "./pages/manager/ManagerTeam";
// import ManagerReports   from "./pages/manager/ManagerReports";

// // ── Employee pages ────────────────────────────────────────────────────────────
// import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
// import MyTasks           from "./pages/employee/MyTasks";
// import Notifications     from "./pages/employee/Notifications";
// import Profile           from "./pages/employee/Profile";

// // ─── Full page spinner ────────────────────────────────────────────────────────
// const FullPageSpinner: React.FC = () => (
//   <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
//     <Loader2 size={28} className="animate-spin text-indigo-500" />
//   </div>
// );

// // ─── Role redirect ────────────────────────────────────────────────────────────
// // Sits at "/" — reads auth state and sends each role to their home
// const RoleRedirect: React.FC = () => {
//   const { role, isAuthenticated, isLoading, needsWorkspace } = useAuth();

//   if (isLoading)        return <FullPageSpinner />;
//   if (!isAuthenticated) return <Navigate to="/login"            replace />;
//   if (needsWorkspace)   return <Navigate to="/create-workspace" replace />;
//   if (role === "admin")    return <Navigate to="/admin"    replace />;
//   if (role === "manager")  return <Navigate to="/manager"  replace />;
//   if (role === "employee") return <Navigate to="/employee" replace />;

//   // fallback — authenticated but role unknown (should not happen)
//   return <Navigate to="/login" replace />;
// };

// // ─── RequireAuth ──────────────────────────────────────────────────────────────
// const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { isAuthenticated, isLoading, needsWorkspace } = useAuth();

//   if (isLoading)        return <FullPageSpinner />;
//   if (!isAuthenticated) return <Navigate to="/login"            replace />;
//   if (needsWorkspace)   return <Navigate to="/create-workspace" replace />;

//   return <>{children}</>;
// };

// // ─── RequireRole ──────────────────────────────────────────────────────────────
// const RequireRole: React.FC<{
//   allowed: ("admin" | "manager" | "employee")[];
//   children: React.ReactNode;
// }> = ({ allowed, children }) => {
//   const { role, isLoading } = useAuth();

//   // still loading — don't redirect yet, wait for role to resolve
//   if (isLoading || !role) return <FullPageSpinner />;

//   // wrong role — send back to root, RoleRedirect handles the rest
//   if (!allowed.includes(role)) return <Navigate to="/" replace />;

//   return <>{children}</>;
// };

// // ─── Routes ───────────────────────────────────────────────────────────────────
// function AppRoutes() {
//   return (
//     // Suspense required for React.lazy — without this lazy imports crash
//     <Suspense fallback={<FullPageSpinner />}>
//       <Routes>

//         {/* Root — redirects by role */}
//         <Route path="/" element={<RoleRedirect />} />

//         {/* ── Public ── */}
//         <Route path="/login"  element={<LoginPage />} />
//         <Route path="/invite" element={<InvitePage />} />

//         {/* ── Fresh admin — session exists but no workspace yet ── */}
//         {/* <Route
//           path="/create-workspace"
//           element={
//             <RequireAuth>
//               <CreateWorkspacePage />
//             </RequireAuth>
//           }
//         /> */}

//         {/* ── Admin ── */}
//         <Route
//           element={
//             <RequireAuth>
//               <RequireRole allowed={["admin"]}>
//                 <DashboardLayout />
//               </RequireRole>
//             </RequireAuth>
//           }
//         >
//           <Route path="/admin"           element={<AdminDashboard />} />
//           <Route path="/admin/members"   element={<AdminMembers />} />
//           <Route path="/admin/projects"  element={<AdminProjects />} />
//           <Route path="/admin/analytics" element={<AdminAnalytics />} />
//         </Route>

//         {/* ── Manager ── */}
//         <Route
//           element={
//             <RequireAuth>
//               <RequireRole allowed={["manager"]}>
//                 <DashboardLayout />
//               </RequireRole>
//             </RequireAuth>
//           }
//         >
//           <Route path="/manager"          element={<ManagerDashboard />} />
//           <Route path="/manager/projects" element={<ManagerProjects />} />
//           <Route path="/manager/kanban"   element={<KanbanBoard />} />
//           <Route path="/manager/team"     element={<ManagerTeam />} />
//           <Route path="/manager/reports"  element={<ManagerReports />} />
//         </Route>

//         {/* ── Employee ── */}
//         <Route
//           element={
//             <RequireAuth>
//               <RequireRole allowed={["employee"]}>
//                 <DashboardLayout />
//               </RequireRole>
//             </RequireAuth>
//           }
//         >
//           <Route path="/employee"               element={<EmployeeDashboard />} />
//           <Route path="/employee/tasks"         element={<MyTasks />} />
//           <Route path="/employee/notifications" element={<Notifications />} />
//           <Route path="/employee/profile"       element={<Profile />} />
//         </Route>

//         {/* Fallback */}
//         <Route path="*" element={<Navigate to="/" replace />} />

//       </Routes>
//     </Suspense>
//   );
// }

// // ─── App ──────────────────────────────────────────────────────────────────────
// // Order matters:
// // AuthProvider → BrowserRouter → AppRoutes
// // AuthProvider must wrap BrowserRouter so useAuth works everywhere including
// // components that also use useNavigate
// export default function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// src/App.tsx
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./hooks/AuthContext";
import DashboardLayout from "./app/layouts/DashboardLayout";

// ── Auth pages ────────────────────────────────────────────────────────────────
const LoginPage= React.lazy(() => import("./pages/LoginPage"));
const RegisterPage= React.lazy(() => import("./pages/RegisterPage"));
const InvitePage = React.lazy(() => import("./pages/InvitePage"));
const CreateWorkspacePage = React.lazy(() => import("./pages/CreateWorkspacePage"));
// ── Admin pages ───────────────────────────────────────────────────────────────
import AdminDashboard  from "./pages/admin/AdminDashboard";
import AdminMembers    from "./pages/admin/AdminMembers";
import AdminProjects   from "./pages/admin/AdminProjects";
import AdminAnalytics  from "./pages/admin/AdminAnalytics";
 import { AdminReports, AdminSettings } from './pages/admin/AdminReportsSettings'
// ── Manager pages ─────────────────────────────────────────────────────────────
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import ManagerProjects  from "./pages/manager/ManagerProjects";
import KanbanBoard      from "./pages/manager/KanbanBoard";
import ManagerTeam      from "./pages/manager/ManagerTeam";
import ManagerReports   from "./pages/manager/ManagerReports";

// ── Employee pages ────────────────────────────────────────────────────────────
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import MyTasks           from "./pages/employee/MyTasks";
import Notifications     from "./pages/employee/Notifications";
import Profile           from "./pages/employee/Profile";

// ─── Spinner ──────────────────────────────────────────────────────────────────
const FullPageSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <Loader2 size={28} className="animate-spin text-indigo-500" />
  </div>
);

// ─── RoleRedirect ─────────────────────────────────────────────────────────────
// Sits at "/" — reads workspace.slug + role → sends to the right home
const RoleRedirect: React.FC = () => {
  const { role, workspace, isAuthenticated, isLoading, needsWorkspace } = useAuth();
  const slug = workspace?.slug;

  if (isLoading)        return <FullPageSpinner />;
  if (!isAuthenticated) return <Navigate to="/login"             replace />;
  if (needsWorkspace)   return <Navigate to="/create-workspace"  replace />;

  if (role === "admin"    && slug) return <Navigate to={`/${slug}/admin`}    replace />;
  if (role === "manager"  && slug) return <Navigate to={`/${slug}/manager`}  replace />;
  if (role === "employee" && slug) return <Navigate to={`/${slug}/employee`} replace />;

  return <Navigate to="/login" replace />;
};

// ─── RequireAuth ──────────────────────────────────────────────────────────────
const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, needsWorkspace } = useAuth();

  if (isLoading)        return <FullPageSpinner />;
  if (!isAuthenticated) return <Navigate to="/login"            replace />;
  if (needsWorkspace)   return <Navigate to="/create-workspace" replace />;

  return <>{children}</>;
};

const RequireSession: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading)        return <FullPageSpinner />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // needsWorkspace=true is fine here — that's WHY they're on this page
  return <>{children}</>;
};

// ─── RequireRole ──────────────────────────────────────────────────────────────
const RequireRole: React.FC<{
  allowed: ("admin" | "manager" | "employee")[];
  children: React.ReactNode;
}> = ({ allowed, children }) => {
  const { role, isLoading } = useAuth();

  if (isLoading || !role) return <FullPageSpinner />;
  if (!allowed.includes(role)) return <Navigate to="/" replace />;

  return <>{children}</>;
};

// ─── Routes ───────────────────────────────────────────────────────────────────
// URL pattern: /:slug/role/page
// e.g. /pms-workspace/admin/members
//      /pms-workspace/manager/kanban
//      /pms-workspace/employee/tasks
function AppRoutes() {
  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Routes>

        {/* Root → role-based redirect (adds slug automatically) */}
        <Route path="/" element={<RoleRedirect />} />

        {/* ── Public ── */}
        <Route path="/login"  element={<LoginPage />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/register"         element={<RegisterPage />} />
               {/* ── Fresh admin — session exists but no workspace yet ── */}
          <Route
           path="/create-workspace"
           element={
            <RequireSession>
              <CreateWorkspacePage/>
            </RequireSession>
          }
        /> 

        {/* ── Admin  /:slug/admin/* ── */}
        <Route
          element={
            <RequireAuth>
              <RequireRole allowed={["admin"]}>
                <DashboardLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route path="/:slug/admin"           element={<AdminDashboard />} />
          <Route path="/:slug/admin/members"   element={<AdminMembers />} />
          <Route path="/:slug/admin/projects"  element={<AdminProjects />} />
          <Route path="/:slug/admin/analytics" element={<AdminAnalytics />} />
           <Route path="/:slug/admin/reports" element={<AdminReports />} />
           <Route path="/:slug/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* ── Manager  /:slug/manager/* ── */}
        <Route
          element={
            <RequireAuth>
              <RequireRole allowed={["manager"]}>
                <DashboardLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route path="/:slug/manager"          element={<ManagerDashboard />} />
          <Route path="/:slug/manager/projects" element={<ManagerProjects />} />
          <Route path="/:slug/manager/projects/:projectId/kanban"   element={<KanbanBoard />} />
          <Route path="/:slug/manager/team"     element={<ManagerTeam />} />
          <Route path="/:slug/manager/reports"  element={<ManagerReports />} />
        </Route>

        {/* ── Employee  /:slug/employee/* ── */}
        <Route
          element={
            <RequireAuth>
              <RequireRole allowed={["employee"]}>
                <DashboardLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route path="/:slug/employee"               element={<EmployeeDashboard />} />
          <Route path="/:slug/employee/tasks"         element={<MyTasks />} />
          <Route path="/:slug/employee/notifications" element={<Notifications />} />
          <Route path="/:slug/employee/profile"       element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

// Arjun drags "Fix login bug" from "To do" → "In progress"
//   → updateTaskStatus.mutate({ taskId: 5, status: "in_progress" })
//   → PATCH /workspaces/1/projects/3/tasks/5/status
//   → requireTaskUpdateAccess: assignee_id===Arjun OR manager_id===Priya → ✓
//   → UPDATE tasks SET status='in_progress'
//   → invalidates query → board re-renders
//   → Priya (manager), viewing same board, sees it move on her next refetch