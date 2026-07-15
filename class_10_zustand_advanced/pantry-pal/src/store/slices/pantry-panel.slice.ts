import type { SliceCreator } from '../usePantryPalStore';

export type PantryPanelSlice = {
	pantry: string[];
	pantrySearchTerm: string;
	setPantrySearchTerm: (searchTerm: string) => void;
	togglePantryItem: (name: string) => void;
	clearPantry: () => void;
};

export const createPantryPanelSlice: SliceCreator<PantryPanelSlice> = set => ({
	pantry: [],
	pantrySearchTerm: '',
	setPantrySearchTerm: searchTerm =>
		set(
			state => {
				state.pantrySearchTerm = searchTerm;
			},
			undefined,
			'pantryPanel/setPantrySearchTerm',
		),
	togglePantryItem: name =>
		set(
			state => {
				const index = state.pantry.indexOf(name);

				if (index === -1) {
					state.pantry.push(name);
				} else {
					state.pantry.splice(index, 1);
				}
			},
			undefined,
			'pantryPanel/togglePantryItem',
		),
	clearPantry: () =>
		set(
			state => {
				state.pantry = [];
			},
			undefined,
			'pantryPanel/clearPantry',
		),
});
