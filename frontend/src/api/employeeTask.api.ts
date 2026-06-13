import api from '../lib/axios';
import type { Task } from '../types';
export const employeeTaskApi = {
  getEmployeeTasks: async (
    workspaceId: number
  ): Promise<Task[]> => {
    const { data } = await api.get(
      `/workspaces/${workspaceId}/tasks/employee`
    );

    return data.data;
  },
};