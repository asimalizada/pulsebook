"use client";

import { Activity, Radio } from "lucide-react";

import { Panel } from "@/components/shared/panel";
import { formatRelativeUpdateTime, formatTimestamp } from "@/lib/utils/time";
import { useLiveNow } from "@/lib/utils/use-live-now";
import { useMarketStore } from "@/lib/stores/market-store";
import { useUiStore } from "@/lib/stores/ui-store";

function HeaderFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l border-white/8 pl-3 first:border-l-0 first:pl-0 md:pl-5">
      <div className="pulsebook-label text-[0.52rem] tracking-[0.18em] md:text-[0.58rem] md:tracking-[0.2em]">{label}</div>
      <div className="mt-1 pulsebook-mono text-[0.78rem] font-medium text-white md:text-[0.86rem]">{value}</div>
    </div>
  );
}

export function DashboardHeader() {
  const selectedSymbol = useUiStore((state) => state.selectedSymbol);
  const connectionStatus = useMarketStore((state) => state.connectionStatus);
  const latestStreamSequence = useMarketStore((state) => state.latestStreamSequence);
  const lastMarketEventTimestamp = useMarketStore((state) => state.lastMarketEventTimestamp);
  const now = useLiveNow(1000);
  const lastUpdateAbsolute = lastMarketEventTimestamp === null ? "--" : formatTimestamp(lastMarketEventTimestamp);
  const lastUpdateRelative =
    now === null || lastMarketEventTimestamp === null ? "--" : formatRelativeUpdateTime(lastMarketEventTimestamp, now);
  const statusLabel = connectionStatus.replace(/^\w/, (value) => value.toUpperCase());

  return (
    <Panel variant="command" roundedClassName="rounded-[12px]" className="px-4 py-3 before:hidden md:px-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3 xl:gap-0">
          <div className="flex items-center gap-2 border-r border-white/8 pr-5">
            <Activity className="h-4 w-4 text-[var(--accent-cool)]" strokeWidth={2} />
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-[var(--accent-cool)]">
              Pulsebook
            </span>
          </div>

          <div className="flex items-center gap-2 border-r border-white/8 px-5">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-[0.82rem] font-bold text-white shadow-[0_0_16px_rgba(249,115,22,0.25)]">
              ₿
            </span>
            <span className="pulsebook-mono text-[1.02rem] font-semibold text-white">{selectedSymbol}</span>
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.18em] text-[var(--muted-strong)]">
              Spot
            </span>
          </div>

          <div className="hidden items-center gap-2 border-r border-white/8 px-5 xl:flex">
            <Radio className="h-3.5 w-3.5 text-[var(--accent)]" strokeWidth={2} />
            <span className="pulsebook-mono text-[0.8rem] text-[var(--muted-strong)]">Stream</span>
          </div>

          <div className="hidden items-center px-5 xl:flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/24 bg-emerald-400/10 px-4 py-1.5 text-[0.82rem] font-medium text-emerald-200 shadow-[0_0_18px_rgba(52,211,153,0.08)]">
              <span className="relative inline-flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/35" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
              </span>
              {statusLabel}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-0 border-t border-white/6 pt-3 xl:min-w-[400px] xl:grid-cols-3 xl:border-t-0 xl:pt-0">
          <HeaderFact label="Last Update" value={lastUpdateAbsolute} />
          <HeaderFact label="Relative" value={lastUpdateRelative} />
          <HeaderFact label="Sequence" value={String(latestStreamSequence ?? "--")} />
        </div>
      </div>
    </Panel>
  );
}
