import type { Metadata } from 'next';
import { ContentContainer } from '@/components/layout/content-container';
import { PageHeader } from '@/components/layout/page-header';
import { ResourcesView } from '@/components/resources/resources-view';

export const metadata: Metadata = { title: 'Recursos' };

export default function RecursosPage() {
  return (
    <ContentContainer>
      <PageHeader
        title="Recursos"
        description="Os materiais que você ligou às suas tarefas."
      />
      <ResourcesView />
    </ContentContainer>
  );
}
