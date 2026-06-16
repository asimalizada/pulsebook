import type { ReactNode } from "react";

interface PanelProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "command" | "terminal" | "subtle";
  roundedClassName?: string;
}

const variantClassMap = {
  default: "",
  command: "pulsebook-command",
  terminal: "pulsebook-terminal pulsebook-terminal-grid",
  subtle: "bg-[linear-gradient(180deg,rgba(8,18,32,0.92)_0%,rgba(7,15,28,0.96)_100%)]",
} as const;

export function Panel({
  children,
  className = "",
  variant = "default",
  roundedClassName = "rounded-[24px]",
}: PanelProps) {
  return (
    <section className={`pulsebook-panel ${roundedClassName} ${variantClassMap[variant]} ${className}`.trim()}>
      {children}
    </section>
  );
}
