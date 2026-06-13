import { useQuery } from '@tanstack/react-query';
import { employeeTaskApi } from '../../api/employeeTask.api';
 
export const myTasksKeys = {
  all: (workspaceId: number) => ['workspaces', workspaceId, 'tasks', 'me'] as const,
};
 
export const useEmployeeTasks = (workspaceId: number) => {
  const employeeTasks = useQuery({
    queryKey: myTasksKeys.all(workspaceId),
    queryFn:  () => employeeTaskApi.getEmployeeTasks(workspaceId),
    enabled:  Boolean(workspaceId),
  });
 
  return { employeeTasks };  // .data → Tasks[] (with project_name, assignee_name)
};