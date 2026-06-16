"use client";

import { Panel } from "@/components/shared/panel";
import {
  getPulsebookRealtimeEngine,
  startPulsebookRealtimeEngine,
  stopPulsebookRealtimeEngine,
} from "@/lib/mock/realtime-engine";
import { formatTimestamp, getElapsedTimeMs } from "@/lib/utils/time";
import { useLiveNow } from "@/lib/utils/use-live-now";
import { useMarketStore } from "@/lib/stores/market-store";

function StreamButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-[14px] border border-[var(--border)] bg-white/[0.04] px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-white/[0.08]"
    >
      {label}
    </button>
  );
}

export function StreamDebugPanel() {
  const connectionStatus = useMarketStore((state) => state.connectionStatus);
  const latestStreamSequence = useMarketStore((state) => state.latestStreamSequence);
  const isStale = useMarketStore((state) => state.isStale);
  const lastMarketEventTimestamp = useMarketStore((state) => state.lastMarketEventTimestamp);
  const now = useLiveNow(500);
  const statusLabel = connectionStatus.replace(/^\w/, (value) => value.toUpperCase());
  const elapsedMs = now === null ? null : getElapsedTimeMs(lastMarketEventTimestamp, now);
  const lastUpdateAbsolute = lastMarketEventTimestamp === null ? "--" : formatTimestamp(lastMarketEventTimestamp);

  return (
    <Panel className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Stream Health</h2>
        <span
          className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-medium ${
            connectionStatus === "connected"
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
              : connectionStatus === "reconnecting"
                ? "border-amber-400/30 bg-amber-400/10 text-amber-200"
                : connectionStatus === "stale"
                  ? "border-orange-400/30 bg-orange-400/10 text-orange-200"
                  : "border-rose-400/30 bg-rose-400/10 text-rose-200"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-[16px] border border-[var(--border)] bg-white/[0.025] px-3 py-3">
          <div className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">Stale</div>
          <div className="mt-1 pulsebook-mono text-sm font-medium text-white">{isStale ? "true" : "false"}</div>
        </div>
        <div className="rounded-[16px] border border-[var(--border)] bg-white/[0.025] px-3 py-3">
          <div className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">Sequence</div>
          <div className="mt-1 pulsebook-mono text-sm font-medium text-white">
            {String(latestStreamSequence ?? "--")}
          </div>
        </div>
        <div className="rounded-[16px] border border-[var(--border)] bg-white/[0.025] px-3 py-3">
          <div className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">Last Market Update</div>
          <div className="mt-1 pulsebook-mono text-sm font-medium text-white">{lastUpdateAbsolute}</div>
        </div>
        <div className="rounded-[16px] border border-[var(--border)] bg-white/[0.025] px-3 py-3">
          <div className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">Elapsed</div>
          <div className="mt-1 pulsebook-mono text-sm font-medium text-white">
            {elapsedMs === null ? "--" : `${elapsedMs}ms`}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <StreamButton label="Disconnect" onClick={() => getPulsebookRealtimeEngine().simulateDisconnect()} />
        <StreamButton label="Reconnect" onClick={() => getPulsebookRealtimeEngine().reconnect()} />
        <StreamButton label="Force Stale" onClick={() => getPulsebookRealtimeEngine().forceStale()} />
        <StreamButton label="Restart" onClick={() => { stopPulsebookRealtimeEngine(); startPulsebookRealtimeEngine(); }} />
      </div>
    </Panel>
  );
}
