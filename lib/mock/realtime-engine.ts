import {
  INITIAL_SEQUENCE,
  PRIMARY_SYMBOL,
  STREAM_HEALTH_CHECK_INTERVAL_MS,
  STREAM_RECONNECT_DELAY_MS,
  STREAM_STALE_AFTER_MS,
  STREAM_TICK_INTERVAL_MS,
} from "@/lib/mock/mock-data";
import { createScenarioController } from "@/lib/mock/scenario-controller";
import { useMarketStore } from "@/lib/stores/market-store";
import type {
  ConnectionStateEvent,
  OrderbookDeltaEvent,
  OrderbookSnapshotEvent,
  PositionsSnapshotEvent,
  PriceTickEvent,
  RealtimeEvent,
  RealtimeEventType,
} from "@/lib/types/realtime";
import { nextSequence } from "@/lib/utils/sequence";
import { hasExceededThreshold } from "@/lib/utils/time";

export interface RealtimeEngine {
  start(): void;
  stop(): void;
  isRunning(): boolean;
  simulateDisconnect(): void;
  reconnect(): void;
  forceStale(): void;
}

type TimerHandle = ReturnType<typeof setInterval>;
type TimeoutHandle = ReturnType<typeof setTimeout>;

class PulsebookRealtimeEngine implements RealtimeEngine {
  private marketIntervalId: TimerHandle | null = null;
  private healthIntervalId: TimerHandle | null = null;
  private reconnectTimeoutId: TimeoutHandle | null = null;
  private running = false;
  private readonly scenario = createScenarioController();
  private currentSequence = INITIAL_SEQUENCE;

  start() {
    if (this.running) {
      return;
    }

    this.running = true;
    this.scenario.start();
    this.currentSequence = useMarketStore.getState().latestStreamSequence ?? INITIAL_SEQUENCE;

    this.emitBootstrapEvents();
    this.startMarketLoop();
    this.startHealthLoop();
  }

  stop() {
    if (!this.running) {
      return;
    }

    this.clearMarketLoop();
    this.clearHealthLoop();
    this.clearReconnectTimeout();
    this.scenario.stop();
    this.running = false;
    applyRealtimeEvent(this.createConnectionStateEvent("disconnected"));
  }

  isRunning() {
    return this.running;
  }

  simulateDisconnect() {
    if (!this.running) {
      return;
    }

    this.clearMarketLoop();
    this.clearReconnectTimeout();
    this.scenario.simulateDisconnect();
    applyRealtimeEvent(this.createConnectionStateEvent("disconnected"));
  }

  reconnect() {
    if (!this.running || this.reconnectTimeoutId) {
      return;
    }

    this.clearMarketLoop();
    applyRealtimeEvent(this.createConnectionStateEvent("reconnecting"));

    this.reconnectTimeoutId = setTimeout(() => {
      this.reconnectTimeoutId = null;

      if (!this.running) {
        return;
      }

      this.scenario.reconnect();
      this.emitBootstrapEvents();
      this.startMarketLoop();
    }, STREAM_RECONNECT_DELAY_MS);
  }

  forceStale() {
    if (!this.running) {
      return;
    }

    this.scenario.forceStale();
  }

  private emitBootstrapEvents() {
    const bootstrap = this.scenario.getBootstrapState();

    const connectionEvent = this.createConnectionStateEvent("connected");
    const orderbookEvent = this.createOrderbookSnapshotEvent(bootstrap.orderbookSnapshot);
    const positionsEvent = this.createPositionsSnapshotEvent(bootstrap.positions);
    const priceEvent = this.createPriceTickEvent(bootstrap.priceTick);

    for (const event of [connectionEvent, orderbookEvent, positionsEvent, priceEvent]) {
      applyRealtimeEvent(event);
    }
  }

  private emitIncrementalEvents() {
    if (!this.running || !this.scenario.canEmitMarketEvents()) {
      return;
    }

    const step = this.scenario.nextStep();

    if (!step) {
      return;
    }

    const priceEvent = this.createPriceTickEvent(step.priceTick);
    const orderbookDeltaEvent = this.createOrderbookDeltaEvent(step.orderbookDelta);

    applyRealtimeEvent(priceEvent);
    applyRealtimeEvent(orderbookDeltaEvent);
  }

  private startMarketLoop() {
    if (this.marketIntervalId) {
      return;
    }

    this.marketIntervalId = setInterval(() => {
      this.emitIncrementalEvents();
    }, STREAM_TICK_INTERVAL_MS);
  }

  private clearMarketLoop() {
    if (!this.marketIntervalId) {
      return;
    }

    clearInterval(this.marketIntervalId);
    this.marketIntervalId = null;
  }

  private startHealthLoop() {
    if (this.healthIntervalId) {
      return;
    }

    this.healthIntervalId = setInterval(() => {
      this.checkForStaleStream();
    }, STREAM_HEALTH_CHECK_INTERVAL_MS);
  }

  private clearHealthLoop() {
    if (!this.healthIntervalId) {
      return;
    }

    clearInterval(this.healthIntervalId);
    this.healthIntervalId = null;
  }

  private clearReconnectTimeout() {
    if (!this.reconnectTimeoutId) {
      return;
    }

    clearTimeout(this.reconnectTimeoutId);
    this.reconnectTimeoutId = null;
  }

  private checkForStaleStream() {
    if (!this.running) {
      return;
    }

    const marketState = useMarketStore.getState();

    if (marketState.connectionStatus !== "connected") {
      return;
    }

    if (!hasExceededThreshold(marketState.lastMarketEventTimestamp, Date.now(), STREAM_STALE_AFTER_MS)) {
      return;
    }

    applyRealtimeEvent(this.createConnectionStateEvent("stale"));
  }

  private createMeta<TType extends RealtimeEventType>(type: TType) {
    this.currentSequence = nextSequence(this.currentSequence);

    return {
      type,
      symbol: PRIMARY_SYMBOL,
      seq: this.currentSequence,
      ts: Date.now(),
    };
  }

  private createConnectionStateEvent(status: ConnectionStateEvent["payload"]["status"]): ConnectionStateEvent {
    const marketState = useMarketStore.getState();

    return {
      ...this.createMeta("connection.state"),
      payload: {
        status,
        lastMarketEventTimestamp: marketState.lastMarketEventTimestamp,
      },
    };
  }

  private createOrderbookSnapshotEvent(
    payload: OrderbookSnapshotEvent["payload"],
  ): OrderbookSnapshotEvent {
    return {
      ...this.createMeta("orderbook.snapshot"),
      payload,
    };
  }

  private createOrderbookDeltaEvent(payload: OrderbookDeltaEvent["payload"]["changes"]): OrderbookDeltaEvent {
    return {
      ...this.createMeta("orderbook.delta"),
      payload: {
        changes: payload,
      },
    };
  }

  private createPositionsSnapshotEvent(payload: PositionsSnapshotEvent["payload"]["positions"]): PositionsSnapshotEvent {
    return {
      ...this.createMeta("positions.snapshot"),
      payload: {
        positions: payload,
      },
    };
  }

  private createPriceTickEvent(payload: PriceTickEvent["payload"]): PriceTickEvent {
    return {
      ...this.createMeta("price.tick"),
      payload,
    };
  }
}

export function applyRealtimeEvent(event: RealtimeEvent) {
  const marketStore = useMarketStore.getState();

  switch (event.type) {
    case "connection.state":
      marketStore.updateConnectionState(event);
      break;
    case "orderbook.snapshot":
      marketStore.applyOrderbookSnapshot(event);
      break;
    case "orderbook.delta":
      marketStore.applyOrderbookDelta(event);
      break;
    case "positions.snapshot":
      marketStore.applyPositionsSnapshot(event);
      break;
    case "price.tick":
      marketStore.applyPriceTick(event);
      break;
  }
}

let sharedRealtimeEngine: PulsebookRealtimeEngine | null = null;

export function getPulsebookRealtimeEngine() {
  if (!sharedRealtimeEngine) {
    sharedRealtimeEngine = new PulsebookRealtimeEngine();
  }

  return sharedRealtimeEngine;
}

export function startPulsebookRealtimeEngine() {
  const engine = getPulsebookRealtimeEngine();
  engine.start();

  return engine;
}

export function stopPulsebookRealtimeEngine() {
  sharedRealtimeEngine?.stop();
}
