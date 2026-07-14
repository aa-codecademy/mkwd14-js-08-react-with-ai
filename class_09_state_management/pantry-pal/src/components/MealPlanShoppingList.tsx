import { usePantryPalStore } from '../store/usePantryPalStore';
import { Checkbox } from './ui/checkbox';
import { Field, FieldLabel } from './ui/field';

function MealPlanShoppingList() {
	// Selecting just `shoppingList` (not the whole store) means this component won't re-render
	// when, say, mealPlan changes in MealPlanPanel — the two components share one store but
	// only re-render for the slice of state they actually asked for.
	const shoppingList = usePantryPalStore(state => state.shoppingList);
	const toggleShoppingListItem = usePantryPalStore(
		state => state.toggleShoppingListItem,
	);

	return (
		<section className='rounded-2xl p-5 border border-emerald-100 bg-white dark:border-slate-700 dark:bg-slate-800'>
			<h2 className='mb-4 text-lg font-semibold'>Shopping list</h2>
			<ul className='space-y-2'>
				{shoppingList.map(item => (
					// className='flex items-center gap-3 text-sm'
					<li key={item.name}>
						<Field orientation='horizontal'>
							<Checkbox
								checked={item.checked}
								onCheckedChange={() => toggleShoppingListItem(item.name)}
							/>
							<FieldLabel>
								{item.name} - {item.value}
							</FieldLabel>
						</Field>
					</li>
				))}
			</ul>
		</section>
	);
}

export default MealPlanShoppingList;
