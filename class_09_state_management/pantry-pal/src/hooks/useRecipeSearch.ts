import { useEffect, useState } from 'react';
import { fetchRecipes } from '../lib/api';
import type { Recipe } from '../types/recipe';
import { useDebounce } from './useDebounce';

export function useRecipeSearch(searchTerm: string) {
	const debouncedSearchTerm = useDebounce(searchTerm, 300);
	const [recipes, setRecipes] = useState<Recipe[]>([]);

	useEffect(() => {
		fetchRecipes({
			search: debouncedSearchTerm,
			limit: 10,
			sortBy: 'title',
			sortOrder: 'ASC',
		}).then(payload => {
			setRecipes(payload.data);
		});
	}, [debouncedSearchTerm]);

	return {
		recipes,
	};
}
