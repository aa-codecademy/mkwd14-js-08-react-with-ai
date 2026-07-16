import { usePantryPalStore } from '../store/usePantryPalStore';
import type { Weekday } from '../types/meal-plan';
import type { Recipe } from '../types/recipe';
import RecipeAutosuggest from './RecipeAutosuggest';
import { Button } from './ui/button';

const WEEKDAYS: Weekday[] = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
];

function MealPlanPanel() {
	// This component only needs one action, so a plain single-field selector is enough —
	// no useShallow required. Compare with PantryPanel/MealPlanShoppingList, which select
	// several fields at once and need useShallow to avoid re-rendering on every store change.
	// Note there's no "Build shopping list" button anymore: the shopping list is now derived
	// automatically (see MealPlanShoppingList), so nothing needs to be manually rebuilt.
	const assignMeal = usePantryPalStore(state => state.assignMeal);

	return (
		<section className='rounded-2xl border border-emerald-100 bg-white p-5 dark:border-slate-700 dark:bg-slate-800'>
			<div className='mb-4'>
				<h2 className='text-lg font-semibold'>Weekly meal plan</h2>
			</div>
			<ul className='space-y-3'>
				{WEEKDAYS.map(day => (
					<li key={day} className='flex flex-wrap items-center gap-3'>
						<span className='w-24 capitalize text-sm font-medium'>{day}</span>
						<div className='flex-1'>
							<RecipeAutosuggest
								onMealSelect={recipe => assignMeal(day, recipe)}
							/>
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}

export default MealPlanPanel;
