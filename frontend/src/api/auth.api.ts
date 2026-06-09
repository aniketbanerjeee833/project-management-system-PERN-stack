// src/api/auth.api.ts
import type { AuthUser, AuthWorkspace, Role } from "../hooks/AuthContext";
import api from "../lib/axios";


export interface LoginPayload {
  email:    string;
  password: string;
}

export interface LoginResult {
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

export const authApi = {

  // Cookie is set by backend in Set-Cookie header automatically
  login: async (body: LoginPayload): Promise<LoginResult> => {
    const { data } = await api.post("/auth/login", body);
    return data.data;
  },

  me: async (): Promise<MeResult> => {
    const { data } = await api.get("/auth/me");
    return data.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

};