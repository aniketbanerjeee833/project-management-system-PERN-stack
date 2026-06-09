import express, { Application, Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";


// ── Route imports ────────────────────────────────────────────
import projectRoutes     from "./routes/project.routes";
import invitationRoutes   from "./routes/invitation.routes";
import publicInvitationRoutes from "./routes/public.invitation.routes";
import membersRoutes from "./routes/members.routes";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";

const app: Application = express();

// ── Global middlewares ───────────────────────────────────────
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:5174",
//   credentials: true, // needed later when you add cookies
// }));
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// ── Health check ─────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

// ── API Routes ───────────────────────────────────────────────
const API = "/api/v1";

// standalone routes


// workspace-scoped routes  →  /api/v1/workspaces/:workspaceId/projects
app.use(`${API}/auth`, authRoutes);
app.use(`${API}/workspaces/:workspaceId/projects`,    projectRoutes);
app.use(`${API}/workspaces/:workspaceId/invitations`,  invitationRoutes);
app.use(`${API}/invitations`, publicInvitationRoutes);
app.use(`${API}/workspaces/:workspaceId/members`, membersRoutes);

// ── 404 handler ──────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler (always last) ───────────────────────
app.use(errorHandler);

export default app;












// 1. ADMIN registers
//    └── no token in URL → create workspace screen
//    └── workspace row + workspace_members(role=admin) created

// 2. ADMIN invites Priya as manager
//    └── POST /invitations → invitations row inserted, email sent
//    └── email contains /register?token=xyz

// 3. PRIYA clicks link → register form
//    └── POST /auth/register { name, email, password, token }
//    └── users row created
//    └── workspace_members(role=manager) created
//    └── invitations status → accepted
//    └── Priya lands on manager dashboard

// 4. ADMIN creates a project, assigns Priya as manager_id
//    └── projects row: manager_id = priya.id

// 5. ADMIN invites Arjun as employee (same flow as step 2-3)
//    └── workspace_members(role=employee) created

// 6. PRIYA (manager) creates a task inside her project
//    └── assigns assignee_id = arjun.id
//    └── notification created for Arjun

// 7. ARJUN (employee) logs in → sees only his tasks
//    └── updates task status, logs time, adds comments