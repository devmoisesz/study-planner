'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { createQueryClient } from '@/lib/query/query-client';

export function Providers({ children }: { children: ReactNode }) {
  // useState garante um client por arvore, sem vazar cache entre requisicoes.
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}
