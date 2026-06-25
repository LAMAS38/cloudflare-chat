import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { validateSlug, validateUsername } from "@shared/slug";
import { useChatWebSocket } from "../hooks/useChatWebSocket";
import {
  clearStoredUsername,
  getStoredUsername,
  setStoredUsername,
} from "../lib/username";
import { ConnectedUsers } from "./ConnectedUsers";
import { ConnectionStatus } from "./ConnectionStatus";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { TypingIndicator } from "./TypingIndicator";
import { UsernameModal } from "./UsernameModal";

function CopyRoomLink({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const url = `${window.location.origin}/r/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/50 transition hover:border-violet-400/30 hover:text-violet-200"
    >
      {copied ? "Copié ✓" : "Partager le lien"}
    </button>
  );
}

export function ChatLayout() {
  const { slug: rawSlug = "" } = useParams<{ slug: string }>();
  const slugValidation = useMemo(() => validateSlug(rawSlug), [rawSlug]);
  const slug = slugValidation.valid ? slugValidation.slug! : rawSlug;

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
  } = useChatWebSocket({ slug, username, enabled: chatEnabled });

  const handleUsernameSubmit = (nextUsername: string) => {
    setStoredUsername(nextUsername);
    setUsername(nextUsername);
  };

  if (!slugValidation.valid) {
    return (
      <div className="flex min-h-full items-center justify-center p-6">
        <div className="glass-card max-w-md p-8 text-center">
          <p className="text-4xl">🚫</p>
          <h1 className="mt-4 font-display text-xl font-semibold text-white">Salon introuvable</h1>
          <p className="mt-2 text-sm text-white/45">
            Le slug doit contenir 3 à 32 caractères (a-z, 0-9, tirets).
          </p>
          <Link to="/" className="btn-primary mt-6 inline-flex">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col lg:min-h-[100dvh]">
      {!username && <UsernameModal slug={slug} onSubmit={handleUsernameSubmit} />}

      <header className="flex items-center justify-between gap-4 border-b border-white/[0.06] bg-white/[0.02] px-4 py-3 backdrop-blur-xl sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="hidden rounded-lg border border-white/[0.08] px-2 py-1 text-xs text-white/40 transition hover:text-white sm:inline"
          >
            ←
          </Link>
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-widest text-white/35">Salon</p>
            <h1 className="truncate font-display text-lg font-bold text-white">
              <span className="text-violet-400">#</span>
              {slug}
            </h1>
          </div>
          <CopyRoomLink slug={slug} />
        </div>
        <ConnectionStatus count={userCount} status={connectionStatus} />
      </header>

      {error && (
        <div className="border-b border-rose-500/20 bg-rose-500/10 px-4 py-2 text-center text-sm text-rose-300">
          {error}
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <main className="flex min-w-0 flex-1 flex-col">
          <MessageList messages={messages} currentUsername={username ?? ""} slug={slug} />
          <div className="border-t border-white/[0.06] bg-white/[0.02] px-4 pt-2 sm:px-6">
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
    </div>
  );
}
