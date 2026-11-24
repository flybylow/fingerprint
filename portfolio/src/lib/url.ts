const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix an in-portfolio path with the Astro base (`/portfolio`). Leaves mail, hash, and absolute URLs alone. A path that starts with `~` is a root of the Next.js site, so `~/` is the Signal Portrait. */
export function url(path: string) {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  if (path.startsWith('~')) return path.slice(1) || '/';
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}
