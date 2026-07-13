import { create } from 'zustand';
import type { MealPlan, ShoppingList, Weekday } from '../types/meal-plan';
import type { Recipe } from '../types/recipe';
import { persist } from 'zustand/middleware';

type PantryPalState = {
	mealPlan: MealPlan;
	shoppingList: ShoppingList;
	assignMeal: (day: Weekday, recipe: Recipe | null) => void;
	rebuildShoppingList: () => void;
	toggleShoppingListItem: (name: string) => void;
};

export const usePantryPalStore = create<PantryPalState>()(
	persist(
		(set, get) => ({
			mealPlan: {},
			shoppingList: [],
			assignMeal: (day, recipe) => {
				set(state => {
					const mealPlan = { ...state.mealPlan };
					console.log('🚀 ~ mealPlan:', mealPlan);
					if (recipe) {
						mealPlan[day] = recipe;
					} else {
						delete mealPlan[day];
					}

					return { mealPlan };
				});
			},
			toggleShoppingListItem: (name: string) => {
				set(state => ({
					shoppingList: state.shoppingList.map(item =>
						item.name === name ? { ...item, checked: !item.checked } : item,
					),
				}));
			},
			rebuildShoppingList: () => {
				const { mealPlan } = get();

				const selectedRecipes = Object.values(mealPlan).filter(
					recipe => !!recipe,
				);

				const ingredientsByName = new Map<string, string>();

				for (const recipe of selectedRecipes) {
					for (const ingredient of recipe.ingredients) {
						ingredientsByName.set(ingredient.name, ingredient.amount);
					}
				}

				const shoppingList: ShoppingList = Array.from(
					ingredientsByName.entries(),
				).map(([name, value]) => ({
					name,
					value,
					checked: false,
				}));

				set({
					shoppingList,
				});
			},
		}),
		{ name: 'pantry-pal-store' },
	),
);
