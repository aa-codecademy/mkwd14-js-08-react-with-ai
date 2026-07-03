import { useEffect, useState } from 'react';
import Recipe from './Recipe';
// Renaming the imported type avoids a name conflict with the Recipe component above.
import type {
	Recipe as RecipeType,
	SortBy,
	SortDirection,
} from '../types/recipe';
import { fetchRecipes, deleteRecipe } from '../lib/api';
import type { HttpStatus } from '../types/http-status';
import EditRecipeDialog from './EditRecipeDialog';
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group';
import { Search } from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';

function RecipeList() {
	const [recipes, setRecipes] = useState<RecipeType[]>([]);
	const [availableTags, setAvailableTags] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [maxPrepMin, setMaxPrepMin] = useState<number | undefined>(undefined);
	const [sortBy, setSortBy] = useState<SortBy>('createdAt');
	const [sortOrder, setSortOrder] = useState<SortDirection>('DESC');

	// One `status` variable instead of three booleans — only one state is active at a time.
	// Start with 'idle' (haven't fetched yet) rather than 'loading' so the skeleton
	// doesn't flash briefly before the effect even starts.
	const [status, setStatus] = useState<HttpStatus>('idle');
	const [error, setError] = useState('');
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 400);

	const [isEditing, setIsEditing] = useState<RecipeType | null>();

	const params = {
		page: 1,
		limit: 500,
	};

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

	// useEffect with [] runs once after the component mounts — perfect for initial data loading.
	// If you omit [], this would run after EVERY render, causing an infinite fetch loop.
	useEffect(() => {
		console.log(selectedTags);
		setStatus('loading'); // show skeleton immediately while the request is in flight
		fetchRecipes({
			...params,
			search: debouncedSearchTerm,
			tags: selectedTags.join(','),
			maxPrepMinutes: maxPrepMin,
			sortBy,
			sortOrder,
		})
			.then(payload => {
				setRecipes(payload.data);
				setAvailableTags(payload.availableTags);
				setStatus('success'); // both state updates trigger ONE re-render (React batches them)
			})
			.catch(err => {
				setStatus('error');
				setError(err.message); // the error message comes from the thrown Error in api.ts
			});
		// No .finally() needed here because we set status in both .then and .catch.
	}, [debouncedSearchTerm, selectedTags, maxPrepMin, sortBy, sortOrder]);

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
			{/* GOTCHA: this input is uncontrolled and has no onChange — typing here does nothing yet.
					Wiring it up is a good exercise: add a `search` state, pass it into `params`,
					and add `search` to the useEffect dependency array so a new value re-triggers the fetch. */}
			<InputGroup>
				<InputGroupInput
					value={searchTerm}
					onChange={e => setSearchTerm(e.target.value)}
					placeholder='Search for a recipe...'
					type='search'
				/>
				<InputGroupAddon align='inline-start'>
					<Search />
				</InputGroupAddon>
			</InputGroup>

			<div className='space-y-1'>
				<Label htmlFor='max-prep-min'>Max pep (min)</Label>
				<Input
					id='max-prep-min'
					type='number'
					min={1}
					value={maxPrepMin}
					onChange={e => setMaxPrepMin(Number(e.target.value))}
				/>
			</div>

			{availableTags.length > 0 && (
				<div className='flex flex-wrap items-center gap-2'>
					{availableTags.map(tag => {
						const isSelected = selectedTags.includes(tag);
						return (
							<button onClick={() => onTagToggle(tag)} key={tag} type='button'>
								<Badge variant={isSelected ? 'outline' : 'default'}>
									{tag}
								</Badge>
							</button>
						);
					})}
					{selectedTags.length > 0 && (
						<Button
							type='button'
							variant='link'
							size='sm'
							onClick={() => setSelectedTags([])}>
							clear tags
						</Button>
					)}
				</div>
			)}

			{/* Conditional rendering by status — each branch is only active for one state. */}
			{status === 'success' && (
				<p className='text-sm text-slate-500'>
					Showing {recipes.length} recipes
				</p>
			)}

			{status === 'loading' && (
				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{/* Array.from({ length: 6 }) creates an array of 6 empty slots — a quick
							way to render N placeholder skeleton cards without storing count in state. */}
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className='h-64 rounded-xl bg-slate-300' />
					))}
				</div>
			)}

			{status === 'error' && (
				<p className='text-red-700 p-4 text-sm bg-red-50 border-red-200 border rounded-xl'>
					{error}
				</p>
			)}
			{/* This grid is always rendered — it's just empty while loading/error.
					When status becomes 'success', recipes fills in and the grid populates. */}
			<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{recipes.map(recipe => (
					// recipe.id is a stable string ID from the database — safe to use as key.
					<Recipe
						key={recipe.id}
						recipe={recipe}
						handleDeleteRecipe={handleDeleteRecipe}
						handleIsEditing={recipe => setIsEditing(recipe)}
					/>
				))}
			</div>

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
