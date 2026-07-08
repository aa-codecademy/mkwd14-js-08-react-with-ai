import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import FavoritesPage from './pages/FavoritesPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import NewRecipePage from './pages/NewRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';

function App() {
	return (
		<FavoritesProvider>
			<ThemeProvider>
				<BrowserRouter>
					<Routes>
						<Route element={<AppLayout />}>
							<Route index element={<HomePage />} />
							<Route path='favorites' element={<FavoritesPage />} />
							<Route path='recipe/new' element={<NewRecipePage />} />
							<Route path='recipe/:id' element={<RecipeDetailsPage />} />
							<Route path='recipe/:id/edit' element={<EditRecipePage />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</FavoritesProvider>
	);
}

export default App;
