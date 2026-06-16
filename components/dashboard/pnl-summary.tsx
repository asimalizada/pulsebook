"use client";

import { useMemo } from "react";
import { Activity, ArrowLeftRight, CircleGauge, TrendingDown, TrendingUp } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { MetricCard } from "@/components/shared/metric-card";
import { formatCurrency, formatPnl, formatPrice } from "@/lib/utils/format";
import { useMarketStore } from "@/lib/stores/market-store";
import { useUiStore } from "@/lib/stores/ui-store";
import { selectPriceTickBySymbol, selectSpread } from "@/lib/selectors/market-selectors";
import { selectTotalExposure, selectTotalUnrealizedPnl } from "@/lib/selectors/position-selectors";

function LineDecoration({ tone = "positive" }: { tone?: "positive" | "neutral" | "negative" }) {
  const stroke =
    tone === "positive" ? "#4ce0b3" : tone === "negative" ? "#ff8598" : "#63c4ff";
  const fill =
    tone === "positive"
      ? "rgba(76, 224, 179, 0.08)"
      : tone === "negative"
        ? "rgba(255, 133, 152, 0.08)"
        : "rgba(99, 196, 255, 0.08)";

  return (
    <svg width="92" height="40" viewBox="0 0 92 40" className="opacity-90">
      <path
        d="M2 35L12 28L18 30L25 22L31 25L39 15L47 22L56 10L63 15L70 9L77 14L84 8L90 11"
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 35L12 28L18 30L25 22L31 25L39 15L47 22L56 10L63 15L70 9L77 14L84 8L90 11L90 40L2 40Z"
        fill={fill}
      />
    </svg>
  );
}

function BarDecoration({ tone = "neutral" }: { tone?: "neutral" | "negative" }) {
  const color = tone === "negative" ? "rgba(255, 133, 152, 0.22)" : "rgba(95, 132, 205, 0.22)";

  return (
    <div className="flex h-[40px] items-end gap-1.5 opacity-90">
      {[12, 20, 16, 28, 34, 24, 38].map((height, index) => (
        <span
          key={`${height}-${index}`}
          className="w-2 rounded-t-[2px]"
          style={{ height, background: color }}
        />
      ))}
    </div>
  );
}

export function PnlSummary() {
  const selectedSymbol = useUiStore((state) => state.selectedSymbol);
  const [totalPnl, totalExposure, lastPrice, change24h, spread] = useMarketStore(
    useShallow((state) => {
      const priceTick = selectPriceTickBySymbol(state, selectedSymbol);

      return [
        selectTotalUnrealizedPnl(state),
        selectTotalExposure(state),
        priceTick?.price ?? null,
        priceTick?.change24h ?? null,
        selectSpread(state, selectedSymbol),
      ];
    }),
  );
  const totalPnlPositive = totalPnl >= 0;
  const change24hDisplay = useMemo(() => {
    if (change24h === null) {
      return null;
    }

    return `${change24h >= 0 ? "+" : ""}${change24h.toFixed(2)}%`;
  }, [change24h]);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Total PnL"
        value={formatPnl(totalPnl)}
        toneClassName={totalPnlPositive ? "pulsebook-positive-glow text-emerald-300" : "pulsebook-negative-glow text-rose-300"}
        accentClassName={totalPnlPositive ? "from-emerald-500/10 via-white/[0.015] to-transparent" : "from-rose-500/10 via-white/[0.015] to-transparent"}
        icon={totalPnlPositive ? TrendingUp : TrendingDown}
        iconToneClassName={totalPnlPositive ? "text-emerald-200" : "text-rose-200"}
        iconShellClassName={totalPnlPositive ? "border-emerald-400/18 bg-emerald-400/[0.08]" : "border-rose-400/18 bg-rose-400/[0.08]"}
        decoration={<LineDecoration tone={totalPnlPositive ? "positive" : "negative"} />}
      />
      <MetricCard
        label="Exposure"
        value={formatCurrency(totalExposure)}
        accentClassName="from-sky-500/[0.05] via-white/[0.015] to-transparent"
        icon={CircleGauge}
        iconToneClassName="text-sky-200"
        iconShellClassName="border-sky-400/18 bg-sky-400/[0.07]"
        decoration={<BarDecoration />}
      />
      <MetricCard
        label="Last Price"
        value={lastPrice === null ? "--" : formatPrice(lastPrice)}
        toneClassName="text-sky-200"
        accentClassName="from-sky-500/[0.08] via-white/[0.015] to-transparent"
        meta={change24hDisplay}
        icon={Activity}
        iconToneClassName="text-sky-200"
        iconShellClassName="border-sky-400/18 bg-sky-400/[0.07]"
        decoration={<LineDecoration tone="neutral" />}
      />
      <MetricCard
        label="Spread"
        value={spread === null ? "--" : formatPrice(spread)}
        toneClassName="text-rose-300"
        accentClassName="from-rose-500/[0.08] via-white/[0.015] to-transparent"
        icon={ArrowLeftRight}
        iconToneClassName="text-rose-200"
        iconShellClassName="border-rose-400/18 bg-rose-400/[0.07]"
        decoration={<BarDecoration tone="negative" />}
      />
    </section>
  );
}
