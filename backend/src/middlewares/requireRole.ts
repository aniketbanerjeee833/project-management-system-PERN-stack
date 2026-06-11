// src/middlewares/requireRole.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";
import { pool } from "../db/pool";
import { AppError } from "../utils/AppError";
// import { AppError } from "../errors/AppError";
// import pool from "../db/db";

type Role = "admin" | "manager" | "employee";

/**
 * Checks that the authenticated user has one of the allowed roles
 * IN THIS WORKSPACE (workspace_id comes from req.params.workspaceId).
 *
 * Must run AFTER `authenticate` — relies on req.user.id being set.
 *
 * Usage:
 *   router.post(
 *     "/",
 *     authenticate,
 *     requireRole(["manager"]),
 *     validateRequest(createTaskSchema),
 *     asyncHandler(createTaskController)
 *   );
 */
export function requireRole(allowed: Role[]) {
  return async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      throw new AppError("Not authenticated.", 401);
    }

    const workspace_id = Number(req.params.workspaceId);
    if (!workspace_id) {
      throw new AppError("Workspace ID is required.", 400);
    }

    const { rows } = await pool.query<{ role: Role }>(
      `SELECT role FROM workspace_members
       WHERE workspace_id = $1 AND user_id = $2
       LIMIT 1`,
      [workspace_id, req.user.id]
    );

    const membership = rows[0];

    if (!membership) {
      throw new AppError("You are not a member of this workspace.", 403);
    }

    if (!allowed.includes(membership.role)) {
      throw new AppError("You do not have permission to perform this action.", 403);
    }

    // Optional: attach role to req.user for downstream use (e.g. service logic)
    req.user.role = membership.role;

    next();
  };
}