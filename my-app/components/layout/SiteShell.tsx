import type { ReactNode } from "react";

/** Shared page chrome wrapper for marketing / app shells. */
export function SiteShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
