// services/task/task.service.ts

import {findTasksByEmployee, findTasksByProject, insertTask } from "../../repositories/task/task.repository";
import { Task } from "../../types/task.types";

// import {
//   insertTask,
//   findTasksCreatedByManager,
// } from "../../repositories/task/task.repository";

interface CreateTaskInput {
  workspace_id: number;
  project_id: number;
  title: string;
  description?: string;
  priority?: "low" | "medium" | "high" | "urgent";
  assignee_id?: number | null;
  created_by: number;
  due_date?: string | null;
  parent_task_id?: number | null;
}

export async function createTaskService(
  data: CreateTaskInput
) :Promise<Task>{
  return await insertTask(data);
}
export async function getTasksByProjectService(
  workspace_id: number,
  project_id: number
): Promise<Task[]> {

  return await findTasksByProject(
    workspace_id,
    project_id
  );
}

export async function getTasksByEmployeeService(
  workspace_id: number,
  employee_id: number
): Promise<Task[]> {
  return await findTasksByEmployee(
    workspace_id,
    employee_id
  );
}

// export async function getAllTasksCreatedByManagerService(
//   workspace_id: number,
//   manager_id: number
// ) :Promise<Task[]> {
//   return await findAllTasksCreatedByManager(workspace_id,manager_id);
// }