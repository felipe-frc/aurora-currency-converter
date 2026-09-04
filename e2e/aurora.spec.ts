import { expect, test } from "@playwright/test";

test.describe("Aurora Currency Converter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("carrega a aplicação corretamente", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Aurora" })).toBeVisible();

    await expect(page.locator("#amount")).toBeVisible();

    await expect(
      page.getByRole("button", { name: /converter/i }),
    ).toBeVisible();
  });

  test("permite preencher o valor da conversão", async ({ page }) => {
    const amountInput = page.locator("#amount");

    await amountInput.fill("100");

    await expect(amountInput).toHaveValue("100");
  });

  test("permite trocar o tema da aplicação", async ({ page }) => {
    const html = page.locator("html");

    const initialClass = await html.getAttribute("class");

    const themeButton = page.locator(
      'button[aria-label*="tema" i], button[aria-label*="theme" i]',
    );

    await themeButton.click();

    const updatedClass = await html.getAttribute("class");

    expect(updatedClass).not.toBe(initialClass);
  });

  test("permite trocar o idioma da aplicação", async ({ page }) => {
    const html = page.locator("html");

    const initialLanguage = await html.getAttribute("lang");

    const languageButton = page.locator(
      'button[aria-label*="idioma" i], button[aria-label*="language" i]',
    );

    await languageButton.click();

    const updatedLanguage = await html.getAttribute("lang");

    expect(updatedLanguage).not.toBe(initialLanguage);
  });

  test("realiza conversão com resposta mockada da API", async ({ page }) => {
    await page.route("**/latest/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          base: "BRL",
          rates: {
            USD: 0.2,
          },
        }),
      });
    });

    const amountInput = page.locator("#amount");

    await amountInput.fill("100");

    await page.getByRole("button", { name: /converter/i }).click();

    await expect(page.getByText("US$ 20,00", { exact: true })).toBeVisible();
  });
});
