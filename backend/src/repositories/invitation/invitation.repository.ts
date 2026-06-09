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
 export interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  is_email_verified: boolean;
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
export async function findInvitationByToken(
  token: string
): Promise<(InvitationRow & { workspace_name: string }) | null> {
  const { rows } = await pool.query<InvitationRow & { workspace_name: string }>(
    `SELECT i.*, w.name AS workspace_name
     FROM invitations i
     JOIN workspaces w ON w.id = i.workspace_id
     WHERE i.token = $1
     LIMIT 1`,
    [token]
  );
  return rows[0] ?? null;
}
export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const { rows } = await pool.query<UserRow>(
    `SELECT * FROM users WHERE email = $1 LIMIT 1`,
    [email]
  );
  return rows[0] ?? null;
}
 
export async function findUserById(id: number): Promise<UserRow | null> {
  const { rows } = await pool.query<UserRow>(
    `SELECT * FROM users WHERE id = $1 LIMIT 1`,
    [id]
  );
  return rows[0] ?? null;
}
 
export async function insertUser(
  name: string,
  email: string,
  password_hash: string
): Promise<UserRow> {
  const { rows } = await pool.query<UserRow>(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, email, password_hash]
  );
  return rows[0];
}

export async function insertWorkspaceMember(
  workspace_id: number,
  user_id: number,
  role: "admin" | "manager" | "employee"
): Promise<void> {
  await pool.query(
    `INSERT INTO workspace_members (workspace_id, user_id, role)
     VALUES ($1, $2, $3)`,
    [workspace_id, user_id, role]
  );
}

export async function markInvitationAsAccepted(token: string): Promise<void> {
  await pool.query(
    `UPDATE invitations SET status = 'accepted' WHERE token = $1`,
    [token]
  );
}