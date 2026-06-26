import type { LucideIcon, LucideProps } from "lucide-react";

export const iconSize = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

interface AppIconProps extends LucideProps {
  icon: LucideIcon;
  size?: keyof typeof iconSize;
}

export function AppIcon({ icon: Icon, size = "md", className = "", ...props }: AppIconProps) {
  return <Icon size={iconSize[size]} strokeWidth={2} className={`shrink-0 ${className}`} {...props} />;
}
