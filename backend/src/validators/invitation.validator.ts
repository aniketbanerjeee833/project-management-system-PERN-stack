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