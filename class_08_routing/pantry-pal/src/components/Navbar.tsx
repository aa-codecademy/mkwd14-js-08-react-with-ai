// Defining nav items as data (array of objects) instead of hardcoded JSX makes it

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/theme-context';
import { NavLink } from 'react-router-dom';

// trivial to add a new page — just add a new object here, no HTML to duplicate.
const NAV_ITEMS: { path: string; label: string; end?: boolean }[] = [
	{ path: '/', label: 'Home', end: true },
	{ path: '/recipe/new', label: 'Add recipe' },
	{ path: '/favorites', label: 'Favorites' },
];

function NavBar() {
	// theme/toggleTheme come from Context, not props — NavBar is nowhere near ThemeProvider
	// in JSX terms here, but it can still read the value because it renders inside it (see App.tsx).
	const { theme, toggleTheme } = useTheme();

	return (
		<nav className='border-b border-emerald-100 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80'>
			<div className='mx-auto flex max-w-6xl items-center gap-1 px-6 py-3'>
				<span className='mr-4 font-bold text-brand-700 dark:text-emerald-300'>
					PantryPal
				</span>
				{/* NavLink instead of a plain <a>: clicking it updates the URL via the History API
				    and re-renders only the routed content — no full page reload, no losing React state.
				    A plain <a href="/favorites"> would force a full browser navigation instead. */}
				{NAV_ITEMS.map(item => (
					<NavLink
						key={item.path}
						to={item.path}
						// `end` forces exact matching for "/" — without it, NavLink would treat
						// "/" as a prefix and mark Home active on every route (since every path starts with "/").
						end={item.end}
						className={({ isActive }) =>
							isActive
								? 'rounded-lg bg-brand-700 px-4 py-2 text-sm text-white font-semibold cursor-pointer'
								: 'rounded-lg px-4 py-2 text-sm text-slate-600 font-medium hover:text-brand-700 cursor-pointer dark:text-slate-300 dark:hover:text-emerald-300'
						}>
						{item.label}
					</NavLink>
				))}
				<button
					type='button'
					aria-label='Toggle theme'
					onClick={toggleTheme}
					className='cursor-pointer ml-auto rounded-lg border-slate-200 p-2 text-slate-600 hover:text-brand-700 dark:border-slate-700 dark:text-slate-300'>
					{theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
				</button>
			</div>
		</nav>
	);
}

export default NavBar;
