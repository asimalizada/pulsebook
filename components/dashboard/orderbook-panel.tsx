"use client";

import { memo, useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Panel } from "@/components/shared/panel";
import { useMarketStore } from "@/lib/stores/market-store";
import { useUiStore } from "@/lib/stores/ui-store";
import { selectMidPrice, selectOrderbookBySymbol, selectSpread } from "@/lib/selectors/market-selectors";
import { formatPrice, formatSize } from "@/lib/utils/format";

interface OrderbookRow {
  bidPrice: string;
  bidSize: string;
  bidTotal: string;
  askPrice: string;
  askSize: string;
  askTotal: string;
  bidBarWidth: string;
  askBarWidth: string;
  key: string;
}

const ORDERBOOK_GRID_COLUMNS =
  "minmax(72px,0.78fr) minmax(132px,1.12fr) minmax(88px,0.86fr) minmax(132px,1.12fr) minmax(72px,0.78fr) minmax(88px,0.86fr)";

// Scales depth bars to occupy roughly half the column width,
// preserving visual balance without filling the full available space.
const ORDERBOOK_DEPTH_BAR_SCALE = 2.1;

const OrderbookTableRow = memo(function OrderbookTableRow({ row }: { row: OrderbookRow }) {
  return (
    <div
      className="pulsebook-table-row grid gap-2 rounded-[10px] border border-transparent px-3 py-2 text-[0.83rem] transition-colors duration-200 hover:border-white/8 hover:bg-white/[0.03]"
      style={{ gridTemplateColumns: ORDERBOOK_GRID_COLUMNS }}
    >
      <div className="pulsebook-depth-bid" style={{ width: `calc(${row.bidBarWidth} / ${ORDERBOOK_DEPTH_BAR_SCALE})` }} />
      <div className="pulsebook-depth-ask" style={{ width: `calc(${row.askBarWidth} / ${ORDERBOOK_DEPTH_BAR_SCALE})` }} />
      <div className="pulsebook-mono relative z-10 text-left text-emerald-200/90">{row.bidSize}</div>
      <div className="pulsebook-mono relative z-10 text-left font-medium text-emerald-300">{row.bidPrice}</div>
      <div className="pulsebook-mono relative z-10 text-left text-emerald-100/70">{row.bidTotal}</div>
      <div className="pulsebook-mono relative z-10 text-right font-medium text-rose-300">{row.askPrice}</div>
      <div className="pulsebook-mono relative z-10 text-right text-rose-200/90">{row.askSize}</div>
      <div className="pulsebook-mono relative z-10 text-right text-rose-100/70">{row.askTotal}</div>
    </div>
  );
});

function buildOrderbookRows(
  bids: { price: number; size: number }[],
  asks: { price: number; size: number }[],
): OrderbookRow[] {
  let runningBid = 0;
  let runningAsk = 0;
  const maxBidSize = Math.max(...bids.map((bid) => bid.size), 1);
  const maxAskSize = Math.max(...asks.map((ask) => ask.size), 1);

  return Array.from({ length: Math.max(bids.length, asks.length) }, (_, index) => {
    const bid = bids[index];
    const ask = asks[index];

    if (bid) {
      runningBid += bid.size;
    }

    if (ask) {
      runningAsk += ask.size;
    }

    return {
      key: `${bid?.price ?? "bid"}-${ask?.price ?? "ask"}-${index}`,
      bidPrice: bid ? formatPrice(bid.price) : "--",
      bidSize: bid ? formatSize(bid.size, 3) : "--",
      bidTotal: bid ? formatSize(runningBid, 3) : "--",
      askPrice: ask ? formatPrice(ask.price) : "--",
      askSize: ask ? formatSize(ask.size, 3) : "--",
      askTotal: ask ? formatSize(runningAsk, 3) : "--",
      bidBarWidth: bid ? `${Math.max(10, (bid.size / maxBidSize) * 100)}%` : "0%",
      askBarWidth: ask ? `${Math.max(10, (ask.size / maxAskSize) * 100)}%` : "0%",
    };
  });
}

export function OrderbookPanel() {
  const selectedSymbol = useUiStore((state) => state.selectedSymbol);
  const [snapshot, spread, midPrice] = useMarketStore(
    useShallow((state) => [
      selectOrderbookBySymbol(state, selectedSymbol),
      selectSpread(state, selectedSymbol),
      selectMidPrice(state, selectedSymbol),
    ]),
  );
  const rows = useMemo(() => {
    return snapshot ? buildOrderbookRows(snapshot.bids, snapshot.asks) : [];
  }, [snapshot]);

  return (
    <Panel roundedClassName="rounded-[12px]" variant="terminal" className="relative p-4 xl:p-5">
      <div className="mb-4 flex items-center justify-between border-b border-white/6 pb-3">
        <div className="flex items-start gap-3">
          <span className="rounded-[14px] border border-sky-400/14 bg-sky-400/8 p-2 text-sky-200">
            <BarChart3 className="h-4 w-4" strokeWidth={1.9} />
          </span>
          <div>
            <h2 className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[var(--muted-strong)]">Order Book</h2>
            <div className="mt-1 pulsebook-mono text-[0.78rem] text-[var(--muted)]">{selectedSymbol}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-[10px] border border-white/10 bg-white/[0.025] p-1">
          <span className="rounded-[8px] border border-sky-400/24 bg-sky-400/[0.08] px-3 py-1 pulsebook-mono text-[0.68rem] font-medium text-sky-200">
            Bid
          </span>
          <span className="rounded-[8px] px-3 py-1 pulsebook-mono text-[0.68rem] font-medium text-[var(--muted-strong)]">
            Ask
          </span>
        </div>
      </div>

      <div className="pulsebook-scrollbar overflow-x-auto">
        <div className="relative min-w-[752px] pr-4">
          <div className="pulsebook-book-divider" />
          <div className="pulsebook-book-crosshair" />

          <div
            className="grid gap-2 border-b border-[var(--border)] pb-2 text-[0.64rem] uppercase tracking-[0.16em] text-[var(--muted)]"
            style={{ gridTemplateColumns: ORDERBOOK_GRID_COLUMNS }}
          >
            <div className="text-left">Size</div>
            <div className="text-left">Bid</div>
            <div className="text-left">Total</div>
            <div className="text-right">Ask</div>
            <div className="text-right">Size</div>
            <div className="text-right">Total</div>
          </div>

          <div className="mt-2 space-y-1.5">
            {rows.map((row) => (
              <OrderbookTableRow key={row.key} row={row} />
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-[12px] border border-white/8 bg-white/[0.02]">
            <div className="flex items-center justify-center gap-4 px-5 py-4 text-center">
              <svg width="56" height="28" viewBox="0 0 56 28" className="opacity-90">
                <path
                  d="M2 22L8 18L12 19L17 10L22 13L28 6L33 12L39 4L45 8L50 5L54 7"
                  fill="none"
                  stroke="#6ce8ff"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <div className="pulsebook-label">Last Price</div>
                <div className="mt-1 pulsebook-mono text-[1.18rem] font-semibold text-sky-200">
                  {midPrice === null ? "--" : formatPrice(midPrice)}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 border-l border-white/8 px-5 py-4 text-center">
              <svg width="56" height="28" viewBox="0 0 56 28" className="opacity-90">
                <path
                  d="M14 6L26 6L26 2L40 14L26 26L26 21L14 21"
                  fill="none"
                  stroke="#ff8c9f"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <div className="pulsebook-label">Spread</div>
                <div className="mt-1 pulsebook-mono text-[1.18rem] font-semibold text-rose-300">
                  {spread === null ? "--" : formatPrice(spread)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}
