import RecipeAutosuggest from './RecipeAutosuggest';
import { Button } from './ui/button';

const WEEKDAYS = [
	'Monday',
	'Tuesday',
	'Wednesday',
	'Thursday',
	'Friday',
	'Saturday',
	'Sunday',
];

function MealPlanPanel() {
	return (
		<section className='rounded-2xl border border-emerald-100 bg-white p-5 dark:border-slate-700 dark:bg-slate-800'>
			<div className='mb-4 flex items-center justify-between'>
				<h2 className='text-lg font-semibold'>Weekly meal plan</h2>
				<Button type='button' variant='default'>
					Build shopping list
				</Button>
			</div>
			<ul className='space-y-3'>
				{WEEKDAYS.map(day => (
					<li key={day} className='flex flex-wrap items-center gap-3'>
						<span className='w-24 capitalize text-sm font-medium'>{day}</span>
						<div className='flex-1'>
							<RecipeAutosuggest />
						</div>
					</li>
				))}
			</ul>
		</section>
	);
}

export default MealPlanPanel;
