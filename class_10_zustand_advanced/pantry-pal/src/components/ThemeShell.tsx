import type { ReactNode } from 'react';
import { useTheme } from '../context/theme-context';

// ThemeShell is a Context consumer: it must render *inside* <ThemeProvider> (see App.tsx)
// so useTheme() can find a value. Its whole job is to translate the `theme` string from
// context into Tailwind classes — no other component needs to know how theming is implemented.
export function ThemeShell({ children }: { children: ReactNode }) {
	const { theme } = useTheme();

	return (
		<div
			className={
				theme === 'dark'
					? 'dark bg-slate-900 text-slate-100'
					: 'bg-linear-to-b from-brand-50 to-white text-slate-900'
			}>
			{children}
		</div>
	);
}
