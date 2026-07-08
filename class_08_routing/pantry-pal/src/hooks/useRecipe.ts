import { useEffect, useState } from "react";
import { fetchRecipe } from "../lib/api";
import type { Recipe } from "../types/recipe";

export function useRecipe(id: string | undefined) {
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!id) {
			return;
		}
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setIsLoading(true);
		fetchRecipe(id)
			.then(recipe => setRecipe(recipe))
			.catch(() => {
				console.log('something is wrong!');
			})
			.finally(() => setIsLoading(false));
	}, [id]);

	return {
		recipe,
		isLoading,
	};
}
