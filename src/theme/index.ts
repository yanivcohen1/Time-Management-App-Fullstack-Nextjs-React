import { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const baseTokens = {
  shape: {
    borderRadius: 10
  },
  typography: {
    fontFamily: "var(--font-rubik, 'Rubik', system-ui)"
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained"
      }
    }
  }
} as const;

export function createAppTheme(mode: PaletteMode) {
  return createTheme({
    ...baseTokens,
    palette: {
      mode,
      primary: {
        main: "#8E44FF"
      },
      secondary: {
        main: "#2ECC71"
      },
      background:
        mode === "dark"
          ? { default: "#09090b", paper: "#111113" }
          : { default: "#f5f5f7", paper: "#ffffff" },
      text:
        mode === "dark"
          ? { primary: "#f4f4f5", secondary: "#c1c1cb" }
          : { primary: "#0f0f11", secondary: "#575764" }
    }
  });
}

export type AppThemeMode = PaletteMode;
