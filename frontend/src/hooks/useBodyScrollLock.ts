import { useEffect } from "react";
import { syncViewportVars } from "../lib/viewport";

let lockCount = 0;

function resetMobileViewport(): void {
  window.scrollTo(0, 0);
  syncViewportVars();
  requestAnimationFrame(() => {
    window.scrollTo(0, 0);
    syncViewportVars();
  });
}

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    lockCount += 1;
    const html = document.documentElement;
    const body = document.body;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = html.style.overflow;

    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        body.style.overflow = prevBodyOverflow;
        html.style.overflow = prevHtmlOverflow;
        resetMobileViewport();
      }
    };
  }, [locked]);
}

export function releaseScrollLockViewport(): void {
  resetMobileViewport();
}
