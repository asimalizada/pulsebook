"use client";

import { memo, useMemo } from "react";
import { BriefcaseBusiness } from "lucide-react";

import { Panel } from "@/components/shared/panel";
import { useMarketStore } from "@/lib/stores/market-store";
import {
  getPositionMarkPrice,
  getPositionUnrealizedPnl,
} from "@/lib/selectors/position-selectors";
import { formatPnl, formatPrice, formatSize } from "@/lib/utils/format";

const POSITION_GRID_COLUMNS =
  "minmax(112px,1.1fr) minmax(92px,0.7fr) minmax(76px,0.8fr) minmax(116px,0.9fr) minmax(116px,0.9fr) minmax(172px,1.14fr)";

interface PositionRowView {
  id: string;
  symbol: string;
  side: "long" | "short";
  quantityDisplay: string;
  entryPriceDisplay: string;
  markPriceDisplay: string;
  unrealizedPnlDisplay: string;
  isPositivePnl: boolean;
}

const PositionTableRow = memo(function PositionTableRow({
  row,
  isFirstRow,
}: {
  row: PositionRowView;
  isFirstRow: boolean;
}) {
  return (
    <div
      className={`grid gap-2 px-0 py-4 pr-2 text-[0.82rem] transition-colors duration-200 hover:bg-white/[0.02] ${
        isFirstRow ? "" : "border-t border-white/7"
      }`}
      style={{ gridTemplateColumns: POSITION_GRID_COLUMNS }}
    >
      <div className="pulsebook-mono whitespace-nowrap text-white">{row.symbol}</div>
      <div className="pt-[1px]">
        <span
          className={`inline-flex whitespace-nowrap rounded-full border px-2 py-[3px] text-[0.62rem] font-medium uppercase tracking-[0.14em] ${
            row.side === "long"
              ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
              : "border-rose-400/25 bg-rose-400/10 text-rose-200"
          }`}
        >
          {row.side === "long" ? "Long" : "Short"}
        </span>
      </div>
      <div className="pulsebook-mono whitespace-nowrap text-right text-white">{row.quantityDisplay}</div>
      <div className="pulsebook-mono whitespace-nowrap text-right text-slate-300">{row.entryPriceDisplay}</div>
      <div className="pulsebook-mono whitespace-nowrap text-right text-sky-200">{row.markPriceDisplay}</div>
      <div
        className={`pulsebook-mono whitespace-nowrap text-right ${
          row.isPositivePnl ? "font-semibold text-emerald-300" : "font-semibold text-rose-300"
        }`}
      >
        {row.unrealizedPnlDisplay}
      </div>
    </div>
  );
});

export function PositionsTable() {
  const positions = useMarketStore((state) => state.positions);
  const latestPricesBySymbol = useMarketStore((state) => state.latestPricesBySymbol);

  const positionRows = useMemo(
    () =>
      positions.map((position) => {
        const markPrice = getPositionMarkPrice(position, latestPricesBySymbol[position.symbol]);
        const unrealizedPnl = getPositionUnrealizedPnl(position, markPrice);
        const isPositivePnl = (unrealizedPnl ?? 0) >= 0;

        return {
          id: position.id,
          symbol: position.symbol,
          side: position.side,
          quantityDisplay: formatSize(position.quantity, 3),
          entryPriceDisplay: formatPrice(position.entryPrice),
          markPriceDisplay: markPrice === null ? "--" : formatPrice(markPrice),
          unrealizedPnlDisplay: unrealizedPnl === null ? "--" : formatPnl(unrealizedPnl),
          isPositivePnl,
        };
      }),
    [positions, latestPricesBySymbol],
  );

  return (
    <Panel roundedClassName="rounded-[12px]" className="p-4 before:hidden">
      <div className="mb-4 flex items-center justify-between border-b border-white/6 pb-3">
        <div className="flex items-center gap-3">
          <span className="rounded-[14px] border border-emerald-400/14 bg-emerald-400/8 p-2 text-emerald-200">
            <BriefcaseBusiness className="h-4 w-4" strokeWidth={1.9} />
          </span>
          <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Positions</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 pulsebook-mono text-[0.68rem] text-[var(--muted)]">
          {positionRows.length} Open
        </div>
      </div>

      <div className="pulsebook-scrollbar max-h-[336px] overflow-auto">
        <div className="min-w-[724px] pr-5">
          <div
            className="sticky top-0 z-10 grid gap-2 border-b border-[var(--border)] bg-[linear-gradient(180deg,rgba(8,17,31,0.98)_0%,rgba(5,11,22,0.98)_100%)] pb-2 pr-2 text-[0.61rem] uppercase tracking-[0.16em] text-[var(--muted)]"
            style={{ gridTemplateColumns: POSITION_GRID_COLUMNS }}
          >
            <div className="whitespace-nowrap">Symbol</div>
            <div className="whitespace-nowrap">Side</div>
            <div className="whitespace-nowrap text-right">Qty</div>
            <div className="whitespace-nowrap text-right">Entry</div>
            <div className="whitespace-nowrap text-right">Mark</div>
            <div className="whitespace-nowrap text-right">PnL</div>
          </div>

          <div className="mt-1">
            {positionRows.map((position, index) => (
              <PositionTableRow key={position.id} row={position} isFirstRow={index === 0} />
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
