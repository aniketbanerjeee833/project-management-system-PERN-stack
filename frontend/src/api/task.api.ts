import api from '../lib/axios';

export interface Manager {
  id: number;
  name: string;
}

// export interface Project {
//   id: number;
//   workspace_id: number;
//   name: string;
//   description: string | null;
//   status: 'active' | 'hold' | 'completed';
//   manager_id: number | null;
//   manager?: Manager;
//   start_date: string | null;
//   due_date: string | null;
//   created_at: string;
//   updated_at: string;
// }

// export interface ProjectFormData {
//   name: string;
//   description?: string;
//   manager_id?: number;
//   start_date?: string;
//   due_date?: string;
// }
export interface Task {
  id:             number;
  workspace_id:   number;
  project_id:     number;
  title:          string;
  description:    string | null;
  status:         "todo" | "in_progress" | "review" | "done";
  priority:       "low" | "medium" | "high" | "urgent";
  assignee_id:    number | null;   // nullable = unassigned
  created_by:     number;
  due_date:       string | null;
  position:       number;          // order within the status column
  parent_task_id: number | null;   // null = top-level task, else a subtask
  created_at:     string;
  updated_at:     string;

  // Optional joined fields (when assignee info is fetched alongside)
//   assignee?: {
//     id:         number;
//     name:       string;
//     avatar_url: string | null;
//   } | null;
}

export interface TaskFormData {
  project_id:     number;
  title:          string;
  description?:   string;
  priority?:      "low" | "medium" | "high" | "urgent";
  assignee_id?:   number | null;
  due_date?:      string | null;
  parent_task_id?: number | null;
}
// project_id,
//     title,
//     description,
//     priority,
//     assignee_id,
//     due_date,
//     parent_task_id,
// export interface UpdateProjectData extends ProjectFormData {
//   status?: Project['status'];
// }

// ── named exports (keep these if used elsewhere) ─────────────
// export const fetchProjects = async (workspaceId: number): Promise<Project[]> => {
//   const { data } = await api.get(`/workspaces/${workspaceId}/projects`);
//   return data.data;
// };

// ── object the hook will use ──────────────────────────────────
export const taskApi = {

//   getAll: async (workspaceId: number): Promise<Project[]> => {
//     const { data } = await api.get(`/workspaces/${workspaceId}/projects`);
//     return data.data;
//   },

//   getOne: async (workspaceId: number, projectId: number): Promise<Project> => {
//     const { data } = await api.get(`/workspaces/${workspaceId}/projects/${projectId}`);
//     return data.data;
//   },

  create: async (workspaceId: number, projectId: number, body: TaskFormData): Promise<Task> => {
    const { data } = await api.post(`/workspaces/${workspaceId}/projects/${projectId}/tasks/add`, body);
    return data.data;
  },
  getAllTaskByProject: async (workspaceId: number, projectId: number): Promise<Task[]> => {
    const { data } = await api.get(`/workspaces/${workspaceId}/projects/${projectId}/tasks`);
    return data.data;
  }

//   update: async (
//     workspaceId: number,
//     projectId: number,
//     body: UpdateProjectData
//   ): Promise<Project> => {
//     const { data } = await api.put(`/workspaces/${workspaceId}/projects/${projectId}`,body);
//     return data.data;
//   },

//   remove: async (workspaceId: number, projectId: number): Promise<void> => {
//     await api.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
//   },
//   getProjectsByManagers: async (workspaceId: number): Promise<Project[]> => {
//     const { data } = await api.get(`/workspaces/${workspaceId}/projects/managers`);
//     return data.data;
//   },

};