import { pool } from "../../db/pool";
export interface InvitationRow {
  id: number;
  workspace_id: number;
  email: string;
  role: "admin" | "manager" | "employee";
  invited_by: number;
  token: string;
  status: "pending" | "accepted" | "expired";
  expires_at: string;
  created_at: string;
}
 
export async function insertInvitation(
  workspace_id: number,
  email: string,
  role: "manager" | "employee",
  invited_by: number,
  token: string,
  expires_at: Date
): Promise<InvitationRow> {
  const { rows } = await pool.query<InvitationRow>(
    `INSERT INTO invitations (workspace_id, email, role, invited_by, token, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [workspace_id, email, role, invited_by, token, expires_at]
  );
  return rows[0];
}