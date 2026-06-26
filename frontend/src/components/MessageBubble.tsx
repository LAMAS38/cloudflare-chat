import { memo } from "react";
import { motion } from "framer-motion";
import type { Message } from "../types";
import { springSnappy } from "../lib/motion";
import { Avatar } from "./Avatar";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  animate?: boolean;
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
  animate = false,
}: MessageBubbleProps) {
  return (
    <motion.article
      className={`flex gap-2.5 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
      aria-label={`Message de ${message.username}`}
      initial={animate ? { opacity: 0, y: 10, scale: 0.98 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={springSnappy}
      layout="position"
    >
      {!isOwn && (
        <div className="w-9 shrink-0 pt-0.5">
          {showAvatar ? (
            <motion.div
              initial={animate ? { scale: 0.8, opacity: 0 } : false}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ...springSnappy, delay: 0.04 }}
            >
              <Avatar username={message.username} size="md" />
            </motion.div>
          ) : null}
        </div>
      )}
      <div className={`flex max-w-[min(88%,16rem)] flex-col sm:max-w-[min(82%,18rem)] md:max-w-[min(75%,22rem)] lg:max-w-md ${isOwn ? "items-end" : "items-start"}`}>
        {!isOwn && showAvatar && (
          <p className="mb-1 px-1 text-[11px] font-medium text-white/40">{message.username}</p>
        )}
        <motion.div
          className={`rounded-2xl px-4 py-2.5 ${
            isOwn
              ? "bubble-own rounded-br-sm text-white"
              : "rounded-bl-sm border border-white/[0.06] bg-white/[0.06] text-white"
          }`}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <p className="whitespace-pre-wrap break-words text-[15px] leading-relaxed text-white sm:text-[15px]">
            {message.content}
          </p>
        </motion.div>
        <time
          className={`mt-1.5 px-1 text-[11px] text-white/45 ${isOwn ? "text-right" : ""}`}
          dateTime={message.createdAt}
        >
          {formatTime(message.createdAt)}
        </time>
      </div>
    </motion.article>
  );
});
