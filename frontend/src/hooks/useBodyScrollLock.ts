import { useEffect } from "react";
import { resetViewportAfterOverlay, syncViewportVars } from "../lib/viewport";

let lockCount = 0;
let lockedScrollY = 0;

function unlockBodyScroll(): void {
  const html = document.documentElement;
  const body = document.body;

  body.style.position = "";
  body.style.top = "";
  body.style.left = "";
  body.style.right = "";
  body.style.width = "";
  body.style.overflow = "";
  html.style.overflow = "";

  window.scrollTo(0, lockedScrollY);
  resetViewportAfterOverlay();
}

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    lockCount += 1;
    const html = document.documentElement;
    const body = document.body;

    lockedScrollY = window.scrollY;
    body.style.position = "fixed";
    body.style.top = `-${lockedScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        unlockBodyScroll();
      }
    };
  }, [locked]);
}

export function releaseScrollLockViewport(): void {
  syncViewportVars();
  resetViewportAfterOverlay();
}
