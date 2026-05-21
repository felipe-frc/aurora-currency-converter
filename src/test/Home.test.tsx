import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/pages/Home";

describe("Home", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
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
});