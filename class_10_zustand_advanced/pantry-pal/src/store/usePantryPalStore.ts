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

type PantryPalState = MealPlanSlice & PantryPanelSlice & ShoppingListSlice;

export type SliceCreator<T> = StateCreator<
	PantryPalState,
	[['zustand/devtools', never], ['zustand/immer', never]],
	[],
	T
>;

export const usePantryPalStore = create<PantryPalState>()(
	devtools(
		immer((...args) => ({
			...createMealPlanSlice(...args),
			...createShoppingListSlice(...args),
			...createPantryPanelSlice(...args),
		})),
		{ name: 'PantryPal' },
	),
);
