// workspace_id, project_id, title, description, priority, assignee_id, created_by, due_date, status: 'todo'
// src/types/task.types.ts

export interface Task {
  id:             number;
  workspace_id:   number;
  project_id:     number;
  title:          string;
  description:    string | null;
  status:         "todo" | "in_progress" | "review" | "done";
  priority:       "low" | "medium" | "high" | "urgent";
  assignee_id:    number | null;   // nullable = unassigned
assignee_name?: string | null;
  created_by:     number;
  due_date:       string | null;
  position:       number;          // order within the status column
  parent_task_id: number | null;   // null = top-level task, else a subtask
  created_at:     string;
  updated_at:     string;

  // Optional joined fields (when assignee info is fetched alongside)
//   assignee?: {
//     id:         number;
//     name:       string;
//     avatar_url: string | null;
//   } | null;
}