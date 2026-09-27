'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useCreateResource } from '@/components/tasks/use-tasks';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast';
import { getErrorMessage } from '@/lib/api/client';
import {
  EMPTY_RESOURCE,
  resourceFormSchema,
  type ResourceFormValues,
} from '@/lib/domain/create-task-schema';
import { RESOURCE_TYPE_OPTIONS } from '@/lib/domain/resource-type';

interface CreateResourceDialogProps {
  taskId: string;
  taskTitle: string;
  onClose: () => void;
}

export function CreateResourceDialog({
  taskId,
  taskTitle,
  onClose,
}: CreateResourceDialogProps) {
  const formId = useId();
  const creation = useCreateResource();
  const { notify } = useToast();
  const {
    register,
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceFormSchema),
    defaultValues: EMPTY_RESOURCE,
  });
  const type = useWatch({ control, name: 'type' });

  useEffect(() => {
    setFocus('title');
  }, [setFocus]);

  function submit(values: ResourceFormValues) {
    if (creation.isPending) return;
    creation.mutate(
      {
        taskId,
        input: {
          title: values.title,
          type: values.type,
          ...(values.url ? { url: values.url } : {}),
          ...(values.description ? { description: values.description } : {}),
        },
      },
      {
        onSuccess: () => {
          notify('Recurso adicionado à tarefa.');
          onClose();
        },
      },
    );
  }

  function close() {
    if (!creation.isPending) onClose();
  }

  return (
    <Dialog
      open
      onClose={close}
      dismissible={!creation.isPending}
      title="Adicionar recurso"
      description={
        <span className="block break-words">
          Guarde um material de estudo em <strong>{taskTitle}</strong>.
        </span>
      }
      className="max-h-[90dvh] overflow-y-auto"
      footer={
        <>
          <Button onClick={close} disabled={creation.isPending}>
            Cancelar
          </Button>
          <Button
            type="submit"
            form={formId}
            variant="primary"
            isPending={creation.isPending}
          >
            {creation.isPending ? 'Adicionando…' : 'Adicionar recurso'}
          </Button>
        </>
      }
    >
      <form
        id={formId}
        noValidate
        onSubmit={handleSubmit(submit)}
        aria-busy={creation.isPending}
        className="flex flex-col gap-4"
      >
        <Field label="Título" required error={errors.title?.message}>
          <Input
            placeholder="Ex.: Aula de lógica de programação"
            disabled={creation.isPending}
            {...register('title')}
          />
        </Field>
        <Field label="Tipo" required error={errors.type?.message}>
          <Select disabled={creation.isPending} {...register('type')}>
            {RESOURCE_TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field
          label="Link (opcional)"
          error={errors.url?.message}
          hint={
            type === 'BOOK'
              ? 'Pode deixar em branco para um livro físico.'
              : type === 'PDF'
                ? 'Cole o endereço do PDF, se ele estiver disponível online.'
                : 'Cole o endereço completo, começando com https://'
          }
        >
          <Input
            type="url"
            inputMode="url"
            placeholder={
              type === 'YOUTUBE' ? 'https://youtube.com/…' : 'https://…'
            }
            disabled={creation.isPending}
            {...register('url')}
          />
        </Field>
        <Field label="Descrição (opcional)" error={errors.description?.message}>
          <Textarea
            rows={3}
            placeholder="Ex.: Condicionais e loops, a partir de 12:30."
            disabled={creation.isPending}
            {...register('description')}
          />
        </Field>
        {creation.isError ? (
          <p
            role="alert"
            className="rounded-md bg-danger-soft px-3 py-2 text-sm text-danger"
          >
            {getErrorMessage(
              creation.error,
              'Não foi possível adicionar o recurso. Tente novamente.',
            )}
          </p>
        ) : null}
      </form>
    </Dialog>
  );
}
