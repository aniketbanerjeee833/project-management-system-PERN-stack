// src/hooks/useAuthQueries.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { useNavigate } from "react-router-dom";

import { authApi } from "../../api/auth.api";
import type { Role } from "../../types";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
// import { useAuth } from "../AuthContext";

// ─── Query keys ───────────────────────────────────────────────────────────────

export const authKeys = {
  me: ["auth", "me"] as const,
};

// ─── Role → home route ────────────────────────────────────────────────────────

const ROLE_HOME: Record<Role, string> = {
  admin:    "/admin",
  manager:  "/manager",
  employee: "/employee",
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuthQueries = () => {
  const qc       = useQueryClient();
  const navigate = useNavigate();
  const { setAuth, logout: ctxLogout } = useAuth();

  // ── GET /auth/me ────────────────────────────────────────────────────────────
  // Used to restore session on app load.
  // AuthContext already calls this via fetchMe() on mount,
  // but expose it here too so components can refetch manually.
  const me = useQuery({
    queryKey: authKeys.me,
    queryFn:  authApi.me,
    retry:    false,
    staleTime: 1000 * 60 * 5,   // treat session as fresh for 5 min
    enabled:  false,             // don't auto-run — AuthContext handles app-load
  });

  // ── POST /auth/login ────────────────────────────────────────────────────────
  const login = useMutation({
     mutationFn: authApi.login,
    // onSuccess: (result) => {
    //   // Cookie already set by backend — update React state
    //   setAuth(result.user, result.workspace, result.role);

    //   if (result.needsWorkspace) {
    //     navigate("/create-workspace", { replace: true });
    //     return;
    //   }

    //   const home = result.role ? ROLE_HOME[result.role] : "/";
    //   navigate(home, { replace: true });
    // },
  });

  // ── POST /auth/register ─────────────────────────────────────────────────────
  const register = useMutation({
    mutationFn: authApi.register,
    // onSuccess: (result) => {
    //   setAuth(result.user);
    //   // Fresh admin — always needs to create workspace
    //   navigate("/create-workspace", { replace: true });
    // },
  });

  // ── POST /auth/create-workspace ─────────────────────────────────────────────
  const createWorkspace = useMutation({
    mutationFn: authApi.createWorkspace,
    onSuccess: async () => {
      // Refetch /auth/me to get workspace + role into context
      const fresh = await authApi.me();
      if (!fresh.needsWorkspace && fresh.user && fresh.workspace && fresh.role) {
        setAuth(fresh.user, fresh.workspace, fresh.role);
        navigate(ROLE_HOME[fresh.role], { replace: true });
      }
      qc.invalidateQueries({ queryKey: authKeys.me });
    },
  });

  // ── POST /auth/logout ────────────────────────────────────────────────────────
  const logout = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      ctxLogout();
      qc.clear();                          // clear all cached queries
      navigate("/login", { replace: true });
    },
  });

  return {
    me,               // .refetch() to manually restore session
    login,            // .mutateAsync({ email, password })
    register,         // .mutateAsync({ name, email, password })
    createWorkspace,  // .mutateAsync({ name, slug })
    logout,           // .mutate()
  };
};