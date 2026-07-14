# Class 9 — State Management

Welcome to Class 9! So far your components have owned their state locally with `useState`, and you've shared a bit of it with `useContext`. In this class you push further: you learn *why* prop drilling and giant context objects start to hurt as an app grows, and you bring in **Zustand**, a small external state-management library, to hold state that lives outside any single component and outside React's tree entirely. You'll see both approaches side by side in the `pantry-pal` project — favorites and theme use Context, the weekly meal plan and shopping list use Zustand.

---

## Table of Contents

1. [Core Concepts covered in this class](#1-core-concepts-covered-in-this-class)
   - [Recap: Context API](#recap-context-api)
   - [The Provider + custom hook pattern](#the-provider--custom-hook-pattern)
   - [Why Context isn't always enough](#why-context-isnt-always-enough)
   - [Zustand: state outside the component tree](#zustand-state-outside-the-component-tree)
   - [Selectors — subscribing to a slice of state](#selectors--subscribing-to-a-slice-of-state)
   - [Actions colocated with state](#actions-colocated-with-state)
   - [Persisting state with `persist` middleware](#persisting-state-with-persist-middleware)
2. [Theory](#2-theory)
3. [Useful Links](#3-useful-links)
4. [Mini Examples](#4-mini-examples)
5. [Practice Exercises](#5-practice-exercises)

---

## 1. Core Concepts covered in this class

### Recap: Context API

Context lets any descendant component read a value without it being passed down as props at every level. You already used this for `ThemeContext` and `FavoritesContext` in `pantry-pal`.

**Mental model:** Context is a "broadcast channel." A `Provider` sends a value down; any component below it can tune in with `useContext` (or the new `use()` API), no matter how deeply nested it is.

```tsx
const ThemeContext = createContext<{ theme: string } | null>(null);

function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState('light');
	return <ThemeContext value={{ theme, setTheme }}>{children}</ThemeContext>;
}
```

### The Provider + custom hook pattern

Every context in this project follows the same shape: a `Provider` component that owns the `useState`, and a custom hook (`useTheme`, `useFavorites`) that wraps `use(Context)` and throws if there's no `Provider` above it.

**Why this exists:** it hides the raw context object from the rest of the app (nobody calls `use(ThemeContext)` directly), and it turns "I forgot to wrap my app in a Provider" from a silent `undefined` bug into a clear thrown error.

```tsx
export function useTheme() {
	const ctx = use(ThemeContext);
	if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
	return ctx;
}
```

> **Note:** In this project, the context object + hook live in one file (e.g. `theme-context.ts`) and the `Provider` component lives in another (`ThemeContext.tsx`). This split exists purely so Vite's Fast Refresh works correctly — a file that exports both a component and non-component values (like a context object) breaks hot reloading.

### Why Context isn't always enough

Context works well for values that change rarely (theme, auth user, locale) or where re-renders are cheap. It starts to hurt when:

- **Every consumer re-renders on every value change** — there's no built-in way to subscribe to just *part* of the context value.
- **You need the state outside React** — e.g. in a plain function, a non-component module, or before any component has mounted.
- **The Provider itself needs to wrap the whole app**, adding nesting for every new piece of shared state (`FavoritesProvider` → `ThemeProvider` → `BrowserRouter` → ...).

This is the gap Zustand fills.

### Zustand: state outside the component tree

Zustand creates a **store** — a single object holding state and the functions that update it — that lives completely outside React. There's no `<Provider>` to wrap your app in; any component (or non-component code) can import the store's hook directly.

**Mental model:** think of a Zustand store as a tiny global variable that React knows how to watch. Calling the hook subscribes a component to it; calling an action updates it; every subscribed component re-renders.

```ts
import { create } from 'zustand';

type CounterState = {
	count: number;
	increment: () => void;
};

export const useCounterStore = create<CounterState>()(set => ({
	count: 0,
	increment: () => set(state => ({ count: state.count + 1 })),
}));
```

```tsx
function Counter() {
	const count = useCounterStore(state => state.count);
	const increment = useCounterStore(state => state.increment);
	return <button onClick={increment}>{count}</button>;
}
```

### Selectors — subscribing to a slice of state

Instead of `const store = useCounterStore()` (which subscribes to *everything*), you pass a **selector function**: `useCounterStore(state => state.count)`. Zustand then only re-renders your component when the *returned value* changes — not when unrelated fields in the store change.

**Why this matters:** in `pantry-pal`, `MealPlanPanel` selects `state.mealPlan` and `MealPlanShoppingList` selects `state.shoppingList` from the *same* store. Toggling a shopping list item doesn't re-render `MealPlanPanel`, because it never subscribed to `shoppingList`.

```ts
// Selects one field — re-renders only when mealPlan changes
const mealPlan = usePantryPalStore(state => state.mealPlan);

// Selects a different field from the SAME store — independent re-renders
const shoppingList = usePantryPalStore(state => state.shoppingList);
```

> **Note:** A common beginner mistake is destructuring the whole store (`const { mealPlan, shoppingList } = usePantryPalStore()`). That subscribes to *all* fields, so the component re-renders on every store change, defeating the point of selectors.

### Actions colocated with state

In Zustand, the functions that update state (`assignMeal`, `toggleShoppingListItem`, `rebuildShoppingList`) are defined right inside the store, next to the state they touch — instead of being written as separate `setX` calls scattered across components.

**Why this exists:** it keeps "what can happen to this state" in one place you can read top-to-bottom, and components just call the action by name (`assignMeal(day, recipe)`) without knowing how the update is implemented.

```ts
set(state => {
	const mealPlan = { ...state.mealPlan }; // copy — never mutate state directly
	mealPlan[day] = recipe;
	return { mealPlan }; // only the changed field needs to be returned
});
```

### Persisting state with `persist` middleware

Zustand's `persist` middleware wraps a store so its state is automatically saved to (and loaded back from) `localStorage`, keyed by the `name` you give it — the same idea as the `useLocalStorage` hook used for favorites, but built directly into the store.

```ts
export const usePantryPalStore = create<PantryPalState>()(
	persist(
		set => ({ mealPlan: {}, /* ...actions... */ }),
		{ name: 'pantry-pal-store' }, // localStorage key
	),
);
```

> **Note:** Check your browser's DevTools → Application → Local Storage while using the meal planner — you'll see the live JSON under the `pantry-pal-store` key update as you assign meals.

---

## 2. Theory

**Context re-renders vs. Zustand re-renders.** When a Context value changes, **every** component calling `useContext`/`use()` on that context re-renders, regardless of which part of the value it actually reads — because Context has no concept of "selecting a slice." Zustand's `create` store solves this by having each `useStore(selector)` call subscribe independently: React only re-renders a component if the selector's *return value* is different from last time (compared with `Object.is` by default).

**Where does the state actually live?** With `useState`, state lives inside a component's fiber (React's internal representation of that component instance) — it's destroyed when the component unmounts. With Context, state still lives inside whichever component renders the `Provider` (usually near the app root) — it just becomes *readable* deeper in the tree. With Zustand, the state lives in a plain JavaScript object created once, completely outside of any component's lifecycle. That's why you can call store actions from anywhere — an event handler, a `useEffect`, even a non-React `.ts` file — without needing to be "inside" a Provider.

**Choosing between them.** A rough rule of thumb used in the industry: reach for Context for state that's mostly static and read broadly (theme, current user, locale, i18n strings). Reach for a store library like Zustand (or Redux, Jotai, etc.) once you have state that changes frequently, is read by many unrelated components, or needs to be updated from outside the component tree. Neither is "better" — they solve different problems, and real apps often use both, exactly like `pantry-pal` does.

---

## 3. Useful Links

| Topic | Link |
|---|---|
| Context API (`createContext`) | https://react.dev/reference/react/createContext |
| `use()` API | https://react.dev/reference/react/use |
| Passing Data Deeply with Context (guide) | https://react.dev/learn/passing-data-deeply-with-context |
| Zustand — official docs | https://zustand.docs.pmnd.rs/getting-started/introduction |
| Zustand — selecting state / re-render optimization | https://zustand.docs.pmnd.rs/guides/updating-state |
| Zustand — `persist` middleware | https://zustand.docs.pmnd.rs/middlewares/persist |
| `useState` reference | https://react.dev/reference/react/useState |
| `localStorage` (MDN) | https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage |

---

## 4. Mini Examples

**1. A minimal Zustand store (no persistence):**

```ts
import { create } from 'zustand';

type CartState = {
	items: string[];
	addItem: (item: string) => void;
	clear: () => void;
};

export const useCartStore = create<CartState>()(set => ({
	items: [],
	addItem: item => set(state => ({ items: [...state.items, item] })),
	clear: () => set({ items: [] }),
}));
```

**2. Selecting multiple values without over-subscribing:**

```tsx
function CartBadge() {
	// Selecting .length (a number) instead of the whole array means this component
	// only re-renders when the COUNT changes, not on every unrelated store update.
	const itemCount = useCartStore(state => state.items.length);
	return <span>{itemCount} items</span>;
}
```

**3. A tiny Context for a language/locale setting:**

```tsx
type Locale = 'en' | 'mk';
const LocaleContext = createContext<Locale>('en');

function useLocale() {
	return use(LocaleContext);
}

function App() {
	return (
		<LocaleContext value='mk'>
			<Greeting />
		</LocaleContext>
	);
}
```

**4. Reading a Zustand store outside of React (e.g. in a plain utility function):**

```ts
// getState() reads the current store value without subscribing — useful in code
// that isn't a React component and can't call hooks.
function logCartSize() {
	console.log(useCartStore.getState().items.length);
}
```

---

## 5. Practice Exercises

1. **Beginner:** Add a `removeItem(id: string)` action to a Zustand store like `useCartStore` above, following the same "copy, don't mutate" pattern used in `assignMeal`.
2. **Beginner:** Convert `FavoritesContext` into a plain `useState`-based Context (drop `useLocalStorage`) and observe what happens to favorites after a page refresh — explain why in a comment.
3. **Intermediate:** In `pantry-pal`, add a `clearMealPlan()` action to `usePantryPalStore` that resets `mealPlan` to `{}` and wire a "Clear week" button to it in `MealPlanPanel`.
4. **Intermediate:** Add a `recipeCount` selector-based display in `MealPlanShoppingList` that shows how many distinct recipes are currently assigned in `mealPlan`, without subscribing to the whole store.
5. **Challenge:** Add `persist` middleware to a brand-new Zustand store of your own (e.g. a "recently viewed recipes" list capped at 5 items), and verify in DevTools that it survives a page refresh.
