import type { CSSProperties } from "react";

const ROOM_EMOJIS = ["💬", "⚡", "🎮", "🎲", "🚀", "🌊", "🔥", "✨", "🎯", "🎨", "🌸", "🎧"] as const;

const ACCENTS = [
  { color: "#c084fc", glow: "rgba(192, 132, 252, 0.35)" },
  { color: "#fb7185", glow: "rgba(251, 113, 133, 0.3)" },
  { color: "#5eead4", glow: "rgba(94, 234, 212, 0.28)" },
  { color: "#fbbf24", glow: "rgba(251, 191, 36, 0.28)" },
  { color: "#60a5fa", glow: "rgba(96, 165, 250, 0.3)" },
  { color: "#f472b6", glow: "rgba(244, 114, 182, 0.3)" },
] as const;

/** Salons connus — emoji + couleur uniques (évite les collisions du hash). */
const ROOM_PRESETS: Record<string, RoomTheme> = {
  preview: { emoji: "💬", accent: "#c084fc", glow: "rgba(192, 132, 252, 0.35)" },
  general: { emoji: "💬", accent: "#c084fc", glow: "rgba(192, 132, 252, 0.35)" },
  dev: { emoji: "⚡", accent: "#60a5fa", glow: "rgba(96, 165, 250, 0.3)" },
  gaming: { emoji: "🎮", accent: "#fb7185", glow: "rgba(251, 113, 133, 0.3)" },
  random: { emoji: "🎲", accent: "#5eead4", glow: "rgba(94, 234, 212, 0.28)" },
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export interface RoomTheme {
  emoji: string;
  accent: string;
  glow: string;
}

export function getRoomTheme(slug: string): RoomTheme {
  const preset = ROOM_PRESETS[slug];
  if (preset) return preset;

  const hash = hashString(slug);
  const accent = ACCENTS[hash % ACCENTS.length]!;
  return {
    emoji: ROOM_EMOJIS[hash % ROOM_EMOJIS.length]!,
    accent: accent.color,
    glow: accent.glow,
  };
}

export function roomThemeStyle(theme: RoomTheme): CSSProperties {
  return {
    "--room-accent": theme.accent,
    "--room-glow": theme.glow,
  } as CSSProperties;
}
