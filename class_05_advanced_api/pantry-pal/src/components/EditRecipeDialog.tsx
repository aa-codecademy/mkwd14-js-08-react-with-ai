import type { Recipe } from '../types/recipe';
import RecipeForm from './RecipeForm';
import { Dialog, DialogContent } from './ui/dialog';

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
		<Dialog open onOpenChange={() => onClose()}>
			<DialogContent className='max-w-lg  overflow-auto'>
				<RecipeForm recipe={recipe} onSuccess={onSuccess} onClose={onClose} />
			</DialogContent>
		</Dialog>
	);
}

export default EditRecipeDialog;
