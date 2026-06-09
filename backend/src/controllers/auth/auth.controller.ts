
// import { Request, Response } from "express";
// import { successResponse } from "../../utils/response";
// export async function registerController(
//   req: Request,
//   res: Response
// ): Promise<void> {
//   const { name, email, password } = req.body;
 
//   const result = await registerService(name, email, password);
 
//   successResponse(res, result, "Registered successfully.", 201);
// }

// src/controllers/auth/auth.controller.ts  — add getMeController

import {Request, Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { successResponse } from "../../utils/response";
// import { getMeService } from "../../services/auth/auth.service";

// GET /auth/me
// Called on every app load by the frontend to restore session.
// Returns user + workspace + role → frontend redirects accordingly.
// export async function getMeController(
//   req: AuthRequest,
//   res: Response
// ): Promise<void> {
//   if (!req.user) {
//     res.status(401).json({ success: false, message: "Not authenticated." });
//     return;
//   }

//   const me = await getMeService(req.user.id);

//   successResponse(res, me, "Session restored.");
// }
// src/controllers/auth/auth.controller.ts

import { setAuthCookie, clearAuthCookie } from "../../utils/cookie";
import {
  loginService,
  registerService,
  createWorkspaceService,
    getMeService,
} from "../../services/auth/auth.service";

// ─── POST /auth/login ─────────────────────────────────────────────────────────
export async function loginController(
  req: Request,
  res: Response
): Promise<void> {
  const { email, password } = req.body;

  const result = await loginService(email, password);

  // Set JWT as httpOnly cookie — frontend never sees the raw token
  setAuthCookie(res, result.token);

  // Don't send token in body — only user + needsWorkspace flag
  successResponse(res, {
    user:           result.user,
    workspace:result.workspace,
    role:           result.role,
    needsWorkspace: result.needsWorkspace,
  }, "Logged in successfully.");
}

// ─── POST /auth/register ──────────────────────────────────────────────────────
export async function registerController(
  req: Request,
  res: Response
): Promise<void> {
  const { name, email, password } = req.body;

  const result = await registerService(name, email, password);

  setAuthCookie(res, result.token);

  successResponse(res, {
    user:           result.user,
    needsWorkspace: result.needsWorkspace,
  }, "Registered successfully.", 201);
}

// ─── POST /auth/logout ────────────────────────────────────────────────────────
export async function logoutController(
  _req: Request,
  res: Response
): Promise<void> {
  clearAuthCookie(res);
  successResponse(res, null, "Logged out successfully.");
}

// ─── GET /auth/me ─────────────────────────────────────────────────────────────
export async function getMeController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated." });
    return;
  }

  const me = await getMeService(req.user.id);

  successResponse(res, me, "Session restored.");
}

// ─── POST /auth/create-workspace ─────────────────────────────────────────────
export async function createWorkspaceController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated." });
    return;
  }

  const { name, slug } = req.body;

  const workspace = await createWorkspaceService(name, slug, req.user.id);

  successResponse(res, workspace, "Workspace created successfully.", 201);
}