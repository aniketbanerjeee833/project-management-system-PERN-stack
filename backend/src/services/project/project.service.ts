import {
  createProjectRepo,
  findWorkspaceMember,
  findMemberById,
  CreateProjectInput,
} from "../../repositories/project/project.repository";
import { Project } from "../../types/project.types";
import {AppError} from "../../utils/AppError";

interface CreateProjectParams {
  workspace_id: number;
  actor_id: number;          // the logged-in user creating the project
  name: string;
  description?: string;
  manager_id?: number;
  start_date?: string;
  due_date?: string;
}

export async function createProjectService(
  params: CreateProjectParams
): Promise<Project> {
  const { workspace_id, actor_id, manager_id, start_date, due_date,name,description } = params;

  // ── 1. Actor must belong to this workspace ──────────────────────────────
  const member = await findWorkspaceMember(workspace_id, actor_id);
  if (!member) {
    throw new AppError("You are not a member of this workspace.", 403);
  }

  // ── 2. Only admin / manager may create projects ─────────────────────────
  if (!["admin", "manager"].includes(member.role)) {
    throw new AppError("Only admins and managers can create projects.", 403);
  }

  // ── 3. If manager_id supplied, they must exist in the workspace ──────────
  if (manager_id !== undefined) {
    const mgr = await findMemberById(workspace_id, manager_id);
    if (!mgr) {
      throw new AppError("Assigned manager is not a member of this workspace.", 400);
    }
  }

  // ── 4. Date logic guard ──────────────────────────────────────────────────
  if (start_date && due_date && new Date(start_date) > new Date(due_date)) {
    throw new AppError("start_date cannot be after due_date.", 400);
  }

  // ── 5. Persist ───────────────────────────────────────────────────────────
  const input: CreateProjectInput = {
    workspace_id,
    name: name,
    description:description,
    created_by: actor_id,
    manager_id,
    start_date,
    due_date,
  };

  const project = await createProjectRepo(input);
  return project;
}