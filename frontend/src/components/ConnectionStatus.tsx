import type { ConnectionStatus as Status } from "../hooks/useChatWebSocket";

interface ConnectionStatusProps {
  count: number;
  status: Status;
  compact?: boolean;
}

const statusConfig: Record<
  Status,
  { label: string; shortLabel: string; dot: string; pill: string }
> = {
  connected: {
    label: "En direct",
    shortLabel: "Live",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]",
    pill: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
  },
  connecting: {
    label: "Connexion…",
    shortLabel: "…",
    dot: "bg-amber-400 animate-pulse",
    pill: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
  },
  reconnecting: {
    label: "Reconnexion…",
    shortLabel: "…",
    dot: "bg-amber-400 animate-pulse",
    pill: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
  },
  disconnected: {
    label: "Hors ligne",
    shortLabel: "Off",
    dot: "bg-red-400",
    pill: "bg-red-500/10 text-red-300 ring-red-400/20",
  },
};

export function ConnectionStatus({ count, status, compact = false }: ConnectionStatusProps) {
  const config = statusConfig[status];

  return (
    <div
      className="flex shrink-0 items-center gap-1.5 sm:gap-2"
      role="status"
      aria-live="polite"
      aria-label={`${config.label}, ${count} membre${count !== 1 ? "s" : ""} connecté${count !== 1 ? "s" : ""}`}
    >
      <span className="flex min-h-[36px] items-center gap-1.5 rounded-full bg-white/[0.04] px-2.5 py-1 ring-1 ring-white/[0.06] sm:gap-2 sm:px-3 sm:py-1.5">
        <span className={`h-2 w-2 shrink-0 rounded-full ${config.dot}`} aria-hidden />
        <span className="text-xs text-white/70 sm:text-sm">{count}</span>
      </span>
      <span
        className={`hidden rounded-full px-3 py-1.5 text-xs font-medium ring-1 sm:inline ${config.pill}`}
      >
        {config.label}
      </span>
      {compact && status !== "connected" && (
        <span className={`rounded-full px-2 py-1 text-[10px] font-medium ring-1 sm:hidden ${config.pill}`}>
          {config.shortLabel}
        </span>
      )}
    </div>
  );
}
