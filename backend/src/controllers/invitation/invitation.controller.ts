import {  Response } from "express";
import { successResponse } from "../../utils/response";
import { AuthRequest } from "../../types/auth.types";
import { sendInviteService } from "../../services/invitation/invitation.service";
export async function sendInvitationController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const workspace_id = Number(req.params.workspaceId);

  if (!workspace_id) {
    res.status(400).json({
      success: false,
      message: "Workspace ID is required.",
    });
    return;
  }

  if (!req.user) {
    res.status(401).json({
      success: false,
      message: "Not authenticated.",
    });
    return;
  }

  const invited_by = req.user.id;

  const { email, role } = req.body;

  if (!email || !role) {
    res.status(400).json({
      success: false,
      message: "Email and role are required.",
    });
    return;
  }

  const invitation = await sendInviteService(
    workspace_id,
    email,
    role,
    invited_by
  );

  successResponse(
    res,
    invitation,
    "Invitation sent successfully.",
    201
  );
}