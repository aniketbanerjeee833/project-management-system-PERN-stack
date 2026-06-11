import api from '../lib/axios';

export interface Manager {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  workspace_id: number;
  name: string;
  description: string | null;
  status: 'active' | 'hold' | 'completed';
  manager_id: number | null;
  manager?: Manager;
  start_date: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectFormData {
  name: string;
  description?: string;
  manager_id?: number;
  start_date?: string;
  due_date?: string;
}

export interface UpdateProjectData extends ProjectFormData {
  status?: Project['status'];
}

// ── named exports (keep these if used elsewhere) ─────────────
export const fetchProjects = async (workspaceId: number): Promise<Project[]> => {
  const { data } = await api.get(`/workspaces/${workspaceId}/projects`);
  return data.data;
};

// ── object the hook will use ──────────────────────────────────
export const projectApi = {

  getAll: async (workspaceId: number): Promise<Project[]> => {
    const { data } = await api.get(`/workspaces/${workspaceId}/projects`);
    return data.data;
  },

  getOne: async (workspaceId: number, projectId: number): Promise<Project> => {
    const { data } = await api.get(`/workspaces/${workspaceId}/projects/${projectId}`);
    return data.data;
  },

  create: async (workspaceId: number, body: ProjectFormData): Promise<Project> => {
    const { data } = await api.post(`/workspaces/${workspaceId}/projects`, body);
    return data.data;
  },

  update: async (
    workspaceId: number,
    projectId: number,
    body: UpdateProjectData
  ): Promise<Project> => {
    const { data } = await api.put(`/workspaces/${workspaceId}/projects/${projectId}`,body);
    return data.data;
  },

  remove: async (workspaceId: number, projectId: number): Promise<void> => {
    await api.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
  },
  getProjectsByManagers: async (workspaceId: number): Promise<Project[]> => {
    const { data } = await api.get(`/workspaces/${workspaceId}/projects/managers`);
    return data.data;
  },
  

};