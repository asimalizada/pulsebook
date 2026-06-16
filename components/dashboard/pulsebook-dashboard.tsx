"use client";

import { useEffect } from "react";

import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { OrderbookPanel } from "@/components/dashboard/orderbook-panel";
import { PnlSummary } from "@/components/dashboard/pnl-summary";
import { PositionsTable } from "@/components/dashboard/positions-table";
import { StreamDebugPanel } from "@/components/dashboard/stream-debug-panel";
import { startPulsebookRealtimeEngine, stopPulsebookRealtimeEngine } from "@/lib/mock/realtime-engine";

export function PulsebookDashboard() {
  useEffect(() => {
    startPulsebookRealtimeEngine();

    return () => {
      stopPulsebookRealtimeEngine();
    };
  }, []);

  return (
    <main className="pulsebook-shell">
      <div className="pulsebook-grid gap-4">
        <DashboardHeader />
        <PnlSummary />

        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <OrderbookPanel />
          <div className="grid gap-4">
            <PositionsTable />
            <StreamDebugPanel />
          </div>
        </section>
      </div>
    </main>
  );
}
