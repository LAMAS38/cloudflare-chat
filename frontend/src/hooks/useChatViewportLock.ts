import { useEffect } from "react";
import { resetViewportAfterOverlay } from "../lib/viewport";

const MOBILE_MEDIA = "(max-width: 767px)";

/** Empêche le scroll parasite iOS Safari quand le clavier est ouvert dans un salon. */
export function useChatViewportLock(active: boolean) {
  useEffect(() => {
    if (!active || !window.matchMedia(MOBILE_MEDIA).matches) return;

    const html = document.documentElement;
    html.classList.add("chat-page");

    const anchorScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    anchorScroll();
    window.visualViewport?.addEventListener("scroll", anchorScroll, { passive: true });
    window.visualViewport?.addEventListener("resize", anchorScroll, { passive: true });

    return () => {
      html.classList.remove("chat-page");
      window.visualViewport?.removeEventListener("scroll", anchorScroll);
      window.visualViewport?.removeEventListener("resize", anchorScroll);
      resetViewportAfterOverlay();
    };
  }, [active]);
}
