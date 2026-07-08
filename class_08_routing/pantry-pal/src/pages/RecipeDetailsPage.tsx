import { Link, useParams } from 'react-router-dom';
import { useRecipe } from '../hooks/useRecipe';
import RecipeDetails from '../components/RecipeDetails';

function RecipeDetailsPage() {
	const { id } = useParams();
	const { recipe, isLoading } = useRecipe(id);

	if (isLoading) {
		return <div className='text-center text-slate-500'>Loading...</div>;
	}

	if (!recipe) {
		return <div>Recipe not found</div>;
	}

	return (
		<div className='mx-auto mx-w-2xl space-y-4'>
			<Link
				to='/'
				className='text-sm text-brand-700 underline dark:text-emerald-300'>
				← Back to home
			</Link>
			<RecipeDetails recipe={recipe} />
		</div>
	);
}

export default RecipeDetailsPage;
