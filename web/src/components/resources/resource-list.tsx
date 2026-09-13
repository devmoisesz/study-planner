import { ResourceCard } from '@/components/resources/resource-card';
import type { Resource } from '@/types/api';

interface ResourceListProps {
  resources: readonly (Resource & { taskTitle?: string })[];
  showTask?: boolean;
  /** false quando a lista ja esta agrupada pelo tipo. */
  showType?: boolean;
}

export function ResourceList({
  resources,
  showTask = false,
  showType = true,
}: ResourceListProps) {
  return (
    <ul className="flex flex-col gap-2">
      {resources.map((resource) => (
        <li key={resource.id}>
          <ResourceCard
            resource={resource}
            taskTitle={showTask ? resource.taskTitle : undefined}
            taskId={showTask ? resource.taskId : undefined}
            showType={showType}
          />
        </li>
      ))}
    </ul>
  );
}
