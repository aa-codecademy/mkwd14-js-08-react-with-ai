import { useShallow } from 'zustand/shallow';
import { usePantryPalStore } from '../store/usePantryPalStore';
import { Checkbox } from './ui/checkbox';
import { Field, FieldLabel } from './ui/field';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useMemo } from 'react';
import { buildPantryOptions } from '../store/hlprs/pantry.hlpr';

function PantryPanel() {
	// Selecting several fields at once means the selector returns a brand-new object
	// literal on every call — without useShallow, Zustand would see a "new" reference
	// every render (even if none of the values actually changed) and re-render forever.
	// useShallow instead compares the object's fields one level deep, so the component
	// only re-renders when one of these six values actually changes.
	const {
		mealPlan,
		pantry,
		pantrySearchTerm,
		setPantrySearchTerm,
		clearPantry,
		togglePantryItem,
	} = usePantryPalStore(
		useShallow(state => ({
			mealPlan: state.mealPlan,
			pantry: state.pantry,
			pantrySearchTerm: state.pantrySearchTerm,
			setPantrySearchTerm: state.setPantrySearchTerm,
			clearPantry: state.clearPantry,
			togglePantryItem: state.togglePantryItem,
		})),
	);

	// buildPantryOptions is a plain, non-reactive function — useMemo just avoids
	// recomputing the derived list on every render, only when mealPlan or pantry change.
	const options = useMemo(
		() => buildPantryOptions(mealPlan, pantry),
		[mealPlan, pantry],
	);

	const visibleOptions = useMemo(
		() =>
			options.filter(option =>
				option.name
					.toLowerCase()
					.includes(pantrySearchTerm.toLocaleLowerCase()),
			),
		[options, pantrySearchTerm],
	);

	return (
		<section className='rounded-2xl border border-emerald-100 bg-white p-5 dark:border-slate-700 dark:bg-slate-800'>
			<div className='mb-4 flex items-center justify-between'>
				<h2 className='text-lg font-semibold'>Pantry Panel</h2>
				{pantry.length > 0 && <Button onClick={clearPantry}>Clear</Button>}
			</div>
			<>
				<Input
					type='search'
					placeholder='Filter ingredients'
					className='mb-3'
					value={pantrySearchTerm}
					onChange={event => setPantrySearchTerm(event.target.value)}
				/>
				<p className='mb-3 text-sm text-muted-foreground'>
					Check what you already have — it'll be removed from the shopping list.
				</p>
				<ul className='space-y-2'>
					{visibleOptions.map(item => (
						<li key={item.name}>
							<Field orientation='horizontal'>
								<Checkbox
									checked={item.inPantry}
									onCheckedChange={() => togglePantryItem(item.name)}
								/>
								<FieldLabel
									className={item.inPantry ? 'text-muted line-through' : ''}>
									{item.name} - {item.amount}
								</FieldLabel>
							</Field>
						</li>
					))}
				</ul>
			</>
		</section>
	);
}

export default PantryPanel;
