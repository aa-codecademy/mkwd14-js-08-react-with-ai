// Defining nav items as data (array of objects) instead of hardcoded JSX makes it

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/theme-context';

// trivial to add a new page — just add a new object here, no HTML to duplicate.
const NAV_ITEMS: { id: 'home' | 'form'; label: string }[] = [
	{ id: 'home', label: 'Home' },
	{ id: 'form', label: 'Add recipe' },
];

type NavBarProps = {
	pageInView: string;
	// onPageSelect is a callback prop — the parent (App) owns the state, NavBar just signals what was clicked.
	// This is the "lift state up" pattern: shared state lives in the closest common ancestor.
	onPageSelect: (page: 'form' | 'home') => void;
};

function NavBar({ pageInView, onPageSelect }: NavBarProps) {
	const { theme, toggleTheme } = useTheme();

	return (
		<nav className='border-b border-emerald-100 bg-white/80 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/80'>
			<div className='mx-auto flex max-w-6xl items-center gap-1 px-6 py-3'>
				<span className='mr-4 font-bold text-brand-700 dark:text-emerald-300'>
					PantryPal
				</span>
				{NAV_ITEMS.map(item => (
					<button
						type='button'
						onClick={() => onPageSelect(item.id)}
						// Dynamic className: apply active styles when this item matches the current page.
						// The ternary returns one of two complete class strings — not a partial class name.
						className={
							pageInView === item.id
								? 'rounded-lg bg-brand-700 px-4 py-2 text-sm text-white font-semibold cursor-pointer'
								: 'rounded-lg px-4 py-2 text-sm text-slate-600 font-medium hover:text-brand-700 cursor-pointer dark:text-slate-300 dark:hover:text-emerald-300'
						}
						key={item.id}>
						{item.label}
					</button>
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
