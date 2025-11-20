"use client";

import { Box, IconButton, Tooltip, type SxProps, type Theme, type TooltipProps } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useThemeMode } from "@/hooks/useThemeMode";

type ThemeToggleProps = {
  variant?: "floating" | "inline";
  sx?: SxProps<Theme>;
};

export function ThemeToggle({ variant = "floating", sx }: ThemeToggleProps) {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";
  const tooltipPlacement: TooltipProps["placement"] = variant === "floating" ? "left" : "bottom";

  const button = (
    <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"} placement={tooltipPlacement}>
      <IconButton
        aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
        color="default"
        onClick={toggleMode}
        size="large"
        sx={{
          border: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: (theme) => (variant === "floating" ? theme.palette.background.paper : "transparent"),
          "&:hover": {
            bgcolor: (theme) =>
              variant === "floating" ? theme.palette.action.hover : theme.palette.action.selected
          }
        }}
      >
        {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );

  if (variant === "floating") {
    return (
      <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: (theme) => theme.zIndex.tooltip + 1, ...sx }}>
        {button}
      </Box>
    );
  }

  return (
    <Box sx={{ display: "inline-flex", ...sx }}>
      {button}
    </Box>
  );
}
