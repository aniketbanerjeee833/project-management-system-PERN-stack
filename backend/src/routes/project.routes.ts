import { Router } from "express";
import { createProjectController, getAllProjectsController, getProjectsByManagerController } from "../controllers/project/project.controller";

import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler }    from "../middlewares/asyncHandler";
import { createProjectSchema } from "../validators/project.validator";
import { authenticate } from "../middlewares/authenticate";
import { requireRole } from "../middlewares/requireRole";
// import { requireProjectAccess } from "../middlewares/requireProjectAccess";

const router = Router({ mergeParams: true });
//  mergeParams: true  → gives access to :workspaceId from the parent router
// /workspaces/:workspaceId/projects
router.post(
  "/",
    authenticate,                             // 1. verify JWT, set req.user
    requireRole(["admin"]),
  validateRequest(createProjectSchema),          // 2. zod validation
  asyncHandler(createProjectController)          // 3. business logic
);
router.get(
  "/",
  authenticate,
  requireRole(["admin"]),
  asyncHandler(getAllProjectsController)
);

router.get(
  "/managers",
  authenticate,
   requireRole(["manager"]),
  //  requireProjectAccess(),
  asyncHandler(getProjectsByManagerController)
);


export default router;