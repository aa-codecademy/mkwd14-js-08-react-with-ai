import { create } from 'zustand';
import type { MealPlan, ShoppingList, Weekday } from '../types/meal-plan';
import type { Recipe } from '../types/recipe';
import { persist } from 'zustand/middleware';

// Zustand store: unlike Context, this state lives OUTSIDE the component tree entirely —
// there's no <Provider> to wrap around App. Any component can import this hook directly
// and read/update the same shared state, without prop drilling or a Context wrapper.
type PantryPalState = {
	mealPlan: MealPlan;
	shoppingList: ShoppingList;
	assignMeal: (day: Weekday, recipe: Recipe | null) => void;
	rebuildShoppingList: () => void;
	toggleShoppingListItem: (name: string) => void;
};

// create<T>()(...) — the extra () is required when combining with middleware like `persist`
// so TypeScript can correctly infer the store's type. Actions live right alongside the state
// they modify, instead of being passed down as separate props/callbacks.
export const usePantryPalStore = create<PantryPalState>()(
	// persist wraps the store so its state is automatically saved to (and rehydrated from)
	// localStorage under the given `name` key — same idea as useLocalStorage, but built into
	// the store itself instead of a custom hook.
	persist(
		(set, get) => ({
			mealPlan: {},
			shoppingList: [],
			assignMeal: (day, recipe) => {
				// set() takes a function of the current state and returns only the fields to change —
				// Zustand shallow-merges the return value into the store, similar to setState's updater form.
				set(state => {
					// Copy the object before mutating it — never mutate state.mealPlan directly,
					// or Zustand won't detect a change and subscribed components won't re-render.
					const mealPlan = { ...state.mealPlan };
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
				// get() reads the current state without subscribing to it — used here because
				// this action just needs a snapshot to compute from, not a reactive re-render.
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
		// This `name` is the actual localStorage key — check devtools > Application > Local Storage
		// to see the persisted JSON while the app is running.
		{ name: 'pantry-pal-store' },
	),
);
