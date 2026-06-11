// src/hooks/useMemberQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '../../api/member.api';
import type { Role } from '../AuthContext';

// ─── Query keys ───────────────────────────────────────────────────────────────

export const memberKeys = {
  all:     (wsId: number) => ['workspaces', wsId, 'members']          as const,
  pending: (wsId: number) => ['workspaces', wsId, 'members', 'pending'] as const,
  managers:(wsId: number) => ['workspaces', wsId, 'members', 'managers'] as const,
  employees:(wsId: number) => ['workspaces', wsId, 'members', 'employees'] as const,
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
interface UseMemeberQueriesOptions {
  workspaceId: number;
  role:        Role;          // ← pass role so hook knows which query to run
 
}
export const useMemberQueries = ({
  workspaceId,
  role,
  
}: UseMemeberQueriesOptions) => {
  const qc = useQueryClient();
  const isAdmin   = role === "admin";
  // const isManager = role === "manager";


  // ── GET all members ───────────────────────────────────────────────────────
  const members = useQuery({
    queryKey: memberKeys.all(workspaceId),
    queryFn:  () => memberApi.getAll(workspaceId),
    enabled:  Boolean(workspaceId) && isAdmin,
    // staleTime: 1000 * 60,
  });

  const managers=useQuery({
    queryKey: memberKeys.managers(workspaceId),
    queryFn:  () => memberApi.getAllManagers(workspaceId),
    enabled:  Boolean(workspaceId) && isAdmin,
    // staleTime: 1000 * 60,
  })

  const employees=useQuery({
    queryKey: memberKeys.employees(workspaceId),
    queryFn:  () => memberApi.getAllEmployees(workspaceId),
    enabled:  Boolean(workspaceId),
    // staleTime: 1000 * 60,
  })

  // ── GET pending invites ───────────────────────────────────────────────────
  const pendingInvites = useQuery({
    queryKey: memberKeys.pending(workspaceId),
    queryFn:  () => memberApi.getPending(workspaceId),
    enabled:  Boolean(workspaceId) && isAdmin,
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
    managers,       // .data → Member[], .isLoading, .isError,
    employees,      // .data → Member[], .isLoading, .isError,
    pendingInvites, // .data → PendingInvite[]
    removeMember,   // .mutateAsync(userId)
    changeRole,     // .mutateAsync({ userId, role })
  };
};