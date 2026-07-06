import { useState } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/recipe-list/RecipeList';
import NavBar from './components/Navbar';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeShell } from './components/ThemeShell';
import { FavoritesProvider } from './context/FavoritesContext';
import FavoritesPages from './components/FavoritesPage';

function App() {
	const [pageInView, setPageInView] = useState<'home' | 'form' | 'favorites'>(
		'home',
	);

	return (
		<FavoritesProvider>
			<ThemeProvider>
				<ThemeShell>
					<NavBar
						pageInView={pageInView}
						onPageSelect={page => setPageInView(page)}
					/>

					<main className='mx-auto max-w-6xl px-6 py-10'>
						{pageInView === 'home' && <RecipeList />}

						{pageInView === 'form' && (
							<RecipeForm onSuccess={() => setPageInView('home')} />
						)}

						{pageInView === 'favorites' && <FavoritesPages />}
					</main>
				</ThemeShell>
			</ThemeProvider>
		</FavoritesProvider>
	);
}

export default App;
