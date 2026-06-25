import { Avatar } from "./Avatar";

interface UserListProps {
  usernames: string[];
  currentUsername: string;
  compact?: boolean;
}

export function UserList({ usernames, currentUsername, compact = false }: UserListProps) {
  const sorted = [...usernames].sort((a, b) => a.localeCompare(b, "fr"));

  if (sorted.length === 0) {
    return (
      <p className="px-2 py-6 text-center text-xs text-white/30">
        En attente de visiteurs…
      </p>
    );
  }

  return (
    <ul className={`space-y-1 ${compact ? "p-2" : "p-3"}`} role="list">
      {sorted.map((name) => {
        const isYou = name === currentUsername;
        return (
          <li
            key={name}
            className={`flex min-h-[44px] items-center gap-2.5 rounded-xl px-2.5 py-2 ${
              isYou ? "bg-violet-500/10 ring-1 ring-violet-400/20" : "hover:bg-white/[0.03]"
            }`}
          >
            <Avatar username={name} size="sm" />
            <span className="min-w-0 flex-1 truncate text-sm text-white/90">
              {name}
              {isYou && <span className="ml-1 text-[10px] text-violet-300">(vous)</span>}
            </span>
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
              aria-hidden
            />
          </li>
        );
      })}
    </ul>
  );
}
