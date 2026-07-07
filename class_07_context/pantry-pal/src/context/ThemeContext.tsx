import { useState, type ReactNode } from 'react';
import { ThemeContext, type Theme } from './theme-context';

// The Provider component: it owns the actual state (useState) and is the ONLY
// place that calls setTheme. Everything below <ThemeContext value={...}> can read
// {theme, toggleTheme} via useTheme() without App having to pass props through every level.
// This file only exports a component (ThemeProvider) — the context object and hook live in
// theme-context.ts instead, so Vite's Fast Refresh doesn't warn about a file exporting both
// components and non-component values (which breaks hot reloading of the component).
export function ThemeProvider({ children }: { children: ReactNode }) {
	const [theme, setTheme] = useState<Theme>('light');

	const toggleTheme = () => {
		if (theme === 'light') {
			setTheme('dark');
		} else {
			setTheme('light');
		}
	};

	// Whatever object we pass as `value` here is what every useTheme() call receives.
	// Note: a new object literal is created on every render — descendants that read this
	// context re-render whenever ThemeProvider re-renders, even if theme itself didn't change.
	return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
}
