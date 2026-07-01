import type { Recipe } from '../types/recipe';
import RecipeForm from './RecipeForm';

type EditRecipeDialogProps = {
	recipe: Recipe;
	onCancel: () => void;
};

function EditRecipeDialog({ onCancel, recipe }: EditRecipeDialogProps) {
	const onSuccess = () => {};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4'>
			<div className='w-full max-w-lg'>
				<RecipeForm recipe={recipe} onSuccess={onSuccess} onCancel={onCancel} />
			</div>
		</div>
	);
}

export default EditRecipeDialog;
