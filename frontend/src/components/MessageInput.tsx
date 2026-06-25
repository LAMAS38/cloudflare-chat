import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

interface MessageInputProps {
  disabled: boolean;
  onSend: (content: string) => boolean;
  onTyping: (isTyping: boolean) => void;
}

const TYPING_DEBOUNCE_MS = 300;
const MAX_LENGTH = 2000;

export function MessageInput({ disabled, onSend, onTyping }: MessageInputProps) {
  const [value, setValue] = useState("");
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

  useEffect(() => () => stopTyping(), []);

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
    }
  };

  return (
    <form
      onSubmit={(e: FormEvent) => {
        e.preventDefault();
        submit();
      }}
      className="border-t border-white/[0.06] bg-white/[0.02] p-4 sm:px-6"
    >
      <div className="flex gap-3">
        <div className="relative flex-1">
          <textarea
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            disabled={disabled}
            rows={2}
            placeholder={disabled ? "Connexion en cours…" : "Votre message…"}
            className="input-field min-h-[52px] w-full resize-none py-3"
          />
          <span className="pointer-events-none absolute bottom-2 right-3 text-[10px] text-white/20">
            {value.length}/{MAX_LENGTH}
          </span>
        </div>
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="btn-primary self-end px-5"
        >
          <span className="hidden sm:inline">Envoyer</span>
          <span className="sm:hidden">↑</span>
        </button>
      </div>
      <p className="mt-2 hidden text-[10px] text-white/20 sm:block">
        Entrée pour envoyer · Maj+Entrée pour un saut de ligne
      </p>
    </form>
  );
}
