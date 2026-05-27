import { FlagImage } from "@/components/currency/FlagImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/useLanguage";
import { getCurrencyLabel } from "@/data/currencies";
import type { Favorite } from "@/types/currency";
import { Trash2 } from "lucide-react";
import type { CSSProperties } from "react";

type FavoritesListProps = {
  favorites: Favorite[];
  maxFavoritesLength: number;
  cardStyle: CSSProperties;
  onApplyFavorite: (favorite: Favorite) => void;
  onRemoveFavorite: (from: string, to: string) => void;
  onClearFavorites: () => void;
};

export function FavoritesList({
  favorites,
  maxFavoritesLength,
  cardStyle,
  onApplyFavorite,
  onRemoveFavorite,
  onClearFavorites,
}: FavoritesListProps) {
  const { t } = useLanguage();

  if (favorites.length === 0) {
    return null;
  }

  return (
    <Card
      className="mb-8 w-full max-w-2xl rounded-3xl p-6 animate-fade-in"
      style={cardStyle}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-sky-700 dark:text-cyan-400">
          {t("favorites")} ({favorites.length}/{maxFavoritesLength})
        </h2>

        <Button
          type="button"
          onClick={onClearFavorites}
          variant="ghost"
          size="sm"
          className="text-red-500 transition-all duration-200 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
          aria-label={t("clearFavorites")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {favorites.map((favorite) => (
          <div
            key={`${favorite.from}-${favorite.to}`}
            className="group flex items-center gap-2 rounded-full border border-sky-300/70 bg-white/80 px-4 py-2 text-sm text-sky-700 shadow-sm transition-all duration-200 hover:border-sky-500 hover:bg-sky-50 dark:border-cyan-500/30 dark:bg-white/10 dark:text-cyan-300 dark:hover:border-cyan-400 dark:hover:bg-cyan-500/20"
          >
            <button
              type="button"
              onClick={() => onApplyFavorite(favorite)}
              className="flex items-center gap-2"
              title={`${t("useFavorite")} ${favorite.from} ${t("to")} ${favorite.to}`}
            >
              <FlagImage code={favorite.from} sizeClass="w-5 h-5" />
              <span className="text-xs font-semibold text-slate-800 dark:text-white">
                {favorite.from}
              </span>
              <span className="text-sky-600 dark:text-cyan-300">→</span>
              <FlagImage code={favorite.to} sizeClass="w-5 h-5" />
              <span className="text-xs font-semibold text-slate-800 dark:text-white">
                {favorite.to}
              </span>
              <span className="sr-only">
                {getCurrencyLabel(favorite.from)} {t("to")}{" "}
                {getCurrencyLabel(favorite.to)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onRemoveFavorite(favorite.from, favorite.to)}
              className="ml-1 text-red-500 opacity-0 transition-opacity hover:text-red-600 focus:opacity-100 focus-visible:opacity-100 dark:text-red-300 dark:hover:text-red-200 group-hover:opacity-100"
              title={t("removeFavorite")}
              aria-label={`${t("removeFavorite")} ${favorite.from} ${t("to")} ${favorite.to}`}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}