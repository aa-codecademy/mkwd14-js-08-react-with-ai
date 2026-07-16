import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { lazy } from 'react';

// lazy() defers loading each page's code until it's actually navigated to, splitting
// the app into smaller chunks instead of one big bundle shipped up front.
// Gotcha: lazy() components are supposed to be wrapped in a <Suspense fallback={...}>
// so React has something to show while the chunk downloads. There isn't one here —
// it "works" because the chunks load near-instantly in dev — but a real app should
// wrap <Routes> (or each <Route element>) in <Suspense> to avoid a blank flash/error
// on a slower connection.
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'));
const HomePage = lazy(() => import('./pages/HomePage'));
const NewRecipePage = lazy(() => import('./pages/NewRecipePage'));
const EditRecipePage = lazy(() => import('./pages/EditRecipePage'));
const RecipeDetailsPage = lazy(() => import('./pages/RecipeDetailsPage'));
const MealPlanPage = lazy(() => import('./pages/MealPlanPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

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

							{/* `*` is a wildcard segment that matches any URL not matched above.
							    Keep it LAST — Routes ranks matches by specificity, but a catch-all
							    listed first would still only win when nothing more specific matches. */}
							<Route path='*' element={<NotFoundPage />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</ThemeProvider>
		</FavoritesProvider>
	);
}

export default App;
