import { Outlet } from 'react-router-dom';
import NavBar from './Navbar';
import { ThemeShell } from './ThemeShell';

// This is a layout route component (see App.tsx). It renders once and stays mounted
// while the user navigates between child routes — only <Outlet /> swaps out.
// That's why NavBar, the theme toggle, etc. don't remount/flicker on every navigation.
function AppLayout() {
	return (
		<ThemeShell>
			<NavBar />
			<main className='mx-auto max-w-6xl px-6 py-10'>
				{/* Outlet is the placeholder where React Router injects whichever child
				    <Route element={...}/> matched the current URL (HomePage, RecipeDetailsPage, etc.). */}
				<Outlet />
			</main>
		</ThemeShell>
	);
}

export default AppLayout;
