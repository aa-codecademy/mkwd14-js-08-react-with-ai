import type { SliceCreator } from '../usePantryPalStore';

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
