import { createContext, use } from 'react';

export type Theme = 'light' | 'dark';

export type ThemeContextValue = {
	theme: Theme;
	toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
	const ctx = use(ThemeContext);

	if (!ctx) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return ctx;
}
