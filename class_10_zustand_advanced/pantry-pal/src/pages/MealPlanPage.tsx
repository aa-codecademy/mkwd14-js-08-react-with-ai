import MealPlanPanel from '../components/MealPlanPanel';
import MealPlanShoppingList from '../components/MealPlanShoppingList';
import PantryPanel from '../components/PantryPanel';

function MealPlanPage() {
	return (
		<div className='grid gap-6 md:grid-cols-3 md:items-start'>
			<MealPlanPanel />
			<PantryPanel />
			<MealPlanShoppingList />
		</div>
	);
}

export default MealPlanPage;
