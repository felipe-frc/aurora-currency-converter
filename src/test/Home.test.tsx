import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages/Home";

function renderHome() {
  return render(
    <LanguageProvider defaultLanguage="pt-BR">
      <Home />
    </LanguageProvider>
  );
}

describe("Home", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("deve renderizar a tela principal do conversor", () => {
    renderHome();

    expect(screen.getByText("Aurora")).toBeInTheDocument();
    expect(screen.getByText("Conversor de Moedas Premium")).toBeInTheDocument();
    expect(screen.getByLabelText("Valor")).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /converter/i })
    ).toBeInTheDocument();

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

    renderHome();

    await user.click(screen.getByRole("button", { name: /converter/i }));

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.exchangerate-api.com/v4/latest/BRL"
    );

    expect(await screen.findByText("Histórico (1/50)")).toBeInTheDocument();

    expect(
      await screen.findByText("Taxa de câmbio: 1 Real Brasileiro = 0,2000 USD")
    ).toBeInTheDocument();
  });

  it("deve salvar o par de moedas atual como favorito", async () => {
    const user = userEvent.setup();

    renderHome();

    await user.click(
      screen.getByRole("button", { name: /salvar par como favorito/i })
    );

    expect(await screen.findByText("Favoritos (1/20)")).toBeInTheDocument();

    expect(screen.getAllByText("BRL").length).toBeGreaterThan(0);
    expect(screen.getAllByText("USD").length).toBeGreaterThan(0);
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

    renderHome();

    expect(await screen.findByText("Histórico (1/50)")).toBeInTheDocument();

    expect(screen.getByText("Taxa: 1 BRL = 0,2000 USD")).toBeInTheDocument();

    expect(
      screen.getAllByAltText("Bandeira de Real Brasileiro").length
    ).toBeGreaterThan(0);

    expect(
      screen.getAllByAltText("Bandeira de Dólar Americano").length
    ).toBeGreaterThan(0);
  });

  it("não deve chamar a API quando o valor informado for inválido", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();

    vi.stubGlobal("fetch", fetchMock);

    renderHome();

    const amountInput = screen.getByLabelText("Valor");

    await user.clear(amountInput);
    await user.type(amountInput, "0");
    await user.click(screen.getByRole("button", { name: /converter/i }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByText(/Taxa de câmbio:/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Histórico (1/50)")).not.toBeInTheDocument();
  });

  it("não deve exibir resultado nem histórico quando a API retornar erro", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    vi.stubGlobal("fetch", fetchMock);

    renderHome();

    await user.click(screen.getByRole("button", { name: /converter/i }));

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.exchangerate-api.com/v4/latest/BRL"
    );

    await waitFor(() => {
      expect(screen.queryByText(/Taxa de câmbio:/i)).not.toBeInTheDocument();
      expect(screen.queryByText("Histórico (1/50)")).not.toBeInTheDocument();
    });
  });
});