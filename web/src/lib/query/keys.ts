/** Chaves de cache do React Query, centralizadas para a invalidacao nao errar. */
export const queryKeys = {
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
  resources: ['resources'] as const,
};
