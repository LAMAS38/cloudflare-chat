import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { springSnappy } from "../lib/motion";
import { AppIcon } from "./ui/icon";

interface ScrollToBottomFabProps {
  onClick: () => void;
  label?: string;
}

export function ScrollToBottomFab({ onClick, label = "Nouveaux messages" }: ScrollToBottomFabProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="absolute bottom-6 left-1/2 z-10 flex min-h-[44px] -translate-x-1/2 items-center gap-2 rounded-full border border-violet-400/30 bg-[#14141c]/95 px-4 py-2 text-xs font-medium text-violet-200 shadow-lg backdrop-blur-md"
      aria-label={label}
      initial={{ opacity: 0, y: 16, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.92 }}
      transition={springSnappy}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.96 }}
    >
      <motion.span
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <AppIcon icon={ChevronDown} size="sm" />
      </motion.span>
      {label}
    </motion.button>
  );
}
