import type { Recipe } from '../types/recipe';

// UPPERCASE constant signals this is static, module-level data — not derived from state or props.
// `import type` imports only the TypeScript type, not any runtime code.
// This is a good habit: it makes it obvious the import is purely for type-checking, not for executing code.
export const RECIPES: Recipe[] = [
	{
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
			{ name: 'heavy cream', amount: '200ml' },
			{ name: 'garlic', amount: '3 cloves' },
			{ name: 'parmesan', amount: '50g' },
		],
		steps: [
			'Boil pasta in salted water until al dente.',
			'Sauté garlic, add tomatoes and simmer 10 minutes.',
			'Stir in cream and parmesan, toss with pasta.',
		],
	},
	{
		id: 'r2',
		title: 'Greek Salad Bowl',
		description:
			'Fresh cucumbers, tomatoes, feta, and olives with lemon oregano dressing.',
		imageUrl:
			'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
		prepMinutes: 15,
		servings: 2,
		tags: ['quick', 'vegetarian', 'lunch'],
		ingredients: [
			{ name: 'cucumber', amount: '1 large' },
			{ name: 'cherry tomatoes', amount: '200g' },
			{ name: 'feta cheese', amount: '150g' },
			{ name: 'kalamata olives', amount: '80g' },
			{ name: 'olive oil', amount: '3 tbsp' },
		],
		steps: [
			'Chop vegetables and combine in a bowl.',
			'Whisk olive oil, lemon juice, and oregano.',
			'Toss salad with dressing and crumble feta on top.',
		],
	},
	{
		id: 'r3',
		title: 'Chicken Stir Fry',
		description:
			'Colorful vegetables and chicken in a savory soy-ginger sauce.',
		imageUrl:
			'https://images.unsplash.com/photo-1707056503922-91c9ebaf0774?w=400&h=300&fit=crop',
		prepMinutes: 30,
		servings: 3,
		tags: ['dinner', 'protein'],
		ingredients: [
			{ name: 'chicken breast', amount: '500g' },
			{ name: 'bell peppers', amount: '2' },
			{ name: 'broccoli', amount: '1 head' },
			{ name: 'soy sauce', amount: '3 tbsp' },
			{ name: 'ginger', amount: '1 tbsp grated' },
		],
		steps: [
			'Slice chicken and vegetables.',
			'Stir-fry chicken until golden, set aside.',
			'Cook vegetables, return chicken, add sauce, serve over rice.',
		],
	},
	{
		id: 'r4',
		title: 'Overnight Oats',
		description: 'No-cook breakfast with oats, yogurt, and berries.',
		imageUrl:
			'https://images.unsplash.com/photo-1686344234276-dc3ac6f284ff?w=400&h=300&fit=crop',
		prepMinutes: 10,
		servings: 1,
		tags: ['quick', 'breakfast', 'vegetarian'],
		ingredients: [
			{ name: 'rolled oats', amount: '1/2 cup' },
			{ name: 'milk', amount: '1/2 cup' },
			{ name: 'greek yogurt', amount: '1/4 cup' },
			{ name: 'mixed berries', amount: '1/2 cup' },
			{ name: 'honey', amount: '1 tsp' },
		],
		steps: [
			'Mix oats, milk, and yogurt in a jar.',
			'Refrigerate overnight.',
			'Top with berries and honey before eating.',
		],
	},
	{
		id: 'r5',
		title: 'Vegetable Curry',
		description: 'Mild coconut curry packed with seasonal vegetables.',
		imageUrl:
			'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop',
		prepMinutes: 40,
		servings: 4,
		tags: ['vegetarian', 'dinner'],
		ingredients: [
			{ name: 'coconut milk', amount: '400ml' },
			{ name: 'curry paste', amount: '2 tbsp' },
			{ name: 'sweet potato', amount: '2 medium' },
			{ name: 'chickpeas', amount: '1 can' },
			{ name: 'spinach', amount: '100g' },
		],
		steps: [
			'Sauté curry paste, add coconut milk.',
			'Simmer cubed sweet potato until tender.',
			'Add chickpeas and spinach, serve with rice.',
		],
	},
	{
		id: 'r6',
		title: 'Avocado Toast Deluxe',
		description:
			'Smashed avocado on sourdough with chili flakes and a poached egg.',
		imageUrl:
			'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop',
		prepMinutes: 12,
		servings: 2,
		tags: ['quick', 'breakfast', 'vegetarian'],
		ingredients: [
			{ name: 'sourdough bread', amount: '2 slices' },
			{ name: 'avocado', amount: '2 ripe' },
			{ name: 'eggs', amount: '2' },
			{ name: 'lemon juice', amount: '1 tsp' },
			{ name: 'chili flakes', amount: 'pinch' },
		],
		steps: [
			'Toast bread until crisp.',
			'Mash avocado with lemon and salt.',
			'Poach eggs and assemble toast.',
		],
	},
	{
		id: 'r7',
		title: 'Beef Tacos',
		description: 'Seasoned ground beef tacos with fresh salsa and lime.',
		imageUrl:
			'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
		prepMinutes: 35,
		servings: 4,
		tags: ['dinner', 'protein'],
		ingredients: [
			{ name: 'ground beef', amount: '500g' },
			{ name: 'taco shells', amount: '8' },
			{ name: 'tomato', amount: '2' },
			{ name: 'onion', amount: '1' },
			{ name: 'taco seasoning', amount: '2 tbsp' },
		],
		steps: [
			'Brown beef with seasoning.',
			'Dice tomato and onion for salsa.',
			'Fill shells with beef and toppings.',
		],
	},
	{
		id: 'r8',
		title: 'Chocolate Banana Smoothie',
		description:
			'A dessert-like smoothie that feels indulgent but uses simple ingredients.',
		imageUrl:
			'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=300&fit=crop',
		prepMinutes: 5,
		servings: 2,
		tags: ['quick', 'dessert', 'vegetarian'],
		ingredients: [
			{ name: 'banana', amount: '2 frozen' },
			{ name: 'cocoa powder', amount: '2 tbsp' },
			{ name: 'milk', amount: '1 cup' },
			{ name: 'peanut butter', amount: '1 tbsp' },
			{ name: 'ice', amount: '1 cup' },
		],
		steps: [
			'Add all ingredients to a blender.',
			'Blend until smooth.',
			'Serve immediately.',
		],
	},
	{
		id: 'r9',
		title: 'Lentil Soup',
		description: 'Hearty red lentil soup with carrots and cumin.',
		imageUrl:
			'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop',
		prepMinutes: 45,
		servings: 6,
		tags: ['vegetarian', 'lunch', 'dinner'],
		ingredients: [
			{ name: 'red lentils', amount: '300g' },
			{ name: 'carrots', amount: '3' },
			{ name: 'onion', amount: '1' },
			{ name: 'vegetable stock', amount: '1.5L' },
			{ name: 'cumin', amount: '1 tsp' },
		],
		steps: [
			'Sauté onion and carrots.',
			'Add lentils, stock, and cumin.',
			'Simmer 25 minutes and blend partially if desired.',
		],
	},
	{
		id: 'r10',
		title: 'Caprese Skewers',
		description: 'Bite-sized mozzarella, tomato, and basil appetizers.',
		imageUrl:
			'https://images.unsplash.com/photo-1767114915957-2d2e61d59e7f?w=400&h=300&fit=crop',
		prepMinutes: 15,
		servings: 4,
		tags: ['quick', 'vegetarian', 'lunch'],
		ingredients: [
			{ name: 'cherry tomatoes', amount: '20' },
			{ name: 'mozzarella balls', amount: '20' },
			{ name: 'fresh basil', amount: '20 leaves' },
			{ name: 'balsamic glaze', amount: '2 tbsp' },
			{ name: 'olive oil', amount: '1 tbsp' },
		],
		steps: [
			'Thread tomato, mozzarella, and basil on skewers.',
			'Drizzle with olive oil.',
			'Finish with balsamic glaze.',
		],
	},
	{
		id: 'r11',
		title: 'Salmon with Lemon Dill',
		description: 'Oven-baked salmon fillets with a bright lemon dill sauce.',
		imageUrl:
			'https://images.unsplash.com/photo-1559058800-ab841e33ec85?w=400&h=300&fit=crop',
		prepMinutes: 28,
		servings: 2,
		tags: ['dinner', 'protein', 'quick'],
		ingredients: [
			{ name: 'salmon fillets', amount: '2' },
			{ name: 'lemon', amount: '1' },
			{ name: 'fresh dill', amount: '2 tbsp' },
			{ name: 'butter', amount: '2 tbsp' },
			{ name: 'asparagus', amount: '200g' },
		],
		steps: [
			'Season salmon and place on a baking tray with asparagus.',
			'Bake at 200°C for 15–18 minutes.',
			'Spoon melted butter, lemon juice, and dill over fish.',
		],
	},
	{
		id: 'r12',
		title: 'Apple Cinnamon Pancakes',
		description: 'Fluffy pancakes with sautéed apples and cinnamon.',
		imageUrl:
			'https://images.unsplash.com/photo-1509482560494-4126f8225994?w=400&h=300&fit=crop',
		prepMinutes: 30,
		servings: 3,
		tags: ['breakfast', 'dessert', 'vegetarian'],
		ingredients: [
			{ name: 'flour', amount: '200g' },
			{ name: 'milk', amount: '250ml' },
			{ name: 'egg', amount: '1' },
			{ name: 'apple', amount: '2' },
			{ name: 'cinnamon', amount: '1 tsp' },
		],
		steps: [
			'Whisk batter and cook pancakes on a griddle.',
			'Sauté sliced apples with cinnamon.',
			'Serve pancakes topped with warm apples.',
		],
	},
];
