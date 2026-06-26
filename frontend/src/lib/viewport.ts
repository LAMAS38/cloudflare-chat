/** Sync CSS viewport vars from Visual Viewport API (mobile URL bar, clavier, rotation). */

let initialized = false;
let rafId = 0;

function isTextInputFocused(): boolean {
  const el = document.activeElement;
  if (!el || !(el instanceof HTMLElement)) return false;
  return el.matches('input:not([type="hidden"]), textarea, select, [contenteditable="true"]');
}

export function syncViewportVars(): void {
  const root = document.documentElement;
  const vv = window.visualViewport;
  const layoutHeight = window.innerHeight;
  const layoutWidth = window.innerWidth;
  const visualHeight = vv?.height ?? layoutHeight;
  const visualWidth = vv?.width ?? layoutWidth;
  const offsetTop = vv?.offsetTop ?? 0;
  const offsetLeft = vv?.offsetLeft ?? 0;
  const keyboardOffset = Math.max(0, layoutHeight - visualHeight - offsetTop);
  const keyboardOpen = isTextInputFocused() && keyboardOffset > 80;

  root.style.setProperty("--vh", `${(keyboardOpen ? visualHeight : layoutHeight) * 0.01}px`);
  root.style.setProperty("--vw", `${visualWidth * 0.01}px`);
  root.style.setProperty("--layout-height", `${layoutHeight}px`);
  root.style.setProperty("--layout-width", `${layoutWidth}px`);
  root.style.setProperty("--app-height", `${keyboardOpen ? visualHeight : layoutHeight}px`);
  root.style.setProperty("--app-width", `${visualWidth}px`);
  root.style.setProperty("--viewport-offset-top", keyboardOpen ? `${offsetTop}px` : "0px");
  root.style.setProperty("--viewport-offset-left", keyboardOpen ? `${offsetLeft}px` : "0px");
  root.style.setProperty("--keyboard-offset", `${keyboardOpen ? keyboardOffset : 0}px`);
  root.dataset.keyboardOpen = keyboardOpen ? "true" : "false";
}

/** Réinitialise le viewport après fermeture d'un overlay mobile. */
export function resetViewportAfterOverlay(): void {
  const root = document.documentElement;
  root.dataset.keyboardOpen = "false";
  root.style.setProperty("--viewport-offset-top", "0px");
  root.style.setProperty("--viewport-offset-left", "0px");
  root.style.setProperty("--keyboard-offset", "0px");
  root.style.setProperty("--app-height", `${window.innerHeight}px`);

  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;

  syncViewportVars();
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    syncViewportVars();
  });
  window.setTimeout(syncViewportVars, 100);
  window.setTimeout(syncViewportVars, 300);
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
  document.addEventListener("focusin", scheduleSync, { passive: true });
  document.addEventListener("focusout", scheduleSync, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleSync, { passive: true });
  window.visualViewport?.addEventListener("scroll", scheduleSync, { passive: true });

  return () => {
    window.removeEventListener("resize", scheduleSync);
    window.removeEventListener("orientationchange", scheduleSync);
    document.removeEventListener("focusin", scheduleSync);
    document.removeEventListener("focusout", scheduleSync);
    window.visualViewport?.removeEventListener("resize", scheduleSync);
    window.visualViewport?.removeEventListener("scroll", scheduleSync);
    if (rafId) cancelAnimationFrame(rafId);
    initialized = false;
  };
}
