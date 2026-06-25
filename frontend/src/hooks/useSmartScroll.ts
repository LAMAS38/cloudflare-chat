import { useCallback, useEffect, useRef, useState } from "react";

const NEAR_BOTTOM_THRESHOLD = 96;

export function useSmartScroll(messageCount: number) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const [showScrollFab, setShowScrollFab] = useState(false);

  const updateNearBottom = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    const near = distance < NEAR_BOTTOM_THRESHOLD;
    isNearBottomRef.current = near;
    setShowScrollFab(!near && messageCount > 0);
  }, [messageCount]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const el = containerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior });
    } else {
      bottomRef.current?.scrollIntoView({ behavior, block: "end" });
    }
    isNearBottomRef.current = true;
    setShowScrollFab(false);
  }, []);

  useEffect(() => {
    if (messageCount === 0) {
      setShowScrollFab(false);
      return;
    }
    if (isNearBottomRef.current) {
      scrollToBottom(messageCount === 1 ? "auto" : "smooth");
    } else {
      setShowScrollFab(true);
    }
  }, [messageCount, scrollToBottom]);

  return {
    containerRef,
    bottomRef,
    onScroll: updateNearBottom,
    showScrollFab,
    scrollToBottom,
  };
}
