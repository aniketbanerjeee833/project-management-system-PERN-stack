export type Role = 'admin' | 'manager' | 'employee';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type Priority = "low" | "medium" | "high" | "urgent";
export type UserStatus = 'active' | 'inactive' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  joinedDate: string;
  status: UserStatus;
  department: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  managerId: string;
  managerName: string;
  progress: number;
  teamCount: number;
  start_date:string;
  due_date:string;
  // dueDate: string;
  status: 'active' | 'archived' | 'completed';
  color: string;
  tags: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  projectName: string;
  assigneeId: string;
  assignee_name: string;
  // assignedById: string;
  // assignedByName: string;
  priority: Priority;
  status: TaskStatus;
  due_date: string;
 
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'task' | 'comment' | 'deadline' | 'mention' | 'system';
  read: boolean;
  createdAt: string;
  actorName: string;
  actorAvatar: string;
}

export type AppNotification = Notification;

export interface TeamMember {
  userId: string;
  name: string;
  avatar: string;
  assignedTasks: number;
  completedTasks: number;
  completionRate: number;
  status: 'available' | 'busy' | 'away';
  currentTask?: string;
}

export interface Analytics {
  projectGrowth: { month: string; projects: number }[];
  taskCompletion: { week: string; completed: number; total: number }[];
  teamPerformance: { name: string; score: number }[];
  revenueData: { month: string; revenue: number }[];
}

export interface WorkspaceStats {
  totalMembers: number;
  totalProjects: number;
  openTasks: number;
  revenue: number;
  healthScore: number;
}