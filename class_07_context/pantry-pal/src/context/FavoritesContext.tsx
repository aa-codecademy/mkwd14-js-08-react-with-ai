import { type ReactNode } from 'react';
import { FavoritesContext } from './favorites-context';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function FavoritesProvider({ children }: { children: ReactNode }) {
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
