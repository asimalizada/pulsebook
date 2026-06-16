# AGENTS.md

## Project

This repository is **Pulsebook**, a compact real-time trading UI reference implementation.

Pulsebook demonstrates frontend architecture patterns for data-heavy realtime interfaces, including:

* Orderbook updates
* Positions and PnL state
* Mock WebSocket-style events
* Connection lifecycle handling
* Stale-data detection
* Event ordering
* Performance-conscious rendering

The project is intentionally small in product scope, but the implementation should remain clean, typed, and production-minded.

## Public Repository Rules

This is a public GitHub repository.

Keep all documentation, code comments, and UI copy focused on the project itself.

Do not include private process context, external evaluation context, or temporary delivery context.

The repository should read as a standalone portfolio/reference project.

## Implementation Approach

Work in small phases.

Do not implement unrelated future phases unless explicitly asked.

Before coding a phase:

1. Read `docs/implementation-roadmap.md`
2. Identify the current phase
3. Implement only the requested phase
4. Keep changes focused
5. Summarize changed files after completion

## Tech Stack

Use the existing project stack:

* Next.js
* React
* TypeScript
* Zustand
* Tailwind CSS

Avoid adding new dependencies unless they clearly improve the architecture demonstration.

## Architecture Rules

Keep clear boundaries between:

Use a component-based structure, but do not over-split the UI.

Components should exist because they represent a meaningful product or architecture boundary, not because every small JSX fragment needs its own file.

Prefer feature-level components such as:

* `PulsebookDashboard`
* `DashboardHeader`
* `ConnectionStatus`
* `PnlSummary`
* `OrderbookPanel`
* `PositionsTable`
* `StreamDebugPanel`

Shared components should be limited to genuinely reusable primitives such as:

* `Panel`
* `MetricCard`
* `SectionLabel`

Avoid creating excessive tiny components like one-off labels, wrappers, table cells, or decorative elements unless they clearly improve readability or reuse.

Keep component files easy to scan.

Keep business and realtime logic out of UI components.

Keep UI components focused on rendering and small local presentation concerns.

If a component becomes too large, split it by responsibility, not by arbitrary JSX chunks.

The code should feel pragmatic, not academic.

Prefer clear boundaries over excessive abstraction.

Prefer readable composition over clever patterns.

Avoid premature generalization.

Build the dashboard as a real product surface, not as a component showcase.

### Server-driven / market state

Examples:

* orderbook levels
* latest prices
* positions source data
* connection state
* last message timestamp
* sequence metadata
* stale-data flags

This state should live in the market store and be updated by the realtime layer.

### UI-only state

Examples:

* selected symbol
* compact/density mode
* debug panel visibility
* local display preferences
* table sorting/filtering

This state should live separately from market/server-driven state.

Do not store external truth in the UI store.

## Realtime Rules

Mock realtime behavior should be modeled as a controlled event pipeline.

Events should include:

* `type`
* `symbol`
* `seq`
* `ts`

Use snapshots for initial/resync state and deltas for normal updates.

The app should be able to demonstrate:

* connected state
* reconnecting state
* stale state
* disconnected state
* stale or out-of-order event handling
* resync after reconnect

Realtime/mock WebSocket logic should not live directly inside React UI components.

## Rendering & Performance Rules

Prefer render isolation over premature optimization.

Use:

* narrow Zustand selectors
* derived selectors/helpers for computed values
* stable props for frequently updating components
* memoization only where useful
* controlled update frequency for high-frequency mock events

Avoid:

* unnecessary global rerenders
* heavy calculations inside render bodies
* replacing large objects without reason
* storing duplicated derived values when they can be computed safely

## UI Direction

Keep the UI:

* clean
* compact
* readable
* modern
* dashboard-like
* easy to scan

Pulsebook should be dark-mode only for now.

Use a trading/dashboard feel:

* dark background
* subtle borders
* soft gradients
* readable contrast
* compact cards
* clear hierarchy

The UI should feel polished and visually appealing, not like a plain scaffold.

Do not overbuild visual features. The main value is architecture clarity.

Animations should be subtle and purposeful:

* use smooth hover and focus transitions for cards and controls
* use subtle value-change highlights for realtime numbers such as price, PnL, orderbook rows, and connection state
* use a small pulse or indicator animation for stream health or connection status
* use gentle enter transitions only where they improve perceived polish

Prefer CSS or Tailwind transitions first.

Avoid heavy animation libraries unless clearly necessary.

Respect readability and performance over visual effects.

Animation choices must not interfere with realtime rendering.

Avoid animating large lists excessively.

For orderbook rows, prefer lightweight transitions or small flash effects only.

Do not add a theme switcher yet.

Avoid light-mode tokens unless they help future extensibility without adding complexity.

Make sure text contrast remains easy to read.

Expected dashboard sections:

* dashboard header
* connection status strip
* PnL summary
* orderbook panel
* positions table
* optional stream/debug metadata panel

## Documentation Rules

Keep docs concise and useful.

Expected docs:

* `README.md`
* `docs/implementation-roadmap.md`
* `docs/architecture.md`
* `docs/realtime-state.md`
* `docs/performance.md`
* `docs/tradeoffs.md`

Docs should explain decisions and stay project-focused.

## Quality Checklist

Before finishing a phase, check:

* TypeScript types are clear
* file names are consistent
* state boundaries are respected
* UI components are not owning realtime logic
* docs do not mention private/application context
* code is not overengineered
* available checks were run if possible

## Final Response Format

After completing work, summarize:

* what changed
* files created/updated
* checks run
* any issues or tradeoffs
* recommended next step
