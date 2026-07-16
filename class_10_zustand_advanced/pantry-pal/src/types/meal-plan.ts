import type { Recipe } from './recipe';

export type Weekday =
	| 'Monday'
	| 'Tuesday'
	| 'Wednesday'
	| 'Thursday'
	| 'Friday'
	| 'Saturday'
	| 'Sunday';

// Partial<Record<Weekday, ...>> means not every weekday has to have an entry —
// a day with no meal assigned simply isn't a key in this object, rather than being
// present with an `undefined` value.
export type MealPlan = Partial<Record<Weekday, Recipe | null>>;

// Note: there's no ShoppingList/ShoppingListItem type here anymore (see class 9's
// version). The shopping list is now derived data, not stored state — its shape is
// just whatever store/hlprs/pantry.hlpr.ts's buildShoppingList happens to return.
