// src/validators/task.validator.ts

import { z } from "zod";
const taskParams = z.object({
  workspaceId: z.number().int().positive("Workspace ID is required and must be a number"),
  projectId:   z.number().int().positive("Project ID is required and must be a number"),
});
 
export const createTaskSchema = z.object({
  body: z.object({
    project_id: z
      .number()
      .int()
      .positive("Project ID is required and must be a number"),

    title: z
      .string()
      .trim()
      .min(2, "Title must be at least 2 characters")
      .max(255, "Title is too long"),

    description: z
      .string()
      .trim()
      .max(2000, "Description is too long")
      .optional(),

    priority: z
      .enum(["low", "medium", "high", "urgent"])
      .default("medium"),

    assignee_id:    z.coerce.number().int().positive("assignee_id is required"),

      due_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
      .optional(),
 

    parent_task_id: z
      .number()
      .int()
      .positive()
      .nullable()
      .optional(),
  }),
});

export const updateTaskSchema = createTaskSchema.extend({
  params: z.object({
    taskId: z
      .number()
      .int()
      .positive("Task ID is required"),
  }),
    status: z
      .enum([
        "todo",
        "in_progress",
        "review",
        "done",
      ])
      .optional(),
});
export const getTasksByProjectSchema = z.object({
  params: taskParams,
});