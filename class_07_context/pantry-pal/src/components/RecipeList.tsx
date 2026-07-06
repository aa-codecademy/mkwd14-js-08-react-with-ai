import { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard';
// Renaming the imported type avoids a name conflict with the Recipe component above.
import type { Recipe, SortBy, SortDirection } from '../types/recipe';
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from './ui/select';

const PAGE_SIZE_OPTIONS = [6, 12, 24, 48, 96];

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

	const SORT_OPTIONS: { value: SortBy; label: string }[] = [
		{ value: 'createdAt', label: 'Newest' },
		{ value: 'title', label: 'Title' },
		{ value: 'prepMinutes', label: 'Prep time' },
		{ value: 'servings', label: 'Servings' },
	];

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

			<div className='space-y-1'>
				<Label>Sort by</Label>
				<div className='flex gap-2'>
					<Select
						value={sortBy}
						onValueChange={value => setSortBy(value as SortBy)}>
						<SelectTrigger className='w-full'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{SORT_OPTIONS.map(option => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Button
						type='button'
						variant='outline'
						title='Toggle sort direction'
						onClick={() =>
							setSortOrder(currentOrder =>
								currentOrder === 'ASC' ? 'DESC' : 'ASC',
							)
						}>
						{sortOrder === 'ASC' ? '↑' : '↓'}
					</Button>
				</div>
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
				<p className='text-sm text-slate-500 dark:text-slate-300'>
					Showing {recipes.length} out of {total} recipes
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
				<p className='text-red-700 p-4 text-sm bg-red-50 border-red-200 border rounded-xl dark:bg-red-900/20 dark:border-red-700 dark:text-red-300'>
					{error}
				</p>
			)}
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

			<div className='flex items-center justify-center gap-4'>
				<Button
					variant='outline'
					disabled={page === 1}
					onClick={() => {
						setPage(currentPage => Math.max(1, currentPage - 1));
					}}>
					← Previous
				</Button>
				<span>
					Page {page} / {totalPages}
				</span>
				<Button
					variant='outline'
					disabled={page === totalPages}
					onClick={() =>
						setPage(currentPage => Math.min(totalPages, currentPage + 1))
					}>
					Next →
				</Button>
				<div className='max-w-md'>
					<Select
						value={String(limit)}
						onValueChange={value => setLimit(Number(value))}>
						<SelectTrigger className='w-full'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PAGE_SIZE_OPTIONS.map(option => (
								<SelectItem key={option} value={String(option)}>
									{option}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
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
