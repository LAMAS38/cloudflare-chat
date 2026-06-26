const DRAFT_PREFIX = "pulsechat_draft:";

export type DraftSelection = { start: number; end: number };

export type DraftRecord = {
  content: string;
  selection: DraftSelection;
};

function clampSelection(content: string, selection: DraftSelection): DraftSelection {
  const len = content.length;
  const start = Math.max(0, Math.min(selection.start, len));
  const end = Math.max(start, Math.min(selection.end, len));
  return { start, end };
}

function parseDraftRaw(raw: string | null): DraftRecord {
  if (!raw) {
    return { content: "", selection: { start: 0, end: 0 } };
  }

  if (raw.startsWith("{")) {
    try {
      const parsed = JSON.parse(raw) as Partial<DraftRecord>;
      const content = typeof parsed.content === "string" ? parsed.content : "";
      const selection =
        parsed.selection &&
        typeof parsed.selection.start === "number" &&
        typeof parsed.selection.end === "number"
          ? parsed.selection
          : { start: content.length, end: content.length };
      return { content, selection: clampSelection(content, selection) };
    } catch {
      return { content: raw, selection: { start: raw.length, end: raw.length } };
    }
  }

  return { content: raw, selection: { start: raw.length, end: raw.length } };
}

export function getDraftRecord(slug: string): DraftRecord {
  try {
    return parseDraftRaw(localStorage.getItem(`${DRAFT_PREFIX}${slug}`));
  } catch {
    return { content: "", selection: { start: 0, end: 0 } };
  }
}

export function getDraft(slug: string): string {
  return getDraftRecord(slug).content;
}

export function setDraftRecord(
  slug: string,
  content: string,
  selection: DraftSelection,
): void {
  try {
    const key = `${DRAFT_PREFIX}${slug}`;
    if (!content.trim()) {
      localStorage.removeItem(key);
      return;
    }
    const record: DraftRecord = {
      content,
      selection: clampSelection(content, selection),
    };
    localStorage.setItem(key, JSON.stringify(record));
  } catch {
    /* quota / private mode */
  }
}

export function setDraft(slug: string, content: string, selection?: DraftSelection): void {
  const len = content.length;
  setDraftRecord(slug, content, selection ?? { start: len, end: len });
}

export function clearDraft(slug: string): void {
  try {
    localStorage.removeItem(`${DRAFT_PREFIX}${slug}`);
  } catch {
    /* ignore */
  }
}
