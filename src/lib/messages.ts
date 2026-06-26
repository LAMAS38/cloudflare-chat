import type { Message } from "../../shared/message";

export interface D1MessageRow {
  id: number;
  room_slug: string;
  username: string;
  content: string;
  created_at: string;
}

export function messageFromD1Row(row: D1MessageRow): Message {
  return {
    id: row.id,
    roomSlug: row.room_slug,
    username: row.username,
    content: row.content,
    createdAt: row.created_at,
  };
}

export async function fetchMessageHistory(
  db: D1Database,
  roomSlug: string,
  limit: number,
): Promise<Message[]> {
  const { results } = await db
    .prepare(
      `SELECT id, room_slug, username, content, created_at
       FROM messages
       WHERE room_slug = ?
       ORDER BY created_at DESC
       LIMIT ?`,
    )
    .bind(roomSlug, limit)
    .all<D1MessageRow>();

  return (results ?? []).map(messageFromD1Row).reverse();
}

export async function insertMessage(
  db: D1Database,
  roomSlug: string,
  username: string,
  content: string,
): Promise<D1MessageRow | null> {
  const row = await db
    .prepare(
      `INSERT INTO messages (room_slug, username, content)
       VALUES (?, ?, ?)
       RETURNING id, room_slug, username, content, created_at`,
    )
    .bind(roomSlug, username, content)
    .first<D1MessageRow>();

  return row;
}
