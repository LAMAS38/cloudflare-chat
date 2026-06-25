interface ScrollToBottomFabProps {
  visible: boolean;
  onClick: () => void;
  label?: string;
}

export function ScrollToBottomFab({ visible, onClick, label = "Nouveaux messages" }: ScrollToBottomFabProps) {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="fab-enter absolute bottom-4 left-1/2 z-10 flex min-h-[44px] -translate-x-1/2 items-center gap-2 rounded-full border border-violet-400/30 bg-[#14141c]/95 px-4 py-2 text-xs font-medium text-violet-200 shadow-lg backdrop-blur-md transition hover:bg-violet-500/20"
      aria-label={label}
    >
      <span aria-hidden>↓</span>
      {label}
    </button>
  );
}
