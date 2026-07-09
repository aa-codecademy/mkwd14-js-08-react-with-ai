import { useEffect, useState } from "react";
import { fetchRecipe } from "../lib/api";
import type { Recipe } from "../types/recipe";

export function useRecipe(id: string | undefined) {
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		// Guard against the undefined case: useParams() types `id` as possibly undefined,
		// and it really can be undefined for a render or two before the router settles.
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
		// id in the dependency array: if the user navigates from /recipe/1 to /recipe/2 while
		// already on this page, React Router reuses the same component instance (no remount),
		// so without this dependency the effect wouldn't re-run and the old recipe would stick.
	}, [id]);

	return {
		recipe,
		isLoading,
	};
}
