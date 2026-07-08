import type { Recipe } from '../../types/recipe';
import RecipeCard from './RecipeCard';

type RecipeGridProps = {
	recipes: Recipe[];
	handleDeleteRecipe: (id: string) => void;
	setIsEditing: (recipe: Recipe) => void;
};

function RecipeGrid({
	recipes,
	handleDeleteRecipe,
	setIsEditing,
}: RecipeGridProps) {
	return (
		<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
			{recipes.map(recipe => (
				// recipe.id is a stable string ID from the database — safe to use as key.
				<RecipeCard
					key={recipe.id}
					recipe={recipe}
					handleDeleteRecipe={handleDeleteRecipe}
					handleIsEditing={recipe => setIsEditing(recipe)}
				/>
			))}
		</div>
	);
}

export default RecipeGrid;
