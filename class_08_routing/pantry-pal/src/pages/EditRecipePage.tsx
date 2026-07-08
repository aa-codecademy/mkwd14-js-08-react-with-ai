import { Link, useNavigate, useParams } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { useEffect, useState } from 'react';
import { fetchRecipe } from '../lib/api';
import type { Recipe } from '../types/recipe';

function EditRecipePage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	console.log(id);

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

	if (isLoading) {
		return <div className='text-center text-slate-500'>Loading...</div>;
	}

	if (!recipe) {
		return <div>Recipe not found</div>;
	}

	return (
		<div className='mx-auto max-w-2xl space-y-4'>
			<Link
				to='/'
				className='text-sm text-brand-700 underline dark:text-emerald-300'>
				← Back to home
			</Link>
			<RecipeForm onSuccess={() => navigate('/')} recipe={recipe} />
		</div>
	);
}

export default EditRecipePage;
