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
