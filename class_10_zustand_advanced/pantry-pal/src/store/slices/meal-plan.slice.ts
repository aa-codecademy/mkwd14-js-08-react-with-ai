import type { MealPlan, Weekday } from "../../types/meal-plan";
import type { Recipe } from "../../types/recipe";
import type { SliceCreator } from "../usePantryPalStore";

export type MealPlanSlice = {
	mealPlan: MealPlan;
	assignMeal: (day: Weekday, recipe: Recipe | null) => void;
};

export const createMealPlanSlice: SliceCreator<MealPlanSlice> = set => ({
	mealPlan: {},
	assignMeal: (day, recipe) =>
		set(
			state => {
				if (recipe) {
					state.mealPlan[day] = recipe;
				} else {
					delete state.mealPlan[day];
				}
			},
			undefined,
			'mealPlan/assign',
		),
});
