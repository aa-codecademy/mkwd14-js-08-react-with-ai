import MealPlanPanel from '../components/MealPlanPanel';
import MealPlanShoppingList from '../components/MealPlanShoppingList';
import PantryPanel from '../components/PantryPanel';

function MealPlanPage() {
	// All three panels read from the SAME usePantryPalStore, but each one selects only
	// the slice(s) it needs. Ticking a pantry item re-renders PantryPanel and
	// MealPlanShoppingList (both depend on `pantry`) but not MealPlanPanel, which never
	// subscribed to it — this is the payoff of selecting narrowly instead of the whole store.
	return (
		<div className='grid gap-6 md:grid-cols-3 md:items-start'>
			<MealPlanPanel />
			<PantryPanel />
			<MealPlanShoppingList />
		</div>
	);
}

export default MealPlanPage;
