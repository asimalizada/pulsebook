export type TradingSymbol = "BTC-USD" | "ETH-USD" | "SOL-USD";

export type OrderbookSide = "bid" | "ask";

export type ConnectionStatus = "connected" | "reconnecting" | "stale" | "disconnected";

export interface Instrument {
  symbol: TradingSymbol;
  baseAsset: string;
  quoteAsset: string;
  tickSize: number;
  sizePrecision: number;
  pricePrecision: number;
}

export interface OrderbookLevel {
  price: number;
  size: number;
}

export interface OrderbookLevelDelta extends OrderbookLevel {
  side: OrderbookSide;
}

export interface OrderbookSnapshot {
  symbol: TradingSymbol;
  bids: OrderbookLevel[];
  asks: OrderbookLevel[];
}

export interface PriceTick {
  symbol: TradingSymbol;
  price: number;
  change24h: number;
}
