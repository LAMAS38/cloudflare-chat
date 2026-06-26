import type { Message } from "../../shared/message";

interface MessageRow {
  id: number;
  username: string;
  content: string;
  created_at: string;
}

function messageFromRow(row: MessageRow, roomSlug: string): Message {
  return {
    id: row.id,
    roomSlug,
    username: row.username,
    content: row.content,
    createdAt: row.created_at,
  };
}

export function fetchMessageHistory(
  sql: DurableObjectStorage["sql"],
  roomSlug: string,
  limit: number,
): Message[] {
  const cursor = sql.exec(
    `SELECT id, username, content, created_at
     FROM messages
     ORDER BY created_at DESC
     LIMIT ?`,
    limit,
  );

  return [...cursor]
    .map((row) => messageFromRow(row as unknown as MessageRow, roomSlug))
    .reverse();
}

export function insertMessage(
  sql: DurableObjectStorage["sql"],
  roomSlug: string,
  username: string,
  content: string,
): Message {
  const row = sql
    .exec(
      `INSERT INTO messages (username, content)
       VALUES (?, ?)
       RETURNING id, username, content, created_at`,
      username,
      content,
    )
    .one() as unknown as MessageRow;

  return messageFromRow(row, roomSlug);
}
