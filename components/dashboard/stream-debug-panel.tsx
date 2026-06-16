"use client";

import { memo, useCallback, useMemo } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Clock3, Layers3, RefreshCw, ShieldCheck, TimerReset, WifiOff, Zap } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Panel } from "@/components/shared/panel";
import {
  getPulsebookRealtimeEngine,
} from "@/lib/mock/realtime-engine";
import { formatTimestamp, getElapsedTimeMs } from "@/lib/utils/time";
import { useLiveNow } from "@/lib/utils/use-live-now";
import { useMarketStore } from "@/lib/stores/market-store";
import { StatusPill } from "@/components/shared/status-pill";

const StreamButton = memo(function StreamButton({
  label,
  onClick,
  icon: Icon,
}: {
  label: string;
  onClick: () => void;
  icon: LucideIcon;
}) {
  const toneClassName =
    label === "Disconnect"
      ? "border-rose-500/38 bg-rose-500/[0.06] text-rose-300 hover:border-rose-400/52 hover:bg-rose-500/[0.1]"
      : label === "Reconnect"
        ? "border-sky-500/34 bg-sky-500/[0.05] text-sky-300 hover:border-sky-400/48 hover:bg-sky-500/[0.09]"
        : "border-amber-500/34 bg-amber-500/[0.05] text-amber-300 hover:border-amber-400/48 hover:bg-amber-500/[0.09]";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[56px] items-center justify-center gap-2 rounded-[10px] border px-3 py-3 text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-200 ${toneClassName}`}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={1.9} />
      {label}
    </button>
  );
});

export function StreamDebugPanel() {
  const [connectionStatus, latestStreamSequence, isStale, lastMarketEventTimestamp] = useMarketStore(
    useShallow((state) => [
      state.connectionStatus,
      state.latestStreamSequence,
      state.isStale,
      state.lastMarketEventTimestamp,
    ]),
  );
  const now = useLiveNow(500);
  const engine = useMemo(() => getPulsebookRealtimeEngine(), []);
  const statusLabel = useMemo(() => {
    return connectionStatus.replace(/^\w/, (value) => value.toUpperCase());
  }, [connectionStatus]);
  const elapsedMs = useMemo(() => {
    return now === null ? null : getElapsedTimeMs(lastMarketEventTimestamp, now);
  }, [lastMarketEventTimestamp, now]);
  const lastUpdateAbsolute = useMemo(() => {
    return lastMarketEventTimestamp === null ? "--" : formatTimestamp(lastMarketEventTimestamp);
  }, [lastMarketEventTimestamp]);
  const statusTone = useMemo(() => {
    return connectionStatus === "connected"
      ? "positive"
      : connectionStatus === "reconnecting"
        ? "warning"
        : connectionStatus === "stale"
          ? "warning"
          : "danger";
  }, [connectionStatus]);
  const staleLabel = isStale ? "On" : "Off";
  const handleDisconnect = useCallback(() => {
    engine.simulateDisconnect();
  }, [engine]);
  const handleReconnect = useCallback(() => {
    engine.reconnect();
  }, [engine]);
  const handleForceStale = useCallback(() => {
    engine.forceStale();
  }, [engine]);

  return (
    <Panel roundedClassName="rounded-[10px]" variant="subtle" className="p-4 before:hidden">
      <div className="mb-4 flex items-center justify-between border-b border-white/6 pb-3">
        <div className="flex items-center gap-3">
          <span className="rounded-[14px] border border-sky-400/14 bg-sky-400/8 p-2 text-sky-200">
            <Zap className="h-4 w-4" strokeWidth={1.9} />
          </span>
          <h2 className="text-[0.76rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Stream Health</h2>
        </div>
        <div className="flex items-center">
          <StatusPill tone={statusTone}>{statusLabel}</StatusPill>
        </div>
      </div>

      <div className="grid gap-3 min-[420px]:grid-cols-2 xl:grid-cols-[0.9fr_0.85fr_1.35fr_0.9fr]">
        <div className="rounded-[10px] border border-[var(--border)] bg-white/[0.02] px-4 py-4 text-center">
          <div className="pulsebook-label text-center">Stale</div>
          <div className="mt-3 border-t border-white/7 pt-3">
            <div className="flex items-center justify-center gap-3 pulsebook-mono text-[0.88rem] font-medium text-white">
              <ShieldCheck className={`h-5 w-5 ${isStale ? "text-amber-300" : "text-emerald-300"}`} strokeWidth={1.9} />
              {staleLabel}
            </div>
          </div>
        </div>

        <div className="rounded-[10px] border border-[var(--border)] bg-white/[0.02] px-4 py-4 text-center">
          <div className="pulsebook-label text-center">Sequence</div>
          <div className="mt-3 border-t border-white/7 pt-3">
            <div className="flex items-center justify-center gap-3 pulsebook-mono text-[0.88rem] font-medium text-white">
              <Layers3 className="h-5 w-5 text-sky-300" strokeWidth={1.9} />
              {String(latestStreamSequence ?? "--")}
            </div>
          </div>
        </div>

        <div className="rounded-[10px] border border-[var(--border)] bg-white/[0.02] px-4 py-4 text-center">
          <div className="pulsebook-label text-center">Last Market Update</div>
          <div className="mt-3 border-t border-white/7 pt-3">
            <div className="flex items-center justify-center gap-3 pulsebook-mono text-[0.88rem] font-medium text-white">
              <Clock3 className="h-5 w-5 text-cyan-300" strokeWidth={1.9} />
              {lastUpdateAbsolute}
            </div>
          </div>
        </div>

        <div className="rounded-[10px] border border-[var(--border)] bg-white/[0.02] px-4 py-4 text-center">
          <div className="pulsebook-label text-center">Elapsed</div>
          <div className="mt-3 border-t border-white/7 pt-3">
            <div className="flex items-center justify-center gap-3 pulsebook-mono text-[0.88rem] font-medium text-white">
              <TimerReset className="h-5 w-5 text-violet-300" strokeWidth={1.9} />
              {elapsedMs === null ? "--" : `${elapsedMs}ms`}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 border-t border-white/6 pt-4">
        <div className="grid gap-3 min-[420px]:grid-cols-2 xl:grid-cols-3">
          <StreamButton label="Disconnect" icon={WifiOff} onClick={handleDisconnect} />
          <StreamButton label="Reconnect" icon={RefreshCw} onClick={handleReconnect} />
          <StreamButton label="Force Stale" icon={AlertTriangle} onClick={handleForceStale} />
        </div>
      </div>
    </Panel>
  );
}
