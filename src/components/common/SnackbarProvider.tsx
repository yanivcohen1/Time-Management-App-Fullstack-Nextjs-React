"use client";

import { ReactNode, useEffect, useState } from "react";
import { Alert, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { snackbarStore, type SnackbarMessage } from "@/lib/ui/snackbar";

type SnackbarState = SnackbarMessage & { open: boolean };

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarState | null>(null);

  useEffect(() => {
    const unsubscribe = snackbarStore.subscribe((message) => {
      setSnackbar({ ...message, open: true });
    });

    return unsubscribe;
  }, []);

  const handleClose = (_?: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setSnackbar((current) => (current ? { ...current, open: false } : current));
  };

  return (
    <>
      {children}
      {snackbar ? (
        <Snackbar
          open={snackbar.open}
          autoHideDuration={5000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={snackbar.severity ?? "info"}
            variant="filled"
            action={
              <IconButton aria-label="Close" color="inherit" size="small" onClick={() => handleClose()}>
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      ) : null}
    </>
  );
}
