import { Avatar } from "./Avatar";

interface ConnectedUsersProps {
  usernames: string[];
  currentUsername: string;
}

export function ConnectedUsers({ usernames, currentUsername }: ConnectedUsersProps) {
  const sorted = [...usernames].sort((a, b) => a.localeCompare(b, "fr"));

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-l border-white/[0.06] bg-white/[0.02] lg:flex">
      <div className="border-b border-white/[0.06] px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-widest text-white/40">En ligne</p>
        <p className="mt-0.5 text-sm font-semibold text-white">{sorted.length} membre{sorted.length !== 1 ? "s" : ""}</p>
      </div>
      <ul className="flex-1 space-y-1 overflow-y-auto p-3">
        {sorted.length === 0 && (
          <li className="px-2 py-4 text-center text-xs text-white/30">En attente de visiteurs…</li>
        )}
        {sorted.map((name) => {
          const isYou = name === currentUsername;
          return (
            <li
              key={name}
              className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 ${isYou ? "bg-violet-500/10 ring-1 ring-violet-400/20" : "hover:bg-white/[0.03]"}`}
            >
              <Avatar username={name} size="sm" />
              <span className="min-w-0 flex-1 truncate text-sm text-white/90">
                {name}
                {isYou && <span className="ml-1 text-[10px] text-violet-300">(vous)</span>}
              </span>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
