import type { ReactNode } from "react";

interface StatusPillProps {
  children: ReactNode;
  tone: "positive" | "warning" | "danger" | "neutral";
}

const toneClassMap = {
  positive: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  danger: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  neutral: "border-sky-400/30 bg-sky-400/10 text-sky-200",
} as const;

export function StatusPill({ children, tone }: StatusPillProps) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-[0.66rem] font-medium ${toneClassMap[tone]}`}>
      {children}
    </span>
  );
}
