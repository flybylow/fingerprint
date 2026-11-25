import { getCollection, type CollectionEntry } from 'astro:content';
import { url } from '@/lib/url';

export type Project = CollectionEntry<'work'>;

export const workPageSize = 24;

export const projectHref = (project: Project) => url(`/work/${project.id}/`);

/** Published case studies, in `order`, then newest first. */
export async function getProjects() {
  const projects = await getCollection('work', ({ data }) => !data.draft);
  return projects.sort((a, b) => a.data.order - b.data.order || (b.data.year ?? 0) - (a.data.year ?? 0));
}

export const workPageHref = (page: number) => (page <= 1 ? url('/work/') : url(`/work/page/${page}/`));
