"use client";

import { ReactNode, useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { CssBaseline, ThemeProvider, PaletteMode, useMediaQuery } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { createAppTheme } from "@/theme";
import { SnackbarProvider } from "@/components/common/SnackbarProvider";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ThemeModeContext } from "@/hooks/useThemeMode";

export function RootProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 30_000
          }
        }
      })
  );

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
    defaultMatches: true
  });
  const [mode, setMode] = useState<PaletteMode>(prefersDarkMode ? "dark" : "light");

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <AppRouterCacheProvider options={{ enableCssLayering: true }}>
      <ThemeModeContext.Provider value={{ mode, toggleMode }}>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
              <SnackbarProvider>
                <ThemeToggle />
                {children}
                <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
              </SnackbarProvider>
            </QueryClientProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </ThemeModeContext.Provider>
    </AppRouterCacheProvider>
  );
}
