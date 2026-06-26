import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-app overflow-hidden safe-x">
      <div className="pointer-events-none absolute inset-0">
        <div className="pulse-orb pulse-orb-violet -left-20 -top-20 h-64 w-64 md:-left-32 md:-top-32 md:h-96 md:w-96" />
        <div className="pulse-orb pulse-orb-coral bottom-0 right-0 h-56 w-56 translate-x-1/4 translate-y-1/4 md:h-80 md:w-80" />
        <div className="pulse-orb pulse-orb-mint left-1/2 top-1/3 h-48 w-48 -translate-x-1/2 opacity-40 md:h-64 md:w-64" />
        <div className="absolute inset-0 bg-[#08080c]/80 backdrop-blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03] [background-size:32px_32px] md:[background-size:48px_48px]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          }}
        />
      </div>
      <div className="relative z-10 min-h-app">{children}</div>
    </div>
  );
}
