import type { MealPlan, Weekday } from "../../types/meal-plan";
import type { Recipe } from "../../types/recipe";
import type { SliceCreator } from "../usePantryPalStore";

// This is the "slice": the type describes only the piece of the store this file owns.
// It gets merged with the other slices in usePantryPalStore.ts to form the full state.
export type MealPlanSlice = {
	mealPlan: MealPlan;
	assignMeal: (day: Weekday, recipe: Recipe | null) => void;
};

export const createMealPlanSlice: SliceCreator<MealPlanSlice> = set => ({
	mealPlan: {},
	assignMeal: (day, recipe) =>
		// Thanks to the immer middleware, `state` here is a mutable "draft" — writing
		// state.mealPlan[day] = recipe directly is safe and produces a new immutable
		// state under the hood. Without immer this would silently mutate real state
		// and Zustand wouldn't know to notify subscribers.
		set(
			state => {
				if (recipe) {
					state.mealPlan[day] = recipe;
				} else {
					delete state.mealPlan[day];
				}
			},
			// undefined here is `replace` (unused); the string is the action name that
			// shows up in Redux DevTools for this update — see the devtools() wrapper.
			undefined,
			'mealPlan/assign',
		),
});
