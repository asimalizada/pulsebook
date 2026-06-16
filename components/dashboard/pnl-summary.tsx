"use client";

import { MetricCard } from "@/components/shared/metric-card";
import { formatCurrency, formatPnl, formatPrice } from "@/lib/utils/format";
import { useMarketStore } from "@/lib/stores/market-store";
import { useUiStore } from "@/lib/stores/ui-store";
import { selectPriceTickBySymbol, selectSpread } from "@/lib/selectors/market-selectors";
import { selectTotalExposure, selectTotalUnrealizedPnl } from "@/lib/selectors/position-selectors";

export function PnlSummary() {
  const selectedSymbol = useUiStore((state) => state.selectedSymbol);
  const totalPnl = useMarketStore(selectTotalUnrealizedPnl);
  const totalExposure = useMarketStore(selectTotalExposure);
  const spread = useMarketStore((state) => selectSpread(state, selectedSymbol));
  const priceTick = useMarketStore((state) => selectPriceTickBySymbol(state, selectedSymbol));

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Total PnL"
        value={formatPnl(totalPnl)}
        toneClassName={totalPnl >= 0 ? "text-emerald-300" : "text-rose-300"}
      />
      <MetricCard label="Exposure" value={formatCurrency(totalExposure)} />
      <MetricCard
        label="Last Price"
        value={priceTick ? formatPrice(priceTick.price) : "--"}
        toneClassName="text-sky-200"
        meta={priceTick ? `${priceTick.change24h >= 0 ? "+" : ""}${priceTick.change24h.toFixed(2)}%` : null}
      />
      <MetricCard label="Spread" value={spread === null ? "--" : formatPrice(spread)} />
    </section>
  );
}
