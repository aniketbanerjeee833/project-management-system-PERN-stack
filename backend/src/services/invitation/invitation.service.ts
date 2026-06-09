import crypto from "crypto";
import { findInvitationByToken, findUserByEmail, insertInvitation, insertUser, insertWorkspaceMember, 
  markInvitationAsAccepted } from "../../repositories/invitation/invitation.repository";
import { sendEmail } from "../../utils/sendEmail";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
function safeUser(user: { id: number; name: string; email: string; avatar_url: string | null }) {
  return { id: user.id, name: user.name, email: user.email, avatar_url: user.avatar_url };
}
function signJwt(userId: number): string {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN ?? "7d" } as jwt.SignOptions
  );
}
export async function sendInviteService(
  workspace_id: number,
  email: string,
  role: "manager" | "employee",
  invited_by: number
) {
  const token = crypto.randomBytes(32).toString("hex");
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
 
  const invitation = await insertInvitation(
    workspace_id,
    email,
    role,
    invited_by,
    token,
    expires_at
  );
 
  // TODO: plug in your email provider here (Resend / Nodemailer / SendGrid)
   await sendEmail(email, token);
  console.log(`Invite link: ${process.env.FRONTEND_URL}/invite?token=${token}`);
 
  return invitation;
}

export async function validateInviteTokenService(token: string) {
  const invitation = await findInvitationByToken(token);
  console.log("Invitation found for token:", invitation);
 
  if (!invitation)                          throw new Error("Invalid invite link.");
  if (invitation.status !== "pending")      throw new Error("This invite has already been used.");
  if (new Date(invitation.expires_at) < new Date()) throw new Error("This invite link has expired.");
 
  return {
    email:          invitation.email,
    role:           invitation.role,
    workspace_id:   invitation.workspace_id,
    workspace_name: invitation.workspace_name,
  };
}
export async function acceptInviteService(
  token: string,
  name: string,
  email: string,
  password: string,
  isNewUser: boolean
) {
  const invitation = await findInvitationByToken(token);
 
  if (!invitation)                          throw new Error("Invalid invite link.");
  if (invitation.status !== "pending")      throw new Error("This invite has already been used.");
  if (new Date(invitation.expires_at) < new Date()) throw new Error("Invite link has expired.");
  if (invitation.email !== email)           throw new Error("This invite was sent to a different email address.");
 
  let user;
 
  if (isNewUser) {
    // ── registering for the first time via invite ──────────────────────────
    const existing = await findUserByEmail(email);
    if (existing) throw new Error("Email already registered. Please log in instead.");
 
    const password_hash = await bcrypt.hash(password, 10);
    user = await insertUser(name, email, password_hash);
  } else {
    // ── existing user accepting invite ────────────────────────────────────
    user = await findUserByEmail(email);
    if (!user) throw new Error("No account found. Please register.");
 
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new Error("Invalid email or password.");
  }
 
  await insertWorkspaceMember(invitation.workspace_id, user.id, invitation.role);
  await markInvitationAsAccepted(token);
 
  const jwtToken = signJwt(user.id);
 
  return {
    token:        jwtToken,
    user:         safeUser(user),
    workspace_id: invitation.workspace_id,
    role:         invitation.role,
    needsWorkspace: false,
  };
}