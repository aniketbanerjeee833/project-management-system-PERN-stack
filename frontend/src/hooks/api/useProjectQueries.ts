import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { projectApi } from "../../api/projects.api";
import type { ProjectFormData, UpdateProjectData } from "../../api/projects.api";
import type { Role } from "../AuthContext";

export const projectKeys = {
  all:             (wsId: number)              => ["workspaces", wsId, "projects"]                    as const,
  detail:          (wsId: number, pId: number) => ["workspaces", wsId, "projects", pId]               as const,
  managerProjects: (wsId: number)              => ["workspaces", wsId, "projects", "manager"]         as const,
};

interface UseProjectQueriesOptions {
  workspaceId: number;
  role:        Role;          // ← pass role so hook knows which query to run
  projectId?:  number;
}

export const useProjectQueries = ({
  workspaceId,
  role,
  projectId,
}: UseProjectQueriesOptions) => {
  const qc = useQueryClient();

  const isAdmin   = role === "admin";
  const isManager = role === "manager";

  // ── GET all — ONLY for admin ──────────────────────────────────────────────
  const projects = useQuery({
    queryKey: projectKeys.all(workspaceId),
    queryFn:  () => projectApi.getAll(workspaceId),
    enabled:  Boolean(workspaceId) && isAdmin,   // ← disabled for manager/employee
    staleTime: 1000 * 60,
  });

  // ── GET manager's own projects — ONLY for manager ─────────────────────────
  const managerProjects = useQuery({
    queryKey: projectKeys.managerProjects(workspaceId),
    queryFn:  () => projectApi.getProjectsByManagers(workspaceId),
    enabled:  Boolean(workspaceId) && isManager,  // ← disabled for admin/employee
    staleTime: 1000 * 60,
  });

  // ── GET one ───────────────────────────────────────────────────────────────
  const project = useQuery({
    queryKey: projectKeys.detail(workspaceId, projectId!),
    queryFn:  () => projectApi.getOne(workspaceId, projectId!),
    enabled:  Boolean(workspaceId) && Boolean(projectId),
    staleTime: 1000 * 60,
  });

  // ── CREATE ────────────────────────────────────────────────────────────────
  const createProject = useMutation({
    mutationFn: (body: ProjectFormData) =>
      projectApi.create(workspaceId, body),
    onSuccess: () => {
      // invalidate the right list depending on who created it
      if (isAdmin)   qc.invalidateQueries({ queryKey: projectKeys.all(workspaceId) });
      if (isManager) qc.invalidateQueries({ queryKey: projectKeys.managerProjects(workspaceId) });
    },
  });

  // ── UPDATE ────────────────────────────────────────────────────────────────
  const updateProject = useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateProjectData }) =>
      projectApi.update(workspaceId, id, body),
    onSuccess: (updated) => {
      if (isAdmin)   qc.invalidateQueries({ queryKey: projectKeys.all(workspaceId) });
      if (isManager) qc.invalidateQueries({ queryKey: projectKeys.managerProjects(workspaceId) });
      qc.invalidateQueries({ queryKey: projectKeys.detail(workspaceId, updated.id) });
    },
  });

  // ── DELETE ────────────────────────────────────────────────────────────────
  const deleteProject = useMutation({
    mutationFn: (id: number) =>
      projectApi.remove(workspaceId, id),
    onSuccess: (_data, deletedId) => {
      if (isAdmin)   qc.invalidateQueries({ queryKey: projectKeys.all(workspaceId) });
      if (isManager) qc.invalidateQueries({ queryKey: projectKeys.managerProjects(workspaceId) });
      qc.removeQueries({ queryKey: projectKeys.detail(workspaceId, deletedId) });
    },
  });

  // ── Unified project list — whichever is active ────────────────────────────
  // Consumers can use this instead of checking role themselves
  const projectList = isAdmin
    ? (projects.data      ?? [])
    : (managerProjects.data ?? []);

  const projectsQuery = isAdmin ? projects : managerProjects;

  return {
    // unified — use these in your pages
    projectList,                    // Project[]  — correct list for the role
    projectsQuery,                  // the active useQuery object (.isLoading etc.)

    // raw queries if you need them separately
    projects,
    managerProjects,
    project,

    // mutations
    createProject,
    updateProject,
    deleteProject,
  };
};