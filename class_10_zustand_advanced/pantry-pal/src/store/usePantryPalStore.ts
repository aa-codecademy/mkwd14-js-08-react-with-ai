import { create, type StateCreator } from 'zustand';
import type { MealPlan, ShoppingList, Weekday } from '../types/meal-plan';
import type { Recipe } from '../types/recipe';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';
import {
	createShoppingListSlice,
	type ShoppingListSlice,
} from './slices/shopping-list.slice';
import {
	createMealPlanSlice,
	type MealPlanSlice,
} from './slices/meal-plan.slice';
import { createPantryPanelSlice, type PantryPanelSlice } from './slices/pantry-panel.slice';

// The "slice pattern": instead of one giant object with every field and action,
// each concern (meal plan, pantry, shopping list) gets its own file and its own type.
// PantryPalState is just the intersection (&) of all of them — there is still only
// ONE store at runtime, this is purely a way to organize the code as it grows.
type PantryPalState = MealPlanSlice & PantryPanelSlice & ShoppingListSlice;

// StateCreator's second generic argument is the "mutator tuple" — it must list every
// middleware wrapping the store (devtools, then immer, matching the order below) so
// each slice file's `set`/`get` are typed correctly (e.g. immer's draft-mutation style).
export type SliceCreator<T> = StateCreator<
	PantryPalState,
	[['zustand/devtools', never], ['zustand/immer', never]],
	[],
	T
>;

export const usePantryPalStore = create<PantryPalState>()(
	// devtools connects this store to the Redux DevTools browser extension — you can inspect
	// every state change and the action name that caused it (see the 'mealPlan/assign' strings
	// in the slice files) without writing any extra logging code.
	devtools(
		// immer lets every slice's `set` callback mutate `state` directly (state.pantry.push(...))
		// instead of manually spreading/copying — immer produces the actual immutable update behind
		// the scenes. Without this middleware, mutating state.pantry directly would be a bug.
		immer((...args) => ({
			// Each create*Slice(...args) returns a plain object of state + actions for its own
			// concern; spreading them together here merges them into the single store object.
			...createMealPlanSlice(...args),
			...createShoppingListSlice(...args),
			...createPantryPanelSlice(...args),
		})),
		{ name: 'PantryPal' },
	),
);
