import type { Instrument, OrderbookSnapshot, PriceTick, TradingSymbol } from "@/lib/types/market";
import type { Position } from "@/lib/types/positions";
import type {
  ConnectionStateEvent,
  OrderbookSnapshotEvent,
  PositionsSnapshotEvent,
  PriceTickEvent,
} from "@/lib/types/realtime";

export const PRIMARY_SYMBOL: TradingSymbol = "BTC-USD";

export const INSTRUMENTS: Instrument[] = [
  {
    symbol: "BTC-USD",
    baseAsset: "BTC",
    quoteAsset: "USD",
    tickSize: 0.1,
    sizePrecision: 3,
    pricePrecision: 2,
  },
  {
    symbol: "ETH-USD",
    baseAsset: "ETH",
    quoteAsset: "USD",
    tickSize: 0.01,
    sizePrecision: 2,
    pricePrecision: 2,
  },
  {
    symbol: "SOL-USD",
    baseAsset: "SOL",
    quoteAsset: "USD",
    tickSize: 0.01,
    sizePrecision: 0,
    pricePrecision: 2,
  },
];

export const INITIAL_PRICE_TICKS: Record<TradingSymbol, PriceTick> = {
  "BTC-USD": {
    symbol: "BTC-USD",
    price: 67482.1,
    change24h: 2.84,
  },
  "ETH-USD": {
    symbol: "ETH-USD",
    price: 3586.4,
    change24h: 1.72,
  },
  "SOL-USD": {
    symbol: "SOL-USD",
    price: 165.9,
    change24h: -0.94,
  },
};

export const INITIAL_ORDERBOOK: OrderbookSnapshot = {
  symbol: "BTC-USD",
  bids: [
    { price: 67481.8, size: 4.2 },
    { price: 67481.2, size: 3.65 },
    { price: 67480.9, size: 2.75 },
    { price: 67480.3, size: 2.1 },
    { price: 67479.7, size: 1.6 },
    { price: 67479.1, size: 1.15 },
  ],
  asks: [
    { price: 67482.4, size: 2.9 },
    { price: 67483.1, size: 3.25 },
    { price: 67483.6, size: 2.1 },
    { price: 67484.2, size: 1.95 },
    { price: 67484.9, size: 1.35 },
    { price: 67485.4, size: 0.9 },
  ],
};

export const INITIAL_POSITIONS: Position[] = [
  {
    id: "pos-btc-long",
    symbol: "BTC-USD",
    side: "long",
    quantity: 1.8,
    entryPrice: 66920.5,
  },
  {
    id: "pos-eth-long",
    symbol: "ETH-USD",
    side: "long",
    quantity: 12,
    entryPrice: 3540.2,
  },
  {
    id: "pos-sol-short",
    symbol: "SOL-USD",
    side: "short",
    quantity: 420,
    entryPrice: 168.1,
  },
];

export const INITIAL_SEQUENCE = 184200;

export const INITIAL_TIMESTAMP = Date.UTC(2026, 5, 16, 10, 32, 18, 412);

export const INITIAL_ORDERBOOK_EVENT: OrderbookSnapshotEvent = {
  type: "orderbook.snapshot",
  symbol: "BTC-USD",
  seq: INITIAL_SEQUENCE,
  ts: INITIAL_TIMESTAMP,
  payload: INITIAL_ORDERBOOK,
};

export const INITIAL_PRICE_EVENT: PriceTickEvent = {
  type: "price.tick",
  symbol: "BTC-USD",
  seq: INITIAL_SEQUENCE + 1,
  ts: INITIAL_TIMESTAMP + 180,
  payload: INITIAL_PRICE_TICKS["BTC-USD"],
};

export const INITIAL_POSITIONS_EVENT: PositionsSnapshotEvent = {
  type: "positions.snapshot",
  symbol: "BTC-USD",
  seq: INITIAL_SEQUENCE + 2,
  ts: INITIAL_TIMESTAMP + 340,
  payload: {
    positions: INITIAL_POSITIONS,
  },
};

export const INITIAL_CONNECTION_EVENT: ConnectionStateEvent = {
  type: "connection.state",
  symbol: "BTC-USD",
  seq: INITIAL_SEQUENCE + 3,
  ts: INITIAL_TIMESTAMP + 500,
  payload: {
    status: "connected",
  },
};
