import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import FavoritesPage from './pages/FavoritesPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import NewRecipePage from './pages/NewRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import MealPlanPage from './pages/MealPlanPage';

function App() {
	return (
		<FavoritesProvider>
			<ThemeProvider>
				{/* BrowserRouter uses the browser's History API (pushState) to keep the URL in sync
				    with the UI, without asking the server for a new page. Everything that needs
				    routing (Routes, Route, Link, useParams, useNavigate...) must live inside it. */}
				<BrowserRouter>
					{/* Routes looks at the current URL and renders the single best-matching Route.
					    Unlike old v5 <Switch>, v6 <Routes> picks the best match automatically,
					    so route order matters much less than it used to. */}
					<Routes>
						{/* A parent Route with no `path` + an `element` is a layout route: it renders
						    AppLayout for every child path below, and AppLayout decides where the
						    matched child renders via <Outlet />. This is how nested routes work. */}
						<Route element={<AppLayout />}>
							{/* `index` marks the default child route — it renders at the parent's
							    exact path ("/") when no other child path matches. */}
							<Route index element={<HomePage />} />
							<Route path='favorites' element={<FavoritesPage />} />
							<Route path='recipe/new' element={<NewRecipePage />} />
							{/* `:id` is a dynamic route segment (a route param). Whatever the user
							    puts in that URL slot is read inside the page via useParams(). */}
							<Route path='recipe/:id' element={<RecipeDetailsPage />} />
							{/* Gotcha: static segments like "new" and "edit" must not collide with
							    the `:id` pattern in a way that makes matching ambiguous. React Router
							    v6 ranks static segments as more specific, but keep paths unambiguous. */}
							<Route path='recipe/:id/edit' element={<EditRecipePage />} />

							<Route path='meal-plan' element={<MealPlanPage />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</FavoritesProvider>
	);
}

export default App;
