# Performance

## Approach

Pulsebook treats performance as render discipline rather than aggressive optimization.

The goal is to keep frequent updates readable, predictable, and easy to reason about.

## Narrow Zustand Selectors

Components subscribe only to the slices they need.

Examples:

- header fields subscribe to connection and timestamp primitives
- summary cards subscribe to selected derived metrics
- stream controls subscribe to lifecycle-specific state

Where multiple values are needed together, shallow selection is used to avoid unnecessary rerenders from unrelated store updates.

## Derived Selectors And Helpers

Derived values stay outside store state where possible.

Examples:

- spread
- mid price
- exposure
- unrealized PnL
- formatted display values

This avoids duplicating data that can drift from the underlying market state.

## Render Isolation

The dashboard is split into feature-level components so high-frequency updates do not force a full-page rerender.

The current implementation tightens render isolation in a few places:

- memoized orderbook row rendering
- memoized position row rendering
- stable action callbacks in the stream panel
- memoized derived arrays where row formatting work is repeated

## Orderbook And Positions Considerations

The orderbook and positions table both deal with repeated row rendering, formatted numeric values, and frequent market updates.

The implementation keeps those areas practical:

- rows are derived once per relevant data change
- row components are memoized where that improves isolation
- formatting work is moved into memoized row view data where useful

## Why Optimization Stays Measured

Pulsebook is intentionally small, so performance work stays visible and restrained.

The project avoids:

- premature abstraction
- large optimization layers
- duplicated derived state
- complexity that would hide the core architecture

The result is a dashboard that demonstrates sensible update discipline without turning the codebase into a benchmarking exercise.
