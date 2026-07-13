import { Link, useParams } from 'react-router-dom';
import { useRecipe } from '../hooks/useRecipe';
import RecipeDetails from '../components/RecipeDetails';

function RecipeDetailsPage() {
	// useParams() reads the dynamic segments from the matched route path (recipe/:id in App.tsx).
	// The key ("id") must match the route param name exactly, and the value is always a string | undefined.
	const { id } = useParams();
	// id can briefly be undefined on first render or if someone visits an invalid URL directly —
	// useRecipe is written to handle that (it skips fetching until id exists).
	const { recipe, isLoading } = useRecipe(id);

	if (isLoading) {
		return <div className='text-center text-slate-500'>Loading...</div>;
	}

	if (!recipe) {
		return <div>Recipe not found</div>;
	}

	return (
		<div className='mx-auto mx-w-2xl space-y-4'>
			{/* Link (not <a href="/">) navigates client-side: React Router intercepts the click,
			    updates the URL, and re-renders — the page never reloads and app state (theme, favorites) survives. */}
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
