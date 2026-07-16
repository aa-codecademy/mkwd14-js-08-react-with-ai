import type { MealPlan } from '../../types/meal-plan';

// These are plain functions, not Zustand actions — they take state as arguments and
// return computed values, with no dependency on the store itself. Keeping "derive X
// from state" logic here (instead of inline in a component or inside the store) makes
// it reusable across components and trivial to unit test without rendering anything.

export type PantryOption = {
	name: string;
	amount: string;
	inPantry: boolean;
};

export function buildPantryOptions(mealPlan: MealPlan, pantry: string[]) {
	const pantryItems = new Set(pantry);
	return Array.from(collectNeededIngredients(mealPlan).entries()).map(
		([name, amount]) => ({ name, amount, inPantry: pantryItems.has(name) }),
	);
}

// Not exported — an internal helper shared by buildPantryOptions and buildShoppingList
// below, so the "walk every recipe in the plan and collect its ingredients" logic
// lives in exactly one place.
function collectNeededIngredients(mealPlan: MealPlan): Map<string, string> {
	const ingredientsByName = new Map<string, string>();

	for (const recipe of Object.values(mealPlan)) {
		if (!recipe) continue;
		for (const ingredient of recipe.ingredients) {
			ingredientsByName.set(ingredient.name, ingredient.amount);
		}
	}

	return ingredientsByName;
}

// The shopping list is entirely computed: start from everything the meal plan needs,
// remove whatever's already in the pantry, then attach each item's checked status.
// Nothing here is stored as "the shopping list" anywhere — this function IS the source.
export function buildShoppingList(
	mealPlan: MealPlan,
	pantry: string[],
	checkedOffItems: Record<string, boolean>,
) {
	const ingredientsWeAlreadyHave = new Set(pantry);

	return Array.from(collectNeededIngredients(mealPlan).entries())
		.filter(([name]) => !ingredientsWeAlreadyHave.has(name))
		.map(([name, amount]) => ({
			name,
			amount,
			checked: !!checkedOffItems[name],
		}));
}

// A small "selector" over an already-built list — separated out so a component can
// show progress (e.g. a progress bar) without recomputing or duplicating this math.
export function selectShoppingProgress(
	list: { name: string; amount: string; checked: boolean }[],
) {
	const total = list.length;
	const checked = list.filter(item => item.checked).length;

	return { total, checked, remaining: total - checked };
}
