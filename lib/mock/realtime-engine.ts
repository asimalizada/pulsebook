import {
  INITIAL_SEQUENCE,
  PRIMARY_SYMBOL,
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

export interface RealtimeEngine {
  start(): void;
  stop(): void;
  isRunning(): boolean;
}

type TimerHandle = ReturnType<typeof setInterval>;

class PulsebookRealtimeEngine implements RealtimeEngine {
  private intervalId: TimerHandle | null = null;
  private running = false;
  private readonly scenario = createScenarioController();
  private currentSequence = INITIAL_SEQUENCE;

  start() {
    if (this.running) {
      return;
    }

    this.running = true;
    this.scenario.reset();
    this.currentSequence = useMarketStore.getState().latestStreamSequence ?? INITIAL_SEQUENCE;

    this.emitBootstrapEvents();

    this.intervalId = setInterval(() => {
      this.emitIncrementalEvents();
    }, STREAM_TICK_INTERVAL_MS);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.running = false;
  }

  isRunning() {
    return this.running;
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
    if (!this.running) {
      return;
    }

    const step = this.scenario.nextStep();
    const priceEvent = this.createPriceTickEvent(step.priceTick);
    const orderbookDeltaEvent = this.createOrderbookDeltaEvent(step.orderbookDelta);

    applyRealtimeEvent(priceEvent);
    applyRealtimeEvent(orderbookDeltaEvent);
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
    return {
      ...this.createMeta("connection.state"),
      payload: {
        status,
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
