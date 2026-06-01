import { Request, Response } from "express";
import { createProjectService } from "../../services/project/project.service";
import { successResponse } from "../../utils/response";

/**
 * POST /workspaces/:workspaceId/projects/:workspace_id
 *
 * Auth:   →  req.user set by authenticate middleware
 * Access: admin | manager only  (enforced inside the service)
 */
export async function createProjectController(
  req: Request,
  res: Response
): Promise<void> {
  const workspace_id = Number(req.params.workspaceId);
  if(!workspace_id) {
    res.status(400).json({ success: false, message: "Workspace ID is required." });
    return;
  }
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated." });
    return;
  }

  const actor_id = req.user.id; // no ! needed now middleware

  const { name, description, manager_id, start_date, due_date } = req.body;

  const project = await createProjectService({
    workspace_id,
    actor_id,
    name,
    description,
    manager_id,
    start_date,
    due_date,
  });

  successResponse(res, project, "Project created successfully.", 201);
}