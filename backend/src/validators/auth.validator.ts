// src/validators/auth.validator.ts
import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name:     z.string().min(1, "Name is required").max(100),
    email:    z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email:    z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  }),
});

export const createWorkspaceSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Workspace name is required").max(120),
    slug: z
      .string()
      .min(2, "Slug too short")
      .max(80)
      .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  }),
});

