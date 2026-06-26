/** Emojis rapides — barre au-dessus du champ */
export const QUICK_EMOJIS = ["😀", "😂", "❤️", "👍", "🔥", "🎉", "😊", "🙏"] as const;

export type EmojiCategory = {
  id: string;
  label: string;
  emojis: readonly string[];
};

export const EMOJI_CATEGORIES: readonly EmojiCategory[] = [
  {
    id: "smileys",
    label: "Visages",
    emojis: ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😍", "🥰", "😘", "😎", "🤔", "😮", "😢", "😭", "🥲"],
  },
  {
    id: "gestures",
    label: "Gestes",
    emojis: ["👍", "👎", "👌", "✌️", "🤞", "🤝", "👏", "🙌", "🙏", "💪", "🤙", "👋", "🫶", "🤷", "🤦"],
  },
  {
    id: "hearts",
    label: "Cœurs",
    emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "💕", "💖", "💘", "💝", "✨", "⭐", "🌟"],
  },
  {
    id: "fun",
    label: "Fun",
    emojis: ["🔥", "💯", "🎉", "🎊", "🚀", "🎮", "⚽", "🏆", "🍕", "☕", "🌈", "☀️", "🌙", "💤"],
  },
] as const;

const CATEGORY_ALIASES: Record<string, string[]> = {
  smileys: ["visage", "sourire", "rire", "mdr", "triste", "pleurer", "content", "heureux"],
  gestures: ["pouce", "like", "ok", "main", "clap", "merci", "salut", "force"],
  hearts: ["coeur", "amour", "heart", "love", "etoile"],
  fun: ["feu", "fire", "fete", "party", "jeu", "game", "food", "pizza", "cafe"],
};

/** Liste plate pour compatibilité */
export const PICKER_EMOJIS = EMOJI_CATEGORIES.flatMap((c) => c.emojis);

export function normalizeEmojiSearch(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

function categorySearchBlob(category: EmojiCategory): string {
  const aliases = CATEGORY_ALIASES[category.id] ?? [];
  return normalizeEmojiSearch(`${category.label} ${category.id} ${aliases.join(" ")}`);
}

export function filterEmojiCategories(
  categories: readonly EmojiCategory[],
  rawQuery: string,
): EmojiCategory[] {
  const query = normalizeEmojiSearch(rawQuery);
  if (!query) return [...categories];

  return categories
    .map((category) => {
      const categoryMatch = categorySearchBlob(category).includes(query);
      const emojis = category.emojis.filter(
        (emoji) => emoji.includes(rawQuery.trim()) || categoryMatch,
      );
      return { ...category, emojis };
    })
    .filter((category) => category.emojis.length > 0);
}

export function filterEmojiList(emojis: readonly string[], rawQuery: string): string[] {
  const query = normalizeEmojiSearch(rawQuery);
  if (!query) return [...emojis];
  return emojis.filter((emoji) => emoji.includes(rawQuery.trim()));
}
