import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDebounce } from './useDebounce';
import type {
	Recipe,
	RecipesQueryParams,
	SortBy,
	SortDirection,
} from '../types/recipe';
import type { HttpStatus } from '../types/http-status';
import { fetchRecipes } from '../lib/api';

export function useRecipes() {
	// -- Query state (filtering, searching, sorting, pagination)
	const [searchTerm, setSearchTerm] = useState('');
	const debouncedSearchTerm = useDebounce(searchTerm, 400);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [maxPrepMinutes, setMaxPrepMinutes] = useState<number | undefined>(
		undefined,
	);
	const [sortBy, setSortBy] = useState<SortBy>('createdAt');
	const [sortOrder, setSortOrder] = useState<SortDirection>('DESC');
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(12);

	// -- Result state
	const [recipes, setRecipes] = useState<Recipe[]>([]);
	const [availableTags, setAvailableTags] = useState<string[]>([]);
	const [totalPages, setTotalPages] = useState(0);
	const [total, setTotal] = useState(0);
	const [status, setStatus] = useState<HttpStatus>('idle');
	const [error, setError] = useState('');

	const params = useMemo<RecipesQueryParams>(
		() => ({
			search: debouncedSearchTerm,
			tags: selectedTags.join(','),
			maxPrepMinutes,
			page,
			limit,
			sortBy,
			sortOrder,
		}),
		[
			page,
			limit,
			sortBy,
			sortOrder,
			debouncedSearchTerm,
			selectedTags,
			maxPrepMinutes,
		],
	);

	const loadRecipes = useCallback(async () => {
		setStatus('loading');
		try {
			const payload = await fetchRecipes(params);
			setRecipes(payload.data);
			setTotal(payload.total);
			setTotalPages(payload.totalPages);
			setAvailableTags(payload.availableTags);
			setStatus('success');
		} catch (error: unknown) {
			setStatus('error');
			setError((error as { message: string }).message);
		}
	}, [params]);

	useEffect(() => {
		if (page !== 1) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setPage(1);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		debouncedSearchTerm,
		selectedTags,
		maxPrepMinutes,
		sortBy,
		sortOrder,
		limit,
	]);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		loadRecipes();
	}, [loadRecipes]);

	return {
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
	};
}
