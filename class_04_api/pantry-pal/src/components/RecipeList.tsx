import { useEffect, useState } from 'react';
import Recipe from './Recipe';
// Renaming the imported type avoids a name conflict with the Recipe component above.
import type { Recipe as RecipeType } from '../types/recipe';
import { fetchRecipes, deleteRecipe } from '../lib/api';
import type { HttpStatus } from '../types/http-status';
import EditRecipeDialog from './EditRecipeDialog';

function RecipeList() {
	const [recipes, setRecipes] = useState<RecipeType[]>([]);
	// One `status` variable instead of three booleans — only one state is active at a time.
	// Start with 'idle' (haven't fetched yet) rather than 'loading' so the skeleton
	// doesn't flash briefly before the effect even starts.
	const [status, setStatus] = useState<HttpStatus>('idle');
	const [error, setError] = useState('');

	const [isEditing, setIsEditing] = useState<RecipeType | null>();

	const handleDeleteRecipe = async (id: string) => {
		setStatus('loading');
		try {
			await deleteRecipe(id);
			const data = await fetchRecipes();
			setRecipes(data);
			setStatus('success');
		} catch (error: unknown) {
			console.log(error);
			setStatus('error');
			setError(
				(error as { message: string })?.message ||
					'Issue while deleting recipe.',
			);
		}
	};

	const handleSuccessfulUpdate = async () => {
		setStatus('loading');
		try {
			const data = await fetchRecipes();
			setRecipes(data);
			setStatus('success');
		} catch (error: unknown) {
			console.log(error);
			setStatus('error');
			setError(
				(error as { message: string })?.message ||
					'Issue while updating recipe.',
			);
		}
	};

	// useEffect with [] runs once after the component mounts — perfect for initial data loading.
	// If you omit [], this would run after EVERY render, causing an infinite fetch loop.
	useEffect(() => {
		setStatus('loading'); // show skeleton immediately while the request is in flight
		fetchRecipes()
			.then(data => {
				setRecipes(data);
				setStatus('success'); // both state updates trigger ONE re-render (React batches them)
			})
			.catch(err => {
				setStatus('error');
				setError(err.message); // the error message comes from the thrown Error in api.ts
			});
		// No .finally() needed here because we set status in both .then and .catch.
	}, []);

	return (
		<div className='space-y-6'>
			{/* Conditional rendering by status — each branch is only active for one state. */}
			{status === 'success' && (
				<p className='text-sm text-slate-500'>
					Showing {recipes.length} recipes
				</p>
			)}

			{status === 'loading' && (
				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{/* Array.from({ length: 6 }) creates an array of 6 empty slots — a quick
					    way to render N placeholder skeleton cards without storing count in state. */}
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className='h-64 rounded-xl bg-slate-300' />
					))}
				</div>
			)}

			{status === 'error' && (
				<p className='text-red-700 p-4 text-sm bg-red-50 border-red-200 border rounded-xl'>
					{error}
				</p>
			)}
			{/* This grid is always rendered — it's just empty while loading/error.
			    When status becomes 'success', recipes fills in and the grid populates. */}
			<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{recipes.map(recipe => (
					// recipe.id is a stable string ID from the database — safe to use as key.
					<Recipe
						key={recipe.id}
						recipe={recipe}
						handleDeleteRecipe={handleDeleteRecipe}
						handleIsEditing={recipe => setIsEditing(recipe)}
					/>
				))}
			</div>

			{isEditing && (
				<EditRecipeDialog
					recipe={isEditing}
					onClose={() => setIsEditing(null)}
					onSuccess={handleSuccessfulUpdate}
				/>
			)}
		</div>
	);
}

export default RecipeList;
