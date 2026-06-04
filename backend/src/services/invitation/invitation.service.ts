import crypto from "crypto";
import { insertInvitation } from "../../repositories/invitation/invitation.repository";
import { sendEmail } from "../../utils/sendEmail";
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