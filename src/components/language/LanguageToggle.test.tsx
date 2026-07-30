import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { LanguageProvider } from "@/contexts/LanguageContext";

describe("LanguageToggle", () => {
  it("deve alternar o rótulo do idioma ao clicar no botão", async () => {
    const user = userEvent.setup();

    render(
      <LanguageProvider defaultLanguage="pt-BR">
        <LanguageToggle />
      </LanguageProvider>
    );

    expect(
      screen.getByRole("button", { name: /alterar idioma para inglês/i })
    ).toHaveTextContent("EN");

    await user.click(
      screen.getByRole("button", { name: /alterar idioma para inglês/i })
    );

    expect(
      screen.getByRole("button", { name: /change language to portuguese/i })
    ).toHaveTextContent("PT");
  });
});
