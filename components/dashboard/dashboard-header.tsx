"use client";

import { ConnectionStatus } from "@/components/dashboard/connection-status";
import { formatRelativeUpdateTime, formatTimestamp } from "@/lib/utils/time";
import { useLiveNow } from "@/lib/utils/use-live-now";
import { useMarketStore } from "@/lib/stores/market-store";
import { useUiStore } from "@/lib/stores/ui-store";

function HeaderFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-[var(--border)] bg-white/[0.03] px-3 py-2 transition-colors duration-200 hover:bg-white/[0.05]">
      <div className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">{label}</div>
      <div className="mt-1 pulsebook-mono text-sm font-medium text-white">{value}</div>
    </div>
  );
}

export function DashboardHeader() {
  const selectedSymbol = useUiStore((state) => state.selectedSymbol);
  const connectionStatus = useMarketStore((state) => state.connectionStatus);
  const latestStreamSequence = useMarketStore((state) => state.latestStreamSequence);
  const lastMarketEventTimestamp = useMarketStore((state) => state.lastMarketEventTimestamp);
  const now = useLiveNow(1000);
  const statusLabel = connectionStatus.replace(/^\w/, (value) => value.toUpperCase());
  const lastUpdateAbsolute = lastMarketEventTimestamp === null ? "--" : formatTimestamp(lastMarketEventTimestamp);
  const lastUpdateRelative =
    now === null || lastMarketEventTimestamp === null ? "--" : formatRelativeUpdateTime(lastMarketEventTimestamp, now);

  return (
    <section className="pulsebook-panel rounded-[24px] px-4 py-4 md:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">Pulsebook</div>
            <div className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">{selectedSymbol}</div>
          </div>
          <div className="hidden h-10 w-px bg-[var(--border)] md:block" />
          <div className="hidden items-center gap-3 md:flex">
            <ConnectionStatus />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          <HeaderFact label="Stream" value={statusLabel} />
          <HeaderFact label="Last Update" value={lastUpdateAbsolute} />
          <HeaderFact label="Relative" value={lastUpdateRelative} />
          <HeaderFact label="Sequence" value={String(latestStreamSequence ?? "--")} />
        </div>
      </div>
    </section>
  );
}
