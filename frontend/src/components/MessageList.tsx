import { useSmartScroll } from "../hooks/useSmartScroll";
import type { ConnectionStatus as Status } from "../hooks/useChatWebSocket";
import type { Message } from "../types";
import { ChatSkeleton } from "./ChatSkeleton";
import { MessageBubble } from "./MessageBubble";
import { ScrollToBottomFab } from "./ScrollToBottomFab";

interface MessageListProps {
  messages: Message[];
  currentUsername: string;
  slug: string;
  connectionStatus: Status;
  isLoadingHistory: boolean;
}

export function MessageList({
  messages,
  currentUsername,
  slug,
  connectionStatus,
  isLoadingHistory,
}: MessageListProps) {
  const { containerRef, bottomRef, onScroll, showScrollFab, scrollToBottom } = useSmartScroll(
    messages.length,
  );

  if (isLoadingHistory) {
    return <ChatSkeleton />;
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
          <p className="text-3xl" aria-hidden>
            👋
          </p>
          <h2 className="mt-3 font-display text-lg font-semibold text-white">Bienvenue dans #{slug}</h2>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/40">
            {connectionStatus === "connected"
              ? "Soyez le premier à écrire — votre message sera gardé dans ce salon."
              : "Connexion au salon en cours…"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={containerRef}
        onScroll={onScroll}
        className="chat-scroll absolute inset-0 space-y-3 overflow-y-auto overscroll-contain px-3 py-4 sm:space-y-4 sm:px-6 sm:py-5"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        aria-label="Messages du salon"
      >
        {messages.map((message, index) => {
          const isOwn = message.username === currentUsername;
          const showAvatar =
            !isOwn && (index === 0 || messages[index - 1]?.username !== message.username);

          return (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={isOwn}
              showAvatar={showAvatar}
            />
          );
        })}
        <div ref={bottomRef} className="h-px shrink-0" aria-hidden />
      </div>
      <ScrollToBottomFab visible={showScrollFab} onClick={() => scrollToBottom()} />
    </div>
  );
}
