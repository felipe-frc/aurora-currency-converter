import { useLanguage } from "@/contexts/useLanguage";
import { getCurrency } from "@/data/currencies";

const TWEMOJI_CDN =
  "https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg";

type FlagImageProps = {
  code: string;
  sizeClass?: string;
};

export function FlagImage({ code, sizeClass = "w-8 h-8" }: FlagImageProps) {
  const { language, t } = useLanguage();
  const currency = getCurrency(code);

  if (!currency) {
    return null;
  }

  return (
    <img
      src={`${TWEMOJI_CDN}/${currency.emojiCode}.svg`}
      alt={`${t("flagLabel")} ${currency.names[language]}`}
      className={`${sizeClass} rounded-md object-cover drop-shadow-lg`}
      loading="lazy"
      style={{ imageRendering: "crisp-edges" }}
    />
  );
}
