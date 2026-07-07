import { createContext, use } from 'react';

export type FavoritesContextValue = {
	favoritesIds: string[];
	toggleFavorite: (id: string) => void;
	isFavorite: (id: string) => boolean;
};

// Unlike ThemeContext, the default here is a real (non-null) fallback object with no-op
// functions. This avoids null-checks in components that render before a Provider mounts,
// but note the guard below (`!ctx`) can never actually trigger with this default —
// it's dead code since a real object is always truthy. Compare with theme-context.ts,
// which uses `null` as the default specifically so that guard works.
const defaultValue: FavoritesContextValue = {
	favoritesIds: [],
	toggleFavorite: () => void 0,
	isFavorite: () => false,
};

export const FavoritesContext =
	createContext<FavoritesContextValue>(defaultValue);

// Custom hook wrapper around use(Context) — same pattern as useTheme: consumers
// (RecipeCard, FavoritesPage, ...) call useFavorites() and never touch FavoritesContext directly.
export function useFavorites() {
	const ctx = use(FavoritesContext);

	if (!ctx) {
		throw new Error('useFavorites must be used within a FavoritesProvider');
	}

	return ctx;
}
