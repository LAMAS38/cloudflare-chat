import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="pulse-orb pulse-orb-violet -left-32 -top-32 h-96 w-96" />
        <div className="pulse-orb pulse-orb-coral bottom-0 right-0 h-80 w-80 translate-x-1/4 translate-y-1/4" />
        <div className="pulse-orb pulse-orb-mint left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 opacity-40" />
        <div className="absolute inset-0 bg-[#08080c]/80 backdrop-blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>
      <div className="relative z-10 min-h-full">{children}</div>
    </div>
  );
}
