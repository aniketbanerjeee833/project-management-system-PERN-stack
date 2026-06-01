export interface CreateProjectBody {
  name: string;
  description?: string;
  manager_id?: number;
  start_date?: string;   // "YYYY-MM-DD"
  due_date?: string;
}

export interface Project {
  id: number;
  workspace_id: number;
  name: string;
  description: string | null;
  status: "active" | "completed" | "on_hold" | "archived";
  created_by: number;
  manager_id: number | null;
  start_date: string | null;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}