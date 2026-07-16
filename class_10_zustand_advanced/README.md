# Class 10 — Zustand, Advanced Patterns

Welcome to Class 10! In Class 9 you met Zustand as a single `create()` call holding a couple of fields and actions. That works fine for a small store, but `pantry-pal`'s store just grew a pantry feature on top of the meal plan and shopping list — and cramming everything into one file starts to hurt in the same way a single giant component does. In this class you learn how real apps organize a growing Zustand store: splitting it into **slices**, layering in **middleware** (`immer` and `devtools`) to make updates simpler and debuggable, selecting several fields at once safely with `useShallow`, and — the biggest mindset shift — learning to tell **stored state** apart from **derived state** so you stop keeping values in sync by hand.

---

## Table of Contents

1. [Core Concepts covered in this class](#1-core-concepts-covered-in-this-class)
   - [Recap: a single Zustand store](#recap-a-single-zustand-store)
   - [The slice pattern](#the-slice-pattern)
   - [Combining middleware: devtools + immer](#combining-middleware-devtools--immer)
   - [Mutating state safely with Immer](#mutating-state-safely-with-immer)
   - [Selecting multiple fields with `useShallow`](#selecting-multiple-fields-with-useshallow)
   - [Derived state vs. stored state](#derived-state-vs-stored-state)
   - [Bonus: code-splitting routes with `lazy`](#bonus-code-splitting-routes-with-lazy)
2. [Theory](#2-theory)
3. [Useful Links](#3-useful-links)
4. [Mini Examples](#4-mini-examples)
5. [Practice Exercises](#5-practice-exercises)

---

## 1. Core Concepts covered in this class

### Recap: a single Zustand store

Class 9's `usePantryPalStore` was one `create()` call with all state and actions inline. That's still exactly what you have now — Zustand only ever gives you *one* store per `create()` call. What changes in this class is how that one store's contents are **organized in code**, not how many stores exist.

```ts
// Class 9 shape — everything in one place
export const usePantryPalStore = create<PantryPalState>()(set => ({
	mealPlan: {},
	shoppingList: [],
	assignMeal: (day, recipe) => set(/* ... */),
	// ...every other field and action, in the same file
}));
```

### The slice pattern

Instead of one large state object, each concern (meal plan, pantry, shopping list) gets its own file exporting a **slice**: a type describing just that piece of state, and a "slice creator" function that returns just that piece's initial state and actions. The main store file combines them with a spread.

**Mental model:** think of slices as chapters of a book. Each chapter (file) is self-contained and easy to read on its own, but they all belong to one book (store) at the end.

```ts
// meal-plan.slice.ts
export type MealPlanSlice = {
	mealPlan: MealPlan;
	assignMeal: (day: Weekday, recipe: Recipe | null) => void;
};

export const createMealPlanSlice: SliceCreator<MealPlanSlice> = set => ({
	mealPlan: {},
	assignMeal: (day, recipe) => set(/* ... */),
});
```

```ts
// usePantryPalStore.ts
type PantryPalState = MealPlanSlice & PantryPanelSlice & ShoppingListSlice;

export const usePantryPalStore = create<PantryPalState>()((...args) => ({
	...createMealPlanSlice(...args),
	...createShoppingListSlice(...args),
	...createPantryPanelSlice(...args),
}));
```

> **Note:** `PantryPalState` is the **intersection** (`&`) of every slice's type — every slice's fields end up as siblings on the same flat state object. There's no nesting like `state.mealPlanSlice.mealPlan`; it's just `state.mealPlan`.

### Combining middleware: devtools + immer

Zustand middleware wraps your store creator function to add behavior. `pantry-pal` now stacks two: `devtools` (connects to the Redux DevTools browser extension so you can inspect every state change) and `immer` (lets you write simpler updates — see next section). Middleware wraps outside-in, so `devtools(immer(...))` means devtools is the outermost layer.

```ts
export const usePantryPalStore = create<PantryPalState>()(
	devtools(
		immer((...args) => ({ /* slices */ })),
		{ name: 'PantryPal' },
	),
);
```

**Why this matters for TypeScript:** when you stack middleware, `StateCreator`'s second generic parameter — the "mutator tuple" — needs to list every middleware in the same order, so every slice file knows its `set`/`get` are the *enhanced* (immer-aware) versions, not the plain ones.

```ts
export type SliceCreator<T> = StateCreator<
	PantryPalState,
	[['zustand/devtools', never], ['zustand/immer', never]],
	[],
	T
>;
```

### Mutating state safely with Immer

Plain Zustand requires you to return a *new* object/array whenever something changes (`{ ...state.mealPlan, [day]: recipe }`) — mutating `state` directly wouldn't be detected as a change. The `immer` middleware removes that requirement: inside `set(state => { ... })`, `state` is a mutable "draft," and immer works out the equivalent immutable update for you.

```ts
// pantry-panel.slice.ts — with immer, .push()/.splice() are safe here
togglePantryItem: name =>
	set(state => {
		const index = state.pantry.indexOf(name);
		if (index === -1) {
			state.pantry.push(name);
		} else {
			state.pantry.splice(index, 1);
		}
	});
```

> **Gotcha:** this direct-mutation style only works because `set`'s callback is wrapped by `immer`. Try the same `.push()` call on a store *without* the immer middleware and you'll mutate real state silently — subscribed components won't re-render, and you'll get a confusing bug with no error message.

### Selecting multiple fields with `useShallow`

You already know `usePantryPalStore(state => state.mealPlan)` selects one field. But `PantryPanel` needs six different values from the store at once. Returning an object literal from the selector (`state => ({ mealPlan: state.mealPlan, pantry: state.pantry, ... })`) creates a *new* object on every single render — Zustand would think the selected value "changed" every time and re-render the component in an infinite loop. `useShallow` fixes this by comparing the object's fields one level deep instead of by reference.

```tsx
import { useShallow } from 'zustand/shallow';

const { mealPlan, pantry, togglePantryItem } = usePantryPalStore(
	useShallow(state => ({
		mealPlan: state.mealPlan,
		pantry: state.pantry,
		togglePantryItem: state.togglePantryItem,
	})),
);
```

> **Note:** if a component only needs one value, skip `useShallow` entirely — `usePantryPalStore(state => state.mealPlan)` is already as efficient as it gets.

### Derived state vs. stored state

This is the biggest conceptual jump in this class. In Class 9, `shoppingList` was its own field in the store, and a `rebuildShoppingList()` action had to be called manually to keep it in sync with `mealPlan`. In Class 10, the store only keeps `checkedOffItems` (which items are checked off) — the actual list of what to buy is **computed** from `mealPlan`, `pantry`, and `checkedOffItems` every time it's needed, by a plain function.

**Why this exists:** any value you *store* is a second copy of the truth that can drift out of sync with the data it came from (forget to call `rebuildShoppingList()` after assigning a meal, and the shopping list lies). A value you *derive* can never be wrong, because it's recalculated from the real source of truth every time.

```ts
// store/hlprs/pantry.hlpr.ts — a plain function, not a store action
export function buildShoppingList(
	mealPlan: MealPlan,
	pantry: string[],
	checkedOffItems: Record<string, boolean>,
) {
	// ...compute the list fresh from the three inputs, every call
}
```

```tsx
// MealPlanShoppingList.tsx — recomputed (memoized) whenever an input changes
const shoppingList = useMemo(
	() => buildShoppingList(mealPlan, pantry, checkedOffItems),
	[mealPlan, pantry, checkedOffItems],
);
```

> **Rule of thumb:** if you can calculate a value from other state you already have, don't give it its own `useState`/store field — derive it (with a plain function, optionally wrapped in `useMemo`) instead.

### Bonus: code-splitting routes with `lazy`

`App.tsx` now imports every page with `lazy(() => import('./pages/...'))` instead of a normal `import`, so each page's code downloads only when the user actually navigates to it, splitting the app into smaller chunks.

```tsx
const MealPlanPage = lazy(() => import('./pages/MealPlanPage'));
```

> **Gotcha:** `lazy()` components are supposed to be wrapped in a `<Suspense fallback={...}>` boundary so React has something to show while the chunk loads. `pantry-pal` currently doesn't have one — it "works" in development because the chunk loads almost instantly — but a production app on a slow connection needs a `<Suspense>` around the routes (see Practice Exercises).

---

## 2. Theory

**Why does middleware order matter?** Each middleware wraps the one after it, like layers of an onion: `devtools(immer(creator))` means immer transforms your slice creators first (turning draft-mutations into real updates), and *then* devtools observes the already-computed state changes to log them. If you swapped the order, devtools would be logging the raw, pre-immer calls instead of the final state — which is far less useful for debugging.

**How does Immer actually work?** Immer wraps your real state in a JavaScript `Proxy`. Every time you write `state.pantry.push(x)` inside a `set()` callback, the proxy records that write instead of touching the real array. When the callback finishes, Immer replays the recorded writes to build a brand-new object — reusing (structurally sharing) every part of the old state that *wasn't* touched. That's why it can offer "just mutate it" ergonomics while still giving Zustand the new-reference-per-change it needs to detect updates.

**Derived state is a general principle, not a Zustand-specific trick.** You'll see the exact same idea in plain `useState` components (don't store `fullName` if you have `firstName` and `lastName` — compute it), in SQL (a `VIEW` vs. a materialized table), and in spreadsheets (a formula cell vs. a typed-in value). The question to ask any time you're about to add a new piece of state is: *"can I calculate this from state I already have?"* If yes, derive it — one source of truth is easier to reason about and impossible to desync.

**Why slices instead of one big `create()`?** Splitting a store into per-domain files is purely an organizational choice — Zustand doesn't know or care that `mealPlan` and `pantry` "belong" to different files. The payoff is the same one you get from splitting a large component into smaller ones: each file is short enough to read top-to-bottom, changes to the pantry logic can't accidentally break meal-plan logic sitting in the same file, and multiple people can work on different slices without merge conflicts.

---

## 3. Useful Links

| Topic | Link |
|---|---|
| Zustand — splitting the store into slices | https://zustand.docs.pmnd.rs/guides/slices-pattern |
| Zustand — TypeScript guide (slices, middleware typing) | https://zustand.docs.pmnd.rs/guides/typescript |
| Zustand — `devtools` middleware | https://zustand.docs.pmnd.rs/middlewares/devtools |
| Zustand — `immer` middleware | https://zustand.docs.pmnd.rs/integrations/immer-middleware |
| Zustand — `useShallow` | https://zustand.docs.pmnd.rs/hooks/use-shallow |
| Immer — official docs | https://immerjs.github.io/immer/ |
| React — `lazy` reference | https://react.dev/reference/react/lazy |
| React — `Suspense` reference | https://react.dev/reference/react/Suspense |
| React Router — lazy loading routes | https://reactrouter.com/en/main/route/lazy |

---

## 4. Mini Examples

**1. A minimal two-slice store (auth + cart), combined in one `create()`:**

```ts
import { create, type StateCreator } from 'zustand';

type AuthSlice = { user: string | null; login: (name: string) => void };
type CartSlice = { items: string[]; addItem: (item: string) => void };
type StoreState = AuthSlice & CartSlice;

const createAuthSlice: StateCreator<StoreState, [], [], AuthSlice> = set => ({
	user: null,
	login: name => set({ user: name }),
});

const createCartSlice: StateCreator<StoreState, [], [], CartSlice> = set => ({
	items: [],
	addItem: item => set(state => ({ items: [...state.items, item] })),
});

export const useStore = create<StoreState>()((...args) => ({
	...createAuthSlice(...args),
	...createCartSlice(...args),
}));
```

**2. Immer vs. plain Zustand for the same update:**

```ts
// Without immer — must build a new array by hand
addTodo: text => set(state => ({ todos: [...state.todos, { text, done: false }] }));

// With immer — push directly onto the draft
addTodo: text => set(state => { state.todos.push({ text, done: false }); });
```

**3. `useShallow` preventing an infinite-render bug:**

```tsx
// 🔴 Bug: this object is a new reference every render → component re-renders forever
const { count, step } = useCounterStore(state => ({
	count: state.count,
	step: state.step,
}));

// ✅ Fixed: useShallow compares fields, not object identity
const { count, step } = useCounterStore(
	useShallow(state => ({ count: state.count, step: state.step })),
);
```

**4. Deriving a value instead of storing it (a shopping cart total):**

```ts
type CartState = { items: { price: number }[] };
const useCartStore = create<CartState>()(() => ({ items: [] }));

// Don't store `total` in the state — derive it wherever it's needed.
function useCartTotal() {
	const items = useCartStore(state => state.items);
	return items.reduce((sum, item) => sum + item.price, 0);
}
```

---

## 5. Practice Exercises

1. **Beginner:** Create a `notes.slice.ts` with a `notes: string[]` field and an `addNote(text: string)` action (mutate the draft with `.push()`, immer-style), and combine it into `usePantryPalStore`.
2. **Beginner:** In `PantryPanel.tsx`, temporarily remove the `useShallow` wrapper around the multi-field selector, open React DevTools, and observe/describe what happens. Put `useShallow` back and confirm it's fixed.
3. **Intermediate:** Add a `favoriteCount` value to the UI that's *derived* (not stored) from the existing favorites data, following the same pattern as `buildShoppingList`/`selectShoppingProgress` in `pantry.hlpr.ts`.
4. **Intermediate:** Add a `pantry/clear` action name string (third argument to `set`) to every action in `pantry-panel.slice.ts` that's currently missing one, then verify each shows up correctly in the Redux DevTools extension.
5. **Challenge:** Wrap `<Routes>` in `App.tsx` with a `<Suspense fallback={<div>Loading…</div>}>` boundary, then use your browser's network throttling (DevTools → Network → Slow 3G) to confirm the fallback appears while navigating to a not-yet-loaded page.
