import { motion } from "framer-motion";
import type { ConnectionStatus as Status } from "../hooks/useChatWebSocket";
import { springSnappy } from "../lib/motion";

interface ConnectionStatusProps {
  status: Status;
  className?: string;
}

export const statusDotClass: Record<Status, string> = {
  connected: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]",
  connecting: "bg-amber-400 animate-pulse",
  reconnecting: "bg-amber-400 animate-pulse",
  disconnected: "bg-red-400",
};

const statusConfig: Record<
  Status,
  { label: string; shortLabel: string; pill: string }
> = {
  connected: {
    label: "En direct",
    shortLabel: "Direct",
    pill: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
  },
  connecting: {
    label: "Connexion…",
    shortLabel: "…",
    pill: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
  },
  reconnecting: {
    label: "Reconnexion…",
    shortLabel: "…",
    pill: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
  },
  disconnected: {
    label: "Hors ligne",
    shortLabel: "Hors",
    pill: "bg-red-500/10 text-red-300 ring-red-400/20",
  },
};

export function ConnectionStatus({ status, className = "" }: ConnectionStatusProps) {
  const config = statusConfig[status];

  return (
    <div
      className={`flex shrink-0 items-center ${className}`}
      role="status"
      aria-live="polite"
      aria-label={config.label}
    >
      <motion.span
        key={status}
        className={`inline-flex min-h-[36px] items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${config.pill}`}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springSnappy}
      >
        <motion.span
          className={`h-2 w-2 shrink-0 rounded-full ${statusDotClass[status]}`}
          aria-hidden
          animate={status === "connected" ? { scale: [1, 1.15, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="hidden lg:inline">{config.label}</span>
        <span className="hidden md:inline lg:hidden">{config.shortLabel}</span>
        <span className="md:hidden">{config.shortLabel}</span>
      </motion.span>
    </div>
  );
}
