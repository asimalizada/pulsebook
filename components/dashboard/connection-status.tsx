"use client";

import { Activity, AlertTriangle, RefreshCw, WifiOff } from "lucide-react";

import { useMarketStore } from "@/lib/stores/market-store";
import { StatusPill } from "@/components/shared/status-pill";

export function ConnectionStatus() {
  const status = useMarketStore((state) => state.connectionStatus);
  const statusLabel = status.replace(/^\w/, (value) => value.toUpperCase());
  const Icon =
    status === "connected"
      ? Activity
      : status === "reconnecting"
        ? RefreshCw
        : status === "stale"
          ? AlertTriangle
          : WifiOff;
  const tone = status === "connected" ? "positive" : status === "reconnecting" ? "warning" : status === "stale" ? "warning" : "danger";

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
      <StatusPill tone={tone}>
        <span className="flex items-center gap-1.5">
          <Icon className={`h-3.5 w-3.5 ${status === "reconnecting" ? "animate-spin" : ""}`} strokeWidth={2} />
          {statusLabel}
        </span>
      </StatusPill>
    </div>
  );
}
