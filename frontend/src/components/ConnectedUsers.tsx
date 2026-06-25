import { UserList } from "./UserList";

interface ConnectedUsersProps {
  usernames: string[];
  currentUsername: string;
}

export function ConnectedUsers({ usernames, currentUsername }: ConnectedUsersProps) {
  return (
    <aside
      className="hidden w-60 shrink-0 flex-col border-l border-white/[0.06] bg-white/[0.02] lg:flex"
      aria-label="Membres en ligne"
    >
      <div className="border-b border-white/[0.06] px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-widest text-white/40">En ligne</p>
        <p className="mt-0.5 text-sm font-semibold text-white">
          {usernames.length} membre{usernames.length !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <UserList usernames={usernames} currentUsername={currentUsername} />
      </div>
    </aside>
  );
}
