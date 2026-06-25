const AVATAR_PALETTE = [
  "#c084fc",
  "#fb7185",
  "#5eead4",
  "#fbbf24",
  "#60a5fa",
  "#f472b6",
  "#34d399",
  "#a78bfa",
] as const;

export function hashUsername(username: string): number {
  let hash = 0;
  for (let i = 0; i < username.length; i += 1) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function avatarColor(username: string): string {
  return AVATAR_PALETTE[hashUsername(username) % AVATAR_PALETTE.length]!;
}

export function avatarInitials(username: string): string {
  const parts = username.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0]}${parts[1]![0]}`.toUpperCase();
  }
  return username.slice(0, 2).toUpperCase();
}
