import { expect, test } from "@playwright/test";

const API_URL = "http://127.0.0.1:18081";
const PASSWORD = "Senha@123";

function uniqueEmail(prefix: string): string {
  return `${prefix}.${Date.now()}@teste.com`;
}

test.describe("Fluxos de autenticacao", () => {
  test("usuario cria uma conta pela interface", async ({ page }) => {
    const email = uniqueEmail("e2e.cadastro");

    await page.goto("/signup");
    await page.getByPlaceholder("seu@email.com").fill(email);
    const passwordFields = page.getByPlaceholder("••••••••");
    await passwordFields.nth(0).fill(PASSWORD);
    await passwordFields.nth(1).fill(PASSWORD);
    await page.locator("form").getByRole("button", { name: "Criar Conta" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByRole("button", { name: "Sair" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Posts Curtidos" })).toBeVisible();
  });

  test("usuario existente entra e sai pela interface", async ({ page, request }) => {
    const email = uniqueEmail("e2e.login");
    const signup = await request.post(`${API_URL}/auth/signup`, {
      data: { email, password: PASSWORD },
    });
    expect(signup.ok()).toBeTruthy();

    await page.goto("/signin");
    await page.getByPlaceholder("seu@email.com").fill(email);
    await page.getByPlaceholder("••••••••").fill(PASSWORD);
    await page.locator("form").getByRole("button", { name: "Entrar" }).click();

    await expect(page).toHaveURL("/");
    await page.getByRole("button", { name: "Sair" }).click();
    await expect(page.getByRole("button", { name: "Entrar" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Criar Conta" })).toBeVisible();
  });
});
