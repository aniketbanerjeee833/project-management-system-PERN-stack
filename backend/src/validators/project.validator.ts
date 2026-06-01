import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required").max(200),
    description: z.string().max(2000).optional(),
    manager_id: z.number().int().positive().optional(),
    start_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
      .optional(),
    due_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
      .optional(),
  }),
  params: z.object({
    workspaceId: z.string().regex(/^\d+$/, "workspaceId must be a number"),
  }),
});

// import { z } from "zod";

// export const createProjectSchema = z.object({
//   body: z.object({
//     name: z.string().min(1, "Name is required").max(200),
//     description: z.string().max(2000).optional(),
//     manager_id: z.number().int().positive().optional(),
    
//     // 1. Accept DD-MM-YYYY from frontend
//     // 2. Transform it to YYYY-MM-DD for PostgreSQL
//     start_date: z
//       .string()
//       .regex(/^\d{2}-\d{2}-\d{4}$/, "Use DD-MM-YYYY format") // Matches frontend
//       .optional()
//       .transform((val) => {
//         if (!val) return val;
//         const [day, month, year] = val.split("-");
//         return `${year}-${month}-${day}`; // Outputs YYYY-MM-DD
//       }),

//     due_date: z
//       .string()
//       .regex(/^\d{2}-\d{2}-\d{4}$/, "Use DD-MM-YYYY format") // Matches frontend
//       .optional()
//       .transform((val) => {
//         if (!val) return val;
//         const [day, month, year] = val.split("-");
//         return `${year}-${month}-${day}`; // Outputs YYYY-MM-DD
//       }),
//   }),
//   params: z.object({
//     workspaceId: z.string().regex(/^\d+$/, "workspaceId must be a number"),
//   }),
// });