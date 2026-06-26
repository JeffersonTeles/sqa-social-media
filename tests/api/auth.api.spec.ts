import { expect, test } from "@playwright/test";

const API_URL = "http://127.0.0.1:18081";
const PASSWORD = "Senha@123";

function uniqueEmail(prefix: string): string {
  return `${prefix}.${Date.now()}@teste.com`;
}

test.describe("API de autenticacao", () => {
  test("cadastra usuario com dados validos", async ({ request }) => {
    const email = uniqueEmail("cadastro");
    const response = await request.post(`${API_URL}/auth/signup`, {
      data: { email, password: PASSWORD },
    });

    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ email });
  });

  test("rejeita cadastro com email duplicado", async ({ request }) => {
    const email = uniqueEmail("duplicado");
    await request.post(`${API_URL}/auth/signup`, {
      data: { email, password: PASSWORD },
    });

    const response = await request.post(`${API_URL}/auth/signup`, {
      data: { email, password: PASSWORD },
    });

    expect(response.status()).toBe(409);
    await expect(response.json()).resolves.toMatchObject({
      status: 409,
    });
  });

  test("autentica usuario com credenciais corretas", async ({ request }) => {
    const email = uniqueEmail("login");
    await request.post(`${API_URL}/auth/signup`, {
      data: { email, password: PASSWORD },
    });

    const response = await request.post(`${API_URL}/auth/signin`, {
      data: { email, password: PASSWORD },
    });

    expect(response.status()).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ email });
  });

  test("rejeita credenciais incorretas", async ({ request }) => {
    const email = uniqueEmail("invalido");
    await request.post(`${API_URL}/auth/signup`, {
      data: { email, password: PASSWORD },
    });

    const response = await request.post(`${API_URL}/auth/signin`, {
      data: { email, password: "Errada@123" },
    });

    expect(response.status()).toBe(401);
    await expect(response.json()).resolves.toMatchObject({
      message: "Credenciais inválidas",
      status: 401,
    });
  });
});
