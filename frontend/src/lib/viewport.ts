/** Sync CSS viewport vars from Visual Viewport API (mobile URL bar, clavier, rotation). */

let initialized = false;
let rafId = 0;

export function syncViewportVars(): void {
  const root = document.documentElement;
  const vv = window.visualViewport;
  const height = vv?.height ?? window.innerHeight;
  const width = vv?.width ?? window.innerWidth;
  const offsetTop = vv?.offsetTop ?? 0;
  const offsetLeft = vv?.offsetLeft ?? 0;

  root.style.setProperty("--vh", `${height * 0.01}px`);
  root.style.setProperty("--vw", `${width * 0.01}px`);
  root.style.setProperty("--app-height", `${height}px`);
  root.style.setProperty("--app-width", `${width}px`);
  root.style.setProperty("--layout-height", `${window.innerHeight}px`);
  root.style.setProperty("--layout-width", `${window.innerWidth}px`);
  root.style.setProperty("--viewport-offset-top", `${offsetTop}px`);
  root.style.setProperty("--viewport-offset-left", `${offsetLeft}px`);

  const keyboardOffset = Math.max(0, window.innerHeight - height - offsetTop);
  root.style.setProperty("--keyboard-offset", `${keyboardOffset}px`);
  root.dataset.keyboardOpen = keyboardOffset > 80 ? "true" : "false";
}

/** Réinitialise le viewport après fermeture d'un overlay mobile. */
export function resetViewportAfterOverlay(): void {
  window.scrollTo(0, 0);
  syncViewportVars();
  requestAnimationFrame(syncViewportVars);
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
  window.visualViewport?.addEventListener("scroll", scheduleSync, { passive: true });

  return () => {
    window.removeEventListener("resize", scheduleSync);
    window.removeEventListener("orientationchange", scheduleSync);
    window.visualViewport?.removeEventListener("resize", scheduleSync);
    window.visualViewport?.removeEventListener("scroll", scheduleSync);
    if (rafId) cancelAnimationFrame(rafId);
    initialized = false;
  };
}
