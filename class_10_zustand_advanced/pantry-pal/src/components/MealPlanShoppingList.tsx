import { useShallow } from 'zustand/shallow';
import { usePantryPalStore } from '../store/usePantryPalStore';
import { Checkbox } from './ui/checkbox';
import { Field, FieldLabel } from './ui/field';
import {
	buildShoppingList,
	selectShoppingProgress,
} from '../store/hlprs/pantry.hlpr';
import { useMemo } from 'react';
import { Button } from './ui/button';

function MealPlanShoppingList() {
	// Same useShallow pattern as PantryPanel: pull the three raw slices of state this
	// component needs (from potentially three different slice files) plus two actions,
	// in one subscription — without it, this object literal would trigger endless re-renders.
	const {
		mealPlan,
		pantry,
		checkedOffItems,
		toggleShoppingListItem,
		clearChecked,
	} = usePantryPalStore(
		useShallow(state => ({
			mealPlan: state.mealPlan,
			pantry: state.pantry,
			checkedOffItems: state.checkedOffItems,
			toggleShoppingListItem: state.toggleShoppingListItem,
			clearChecked: state.clearChecked,
		})),
	);

	// The actual "shopping list" the user sees is never stored anywhere — it's rebuilt
	// here from mealPlan + pantry + checkedOffItems every time one of them changes.
	// This guarantees it can never drift out of sync with the meal plan or pantry.
	const shoppingList = useMemo(
		() => buildShoppingList(mealPlan, pantry, checkedOffItems),
		[mealPlan, pantry, checkedOffItems],
	);

	const { total, checked, remaining } = selectShoppingProgress(shoppingList);

	const percent = total === 0 ? 0 : Math.round((checked / total) * 100);

	return (
		<section className='rounded-2xl p-5 border border-emerald-100 bg-white dark:border-slate-700 dark:bg-slate-800'>
			<div className='mb-4 flex justify-between items-center'>
				<h2 className=' text-lg font-semibold'>Shopping list</h2>
				<Button onClick={clearChecked}>Clear</Button>
			</div>

			{total === 0 ? (
				<p className='text-sm text-muted-foreground'>
					Nothing to buy — plan some meals (and uncheck pantry items you don't
					have).
				</p>
			) : (
				<>
					<div className='mb-4'>
						<div className='mb-1 flex justify-between text-sm text-muted-foreground'>
							<span>
								{checked} of {total} bought
							</span>
							<span>{remaining} left</span>
						</div>
						<div className='h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700'>
							<div
								className='h-full rounded-full bg-brand-500 transition-all duration-300'
								style={{ width: `${percent}%` }}
							/>
						</div>
					</div>
					<ul className='space-y-2'>
						{shoppingList.map(item => (
							// className='flex items-center gap-3 text-sm'
							<li key={item.name}>
								<Field orientation='horizontal'>
									<Checkbox
										checked={item.checked}
										onCheckedChange={() => toggleShoppingListItem(item.name)}
									/>
									<FieldLabel
										className={item.checked ? 'text-muted line-through' : ''}>
										{item.name} - {item.amount}
									</FieldLabel>
								</Field>
							</li>
						))}
					</ul>
				</>
			)}
		</section>
	);
}

export default MealPlanShoppingList;
