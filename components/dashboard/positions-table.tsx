"use client";

import { useMemo } from "react";

import { Panel } from "@/components/shared/panel";
import { useMarketStore } from "@/lib/stores/market-store";
import {
  getPositionExposure,
  getPositionMarkPrice,
  getPositionUnrealizedPnl,
} from "@/lib/selectors/position-selectors";
import { formatPnl, formatPrice, formatSize } from "@/lib/utils/format";

export function PositionsTable() {
  const positions = useMarketStore((state) => state.positions);
  const latestPricesBySymbol = useMarketStore((state) => state.latestPricesBySymbol);

  const positionRows = useMemo(
    () =>
      positions.map((position) => {
        const markPrice = getPositionMarkPrice(position, latestPricesBySymbol[position.symbol]);
        const unrealizedPnl = getPositionUnrealizedPnl(position, markPrice);
        const exposure = getPositionExposure(position, markPrice);

        return {
          ...position,
          markPrice,
          unrealizedPnl,
          exposure,
        };
      }),
    [positions, latestPricesBySymbol],
  );

  return (
    <Panel className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Positions</h2>
        <div className="pulsebook-mono text-xs text-[var(--muted)]">{positionRows.length} Open</div>
      </div>

      <div className="grid grid-cols-[1.1fr_0.7fr_0.8fr_0.9fr_0.9fr_1fr] gap-2 border-b border-[var(--border)] pb-2 text-[0.64rem] uppercase tracking-[0.16em] text-[var(--muted)]">
        <div>Symbol</div>
        <div>Side</div>
        <div className="text-right">Qty</div>
        <div className="text-right">Entry</div>
        <div className="text-right">Mark</div>
        <div className="text-right">PnL</div>
      </div>

      <div className="mt-2 space-y-1.5">
        {positionRows.map((position) => (
          <div
            key={position.id}
            className="grid grid-cols-[1.1fr_0.7fr_0.8fr_0.9fr_0.9fr_1fr] gap-2 rounded-[14px] px-2 py-2 text-sm transition-colors duration-200 hover:bg-white/[0.035]"
          >
            <div className="pulsebook-mono text-white">{position.symbol}</div>
            <div className={position.side === "long" ? "text-emerald-200" : "text-rose-200"}>
              {position.side === "long" ? "Long" : "Short"}
            </div>
            <div className="pulsebook-mono text-right text-white">{formatSize(position.quantity, 3)}</div>
            <div className="pulsebook-mono text-right text-slate-300">{formatPrice(position.entryPrice)}</div>
            <div className="pulsebook-mono text-right text-sky-200">
              {position.markPrice === null ? "--" : formatPrice(position.markPrice)}
            </div>
            <div
              className={`pulsebook-mono text-right ${
                (position.unrealizedPnl ?? 0) >= 0 ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {position.unrealizedPnl === null ? "--" : formatPnl(position.unrealizedPnl)}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
