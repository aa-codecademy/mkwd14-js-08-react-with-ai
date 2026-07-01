import type { Recipe } from '../types/recipe';
import RecipeForm from './RecipeForm';

type EditRecipeDialogProps = {
	recipe: Recipe;
	onClose: () => void;
	onSuccess: () => void;
};

function EditRecipeDialog({
	onClose,
	recipe,
	onSuccess,
}: EditRecipeDialogProps) {
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4'>
			<div className='w-full max-w-lg'>
				<RecipeForm recipe={recipe} onSuccess={onSuccess} onClose={onClose} />
			</div>
		</div>
	);
}

export default EditRecipeDialog;
