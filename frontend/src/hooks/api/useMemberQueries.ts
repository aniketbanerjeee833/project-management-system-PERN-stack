// src/hooks/useMemberQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '../../api/member.api';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const memberKeys = {
  all:     (wsId: number) => ['workspaces', wsId, 'members']          as const,
  pending: (wsId: number) => ['workspaces', wsId, 'members', 'pending'] as const,
  managers:(wsId: number) => ['workspaces', wsId, 'members', 'managers'] as const
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useMemberQueries = (workspaceId: number) => {
  const qc = useQueryClient();

  // ── GET all members ───────────────────────────────────────────────────────
  const members = useQuery({
    queryKey: memberKeys.all(workspaceId),
    queryFn:  () => memberApi.getAll(workspaceId),
    enabled:  Boolean(workspaceId),
    // staleTime: 1000 * 60,
  });

  const managers=useQuery({
    queryKey: memberKeys.managers(workspaceId),
    queryFn:  () => memberApi.getAllManagers(workspaceId),
    enabled:  Boolean(workspaceId),
    // staleTime: 1000 * 60,
  })

  // ── GET pending invites ───────────────────────────────────────────────────
  const pendingInvites = useQuery({
    queryKey: memberKeys.pending(workspaceId),
    queryFn:  () => memberApi.getPending(workspaceId),
    enabled:  Boolean(workspaceId),
    staleTime: 1000 * 30,
  });

  // ── REMOVE member ─────────────────────────────────────────────────────────
  const removeMember = useMutation({
    mutationFn: (userId: number) => memberApi.remove(workspaceId, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: memberKeys.all(workspaceId) });
    },
  });

  // ── CHANGE role ───────────────────────────────────────────────────────────
  const changeRole = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: 'manager' | 'employee' }) =>
      memberApi.changeRole(workspaceId, userId, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: memberKeys.all(workspaceId) });
    },
  });

  return {
    members,        // .data → Member[], .isLoading, .isError
    managers,       // .data → Member[], .isLoading, .isError
    pendingInvites, // .data → PendingInvite[]
    removeMember,   // .mutateAsync(userId)
    changeRole,     // .mutateAsync({ userId, role })
  };
};