// src/api/invitation.api.ts
import api from '../lib/axios';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface InvitationRow {
  id: number;
  workspace_id: number;
  email: string;
  role: 'manager' | 'employee';
  status: 'pending' | 'accepted' | 'expired';
  expires_at: string;
  created_at: string;
}

export interface ValidatedInvite {
  email: string;
  role: 'manager' | 'employee';
  workspace_id: number;
  workspace_name: string;
}

export interface SendInviteData {
  email: string;
  role: 'manager' | 'employee';
}

export interface AcceptInviteData {
  email: string;
  password: string;
  name?: string;      // only for new users
  isNewUser: boolean;
}

export interface AcceptInviteResult {
  token: string;
  user: { id: number; name: string; email: string; avatar_url: string | null };
  workspace_id: number;
  role: 'manager' | 'employee';
  needsWorkspace: false;
}

// ─── API object ───────────────────────────────────────────────────────────────

export const invitationApi = {

  // GET /invitations/:token — public, called on the /invite page
  validate: async (token: string): Promise<ValidatedInvite> => {
    const { data } = await api.get(`/invitations/${token}`);
    return data.data;
  },

  // POST /invitations/:token/accept — public, called after register/login form
  accept: async (token: string, body: AcceptInviteData): Promise<AcceptInviteResult> => {
    const { data } = await api.post(`/invitations/${token}/accept`, body);
    return data.data;
  },

  // POST /workspaces/:workspaceId/invitations — admin only
  send: async (workspaceId: number, body: SendInviteData): Promise<InvitationRow> => {
    const { data } = await api.post(`/workspaces/${workspaceId}/invitations`, body);
    return data.data;
  },

};