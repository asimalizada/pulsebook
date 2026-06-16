"use client";

import { useMarketStore } from "@/lib/stores/market-store";

const statusToneMap = {
  connected: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  reconnecting: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  stale: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  disconnected: "border-rose-400/30 bg-rose-400/10 text-rose-200",
} as const;

export function ConnectionStatus() {
  const status = useMarketStore((state) => state.connectionStatus);
  const statusLabel = status.replace(/^\w/, (value) => value.toUpperCase());

  return (
    <div className="flex items-center gap-3">
      <span className="relative inline-flex h-2.5 w-2.5">
        <span
          className={`absolute inline-flex h-full w-full rounded-full ${
            status === "connected" ? "animate-ping bg-emerald-400/45" : "bg-white/0"
          }`}
        />
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
            status === "connected"
              ? "bg-emerald-300"
              : status === "reconnecting"
                ? "bg-amber-300"
                : status === "stale"
                  ? "bg-orange-300"
                  : "bg-rose-300"
          }`}
        />
      </span>
      <div className={`rounded-full border px-2.5 py-1 text-[0.68rem] font-medium ${statusToneMap[status]}`}>
        {statusLabel}
      </div>
    </div>
  );
}
