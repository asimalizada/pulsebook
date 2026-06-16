# Realtime State

## Store Boundaries

Pulsebook uses two Zustand stores.

### Market Store

`lib/stores/market-store.ts` holds server-driven or stream-driven state:

- orderbooks by symbol
- latest prices by symbol
- positions
- connection status
- last market event timestamp
- latest stream sequence
- stale-data flag

### UI Store

`lib/stores/ui-store.ts` holds local presentation state:

- selected symbol
- density mode
- debug panel visibility

External market truth does not live in the UI store.

## Event Flow

The mocked stream starts from `components/dashboard/pulsebook-dashboard.tsx`, but the stream logic itself lives in `lib/mock/realtime-engine.ts`.

Flow:

1. The realtime engine starts
2. It emits typed events
3. `applyRealtimeEvent` routes each event to the correct market-store action
4. The market store accepts or rejects the event based on sequence metadata
5. Components render subscribed slices and derived selectors

## Snapshot And Delta Model

Pulsebook uses:

- `orderbook.snapshot` for bootstrap and reconnect resync
- `orderbook.delta` for incremental ladder updates
- `positions.snapshot` for position state
- `price.tick` for latest market price changes
- `connection.state` for lifecycle transitions

That keeps initial state and incremental updates separate.

## Sequence Handling

Each real-time event carries:

- `type`
- `symbol`
- `seq`
- `ts`

Pulsebook currently models one global mock stream sequence across the demo stream. Incoming events are ignored if their sequence is not newer than the latest accepted stream sequence.

That keeps stale or out-of-order events from overwriting newer market state.

## Stale Data Detection

The realtime engine runs a health check loop and compares the latest market-event timestamp against a stale threshold.

If the threshold is exceeded while the stream is otherwise connected, the engine emits a `connection.state` event with `stale`.

The store keeps both:

- `connectionStatus`
- `isStale`

The current implementation uses `isStale` as a freshness signal and `connectionStatus` as the lifecycle label shown in the UI.

## Reconnect And Resync

The stream control path supports:

- disconnect
- reconnect
- force stale

On reconnect:

1. the stream moves to `reconnecting`
2. the scenario controller resets its mock market state
3. fresh bootstrap events are emitted again
4. normal market updates resume

This gives the demo a clear resync path without adding backend infrastructure.
