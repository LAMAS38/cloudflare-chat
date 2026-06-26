/** Limite affichée et appliquée côté client + serveur (graphemes, pas code units UTF-16). */
export const MESSAGE_MAX_GRAPHEMES = 2000;

let graphemeSegmenter: Intl.Segmenter | null | undefined;

function getGraphemeSegmenter(): Intl.Segmenter | null {
  if (graphemeSegmenter !== undefined) return graphemeSegmenter;
  try {
    graphemeSegmenter = new Intl.Segmenter("fr", { granularity: "grapheme" });
  } catch {
    graphemeSegmenter = null;
  }
  return graphemeSegmenter;
}

/** Compte les caractères visibles — 1 emoji = 1, même s'il vaut 2+ en UTF-16. */
export function countGraphemes(text: string): number {
  const segmenter = getGraphemeSegmenter();
  if (!segmenter) return [...text].length;

  let count = 0;
  for (const _ of segmenter.segment(text)) count += 1;
  return count;
}

export function sliceGraphemes(text: string, max: number): string {
  if (max <= 0) return "";

  const segmenter = getGraphemeSegmenter();
  if (!segmenter) return [...text].slice(0, max).join("");

  let count = 0;
  let result = "";
  for (const { segment } of segmenter.segment(text)) {
    if (count >= max) break;
    result += segment;
    count += 1;
  }
  return result;
}

export function exceedsGraphemeLimit(text: string, max = MESSAGE_MAX_GRAPHEMES): boolean {
  return countGraphemes(text) > max;
}

export function clampGraphemes(text: string, max = MESSAGE_MAX_GRAPHEMES): string {
  return exceedsGraphemeLimit(text, max) ? sliceGraphemes(text, max) : text;
}
