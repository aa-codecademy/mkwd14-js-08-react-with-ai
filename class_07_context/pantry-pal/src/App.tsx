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

	// Providers wrap the tree near the root: every component nested inside (NavBar, RecipeList,
	// RecipeCard, FavoritesPages, ...) can now call useFavorites()/useTheme() directly, with no
	// props passed through App -> RecipeList -> RecipeCard. Nesting order matters only if one
	// Provider depends on another's context; here Favorites and Theme are independent, so either
	// order works.
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
