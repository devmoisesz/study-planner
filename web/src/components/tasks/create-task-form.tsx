'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { CriterionField } from '@/components/tasks/criterion-field';
import { ResourceFields } from '@/components/tasks/resource-fields';
import { ScorePreview } from '@/components/tasks/score-preview';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { ApiError } from '@/lib/api/client';
import { createTaskWithPdfUploads } from '@/lib/api/tasks';
import {
  CREATE_TASK_DEFAULTS,
  createTaskFormSchema,
  toCreateTaskInput,
} from '@/lib/domain/create-task-schema';
import type { CreateTaskFormValues } from '@/lib/domain/create-task-schema';
import { queryKeys } from '@/lib/query/keys';
import { scoreBand } from '@/lib/domain/score';
import {
  createTaskPlaceholders,
  type TaskPlaceholders,
} from '@/lib/domain/task-placeholders';

/** Perguntas do front.md secao 11, na ordem em que a tela as apresenta. */
const CRITERIA = [
  {
    name: 'importance',
    label: 'Importância',
    question: 'Quanto essa tarefa é importante para você?',
    scaleLabels: ['Pouco', 'Muito'],
  },
  {
    name: 'domain',
    label: 'Domínio',
    question: 'Quanto você já domina esse assunto?',
    warning: 'Quanto maior o domínio, menor tende a ser a prioridade.',
    scaleLabels: ['Nada', 'Domino'],
  },
  {
    name: 'urgency',
    label: 'Urgência',
    question: 'Quanto essa tarefa precisa de atenção agora?',
    scaleLabels: ['Pode esperar', 'Agora'],
  },
  {
    name: 'relevance',
    label: 'Relevância',
    question: 'Quanto isso é relevante para sua prova ou objetivo?',
    scaleLabels: ['Pouco', 'Muito'],
  },
] as const satisfies ReadonlyArray<{
  name: 'importance' | 'domain' | 'urgency' | 'relevance';
  label: string;
  question: string;
  warning?: string;
  scaleLabels: [string, string];
}>;

export function CreateTaskForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const [resourceFiles, setResourceFiles] = useState<Array<File | null>>([]);
  const [placeholders, setPlaceholders] = useState<TaskPlaceholders | null>(
    null,
  );
  const placeholdersInitialized = useRef(false);

  useEffect(() => {
    if (placeholdersInitialized.current) return;

    placeholdersInitialized.current = true;
    setPlaceholders(createTaskPlaceholders());
  }, []);

  const {
    control,
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    resolver: zodResolver(createTaskFormSchema),
    defaultValues: CREATE_TASK_DEFAULTS,
    mode: 'onSubmit',
  });

  // Recalcula o preview a cada movimento de slider, sem re-renderizar o resto.
  const criteria = useWatch({
    control,
    name: ['importance', 'domain', 'urgency', 'relevance'],
  });
  const [importance, domain, urgency, relevance] = criteria;

  const mutation = useMutation({
    mutationFn: async (values: CreateTaskFormValues) => {
      const pdfs = values.resources.flatMap((resource, index) => {
        const file = resource.type === 'PDF' ? resourceFiles[index] : null;
        if (!file) return [];

        return [
          {
            title: resource.title.trim(),
            ...(resource.description.trim()
              ? { description: resource.description.trim() }
              : {}),
            file,
            resourceIndex: index,
          },
        ];
      });
      const uploadedResourceIndexes = new Set(
        pdfs.map((pdf) => pdf.resourceIndex),
      );

      return createTaskWithPdfUploads(
        toCreateTaskInput(values, uploadedResourceIndexes),
        pdfs.map(({ resourceIndex: _resourceIndex, ...pdf }) => pdf),
      );
    },
    onSuccess: async ({ task, failedUploads }) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      await queryClient.invalidateQueries({ queryKey: queryKeys.resources });

      if (failedUploads > 0) {
        notify(
          `A tarefa foi criada, mas ${failedUploads} PDF${failedUploads > 1 ? 's' : ''} não ${failedUploads > 1 ? 'foram enviados' : 'foi enviado'}.`,
          'error',
        );
        router.push(`/tarefas/${task.id}`);
        return;
      }

      notify(
        `"${task.title}" entrou no ranking com score ${task.score} — ${scoreBand(task.score).label.toLowerCase()}.`,
      );
      router.push('/');
    },
    onError: (error) => {
      // O backend devolve os issues do Zod com o caminho do campo; levamos
      // cada mensagem para o campo certo em vez de um alerta generico.
      if (error instanceof ApiError && error.issues.length > 0) {
        for (const [path, message] of Object.entries(error.fieldErrors())) {
          setError(path as keyof CreateTaskFormValues, {
            type: 'server',
            message,
          });
        }
        notify('Alguns campos precisam de ajuste.', 'error');
        return;
      }

      notify(
        error instanceof ApiError && error.isNetworkError
          ? 'O servidor não respondeu. Verifique se a API está no ar.'
          : 'Não foi possível criar a tarefa.',
        'error',
      );
    },
  });

  const isPending = mutation.isPending;

  return (
    <form
      noValidate
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="flex flex-col gap-8"
    >
      <section className="flex flex-col gap-5">
        <Field label="Título" required error={errors.title?.message}>
          <Input
            placeholder={placeholders?.title}
            disabled={isPending}
            {...register('title')}
          />
        </Field>

        <Field label="Descrição" hint="O que exatamente precisa ser feito?">
          <Textarea
            placeholder={placeholders?.description}
            disabled={isPending}
            {...register('description')}
          />
        </Field>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold text-ink">Prioridade</h2>
          <p className="text-xs text-ink-soft">
            Estas quatro respostas definem o score inicial. Depois disso, a
            prioridade só muda por produtividade ou aumento manual.
          </p>
        </div>

        {CRITERIA.map((criterion) => (
          <Controller
            key={criterion.name}
            control={control}
            name={criterion.name}
            render={({ field }) => (
              <CriterionField
                label={criterion.label}
                question={criterion.question}
                warning={'warning' in criterion ? criterion.warning : undefined}
                scaleLabels={criterion.scaleLabels}
                value={field.value}
                onChange={field.onChange}
                disabled={isPending}
              />
            )}
          />
        ))}

        <ScorePreview criteria={{ importance, domain, urgency, relevance }} />
      </section>

      <ResourceFields
        control={control}
        register={register}
        errors={errors}
        disabled={isPending}
        onFileChange={(index, file) => {
          setResourceFiles((current) => {
            const next = [...current];
            next[index] = file;
            return next;
          });
        }}
        onResourceRemove={(index) => {
          setResourceFiles((current) =>
            current.filter((_, currentIndex) => currentIndex !== index),
          );
        }}
      />

      <div className="flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-end">
        <Button onClick={() => router.push('/')} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isPending={isPending}>
          Criar tarefa
        </Button>
      </div>
    </form>
  );
}
