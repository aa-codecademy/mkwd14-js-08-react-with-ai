import { useEffect, useState } from 'react';
import type { Recipe } from '../types/recipe';
import RecipeCard from './RecipeCard';
import { fetchRecipes } from '../lib/api';
import { useFavorites } from '../context/favorites-context';

function FavoritesPages() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const { favoritesIds } = useFavorites();

	useEffect(() => {
		fetchRecipes({
			limit: 500,
		})
			.then(payload => {
				setRecipes(payload.data);
			})
			.catch(err => {
				console.error(err);
			});
	}, []);

	const favorites = recipes.filter(recipe => favoritesIds.includes(recipe.id));

	return (
		<div className='space-y-6'>
			<h2 className='text-2xl font-bold text-brand-900 dark:text-emerald-100'>
				Your favorites
			</h2>

			<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{favorites.map(recipe => (
					// recipe.id is a stable string ID from the database — safe to use as key.
					<RecipeCard
						key={recipe.id}
						recipe={recipe}
						handleDeleteRecipe={() => void 0}
						handleIsEditing={() => void 0}
					/>
				))}
			</div>
		</div>
	);
}

export default FavoritesPages;
