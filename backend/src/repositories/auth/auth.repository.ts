

// import { pool } from "../../db/pool";
// import { UserRow } from "../invitation/invitation.repository";

 
// export async function findUserByEmail(email: string): Promise<UserRow | null> {
//   const { rows } = await pool.query<UserRow>(
//     `SELECT * FROM users WHERE email = $1 LIMIT 1`,
//     [email]
//   );
//   return rows[0] ?? null;
// }
 
// export async function findUserById(id: number): Promise<UserRow | null> {
//   const { rows } = await pool.query<UserRow>(
//     `SELECT * FROM users WHERE id = $1 LIMIT 1`,
//     [id]
//   );
//   return rows[0] ?? null;
// }
 
// export async function insertUser(
//   name: string,
//   email: string,
//   password_hash: string
// ): Promise<UserRow> {
//   const { rows } = await pool.query<UserRow>(
//     `INSERT INTO users (name, email, password_hash)
//      VALUES ($1, $2, $3)
//      RETURNING *`,
//     [name, email, password_hash]
//   );
//   return rows[0];
// }
 
// src/repositories/auth/auth.repository.ts  — add these two queries

// import { pool } from "../../db/pool";

// export interface MeRow {
//   // user
//   user_id:    number;
//   name:       string;
//   email:      string;
//   avatar_url: string | null;
//   // workspace membership
//   workspace_id:   number;
//   workspace_name: string;
//   workspace_slug: string;
//   role: "admin" | "manager" | "employee";
// }

// // Returns the first workspace membership for a user.
// // If a user belongs to multiple workspaces you'd let them pick —
// // for a first build, just return the first one.
// export async function findMeByUserId(user_id: number): Promise<MeRow | null> {
//   const { rows } = await pool.query<MeRow>(
//     `SELECT
//        u.id           AS user_id,
//        u.name,
//        u.email,
//        u.avatar_url,
//        wm.workspace_id,
//        w.name         AS workspace_name,
//        w.slug         AS workspace_slug,
//        wm.role
//      FROM users u
//      JOIN workspace_members wm ON wm.user_id = u.id
//      JOIN workspaces w         ON w.id = wm.workspace_id
//      WHERE u.id = $1
//      ORDER BY wm.joined_at ASC
//      LIMIT 1`,
//     [user_id]
//   );
//   return rows[0] ?? null;
// }

// src/repositories/auth/auth.repository.ts
import { pool } from "../../db/pool";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  avatar_url: string | null;
  is_email_verified: boolean;
  created_at: string;
}
export interface MeRow {
  // user
  user_id:    number;
  name:       string;
  email:      string;
  avatar_url: string | null;
  // workspace membership
  workspace_id:   number;
  workspace_name: string;
  workspace_slug: string;
  role: "admin" | "manager" | "employee";
}
export interface WorkspaceRow {
  id: number;
  name: string;
  slug: string;
  owner_id: number;
  created_at: string;
}

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

// ─── User ─────────────────────────────────────────────────────────────────────

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

// export async function verifyAdmin(id: number): Promise<UserRow | null> {
//   const { rows } = await pool.query<UserRow>(
//     `SELECT
//        u.id           AS user_id,
       
      
//        wm.workspace_id,
//        w.name         AS workspace_name,
//        w.slug         AS workspace_slug,
//        wm.role
//      FROM users u
//      JOIN workspace_members wm ON wm.user_id = u.id
//      JOIN workspaces w         ON w.id = wm.workspace_id
//      WHERE u.id = $1
//      AND wm.role = 'admin'
//      ORDER BY wm.joined_at ASC
//      LIMIT 1`,
//     [id]
//   );
//   return rows[0] ?? null;
// }
export async function findMeByUserId(user_id: number): Promise<MeRow | null> {
  const { rows } = await pool.query<MeRow>(
    `SELECT
       u.id           AS user_id,
       u.name,
       u.email,
       u.avatar_url,
       wm.workspace_id,
       w.name         AS workspace_name,
       w.slug         AS workspace_slug,
       wm.role
     FROM users u
     JOIN workspace_members wm ON wm.user_id = u.id
     JOIN workspaces w         ON w.id = wm.workspace_id
     WHERE u.id = $1
     ORDER BY wm.joined_at ASC
     LIMIT 1`,
    [user_id]
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

// ─── Workspace ────────────────────────────────────────────────────────────────

export async function slugExists(slug: string): Promise<boolean> {
  const { rows } = await pool.query(
    `SELECT 1 FROM workspaces WHERE slug = $1 LIMIT 1`,
    [slug]
  );
  return rows.length > 0;
}

export async function insertWorkspace(
  name: string,
  slug: string,
  owner_id: number
): Promise<WorkspaceRow> {
  const {rows} = await pool.query<WorkspaceRow>(
    `INSERT INTO workspaces (name, slug, owner_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, slug, owner_id]
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



// export async function markInvitationAccepted(token: string): Promise<void> {
//   await pool.query(
//     `UPDATE invitations SET status = 'accepted' WHERE token = $1`,
//     [token]
//   );
// }

