# Architecture

## Overview

Pulsebook is a compact single-page dashboard built to show how a real-time market UI can stay readable, typed, and predictable without turning into a large product surface.

The app keeps a small scope on purpose:

- orderbook
- positions
- PnL and summary metrics
- stream health and lifecycle controls

That smaller surface makes the architecture easier to inspect.

## High-Level Structure

- `app/layout.tsx` and `app/page.tsx` stay lightweight
- `components/dashboard/pulsebook-dashboard.tsx` owns the dashboard client boundary
- `components/dashboard/*` contains feature-level UI sections
- `lib/mock/*` contains mocked real-time stream behavior
- `lib/stores/*` contains Zustand state
- `lib/selectors/*` and `lib/utils/*` contain derived calculations and formatting helpers

## Component Boundaries

The UI is split by product boundaries rather than tiny JSX fragments.

Main dashboard sections:

- `DashboardHeader`
- `PnlSummary`
- `OrderbookPanel`
- `PositionsTable`
- `StreamDebugPanel`

Shared primitives stay limited to reusable pieces such as `Panel`, `MetricCard`, and `StatusPill`.

## Why Realtime Logic Stays Outside UI Components

The mock stream engine lives outside React components so the UI can stay focused on rendering state instead of owning timers, sequencing rules, or reconnect behavior.

That separation keeps a few responsibilities clear:

- the engine emits typed events
- the store applies accepted events
- selectors derive display-ready values
- components subscribe to what they need

## Why The Scope Is Compact

Pulsebook is not trying to model a full trading platform.

The project keeps a compact dashboard scope so a reader can quickly inspect:

- state boundaries
- event flow
- sequence handling
- connection lifecycle behavior
- render discipline under frequent updates
