'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/**
 * So titulo e descricao sao editaveis. O score NAO se edita direto: ele muda
 * por produtividade ou aumento manual (plan.md secao 5).
 */
const editTaskSchema = z.object({
  title: z.string().trim().min(1, 'Dê um nome para a tarefa.'),
  description: z.string().trim(),
});

export type EditTaskValues = z.infer<typeof editTaskSchema>;

interface EditTaskFormProps {
  defaultValues: EditTaskValues;
  onCancel: () => void;
  onSubmit: (values: EditTaskValues) => void;
  isPending?: boolean;
}

export function EditTaskForm({
  defaultValues,
  onCancel,
  onSubmit,
  isPending,
}: EditTaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditTaskValues>({
    resolver: zodResolver(editTaskSchema),
    defaultValues,
  });

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Field label="Título" required error={errors.title?.message}>
        <Input disabled={isPending} {...register('title')} />
      </Field>

      <Field label="Descrição" hint="Deixe em branco para remover.">
        <Textarea disabled={isPending} {...register('description')} />
      </Field>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary" isPending={isPending}>
          Salvar alterações
        </Button>
      </div>
    </form>
  );
}
