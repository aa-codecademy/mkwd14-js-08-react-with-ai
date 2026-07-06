import { createContext, use } from 'react';

export type FavoritesContextValue = {
	favoritesIds: string[];
	toggleFavorite: (id: string) => void;
	isFavorite: (id: string) => boolean;
};

const defaultValue: FavoritesContextValue = {
	favoritesIds: [],
	toggleFavorite: () => void 0,
	isFavorite: () => false,
};

export const FavoritesContext =
	createContext<FavoritesContextValue>(defaultValue);

export function useFavorites() {
	const ctx = use(FavoritesContext);

	if (!ctx) {
		throw new Error('useFavorites must be used within a FavoritesProvider');
	}

	return ctx;
}
