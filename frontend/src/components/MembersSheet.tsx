import { useEffect, useRef } from "react";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { UserList } from "./UserList";

interface MembersSheetProps {
  open: boolean;
  onClose: () => void;
  usernames: string[];
  currentUsername: string;
}

export function MembersSheet({ open, onClose, usernames, currentUsername }: MembersSheetProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useBodyScrollLock(open);

  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Membres en ligne">
      <button
        type="button"
        className="absolute inset-0 bg-[#08080c]/70 backdrop-blur-sm"
        aria-label="Fermer"
        onClick={onClose}
      />
      <div className="sheet-enter absolute inset-x-0 bottom-0 max-h-[70dvh] rounded-t-2xl border border-white/[0.08] bg-[#0e0e14] shadow-2xl">
        <div className="flex justify-center py-3">
          <span className="h-1 w-10 rounded-full bg-white/15" aria-hidden />
        </div>
        <div className="flex items-center justify-between border-b border-white/[0.06] px-5 pb-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/40">En ligne</p>
            <p className="text-base font-semibold text-white">
              {usernames.length} membre{usernames.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="btn-ghost min-h-[44px] min-w-[44px] rounded-xl"
            aria-label="Fermer la liste"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
          <UserList usernames={usernames} currentUsername={currentUsername} compact />
        </div>
      </div>
    </div>
  );
}
