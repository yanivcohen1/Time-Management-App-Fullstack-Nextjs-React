"use client";

import { Box, IconButton, Tooltip } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useThemeMode } from "@/hooks/useThemeMode";

export function ThemeToggle() {
  const { mode, toggleMode } = useThemeMode();
  const isDark = mode === "dark";

  return (
    <Box sx={{ position: "fixed", top: 16, right: 16, zIndex: (theme) => theme.zIndex.tooltip + 1 }}>
      <Tooltip title={isDark ? "Switch to light mode" : "Switch to dark mode"} placement="left">
        <IconButton
          aria-label={isDark ? "Activate light mode" : "Activate dark mode"}
          color="default"
          onClick={toggleMode}
          size="large"
          sx={{
            bgcolor: (theme) => theme.palette.background.paper,
            border: (theme) => `1px solid ${theme.palette.divider}`,
            "&:hover": {
              bgcolor: (theme) => theme.palette.action.hover
            }
          }}
        >
          {isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </IconButton>
      </Tooltip>
    </Box>
  );
}
