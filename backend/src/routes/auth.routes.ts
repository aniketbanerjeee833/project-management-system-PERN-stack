import { Router } from "express";

import { asyncHandler } from "../middlewares/asyncHandler";
import { authenticate } from "../middlewares/authenticate";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema, registerSchema } from "../validators/auth.validator";
import { getMeController, loginController, registerController } from "../controllers/auth/auth.controller";
 const router = Router({ mergeParams: true });
// Protected — JWT required
router.post("/register",  validateRequest(registerSchema),  asyncHandler(registerController));
router.post("/login",     validateRequest(loginSchema),     asyncHandler(loginController));
router.get("/me", authenticate, asyncHandler(getMeController));
export default router