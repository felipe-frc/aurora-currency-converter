import { FlagImage } from "@/components/currency/FlagImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  if (favorites.length === 0) {
    return null;
  }

  return (
    <Card
      className="w-full max-w-2xl p-6 mb-8 animate-fade-in rounded-3xl"
      style={cardStyle}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-cyan-400">
          Favoritos ({favorites.length}/{maxFavoritesLength})
        </h2>

        <Button
          type="button"
          onClick={onClearFavorites}
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
          aria-label="Limpar favoritos"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {favorites.map((favorite) => (
          <div
            key={`${favorite.from}-${favorite.to}`}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-400 rounded-full text-sm text-cyan-300 transition-all duration-200 group"
          >
            <button
              type="button"
              onClick={() => onApplyFavorite(favorite)}
              className="flex items-center gap-2"
              title={`Usar ${favorite.from} para ${favorite.to}`}
            >
              <FlagImage code={favorite.from} sizeClass="w-5 h-5" />
              <span className="text-xs font-semibold">{favorite.from}</span>
              <span>→</span>
              <FlagImage code={favorite.to} sizeClass="w-5 h-5" />
              <span className="text-xs font-semibold">{favorite.to}</span>
              <span className="sr-only">
                {getCurrencyLabel(favorite.from)} para{" "}
                {getCurrencyLabel(favorite.to)}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onRemoveFavorite(favorite.from, favorite.to)}
              className="ml-1 opacity-0 group-hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 transition-opacity text-red-300 hover:text-red-200"
              title="Remover favorito"
              aria-label={`Remover favorito ${favorite.from} para ${favorite.to}`}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
}