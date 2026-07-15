import { type ReactNode } from 'react';
import { FavoritesContext } from './favorites-context';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Same split as Theme: context/hook definitions live in favorites-context.ts,
// the Provider component (which holds state and JSX) lives here — keeps Fast Refresh happy
// and separates "what shape is this data" from "how is this data produced".
export function FavoritesProvider({ children }: { children: ReactNode }) {
	// Favorites are lifted into Context (instead of local state in RecipeList) precisely because
	// multiple, unrelated branches of the tree need them: RecipeCard (toggle button) and
	// FavoritesPage (the favorites list) aren't parent/child — prop drilling them through App
	// would mean threading favoritesIds/toggleFavorite through components that don't care about it.
	// useLocalStorage instead of useState also makes favorites survive a page refresh.
	const [favoritesIds, setFavoritesIds] = useLocalStorage<string[]>(
		'PANTRY_PAL-FAVORITES',
		[],
	);

	const toggleFavorite = (id: string) => {
		setFavoritesIds(currentIds => {
			const isInList = currentIds.includes(id);

			if (isInList) {
				currentIds = currentIds.filter(_id => _id !== id);
			} else {
				// we update the array values WITHOUT changing the reference
				// currentIds.push(id);
				// we update the array values AND changing the reference
				currentIds = [...currentIds, id];
			}

			return currentIds;
		});
	};

	const isFavorite = (id: string): boolean => {
		return favoritesIds.includes(id);
	};

	// The value object (favoritesIds + the two functions) is recreated on every render of
	// FavoritesProvider, so every consumer of useFavorites() re-renders too when it changes —
	// fine at this scale, but worth knowing: for high-frequency updates you'd memoize this value.
	return (
		<FavoritesContext
			value={{
				favoritesIds,
				toggleFavorite,
				isFavorite,
			}}>
			{children}
		</FavoritesContext>
	);
}
