import { AnimatePresence, motion } from "framer-motion";
import { fadeUp } from "../lib/motion";

interface TypingIndicatorProps {
  usernames: string[];
  currentUsername: string;
}

function formatTyping(usernames: string[]): string {
  const others = usernames.filter((name) => name.length > 0);
  if (others.length === 0) return "";
  if (others.length === 1) return `${others[0]} écrit`;
  if (others.length === 2) return `${others[0]} et ${others[1]} écrivent`;
  return `${others[0]} et ${others.length - 1} autres écrivent`;
}

export function TypingIndicator({ usernames, currentUsername }: TypingIndicatorProps) {
  const label = formatTyping(usernames.filter((name) => name !== currentUsername));
  const visible = label.length > 0;

  return (
    <div className="h-6 overflow-hidden">
      <AnimatePresence mode="wait">
        {visible ? (
          <motion.p
            key={label}
            className="flex h-6 items-center gap-2 text-xs italic text-white/35"
            aria-live="polite"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <span className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="typing-dot h-1 w-1 rounded-full bg-violet-400"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </span>
            {label}…
          </motion.p>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-6" />
        )}
      </AnimatePresence>
    </div>
  );
}
