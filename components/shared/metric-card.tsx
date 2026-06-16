import type { ReactNode } from "react";

import { Panel } from "@/components/shared/panel";

interface MetricCardProps {
  label: string;
  value: string;
  toneClassName?: string;
  meta?: ReactNode;
}

export function MetricCard({ label, value, toneClassName = "text-white", meta }: MetricCardProps) {
  return (
    <Panel className="px-4 py-4 transition-transform duration-200 hover:-translate-y-0.5">
      <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">{label}</div>
      <div className={`mt-3 pulsebook-mono text-2xl font-semibold ${toneClassName}`}>{value}</div>
      {meta ? <div className="mt-2 text-xs text-[var(--muted)]">{meta}</div> : null}
    </Panel>
  );
}
