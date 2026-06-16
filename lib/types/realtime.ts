import type {
  ConnectionStatus,
  OrderbookLevelDelta,
  OrderbookSnapshot,
  PriceTick,
  TradingSymbol,
} from "@/lib/types/market";
import type { Position } from "@/lib/types/positions";

export interface RealtimeEventMeta {
  type: RealtimeEventType;
  symbol: TradingSymbol;
  seq: number;
  ts: number;
}

export type RealtimeEventType =
  | "orderbook.snapshot"
  | "orderbook.delta"
  | "price.tick"
  | "positions.snapshot"
  | "connection.state";

export interface OrderbookSnapshotEvent extends RealtimeEventMeta {
  type: "orderbook.snapshot";
  payload: OrderbookSnapshot;
}

export interface OrderbookDeltaEvent extends RealtimeEventMeta {
  type: "orderbook.delta";
  payload: {
    changes: OrderbookLevelDelta[];
  };
}

export interface PriceTickEvent extends RealtimeEventMeta {
  type: "price.tick";
  payload: PriceTick;
}

export interface PositionsSnapshotEvent extends RealtimeEventMeta {
  type: "positions.snapshot";
  payload: {
    positions: Position[];
  };
}

export interface ConnectionStateEvent extends RealtimeEventMeta {
  type: "connection.state";
  payload: {
    status: ConnectionStatus;
    lastMarketEventTimestamp?: number | null;
  };
}

export type RealtimeEvent =
  | OrderbookSnapshotEvent
  | OrderbookDeltaEvent
  | PriceTickEvent
  | PositionsSnapshotEvent
  | ConnectionStateEvent;
