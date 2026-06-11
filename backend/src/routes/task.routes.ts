// src/routes/task.routes.ts

// src/routes/task.routes.ts
import { Router } from "express";
import { authenticate }    from "../middlewares/authenticate";
import { requireRole }     from "../middlewares/requireRole";
import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler }    from "../middlewares/asyncHandler";
import { createTaskSchema } from "../validators/task.validator";
import {
  createTaskController,
  getTasksByProjectController,

 
  // ...other task controllers
} from "../controllers/task/task.controller";

const router = Router({ mergeParams: true });
// mergeParams: true → :workspaceId and :projectId from parent routers

// ── Create task — manager only ─────────────────────────────────────────────────
router.post(
  "/add",
  authenticate,
  requireRole(["manager"]),             // ← only managers in THIS workspace
  validateRequest(createTaskSchema),
  asyncHandler(createTaskController)
);

// ── Tasks created by the logged-in manager — manager only ─────────────────────
router.get(
  "/",
  authenticate,
  asyncHandler(getTasksByProjectController)
);

// ── Get all tasks in project — any workspace member can view ──────────────────
// router.get(
//   "/",
//   authenticate,
//   requireRole(["admin", "manager", "employee"]),
//   asyncHandler(getAllTasksController)
// );

export default router;