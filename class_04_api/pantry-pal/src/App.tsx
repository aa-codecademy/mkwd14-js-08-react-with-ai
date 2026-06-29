import Header from './components/Header';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';

function App() {
	return (
		// min-h-screen ensures the gradient fills at least the full viewport height even with little content.
		<div className='min-h-screen bg-linear-to-b from-brand-50 to-white'>
			<Header />
			<main className='mx-auto max-w-6xl px-6 py-10'>
				{/* <RecipeForm /> */}
				{/* Responsive grid: 1 column on mobile, 2 on sm, 3 on lg, 4 on xl.
				    Tailwind's responsive prefixes (sm:, lg:, xl:) apply from that breakpoint upward. */}

				{/* .map() turns each recipe object into a Recipe component.
					    IMPORTANT: `key` is missing here — every mapped element needs a unique `key` prop
					    so React can identify which card changed during re-renders. Add key={recipe.id}. */}
				<RecipeList />
			</main>
		</div>
	);
}

export default App;
