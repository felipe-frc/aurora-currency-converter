import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ThemeProvider } from "@/contexts/ThemeContext";

describe("ThemeToggle", () => {
  it("deve renderizar o botão para ativar tema claro quando o tema atual for escuro", () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeToggle />
      </ThemeProvider>
    );

    expect(
      screen.getByRole("button", { name: /ativar tema claro/i })
    ).toBeInTheDocument();
  });

  it("deve alternar para tema claro ao clicar no botão", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider defaultTheme="dark">
        <ThemeToggle />
      </ThemeProvider>
    );

    await user.click(
      screen.getByRole("button", { name: /ativar tema claro/i })
    );

    expect(
      screen.getByRole("button", { name: /ativar tema escuro/i })
    ).toBeInTheDocument();

    expect(document.documentElement.classList.contains("light")).toBe(true);
  });
});