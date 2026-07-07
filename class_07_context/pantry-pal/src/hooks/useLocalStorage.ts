import { useEffect, useState } from 'react';

// A drop-in replacement for useState that also persists to localStorage — useState's API
// ([value, setValue]) is intentionally mirrored so any component can swap one for the other.
export function useLocalStorage<T>(key: string, initialValue: T) {
	const [value, setValue] = useState<T>(() => {
		// Lazy initializer (a function, not a plain value) — this runs only once on mount,
		// so we don't hit localStorage/JSON.parse on every re-render.
		try {
			const raw = localStorage.getItem(key); // FAVORITES

			return raw ? (JSON.parse(raw) as T) : initialValue;
		} catch {
			// localStorage can throw (private browsing, storage disabled, corrupt JSON) —
			// fall back to initialValue instead of crashing the whole app.
			return initialValue;
		}
	});

	// Effect keeps localStorage in sync with React state after every render where value/key changed.
	// This is one-way (state -> storage); storage isn't re-read after mount, so this tab won't
	// pick up changes made in another tab/window.
	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);

	return [value, setValue] as const;
}
