// src/routes/invitation.routes.ts
import { Router } from "express";

import { asyncHandler }    from "../middlewares/asyncHandler";
import { authenticate }    from "../middlewares/authenticate";
// import {
//   sendInviteController,
//   validateInviteController,
//   acceptInviteController,
// } from "../controllers/auth/auth.controller";
// import {
//   sendInviteSchema,
//   acceptInviteSchema,
// } from "../validators/auth.validator";
import { sendInvitationController } from "../controllers/invitation/invitation.controller";
import {  sendInviteSchema } from "../validators/invitation.validator";
import { validateRequest } from "../middlewares/validateRequest";


// ── Routes mounted under /workspaces/:workspaceId/invitations ─────────────────
const router = Router({ mergeParams: true });
// mergeParams: true → gives access to :workspaceId from parent router

router.post(
  "/",
  authenticate,                         // 1. verify JWT, set req.user
  validateRequest(sendInviteSchema),    // 2. zod: email + role
  asyncHandler(sendInvitationController)    // 3. generate token, insert row, send email
);

// ── Routes mounted under /invitations (public — no auth needed) ───────────────
// const publicInviteRouter = Router();

// // GET /invitations/:token
// // Called by frontend before showing register/login form
// // Returns { email, role, workspace_name } so UI can show
// // "You're joining Acme Corp as Manager"
// publicInviteRouter.get(
//   "/:token",
//   asyncHandler(validateInviteController)
// );

// // POST /invitations/:token/accept
// // Called after user fills register or login form on the invite page
// publicInviteRouter.post(
//   "/:token/accept",
//   validateRequest(acceptInviteSchema),
//   asyncHandler(acceptInviteController)
// );

export default router