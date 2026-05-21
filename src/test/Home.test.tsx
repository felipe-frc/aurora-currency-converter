import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/pages/Home";

describe("Home", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("deve renderizar a tela principal do conversor", () => {
    render(<Home />);

    expect(screen.getByText("Aurora")).toBeInTheDocument();
    expect(screen.getByText("Conversor de Moedas Premium")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /converter/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /salvar par como favorito/i })
    ).toBeInTheDocument();
  });

  it("deve converter moedas usando a taxa retornada pela API", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        rates: {
          USD: 0.2,
        },
      }),
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<Home />);

    await user.click(screen.getByRole("button", { name: /converter/i }));

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.exchangerate-api.com/v4/latest/BRL"
    );

    expect(
      await screen.findByText("20.00 Dólar Americano")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Taxa de câmbio: 1 BRL = 0.2000 USD")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Histórico (1/50)")).toBeInTheDocument();
    });
  });
});