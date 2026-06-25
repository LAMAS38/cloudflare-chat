import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { normalizeSlug, validateSlug } from "@shared/slug";

const FEATURED_ROOMS = [
  { slug: "general", label: "Général", emoji: "💬", desc: "Discussions libres" },
  { slug: "dev", label: "Dev", emoji: "⚡", desc: "Code & Cloudflare" },
  { slug: "gaming", label: "Gaming", emoji: "🎮", desc: "Sessions multijoueur" },
  { slug: "random", label: "Random", emoji: "🎲", desc: "Tout et n'importe quoi" },
] as const;

export function HomePage() {
  const navigate = useNavigate();
  const [slugInput, setSlugInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
    const validation = validateSlug(slugInput);
    if (!validation.valid || !validation.slug) {
      setError("3–32 caractères : lettres minuscules, chiffres et tirets.");
      return;
    }
    navigate(`/r/${validation.slug}`);
  };

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-1.5 text-xs font-medium text-violet-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
            Propulsé par Cloudflare Workers
          </div>
          <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl">
            Pulse<span className="text-gradient">Chat</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/50">
            Salons temps réel, une URL par conversation. Chaque salon vit dans son propre
            Durable Object — instantané, isolé, sans serveur à gérer.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8">
          <h2 className="font-display text-lg font-semibold text-white">Créer ou rejoindre un salon</h2>
          <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-white/30">
                /r/
              </span>
              <input
                type="text"
                value={slugInput}
                onChange={(e) => {
                  setSlugInput(normalizeSlug(e.target.value));
                  setError(null);
                }}
                placeholder="mon-salon"
                maxLength={32}
                className="input-field w-full pl-12 font-mono"
              />
            </div>
            <button type="submit" className="btn-primary shrink-0 px-8">
              Entrer →
            </button>
          </form>
          {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}

          <div className="mt-8">
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/35">Salons populaires</p>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {FEATURED_ROOMS.map((room) => (
                <Link
                  key={room.slug}
                  to={`/r/${room.slug}`}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition hover:border-violet-400/30 hover:bg-violet-500/[0.06]"
                >
                  <span className="text-xl">{room.emoji}</span>
                  <p className="mt-1.5 text-sm font-semibold text-white group-hover:text-violet-200">
                    {room.label}
                  </p>
                  <p className="text-[11px] text-white/35">{room.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-[11px] text-white/25">
          {["Workers", "Durable Objects", "WebSocket", "SQLite DO", "Tailwind"].map((tag) => (
            <span key={tag} className="rounded-md border border-white/[0.06] px-2 py-1 font-mono">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
