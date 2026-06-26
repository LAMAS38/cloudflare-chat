import type { Message } from "../types";

function parseMessageDate(iso: string): Date {
  return new Date(iso.endsWith("Z") ? iso : `${iso}Z`);
}

function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function formatDateDivider(date: Date): string {
  const now = new Date();
  const today = dayKey(now);
  const yesterday = dayKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));

  const key = dayKey(date);
  if (key === today) return "Aujourd'hui";
  if (key === yesterday) return "Hier";

  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export interface MessageGroup {
  key: string;
  label: string;
  messages: Message[];
}

export function groupMessagesByDate(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = [];

  for (const message of messages) {
    const date = parseMessageDate(message.createdAt);
    const key = dayKey(date);
    const last = groups[groups.length - 1];

    if (last?.key === key) {
      last.messages.push(message);
    } else {
      groups.push({ key, label: formatDateDivider(date), messages: [message] });
    }
  }

  return groups;
}
