import { BookOpen, FileText, Globe, Paperclip, Youtube } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ResourceType } from '@/types/api';
import { RESOURCE_TYPES } from '@/types/api';

interface ResourceTypeMeta {
  label: string;
  icon: LucideIcon;
  /** BOOK costuma nao ter URL; o formulario ajusta a dica. */
  expectsUrl: boolean;
  /** PDF aceita arquivo alem de link. Depende de rota de upload. */
  acceptsUpload: boolean;
}

const META: Record<ResourceType, ResourceTypeMeta> = {
  YOUTUBE: { label: 'YouTube', icon: Youtube, expectsUrl: true, acceptsUpload: false },
  BOOK: { label: 'Livro', icon: BookOpen, expectsUrl: false, acceptsUpload: false },
  PDF: { label: 'PDF', icon: FileText, expectsUrl: true, acceptsUpload: true },
  WEBSITE: { label: 'Site', icon: Globe, expectsUrl: true, acceptsUpload: false },
  OTHER: { label: 'Outro', icon: Paperclip, expectsUrl: false, acceptsUpload: false },
};

export function resourceTypeMeta(type: ResourceType): ResourceTypeMeta {
  return META[type];
}

export function resourceTypeLabel(type: ResourceType): string {
  return META[type].label;
}

export const RESOURCE_TYPE_OPTIONS = RESOURCE_TYPES.map((type) => ({
  value: type,
  label: META[type].label,
}));
