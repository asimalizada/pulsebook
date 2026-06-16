"use client";

const metrics = [
  { label: "Total PnL", value: "+12,480.32", tone: "text-emerald-300" },
  { label: "Exposure", value: "$248,900", tone: "text-white" },
  { label: "Last Price", value: "67,482.10", tone: "text-sky-200" },
];

const orderbookRows = [
  { bidSize: "4.20", bidPrice: "67,481.80", askPrice: "67,482.40", askSize: "2.90" },
  { bidSize: "3.65", bidPrice: "67,481.20", askPrice: "67,483.10", askSize: "3.25" },
  { bidSize: "2.75", bidPrice: "67,480.90", askPrice: "67,483.60", askSize: "2.10" },
  { bidSize: "2.10", bidPrice: "67,480.30", askPrice: "67,484.20", askSize: "1.95" },
  { bidSize: "1.60", bidPrice: "67,479.70", askPrice: "67,484.90", askSize: "1.35" },
  { bidSize: "1.15", bidPrice: "67,479.10", askPrice: "67,485.40", askSize: "0.90" },
];

const positions = [
  { symbol: "BTC-USD", side: "Long", size: "1.80", entry: "66,920.50", mark: "67,482.10", pnl: "+1,010.88" },
  { symbol: "ETH-USD", side: "Long", size: "12.00", entry: "3,540.20", mark: "3,586.40", pnl: "+554.40" },
  { symbol: "SOL-USD", side: "Short", size: "420", entry: "168.10", mark: "165.90", pnl: "+924.00" },
];

const streamFacts = [
  { label: "Stream", value: "Connected" },
  { label: "Last Update", value: "14:32:18.412" },
  { label: "Sequence", value: "184204" },
  { label: "Spread", value: "0.60" },
];

export function PulsebookDashboard() {
  return (
    <main className="pulsebook-shell">
      <div className="pulsebook-grid gap-4">
        <section className="pulsebook-panel rounded-[24px] px-4 py-4 md:px-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div>
                <div className="text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                  Pulsebook
                </div>
                <div className="mt-1 text-2xl font-semibold tracking-[-0.04em] text-white">BTC-USD</div>
              </div>
              <div className="hidden h-10 w-px bg-[var(--border)] md:block" />
              <div className="hidden items-center gap-3 md:flex">
                <span className="relative inline-flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300" />
                </span>
                <div>
                  <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">Stream</div>
                  <div className="text-sm font-medium text-white">Connected</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
              {streamFacts.map((fact) => (
                <div
                  key={fact.label}
                  className="rounded-[18px] border border-[var(--border)] bg-white/[0.03] px-3 py-2 transition-colors duration-200 hover:bg-white/[0.05]"
                >
                  <div className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">{fact.label}</div>
                  <div className="mt-1 pulsebook-mono text-sm font-medium text-white">{fact.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="pulsebook-panel rounded-[22px] px-4 py-4 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--muted)]">{metric.label}</div>
              <div className={`mt-3 pulsebook-mono text-2xl font-semibold ${metric.tone}`}>{metric.value}</div>
            </article>
          ))}
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="pulsebook-panel rounded-[24px] p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Orderbook</h2>
              <div className="pulsebook-mono text-xs text-[var(--muted)]">Bid / Ask</div>
            </div>

            <div className="grid grid-cols-4 gap-2 border-b border-[var(--border)] pb-2 text-[0.68rem] uppercase tracking-[0.16em] text-[var(--muted)]">
              <div className="text-left">Size</div>
              <div className="text-left">Bid</div>
              <div className="text-right">Ask</div>
              <div className="text-right">Size</div>
            </div>

            <div className="mt-2 space-y-1.5">
              {orderbookRows.map((row) => (
                <div
                  key={`${row.bidPrice}-${row.askPrice}`}
                  className="grid grid-cols-4 gap-2 rounded-[14px] px-2 py-2 text-sm transition-colors duration-200 hover:bg-white/[0.035]"
                >
                  <div className="pulsebook-mono text-left text-emerald-200/90">{row.bidSize}</div>
                  <div className="pulsebook-mono text-left text-emerald-300">{row.bidPrice}</div>
                  <div className="pulsebook-mono text-right text-rose-300">{row.askPrice}</div>
                  <div className="pulsebook-mono text-right text-rose-200/90">{row.askSize}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[18px] border border-[var(--border)] bg-white/[0.025] px-3 py-3">
              <div>
                <div className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">Last Price</div>
                <div className="mt-1 pulsebook-mono text-lg font-semibold text-sky-200">67,482.10</div>
              </div>
              <div className="text-right">
                <div className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">Spread</div>
                <div className="mt-1 pulsebook-mono text-lg font-semibold text-white">0.60</div>
              </div>
            </div>
          </article>

          <div className="grid gap-4">
            <article className="pulsebook-panel rounded-[24px] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Positions</h2>
                <div className="pulsebook-mono text-xs text-[var(--muted)]">3 Open</div>
              </div>

              <div className="grid grid-cols-[1.1fr_0.7fr_0.8fr_0.9fr_0.9fr_0.9fr] gap-2 border-b border-[var(--border)] pb-2 text-[0.64rem] uppercase tracking-[0.16em] text-[var(--muted)]">
                <div>Symbol</div>
                <div>Side</div>
                <div className="text-right">Size</div>
                <div className="text-right">Entry</div>
                <div className="text-right">Mark</div>
                <div className="text-right">PnL</div>
              </div>

              <div className="mt-2 space-y-1.5">
                {positions.map((position) => (
                  <div
                    key={position.symbol}
                    className="grid grid-cols-[1.1fr_0.7fr_0.8fr_0.9fr_0.9fr_0.9fr] gap-2 rounded-[14px] px-2 py-2 text-sm transition-colors duration-200 hover:bg-white/[0.035]"
                  >
                    <div className="pulsebook-mono text-white">{position.symbol}</div>
                    <div className="text-slate-200">{position.side}</div>
                    <div className="pulsebook-mono text-right text-white">{position.size}</div>
                    <div className="pulsebook-mono text-right text-slate-300">{position.entry}</div>
                    <div className="pulsebook-mono text-right text-sky-200">{position.mark}</div>
                    <div className="pulsebook-mono text-right text-emerald-300">{position.pnl}</div>
                  </div>
                ))}
              </div>
            </article>

            <article className="pulsebook-panel rounded-[24px] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Stream Health</h2>
                <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[0.68rem] font-medium text-emerald-200">
                  Connected
                </span>
              </div>

              <div className="grid gap-2 md:grid-cols-2">
                {streamFacts.map((fact) => (
                  <div key={fact.label} className="rounded-[16px] border border-[var(--border)] bg-white/[0.025] px-3 py-3">
                    <div className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--muted)]">{fact.label}</div>
                    <div className="mt-1 pulsebook-mono text-sm font-medium text-white">{fact.value}</div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
