import { X } from "lucide-react";
import { AppIcon } from "./ui/icon";

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export function ErrorBanner({ message, onDismiss, onRetry }: ErrorBannerProps) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-3 border-b border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm text-rose-200"
      role="alert"
    >
      <span className="text-center">{message}</span>
      <div className="flex gap-2">
        {onRetry && (
          <button type="button" onClick={onRetry} className="btn-ghost rounded-lg px-3 py-1 text-xs text-rose-100">
            Réessayer
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="btn-ghost btn-icon min-h-[36px] min-w-[36px] text-rose-100/70"
            aria-label="Fermer l'alerte"
          >
            <AppIcon icon={X} size="sm" />
          </button>
        )}
      </div>
    </div>
  );
}
