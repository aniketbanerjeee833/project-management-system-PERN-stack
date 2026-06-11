// src/controllers/member/member.controller.ts
import { Response } from "express";
import { AuthRequest } from "../../types/auth.types";
import { successResponse } from "../../utils/response";
import {
  getMembersService,
  getPendingInvitesService,
  removeMemberService,
  changeMemberRoleService,
  getWorkspaceManagersService,
  getWorkspaceEmployeesService,
} from "../../services/members/members.service";

// ── GET /workspaces/:workspaceId/members ──────────────────────────────────────
export async function getMembersController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const workspace_id = Number(req.params.workspaceId);

  const members = await getMembersService(workspace_id);
  // console.log(members);
  successResponse(res, members, "Members fetched successfully.");
}

export async function getWorkspaceManagersController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const workspace_id = Number(req.params.workspaceId);
  // console.log(workspace_id);

 const workspaceManagers=await getWorkspaceManagersService(workspace_id);
// console.log(workspaceManagers);
  successResponse(res, workspaceManagers, "Workspace managers fetched successfully.");
}

export async function getWorkspaceEmployeesController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const workspace_id = Number(req.params.workspaceId);
  // console.log(workspace_id);

 const workspaceEmployees =await getWorkspaceEmployeesService(workspace_id);
// console.log();
  successResponse(res, workspaceEmployees, "Workspace managers fetched successfully.");
}

// ── GET /workspaces/:workspaceId/members/pending ──────────────────────────────
export async function getPendingInvitesController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  const workspace_id = Number(req.params.workspaceId);

  const invites = await getPendingInvitesService(workspace_id);

  successResponse(res, invites, "Pending invites fetched successfully.");
}

// ── DELETE /workspaces/:workspaceId/members/:userId ───────────────────────────
export async function removeMemberController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated." });
    return;
  }

  const workspace_id = Number(req.params.workspaceId);
  const user_id      = Number(req.params.userId);

  await removeMemberService(workspace_id, user_id, req.user.id);

  successResponse(res, null, "Member removed successfully.");
}

// ── PATCH /workspaces/:workspaceId/members/:userId/role ───────────────────────
export async function changeMemberRoleController(
  req: AuthRequest,
  res: Response
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ success: false, message: "Not authenticated." });
    return;
  }

  const workspace_id = Number(req.params.workspaceId);
  const user_id      = Number(req.params.userId);
  const { role }     = req.body;

  await changeMemberRoleService(workspace_id, user_id, role, req.user.id);

  successResponse(res, null, "Role updated successfully.");
}