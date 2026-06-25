import { avatarColor, avatarInitials } from "../lib/avatar";

interface AvatarProps {
  username: string;
  size?: "sm" | "md" | "lg";
  ring?: boolean;
}

const sizeClasses = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
} as const;

export function Avatar({ username, size = "md", ring = false }: AvatarProps) {
  const color = avatarColor(username);
  const initials = avatarInitials(username);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizeClasses[size]} ${ring ? "ring-2 ring-white/20" : ""}`}
      style={{ backgroundColor: `${color}33`, boxShadow: `inset 0 0 0 1px ${color}66` }}
      title={username}
      aria-hidden
    >
      {initials}
    </span>
  );
}
