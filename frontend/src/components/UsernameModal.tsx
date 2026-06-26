import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { validateUsername } from "@shared/slug";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import type { RoomTheme } from "../lib/roomTheme";
import { roomThemeStyle } from "../lib/roomTheme";
import { backdropVariants, scaleIn, springSnappy } from "../lib/motion";
import { Avatar } from "./Avatar";
import { AppIcon } from "./ui/icon";

interface UsernameModalProps {
  slug: string;
  theme: RoomTheme;
  onSubmit: (username: string) => void;
}

export function UsernameModal({ slug, theme, onSubmit }: UsernameModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  useBodyScrollLock(true);

  const preview = value.trim() || "Vous";
  const validation = validateUsername(value);
  const canPreview = validation.valid && validation.username;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!validation.valid || !validation.username) {
      setError("2–24 caractères : lettres, chiffres, espaces, - ou _");
      return;
    }
    onSubmit(validation.username);
  };

  return (
    <motion.div
      className="room-themed fixed inset-0 z-50 flex items-end justify-center bg-[#08080c]/90 p-0 backdrop-blur-md sm:items-center sm:p-4"
      style={roomThemeStyle(theme)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="username-modal-title"
      variants={backdropVariants}
      initial="initial"
      animate="animate"
      exit="initial"
    >
      <motion.div
        className="hero-card hero-card-glow safe-bottom w-full max-w-md rounded-b-none rounded-t-2xl p-6 sm:rounded-2xl sm:p-8"
        variants={scaleIn}
        initial="initial"
        animate="animate"
        exit="exit"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.35 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) {
            /* swipe dismiss disabled — username required */
          }
        }}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/15 sm:hidden" aria-hidden />

        <div className="flex items-start justify-between gap-3">
          <motion.p
            className="flex min-w-0 items-center gap-2 text-[11px] font-medium uppercase tracking-widest text-white/50"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <span>{theme.emoji}</span>
            <span className="truncate">Rejoindre #{slug}</span>
          </motion.p>
          <Link
            to="/"
            className="btn-ghost -mr-1 flex shrink-0 items-center gap-1.5 px-2 py-1.5 text-xs text-white/55"
          >
            <AppIcon icon={ArrowLeft} size="sm" aria-hidden />
            Autre salon
          </Link>
        </div>

        <motion.h2
          id="username-modal-title"
          className="mt-2 font-display text-2xl font-bold text-white"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
        >
          Comment vous appelle-t-on ?
        </motion.h2>
        <p className="mt-2 text-sm leading-relaxed text-white/40">
          Votre pseudo est visible par les autres membres du salon.
        </p>

        <motion.div
          className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
          layout
          transition={springSnappy}
        >
          <motion.div
            key={canPreview ? validation.username : preview}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={springSnappy}
          >
            <Avatar username={canPreview ? validation.username! : preview} size="lg" ring />
          </motion.div>
          <div>
            <p className="font-semibold text-white">{canPreview ? validation.username : preview}</p>
            <p className="text-xs text-white/35">Aperçu de votre profil</p>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="username-input" className="sr-only">
              Pseudo
            </label>
            <input
              id="username-input"
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              placeholder="Ex. Latifa, DevQueen…"
              autoFocus
              autoComplete="nickname"
              enterKeyHint="go"
              maxLength={24}
              className="input-field w-full text-base sm:text-sm"
            />
          </div>
          {error && (
            <motion.p
              className="text-sm text-rose-400"
              role="alert"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              {error}
            </motion.p>
          )}
          <motion.button
            type="submit"
            className="btn-primary flex min-h-[48px] w-full items-center justify-center gap-2 py-3.5"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
          >
            Entrer dans le salon
            <span>{theme.emoji}</span>
            <AppIcon icon={ArrowRight} size="sm" className="opacity-80" aria-hidden />
          </motion.button>
          <Link
            to="/"
            className="btn-ghost flex min-h-[44px] w-full items-center justify-center gap-2 py-2 text-sm text-white/45"
          >
            Choisir un autre salon
          </Link>
        </form>
      </motion.div>
    </motion.div>
  );
}
