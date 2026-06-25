import type { Recipe } from '../types/recipe';

// UPPERCASE constant signals this is static, module-level data — not derived from state or props.
// `import type` imports only the TypeScript type, not any runtime code.
// This is a good habit: it makes it obvious the import is purely for type-checking, not for executing code.
export const RECIPES: Recipe[] = [
	{
		// Use a meaningful string id so this value can safely be used as a list `key` prop.
		id: 'r1',
		title: 'Creamy Tomato Pasta',
		description: 'A quick weeknight pasta with a silky tomato cream sauce.',
		imageUrl:
			'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
		prepMinutes: 25,
		servings: 4,
		tags: ['quick', 'vegetarian', 'dinner'],
		ingredients: [
			{ name: 'penne pasta', amount: '400g' },
			{ name: 'crushed tomatoes', amount: '1 can' },
		],
		steps: ['Boil pasta.', 'Simmer sauce.', 'Combine and serve.'],
	},
	{
		id: 'r2',
		title: 'Greek Salad Bowl',
		description: 'Fresh cucumbers, tomatoes, feta, and olives.',
		imageUrl:
			'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
		prepMinutes: 15,
		servings: 2,
		tags: ['quick', 'vegetarian', 'lunch'],
		ingredients: [
			{ name: 'cucumber', amount: '1 large' },
			{ name: 'feta cheese', amount: '150g' },
		],
		steps: ['Chop vegetables.', 'Toss with dressing.'],
	},
	{
		id: 'r3',
		title: 'Chicken Stir Fry',
		description: 'Colorful vegetables and chicken in a savory sauce.',
		imageUrl:
			'https://images.unsplash.com/photo-1603133872870-684d4cf0e8a2?w=400&h=300&fit=crop',
		prepMinutes: 30,
		servings: 3,
		tags: ['dinner', 'protein'],
		ingredients: [
			{ name: 'chicken breast', amount: '500g' },
			{ name: 'soy sauce', amount: '3 tbsp' },
		],
		steps: ['Stir-fry chicken.', 'Add vegetables and sauce.'],
	},
];
