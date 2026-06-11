import { pool } from "../../db/pool";
import { Project } from "../../types/project.types";

export interface CreateProjectInput {
  workspace_id: number;
  name: string;
  description?: string;
  created_by: number;
  manager_id?: number;
  start_date?: string;
  due_date?: string;
}

export async function createProjectRepo(
  input: CreateProjectInput
): Promise<Project> {
  const { workspace_id, name, description, created_by, manager_id, start_date, due_date } = input;

  const { rows } = await pool.query<Project>(
    `INSERT INTO projects
       (workspace_id, name, description, created_by, manager_id, start_date, due_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [workspace_id, name, description ?? null, created_by, manager_id ?? null, start_date ?? null, due_date ?? null]
  );

  return rows[0];
}

export async function fetchAllProjectsRepo(workspace_id: number): Promise<Project[]> {
  const { rows } = await pool.query<Project>(
    `SELECT id,name,description,status,manager_id,
    
      TO_CHAR(start_date, 'YYYY-MM-DD') AS start_date,
      TO_CHAR(due_date, 'YYYY-MM-DD') AS due_date,
    created_at,updated_at
     FROM projects
     WHERE workspace_id = $1
     ORDER BY created_at DESC
     `,
    [workspace_id]
  );
  return rows;
}

/** Used by the service to guard: is this user actually in the workspace? */
export async function findWorkspaceMember(
  workspace_id: number,
  user_id: number
): Promise<{ role: string } | null> {
  const { rows } = await pool.query(
    `SELECT role
     FROM workspace_members
     WHERE workspace_id = $1 AND user_id = $2`,
    [workspace_id, user_id]
  );
  return rows[0] ?? null;
}

/** Confirm manager_id (if supplied) belongs to the same workspace */
export async function findMemberById(
  workspace_id: number,
  user_id: number
): Promise<{ user_id: number } | null> {
  const { rows } = await pool.query(
    `SELECT user_id
     FROM workspace_members
     WHERE workspace_id = $1 AND user_id = $2`,
    [workspace_id, user_id]
  );
  return rows[0] ?? null;
}

// src/repositories/project/project.repository.ts

export async function findProjectsByManager(
  workspace_id: number,
  manager_id: number
) :Promise<Project[]>{
  const { rows } = await pool.query(
    `SELECT
       p.id,p.name,p.description,p.status,p.manager_id,
    
      TO_CHAR(p.start_date, 'YYYY-MM-DD') AS start_date,
      TO_CHAR(p.due_date, 'YYYY-MM-DD') AS due_date,
    p.created_at,p.updated_at,
        u.name AS manager_name
     FROM projects p
     LEFT JOIN users u
       ON u.id = p.manager_id
     WHERE p.workspace_id = $1
       AND p.manager_id = $2
     ORDER BY p.created_at DESC`,
    [workspace_id, manager_id]
  );

  return rows;
}

