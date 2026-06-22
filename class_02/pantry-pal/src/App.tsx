import Header from './components/Header';
import Recipe from './components/Recipe';
import { RECIPES } from './data/seedData';

function App() {
	return (
		<div className='min-h-screen bg-linear-to-b from-brand-50 to-white'>
			<Header />
			<main className='mx-auto max-w-6xl px-6 py-10'>
				<div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
					{RECIPES.map(recipe => (
						<Recipe recipe={recipe} />
					))}
				</div>
			</main>
		</div>
	);
}

export default App;
