import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
	// StrictMode is intentionally commented out here.
	// In development, StrictMode renders every component twice to surface side-effects in your code.
	// That double-render can interfere with debugging — re-enable it once you're confident there are no issues.
	// In production builds, StrictMode has zero impact — it is dev-only.
	// <StrictMode>
	<App />,
	// </StrictMode>,
);
