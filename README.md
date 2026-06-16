# Pulsebook

Pulsebook is a compact real-time trading UI reference implementation focused on frontend architecture for data-heavy market interfaces.

It demonstrates orderbook updates, positions, unrealized PnL, connection lifecycle handling, stale-data behavior, and performance-conscious rendering with mocked real-time events.

## Highlights

- Live mock orderbook with snapshot and delta updates
- Positions table with mark-price based unrealized PnL
- PnL, exposure, last price, and spread summary metrics
- Stream lifecycle states: connected, reconnecting, stale, disconnected
- Reconnect and resync controls through a small stream operations panel
- Separate Zustand stores for market state and UI-only state
- Typed realtime events with `type`, `symbol`, `seq`, and `ts`
- Narrow selectors and render isolation for frequent updates

## Tech Stack

- Next.js
- React
- TypeScript
- Zustand
- Tailwind CSS

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Quality checks:

```bash
npm run lint
npm run typecheck
npm run build
```

## Architecture Notes

- The dashboard client boundary lives in `components/dashboard/pulsebook-dashboard.tsx`
- Realtime stream logic lives outside React components in `lib/mock/realtime-engine.ts`
- Market state and UI-only state are separated into different Zustand stores
- Derived values such as spread, exposure, and unrealized PnL are computed through selectors and helpers instead of duplicated in store state

## Folder Overview

```text
app/
  layout.tsx
  page.tsx
components/
  dashboard/
  shared/
docs/
lib/
  mock/
  selectors/
  stores/
  types/
  utils/
```

## Mocked Market Data

Pulsebook uses mocked real-time market events and does not connect to real exchange APIs.

## Documentation

- [Architecture](docs/architecture.md)
- [Realtime State](docs/realtime-state.md)
- [Performance](docs/performance.md)
- [Tradeoffs](docs/tradeoffs.md)
