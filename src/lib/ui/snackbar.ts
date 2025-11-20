export type SnackbarSeverity = "success" | "info" | "warning" | "error";

export type SnackbarMessage = {
  message: string;
  severity?: SnackbarSeverity;
};

type Listener = (message: SnackbarMessage) => void;

const listeners = new Set<Listener>();

export const snackbarStore = {
  subscribe(callback: Listener) {
    listeners.add(callback);
    return () => {
      listeners.delete(callback);
    };
  },
  publish(message: SnackbarMessage) {
    listeners.forEach((listener) => {
      listener(message);
    });
  }
};

export const showSnackbar = (message: SnackbarMessage) => {
  snackbarStore.publish(message);
};
