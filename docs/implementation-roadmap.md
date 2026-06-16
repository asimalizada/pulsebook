# Pulsebook Implementation Roadmap

## Overview

Pulsebook is a compact real-time trading UI reference implementation. This roadmap breaks the work into small, practical phases so the project can stay focused on frontend architecture, realtime state, connection lifecycle, and performance-conscious rendering.

The goal is not to build a full trading platform. The goal is to produce a clear, public-facing reference project with clean file boundaries, predictable state flow, and a compact dashboard that demonstrates production-minded decisions.

## Next.js Client Boundary

Keep `app/layout.tsx` and `app/page.tsx` lightweight where possible. Realtime dashboard behavior should live inside a dedicated client component such as `components/dashboard/pulsebook-dashboard.tsx`.

The aim is to keep the client boundary intentional and avoid turning more of the app into client components than necessary.

## Component Architecture Direction

Use a component-based structure, but do not over-split the UI.

Components should exist because they represent a meaningful product or architecture boundary, not because every small JSX fragment needs its own file.

Prefer feature-level components such as:

- `PulsebookDashboard`
- `DashboardHeader`
- `ConnectionStatus`
- `PnlSummary`
- `OrderbookPanel`
- `PositionsTable`
- `StreamDebugPanel`

Shared components should stay limited to genuinely reusable primitives such as:

- `Panel`
- `MetricCard`
- `SectionLabel`

Avoid excessive tiny components for one-off labels, wrappers, table cells, or decorative fragments unless they improve readability or reuse in a meaningful way.

Keep component files easy to scan.

Keep business and realtime logic out of UI components.

Keep UI components focused on rendering and small local presentation concerns.

If a component becomes too large, split it by responsibility, not by arbitrary JSX chunks.

The architecture should feel pragmatic rather than academic:

- prefer clear boundaries over excessive abstraction
- prefer readable composition over clever patterns
- avoid premature generalization
- build the dashboard as a real product surface, not a component showcase

## Phase 0 - Project Setup & Baseline

### Goal

Create a clean Next.js baseline with TypeScript, Tailwind CSS, and a predictable project structure that supports the rest of the implementation.

### Files Likely To Be Created Or Changed

- `package.json`
- `tsconfig.json`
- `next.config.ts` or `next.config.mjs`
- `postcss.config.mjs`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `README.md`
- `docs/`

### Tasks

- Verify the Next.js, TypeScript, and Tailwind setup
- Remove default scaffold content that does not fit Pulsebook
- Set base metadata, page shell, and root layout
- Establish the initial folder structure for `app`, `components`, `lib`, and `docs`
- Add base visual tokens and global styles for a compact dashboard layout
- Set the initial visual direction as dark-mode only with polished dashboard styling, subtle borders, soft gradients, and strong text contrast

### Acceptance Criteria

- The project runs locally as a clean Next.js app
- The root layout and page shell reflect Pulsebook branding
- Global styles are minimal, intentional, and ready for the dashboard build
- The directory structure supports the planned architecture without unused defaults

### Notes / Risks

- Default scaffold files can create noise if not cleaned up early
- Styling choices should stay simple enough to support fast iteration
- Dark-mode styling should feel intentional early so later UI phases do not read like a plain scaffold

### Validation

- Run available setup, lint, typecheck, or build checks if the toolchain is already in place
- Summarize created or changed files before moving on
- Stop after the phase is complete and confirm the baseline is stable

## Phase 1 - Domain Types & Mock Data

### Goal

Define the core domain model and seed data so the realtime engine and UI can share a single typed vocabulary.

### Files Likely To Be Created Or Changed

- `lib/types/market.ts`
- `lib/types/positions.ts`
- `lib/types/realtime.ts`
- `lib/mock/mock-data.ts`
- `lib/utils/format.ts`
- `lib/utils/time.ts`
- `lib/utils/sequence.ts`

### Tasks

- Define types for symbols, price ticks, orderbook levels, positions, and connection status
- Define typed realtime events with `type`, `symbol`, `seq`, and `ts`
- Add seed data for one or more instruments
- Add initial orderbook levels and position fixtures
- Add formatting helpers for price, size, percent, and timestamps

### Acceptance Criteria

- Core domain data is strongly typed
- Mock data is sufficient to render the full dashboard without backend dependencies
- Shared helpers reduce formatting logic inside UI components

### Notes / Risks

- Overly detailed types can add noise if the domain model expands too far
- Seed data should stay realistic enough to make the UI read well

### Validation

- Run relevant type or build checks if available after introducing shared types and helpers
- Summarize created or changed files before moving on
- Stop after the phase is complete and confirm the domain model is coherent

## Phase 2 - State Boundaries

### Goal

Establish clear separation between market or server-driven state and UI-only presentation state.

### Files Likely To Be Created Or Changed

- `lib/stores/market-store.ts`
- `lib/stores/ui-store.ts`
- `lib/selectors/market-selectors.ts`
- `lib/selectors/position-selectors.ts`

### Tasks

- Create a market store for stream-driven state
- Create a UI store for local preferences and presentation controls
- Add selectors for spread, exposure, unrealized PnL, and connection summaries
- Keep derived values out of the persisted store where practical
- Make store boundaries obvious through naming and file structure

### Acceptance Criteria

- Market state and UI state are stored separately
- Components can subscribe to narrow slices without pulling unrelated data
- Derived values are computed through selectors or helpers instead of duplicated in state

### Notes / Risks

- Derived values can drift if duplicated in multiple places
- Store shape should stay compact so updates remain easy to reason about

### Validation

- Run relevant lint, typecheck, or build checks if available after adding stores and selectors
- Summarize created or changed files before moving on
- Stop after the phase is complete and confirm state ownership boundaries are clear

## Phase 3 - Mock Realtime Engine

### Goal

Build a mock WebSocket-style event engine that can drive the dashboard with snapshots and deltas.

### Files Likely To Be Created Or Changed

- `lib/mock/realtime-engine.ts`
- `lib/mock/scenario-controller.ts`
- `lib/mock/mock-data.ts`
- `lib/stores/market-store.ts`
- `lib/utils/sequence.ts`

### Tasks

- Build a mock realtime engine outside React components
- Add explicit `start()` and `stop()` lifecycle methods
- Ensure intervals and timers are always cleaned up correctly
- Prevent duplicate active streams during development rerenders or repeated initialization
- Emit initial snapshots for orderbook and positions
- Emit incremental price and orderbook updates
- Attach sequence numbers and timestamps to all events
- Apply events through a controlled adapter into the market store
- Ignore stale or out-of-order events using sequence metadata

### Acceptance Criteria

- The engine can emit a full initial state and then incremental updates
- Event application is centralized rather than scattered across components
- Older events do not overwrite newer market state

### Notes / Risks

- Update frequency should stay readable and not overwhelm the UI
- Snapshot and delta rules need to be simple but consistent

### Validation

- Run relevant lint, typecheck, or build checks if available after adding the engine and adapter path
- Summarize created or changed files before moving on
- Stop after the phase is complete and confirm lifecycle cleanup is reliable

## Phase 4 - Connection Lifecycle

### Goal

Model connection health as a first-class part of the realtime experience.

### Files Likely To Be Created Or Changed

- `lib/mock/realtime-engine.ts`
- `lib/mock/scenario-controller.ts`
- `lib/stores/market-store.ts`
- `lib/types/realtime.ts`
- `lib/selectors/market-selectors.ts`

### Tasks

- Add `Connected`, `Reconnecting`, `Stale`, and `Disconnected` lifecycle states
- Track heartbeat or last-message timestamps
- Detect stale data after inactivity
- Simulate connection loss and reconnect behavior
- Apply a fresh snapshot or resync after reconnect
- Define explicit scenario controls for disconnect, stale-state forcing, and reconnect or resync behavior

### Acceptance Criteria

- Connection status is represented in typed state
- Stale-data behavior can be observed without manual code changes
- Reconnect transitions restore state through a predictable resync path

### Notes / Risks

- Stale detection thresholds should be easy to tune
- Reconnect logic should not duplicate normal snapshot initialization unnecessarily

### Validation

- Run relevant lint, typecheck, or build checks if available after adding lifecycle state handling
- Summarize created or changed files before moving on
- Stop after the phase is complete and confirm connection transitions behave predictably

## Phase 5 - Dashboard UI

### Goal

Build a single-page dashboard that presents the realtime state clearly and compactly.

### Files Likely To Be Created Or Changed

- `app/page.tsx`
- `components/dashboard/pulsebook-dashboard.tsx`
- `components/dashboard/dashboard-header.tsx`
- `components/dashboard/connection-status.tsx`
- `components/dashboard/market-status-strip.tsx`
- `components/dashboard/pnl-summary.tsx`
- `components/dashboard/orderbook-panel.tsx`
- `components/dashboard/positions-table.tsx`
- `components/dashboard/stream-debug-panel.tsx`
- `components/shared/panel.tsx`
- `components/shared/metric-card.tsx`
- `components/shared/section-label.tsx`
- `app/globals.css`

### Tasks

- Build the dashboard header with Pulsebook title and short description
- Add a connection status strip with lifecycle, last update time, and sequence visibility
- Add PnL summary cards for key derived metrics
- Build an orderbook panel with bid and ask ladders
- Build a positions table with entry, mark, size, and unrealized PnL
- Add a small stream debug panel with explicit controls for simulate disconnect, force stale state, and reconnect or resync if it strengthens the architecture demonstration
- Keep the overall surface polished, dark-only, compact, and visually consistent with a trading dashboard feel
- Add subtle realtime-friendly animations such as hover transitions, focused state changes, lightweight value flashes, and small stream-health indicators where they improve clarity
- Split the dashboard into meaningful feature-level components without turning the UI into a component showcase

### Acceptance Criteria

- The dashboard reads well at a glance and stays compact
- Each UI section maps cleanly to a focused data boundary
- Realtime behavior is visible without visual clutter
- The dark dashboard styling feels intentional and portfolio-ready rather than scaffold-like
- Motion remains subtle, readable, and lightweight

### Notes / Risks

- A dense trading-style UI can become noisy if spacing and hierarchy are not controlled
- The optional debug panel should help explain state flow, not distract from the core UI
- Motion can quickly become distracting in data-heavy views if too many elements animate at once

### Validation

- Run relevant lint, typecheck, or build checks if available after each major dashboard section is added
- Summarize created or changed files before moving on
- Stop after the phase is complete and confirm the client boundary remains contained

## Phase 6 - Performance Pass

### Goal

Review render behavior and tighten the implementation where it meaningfully improves update discipline.

### Files Likely To Be Created Or Changed

- `lib/selectors/market-selectors.ts`
- `lib/selectors/position-selectors.ts`
- `components/dashboard/orderbook-panel.tsx`
- `components/dashboard/positions-table.tsx`
- `components/dashboard/pnl-summary.tsx`
- `docs/performance.md`

### Tasks

- Tighten Zustand selectors so components only subscribe to required data
- Avoid unnecessary rerenders across unrelated UI regions
- Memoize rows or derived values only where it clearly helps
- Keep mock update frequency controlled for readability and stability
- Document the render strategy and the tradeoffs behind it

### Acceptance Criteria

- High-frequency updates do not cause the entire page to rerender unnecessarily
- Memoization is used intentionally rather than everywhere
- The code clearly shows how render isolation was approached

### Notes / Risks

- Premature optimization can make the reference harder to understand
- Performance choices should remain visible but not dominate the architecture

### Validation

- Run relevant lint, typecheck, or build checks if available after selector and render refinements
- Summarize created or changed files before moving on
- Stop after the phase is complete and confirm optimizations remain justified

## Phase 7 - Documentation

### Goal

Add concise public-facing documentation that explains the architecture and tradeoffs without turning the repository into a long-form essay.

### Files Likely To Be Created Or Changed

- `README.md`
- `docs/architecture.md`
- `docs/realtime-state.md`
- `docs/performance.md`
- `docs/tradeoffs.md`

### Tasks

- Write a concise README with project purpose, features, and local run steps
- Document architecture boundaries and main file structure
- Explain realtime state flow, event sequencing, stale-data handling, and reconnect behavior
- Document performance strategy and render isolation choices
- Document the deliberate tradeoffs that keep Pulsebook compact

### Acceptance Criteria

- A reader can understand the project quickly from the README and docs
- Documentation matches the implemented architecture
- The repository reads like a polished public reference project

### Notes / Risks

- Docs can drift from the implementation if written too early
- The tone should stay direct and portfolio-friendly

### Validation

- Run any relevant checks if docs changes coincide with code changes in the same pass
- Summarize created or changed files before moving on
- Stop after the phase is complete and confirm the docs match the implementation

## Phase 8 - Final Polish

### Goal

Clean up naming, consistency, and presentation so the repository feels deliberate and easy to review.

### Files Likely To Be Created Or Changed

- Any touched implementation files
- `README.md`
- `docs/*.md`

### Tasks

- Review naming consistency across files, stores, selectors, and components
- Polish spacing, alignment, and visual hierarchy in the dashboard
- Review dark-mode consistency, contrast, and the overall dashboard feel
- Review animation behavior and remove any motion that hurts readability or update performance
- Run typecheck, lint, and build
- Remove unnecessary complexity or duplicate logic
- Do a final README and docs review for clarity and accuracy

### Acceptance Criteria

- The project passes validation checks that are available in the toolchain
- The codebase feels compact and coherent
- No obvious leftover scaffold code or naming drift remains
- Visual polish and motion feel intentional, restrained, and consistent with the project direction

### Notes / Risks

- Cleanup work is easy to underestimate late in a project
- Final polish should simplify the repository, not add more layers

### Validation

- Run lint, typecheck, and build checks that are available in the project
- Summarize created or changed files before closing the phase
- Stop after the phase is complete and confirm the repository is coherent and review-ready

## Suggested Delivery Order

1. Establish the project baseline
2. Define the domain model and seed data
3. Create the state boundaries
4. Build the realtime engine and adapter
5. Add connection lifecycle behavior
6. Build the dashboard sections
7. Review performance
8. Finalize the docs and cleanup pass
