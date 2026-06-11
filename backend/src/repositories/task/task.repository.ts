// repositories/task/task.repository.ts
import { pool } from "../../db/pool";
import { Task } from "../../types/task.types";


export interface CreateTaskInput {
    workspace_id: number;
    project_id: number;
    title: string;
    description?: string;
    priority?: string;
    assignee_id?: number | null;
    created_by: number;
    due_date?: string | null;
    parent_task_id?: number | null;
}
export async function insertTask(data: CreateTaskInput) : Promise<Task> {

    const{workspace_id, project_id, title,
         description, priority, assignee_id, created_by, due_date, parent_task_id} = data
  const { rows } = await pool.query(
    `INSERT INTO tasks (
        workspace_id,
        project_id,
        title,
        description,
        priority,
        assignee_id,
        created_by,
        due_date,
        parent_task_id
     )
     VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
     )
     RETURNING *`,
    [
      workspace_id,
      project_id,
      title,
      description ?? null,
      priority ?? "medium",
      assignee_id ?? null,
      created_by,
      due_date ?? null,
      parent_task_id ?? null,
    ]
  );

  return rows[0];
}

// export async function findAllTasksCreatedByManager(
//   workspace_id: number,
//   manager_id: number
// ) :Promise<Task[]> {

//   const { rows } = await pool.query(
//     `SELECT
//         t.*,
//         u.name AS assignee_name,
//         u.avatar_url
//      FROM tasks t
//      LEFT JOIN users u
//        ON u.id = t.assignee_id
//      WHERE t.workspace_id = $1
//        AND t.created_by = $2
//      ORDER BY t.created_at DESC`,
//     [
//       workspace_id,
//       manager_id,
//     ]
//   );

//   return rows;
// }
export async function findTasksByProject(
  workspace_id: number,
  project_id: number
): Promise<Task[]> {

  const { rows } = await pool.query<Task>(
    `
    SELECT
      t.*,
      u.name AS assignee_name
    FROM tasks t
    LEFT JOIN users u
      ON u.id = t.assignee_id
    WHERE t.workspace_id = $1
      AND t.project_id = $2
    ORDER BY t.position ASC, t.created_at ASC
    `,
    [workspace_id, project_id]
  );

  return rows;
}