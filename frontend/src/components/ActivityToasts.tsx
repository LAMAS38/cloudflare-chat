import { AnimatePresence, motion } from "framer-motion";
import { UserMinus, UserPlus } from "lucide-react";
import type { ActivityToast } from "../hooks/useChatWebSocket";
import { springSnappy } from "../lib/motion";
import { AppIcon } from "./ui/icon";

interface ActivityToastsProps {
  toasts: ActivityToast[];
}

export function ActivityToasts({ toasts }: ActivityToastsProps) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-3 z-30 flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4"
      aria-live="polite"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            className="mx-auto flex items-center gap-2 rounded-full border border-white/[0.08] bg-[#12121a]/95 px-4 py-2 text-xs text-white/80 shadow-xl backdrop-blur-md"
            initial={{ opacity: 0, y: -16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={springSnappy}
          >
            <AppIcon
              icon={toast.kind === "join" ? UserPlus : UserMinus}
              size="sm"
              className={toast.kind === "join" ? "text-emerald-400" : "text-white/45"}
              aria-hidden
            />
            <span>
              <strong className="font-medium text-white">{toast.username}</strong>
              {toast.kind === "join" ? " a rejoint le salon" : " a quitté le salon"}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
