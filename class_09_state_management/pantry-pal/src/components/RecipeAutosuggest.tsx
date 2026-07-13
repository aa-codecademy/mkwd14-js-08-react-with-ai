import { useState } from 'react';
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from './ui/combobox';
import { useRecipeSearch } from '../hooks/useRecipeSearch';
import type { Recipe } from '../types/recipe';

type RecipeAutosuggestProps = {
	onMealSelect: (recipe: Recipe | null) => void;
};

function RecipeAutosuggest({ onMealSelect }: RecipeAutosuggestProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const { recipes } = useRecipeSearch(searchTerm);

	return (
		<Combobox<Recipe>
			items={recipes}
			itemToStringLabel={recipe => recipe.title}
			onValueChange={(recipe: Recipe | null) => onMealSelect(recipe)}
			onInputValueChange={value => setSearchTerm(value)}>
			<ComboboxInput placeholder='Search for recipe...' />
			<ComboboxContent>
				<ComboboxEmpty>No recipes containing {searchTerm}</ComboboxEmpty>
				<ComboboxList>
					{(recipe: Recipe) => (
						<ComboboxItem key={recipe.id} value={recipe}>
							{recipe.title}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}

export default RecipeAutosuggest;
