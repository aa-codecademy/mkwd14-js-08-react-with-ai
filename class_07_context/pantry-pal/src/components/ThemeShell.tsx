import type { ReactNode } from 'react';
import { useTheme } from '../context/theme-context';

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
