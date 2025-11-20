"use client";

import { createContext, useContext } from "react";
import type { PaletteMode } from "@mui/material";

export type ThemeModeContextValue = {
  mode: PaletteMode;
  toggleMode: () => void;
};

export const ThemeModeContext = createContext<ThemeModeContextValue | undefined>(undefined);

export function useThemeMode() {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within the ThemeModeContext provider");
  }
  return context;
}
