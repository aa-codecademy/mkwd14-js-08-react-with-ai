import { Link, useParams } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';
import { useRecipe } from '../hooks/useRecipe';

function EditRecipePage() {
	// Same dynamic segment as RecipeDetailsPage — "/recipe/:id/edit" matches this component
	// and exposes the same :id param, even though it's a different route/page.
	const { id } = useParams();

	const { recipe, isLoading } = useRecipe(id);

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
			<RecipeForm recipe={recipe} />
		</div>
	);
}

export default EditRecipePage;
