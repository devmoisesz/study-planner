'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteTask,
  getTask,
  increasePriority,
  listResources,
  listTasks,
  registerProductivity,
  updateTask,
} from '@/lib/api/tasks';
import type { TaskEditInput } from '@/lib/api/tasks';
import { queryKeys } from '@/lib/query/keys';

export function useTasks() {
  return useQuery({
    queryKey: queryKeys.tasks,
    queryFn: listTasks,
  });
}

export function useTask(id: string) {
  return useQuery({
    queryKey: queryKeys.task(id),
    queryFn: () => getTask(id),
  });
}

export function useResources() {
  return useQuery({
    queryKey: queryKeys.resources,
    queryFn: listResources,
  });
}

/** Toda mutacao invalida tasks e resources: o ranking e a contagem mudam junto. */
function useTaskMutation<TVariables, TResult>(
  mutationFn: (variables: TVariables) => Promise<TResult>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: async () => {
      await Promise.all([
        // queryKeys.tasks e prefixo de queryKeys.task(id), entao uma
        // invalidacao so ja alcanca o ranking e cada detalhe aberto.
        queryClient.invalidateQueries({ queryKey: queryKeys.tasks }),
        queryClient.invalidateQueries({ queryKey: queryKeys.resources }),
      ]);
    },
  });
}

export function useRegisterProductivity() {
  return useTaskMutation(({ id, percentage }: { id: string; percentage: number }) =>
    registerProductivity(id, percentage),
  );
}

export function useIncreasePriority() {
  return useTaskMutation(({ id, percentage }: { id: string; percentage: number }) =>
    increasePriority(id, percentage),
  );
}

export function useDeleteTask() {
  return useTaskMutation((id: string) => deleteTask(id));
}

export function useUpdateTask() {
  return useTaskMutation(({ id, input }: { id: string; input: TaskEditInput }) =>
    updateTask(id, input),
  );
}
