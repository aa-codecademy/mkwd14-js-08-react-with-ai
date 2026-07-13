import MealPlanPanel from '../components/MealPlanPanel';
import MealPlanShoppingList from '../components/MealPlanShoppingList';

function MealPlanPage() {
	return (
		<div className='grid gap-6 md:grid-cols-2 md:items-start'>
			<MealPlanPanel />
			<MealPlanShoppingList />
		</div>
	);
}

export default MealPlanPage;
