// src/routes/task.routes.ts

// src/routes/task.routes.ts
import { Router } from "express";
import { authenticate }    from "../middlewares/authenticate";
import { requireRole }     from "../middlewares/requireRole";
import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler }    from "../middlewares/asyncHandler";
import { createTaskSchema, getTasksByProjectSchema } from "../validators/task.validator";
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
   validateRequest(getTasksByProjectSchema),
  asyncHandler(getTasksByProjectController)
);
// ── Tasks assigned to logged-in employee ─────────────────────
// router.get(
//   "/employee",
//   authenticate,
//    requireRole(["employee"]),
//   asyncHandler(getTasksByEmployeeController)
// );

// ── Get all tasks in project — any workspace member can view ──────────────────
// router.get(
//   "/",
//   authenticate,
//   requireRole(["admin", "manager", "employee"]),
//   asyncHandler(getAllTasksController)
// );

export default router;


//CLAUDE GAVE 
// src/routes/task.routes.ts — uses requireTaskAccess

// import { Router } from "express";
// import { authenticate }     from "../middlewares/authenticate";
// import { requireRole }      from "../middlewares/requireRole";
// import { requireTaskAccess } from "../middlewares/requireTaskAccess";
// import { validateRequest }  from "../middlewares/validateRequest";
// import { asyncHandler }     from "../middlewares/asyncHandler";
// import { createTaskSchema, getTasksByProjectSchema } from "../validators/task.validator";
// import {
//   createTaskController,
//   getTasksByProjectController,
//   getTasksByEmployeeController,
// } from "../controllers/task/task.controller";

// const router = Router({ mergeParams: true });

// // ── Create task — manager only, must own this project ──────────────────────────
// router.post(
//   "/add",
//   authenticate,
//   requireRole(["manager"]),
//   requireTaskAccess(),                // ← task-level check
//   validateRequest(createTaskSchema),
//   asyncHandler(createTaskController)
// );

// // ── Get all tasks in project ────────────────────────────────────────────────────
// router.get(
//   "/",
//   authenticate,
//   requireRole(["manager", "employee"]),
//   requireTaskAccess(),                // ← task-level check
//   validateRequest(getTasksByProjectSchema),
//   asyncHandler(getTasksByProjectController)
// );

// // ── Tasks assigned to logged-in employee, within this project ──────────────────
// router.get(
//   "/employee",
//   authenticate,
//   requireRole(["employee"]),
//   requireTaskAccess(),                // ← task-level check
//   asyncHandler(getTasksByEmployeeController)
// );

// export default router;