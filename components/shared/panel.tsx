import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
}

export function Panel({ children, className = "" }: PanelProps) {
  return <section className={`pulsebook-panel rounded-[24px] ${className}`.trim()}>{children}</section>;
}
