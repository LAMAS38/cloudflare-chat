import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { validateSlug, validateUsername } from "@shared/slug";
import { useChatWebSocket } from "../hooks/useChatWebSocket";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import {
  clearStoredUsername,
  getStoredUsername,
  setStoredUsername,
} from "../lib/username";
import { ConnectedUsers } from "./ConnectedUsers";
import { ConnectionStatus } from "./ConnectionStatus";
import { ErrorBanner } from "./ErrorBanner";
import { MembersSheet } from "./MembersSheet";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { TypingIndicator } from "./TypingIndicator";
import { UsernameModal } from "./UsernameModal";

function CopyRoomLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}/r/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copiez le lien du salon :", url);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="btn-ghost hidden min-h-[36px] rounded-lg px-2.5 text-[11px] text-white/50 sm:inline-flex"
      aria-live="polite"
    >
      {copied ? "Copié ✓" : "Partager"}
    </button>
  );
}

export function ChatLayout() {
  const { slug: rawSlug = "" } = useParams<{ slug: string }>();
  const slugValidation = useMemo(() => validateSlug(rawSlug), [rawSlug]);
  const slug = slugValidation.valid ? slugValidation.slug! : rawSlug;
  const [membersOpen, setMembersOpen] = useState(false);
  const [errorDismissed, setErrorDismissed] = useState(false);

  const [username, setUsername] = useState<string | null>(() => {
    const stored = getStoredUsername();
    if (!stored) return null;
    const validation = validateUsername(stored);
    if (!validation.valid || !validation.username) {
      clearStoredUsername();
      return null;
    }
    return validation.username;
  });

  const chatEnabled = slugValidation.valid && username !== null;

  const {
    messages,
    userCount,
    connectedUsers,
    typingUsers,
    connectionStatus,
    error,
    sendMessage,
    setTyping,
    dismissError,
    reconnect,
  } = useChatWebSocket({ slug, username, enabled: chatEnabled });

  useDocumentTitle(
    slugValidation.valid ? `#${slug} · PulseChat` : "PulseChat",
  );

  const isLoadingHistory =
    chatEnabled &&
    messages.length === 0 &&
    (connectionStatus === "connecting" || connectionStatus === "reconnecting");

  const showError = error && !errorDismissed;

  useEffect(() => {
    if (error) setErrorDismissed(false);
  }, [error]);

  const handleUsernameSubmit = (nextUsername: string) => {
    setStoredUsername(nextUsername);
    setUsername(nextUsername);
  };

  const handleDismissError = () => {
    setErrorDismissed(true);
    dismissError();
  };

  const handleRetry = () => {
    setErrorDismissed(false);
    reconnect();
  };

  if (!slugValidation.valid) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center p-6">
        <div className="glass-card max-w-md p-8 text-center">
          <p className="text-4xl" aria-hidden>
            🚫
          </p>
          <h1 className="mt-4 font-display text-xl font-semibold text-white">Salon introuvable</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/45">
            Le slug doit contenir 3 à 32 caractères (a-z, 0-9, tirets).
          </p>
          <Link to="/" className="btn-primary mt-6 inline-flex min-h-[44px] items-center">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden">
      {!username && <UsernameModal slug={slug} onSubmit={handleUsernameSubmit} />}

      <header className="safe-top z-20 flex shrink-0 items-center justify-between gap-2 border-b border-white/[0.06] bg-[#0a0a10]/90 px-3 py-2.5 backdrop-blur-xl sm:gap-4 sm:px-5 sm:py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Link
            to="/"
            className="btn-ghost flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-sm text-white/50"
            aria-label="Retour à l'accueil"
          >
            ←
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[10px] font-medium uppercase tracking-widest text-white/35">
              Salon
            </p>
            <h1 className="truncate font-display text-base font-bold text-white sm:text-lg">
              <span className="text-violet-400">#</span>
              {slug}
            </h1>
          </div>
          <CopyRoomLink slug={slug} />
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMembersOpen(true)}
            className="btn-ghost flex min-h-[44px] items-center gap-1.5 rounded-xl px-2.5 text-xs text-white/60 lg:hidden"
            aria-label={`${userCount} membres en ligne, ouvrir la liste`}
          >
            <span aria-hidden>👥</span>
            <span className="tabular-nums">{userCount}</span>
          </button>
          <ConnectionStatus count={userCount} status={connectionStatus} compact />
        </div>
      </header>

      {showError && (
        <ErrorBanner
          message={error}
          onDismiss={handleDismissError}
          onRetry={connectionStatus === "disconnected" ? handleRetry : undefined}
        />
      )}

      <div className="flex min-h-0 flex-1">
        <main className="relative flex min-w-0 flex-1 flex-col">
          <MessageList
            messages={messages}
            currentUsername={username ?? ""}
            slug={slug}
            connectionStatus={connectionStatus}
            isLoadingHistory={isLoadingHistory}
          />
          <div className="shrink-0 border-t border-white/[0.04] bg-[#0a0a10]/50 px-3 pt-1.5 sm:px-6">
            <TypingIndicator usernames={typingUsers} currentUsername={username ?? ""} />
          </div>
          <MessageInput
            disabled={!chatEnabled || connectionStatus !== "connected"}
            onSend={sendMessage}
            onTyping={setTyping}
          />
        </main>
        <ConnectedUsers usernames={connectedUsers} currentUsername={username ?? ""} />
      </div>

      <MembersSheet
        open={membersOpen}
        onClose={() => setMembersOpen(false)}
        usernames={connectedUsers}
        currentUsername={username ?? ""}
      />
    </div>
  );
}
