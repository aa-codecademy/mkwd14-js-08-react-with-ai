import type { MealPlan } from '../../types/meal-plan';

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

export function selectShoppingProgress(
	list: { name: string; amount: string; checked: boolean }[],
) {
	const total = list.length;
	const checked = list.filter(item => item.checked).length;

	return { total, checked, remaining: total - checked };
}
