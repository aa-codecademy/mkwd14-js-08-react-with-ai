// Separating types into their own file keeps them reusable across the app.
// Multiple components (Recipe, TagList, seedData) can all import from here
// instead of each defining the same shape independently.

export type Ingredient = {
	name: string;
	amount: string;
};

export type Recipe = {
	id: string;
	// Using string for id (not number) is good practice — IDs from databases are often strings (UUIDs),
	// and string IDs work reliably as `key` props in lists.
	title: string;
	description: string;
	imageUrl: string;
	prepMinutes: number;
	servings: number;
	tags: string[];
	// Nested type: an array of Ingredient objects, not just strings. This lets you model complex data cleanly.
	ingredients: Ingredient[];
	steps: string[];
};

export type CreateRecipe = {
	title: string;
	description: string;
	imageUrl: string;
	prepMinutes: number;
	servings: number;
	tags: string[];
	ingredients: Ingredient[];
	steps: string[];
};

// Partial<T> makes every field optional — perfect for PATCH requests where the client
// only sends the fields that changed, not the whole object. Saves you from writing
// a near-duplicate type by hand every time CreateRecipe changes shape.
export type UpdateRecipe = Partial<CreateRecipe>;

export type SortBy = 'title' | 'createdAt' | 'servings' | 'prepMinutes';

export type SortDirection = 'ASC' | 'DESC';

export type RecipesQueryParams = {
	page?: number;
	limit?: number;
	sortBy?: SortBy;
	sortOrder?: SortDirection;
	search?: string;
	tags?: string;
	maxPrepMinutes?: number;
};
