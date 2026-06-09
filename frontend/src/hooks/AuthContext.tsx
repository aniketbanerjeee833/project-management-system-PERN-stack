// import { createContext } from 'react'
// import type { Role, User } from '../types'

// export interface AuthContextType {
//   user: User
//   role: Role
//   setRole: (role: Role) => void
// }

// export const AuthContext = createContext<AuthContextType | null>(null)
// src/context/AuthContext.tsx
// import React, { createContext, useContext, useEffect, useState } from "react";
// import api from "../lib/axios";

// // ─── Types ────────────────────────────────────────────────────────────────────

// export type Role = "admin" | "manager" | "employee";

// export interface AuthUser {
//   id: number;
//   name: string;
//   email: string;
//   avatar_url: string | null;
// }

// export interface AuthWorkspace {
//   id: number;
//   name: string;
//   slug: string;
// }

// export interface AuthState {
//   user:      AuthUser | null;
//   workspace: AuthWorkspace | null;
//   role:      Role | null;
//   isLoading: boolean;           // true while GET /auth/me is in flight
//   isAuthenticated: boolean;
//   needsWorkspace: boolean;      // logged in but no workspace yet
// }

// interface AuthContextValue extends AuthState {
//   setAuth: (token: string, user: AuthUser, workspace?: AuthWorkspace, role?: Role) => void;
//   logout:  () => void;
//   refetch: () => Promise<void>; // call after workspace creation to re-resolve role
// }

// // ─── Context ──────────────────────────────────────────────────────────────────

// const AuthContext = createContext<AuthContextValue | null>(null);

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// };

// // ─── Provider ─────────────────────────────────────────────────────────────────

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [state, setState] = useState<AuthState>({
//     user:            null,
//     workspace:       null,
//     role:            null,
//     isLoading:       true,
//     isAuthenticated: false,
//     needsWorkspace:  false,
//   });

//   const fetchMe = async () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setState(s => ({ ...s, isLoading: false, isAuthenticated: false }));
//       return;
//     }

//     try {
//       const { data } = await api.get("/auth/me");
//       const me = data.data;

//       if (me.needsWorkspace) {
//         setState({
//           user:            null,
//           workspace:       null,
//           role:            null,
//           isLoading:       false,
//           isAuthenticated: true,
//           needsWorkspace:  true,
//         });
//         return;
//       }

//       setState({
//         user:            me.user,
//         workspace:       me.workspace,
//         role:            me.role,
//         isLoading:       false,
//         isAuthenticated: true,
//         needsWorkspace:  false,
//       });
//     } catch {
//       // Token invalid / expired — clear it
//       localStorage.removeItem("token");
//       setState({
//         user: null, workspace: null, role: null,
//         isLoading: false, isAuthenticated: false, needsWorkspace: false,
//       });
//     }
//   };

//   useEffect(() => { fetchMe(); }, []);

//   const setAuth = (
//     token: string,
//     user: AuthUser,
//     workspace?: AuthWorkspace,
//     role?: Role
//   ) => {
//     localStorage.setItem("token", token);
//     setState({
//       user,
//       workspace:       workspace ?? null,
//       role:            role ?? null,
//       isLoading:       false,
//       isAuthenticated: true,
//       needsWorkspace:  !workspace,
//     });
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setState({
//       user: null, workspace: null, role: null,
//       isLoading: false, isAuthenticated: false, needsWorkspace: false,
//     });
//   };

//   return (
//     <AuthContext.Provider value={{ ...state, setAuth, logout, refetch: fetchMe }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
// import React, {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// // import api from "../lib/axios";

// export type Role = "admin" | "manager" | "employee";

// export interface AuthUser {
//   id: number;
//   name: string;
//   email: string;
//   avatar_url: string | null;
// }

// export interface AuthWorkspace {
//   id: number;
//   name: string;
//   slug: string;
// }

// interface AuthContextType {
//   user: AuthUser | null;
//   workspace: AuthWorkspace | null;
//   role: Role | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   needsWorkspace: boolean;

//   setAuth: (
//     token: string,
//     user: AuthUser,
//     workspace?: AuthWorkspace,
//     role?: Role
//   ) => void;

//   logout: () => void;

//   refetch: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | null>(null);

// export const useAuth = () => {
//   const context = useContext(AuthContext);

//   if (!context) {
//     throw new Error("useAuth must be used within AuthProvider");
//   }

//   return context;
// };

// interface Props {
//   children: React.ReactNode;
// }

// export const AuthProvider: React.FC<Props> = ({ children }) => {
//   const [user, setUser] = useState<AuthUser | null>(null);
//   const [workspace, setWorkspace] = useState<AuthWorkspace | null>(null);
//   const [role, setRole] = useState<Role | null>(null);

//   const [isLoading, setIsLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [needsWorkspace, setNeedsWorkspace] = useState(false);

//   // const fetchMe = async (): Promise<void> => {
//   //   const token = localStorage.getItem("token");

//   //   if (!token) {
//   //     setIsLoading(false);
//   //     return;
//   //   }

//   //   try {
//   //     const { data } = await api.get("/auth/me");

//   //     const me = data.data;

//   //     if (me.needsWorkspace) {
//   //       setNeedsWorkspace(true);
//   //       setIsAuthenticated(true);
//   //       setIsLoading(false);
//   //       return;
//   //     }

//   //     setUser(me.user);
//   //     setWorkspace(me.workspace);
//   //     setRole(me.role);

//   //     setIsAuthenticated(true);
//   //     setNeedsWorkspace(false);
//   //   } catch (error) {
//   //     localStorage.removeItem("token");

//   //     setUser(null);
//   //     setWorkspace(null);
//   //     setRole(null);

//   //     setIsAuthenticated(false);
//   //     setNeedsWorkspace(false);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
// const fetchMe = async (): Promise<void> => {
//   setUser({
//     id: 1,
//     name: "Rahul Admin",
//     email: "rahul@test.com",
//     avatar_url: null,
//   });

//   setWorkspace({
//     id: 1,
//     name: "PMS Workspace",
//     slug: "pms-workspace",
//   });

//   setRole("admin");

//   setIsAuthenticated(true);
//   setNeedsWorkspace(false);
//   setIsLoading(false);
// };
//   useEffect(() => {
//     fetchMe();
//   }, []);

//   const setAuth = (
//     token: string,
//     user: AuthUser,
//     workspace?: AuthWorkspace,
//     role?: Role
//   ) => {
//     localStorage.setItem("token", token);

//     setUser(user);
//     setWorkspace(workspace ?? null);
//     setRole(role ?? null);

//     setIsAuthenticated(true);
//     setNeedsWorkspace(!workspace);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");

//     setUser(null);
//     setWorkspace(null);
//     setRole(null);

//     setIsAuthenticated(false);
//     setNeedsWorkspace(false);
//   };

//   const value: AuthContextType = {
//     user,
//     workspace,
//     role,
//     isLoading,
//     isAuthenticated,
//     needsWorkspace,
//     setAuth,
//     logout,
//     refetch: fetchMe,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Role = "admin" | "manager" | "employee";

export interface AuthUser {
  id:         number;
  name:       string;
  email:      string;
  avatar_url: string | null;
}

export interface AuthWorkspace {
  id:   number;
  name: string;
  slug: string;
}

interface AuthContextType {
  user:            AuthUser | null;
  workspace:       AuthWorkspace | null;
  role:            Role | null;
  isLoading:       boolean;
  isAuthenticated: boolean;
  needsWorkspace:  boolean;
  // called after login / register / accept-invite
  // no token param — cookie is set by backend, we just update local state
  setAuth: (user: AuthUser, workspace?: AuthWorkspace, role?: Role) => void;
  logout:  () => Promise<void>;
  refetch: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user,            setUser]            = useState<AuthUser | null>(null);
  const [workspace,       setWorkspace]       = useState<AuthWorkspace | null>(null);
  const [role,            setRole]            = useState<Role | null>(null);
  const [isLoading,       setIsLoading]       = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsWorkspace,  setNeedsWorkspace]  = useState(false);

  // ── Restore session on app load ────────────────────────────────────────────
  // Browser sends the httpOnly cookie automatically — we just call /auth/me
  const fetchMe = async (): Promise<void> => {
    try {
      const { data } = await api.get("/auth/me");
      const me = data.data;

      if (me.needsWorkspace) {
        setIsAuthenticated(true);
        setNeedsWorkspace(true);
        return;
      }

      setUser(me.user);
      setWorkspace(me.workspace);
      setRole(me.role);
      setIsAuthenticated(true);
      setNeedsWorkspace(false);
    } catch {
      // No valid cookie → not logged in, that's fine
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchMe(); }, []);

  // ── Called after login / register / accept-invite ─────────────────────────
  // Cookie already set by backend — just update React state
  const setAuth = (user: AuthUser, workspace?: AuthWorkspace, role?: Role) => {
    setUser(user);
    setWorkspace(workspace ?? null);
    setRole(role ?? null);
    setIsAuthenticated(true);
    setNeedsWorkspace(!workspace);
    setIsLoading(false);
  };

  // ── Logout ─────────────────────────────────────────────────────────────────
  const logout = async (): Promise<void> => {
    await api.post("/auth/logout");  // backend clears the cookie
    setUser(null);
    setWorkspace(null);
    setRole(null);
    setIsAuthenticated(false);
    setNeedsWorkspace(false);
  };

  return (
    <AuthContext.Provider value={{
      user, workspace, role,
      isLoading, isAuthenticated, needsWorkspace,
      setAuth, logout, refetch: fetchMe,
    }}>
      {children}
    </AuthContext.Provider>
  );
};