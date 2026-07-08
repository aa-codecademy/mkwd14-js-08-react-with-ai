import RecipeSearchSection from '../components/recipe-list/RecipeSearchSection';
import RecipeStatus from '../components/recipe-list/RecipeStatus';
import RecipePagination from '../components/recipe-list/RecipePagination';
import RecipeGrid from '../components/recipe-list/RecipeGrid';
import { useRecipes } from '../hooks/useRecipes';
import { deleteRecipe } from '../lib/api';

function HomePage() {
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
	} = useRecipes();

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

			<RecipeGrid recipes={recipes} handleDeleteRecipe={handleDeleteRecipe} />

			<RecipePagination
				page={page}
				setPage={setPage}
				totalPages={totalPages}
				limit={limit}
				setLimit={setLimit}
			/>
		</div>
	);
}

export default HomePage;
