import { test, expect } from "@playwright/test";

const demoCredentials = {
  email: "demo@todo.dev",
  password: "ChangeMe123!"
};

const demoUser = {
  id: "user-demo",
  name: "Demo User",
  email: demoCredentials.email,
  role: "admin"
};

const seedTodos = [
  {
    id: "todo-1",
    title: "Prep weekly board",
    status: "PENDING",
    dueDate: "2025-07-01T00:00:00.000Z"
  },
  {
    id: "todo-2",
    title: "Ship refreshed UI",
    status: "COMPLETED",
    dueDate: "2025-07-03T00:00:00.000Z"
  }
];

test.describe("auth flows", () => {
  test("register form enforces validation rules", async ({ page }) => {
    await page.goto("/register");

    await page.getByRole("button", { name: "Create account" }).click();

    await expect(page.getByText("String must contain at least 2 character(s)")).toBeVisible();
    await expect(page.getByText("Invalid email")).toBeVisible();
    await expect(page.getByText("Password must be at least 8 characters")).toBeVisible();
  });

  test("demo login helper signs the user in", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
      const payload = await route.request().postDataJSON();
      expect(payload).toMatchObject(demoCredentials);

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          accessToken: "TEST_ACCESS_TOKEN",
          refreshToken: "TEST_REFRESH_TOKEN",
          user: demoUser
        })
      });
    });

    await page.route("**/api/auth/profile", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ user: demoUser })
      });
    });

    await page.route("**/api/auth/todos*", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ todos: seedTodos, total: seedTodos.length })
      });
    });

    await page.goto("/login");

    await page.getByRole("button", { name: "Log demo" }).click();
    await expect(page.getByLabel("Email")).toHaveValue(demoCredentials.email);
    await expect(page.getByLabel("Password")).toHaveValue(demoCredentials.password);

    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/main$/);
    await expect(page.getByRole("heading", { level: 2, name: "Main status board" })).toBeVisible();

    const storedTokens = await page.evaluate(() => ({
      access: window.localStorage.getItem("todo-app.access"),
      refresh: window.localStorage.getItem("todo-app.refresh")
    }));
    expect(storedTokens.access).toBe("TEST_ACCESS_TOKEN");
    expect(storedTokens.refresh).toBe("TEST_REFRESH_TOKEN");

    await expect(page.getByText("Dates by workload")).toBeVisible();
    await expect(page.getByText("Completed").first()).toBeVisible();
  });
});
