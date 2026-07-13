import type { Recipe } from './recipe';

export type Weekday =
	| 'Monday'
	| 'Tuesday'
	| 'Wednesday'
	| 'Thursday'
	| 'Friday'
	| 'Saturday'
	| 'Sunday';

export type MealPlan = Partial<Record<Weekday, Recipe | null>>;

export type ShoppingListItem = {
	name: string;
	value: string;
	checked: boolean;
};

export type ShoppingList = ShoppingListItem[];
