import { useState } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import NavBar from './components/Navbar';

function App() {
	// pageInView acts as a simple client-side router — no URL changes, just conditional rendering.
	// The union type 'home' | 'form' prevents any typo from compiling (e.g. 'hom' would be a type error).
	const [pageInView, setPageInView] = useState<'home' | 'form'>('home');

	return (
		// min-h-screen ensures the gradient fills at least the full viewport height even with little content.
		<div className='min-h-screen bg-linear-to-b from-brand-50 to-white'>
			<NavBar
				pageInView={pageInView}
				onPageSelect={page => setPageInView(page)}
			/>
			{/* <Header /> */}
			{/* <nav>
				<ul>
					<li onClick={() => setPageInView('home')}>Home</li>
					<li onClick={() => setPageInView('form')}>Form</li>
				</ul>
			</nav> */}
			<main className='mx-auto max-w-6xl px-6 py-10'>
				{pageInView === 'home' && <RecipeList />}

				{pageInView === 'form' && (
					<RecipeForm onSuccess={() => setPageInView('home')} />
				)}
			</main>
		</div>
	);
}

export default App;
