import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { projectApi } from "../../api/projects.api";
import type { ProjectFormData, UpdateProjectData } from "../../api/projects.api";

export const projectKeys = {
  all:    (wsId: number)              => ["workspaces", wsId, "projects"]          as const,
  detail: (wsId: number, pId: number) => ["workspaces", wsId, "projects", pId]     as const,
};

export const useProjectQueries = (workspaceId: number, projectId?: number) => {
  const qc = useQueryClient();

  // ── GET all ──────────────────────────────────────────────────────────────
  const projects = useQuery({
    queryKey: projectKeys.all(workspaceId),
    queryFn:  () => projectApi.getAll(workspaceId),
    enabled:  Boolean(workspaceId),
    staleTime: 1000 * 60,
  });

  // ── GET one ──────────────────────────────────────────────────────────────
  const project = useQuery({
    queryKey: projectKeys.detail(workspaceId, projectId!),
    queryFn:  () => projectApi.getOne(workspaceId, projectId!),
    enabled:  Boolean(workspaceId) && Boolean(projectId),
    staleTime: 1000 * 60,
  });

  // ── CREATE ───────────────────────────────────────────────────────────────
  const createProject = useMutation({
    mutationFn: (body: ProjectFormData) =>projectApi.create(workspaceId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: projectKeys.all(workspaceId) });
    },
  });

  // ── UPDATE ───────────────────────────────────────────────────────────────
  const updateProject = useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateProjectData }) =>projectApi.update(workspaceId, id, body),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: projectKeys.all(workspaceId) });
      qc.invalidateQueries({ queryKey: projectKeys.detail(workspaceId, updated.id) });
    },
  });

  // ── DELETE ───────────────────────────────────────────────────────────────
  const deleteProject = useMutation({
    mutationFn: (id: number) => projectApi.remove(workspaceId, id),
    onSuccess: (_data, deletedId) => {
      qc.invalidateQueries({ queryKey: projectKeys.all(workspaceId) });
      qc.removeQueries({ queryKey: projectKeys.detail(workspaceId, deletedId) });
    },
  });

  return {
    projects,
    project,
    createProject,
    updateProject,
    deleteProject,
  };
};