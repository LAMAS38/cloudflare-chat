import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearDraft,
  getDraftRecord,
  setDraftRecord,
  type DraftSelection,
} from "../lib/drafts";

const DRAFT_SAVE_MS = 500;
const SAVED_FLASH_MS = 1600;

type SaveState = "idle" | "saved";

export function useComposeDraft(slug: string) {
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [showRestored, setShowRestored] = useState(false);
  const lastPersistedRef = useRef<string | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const flashTimerRef = useRef<number | null>(null);

  const loadDraft = useCallback((): { content: string; selection: DraftSelection } => {
    const record = getDraftRecord(slug);
    lastPersistedRef.current = record.content.trim() ? record.content : null;
    if (record.content.trim()) {
      setShowRestored(true);
      window.setTimeout(() => setShowRestored(false), 2400);
    }
    return record;
  }, [slug]);

  const persistDraft = useCallback(
    (content: string, selection: DraftSelection) => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }

      saveTimerRef.current = window.setTimeout(() => {
        const trimmed = content.trim();
        if (!trimmed) {
          if (lastPersistedRef.current !== null) {
            clearDraft(slug);
            lastPersistedRef.current = null;
          }
          setSaveState("idle");
          return;
        }

        if (lastPersistedRef.current === content) return;

        setDraftRecord(slug, content, selection);
        lastPersistedRef.current = content;
        setSaveState("saved");

        if (flashTimerRef.current !== null) {
          window.clearTimeout(flashTimerRef.current);
        }
        flashTimerRef.current = window.setTimeout(() => {
          setSaveState("idle");
        }, SAVED_FLASH_MS);
      }, DRAFT_SAVE_MS);
    },
    [slug],
  );

  const discardDraft = useCallback(() => {
    clearDraft(slug);
    lastPersistedRef.current = null;
    setSaveState("idle");
    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
    }
  }, [slug]);

  const flushDraft = useCallback(
    (content: string, selection: DraftSelection) => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
      if (content.trim()) {
        setDraftRecord(slug, content, selection);
        lastPersistedRef.current = content;
      } else {
        discardDraft();
      }
    },
    [slug, discardDraft],
  );

  useEffect(() => {
    return () => {
      if (saveTimerRef.current !== null) window.clearTimeout(saveTimerRef.current);
      if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current);
    };
  }, [slug]);

  const resetUi = useCallback(() => {
    setSaveState("idle");
    setShowRestored(false);
  }, []);

  return {
    loadDraft,
    persistDraft,
    discardDraft,
    flushDraft,
    saveState,
    showRestored,
    resetUi,
  };
}
