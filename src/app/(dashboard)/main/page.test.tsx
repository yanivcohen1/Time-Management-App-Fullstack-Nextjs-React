import { describe, it, beforeEach, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockUseSession = vi.fn();
const mockUseTodos = vi.fn();
const mockGetAccessToken = vi.fn();
const mockApiGet = vi.fn();
const mockShowSnackbar = vi.fn();

vi.mock("@/hooks/useAuth", () => ({
  useSession: () => mockUseSession()
}));

vi.mock("@/hooks/useTodos", () => ({
  useTodos: () => mockUseTodos()
}));

vi.mock("@/lib/http/token-storage", () => ({
  tokenStorage: {
    getAccessToken: () => mockGetAccessToken()
  }
}));

vi.mock("@/lib/http/client", () => ({
  api: {
    get: (...args: unknown[]) => mockApiGet(...args)
  }
}));

vi.mock("@/lib/ui/snackbar", () => ({
  showSnackbar: (...args: unknown[]) => mockShowSnackbar(...args)
}));

import MainPage from "./page";

describe("MainPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetAccessToken.mockReturnValue("token");
    mockUseSession.mockReturnValue({
      data: { user: { role: "admin", name: "Alice" } },
      isLoading: false,
      isError: false
    });
    mockUseTodos.mockReturnValue({
      data: { todos: [] },
      isLoading: false
    });
  });

  it("prompts for login when no session is available", () => {
    mockGetAccessToken.mockReturnValue(undefined);
    mockUseSession.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false
    });

    render(<MainPage />);

    expect(
      screen.getByText("Please sign in to review the main status board.")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go to login/i })).toBeInTheDocument();
  });

  it("shows admin info in the snackbar", async () => {
    const user = userEvent.setup();
    mockApiGet.mockResolvedValue({
      data: { info: { name: "Alice", role: "admin" } }
    });

    render(<MainPage />);

    await user.click(screen.getByRole("button", { name: /show user info/i }));

    await waitFor(() => {
      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: "Alice • Admin",
        severity: "info"
      });
    });
  });

  it("shows user info in the snackbar", async () => {
    const user = userEvent.setup();
    mockUseSession.mockReturnValue({
      data: { user: { role: "user", name: "Bob" } },
      isLoading: false,
      isError: false
    });
    mockApiGet.mockResolvedValue({
      data: { info: { name: "Bob", role: "user" } }
    });

    render(<MainPage />);

    await user.click(screen.getByRole("button", { name: /show user info/i }));

    await waitFor(() => {
      expect(mockShowSnackbar).toHaveBeenCalledWith({
        message: "Bob • User",
        severity: "info"
      });
    });
  });
});