import { useEffect, useRef } from "react";
import type { Message } from "../types";
import { Avatar } from "./Avatar";

interface MessageListProps {
  messages: Message[];
  currentUsername: string;
  slug: string;
}

function formatTime(iso: string): string {
  const date = new Date(iso.endsWith("Z") ? iso : `${iso}Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function MessageList({ messages, currentUsername, slug }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <p className="text-3xl">👋</p>
          <p className="mt-3 font-display text-lg font-semibold text-white">
            Bienvenue dans #{slug}
          </p>
          <p className="mt-1 max-w-xs text-sm text-white/40">
            Soyez le premier à briser le silence. Vos messages sont gardés dans le Durable Object
            de ce salon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
      {messages.map((message, index) => {
        const isOwn = message.username === currentUsername;
        const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.username !== message.username);

        return (
          <article
            key={message.id}
            className={`message-enter flex gap-2.5 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
            style={{ animationDelay: `${Math.min(index, 8) * 30}ms` }}
          >
            {!isOwn && (
              <div className="w-9 shrink-0">
                {showAvatar ? <Avatar username={message.username} size="md" /> : null}
              </div>
            )}
            <div className={`max-w-[78%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}>
              {!isOwn && showAvatar && (
                <p className="mb-1 px-1 text-[11px] font-medium text-white/40">{message.username}</p>
              )}
              <div
                className={`rounded-2xl px-4 py-2.5 ${
                  isOwn
                    ? "rounded-br-sm bg-gradient-to-br from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-900/30"
                    : "rounded-bl-sm border border-white/[0.06] bg-white/[0.04] text-white/90"
                }`}
              >
                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                  {message.content}
                </p>
              </div>
              <p className={`mt-1 px-1 text-[10px] text-white/25 ${isOwn ? "text-right" : ""}`}>
                {formatTime(message.createdAt)}
              </p>
            </div>
          </article>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
