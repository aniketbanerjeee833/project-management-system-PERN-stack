// // src/hooks/api/useTaskQueries.ts

// import {
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";

// import { taskApi } from "../../api/task.api";
// import type {TaskFormData,} from "../../api/task.api";

// export const taskKeys = {
//   all: (wsId: number) =>
//     ["workspaces", wsId, "tasks"] as const,

//   managerTasks: (wsId: number) =>
//     ["workspaces", wsId, "tasks", "manager"] as const,
// };

// interface UseTaskQueriesOptions {
//   workspaceId: number;
// }

// export const useTaskQueries = ({
//   workspaceId,
// }: UseTaskQueriesOptions) => {

//   const qc = useQueryClient();
// //      const isAdmin   = role === "admin";
// //   const isManager = role === "manager";
//   // ── CREATE TASK ──────────────────────────────────────────
//   const createTask = useMutation({
//     mutationFn: (body: TaskFormData) =>
//       taskApi.create(workspaceId, body),

//     onSuccess: () => {
//       qc.invalidateQueries({queryKey: taskKeys.all(workspaceId),});

//       qc.invalidateQueries({queryKey: taskKeys.managerTasks(workspaceId),});
//     },
//   });

//   return {
//     createTask,
//   };
// };

// src/hooks/api/useTaskQueries.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi, type TaskFormData } from '../../api/task.api';


export const taskKeys = {
  byProject: (workspaceId: number, projectId: number) =>
    ['workspaces', workspaceId, 'projects', projectId, 'tasks'] as const,
};

export const useTaskQueries = (workspaceId: number, projectId: number) => {
  const qc = useQueryClient();

  // ── GET all tasks for this project ────────────────────────────────────────
  const tasks = useQuery({
    queryKey: taskKeys.byProject(workspaceId, projectId),
    queryFn:  () => taskApi.getAllTaskByProject(workspaceId, projectId),
    enabled:  Boolean(workspaceId) && Boolean(projectId),
  });

  // ── CREATE task ────────────────────────────────────────────────────────────
  const createTask = useMutation({
    mutationFn: (body: TaskFormData) => taskApi.create(workspaceId, projectId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: taskKeys.byProject(workspaceId, projectId) });
    },
  });

  // ── UPDATE status (drag between columns) ──────────────────────────────────
//   const updateTaskStatus = useMutation({
//     mutationFn: ({ taskId, status }: { taskId: number; status: Tasks['status'] }) =>
//       taskApi.updateStatus(workspaceId, projectId, taskId, status),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: taskKeys.byProject(workspaceId, projectId) });
//     },
//   });

  return {
    tasks,            // .data → Tasks[], .isLoading, .isError
    createTask,       // .mutateAsync({ title, description, priority, assignee_id, due_date })
    //updateTaskStatus, // .mutateAsync({ taskId, status })
  };
};