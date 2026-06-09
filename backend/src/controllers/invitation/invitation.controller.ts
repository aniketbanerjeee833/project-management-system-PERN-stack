// import { Request, Response } from "express";
// import { successResponse } from "../../utils/response";
// import { AuthRequest } from "../../types/auth.types";
// import { acceptInviteService, sendInviteService, validateInviteTokenService } from "../../services/invitation/invitation.service";
// export async function sendInvitationController(
//   req: AuthRequest,
//   res: Response
// ): Promise<void> {
//   const workspace_id = Number(req.params.workspaceId);

//   if (!workspace_id) {
//     res.status(400).json({
//       success: false,
//       message: "Workspace ID is required.",
//     });
//     return;
//   }

//   if (!req.user) {
//     res.status(401).json({
//       success: false,
//       message: "Not authenticated.",
//     });
//     return;
//   }

//   const invited_by = req.user.id;

//   const { email, role } = req.body;

//   if (!email || !role) {
//     res.status(400).json({
//       success: false,
//       message: "Email and role are required.",
//     });
//     return;
//   }

//   const invitation = await sendInviteService(
//     workspace_id,
//     email,
//     role,
//     invited_by
//   );

//   successResponse(
//     res,
//     invitation,
//     "Invitation sent successfully.",
//     201
//   );
// }
// //First validate then accept
// export async function validateInviteController(
//   req: Request,
//   res: Response
// ): Promise<void> {
//   const { token } = req.params as { token: string };
//   console.log("Validating invite token:", token);
//   const data = await validateInviteTokenService(token);
 
//   successResponse(res, data, "Invite is valid.");
// }
 
// export async function acceptInviteController(
//   req: Request,
//   res: Response
// ): Promise<void> {
//   const { token } = req.params as { token: string };
//   const { name, email, password, isNewUser } = req.body;
 
//   const result = await acceptInviteService(token, name, email, password, isNewUser);
 
//   successResponse(res, result, "Joined workspace successfully.", 201);
// }

// src/controllers/invitation/invitation.controller.ts
// Only acceptInviteController changes — setAuthCookie instead of returning token

import { Request, Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { successResponse } from "../../utils/response";
import { setAuthCookie } from "../../utils/cookie";
import {
  sendInviteService,
  validateInviteTokenService,
  acceptInviteService,
} from "../../services/invitation/invitation.service";

// ─── POST /workspaces/:workspaceId/invitations ────────────────────────────────
export async function sendInvitationController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated." });
    return;
  }

  const workspace_id = Number(req.params.workspaceId);
  if (!workspace_id) {
    res.status(400).json({ success: false, message: "Workspace ID is required." });
    return;
  }

  const { email, role } = req.body;

  const invitation = await sendInviteService(workspace_id, email, role, req.user.id);

  successResponse(res, invitation, "Invitation sent successfully.", 201);
}

// ─── GET /invitations/:token ──────────────────────────────────────────────────
export async function validateInviteController(
  req: Request,
  res: Response
): Promise<void> {
  const { token } = req.params as { token: string };

  const data = await validateInviteTokenService(token);

  successResponse(res, data, "Invite is valid.");
}

// ─── POST /invitations/:token/accept ─────────────────────────────────────────
export async function acceptInviteController(
  req: Request,
  res: Response
): Promise<void> {
  const { token } = req.params as { token: string };
  const { name, email, password, isNewUser } = req.body;

  const result = await acceptInviteService(token, name, email, password, isNewUser);

  // Set cookie — same as login/register
  setAuthCookie(res, result.token);

  // Don't send raw token in body
  successResponse(res, {
    user:         result.user,
    workspace_id: result.workspace_id,
    role:         result.role,
    needsWorkspace: false,
  }, "Joined workspace successfully.", 201);
}