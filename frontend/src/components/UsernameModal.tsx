import { useState, type FormEvent } from "react";
import { validateUsername } from "@shared/slug";
import { Avatar } from "./Avatar";

interface UsernameModalProps {
  slug: string;
  onSubmit: (username: string) => void;
}

export function UsernameModal({ slug, onSubmit }: UsernameModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#08080c]/90 p-4 backdrop-blur-md">
      <div className="glass-card w-full max-w-md p-6 sm:p-8">
        <p className="text-[11px] font-medium uppercase tracking-widest text-violet-300/70">
          Rejoindre #{slug}
        </p>
        <h2 className="mt-2 font-display text-2xl font-bold text-white">Comment vous appelle-t-on ?</h2>
        <p className="mt-2 text-sm text-white/40">
          Votre pseudo est visible par les autres membres du salon.
        </p>

        <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <Avatar username={canPreview ? validation.username! : preview} size="lg" ring />
          <div>
            <p className="font-semibold text-white">{canPreview ? validation.username : preview}</p>
            <p className="text-xs text-white/35">Aperçu de votre profil</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            placeholder="Ex. Latifa, DevQueen…"
            autoFocus
            maxLength={24}
            className="input-field w-full"
          />
          {error && <p className="text-sm text-rose-400">{error}</p>}
          <button type="submit" className="btn-primary w-full py-3.5">
            Entrer dans le salon
          </button>
        </form>
      </div>
    </div>
  );
}
