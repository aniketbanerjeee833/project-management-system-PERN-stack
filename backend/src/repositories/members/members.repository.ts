// src/repositories/member/member.repository.ts
import { pool } from "../../db/pool";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MemberRow {
  // from workspace_members
  member_id: number;        // workspace_members.id
  role: "admin" | "manager" | "employee";
  joined_at: string;
  // from users
  user_id: number;
  name: string;
  email: string;
  avatar_url: string | null;
}

export interface PendingInviteRow {
  id: number;
  email: string;
  role: "manager" | "employee";
  status: "pending";
  expires_at: string;
  created_at: string;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

// All accepted members of a workspace
export async function findMembersByWorkspace(
  workspace_id: number
): Promise<MemberRow[]> {
  const { rows } = await pool.query<MemberRow>(
    `SELECT
     
       wm.role,
       wm.joined_at,
       u.id           AS user_id,
       u.name,
       u.email,
       u.avatar_url
     FROM workspace_members wm
     JOIN users u ON u.id = wm.user_id
     WHERE wm.workspace_id = $1
     ORDER BY wm.joined_at ASC`,
    [workspace_id]
  );
  return rows;
}
export async function findManagersByWorkspace(workspace_id: number) {
  const { rows } = await pool.query(
    `SELECT
      
       wm.role,
       u.id AS user_id,
       u.name,
       u.email,
       u.avatar_url
     FROM workspace_members wm
     JOIN users u ON u.id = wm.user_id
     WHERE wm.workspace_id = $1
       AND wm.role = 'manager'
     ORDER BY wm.joined_at ASC`,
    [workspace_id]
  );

  return rows;
}

export async function findEmployeesByWorkspace(workspace_id: number) {
  const { rows } = await pool.query(
    `SELECT
      
       wm.role,
       u.id AS user_id,
       u.name,
       u.email,
       u.avatar_url
     FROM workspace_members wm
     JOIN users u ON u.id = wm.user_id
     WHERE wm.workspace_id = $1
       AND wm.role = 'employee'
     ORDER BY wm.joined_at ASC`,
    [workspace_id]
  );

  return rows;
}


// All pending (not yet accepted) invitations for a workspace
export async function findPendingInvitesByWorkspace(
  workspace_id: number
): Promise<PendingInviteRow[]> {
  const { rows } = await pool.query<PendingInviteRow>(
    `SELECT id, email, role, status, expires_at, created_at
     FROM invitations
     WHERE workspace_id = $1
       AND status = 'pending'
       AND expires_at > now()
     ORDER BY created_at DESC`,
    [workspace_id]
  );
  return rows;
}

// Remove a member from a workspace
export async function deleteMember(
  workspace_id: number,
  user_id: number
): Promise<void> {
  await pool.query(
    `DELETE FROM workspace_members
     WHERE workspace_id = $1 AND user_id = $2`,
    [workspace_id, user_id]
  );
}

// Change a member's role
export async function updateMemberRole(
  workspace_id: number,
  user_id: number,
  role: "manager" | "employee"
): Promise<void> {
  await pool.query(
    `UPDATE workspace_members
     SET role = $1
     WHERE workspace_id = $2 AND user_id = $3`,
    [role, workspace_id, user_id]
  );
}