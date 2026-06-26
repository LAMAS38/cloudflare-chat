import { useEffect, type ReactNode } from "react";
import { initViewport } from "../lib/viewport";

interface ViewportProviderProps {
  children: ReactNode;
}

export function ViewportProvider({ children }: ViewportProviderProps) {
  useEffect(() => initViewport(), []);
  return children;
}
