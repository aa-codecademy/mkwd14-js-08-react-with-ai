import { Link, useNavigate } from 'react-router-dom';
import RecipeForm from '../components/RecipeForm';

function NewRecipePage() {
	const navigate = useNavigate();

	return (
		<div className='mx-auto max-w-2xl space-y-4'>
			<Link
				to='/'
				className='text-sm text-brand-700 underline dark:text-emerald-300'>
				← Back to home
			</Link>
			<RecipeForm onSuccess={() => navigate('/')} />
		</div>
	);
}

export default NewRecipePage;
