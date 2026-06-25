import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// createRoot targets the <div id="root"> in index.html — React takes over that element.
// The ! at the end tells TypeScript "this element definitely exists" so it stops complaining about null.
createRoot(document.getElementById('root')!).render(
	// StrictMode is intentionally commented out here to make useEffect behaviour easier to study.
	// In development, StrictMode deliberately mounts every component TWICE to help catch bugs.
	// That means useEffect runs twice — which can be confusing when you're first learning it.
	// Re-enable it in production apps: it catches real bugs and has no effect in the production build.
	// <StrictMode>
	<App />,
	// </StrictMode>,
);
