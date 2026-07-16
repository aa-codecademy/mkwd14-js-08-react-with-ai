import type { SliceCreator } from '../usePantryPalStore';

export type PantryPanelSlice = {
	pantry: string[];
	pantrySearchTerm: string;
	setPantrySearchTerm: (searchTerm: string) => void;
	togglePantryItem: (name: string) => void;
	clearPantry: () => void;
};

// `pantry` only stores the ingredient NAMES the user already owns — not a boolean map
// keyed by every possible ingredient. This keeps the slice small and lets any component
// derive "is this ingredient in the pantry?" with a simple `.includes()`/Set lookup.
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
				// Toggle by presence: if it's already in the array, remove it; otherwise add it.
				// With immer, .push()/.splice() are safe to call directly on the draft array —
				// in plain Zustand you'd have to build a whole new array with spread/filter instead.
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
