// ============================================================
// ENTRY POINT — this is where your React app boots up
// ============================================================
// Every React app has a single entry file. Vite is configured
// to load this file first (see index.html → <script src="/src/main.tsx">).

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'   // global styles (including Tailwind) are imported here
import App from './App.tsx'

// createRoot() connects React to the real HTML page.
// It looks for the <div id="root"> in index.html and takes control of it.
// From this point on, React manages everything inside that div.
createRoot(document.getElementById('root')!).render(
  // StrictMode is a development helper — it renders components twice
  // to help catch bugs and warn about deprecated patterns.
  // It has NO effect in production builds.
  <StrictMode>
    <App />
  </StrictMode>,
)
