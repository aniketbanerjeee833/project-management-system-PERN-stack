import { Response } from "express";
 
const IS_PROD = process.env.NODE_ENV === "production";
 
export function setAuthCookie(res: Response, token: string): void {
  res.cookie("token", token, {
    httpOnly: true,          // JS cannot read it — protects against XSS
    secure:   IS_PROD,       // HTTPS only in production
    sameSite: IS_PROD ? "none" : "lax",  // "none" needed for cross-origin in prod
    maxAge:   7 * 24 * 60 * 60 * 1000,  // 7 days in ms
    path:     "/",
  });
}
 
export function clearAuthCookie(res: Response): void {
  res.clearCookie("token", { path: "/" });
}