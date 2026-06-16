# Tradeoffs

## Mocked Stream Instead Of A Real API

Pulsebook uses a mocked real-time engine rather than a live exchange connection.

That keeps the repository easy to run, easy to review, and focused on frontend architecture instead of credentials, backend infrastructure, or market integration details.

## Single Global Mock Stream Sequence

The current demo uses one global mock stream sequence across all event types.

That keeps event ordering easy to follow in a compact reference project. A larger production system would often track sequencing with more channel or feed-specific scope.

## Compact Scenario Controller

The scenario controller is intentionally small.

It supports:

- bootstrap state
- incremental updates
- disconnect
- reconnect
- forced stale behavior

That is enough to demonstrate lifecycle and resync behavior without building a larger scenario framework.

## Dark-Only UI

Pulsebook currently ships with a dark-only dashboard.

That keeps the visual system focused and consistent for this reference surface. A broader product version could add theme support and more accessibility-driven theme tokens.

## What A Larger Production System Could Add

A more complete system could extend the current design with:

- real exchange adapters
- per-channel sequence tracking
- symbol switching across a wider instrument set
- stronger recovery behavior for partial resync paths
- deeper observability and event logging
- virtualization for larger tables
- more formal testing around stream scenarios

The current implementation keeps the scope compact so the core frontend decisions remain easy to inspect.
