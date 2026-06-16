import type { TradingSymbol } from "@/lib/types/market";

export type PositionSide = "long" | "short";

export interface Position {
  id: string;
  symbol: TradingSymbol;
  side: PositionSide;
  quantity: number;
  entryPrice: number;
  markPrice: number;
}
