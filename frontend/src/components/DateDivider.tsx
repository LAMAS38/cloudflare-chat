import { motion } from "framer-motion";
import { fadeUp } from "../lib/motion";

interface DateDividerProps {
  label: string;
}

export function DateDivider({ label }: DateDividerProps) {
  return (
    <motion.div
      className="flex items-center gap-3 py-2"
      role="separator"
      variants={fadeUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-20px" }}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.08]" />
      <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/50">
        {label}
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.08]" />
    </motion.div>
  );
}
