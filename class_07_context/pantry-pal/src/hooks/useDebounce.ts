import { useEffect, useState } from 'react';

// Not Context, but this hook (from an earlier class) is composed with Context in this app —
// e.g. search terms live in local state and are only "committed" after `delayMs` of no typing,
// which avoids refetching/re-rendering on every keystroke.
export function useDebounce<T>(value: T, delayMs = 600) {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const id = setTimeout(() => {
			setDebounced(value);
		}, delayMs);
		// Cleanup cancels the pending timeout if `value` changes again before it fires —
		// without this, every keystroke would schedule a timer that still updates state later.
		return () => clearTimeout(id);
	}, [value, delayMs]);

	return debounced;
}
