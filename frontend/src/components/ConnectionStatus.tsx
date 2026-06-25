import type { ConnectionStatus as Status } from "../hooks/useChatWebSocket";

interface ConnectionStatusProps {
  count: number;
  status: Status;
}

const statusConfig: Record<Status, { label: string; dot: string; pill: string }> = {
  connected: {
    label: "En direct",
    dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]",
    pill: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
  },
  connecting: {
    label: "Connexion…",
    dot: "bg-amber-400 animate-pulse",
    pill: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
  },
  reconnecting: {
    label: "Reconnexion…",
    dot: "bg-amber-400 animate-pulse",
    pill: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
  },
  disconnected: {
    label: "Hors ligne",
    dot: "bg-red-400",
    pill: "bg-red-500/10 text-red-300 ring-red-400/20",
  },
};

export function ConnectionStatus({ count, status }: ConnectionStatusProps) {
  const config = statusConfig[status];

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1.5 ring-1 ring-white/[0.06]">
        <span className={`h-2 w-2 rounded-full ${config.dot}`} />
        <span className="text-white/70">{count}</span>
      </span>
      <span className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 ${config.pill}`}>
        {config.label}
      </span>
    </div>
  );
}
