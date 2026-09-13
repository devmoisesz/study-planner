import type { Metadata } from 'next';
import { ContentContainer } from '@/components/layout/content-container';
import { PageHeader } from '@/components/layout/page-header';
import { CreateTaskForm } from '@/components/tasks/create-task-form';

export const metadata: Metadata = { title: 'Nova tarefa' };

export default function NovaTarefaPage() {
  return (
    <ContentContainer>
      <PageHeader
        title="Nova tarefa"
        description="Responda quatro perguntas e o Study Planner calcula a prioridade."
      />
      <CreateTaskForm />
    </ContentContainer>
  );
}
