"use client";

import { useEffect } from "react";
import { useUiStore } from "@/lib/stores/ui-store";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { OrderbookPanel } from "@/components/dashboard/orderbook-panel";
import { PnlSummary } from "@/components/dashboard/pnl-summary";
import { PositionsTable } from "@/components/dashboard/positions-table";
import { StreamDebugPanel } from "@/components/dashboard/stream-debug-panel";
import { startPulsebookRealtimeEngine, stopPulsebookRealtimeEngine } from "@/lib/mock/realtime-engine";

export function PulsebookDashboard() {
  const isDebugPanelVisible = useUiStore((state) => state.isDebugPanelVisible);
  const density = useUiStore((state) => state.density);

  useEffect(() => {
    startPulsebookRealtimeEngine();

    return () => {
      stopPulsebookRealtimeEngine();
    };
  }, []);

  const gapClass = density === "comfortable" ? "gap-5" : "gap-4";

  return (
    <main className="pulsebook-shell">
      <div className={`pulsebook-grid ${gapClass}`}>
        <DashboardHeader />
        <PnlSummary />

        <section className={`grid ${gapClass} xl:grid-cols-[1.15fr_0.85fr]`}>
          <OrderbookPanel />
          <div className={`grid ${gapClass}`}>
            <PositionsTable />
            {isDebugPanelVisible && <StreamDebugPanel />}
          </div>
        </section>
      </div>
    </main>
  );
}
