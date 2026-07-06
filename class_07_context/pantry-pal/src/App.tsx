import { useState } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import NavBar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeShell } from './components/ThemeShell';

function App() {
	const [pageInView, setPageInView] = useState<'home' | 'form'>('home');

	return (
		<ThemeProvider>
			<ThemeShell>
				<div className='min-h-screen bg-linear-to-b from-brand-50 to-white'>
					<NavBar
						pageInView={pageInView}
						onPageSelect={page => setPageInView(page)}
					/>

					<main className='mx-auto max-w-6xl px-6 py-10'>
						{pageInView === 'home' && <RecipeList />}

						{pageInView === 'form' && (
							<RecipeForm onSuccess={() => setPageInView('home')} />
						)}
					</main>
				</div>
			</ThemeShell>
		</ThemeProvider>
	);
}

export default App;
