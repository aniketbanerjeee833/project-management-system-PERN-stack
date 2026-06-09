// import { findUserByEmail, insertUser } from "../../repositories/auth/auth.repository";
// import bcrypt from "bcrypt";
// export async function registerService(
//   name: string,
//   email: string,
//   password: string
// ) {
//   const existing = await findUserByEmail(email);
//   if (existing) throw new Error("Email is already registered.");
 
//   const password_hash = await bcrypt.hash(password, 10);
//   const user = await insertUser(name, email, password_hash);
//   const token = signToken(user.id);
 
//   return {
//     token,
//     user: safeUser(user),
//     needsWorkspace: true,   // frontend sends to /create-workspace
//   };
// }
// src/services/auth/auth.service.ts  — add getMeService

// import { findMeByUserId } from "../../repositories/auth/auth.repository";

// export async function getMeService(user_id: number) {
//   const me = await findMeByUserId(user_id);

//   // User registered but hasn't created/joined a workspace yet
//   if (!me) {
//     return { needsWorkspace: true };
//   }

//   return {
//     needsWorkspace: false,
//     user: {
//       id:         me.user_id,
//       name:       me.name,
//       email:      me.email,
//       avatar_url: me.avatar_url,
//     },
//     workspace: {
//       id:   me.workspace_id,
//       name: me.workspace_name,
//       slug: me.workspace_slug,
//     },
//     role: me.role,   // "admin" | "manager" | "employee"
//   };
// }

// src/services/auth/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  findUserByEmail,

  insertUser,
  insertWorkspace,
  insertWorkspaceMember,
 
  slugExists,
  findMeByUserId,

  
} from "../../repositories/auth/auth.repository";

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as string;

// ─── Helper ───────────────────────────────────────────────────────────────────

function signToken(userId: number): string {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

function safeUser(user: { id: number; name: string; email: string; avatar_url: string | null }) {
  return { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url };
}

// ─── POST /auth/register  (no invite token) ───────────────────────────────────

export async function registerService(
  name: string,
  email: string,
  password: string
) {
  const existing = await findUserByEmail(email);
  if (existing) throw new Error("Email is already registered.");

  const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await insertUser(name, email, password_hash);
  const token = signToken(user.id);

  return {
    token,
    user: safeUser(user),
    needsWorkspace: true,   // frontend sends to /create-workspace
  };
}

// ─── POST /auth/create-workspace  (fresh admin only) ─────────────────────────

export async function createWorkspaceService(
  name: string,
  slug: string,
  owner_id: number
) {
  const taken = await slugExists(slug);
  if (taken) throw new Error("This workspace URL is already taken. Try another.");

  const workspace = await insertWorkspace(name, slug, owner_id);
  await insertWorkspaceMember(workspace.id, owner_id, "admin");

  return workspace;
}

// ─── POST /auth/login ─────────────────────────────────────────────────────────

export async function loginService(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Invalid email or password.");

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Invalid email or password.");

  const token = signToken(user.id);
  return { token, user: safeUser(user) };
}

export async function getMeService(user_id: number) {
  const me = await findMeByUserId(user_id);

  // User registered but hasn't created/joined a workspace yet
  if (!me) {
    return { needsWorkspace: true };
  }

  return {
    needsWorkspace: false,
    user: {
      id:         me.user_id,
      name:       me.name,
      email:      me.email,
      avatar_url: me.avatar_url,
    },
    workspace: {
      id:   me.workspace_id,
      name: me.workspace_name,
      slug: me.workspace_slug,
    },
    role: me.role,   // "admin" | "manager" | "employee"
  };
}


