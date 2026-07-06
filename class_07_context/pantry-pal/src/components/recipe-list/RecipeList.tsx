import { useEffect, useState, type SetStateAction } from 'react';
import RecipeCard from './RecipeCard';
// Renaming the imported type avoids a name conflict with the Recipe component above.
import type { Recipe, SortBy, SortDirection } from '../../types/recipe';
import { fetchRecipes, deleteRecipe } from '../../lib/api';
import type { HttpStatus } from '../../types/http-status';
import EditRecipeDialog from '../EditRecipeDialog';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from '../ui/input-group';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select';
import RecipeSearchSection from './RecipeSearchSection';
import RecipeStatus from './RecipeStatus';
import RecipePagination from './RecipePagination';

function RecipeList() {
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [availableTags, setAvailableTags] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [maxPrepMin, setMaxPrepMin] = useState<number | undefined>(undefined);
	const [sortBy, setSortBy] = useState<SortBy>('createdAt');
	const [sortOrder, setSortOrder] = useState<SortDirection>('DESC');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(12);
	const [totalPages, setTotalPages] = useState(0);
	const [total, setTotal] = useState(0);

	// One `status` variable instead of three booleans — only one state is active at a time.
	// Start with 'idle' (haven't fetched yet) rather than 'loading' so the skeleton
	// doesn't flash briefly before the effect even starts.
	const [status, setStatus] = useState<HttpStatus>('idle');
	const [error, setError] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 400);

	const [isEditing, setIsEditing] = useState<Recipe | null>();

	const handleDeleteRecipe = async (id: string) => {
		setStatus('loading');
		try {
			await deleteRecipe(id);
			const payload = await fetchRecipes(params);
			setRecipes(payload.data);
			setStatus('success');
		} catch (error: unknown) {
			console.log(error);
			setStatus('error');
			setError(
				(error as { message: string })?.message ||
					'Issue while deleting recipe.',
			);
		}
	};

	const handleSuccessfulUpdate = async () => {
		setStatus('loading');
		try {
			const payload = await fetchRecipes(params);
			setRecipes(payload.data);
			setStatus('success');
		} catch (error: unknown) {
			console.log(error);
			setStatus('error');
			setError(
				(error as { message: string })?.message ||
					'Issue while updating recipe.',
			);
		}
	};

	useEffect(() => {
		if (page !== 1) {
			setPage(1);
		}
	}, [debouncedSearchTerm, selectedTags, maxPrepMin, sortBy, sortOrder, limit]);

	// useEffect with [] runs once after the component mounts — perfect for initial data loading.
	// If you omit [], this would run after EVERY render, causing an infinite fetch loop.
	useEffect(() => {
		console.log(selectedTags);
		setStatus('loading'); // show skeleton immediately while the request is in flight
		fetchRecipes({
			search: debouncedSearchTerm,
			tags: selectedTags.join(','),
			maxPrepMinutes: maxPrepMin,
			sortBy,
			sortOrder,
			page,
			limit,
		})
			.then(payload => {
				setRecipes(payload.data);
				setAvailableTags(payload.availableTags);
				setTotal(payload.total);
				setTotalPages(payload.totalPages);
				setStatus('success'); // both state updates trigger ONE re-render (React batches them)
			})
			.catch(err => {
				setStatus('error');
				setError(err.message); // the error message comes from the thrown Error in api.ts
			});
		// No .finally() needed here because we set status in both .then and .catch.
	}, [
		debouncedSearchTerm,
		selectedTags,
		maxPrepMin,
		sortBy,
		sortOrder,
		page,
		limit,
	]);

	const onTagToggle = (tag: string) => {
		const isSelected = selectedTags.includes(tag);

		if (isSelected) {
			setSelectedTags(currentTags => currentTags.filter(t => t !== tag));
		} else {
			setSelectedTags(currentTags => [...currentTags, tag]);
		}
	};

	return (
		<div className='space-y-6'>
			{/* Controlled input: value comes from `searchTerm` state, onChange writes back to it.
					Note we pass `debouncedSearchTerm` (not `searchTerm`) into the fetch effect below —
					that's what stops a network request firing on every single keystroke. */}

			<RecipeSearchSection
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				maxPrepMin={maxPrepMin}
				setMaxPrepMin={setMaxPrepMin}
				sortBy={sortBy}
				setSortBy={setSortBy}
				sortOrder={sortOrder}
				setSortOrder={setSortOrder}
				availableTags={availableTags}
				selectedTags={selectedTags}
				setSelectedTags={setSelectedTags}
				onTagToggle={onTagToggle}
			/>
			{/* Conditional rendering by status — each branch is only active for one state. */}

			<RecipeStatus
				recipesLength={recipes.length}
				total={total}
				status={status}
				error={error}
			/>
			{/* This grid is always rendered — it's just empty while loading/error.
					When status becomes 'success', recipes fills in and the grid populates. */}
			<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{recipes.map(recipe => (
					// recipe.id is a stable string ID from the database — safe to use as key.
					<RecipeCard
						key={recipe.id}
						recipe={recipe}
						handleDeleteRecipe={handleDeleteRecipe}
						handleIsEditing={recipe => setIsEditing(recipe)}
					/>
				))}
			</div>

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
					onSuccess={handleSuccessfulUpdate}
				/>
			)}
		</div>
	);
}

export default RecipeList;
