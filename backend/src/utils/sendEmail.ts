import nodemailer from "nodemailer";

export async function sendEmail(
  email: string,
  token: string
): Promise<void> {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === "465", // true for 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("SMTP_USER =", process.env.SMTP_USER);
    console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
    const inviteLink = `${process.env.FRONTEND_URL}/invite?token=${token}`;

    await transporter.sendMail({
      from: `"Workspace App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Workspace Invitation",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>You're Invited!</h2>

          <p>You have been invited to join a workspace.</p>

          <p>
            Click the button below to accept the invitation:
          </p>

          <a
            href="${inviteLink}"
            style="
              display:inline-block;
              padding:10px 20px;
              background:#2563eb;
              color:white;
              text-decoration:none;
              border-radius:5px;
            "
          >
            Accept Invitation
          </a>

          <p style="margin-top:20px;">
            Or copy and paste this URL into your browser:
          </p>

          <p>${inviteLink}</p>

          <p>This invitation expires in 7 days.</p>
        </div>
      `,
    });

    console.log(`Invitation email sent to ${email}`);
  } catch (error) {
    console.error("Failed to send invitation email:", error);
    throw error;
  }
}