import { Request, Response, NextFunction } from "express";

// ──────────────────────────────────────────────────────────────
//  TEMPORARY STUB — replace with cookie/session logic later
//  For now this just blocks unauthenticated requests cleanly
// ──────────────────────────────────────────────────────────────

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {

  // TODO: replace this entire block with session/cookie check
  // e.g.  const userId = req.session.userId
  //       if (!userId) → 401
  //       const user = await findUserById(userId)
  //       req.user = user

  // Stub: attach a hardcoded user so you can test other endpoints now
  req.user = {
    id: 1,
    email: "dev@test.com",
    name: "Dev User",
  };

  next();
}