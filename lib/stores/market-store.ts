import { create } from "zustand";

import {
  INITIAL_CONNECTION_EVENT,
  INITIAL_ORDERBOOK,
  INITIAL_POSITIONS,
  INITIAL_PRICE_TICKS,
  INSTRUMENTS,
} from "@/lib/mock/mock-data";
import type {
  ConnectionStatus,
  Instrument,
  OrderbookLevel,
  OrderbookSnapshot,
  PriceTick,
  TradingSymbol,
} from "@/lib/types/market";
import type { Position } from "@/lib/types/positions";
import type {
  ConnectionStateEvent,
  OrderbookDeltaEvent,
  OrderbookSnapshotEvent,
  PositionsSnapshotEvent,
  PriceTickEvent,
} from "@/lib/types/realtime";
import { isNewerSequence } from "@/lib/utils/sequence";

export interface MarketStoreState {
  instruments: Record<TradingSymbol, Instrument>;
  orderbooksBySymbol: Partial<Record<TradingSymbol, OrderbookSnapshot>>;
  latestPricesBySymbol: Partial<Record<TradingSymbol, PriceTick>>;
  positions: Position[];
  connectionStatus: ConnectionStatus;
  lastMessageTimestamp: number | null;
  // Pulsebook currently models a single mock stream sequence across all event types.
  latestStreamSequence: number | null;
  isStale: boolean;
}

export interface MarketStoreActions {
  applyOrderbookSnapshot: (event: OrderbookSnapshotEvent) => void;
  applyOrderbookDelta: (event: OrderbookDeltaEvent) => void;
  applyPriceTick: (event: PriceTickEvent) => void;
  applyPositionsSnapshot: (event: PositionsSnapshotEvent) => void;
  updateConnectionState: (event: ConnectionStateEvent) => void;
  updateStreamMeta: (seq: number, ts: number) => void;
  setStale: (isStale: boolean) => void;
}

export type MarketStore = MarketStoreState & MarketStoreActions;

function createInstrumentRecord(instruments: Instrument[]) {
  return instruments.reduce<Record<TradingSymbol, Instrument>>((record, instrument) => {
    record[instrument.symbol] = instrument;

    return record;
  }, {} as Record<TradingSymbol, Instrument>);
}

const initialState: MarketStoreState = {
  instruments: createInstrumentRecord(INSTRUMENTS),
  orderbooksBySymbol: {
    [INITIAL_ORDERBOOK.symbol]: INITIAL_ORDERBOOK,
  },
  latestPricesBySymbol: INITIAL_PRICE_TICKS,
  positions: INITIAL_POSITIONS,
  connectionStatus: INITIAL_CONNECTION_EVENT.payload.status,
  lastMessageTimestamp: INITIAL_CONNECTION_EVENT.ts,
  latestStreamSequence: INITIAL_CONNECTION_EVENT.seq,
  isStale: false,
};

function shouldApplyEvent(nextSeq: number, currentStreamSeq: number | null) {
  return isNewerSequence(nextSeq, currentStreamSeq);
}

function mergeOrderbookSide(
  currentLevels: OrderbookLevel[],
  updates: OrderbookLevel[],
  sortDirection: "asc" | "desc",
) {
  const byPrice = new Map<number, OrderbookLevel>(currentLevels.map((level) => [level.price, { ...level }]));

  for (const update of updates) {
    if (update.size <= 0) {
      byPrice.delete(update.price);
      continue;
    }

    byPrice.set(update.price, { ...update });
  }

  return [...byPrice.values()].sort((left, right) =>
    sortDirection === "desc" ? right.price - left.price : left.price - right.price,
  );
}

export const useMarketStore = create<MarketStore>()((set) => ({
  ...initialState,
  applyOrderbookSnapshot: (event) =>
    set((state) => {
      if (!shouldApplyEvent(event.seq, state.latestStreamSequence)) {
        return state;
      }

      return {
        orderbooksBySymbol: {
          ...state.orderbooksBySymbol,
          [event.symbol]: event.payload,
        },
        lastMessageTimestamp: event.ts,
        latestStreamSequence: event.seq,
        isStale: false,
      };
    }),
  applyOrderbookDelta: (event) =>
    set((state) => {
      if (!shouldApplyEvent(event.seq, state.latestStreamSequence)) {
        return state;
      }

      const currentSnapshot = state.orderbooksBySymbol[event.symbol];

      if (!currentSnapshot) {
        return state;
      }

      const bidUpdates = event.payload.changes.filter((change) => change.side === "bid");
      const askUpdates = event.payload.changes.filter((change) => change.side === "ask");

      return {
        orderbooksBySymbol: {
          ...state.orderbooksBySymbol,
          [event.symbol]: {
            symbol: event.symbol,
            bids: mergeOrderbookSide(currentSnapshot.bids, bidUpdates, "desc"),
            asks: mergeOrderbookSide(currentSnapshot.asks, askUpdates, "asc"),
          },
        },
        lastMessageTimestamp: event.ts,
        latestStreamSequence: event.seq,
        isStale: false,
      };
    }),
  applyPriceTick: (event) =>
    set((state) => {
      if (!shouldApplyEvent(event.seq, state.latestStreamSequence)) {
        return state;
      }

      return {
        latestPricesBySymbol: {
          ...state.latestPricesBySymbol,
          [event.symbol]: event.payload,
        },
        lastMessageTimestamp: event.ts,
        latestStreamSequence: event.seq,
        isStale: false,
      };
    }),
  applyPositionsSnapshot: (event) =>
    set((state) => {
      if (!shouldApplyEvent(event.seq, state.latestStreamSequence)) {
        return state;
      }

      return {
        positions: event.payload.positions,
        lastMessageTimestamp: event.ts,
        latestStreamSequence: event.seq,
        isStale: false,
      };
    }),
  updateConnectionState: (event) =>
    set((state) => {
      if (!shouldApplyEvent(event.seq, state.latestStreamSequence)) {
        return state;
      }

      return {
        connectionStatus: event.payload.status,
        lastMessageTimestamp: event.ts,
        latestStreamSequence: event.seq,
        isStale: event.payload.status === "stale",
      };
    }),
  updateStreamMeta: (seq, ts) =>
    set((state) => {
      if (!shouldApplyEvent(seq, state.latestStreamSequence)) {
        return state;
      }

      return {
        lastMessageTimestamp: ts,
        latestStreamSequence: seq,
        isStale: false,
      };
    }),
  setStale: (isStale) =>
    set({
      isStale,
    }),
}));
