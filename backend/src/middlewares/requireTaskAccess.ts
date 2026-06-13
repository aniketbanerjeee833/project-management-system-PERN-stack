// src/middlewares/requireTaskAccess.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";
import { pool } from "../db/pool";
import { AppError } from "../utils/AppError";

/**
 * Use on routes that access TASK-level resources within a project:
 *   GET  /workspaces/:wsId/projects/:projectId/tasks
 *   POST /workspaces/:wsId/projects/:projectId/tasks/add
 *   GET  /workspaces/:wsId/projects/:projectId/tasks/employee
 *
 * Grants access if the logged-in user is EITHER:
 *   1. The MANAGER of this project, OR
 *   2. An EMPLOYEE with at least one task assigned to them in this project
 *
 * Must run AFTER authenticate + requireRole(["manager","employee"]).
 */
export function requireTaskAccess() {
  return async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    const project_id = Number(req.params.projectId);
    const user_id    = req.user!.id;

    if (!project_id) {
      throw new AppError("Project ID is required.", 400);
    }

    const { rows } = await pool.query(
      `
      SELECT 1 FROM projects
        WHERE id = $1 AND manager_id = $2

      UNION

      SELECT 1 FROM tasks
        WHERE project_id = $1 AND assignee_id = $2

      LIMIT 1
      `,
      [project_id, user_id]
    );

    if (!rows.length) {
      throw new AppError("You do not have access to this project's tasks.", 403);
    }

    next();
  };
}