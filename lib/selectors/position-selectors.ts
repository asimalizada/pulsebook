import type { MarketStoreState } from "@/lib/stores/market-store";
import type { PriceTick, TradingSymbol } from "@/lib/types/market";
import type { Position } from "@/lib/types/positions";

export interface PositionWithMarketData extends Position {
  markPrice: number | null;
  unrealizedPnl: number | null;
  exposure: number | null;
}

function getSignedQuantity(position: Position) {
  return position.side === "long" ? position.quantity : -position.quantity;
}

export function getPositionMarkPrice(position: Position, latestPrice?: PriceTick) {
  return latestPrice?.price ?? null;
}

export function getPositionUnrealizedPnl(position: Position, markPrice: number | null) {
  if (markPrice === null) {
    return null;
  }

  const markDifference = markPrice - position.entryPrice;
  const direction = position.side === "long" ? 1 : -1;

  return markDifference * position.quantity * direction;
}

export function getPositionExposure(position: Position, markPrice: number | null) {
  if (markPrice === null) {
    return null;
  }

  return Math.abs(position.quantity * markPrice);
}

export function selectPositions(state: MarketStoreState) {
  return state.positions;
}

export function selectPositionsBySymbol(state: MarketStoreState, symbol: TradingSymbol) {
  return state.positions.filter((position) => position.symbol === symbol);
}

export function selectNetPositionSize(state: MarketStoreState, symbol: TradingSymbol) {
  return selectPositionsBySymbol(state, symbol).reduce((total, position) => total + getSignedQuantity(position), 0);
}

export function selectPositionsWithMarketData(state: MarketStoreState): PositionWithMarketData[] {
  return state.positions.map((position) => {
    const markPrice = getPositionMarkPrice(position, state.latestPricesBySymbol[position.symbol]);
    const unrealizedPnl = getPositionUnrealizedPnl(position, markPrice);
    const exposure = getPositionExposure(position, markPrice);

    return {
      ...position,
      markPrice,
      unrealizedPnl,
      exposure,
    };
  });
}

export function selectPositionsWithMarketDataBySymbol(state: MarketStoreState, symbol: TradingSymbol) {
  return selectPositionsWithMarketData(state).filter((position) => position.symbol === symbol);
}

export function selectTotalExposure(state: MarketStoreState) {
  return state.positions.reduce((total, position) => {
    const exposure = getPositionExposure(position, getPositionMarkPrice(position, state.latestPricesBySymbol[position.symbol]));

    return total + (exposure ?? 0);
  }, 0);
}

export function selectExposureBySymbol(state: MarketStoreState, symbol: TradingSymbol) {
  return selectPositionsBySymbol(state, symbol).reduce((total, position) => {
    const exposure = getPositionExposure(position, getPositionMarkPrice(position, state.latestPricesBySymbol[position.symbol]));

    return total + (exposure ?? 0);
  }, 0);
}

export function selectTotalUnrealizedPnl(state: MarketStoreState) {
  return state.positions.reduce((total, position) => {
    const unrealizedPnl = getPositionUnrealizedPnl(
      position,
      getPositionMarkPrice(position, state.latestPricesBySymbol[position.symbol]),
    );

    return total + (unrealizedPnl ?? 0);
  }, 0);
}

export function selectUnrealizedPnlBySymbol(state: MarketStoreState, symbol: TradingSymbol) {
  return selectPositionsBySymbol(state, symbol).reduce((total, position) => {
    const unrealizedPnl = getPositionUnrealizedPnl(
      position,
      getPositionMarkPrice(position, state.latestPricesBySymbol[position.symbol]),
    );

    return total + (unrealizedPnl ?? 0);
  }, 0);
}
