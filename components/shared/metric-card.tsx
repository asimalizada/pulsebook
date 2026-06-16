import type { ReactNode } from "react";

import type { LucideIcon } from "lucide-react";

import { Panel } from "@/components/shared/panel";

interface MetricCardProps {
  label: string;
  value: string;
  toneClassName?: string;
  meta?: ReactNode;
  accentClassName?: string;
  icon?: LucideIcon;
  iconToneClassName?: string;
  iconShellClassName?: string;
  decoration?: ReactNode;
}

export function MetricCard({
  label,
  value,
  toneClassName = "text-white",
  meta,
  accentClassName = "from-white/6 via-white/[0.02] to-transparent",
  icon: Icon,
  iconToneClassName = "text-[var(--muted-strong)]",
  iconShellClassName = "border-white/8 bg-white/[0.04]",
  decoration,
}: MetricCardProps) {
  return (
    <Panel
      roundedClassName="rounded-[12px]"
      className={`relative px-4 py-4 before:hidden ${accentClassName ? `bg-gradient-to-br ${accentClassName}` : ""}`}
    >
      <div className="flex items-stretch gap-5">
        {Icon ? (
          <div className={`flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-[12px] border ${iconShellClassName}`}>
            <Icon className={`h-[30px] w-[30px] ${iconToneClassName}`} strokeWidth={1.8} />
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1">
          <div className="flex min-h-[66px] max-w-[calc(100%-108px)] flex-col justify-center pr-20">
            <div className="pulsebook-label whitespace-nowrap text-[0.65rem] tracking-[0.22em]">{label}</div>
            <div className={`mt-2 pulsebook-mono text-[1.34rem] font-semibold tracking-[-0.03em] ${toneClassName}`}>{value}</div>
            {meta ? <div className="mt-2 pulsebook-mono text-[0.72rem] font-medium text-[var(--muted-strong)]">{meta}</div> : null}
          </div>
        </div>
      </div>

      {decoration ? <div className="absolute bottom-4 right-4 opacity-60">{decoration}</div> : null}
    </Panel>
  );
}
