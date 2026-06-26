export function insertAtSelection(
  current: string,
  start: number,
  end: number,
  insertion: string,
): { next: string; cursor: number; selectionStart: number; selectionEnd: number } {
  const safeStart = Math.max(0, Math.min(start, current.length));
  const safeEnd = Math.max(safeStart, Math.min(end, current.length));
  const next = current.slice(0, safeStart) + insertion + current.slice(safeEnd);
  const cursor = safeStart + insertion.length;
  return { next, cursor, selectionStart: cursor, selectionEnd: cursor };
}

export function resizeComposeTextarea(
  el: HTMLTextAreaElement,
  minHeight: number,
  maxHeight: number,
): void {
  el.style.height = `${minHeight}px`;
  const next = Math.min(maxHeight, Math.max(minHeight, el.scrollHeight));
  el.style.height = `${next}px`;
}

export function focusTextareaSelection(
  el: HTMLTextAreaElement,
  start: number,
  end = start,
): void {
  el.focus({ preventScroll: true });
  el.setSelectionRange(start, end);
}

export type TextSelection = { start: number; end: number };

export function readTextareaSelection(el: HTMLTextAreaElement): TextSelection {
  return {
    start: el.selectionStart ?? 0,
    end: el.selectionEnd ?? 0,
  };
}
