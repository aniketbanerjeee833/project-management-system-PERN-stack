// src/api/member.api.ts
import api from '../lib/axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Member {
  member_id: number;
  role: 'admin' | 'manager' | 'employee';
  joined_at: string;
  user_id: number;
  name: string;
  email: string;
  avatar_url: string | null;
}

export interface PendingInvite {
  id: number;
  email: string;
  role: 'manager' | 'employee';
  status: 'pending';
  expires_at: string;
  created_at: string;
}

// ─── API object ───────────────────────────────────────────────────────────────

export const memberApi = {

  // GET /workspaces/:workspaceId/members
  getAll: async (workspaceId: number): Promise<Member[]> => {
    const { data } = await api.get(`/workspaces/${workspaceId}/members`);
    return data.data;
  },

  // GET /workspaces/:workspaceId/members/pending
  getPending: async (workspaceId: number): Promise<PendingInvite[]> => {
    const { data } = await api.get(`/workspaces/${workspaceId}/members/pending`);
    return data.data;
  },

  // DELETE /workspaces/:workspaceId/members/:userId
  remove: async (workspaceId: number, userId: number): Promise<void> => {
    await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
  },

  // PATCH /workspaces/:workspaceId/members/:userId/role
  changeRole: async (
    workspaceId: number,
    userId: number,
    role: 'manager' | 'employee'
  ): Promise<void> => {
    await api.patch(`/workspaces/${workspaceId}/members/${userId}/role`, { role });
  },

};