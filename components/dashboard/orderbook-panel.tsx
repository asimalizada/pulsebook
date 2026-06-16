"use client";

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
  key: string;
}

function buildOrderbookRows(
  bids: { price: number; size: number }[],
  asks: { price: number; size: number }[],
): OrderbookRow[] {
  let runningBid = 0;
  let runningAsk = 0;

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
    };
  });
}

export function OrderbookPanel() {
  const selectedSymbol = useUiStore((state) => state.selectedSymbol);
  const snapshot = useMarketStore((state) => selectOrderbookBySymbol(state, selectedSymbol));
  const spread = useMarketStore((state) => selectSpread(state, selectedSymbol));
  const midPrice = useMarketStore((state) => selectMidPrice(state, selectedSymbol));

  const rows = snapshot ? buildOrderbookRows(snapshot.bids, snapshot.asks) : [];

  return (
    <Panel className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Orderbook</h2>
        <div className="pulsebook-mono text-xs text-[var(--muted)]">{selectedSymbol}</div>
      </div>

      <div className="grid grid-cols-6 gap-2 border-b border-[var(--border)] pb-2 text-[0.68rem] uppercase tracking-[0.16em] text-[var(--muted)]">
        <div className="text-left">Size</div>
        <div className="text-left">Bid</div>
        <div className="text-left">Total</div>
        <div className="text-right">Ask</div>
        <div className="text-right">Size</div>
        <div className="text-right">Total</div>
      </div>

      <div className="mt-2 space-y-1.5">
        {rows.map((row) => (
          <div
            key={row.key}
            className="grid grid-cols-6 gap-2 rounded-[14px] px-2 py-2 text-sm transition-colors duration-200 hover:bg-white/[0.035]"
          >
            <div className="pulsebook-mono text-left text-emerald-200/90">{row.bidSize}</div>
            <div className="pulsebook-mono text-left text-emerald-300">{row.bidPrice}</div>
            <div className="pulsebook-mono text-left text-emerald-100/70">{row.bidTotal}</div>
            <div className="pulsebook-mono text-right text-rose-300">{row.askPrice}</div>
            <div className="pulsebook-mono text-right text-rose-200/90">{row.askSize}</div>
            <div className="pulsebook-mono text-right text-rose-100/70">{row.askTotal}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-2">
        <div className="rounded-[18px] border border-[var(--border)] bg-white/[0.025] px-3 py-3">
          <div className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">Mid Price</div>
          <div className="mt-1 pulsebook-mono text-lg font-semibold text-sky-200">
            {midPrice === null ? "--" : formatPrice(midPrice)}
          </div>
        </div>
        <div className="rounded-[18px] border border-[var(--border)] bg-white/[0.025] px-3 py-3">
          <div className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">Spread</div>
          <div className="mt-1 pulsebook-mono text-lg font-semibold text-white">
            {spread === null ? "--" : formatPrice(spread)}
          </div>
        </div>
      </div>
    </Panel>
  );
}
