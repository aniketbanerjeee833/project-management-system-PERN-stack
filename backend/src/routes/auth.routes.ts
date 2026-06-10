import { Router } from "express";

import { asyncHandler } from "../middlewares/asyncHandler";
import { authenticate } from "../middlewares/authenticate";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { createWorkspaceController, getMeController, loginController, logoutController, registerController } from "../controllers/auth/auth.controller";
 const router = Router({ mergeParams: true });
// Protected — JWT required
router.post("/register",  validateRequest(registerSchema),  asyncHandler(registerController));
router.post("/login",     validateRequest(loginSchema),     asyncHandler(loginController));
router.get("/me", authenticate, asyncHandler(getMeController));
router.post("/logout", authenticate, asyncHandler(logoutController));
router.post("/create-workspace", authenticate, asyncHandler(createWorkspaceController));
export default router