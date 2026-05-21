import { render, screen, waitFor, within } from "@testing-library/react";
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

    expect(await screen.findByText("20.00 Dólar Americano")).toBeInTheDocument();

    expect(
      screen.getByText("Taxa de câmbio: 1 BRL = 0.2000 USD")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Histórico (1/50)")).toBeInTheDocument();
    });
  });

  it("deve salvar o par de moedas atual como favorito", async () => {
    const user = userEvent.setup();

    render(<Home />);

    await user.click(
      screen.getByRole("button", { name: /salvar par como favorito/i })
    );

    expect(await screen.findByText("Favoritos (1/20)")).toBeInTheDocument();

    const favoritesSection = screen
      .getByText("Favoritos (1/20)")
      .closest("div")?.parentElement;

    expect(favoritesSection).toBeTruthy();

    expect(within(favoritesSection as HTMLElement).getByText("BRL")).toBeInTheDocument();
    expect(within(favoritesSection as HTMLElement).getByText("USD")).toBeInTheDocument();
  });

  it("deve carregar o histórico salvo no localStorage", async () => {
    const savedHistory = [
      {
        from: "BRL",
        to: "USD",
        amount: 100,
        result: 20,
        rate: 0.2,
        timestamp: "2026-05-21T12:00:00.000Z",
      },
    ];

    localStorage.setItem("currency_history", JSON.stringify(savedHistory));

    render(<Home />);

    expect(await screen.findByText("Histórico (1/50)")).toBeInTheDocument();
    expect(screen.getByText(/100.00/)).toBeInTheDocument();
    expect(screen.getByText(/20.00/)).toBeInTheDocument();
    expect(screen.getByText("Taxa: 1 BRL = 0.2000 USD")).toBeInTheDocument();
  });

  it("não deve chamar a API quando o valor informado for inválido", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();

    vi.stubGlobal("fetch", fetchMock);

    render(<Home />);

    const amountInput = screen.getByLabelText("Valor");

    await user.clear(amountInput);
    await user.type(amountInput, "0");
    await user.click(screen.getByRole("button", { name: /converter/i }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByText(/Taxa de câmbio:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Histórico/i)).not.toBeInTheDocument();
  });

  it("não deve exibir resultado nem histórico quando a API retornar erro", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<Home />);

    await user.click(screen.getByRole("button", { name: /converter/i }));

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.exchangerate-api.com/v4/latest/BRL"
    );

    await waitFor(() => {
      expect(screen.queryByText(/Taxa de câmbio:/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Histórico/i)).not.toBeInTheDocument();
    });
  });
});