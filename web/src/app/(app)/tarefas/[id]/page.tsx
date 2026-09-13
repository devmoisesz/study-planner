import { ContentContainer } from '@/components/layout/content-container';
import { TaskDetailView } from '@/components/tasks/task-detail-view';

export default async function TarefaPage({ params }: PageProps<'/tarefas/[id]'>) {
  const { id } = await params;

  return (
    <ContentContainer>
      <TaskDetailView taskId={id} />
    </ContentContainer>
  );
}
