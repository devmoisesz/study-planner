import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ContentContainer } from '@/components/layout/content-container';
import { PageHeader } from '@/components/layout/page-header';
import { TasksView } from '@/components/tasks/tasks-view';
import { buttonClasses } from '@/components/ui/button';

export default function PrioridadesPage() {
  return (
    <ContentContainer>
      <PageHeader
        title="Prioridades"
        description="Veja o que merece mais atenção agora."
        action={
          <Link href="/tarefas/nova" className={buttonClasses({ variant: 'primary' })}>
            <Plus aria-hidden className="size-4" />
            Nova tarefa
          </Link>
        }
      />
      <TasksView />
    </ContentContainer>
  );
}
