import type {
  User, Project, Task, AppNotification,
  TeamMember, Analytics, WorkspaceStats,
} from '../types'

export const currentUsers = {
  admin: {
    id: 'u1', name: 'Rahul Sharma', email: 'rahul@workspace.io',
    role: 'admin' as const, avatar: 'RS', joinedDate: '2022-01-15',
    status: 'active' as const, department: 'Engineering',
  },
  manager: {
    id: 'u2', name: 'Priya Verma', email: 'priya@workspace.io',
    role: 'manager' as const, avatar: 'PV', joinedDate: '2022-03-20',
    status: 'active' as const, department: 'Product',
  },
  employee: {
    id: 'u3', name: 'Arjun Singh', email: 'arjun@workspace.io',
    role: 'employee' as const, avatar: 'AS', joinedDate: '2023-06-10',
    status: 'active' as const, department: 'Design',
  },
}

export const allUsers: User[] = [
  currentUsers.admin,
  currentUsers.manager,
  currentUsers.employee,
  { id: 'u4', name: 'Neha Kapoor',  email: 'neha@workspace.io',   role: 'employee', avatar: 'NK', joinedDate: '2023-01-05', status: 'active',   department: 'Engineering' },
  { id: 'u5', name: 'Vikram Joshi', email: 'vikram@workspace.io',  role: 'manager',  avatar: 'VJ', joinedDate: '2022-08-12', status: 'active',   department: 'Marketing'   },
  { id: 'u6', name: 'Sneha Pillai', email: 'sneha@workspace.io',   role: 'employee', avatar: 'SP', joinedDate: '2023-09-18', status: 'pending',  department: 'Design'      },
  { id: 'u7', name: 'Karan Mehta',  email: 'karan@workspace.io',   role: 'employee', avatar: 'KM', joinedDate: '2022-11-30', status: 'inactive', department: 'Engineering' },
  { id: 'u8', name: 'Ananya Rao',   email: 'ananya@workspace.io',  role: 'employee', avatar: 'AR', joinedDate: '2024-02-14', status: 'active',   department: 'Marketing'   },
]

export const projects: Project[] = [
  { id: 'p1', name: 'Orion Design System',  description: 'Unified component library and design tokens for all products',        managerId: 'u2', managerName: 'Priya Verma',  progress: 72,  teamCount: 5, dueDate: '2026-07-30', status: 'active',    color: '#6366f1', tags: ['design', 'ui']           },
  { id: 'p2', name: 'Phoenix API Revamp',   description: 'Migrate legacy REST endpoints to GraphQL with full type safety',       managerId: 'u5', managerName: 'Vikram Joshi', progress: 45,  teamCount: 7, dueDate: '2026-08-15', status: 'active',    color: '#f59e0b', tags: ['backend', 'api']          },
  { id: 'p3', name: 'Nebula Analytics',     description: 'Real-time event tracking and business intelligence platform',          managerId: 'u2', managerName: 'Priya Verma',  progress: 88,  teamCount: 4, dueDate: '2026-06-20', status: 'active',    color: '#10b981', tags: ['analytics', 'data']       },
  { id: 'p4', name: 'Voyager Mobile App',   description: 'Cross-platform mobile experience for iOS and Android',                 managerId: 'u5', managerName: 'Vikram Joshi', progress: 30,  teamCount: 6, dueDate: '2026-09-01', status: 'active',    color: '#ec4899', tags: ['mobile', 'react-native']  },
  { id: 'p5', name: 'Atlas CMS',            description: 'Content management system with AI-assisted writing tools',             managerId: 'u2', managerName: 'Priya Verma',  progress: 100, teamCount: 3, dueDate: '2026-05-01', status: 'completed', color: '#8b5cf6', tags: ['cms', 'ai']               },
]

export const tasks: Task[] = [
  { id: 't1',  title: 'Design token architecture',  description: 'Define color, spacing, and typography tokens',          projectId: 'p1', projectName: 'Orion Design System',  assigneeId: 'u3', assigneeName: 'Arjun Singh',  assignedById: 'u2', assignedByName: 'Priya Verma',  priority: 'critical', status: 'in-progress', dueDate: '2026-06-05', tags: ['design', 'tokens'],      createdAt: '2026-05-20' },
  { id: 't2',  title: 'Button component variants',   description: 'Implement all button states and sizes',                projectId: 'p1', projectName: 'Orion Design System',  assigneeId: 'u3', assigneeName: 'Arjun Singh',  assignedById: 'u2', assignedByName: 'Priya Verma',  priority: 'high',     status: 'todo',        dueDate: '2026-06-10', tags: ['component', 'ui'],       createdAt: '2026-05-21' },
  { id: 't3',  title: 'Storybook documentation',    description: 'Write stories for all component variants',             projectId: 'p1', projectName: 'Orion Design System',  assigneeId: 'u3', assigneeName: 'Arjun Singh',  assignedById: 'u2', assignedByName: 'Priya Verma',  priority: 'medium',   status: 'backlog',     dueDate: '2026-06-20', tags: ['docs'],                  createdAt: '2026-05-22' },
  { id: 't4',  title: 'Dashboard charts wireframe', description: 'Create wireframes for analytics dashboard',            projectId: 'p3', projectName: 'Nebula Analytics',     assigneeId: 'u3', assigneeName: 'Arjun Singh',  assignedById: 'u2', assignedByName: 'Priya Verma',  priority: 'high',     status: 'review',      dueDate: '2026-06-01', tags: ['wireframe', 'analytics'], createdAt: '2026-05-18' },
  { id: 't5',  title: 'Accessibility audit',        description: 'WCAG 2.1 AA compliance check for all components',      projectId: 'p1', projectName: 'Orion Design System',  assigneeId: 'u3', assigneeName: 'Arjun Singh',  assignedById: 'u2', assignedByName: 'Priya Verma',  priority: 'low',      status: 'done',        dueDate: '2026-05-28', tags: ['a11y'],                  createdAt: '2026-05-10' },
  { id: 't6',  title: 'GraphQL schema design',      description: 'Define types and resolvers for the new API',           projectId: 'p2', projectName: 'Phoenix API Revamp',   assigneeId: 'u4', assigneeName: 'Neha Kapoor',  assignedById: 'u5', assignedByName: 'Vikram Joshi', priority: 'critical', status: 'in-progress', dueDate: '2026-06-08', tags: ['backend', 'graphql'],    createdAt: '2026-05-19' },
  { id: 't7',  title: 'User authentication flow',   description: 'Implement OAuth2 with refresh token rotation',         projectId: 'p2', projectName: 'Phoenix API Revamp',   assigneeId: 'u7', assigneeName: 'Karan Mehta',  assignedById: 'u5', assignedByName: 'Vikram Joshi', priority: 'high',     status: 'todo',        dueDate: '2026-06-15', tags: ['auth', 'security'],      createdAt: '2026-05-20' },
  { id: 't8',  title: 'Event tracking SDK',         description: 'Build lightweight JS SDK for event ingestion',         projectId: 'p3', projectName: 'Nebula Analytics',     assigneeId: 'u8', assigneeName: 'Ananya Rao',   assignedById: 'u2', assignedByName: 'Priya Verma',  priority: 'high',     status: 'in-progress', dueDate: '2026-06-12', tags: ['sdk', 'tracking'],       createdAt: '2026-05-21' },
  { id: 't9',  title: 'Mobile nav component',       description: 'Responsive navigation drawer for mobile',              projectId: 'p4', projectName: 'Voyager Mobile App',   assigneeId: 'u6', assigneeName: 'Sneha Pillai', assignedById: 'u5', assignedByName: 'Vikram Joshi', priority: 'medium',   status: 'backlog',     dueDate: '2026-07-01', tags: ['mobile', 'nav'],         createdAt: '2026-05-22' },
  { id: 't10', title: 'Icon library integration',   description: 'Integrate custom icon set with design system',         projectId: 'p1', projectName: 'Orion Design System',  assigneeId: 'u3', assigneeName: 'Arjun Singh',  assignedById: 'u2', assignedByName: 'Priya Verma',  priority: 'low',      status: 'backlog',     dueDate: '2026-06-25', tags: ['icons', 'design'],       createdAt: '2026-05-23' },
]

export const notifications: AppNotification[] = [
  { id: 'n1', userId: 'u3', title: 'New task assigned',      message: 'Priya assigned you "Design token architecture" on Orion Design System',          type: 'task',     read: false, createdAt: '2026-05-30T09:15:00', actorName: 'Priya Verma',  actorAvatar: 'PV' },
  { id: 'n2', userId: 'u3', title: 'Comment on your task',   message: 'Priya commented on "Dashboard charts wireframe": Great work, a few tweaks needed.', type: 'comment',  read: false, createdAt: '2026-05-30T08:30:00', actorName: 'Priya Verma',  actorAvatar: 'PV' },
  { id: 'n3', userId: 'u3', title: 'Deadline approaching',   message: '"Dashboard charts wireframe" is due in 2 days.',                                    type: 'deadline', read: true,  createdAt: '2026-05-29T17:00:00', actorName: 'System',       actorAvatar: 'SY' },
  { id: 'n4', userId: 'u3', title: 'Task moved to Review',   message: 'Priya moved "Dashboard charts wireframe" to Review.',                               type: 'task',     read: true,  createdAt: '2026-05-29T14:20:00', actorName: 'Priya Verma',  actorAvatar: 'PV' },
  { id: 'n5', userId: 'u3', title: 'You were mentioned',     message: 'Rahul mentioned you in the #design channel.',                                       type: 'mention',  read: true,  createdAt: '2026-05-28T11:00:00', actorName: 'Rahul Sharma', actorAvatar: 'RS' },
  { id: 'n6', userId: 'u3', title: 'Task completed',         message: 'You completed "Accessibility audit". Great job!',                                   type: 'system',   read: true,  createdAt: '2026-05-27T16:45:00', actorName: 'System',       actorAvatar: 'SY' },
]

export const teamMembers: TeamMember[] = [
  { userId: 'u3', name: 'Arjun Singh',  avatar: 'AS', assignedTasks: 5, completedTasks: 3, completionRate: 82, status: 'busy',      currentTask: 'Design token architecture' },
  { userId: 'u4', name: 'Neha Kapoor',  avatar: 'NK', assignedTasks: 4, completedTasks: 3, completionRate: 90, status: 'available', currentTask: 'GraphQL schema design'      },
  { userId: 'u6', name: 'Sneha Pillai', avatar: 'SP', assignedTasks: 2, completedTasks: 1, completionRate: 65, status: 'away',      currentTask: 'Mobile nav component'       },
  { userId: 'u7', name: 'Karan Mehta',  avatar: 'KM', assignedTasks: 3, completedTasks: 2, completionRate: 78, status: 'available', currentTask: 'User authentication flow'   },
  { userId: 'u8', name: 'Ananya Rao',   avatar: 'AR', assignedTasks: 3, completedTasks: 2, completionRate: 88, status: 'busy',      currentTask: 'Event tracking SDK'         },
]

export const analytics: Analytics = {
  projectGrowth: [
    { month: 'Jan', projects: 3 },
    { month: 'Feb', projects: 4 },
    { month: 'Mar', projects: 4 },
    { month: 'Apr', projects: 5 },
    { month: 'May', projects: 5 },
    { month: 'Jun', projects: 6 },
  ],
  taskCompletion: [
    { week: 'W1', completed: 12, total: 18 },
    { week: 'W2', completed: 15, total: 20 },
    { week: 'W3', completed: 10, total: 16 },
    { week: 'W4', completed: 18, total: 22 },
    { week: 'W5', completed: 20, total: 24 },
    { week: 'W6', completed: 22, total: 26 },
  ],
  teamPerformance: [
    { name: 'Arjun',  score: 82 },
    { name: 'Neha',   score: 90 },
    { name: 'Sneha',  score: 65 },
    { name: 'Karan',  score: 78 },
    { name: 'Ananya', score: 88 },
  ],
  revenueData: [
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 48000 },
    { month: 'Mar', revenue: 51000 },
    { month: 'Apr', revenue: 58000 },
    { month: 'May', revenue: 63000 },
    { month: 'Jun', revenue: 71000 },
  ],
}

export const workspaceStats: WorkspaceStats = {
  totalMembers: 8,
  totalProjects: 5,
  openTasks: 7,
  revenue: 71000,
  healthScore: 84,
}

export const recentActivities = [
  { id: 'a1', actor: 'Priya Verma',  action: 'created project', target: 'Orion Design System',    time: '2 hours ago', type: 'project' },
  { id: 'a2', actor: 'Arjun Singh',  action: 'completed task',  target: 'Accessibility audit',    time: '4 hours ago', type: 'task'    },
  { id: 'a3', actor: 'Rahul Sharma', action: 'invited',         target: 'Ananya Rao',             time: '6 hours ago', type: 'member'  },
  { id: 'a4', actor: 'Neha Kapoor',  action: 'moved to Review', target: 'GraphQL schema design',  time: '1 day ago',   type: 'task'    },
  { id: 'a5', actor: 'Vikram Joshi', action: 'archived project', target: 'Atlas CMS',             time: '2 days ago',  type: 'project' },
]