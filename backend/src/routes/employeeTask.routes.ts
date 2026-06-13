// src/routes/myTasks.routes.ts
// Mounted at: /workspaces/:workspaceId/tasks  (NOT nested under projects)

import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { requireRole }  from "../middlewares/requireRole";
import { asyncHandler } from "../middlewares/asyncHandler";
import {  getTasksByEmployeeController } from "../controllers/task/task.controller";

const router = Router({ mergeParams: true });
// mergeParams: true → :workspaceId available from app.ts mount

// GET /workspaces/:workspaceId/tasks/me
// Returns ALL tasks assigned to the logged-in employee, across every project
// in this workspace. Used by MyTasks.tsx.
router.get(
  "/employee",
  authenticate,
  requireRole(["employee"]),   // confirms membership in THIS workspace as employee
  asyncHandler(getTasksByEmployeeController)
);

export default router;