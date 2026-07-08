# Class 07 — React Context

In the last class we built a search-and-pagination flow using controlled inputs and debouncing — all state lived in `RecipeList` and was passed down as props. In this class we hit the limits of that approach: theme (light/dark) and favorites needed to be read and updated from components that aren't parent/child of each other (`Navbar`, `RecipeCard`, `FavoritesPage`, `ThemeShell`). **React Context** solves exactly this problem — it lets you share a value across the component tree without threading it through every intermediate component as props ("prop drilling"). We built two contexts in `pantry-pal`: a `ThemeContext` for light/dark mode, and a `FavoritesContext` (persisted to `localStorage`) for favorited recipes.

---

## Table of Contents

1. [Core Concepts](#1-core-concepts)
   - [createContext and the Provider pattern](#createcontext-and-the-provider-pattern)
   - [useContext and a custom hook wrapper](#usecontext-and-a-custom-hook-wrapper)
   - [Splitting context files from Provider files](#splitting-context-files-from-provider-files)
   - [Persisting context state with useLocalStorage](#persisting-context-state-with-uselocalstorage)
   - [Combining Context with other patterns](#combining-context-with-other-patterns)
2. [Theory — How Context Actually Works](#2-theory--how-context-actually-works)
3. [Useful Links](#3-useful-links)
4. [Mini Examples](#4-mini-examples)
5. [Practice Exercises](#5-practice-exercises)

---

## 1. Core Concepts

### createContext and the Provider pattern

**The problem:** without Context, sharing data between components means passing it as props through every component in between — even ones that don't use the value themselves, just pass it along. This is called **prop drilling**.

**The mental model:** think of Context as a radio broadcast. `createContext` sets up the "channel." A `Provider` component "broadcasts" a value on that channel from somewhere near the top of the tree. Any descendant component can "tune in" and read the current value — no matter how deeply nested it is, and without any component in between knowing the broadcast is even happening.

```tsx
import { createContext, useState, type ReactNode } from 'react';

// 1. Create the context — this is just a "channel," not a component.
const CountContext = createContext<{ count: number; increment: () => void } | null>(null);

// 2. A Provider component owns the actual state and broadcasts it.
function CountProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);

  return (
    <CountContext value={{ count, increment }}>
      {children}
    </CountContext>
  );
}
```

> **Note:** In pantry-pal we use the newer `<Context value={...}>` JSX syntax (React 19). Older code you'll see online uses `<Context.Provider value={...}>` — both do the same thing.

---

### useContext and a custom hook wrapper

Any descendant can read the broadcast value with `useContext(Context)` (or the newer `use(Context)`). But calling that directly everywhere has two downsides: consumers need to import the raw context object, and there's no guard against forgetting to render inside the Provider (you'd silently get the default value, e.g. `null`).

The fix, used throughout `pantry-pal`, is a **custom hook wrapper**:

```tsx
import { use } from 'react';

function useCount() {
  const ctx = use(CountContext);

  // Without a Provider ancestor, ctx is the default value passed to createContext (null here).
  // Throwing early turns a silent bug into a clear, actionable error message.
  if (!ctx) {
    throw new Error('useCount must be used within a CountProvider');
  }

  return ctx;
}
```

Now every consumer just calls `useCount()` — simple, safe, and it hides the context object entirely (see `theme-context.ts` and `favorites-context.ts`).

---

### Splitting context files from Provider files

In `pantry-pal`, each context has **two files**:

| File | Exports |
| --- | --- |
| `context/theme-context.ts` | `ThemeContext`, `useTheme` (the hook) |
| `context/ThemeContext.tsx` | `ThemeProvider` (the component) |

> **Note:** This split exists because of **Vite's Fast Refresh** (Hot Module Replacement for React). Fast Refresh needs a file to export *only* React components to safely hot-reload it. A file that exports both a component (`ThemeProvider`) and non-component values (`ThemeContext`, `useTheme`) will still work, but Vite warns and falls back to a full page reload on every save — which defeats the purpose of HMR. Splitting the raw context + hook into a plain `.ts` file, and keeping only the component in the `.tsx` file, avoids the warning entirely.

---

### Persisting context state with useLocalStorage

`FavoritesProvider` doesn't use plain `useState` — it uses a custom hook, `useLocalStorage`, that mirrors the `useState` API but also syncs to `localStorage`:

```ts
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    // Lazy initializer — runs once on mount, not on every render.
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initialValue;
    } catch {
      return initialValue; // private browsing, corrupt JSON, storage disabled, etc.
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

Because the initial value is computed by a **function** (`() => {...}`) rather than a plain expression, React only runs that read-and-parse logic once — on the very first render — instead of on every re-render.

> **Note:** This sync is one-way (state → storage). If you change `localStorage` in another browser tab, this tab won't automatically pick that up. Cross-tab sync would need a `storage` event listener.

---

### Combining Context with other patterns

Context isn't a replacement for props, state, or component composition — it's another tool that composes with them:

- `App.tsx` nests `<FavoritesProvider>` and `<ThemeProvider>` near the root, so everything below (`Navbar`, `RecipeList`, `RecipeCard`, `FavoritesPage`) can consume either context.
- `RecipeCard` calls `useFavorites()` to read `isFavorite(recipe.id)` and call `toggleFavorite(recipe.id)` from a heart button — with **zero** favorites-related props passed from its parent (`RecipeList`).
- `FavoritesPage` independently calls `useFavorites()` to read the current `favoritesIds` and filter the full recipe list — a completely separate branch of the tree, with no data relationship to `RecipeCard` other than the shared context.
- `Navbar` still receives `pageInView`/`onPageSelect` as **plain props** (lifted state, not Context) because that state is only shared between `App` and `Navbar` — a direct parent/child relationship. Context is for values needed *broadly*, not a wholesale replacement for props.

---

## 2. Theory — How Context Actually Works

**Re-renders on value change.** When a Provider's `value` prop changes (by reference), **every** descendant component that calls `useContext`/`use` on that context re-renders — even if it only reads one field of the value object that didn't change. This is because Context compares the whole value object, not individual fields.

**The "new object every render" gotcha.** Both `ThemeProvider` and `FavoritesProvider` build their `value` as a fresh object literal on every render:

```tsx
return <ThemeContext value={{ theme, toggleTheme }}>{children}</ThemeContext>;
```

This object is a *new reference* every time `ThemeProvider` re-renders, so any consumer re-renders too — even if `theme` itself didn't change. At small scale (a handful of consumers) this is harmless. At larger scale, you'd wrap the value in `useMemo`:

```tsx
const value = useMemo(() => ({ theme, toggleTheme }), [theme]);
```

**When NOT to reach for Context.** Context is great for low-frequency, broadly-needed values: theme, current user/auth, locale, favorites, feature flags. It is a poor fit for **high-frequency updates** (e.g. mouse position, a live-typing text field, websocket ticks) shared across many components — every keystroke would re-render the entire subtree under the Provider. For that class of problem, dedicated state libraries (Zustand, Redux, Jotai) use subscription models that let components re-render only when the *specific slice* they read changes, not the whole context value.

> **Note:** Context also isn't a performance optimization tool by itself — it's an escape hatch from prop drilling. If a component only needs a value because its child needs it, passing it as a prop is still simpler and easier to trace than Context, *until* you have components at very different depths/branches that all need the same value.

---

## 3. Useful Links

| Resource | Link |
| --- | --- |
| React docs — `createContext` | https://react.dev/reference/react/createContext |
| React docs — `useContext` | https://react.dev/reference/react/useContext |
| React docs — Passing Data Deeply with Context | https://react.dev/learn/passing-data-deeply-with-context |
| React docs — Scaling Up with Reducer and Context | https://react.dev/learn/scaling-up-with-reducer-and-context |
| MDN — `localStorage` | https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage |
| MDN — `JSON.parse` / `JSON.stringify` | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON |
| Vite docs — Fast Refresh caveats | https://vite.dev/guide/features.html#hot-module-replacement |

---

## 4. Mini Examples

These use different domains than the in-class code (recipes/theme/favorites) so you can see the same *pattern* applied elsewhere.

**A. Simple counter context**

```tsx
import { createContext, use, useState, type ReactNode } from 'react';

const CounterContext = createContext<{ count: number; inc: () => void } | null>(null);

export function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0);
  return (
    <CounterContext value={{ count, inc: () => setCount(c => c + 1) }}>
      {children}
    </CounterContext>
  );
}

export function useCounter() {
  const ctx = use(CounterContext);
  if (!ctx) throw new Error('useCounter must be used within CounterProvider');
  return ctx;
}
```

**B. Auth context (fake login)**

```tsx
import { createContext, use, useState, type ReactNode } from 'react';

type User = { name: string } | null;
const AuthContext = createContext<{ user: User; login: (n: string) => void; logout: () => void } | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  return (
    <AuthContext value={{ user, login: name => setUser({ name }), logout: () => setUser(null) }}>
      {children}
    </AuthContext>
  );
}

export function useAuth() {
  const ctx = use(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

**C. Language/locale context**

```tsx
import { createContext, use, useState, type ReactNode } from 'react';

const LocaleContext = createContext<{ locale: string; setLocale: (l: string) => void } | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState('en');
  return (
    <LocaleContext value={{ locale, setLocale }}>{children}</LocaleContext>
  );
}

export function useLocale() {
  const ctx = use(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
```

**D. Shopping cart count (consumed two levels deep)**

```tsx
function CartBadge() {
  const { count } = useCart(); // reads from context, no props needed
  return <span>{count} items</span>;
}

function Header() {
  return <div><Logo /><CartBadge /></div>; // Header never touches "count" itself
}
```

---

## 5. Practice Exercises

**Beginner:**

1. Add a third theme option, `'system'`, to `ThemeContext`. When active, `ThemeShell` should fall back to rendering with light styles (no need to detect the OS preference yet).
2. In `Navbar.tsx`, display the current theme as text (e.g. "Light mode" / "Dark mode") next to the toggle button, reading it from `useTheme()`.

**Intermediate:**

3. Create a new `useLocalStorage`-backed `NotesContext` (a `notes-context.ts` + `NotesContext.tsx` pair, following the pantry-pal file-splitting convention) that stores an array of strings and exposes `addNote(text: string)` and `removeNote(index: number)`. Wire it into `App.tsx` and build a simple `NotesPage` component that lists and removes notes.
4. Refactor `FavoritesProvider`'s `value` object to be wrapped in `useMemo`. Explain (in a comment) what re-renders this prevents and why it's safe here.

**Challenge:**

5. Write a guard test (manually, by removing a Provider temporarily) that shows `useTheme()`/`useFavorites()` throwing the "must be used within a Provider" error when called outside their Provider. Then explain in your own words why the `!ctx` check in `favorites-context.ts` can never trigger given the current `createContext` default value — and fix it so it *can* (hint: what should the default value be instead of a real fallback object?).

---

> **Nice work!** Context is one of those tools that feels unnecessary until the moment two unrelated branches of your app need the same piece of state — then it clicks immediately. Keep practicing splitting context/provider files and wrapping `useContext` in custom hooks; it's the pattern you'll see in almost every production React codebase. See you in Class 08! 💪
