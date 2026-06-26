/** Sync CSS viewport vars (layout viewport — compatible interactive-widget=resizes-content). */

let initialized = false;
let rafId = 0;

export function syncViewportVars(): void {
  const root = document.documentElement;
  const height = window.innerHeight;
  const width = window.innerWidth;

  root.style.setProperty("--vh", `${height * 0.01}px`);
  root.style.setProperty("--vw", `${width * 0.01}px`);
  root.style.setProperty("--layout-height", `${height}px`);
  root.style.setProperty("--layout-width", `${width}px`);
  root.style.setProperty("--app-height", `${height}px`);
  root.style.setProperty("--app-width", `${width}px`);
}

/** Réinitialise le viewport après fermeture d'un overlay mobile. */
export function resetViewportAfterOverlay(): void {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  syncViewportVars();
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    syncViewportVars();
  });
  window.setTimeout(syncViewportVars, 100);
}

function scheduleSync(): void {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    syncViewportVars();
  });
}

export function initViewport(): () => void {
  if (typeof window === "undefined") return () => {};

  syncViewportVars();

  if (initialized) return () => {};
  initialized = true;

  window.addEventListener("resize", scheduleSync, { passive: true });
  window.addEventListener("orientationchange", scheduleSync, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleSync, { passive: true });

  return () => {
    window.removeEventListener("resize", scheduleSync);
    window.removeEventListener("orientationchange", scheduleSync);
    window.visualViewport?.removeEventListener("resize", scheduleSync);
    if (rafId) cancelAnimationFrame(rafId);
    initialized = false;
  };
}
