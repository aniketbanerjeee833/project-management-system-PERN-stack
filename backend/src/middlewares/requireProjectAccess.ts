// import { Response, NextFunction } from "express";
// import { AuthRequest } from "../types/auth.types";
// import { pool } from "../db/pool";
// import { AppError } from "../utils/AppError";
// export function requireProjectAccess() {
//   return async (
//     req: AuthRequest,
//     _res: Response,
//     next: NextFunction
//   ) => {
//     const project_id = Number(req.params.projectId);

//     const { rows } = await pool.query(
//       `
//       SELECT 1
//       FROM projects
//       WHERE project_id = $1
//       AND manager_id = $2
//       `,
//       [project_id, req.user!.id]
//     );

//     if (!rows.length) {
//       throw new AppError(
//         "You are not assigned to this project.",
//         403
//       );
//     }

//     next();
//   };
// }

// src/middlewares/requireProjectAccess.ts
import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/auth.types";
import { pool } from "../db/pool";
import { AppError } from "../utils/AppError";

/**
 * Use on routes that access PROJECT-level resources:
 *   GET    /workspaces/:wsId/projects/:projectId
 *   PUT    /workspaces/:wsId/projects/:projectId
 *   DELETE /workspaces/:wsId/projects/:projectId
 *
 * Grants access if the logged-in user is the MANAGER of this project.
 *
 * Must run AFTER authenticate + requireRole(["manager"]).
 */
export function requireProjectAccess() {
  return async (
    req: AuthRequest,
    _res: Response,
    next: NextFunction
  ): Promise<void> => {
    // const project_id = Number(req.params.projectId);
    const user_id    = req.user!.id;

  

    // const { rows } = await pool.query(
    //   `SELECT 1 FROM projects WHERE id = $1 AND manager_id = $2`,
    //   [project_id, user_id]
    // );

    const { rows } = await pool.query(
      `SELECT 1 FROM projects WHERE  manager_id = $2`,
      [ user_id]
    );

    if (!rows.length) {
      throw new AppError("You are not the manager of this project.", 403);
    }

    next();
  };
}