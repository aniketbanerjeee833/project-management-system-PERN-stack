// src/api/auth.api.ts
import api from "../lib/axios";
import type { AuthUser, AuthWorkspace, Role } from "../hooks/AuthContext";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email:    string;
  password: string;
}

export interface RegisterPayload {
  name:     string;
  email:    string;
  password: string;
}

export interface CreateWorkspacePayload {
  name: string;
  slug: string;
}

// What the backend returns in the body (cookie is set separately by backend)
export interface AuthResult {
  user:           AuthUser;
  needsWorkspace: boolean;
  workspace?:     AuthWorkspace;
  role?:          Role;
}

export interface MeResult {
  needsWorkspace: boolean;
  user?:          AuthUser;
  workspace?:     AuthWorkspace;
  role?:          Role;
}

// ─── API object ───────────────────────────────────────────────────────────────

export const authApi = {

  // POST /auth/login
  // Backend sets httpOnly cookie, returns { user, role, workspace, needsWorkspace }
  login: async (body: LoginPayload): Promise<AuthResult> => {
    const { data } = await api.post("/auth/login", body);
    return data.data;
  },

  // POST /auth/register
  // Backend sets cookie, returns { user, needsWorkspace: true }
  register: async (body: RegisterPayload): Promise<AuthResult> => {
    const { data } = await api.post("/auth/register", body);
    return data.data;
  },

  // GET /auth/me
  // Browser sends cookie automatically (withCredentials: true on axios)
  // Returns { user, workspace, role } or { needsWorkspace: true }
  me: async (): Promise<MeResult> => {
    const { data } = await api.get("/auth/me");
    return data.data;
  },

  // POST /auth/logout
  // Backend clears the httpOnly cookie
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  // POST /auth/create-workspace
  // Called after fresh admin register (needsWorkspace: true)
  createWorkspace: async (body: CreateWorkspacePayload): Promise<AuthWorkspace> => {
    const { data } = await api.post("/auth/create-workspace", body);
    return data.data;
  },

};