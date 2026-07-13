import type { CurrentProject } from '@/content/currentProjects';

interface ProjectStatusMeta {
  label: string;
  className: string;
}

export function getProjectStatusMeta(status: CurrentProject['trackerStatus']): ProjectStatusMeta {
  if (status === 'on_track') {
    return { label: 'Active', className: 'text-[color:var(--color-secondary)]' };
  }

  if (status === 'needs_attention') {
    return { label: 'In development', className: 'text-[color:var(--color-gold)]' };
  }

  if (status === 'stalled') {
    return { label: 'On deck', className: 'text-[color:var(--color-primary)]' };
  }

  return { label: 'Shipped', className: 'text-[color:var(--color-primary)]' };
}
