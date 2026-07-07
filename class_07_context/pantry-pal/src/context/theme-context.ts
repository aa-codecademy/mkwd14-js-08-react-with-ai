import { createContext, use } from 'react';

export type Theme = 'light' | 'dark';

export type ThemeContextValue = {
	theme: Theme;
	toggleTheme: () => void;
};

// createContext makes a "channel" that any descendant component can read from
// with useContext/use, without the value being passed down as props at every level.
// Default is `null` so we can detect "no Provider above me" and fail loudly (see useTheme below).
export const ThemeContext = createContext<ThemeContextValue | null>(null);

// Custom hook wrapping use(Context): this is the standard Context pattern —
// consumers call useTheme() instead of use(ThemeContext) directly, which:
//  1) hides the context object from the public API,
//  2) gives us one place to add the "used outside provider" guard below.
export function useTheme() {
	const ctx = use(ThemeContext);

	// Null check gotcha: without a Provider ancestor, ctx is the default value (null here).
	// Throwing early turns a silent "theme is undefined" bug into a clear error at the call site.
	if (!ctx) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return ctx;
}
