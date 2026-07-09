import { Link } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';

function NewRecipePage() {
	return (
		<div className='mx-auto max-w-2xl space-y-4'>
			{/* Static route ("recipe/new" in App.tsx) — no params needed, just a plain path match. */}
			<Link
				to='/'
				className='text-sm text-brand-700 underline dark:text-emerald-300'>
				← Back to home
			</Link>
			<RecipeForm />
		</div>
	);
}

export default NewRecipePage;
