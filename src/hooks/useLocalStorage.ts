import { useEffect, useState } from "react";

type Validator<T> = (data: unknown) => data is T;

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T,
  validator: Validator<T>
) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);

      if (!item) {
        return initialValue;
      }

      const parsed = JSON.parse(item);

      if (validator(parsed)) {
        return parsed;
      }

      console.warn(
        `Dados inválidos encontrados no localStorage para a chave: ${key}`
      );

      return initialValue;
    } catch (error) {
      console.error(`Erro ao carregar dados do localStorage (${key}):`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Erro ao salvar dados no localStorage (${key}):`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
};