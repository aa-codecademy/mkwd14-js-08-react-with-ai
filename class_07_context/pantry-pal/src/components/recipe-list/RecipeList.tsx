import { useState } from 'react';
import type { Recipe } from '../../types/recipe';
import EditRecipeDialog from '../EditRecipeDialog';
import RecipeSearchSection from './RecipeSearchSection';
import RecipeStatus from './RecipeStatus';
import RecipePagination from './RecipePagination';
import RecipeGrid from './RecipeGrid';
import { useRecipe } from '../../hooks/useRecipe';
import { deleteRecipe } from '../../lib/api';

function RecipeList() {
	const [isEditing, setIsEditing] = useState<Recipe | null>();
	const {
		recipes,
		availableTags,
		total,
		totalPages,
		status,
		error,
		searchTerm,
		setSearchTerm,
		selectedTags,
		setSelectedTags,
		maxPrepMinutes,
		setMaxPrepMinutes,
		sortBy,
		setSortBy,
		sortOrder,
		setSortOrder,
		page,
		setPage,
		limit,
		setLimit,
		loadRecipes,
	} = useRecipe();

	const onTagToggle = (tag: string) => {
		const isSelected = selectedTags.includes(tag);

		if (isSelected) {
			setSelectedTags(currentTags => currentTags.filter(t => t !== tag));
		} else {
			setSelectedTags(currentTags => [...currentTags, tag]);
		}
	};

	const handleDeleteRecipe = async (id: string) => {
		await deleteRecipe(id);
		await loadRecipes();
	};

	return (
		<div className='space-y-6'>
			<RecipeSearchSection
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				maxPrepMinutes={maxPrepMinutes}
				setMaxPrepMinutes={setMaxPrepMinutes}
				sortBy={sortBy}
				setSortBy={setSortBy}
				sortOrder={sortOrder}
				setSortOrder={setSortOrder}
				availableTags={availableTags}
				selectedTags={selectedTags}
				setSelectedTags={setSelectedTags}
				onTagToggle={onTagToggle}
			/>

			<RecipeStatus
				recipesLength={recipes.length}
				total={total}
				status={status}
				error={error}
			/>

			<RecipeGrid
				recipes={recipes}
				handleDeleteRecipe={handleDeleteRecipe}
				setIsEditing={setIsEditing}
			/>

			<RecipePagination
				page={page}
				setPage={setPage}
				totalPages={totalPages}
				limit={limit}
				setLimit={setLimit}
			/>

			{isEditing && (
				<EditRecipeDialog
					recipe={isEditing}
					onClose={() => setIsEditing(null)}
					onSuccess={loadRecipes}
				/>
			)}
		</div>
	);
}

export default RecipeList;
