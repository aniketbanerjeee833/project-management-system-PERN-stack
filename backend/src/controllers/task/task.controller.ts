import {  Response } from "express";

import { successResponse } from "../../utils/response";
import { AuthRequest } from "../../types/auth.types";
import { createTaskService,  getTasksByProjectService } from "../../services/task/task.service";


// Returns MANY task objects
export async function createTaskController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const workspace_id = Number(req.params.workspaceId);
  const project_id = Number(req.params.projectId);
  if (!workspace_id) {
    res.status(400).json({
      success: false,
      message: "Workspace ID is required.",
    });
    return;
  }

  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Not authenticated.",
    });
    return;
  }

  const created_by = req.user.id;

  const {
  
    title,
    description,
    priority,
    assignee_id,
    due_date,
    parent_task_id,
  } = req.body;

  const task = await createTaskService({
    workspace_id,
    project_id,
    title,
    description,
    priority,
    assignee_id,
    created_by,
    due_date,
    parent_task_id,
  });

  successResponse(res,task,"Task created successfully.",201);
}

export async function getTasksByProjectController(
  req: AuthRequest,
  res: Response
): Promise<void> {

  const workspace_id = Number(req.params.workspaceId);
  const project_id = Number(req.params.projectId);

  const tasks = await getTasksByProjectService(
    workspace_id,
    project_id
  );

  successResponse(
    res,
    tasks,
    "Tasks fetched successfully."
  );
}
// export async function getAllTasksCreatedByManagerController(
//   req: AuthRequest,
//   res: Response
// ): Promise<void> {

//   if (!req.user) {
//     res.status(401).json({
//       success: false,
//       message: "Not authenticated.",
//     });
//     return;
//   }

//   const workspace_id = Number(req.params.workspaceId);
//   const manager_id = req.user.id;

//   const tasks = await getAllTasksCreatedByManagerService(workspace_id, manager_id);

//   successResponse(
//     res,
//     tasks,
//     "Tasks fetched successfully."
//   );
// }
// export async function getProjectsByManagerController(
//   req: AuthRequest,
//   res: Response
// ): Promise<void> {
  
  
//   const workspace_id = Number(req.params.workspaceId);
  
//   const manager_id = req.user!.id;

//   const projects = await getProjectsByManagerService(
//     workspace_id,
//     manager_id
//   );

//   successResponse(
//     res,
//     projects,
//     "Projects fetched successfully."
//   );
// }