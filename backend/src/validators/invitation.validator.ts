import z from "zod";

export const sendInviteSchema= z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["manager", "employee"]),
  }),
  params: z.object({
    workspaceId: z.string().regex(/^\d+$/, "workspaceId must be a number"),
  })
  });
  export const acceptInviteSchema = z.object({
  body: z.object({
    email:     z.string().email("Invalid email"),
    password:  z.string().min(8, "Password must be at least 8 characters"),
    name:      z.string().min(1).max(100).optional(), // only needed for new users
    isNewUser: z.boolean(),
  }),
  params: z.object({
    token: z.string().min(1, "Token is required"),
  }),
});