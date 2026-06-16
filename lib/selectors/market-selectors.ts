import type { MarketStoreState } from "@/lib/stores/market-store";
import type { ConnectionStatus, Instrument, OrderbookSnapshot, PriceTick, TradingSymbol } from "@/lib/types/market";
import { formatRelativeUpdateTime, formatTimestamp } from "@/lib/utils/time";

export interface ConnectionSummary {
  status: ConnectionStatus;
  isStale: boolean;
  lastMessageTimestamp: number | null;
  latestStreamSequence: number | null;
}

export interface LastUpdateDisplay {
  absolute: string | null;
  relative: string | null;
}

export function selectInstruments(state: MarketStoreState) {
  return state.instruments;
}

export function selectInstrumentBySymbol(state: MarketStoreState, symbol: TradingSymbol): Instrument | undefined {
  return state.instruments[symbol];
}

export function selectOrderbookBySymbol(
  state: MarketStoreState,
  symbol: TradingSymbol,
): OrderbookSnapshot | undefined {
  return state.orderbooksBySymbol[symbol];
}

export function selectPriceTickBySymbol(state: MarketStoreState, symbol: TradingSymbol): PriceTick | undefined {
  return state.latestPricesBySymbol[symbol];
}

export function selectSelectedSymbolMarketData(state: MarketStoreState, symbol: TradingSymbol) {
  return {
    instrument: selectInstrumentBySymbol(state, symbol),
    orderbook: selectOrderbookBySymbol(state, symbol),
    priceTick: selectPriceTickBySymbol(state, symbol),
  };
}

export function selectSpread(state: MarketStoreState, symbol: TradingSymbol) {
  const orderbook = selectOrderbookBySymbol(state, symbol);
  const bestBid = orderbook?.bids[0]?.price;
  const bestAsk = orderbook?.asks[0]?.price;

  if (bestBid === undefined || bestAsk === undefined) {
    return null;
  }

  return bestAsk - bestBid;
}

export function selectMidPrice(state: MarketStoreState, symbol: TradingSymbol) {
  const orderbook = selectOrderbookBySymbol(state, symbol);
  const bestBid = orderbook?.bids[0]?.price;
  const bestAsk = orderbook?.asks[0]?.price;

  if (bestBid === undefined || bestAsk === undefined) {
    return null;
  }

  return (bestBid + bestAsk) / 2;
}

export function selectConnectionSummary(state: MarketStoreState): ConnectionSummary {
  return {
    status: state.connectionStatus,
    isStale: state.isStale,
    lastMessageTimestamp: state.lastMessageTimestamp,
    latestStreamSequence: state.latestStreamSequence,
  };
}

export function selectLastUpdateDisplay(state: MarketStoreState, now: number): LastUpdateDisplay {
  if (state.lastMessageTimestamp === null) {
    return {
      absolute: null,
      relative: null,
    };
  }

  return {
    absolute: formatTimestamp(state.lastMessageTimestamp),
    relative: formatRelativeUpdateTime(state.lastMessageTimestamp, now),
  };
}
