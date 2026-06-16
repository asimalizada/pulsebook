import { create } from "zustand";

import { PRIMARY_SYMBOL } from "@/lib/mock/mock-data";
import type { TradingSymbol } from "@/lib/types/market";

export type DashboardDensity = "compact" | "comfortable";

export interface UiStoreState {
  selectedSymbol: TradingSymbol;
  density: DashboardDensity;
  isDebugPanelVisible: boolean;
}

export interface UiStoreActions {
  setSelectedSymbol: (symbol: TradingSymbol) => void;
  setDensity: (density: DashboardDensity) => void;
  setDebugPanelVisible: (isVisible: boolean) => void;
  toggleDebugPanel: () => void;
}

export type UiStore = UiStoreState & UiStoreActions;

const initialState: UiStoreState = {
  selectedSymbol: PRIMARY_SYMBOL,
  density: "compact",
  isDebugPanelVisible: true,
};

export const useUiStore = create<UiStore>()((set) => ({
  ...initialState,
  setSelectedSymbol: (selectedSymbol) => set({ selectedSymbol }),
  setDensity: (density) => set({ density }),
  setDebugPanelVisible: (isDebugPanelVisible) => set({ isDebugPanelVisible }),
  toggleDebugPanel: () => set((state) => ({ isDebugPanelVisible: !state.isDebugPanelVisible })),
}));
