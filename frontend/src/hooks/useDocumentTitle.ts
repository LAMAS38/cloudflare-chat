import { useSeo } from "./useSeo";

/** Met à jour uniquement le titre — préférez `useSeo` pour un SEO complet. */
export function useDocumentTitle(title: string) {
  useSeo({ title, path: typeof window !== "undefined" ? window.location.pathname : "/" });
}
