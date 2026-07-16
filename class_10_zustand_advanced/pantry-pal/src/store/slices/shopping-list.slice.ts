import type { SliceCreator } from '../usePantryPalStore';

// Notice there's no `shoppingList` array stored here anymore (compare with class 9's
// store). Only the "checked" state is real, owned data — the actual list of items is
// DERIVED from mealPlan + pantry + checkedOffItems (see store/hlprs/pantry.hlpr.ts).
// Storing derived data leads to it going stale/out of sync; computing it on the fly
// from the source-of-truth state avoids that entirely.
export type ShoppingListSlice = {
	checkedOffItems: Record<string, boolean>;
	toggleShoppingListItem: (name: string) => void;
	clearChecked: () => void;
};

export const createShoppingListSlice: SliceCreator<
	ShoppingListSlice
> = set => ({
	checkedOffItems: {},
	toggleShoppingListItem: (name: string) => {
		set(
			state => {
				state.checkedOffItems[name] = !state.checkedOffItems[name];
			},
			undefined,
			'shopping/toggleShoppingListItem',
		);
	},
	clearChecked: () =>
		set(
			state => {
				state.checkedOffItems = {};
			},
			undefined,
			'shopping/clearChecked',
		),
});
