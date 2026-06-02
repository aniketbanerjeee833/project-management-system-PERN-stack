import { Router } from "express";
import { createProjectController, getAllProjectsController } from "../controllers/project/project.controller";

import { validateRequest } from "../middlewares/validateRequest";
import { asyncHandler }    from "../middlewares/asyncHandler";
import { createProjectSchema } from "../validators/project.validator";
import { authenticate } from "../middlewares/authenticate";

const router = Router({ mergeParams: true });
//  mergeParams: true  → gives access to :workspaceId from the parent router

router.post(
  "/",
    authenticate,                             // 1. verify JWT, set req.user
  validateRequest(createProjectSchema),          // 2. zod validation
  asyncHandler(createProjectController)          // 3. business logic
);
router.get(
  "/",
  authenticate,
  asyncHandler(getAllProjectsController)
);

export default router;