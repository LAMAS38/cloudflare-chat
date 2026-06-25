import { memo } from "react";
import type { Message } from "../types";
import { Avatar } from "./Avatar";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
}

function formatTime(iso: string): string {
  const date = new Date(iso.endsWith("Z") ? iso : `${iso}Z`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export const MessageBubble = memo(function MessageBubble({
  message,
  isOwn,
  showAvatar,
}: MessageBubbleProps) {
  return (
    <article
      className={`message-enter flex gap-2.5 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
      aria-label={`Message de ${message.username}`}
    >
      {!isOwn && (
        <div className="w-9 shrink-0 pt-0.5">
          {showAvatar ? <Avatar username={message.username} size="md" /> : null}
        </div>
      )}
      <div className={`flex max-w-[min(78%,20rem)] flex-col ${isOwn ? "items-end" : "items-start"}`}>
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
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed sm:text-sm">
            {message.content}
          </p>
        </div>
        <time
          className={`mt-1 px-1 text-[10px] text-white/25 ${isOwn ? "text-right" : ""}`}
          dateTime={message.createdAt}
        >
          {formatTime(message.createdAt)}
        </time>
      </div>
    </article>
  );
});
