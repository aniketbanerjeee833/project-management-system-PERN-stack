// src/types/auth.types.ts
// import { Request } from "express";

// export interface AuthRequest extends Request {
//   user?: {
//     id: number;
//     email: string;
//     name: string;
//   };
// }

// src/types/auth.types.ts

import { Request } from "express";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role?: "admin" | "manager" | "employee";  // ← attached by requireRole
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}