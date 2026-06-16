import {
  cloneOrderbookSnapshot,
  clonePositions,
  INITIAL_ORDERBOOK,
  INITIAL_POSITIONS,
  INITIAL_PRICE_TICKS,
  ORDERBOOK_DEPTH,
  PRIMARY_SYMBOL,
} from "@/lib/mock/mock-data";
import type { OrderbookLevelDelta, OrderbookSnapshot, PriceTick } from "@/lib/types/market";
import type { Position } from "@/lib/types/positions";

export interface BootstrapScenarioState {
  orderbookSnapshot: OrderbookSnapshot;
  positions: Position[];
  priceTick: PriceTick;
}

export interface MarketScenarioStep {
  priceTick: PriceTick;
  orderbookDelta: OrderbookLevelDelta[];
}

export interface ScenarioController {
  start(): void;
  stop(): void;
  reset(): void;
  getBootstrapState(): BootstrapScenarioState;
  nextStep(): MarketScenarioStep | null;
  simulateDisconnect(): void;
  reconnect(): void;
  forceStale(): void;
  canEmitMarketEvents(): boolean;
}

function roundPrice(value: number) {
  return Number(value.toFixed(2));
}

function roundSize(value: number) {
  return Number(value.toFixed(3));
}

class DefaultScenarioController implements ScenarioController {
  private snapshot = cloneOrderbookSnapshot(INITIAL_ORDERBOOK);
  private priceTick = { ...INITIAL_PRICE_TICKS[PRIMARY_SYMBOL] };
  private stepCount = 0;
  private streamAvailable = false;
  private marketUpdatesPaused = false;

  start() {
    this.streamAvailable = true;
    this.marketUpdatesPaused = false;
    this.reset();
  }

  stop() {
    this.streamAvailable = false;
    this.marketUpdatesPaused = false;
  }

  reset() {
    this.snapshot = cloneOrderbookSnapshot(INITIAL_ORDERBOOK);
    this.priceTick = { ...INITIAL_PRICE_TICKS[PRIMARY_SYMBOL] };
    this.stepCount = 0;
  }

  getBootstrapState(): BootstrapScenarioState {
    return {
      orderbookSnapshot: cloneOrderbookSnapshot(this.snapshot),
      positions: clonePositions(INITIAL_POSITIONS),
      priceTick: { ...this.priceTick },
    };
  }

  nextStep(): MarketScenarioStep | null {
    if (!this.canEmitMarketEvents()) {
      return null;
    }

    this.stepCount += 1;

    const direction = this.stepCount % 2 === 0 ? 1 : -1;
    const priceMove = direction * (0.35 + (this.stepCount % 3) * 0.1);
    const nextPrice = roundPrice(this.priceTick.price + priceMove);
    const nextChange24h = roundPrice(this.priceTick.change24h + direction * 0.02);

    this.priceTick = {
      ...this.priceTick,
      price: nextPrice,
      change24h: nextChange24h,
    };

    const nextBestBid = roundPrice(nextPrice - 0.3);
    const nextBestAsk = roundPrice(nextPrice + 0.3);

    const bidSize = roundSize(2.8 + (this.stepCount % 4) * 0.35);
    const askSize = roundSize(2.4 + ((this.stepCount + 1) % 4) * 0.32);

    const orderbookDelta: OrderbookLevelDelta[] = [
      { side: "bid", price: nextBestBid, size: bidSize },
      { side: "ask", price: nextBestAsk, size: askSize },
      {
        side: "bid",
        price: this.snapshot.bids[this.snapshot.bids.length - 1]?.price ?? roundPrice(nextBestBid - ORDERBOOK_DEPTH * 0.6),
        size: 0,
      },
      {
        side: "ask",
        price: this.snapshot.asks[this.snapshot.asks.length - 1]?.price ?? roundPrice(nextBestAsk + ORDERBOOK_DEPTH * 0.6),
        size: 0,
      },
    ];

    this.snapshot = {
      symbol: this.snapshot.symbol,
      bids: [
        { price: nextBestBid, size: bidSize },
        ...this.snapshot.bids.slice(0, ORDERBOOK_DEPTH - 1).map((level, index) => ({
          price: roundPrice(nextBestBid - (index + 1) * 0.6),
          size: roundSize(Math.max(0.5, level.size * (0.94 + (index % 2) * 0.03))),
        })),
      ],
      asks: [
        { price: nextBestAsk, size: askSize },
        ...this.snapshot.asks.slice(0, ORDERBOOK_DEPTH - 1).map((level, index) => ({
          price: roundPrice(nextBestAsk + (index + 1) * 0.7),
          size: roundSize(Math.max(0.4, level.size * (0.93 + ((index + 1) % 2) * 0.04))),
        })),
      ],
    };

    return {
      priceTick: { ...this.priceTick },
      orderbookDelta,
    };
  }

  simulateDisconnect() {
    this.streamAvailable = false;
    this.marketUpdatesPaused = false;
  }

  reconnect() {
    this.streamAvailable = true;
    this.marketUpdatesPaused = false;
    this.reset();
  }

  forceStale() {
    this.marketUpdatesPaused = true;
  }

  canEmitMarketEvents() {
    return this.streamAvailable && !this.marketUpdatesPaused;
  }
}

export function createScenarioController(): ScenarioController {
  return new DefaultScenarioController();
}
