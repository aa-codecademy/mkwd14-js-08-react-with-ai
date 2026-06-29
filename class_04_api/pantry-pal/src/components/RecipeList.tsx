import { useEffect, useState } from 'react';
import Recipe from './Recipe';
import type { Recipe as RecipeType } from '../types/recipe';
import { fetchRecipes } from '../lib/api';
import type { HttpStatus } from '../types/http-status';

function RecipeList() {
	const [recipes, setRecipes] = useState<RecipeType[]>([]);
	const [status, setStatus] = useState<HttpStatus>('idle');
	const [error, setError] = useState('');

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setStatus('loading');
		fetchRecipes()
			.then(data => {
				setRecipes(data);
				setStatus('success');
			})
			.catch(err => {
				setStatus('error');
				setError(err.message);
			});
	}, []);

	return (
		<div className='space-y-6'>
			{status === 'success' && (
				<p className='text-sm text-slate-500'>
					Showing {recipes.length} recipes
				</p>
			)}

			{status === 'loading' && (
				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
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
			<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{recipes.map(recipe => (
					<Recipe key={recipe.id} recipe={recipe} />
				))}
			</div>
		</div>
	);
}

export default RecipeList;
