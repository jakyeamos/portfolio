import { CLOSED_PROJECTS, CURRENT_PROJECTS, type CurrentProject } from '@/content/currentProjects';
import { PUBLIC_PROJECT_SLUGS } from '@/content/publicProjectManifest';

const ALL_PROJECTS: readonly CurrentProject[] = [...CURRENT_PROJECTS, ...CLOSED_PROJECTS];

export const PUBLIC_PROJECTS: readonly CurrentProject[] = ALL_PROJECTS.filter((project) =>
  PUBLIC_PROJECT_SLUGS.includes(project.slug),
);

export const PUBLIC_CURRENT_PROJECTS: readonly CurrentProject[] = CURRENT_PROJECTS.filter(
  (project) => PUBLIC_PROJECT_SLUGS.includes(project.slug),
);

export const PUBLIC_CLOSED_PROJECTS: readonly CurrentProject[] = CLOSED_PROJECTS.filter((project) =>
  PUBLIC_PROJECT_SLUGS.includes(project.slug),
);

export function getPublicProject(slug: string): CurrentProject | undefined {
  return PUBLIC_PROJECTS.find((project) => project.slug === slug);
}
