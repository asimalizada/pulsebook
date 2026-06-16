# Pulsebook Implementation Plan

## Public-Facing Project Purpose

Pulsebook is a compact real-time trading UI reference implementation. It focuses on frontend architecture for data-heavy realtime interfaces: orderbook updates, positions, PnL, mock WebSocket-style events, connection lifecycle, stale-data handling, and performance-conscious rendering.

The product scope is intentionally small, but the architecture decisions should remain visible. Pulsebook is not a full trading platform and it does not connect to real exchange APIs. Its purpose is to act as a clean public GitHub reference project that demonstrates production-minded frontend structure in a realtime setting.

## Final Scope

The demo should include a single polished dashboard page with:

- An orderbook with bid and ask levels
- A positions table with a few mock positions
- A PnL summary that reacts to mock market updates
- A connection status indicator with `Connected`, `Reconnecting`, `Stale`, and `Disconnected`
- Simulated reconnect and stale-data scenarios
- Explicit separation between server-driven state and UI-only state
- A few visible production-minded decisions around event ordering, stale data, and render isolation

## Dashboard UI Sections

The main dashboard should be compact and easy to scan. A good default layout is:

- Top header area with project title, short description, and selected symbol or market context
- Connection status strip showing lifecycle state, last update time, and stream health
- PnL summary cards for total unrealized PnL, exposure, and last price
- Main orderbook panel with bid and ask ladders
- Positions table with quantity, entry price, mark price, and unrealized PnL
- Optional lightweight debug or stream metadata panel for sequence and stale-state visibility

## Out Of Scope

To keep the project focused and high-signal, the following are intentionally excluded:

- Real exchange or brokerage APIs
- Authentication and user accounts
- Order entry and trading actions
- Historical charting
- Backend persistence
- Multi-page product flows
- Full production observability or deployment setup

## Recommended Stack

- Next.js
- React
- TypeScript
- Zustand
- Tailwind CSS

This stack keeps the repo compact while still showing strong frontend architecture choices.

## Final Folder Structure

```text
/app
  layout.tsx
  page.tsx
  globals.css

/components
  /dashboard
    connection-status.tsx
    dashboard-header.tsx
    pnl-summary.tsx
    positions-table.tsx
    orderbook-panel.tsx
    market-status-strip.tsx
    stream-debug-panel.tsx
  /shared
    panel.tsx
    metric-card.tsx
    section-label.tsx

/lib
  /mock
    mock-data.ts
    realtime-engine.ts
    scenario-controller.ts
  /stores
    market-store.ts
    ui-store.ts
  /selectors
    market-selectors.ts
    position-selectors.ts
  /types
    market.ts
    positions.ts
    realtime.ts
  /utils
    format.ts
    sequence.ts
    time.ts

/docs
  architecture.md
  dashboard.md
  realtime-state.md
  performance.md
  tradeoffs.md
  /adr
    001-zustand-for-realtime-state.md
    002-client-side-mock-stream.md
    003-state-separation.md

README.md
```

## State Architecture

The application should use two clearly separated client stores.

### 1. Market Store

This store contains server-like realtime state:

- Orderbook levels
- Latest prices
- Positions source data
- Connection state
- Last message timestamp
- Sequence metadata
- Staleness flags

This store is updated only by the realtime layer and any bootstrap seed logic.

### 2. UI Store

This store contains local presentation state:

- Selected symbol
- Density or compact mode
- Debug panel visibility
- Visual highlight preferences
- Any local filter or sort state

This store should never own server-truth data.

## State Boundaries

Pulsebook should make the data ownership model obvious:

- Market or server-driven state represents external truth and flows into the app through the mock realtime layer
- UI-only state represents local presentation concerns and should stay independent from stream updates
- Derived values such as spread, total exposure, and unrealized PnL should be computed from server-driven inputs rather than stored redundantly where possible
- Components should subscribe only to the slices they need so realtime updates do not rerender unrelated interface regions

## Realtime Data Flow

The project should model a simple but realistic event pipeline:

1. A mock realtime engine emits typed events on intervals.
2. Events include metadata such as `type`, `symbol`, `seq`, and `ts`.
3. A small adapter applies events into the market store.
4. The store ignores stale or out-of-order events where appropriate.
5. Components subscribe through narrow selectors so only affected UI regions rerender.

### Suggested Event Types

- `orderbook.snapshot`
- `orderbook.delta`
- `price.tick`
- `positions.snapshot`
- `connection.state`

### Connection Lifecycle

The UI should model these states:

- `Connected`
- `Reconnecting`
- `Stale`
- `Disconnected`

Suggested logic:

- If no market event arrives for a threshold, mark data as stale
- If a disconnect is simulated, move to reconnecting
- After reconnect, apply a fresh snapshot and return to connected

## Performance Strategy

The performance story should be simple and visible in the code:

- Use narrow Zustand selectors
- Keep server-driven and UI-only state in separate stores
- Avoid replacing large objects unnecessarily
- Prefer deltas over full snapshots during normal updates
- Memoize high-frequency row components only where useful
- Keep derived computations in selectors or helper functions instead of inside render bodies

The point is to show judgment, not to fill the app with premature optimization.

## Documentation Outline

### `README.md`

Should explain:

- Why the project exists
- What the demo covers
- Why the product scope is intentionally narrow
- How to run it
- What architecture decisions to look at first

### `docs/architecture.md`

Should explain:

- System overview
- Component boundaries
- Why the app is intentionally small

### `docs/dashboard.md`

Should explain:

- The purpose of each visible dashboard section
- How information is grouped for readability
- Why the interface stays intentionally compact

### `docs/realtime-state.md`

Should explain:

- Store separation
- Event lifecycle
- Sequence handling
- Staleness and reconnect behavior

### `docs/performance.md`

Should explain:

- Render isolation strategy
- Selector usage
- Batching and update discipline
- What was optimized and what was intentionally left simple

### `docs/tradeoffs.md`

Should explain:

- What is mocked
- What would change in a production system
- Why certain complexities were not added in this reference build

## Implementation Order

1. Bootstrap Next.js with TypeScript and Tailwind CSS.
2. Define the core domain types for prices, orderbook levels, positions, and stream events.
3. Seed mock instruments and positions.
4. Implement the `market-store` and `ui-store`.
5. Build the mock realtime engine with interval-driven updates and connection scenarios.
6. Add sequence and stale-data handling in the realtime apply path.
7. Build the dashboard shell and shared panel components.
8. Implement the PnL summary using derived data.
9. Implement the positions table with stable row rendering.
10. Implement the orderbook with efficient bid and ask rendering.
11. Add connection status and debug metadata such as last update time and last sequence.
12. Review rerender behavior and tighten selectors or memoization only where it helps.
13. Write the required documentation files.
14. Do a final cleanup pass for naming, consistency, and readability.

## Quality Bar

This project should feel like a senior engineer's reference implementation:

- Small enough to review quickly
- Thoughtful in architecture
- Clean in naming and file boundaries
- Honest about tradeoffs
- Polished enough to present publicly on GitHub

## Working Principle

If a choice does not clearly improve the demonstration of realtime architecture, correctness thinking, or render discipline, it should probably be left out.
