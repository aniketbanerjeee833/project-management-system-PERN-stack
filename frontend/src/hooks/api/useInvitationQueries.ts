// src/hooks/useInvitationQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  invitationApi,
  type SendInviteData,
  type AcceptInviteData,
} from '../../api/invitation.api';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const invitationKeys = {
  all:      (wsId: number)   => ['workspaces', wsId, 'invitations']      as const,
  validate: (token: string)  => ['invitations', 'validate', token]       as const,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useInvitationQueries = (workspaceId?: number, token?: string) => {
  const qc = useQueryClient();

  // ── GET /invitations/:token ───────────────────────────────────────────────
  const validateInvite = useQuery({
    queryKey: invitationKeys.validate(token ?? ''),
    queryFn:  () => invitationApi.validate(token!),
    enabled:  Boolean(token),
    retry:    false,
    staleTime: Infinity,
  });

  // ── POST /invitations/:token/accept ───────────────────────────────────────
  const acceptInvite = useMutation({
    mutationFn: (body: AcceptInviteData) =>
      invitationApi.accept(token!, body),
    onSuccess: (result) => {
      localStorage.setItem('token', result.token);
    },
  });

  // ── POST /workspaces/:workspaceId/invitations ─────────────────────────────
  const sendInvite = useMutation({
    mutationFn: (body: SendInviteData) =>
      invitationApi.send(workspaceId!, body),
    onSuccess: () => {
      if (workspaceId) {
        qc.invalidateQueries({ queryKey: invitationKeys.all(workspaceId) });
      }
    },
  });

  return {
    validateInvite,   // .data → ValidatedInvite, .isLoading, .isError
    sendInvite,       // .mutateAsync({ email, role })
    acceptInvite,     // .mutateAsync({ email, password, name?, isNewUser })
  };
};