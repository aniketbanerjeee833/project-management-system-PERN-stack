// import {  Response, NextFunction } from "express";
// import { AuthRequest } from "../types/auth.types";

// // ──────────────────────────────────────────────────────────────
// //  TEMPORARY STUB — replace with cookie/session logic later
// //  For now this just blocks unauthenticated requests cleanly
// // ──────────────────────────────────────────────────────────────

// export async function authenticate(
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> {

//   // TODO: replace this entire block with session/cookie check
//   // e.g.  const userId = req.session.userId
//   //       if (!userId) → 401
//   //       const user = await findUserById(userId)
//   //       req.user = user

//   // Stub: attach a hardcoded user so you can test other endpoints now
//   req.user = {
//     id: 1,
//     email: "rahul@test.com",
//     name: "Rahul Admin",
//   };

//   next();
// }

// src/middlewares/authenticate.ts
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/auth.types";

// ─────────────────────────────────────────────────────────────────────────────
//  STUB  (active right now)
//  Hardcoded user so all endpoints work while you build features.
//  Swap this out for the REAL version below when login is wired up.
// ─────────────────────────────────────────────────────────────────────────────

// export async function authenticate(
//   req: AuthRequest,
//   _res: Response,
//   next: NextFunction
// ): Promise<void> {
//   req.user = {
//     id:    1,
//     email: "rahul@test.com",
//     name:  "Rahul Admin",
//   };
//   next();
// }

// ─────────────────────────────────────────────────────────────────────────────
//  REAL  (swap in when cookies / login is ready)
//  1. Delete the STUB function above
//  2. Uncomment everything below
//  3. Make sure cookie-parser is in app.ts  →  app.use(cookieParser())
//     and CORS has credentials: true
// ─────────────────────────────────────────────────────────────────────────────

import { findUserById } from "../repositories/auth/auth.repository";

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.cookies?.token as string | undefined;

  if (!token) {
    res.status(401).json({ success: false, message: "Not authenticated." });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

    const user = await findUserById(payload.id);
    if (!user) {
      res.status(401).json({ success: false, message: "User not found." });
      return;
    }

    req.user = { id: user.id, email: user.email, name: user.name };
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: "Session expired. Please log in again." });
      return;
    }
    res.status(401).json({ success: false, message: "Invalid session." });
  }
}