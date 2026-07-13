# Class 8 — Routing

Welcome to Class 8! Up to now, your React apps have been single-page in the truest sense — one URL, one screen. In this class you learn how to give your app multiple "pages" (Home, Recipe Details, Edit, Favorites) that live at different URLs, without ever asking the server for a new HTML document. You'll build this using **React Router**, the standard client-side routing library for React, inside the `pantry-pal` project.

---

## Table of Contents

1. [Core Concepts](#1-core-concepts)
   - [Client-side routing & BrowserRouter](#client-side-routing--browserrouter)
   - [Routes & Route](#routes--route)
   - [Link and NavLink vs `<a>`](#link-and-navlink-vs-a)
   - [Nested Routes & Outlet](#nested-routes--outlet)
   - [Dynamic Route Segments & useParams](#dynamic-route-segments--useparams)
   - [useNavigate](#usenavigate)
   - [Index Routes](#index-routes)
2. [Theory](#2-theory)
3. [Useful Links](#3-useful-links)
4. [Mini Examples](#4-mini-examples)
5. [Practice Exercises](#5-practice-exercises)

---

## 1. Core Concepts

### Client-side routing & BrowserRouter

**Client-side routing** means your JavaScript code — not the server — decides which UI to show for a given URL. React Router does this by listening to the browser's URL and swapping React components in and out, instead of the browser requesting a brand-new HTML page.

**Mental model:** think of `<BrowserRouter>` as a context provider that "connects" your component tree to the current URL. Every routing feature (`Routes`, `Link`, `useParams`, `useNavigate`, ...) only works because it's rendered somewhere inside a `BrowserRouter`.

```tsx
import { BrowserRouter } from 'react-router-dom';

function Main() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
```

> **Note:** Forgetting to wrap your app in `<BrowserRouter>` is one of the most common beginner mistakes — you'll get a runtime error like `useNavigate() may be used only in the context of a <Router> component`.

---

### Routes & Route

`<Routes>` looks at the current URL and renders the single best-matching `<Route>` inside it. Each `<Route>` maps a `path` to an `element` (a component to render).

```tsx
import { Routes, Route } from 'react-router-dom';

<Routes>
  <Route path='/' element={<HomePage />} />
  <Route path='/about' element={<AboutPage />} />
</Routes>
```

**Why it exists:** without a router, you'd have to write your own `if (window.location.pathname === '/about') return <AboutPage />` logic everywhere. `Routes`/`Route` gives you a declarative, centralized way to describe "this URL shows this component."

> **Note:** In React Router v6+, `Routes` automatically picks the most specific matching route — you don't need to carefully order routes from most-specific to least-specific like you did with `<Switch>` in v5.

---

### Link and NavLink vs `<a>`

`<Link>` renders an `<a>` tag under the hood, but intercepts the click so React Router can update the URL and swap components **without a full page reload**. `<NavLink>` is the same thing, plus it knows whether its own `to` path is currently active, so you can style the active link.

```tsx
import { Link, NavLink } from 'react-router-dom';

<Link to='/favorites'>Favorites</Link>

<NavLink
  to='/'
  end
  className={({ isActive }) => (isActive ? 'font-bold' : '')}
>
  Home
</NavLink>
```

> **Gotcha:** If you use a plain `<a href="/favorites">` instead of `<Link>`, the browser performs a **full page reload** — your entire React app remounts, all component state (like open modals, form input, theme, in-memory data) is lost, and it's slower. Always use `<Link>`/`<NavLink>` for internal navigation.

> **Note:** `end` on `NavLink` forces exact path matching. Without it, a link to `"/"` is considered "active" on every route, because every path technically starts with `/`.

---

### Nested Routes & Outlet

A **layout route** is a `<Route>` with no `path`, just an `element` — its children render inside it wherever you place `<Outlet />`. This lets you share a persistent layout (navbar, sidebar, theme wrapper) across multiple pages.

```tsx
import { Outlet } from 'react-router-dom';

function AppLayout() {
  return (
    <div>
      <Navbar />
      <Outlet /> {/* the matched child route renders here */}
    </div>
  );
}

<Routes>
  <Route element={<AppLayout />}>
    <Route index element={<HomePage />} />
    <Route path='settings' element={<SettingsPage />} />
  </Route>
</Routes>
```

**Mental model:** `Outlet` is like the `children` prop, but driven by the router instead of by JSX nesting — "render whichever child route matched, right here."

---

### Dynamic Route Segments & useParams

A path segment prefixed with `:` (e.g. `:id`) is a **dynamic route segment** (a.k.a. a route param). It matches any value in that position of the URL, and you read it inside the matched component with `useParams()`.

```tsx
import { useParams } from 'react-router-dom';

// Route: <Route path='recipe/:id' element={<RecipeDetailsPage />} />
// URL:   /recipe/42

function RecipeDetailsPage() {
  const { id } = useParams(); // id === "42"
  return <p>Recipe #{id}</p>;
}
```

> **Note:** `id` is always a `string | undefined` — even if your data's real ID is numeric, `useParams()` gives you a string. Convert it if you need a number, and always guard against `undefined` (it can happen briefly, or if someone hand-edits the URL).

> **Gotcha:** If you navigate from `/recipe/1` to `/recipe/2` while already on the details page, React Router **reuses the same component instance** — it does not unmount/remount. Any `useEffect` that fetches data by `id` must list `id` in its dependency array, or it won't refetch for the new id.

---

### useNavigate

`useNavigate()` returns a function you call to change routes **imperatively** — inside event handlers, after async logic, or based on conditions — as opposed to `<Link>`, which is declarative JSX you render.

```tsx
import { useNavigate } from 'react-router-dom';

function DeleteButton({ id }: { id: string }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    await deleteItem(id);
    navigate('/'); // go back home after the action completes
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

> **Gotcha:** If a clickable card/row also contains buttons that call `navigate(...)` to somewhere else (e.g. an "Edit" button inside a card that navigates to a detail page when the card itself is clicked), the button's click event will **bubble up** and trigger the card's own `onClick` too, unless you call `e.stopPropagation()` inside the button's handler.

---

### Index Routes

An `index` route is the **default child** rendered at the parent layout's exact path, when no other child path matches.

```tsx
<Route element={<AppLayout />}>
  <Route index element={<HomePage />} />       {/* matches "/" */}
  <Route path='favorites' element={<FavoritesPage />} /> {/* matches "/favorites" */}
</Route>
```

It's the v6 replacement for `<Route exact path="/">` from React Router v5.

---

## 2. Theory

### Client-side routing vs server-side routing

In traditional **server-side routing**, every link click sends an HTTP request to the server, which responds with a full new HTML document; the browser throws away the old page and renders the new one from scratch. This is simple but slow — CSS, JS, and layout all have to be reprocessed on every navigation.

**Client-side routing** (what React Router does) keeps a single HTML page loaded for the entire session (a Single Page Application, or SPA). "Navigating" means:

1. JavaScript intercepts the click instead of letting the browser follow the link.
2. It updates the URL shown in the address bar using the **browser History API** (`history.pushState`), without triggering a network request.
3. It figures out which component(s) should render for the new URL and re-renders just that part of the DOM.

This makes navigation feel instant and lets state (theme, in-memory data, scroll position, open modals) persist naturally across "page" changes — because it's really all one continuously-running JavaScript app.

### The History API and how the URL updates without a reload

The browser exposes `window.history.pushState(state, title, url)` and `window.history.replaceState(...)`, which let JavaScript change the URL bar and add an entry to the browser's back/forward history **without** the browser navigating anywhere. React Router calls these under the hood whenever you use `<Link>`, `<NavLink>`, or `navigate(...)`.

The browser also fires a `popstate` event when the user clicks the Back/Forward buttons. React Router listens for that event and re-renders the matching route — this is why Back/Forward "just work" in an SPA.

```text
User clicks <Link to="/favorites">
  → React Router calls history.pushState(..., "/favorites")
  → URL bar updates, no network request fires
  → React Router re-evaluates <Routes>, finds the new match
  → Only the changed part of the component tree re-renders
```

> **Note:** Because there's no server round-trip involved, a hard refresh (F5) on a deep URL like `/recipe/42` requires your **server or static host** to be configured to always serve `index.html` for unknown paths — otherwise you'll get a 404, since there's no real file at that path.

---

## 3. Useful Links

| Resource | Link |
| --- | --- |
| React Router — official docs | https://reactrouter.com/en/main |
| React Router — `Routes` & `Route` | https://reactrouter.com/en/main/components/routes |
| React Router — `Link` | https://reactrouter.com/en/main/components/link |
| React Router — `NavLink` | https://reactrouter.com/en/main/components/nav-link |
| React Router — `useParams` | https://reactrouter.com/en/main/hooks/use-params |
| React Router — `useNavigate` | https://reactrouter.com/en/main/hooks/use-navigate |
| React Router — `Outlet` | https://reactrouter.com/en/main/components/outlet |
| MDN — History API | https://developer.mozilla.org/en-US/docs/Web/API/History_API |
| MDN — Single-page application (SPA) | https://developer.mozilla.org/en-US/docs/Glossary/SPA |

---

## 4. Mini Examples

These use different domains than the in-class code (recipes) so you can see the same *pattern* applied elsewhere.

**A. A minimal router setup from scratch**

```tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function Home() {
  return <h1>Home</h1>;
}
function About() {
  return <h1>About</h1>;
}

export default function MiniApp() {
  return (
    <BrowserRouter>
      <nav>
        <Link to='/'>Home</Link> | <Link to='/about'>About</Link>
      </nav>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**B. A dynamic route for a user profile page**

```tsx
import { Routes, Route, useParams } from 'react-router-dom';

function UserProfile() {
  const { username } = useParams();
  return <h2>Profile page for @{username}</h2>;
}

function ProfileRoutes() {
  return (
    <Routes>
      <Route path='/users/:username' element={<UserProfile />} />
    </Routes>
  );
}
// Visiting /users/octocat renders "Profile page for @octocat"
```

**C. Redirecting after a successful form submission with useNavigate**

```tsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fakeLogin();
    navigate('/dashboard'); // imperative redirect after async work
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type='submit'>Log in</button>
    </form>
  );
}
```

**D. A layout with a nested "not found" catch-all route**

```tsx
import { Routes, Route, Outlet } from 'react-router-dom';

function SiteLayout() {
  return (
    <div>
      <header>My Site</header>
      <Outlet />
    </div>
  );
}

function NotFound() {
  return <p>404 — page not found</p>;
}

<Routes>
  <Route element={<SiteLayout />}>
    <Route index element={<p>Welcome!</p>} />
    <Route path='*' element={<NotFound />} /> {/* catches any unmatched path */}
  </Route>
</Routes>;
```

---

## 5. Practice Exercises

**Beginner:**

1. In `pantry-pal`, add a new static route `/about` that renders a simple `AboutPage` component with a short paragraph. Add a link to it in `NavBar`.
2. Change one `<Link>` in the app to a plain `<a href="...">` temporarily, click it, and observe (by watching the theme toggle reset) that a full page reload happens. Then change it back.

**Intermediate:**

3. Add a `*` catch-all route to `App.tsx` that renders a friendly "Page not found" component when the URL doesn't match anything, and add a `<Link to="/">` back to Home on that page.
4. Create a new dynamic route `/recipe/:id/print` that reuses `useRecipe(id)` and renders a simplified, print-friendly view of the recipe (just title and ingredients).

**Challenge:**

5. Add a "Recently viewed" feature: every time `RecipeDetailsPage` loads a recipe (via `useParams` + `useRecipe`), store its `id` in `localStorage` (reuse `useLocalStorage`). Then add a `/recent` route that reads those ids, fetches each recipe, and renders them as cards — practicing route params, `useNavigate`, and data fetching together.

---

> **Nice work!** Routing is the feature that turns a single component tree into something that feels like a real, multi-page app. Keep an eye on the gotchas — `<a>` vs `<Link>`, missing dependency arrays on param-driven effects, and event bubbling on nested clickable elements — they're the bugs you'll hit most often in real projects.
