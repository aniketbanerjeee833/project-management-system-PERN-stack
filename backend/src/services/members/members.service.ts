// src/services/member/member.service.ts
import {
  findMembersByWorkspace,
  findPendingInvitesByWorkspace,
  deleteMember,
  updateMemberRole,
  findManagersByWorkspace,
} from "../../repositories/members/members.repository";

// GET all members of a workspace
export async function getMembersService(workspace_id: number) {
  return findMembersByWorkspace(workspace_id);
}

// GET all pending invites for a workspace (not yet members)
export async function getPendingInvitesService(workspace_id: number) {
  return findPendingInvitesByWorkspace(workspace_id);
}

// DELETE a member — admin cannot remove themselves
export async function removeMemberService(
  workspace_id: number,
  user_id: number,
  actor_id: number
) {
  if (user_id === actor_id) {
    throw new Error("You cannot remove yourself from the workspace.");
  }
  await deleteMember(workspace_id, user_id);
}

export async function getWorkspaceManagersService(workspace_id: number) {
  return findManagersByWorkspace(workspace_id);
  // const { rows } = await pool.query(
  //   `SELECT user_id
  //    FROM workspace_members
  //    WHERE workspace_id = $1 AND role = 'manager'`,
  //   [workspace_id]
  // );
  // return rows.map((row) => row.user_id);
}

// PATCH change role — cannot change an admin's role
export async function changeMemberRoleService(
  workspace_id: number,
  user_id: number,
  role: "manager" | "employee",
  actor_id: number
) {
  if (user_id === actor_id) {
    throw new Error("You cannot change your own role.");
  }
  await updateMemberRole(workspace_id, user_id, role);
}