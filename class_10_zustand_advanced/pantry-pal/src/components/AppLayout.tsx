import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './Navbar';
import { ThemeShell } from './ThemeShell';

// This is a layout route component (see App.tsx). It renders once and stays mounted
// while the user navigates between child routes — only <Outlet /> swaps out.
// That's why NavBar, the theme toggle, etc. don't remount/flicker on every navigation.
function AppLayout() {
	const location = useLocation();

	return (
		<ThemeShell>
			<NavBar />
			<main className='mx-auto max-w-6xl px-6 py-10'>
				{/* Outlet is the placeholder where React Router injects whichever child
				    <Route element={...}/> matched the current URL (HomePage, RecipeDetailsPage, etc.). */}
				<div
					// key={location.pathname} forces React to treat this <div> as a brand-new
					// element on every navigation (instead of reusing the old one), which is what
					// makes the fade/slide-in animation classes replay on each page change.
					key={location.pathname}
					className='animate-in fade-in slide-in-from-bottom-1 duration-300'>
					<Outlet />
				</div>
			</main>
		</ThemeShell>
	);
}

export default AppLayout;
