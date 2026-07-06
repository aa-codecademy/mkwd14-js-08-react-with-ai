import type { Recipe } from '../types/recipe';
import RecipeForm from './RecipeForm';
import { Dialog, DialogContent } from './ui/dialog';

// This component exists purely to wrap RecipeForm in a modal — it has no state of its own.
// This is "composition over configuration": instead of adding an `isDialog` prop to RecipeForm,
// we reuse the same form component in two contexts (inline on the page, and inside a dialog here).
type EditRecipeDialogProps = {
	recipe: Recipe;
	// onClose and onSuccess are two DIFFERENT callbacks, even though they often run together.
	// onClose just hides the dialog (e.g. user clicked cancel/X). onSuccess means the API call succeeded
	// and the parent list should refetch. Keeping them separate lets the parent react differently to each.
	onClose: () => void;
	onSuccess: () => void;
};

function EditRecipeDialog({
	onClose,
	recipe,
	onSuccess,
}: EditRecipeDialogProps) {
	return (
		// `open` is hardcoded to true — RecipeList only renders <EditRecipeDialog /> at all when
		// isEditing is truthy (see RecipeList.tsx). So "is this dialog open" is controlled by
		// whether the component exists in the tree, not by internal state. Mounting IS opening.
		// onOpenChange fires when Radix detects a close request (Escape key, backdrop click, X button) —
		// we forward all of those to the same onClose the parent gave us.
		<Dialog open onOpenChange={() => onClose()}>
			<DialogContent className='max-h-[85vh] max-w-lg  overflow-y-auto'>
				{/* Passing `recipe` here is what makes RecipeForm switch into "edit mode" —
				    see toFormValues(recipe) and the isEditing flag inside RecipeForm.tsx. */}
				<RecipeForm recipe={recipe} onSuccess={onSuccess} onClose={onClose} />
			</DialogContent>
		</Dialog>
	);
}

export default EditRecipeDialog;
