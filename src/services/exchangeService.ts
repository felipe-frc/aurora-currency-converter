const DEFAULT_API_URL = "https://api.exchangerate-api.com/v4/latest";

const env = import.meta as ImportMeta & {
  env?: {
    VITE_EXCHANGE_API_URL?: string;
  };
};

const API_URL = (env.env?.VITE_EXCHANGE_API_URL || DEFAULT_API_URL).replace(
  /\/$/,
  ""
);

type ExchangeRateApiResponse = {
  rates?: Record<string, number>;
};

const buildExchangeUrl = (currencyCode: string) => {
  return `${API_URL}/${currencyCode}`;
};

export const fetchExchangeRate = async (
  fromCurrency: string,
  toCurrency: string
) => {
  const response = await fetch(buildExchangeUrl(fromCurrency));

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Moeda não encontrada na API");
    }

    if (response.status === 429) {
      throw new Error("Muitas requisições. Tente novamente em alguns segundos");
    }

    throw new Error(`Erro HTTP ${response.status}`);
  }

  let data: ExchangeRateApiResponse;

  try {
    data = await response.json();
  } catch {
    throw new Error("Resposta da API inválida");
  }

  const rate = data.rates?.[toCurrency];

  if (rate === undefined || rate === null) {
    throw new Error(`Moeda ${toCurrency} não suportada`);
  }

  if (typeof rate !== "number" || rate <= 0) {
    throw new Error("Taxa de câmbio inválida");
  }

  return rate;
};