import express, { Application, Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";


// ── Route imports ────────────────────────────────────────────
import projectRoutes     from "./routes/project.routes";


const app: Application = express();

// ── Global middlewares ───────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true, // needed later when you add cookies
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ─────────────────────────────────────────────
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

// ── API Routes ───────────────────────────────────────────────
const API = "/api/v1";

// standalone routes


// workspace-scoped routes  →  /api/v1/workspaces/:workspaceId/projects
app.use(`${API}/workspaces/:workspaceId/projects`,    projectRoutes);


// ── 404 handler ──────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ── Global error handler (always last) ───────────────────────
app.use(errorHandler);

export default app;