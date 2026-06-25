import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

interface MessageInputProps {
  disabled: boolean;
  onSend: (content: string) => boolean;
  onTyping: (isTyping: boolean) => void;
}

const TYPING_DEBOUNCE_MS = 300;
const MAX_LENGTH = 2000;
const MIN_TEXTAREA_HEIGHT = 48;
const MAX_TEXTAREA_HEIGHT = 160;

export function MessageInput({ disabled, onSend, onTyping }: MessageInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<number | null>(null);
  const isTypingRef = useRef(false);

  const stopTyping = () => {
    if (typingTimerRef.current !== null) {
      window.clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    if (isTypingRef.current) {
      isTypingRef.current = false;
      onTyping(false);
    }
  };

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(MAX_TEXTAREA_HEIGHT, Math.max(MIN_TEXTAREA_HEIGHT, el.scrollHeight));
    el.style.height = `${next}px`;
  };

  useEffect(() => () => stopTyping(), []);

  useEffect(() => {
    resizeTextarea();
  }, [value]);

  useEffect(() => {
    if (disabled) return;
    const id = window.requestAnimationFrame(() => {
      textareaRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(id);
  }, [disabled]);

  const handleChange = (next: string) => {
    if (next.length > MAX_LENGTH) return;
    setValue(next);

    if (!next.trim()) {
      stopTyping();
      return;
    }

    if (!isTypingRef.current) {
      isTypingRef.current = true;
      onTyping(true);
    }

    if (typingTimerRef.current !== null) {
      window.clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = window.setTimeout(stopTyping, TYPING_DEBOUNCE_MS);
  };

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    const sent = onSend(trimmed);
    if (sent) {
      setValue("");
      stopTyping();
      requestAnimationFrame(resizeTextarea);
    }
  };

  const nearLimit = value.length > MAX_LENGTH * 0.9;

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        submit();
      }}
      className="safe-bottom shrink-0 border-t border-white/[0.06] bg-[#0a0a10]/95 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-4"
    >
      <div className="flex items-end gap-2 sm:gap-3">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="chat-input" className="sr-only">
            Votre message
          </label>
          <textarea
            id="chat-input"
            ref={textareaRef}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            disabled={disabled}
            rows={1}
            placeholder={disabled ? "Connexion en cours…" : "Écrivez un message…"}
            className="input-field w-full resize-none py-3 pr-14 leading-relaxed"
            style={{ minHeight: MIN_TEXTAREA_HEIGHT, maxHeight: MAX_TEXTAREA_HEIGHT }}
            aria-describedby="chat-input-hint"
          />
          <span
            className={`pointer-events-none absolute bottom-2.5 right-3 text-[10px] tabular-nums ${
              nearLimit ? "text-amber-400/80" : "text-white/20"
            }`}
            aria-hidden
          >
            {value.length}/{MAX_LENGTH}
          </span>
        </div>
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="btn-primary min-h-[48px] min-w-[48px] shrink-0 px-4 sm:min-w-0 sm:px-5"
          aria-label="Envoyer le message"
        >
          <span className="hidden sm:inline">Envoyer</span>
          <span className="text-lg sm:hidden" aria-hidden>
            ↑
          </span>
        </button>
      </div>
      <p id="chat-input-hint" className="mt-2 hidden text-[10px] text-white/25 sm:block">
        Entrée pour envoyer · Maj+Entrée pour un saut de ligne
      </p>
    </form>
  );
}
