# Class 6 — Search, Debouncing & API Filtering

Welcome back! In this class you take the recipe app from a simple list into a fully searchable, filterable, sortable, and paginated data table backed by a real API. You'll build a controlled search box that doesn't hammer the server on every keystroke (debouncing), wire up tag filters and a max-prep-time filter, add sortable columns, and implement page-based pagination — all driven by a single `useEffect` that re-fetches whenever any of those inputs change. Along the way you'll see why `useEffect`'s dependency array is the real engine behind "the UI automatically stays in sync with the filters."

---

## Table of Contents

1. [Core Concepts covered in this class](#core-concepts-covered-in-this-class)
   - [Debouncing user input](#1-debouncing-user-input)
   - [Controlled search inputs](#2-controlled-search-inputs)
   - [useEffect dependency arrays as "what triggers a refetch"](#3-useeffect-dependency-arrays-as-what-triggers-a-refetch)
   - [Resetting pagination when filters change](#4-resetting-pagination-when-filters-change)
   - [Building query strings for a GET request](#5-building-query-strings-for-a-get-request)
   - [Multi-select filters (tags) with array state](#6-multi-select-filters-tags-with-array-state)
   - [Sorting as derived query state](#7-sorting-as-derived-query-state)
2. [Theory](#theory)
3. [Useful Links](#useful-links)
4. [Mini Examples](#mini-examples)
5. [Practice Exercises](#practice-exercises)

---

## Core Concepts covered in this class

### 1. Debouncing user input

Debouncing delays acting on a fast-changing value until it *stops* changing for a set amount of time. When a user types "pasta" into a search box, without debouncing you'd fire five API requests (one per keystroke) and only the last one's result actually matters — the rest were wasted network calls that can even race each other and show stale results.

The mental model: instead of reacting to every keystroke, you start a timer on each change and only "commit" the value once the timer completes uninterrupted. If the value changes again before the timer fires, you cancel the old timer and start a new one.

```tsx
import { useEffect, useState } from 'react';

function useDebounce<T>(value: T, delayMs = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id); // cancel if `value` changes again before delayMs elapses
  }, [value, delayMs]);

  return debounced;
}
```

> **Note:** The cleanup function (`return () => clearTimeout(id)`) is what makes this work. Without it, every keystroke would schedule a new timeout that *also* fires, and you'd be back to firing a request per keystroke — just delayed.

### 2. Controlled search inputs

The search box's `value` is driven entirely by React state (`searchTerm`), and every keystroke updates that state via `onChange`. This is a **controlled component** — React state is the single source of truth, never the DOM.

Why it matters here specifically: you need the raw, undebounced `searchTerm` to keep the input responsive as the user types (no lag rendering each character), while a *separate*, debounced copy of that value (`debouncedSearchTerm`) is what actually gets sent to the API. Splitting "what the input shows" from "what triggers a fetch" is the key insight of this pattern.

```tsx
function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### 3. useEffect dependency arrays as "what triggers a refetch"

The data-fetching `useEffect` in `RecipeList` lists every filter/sort/pagination value in its dependency array: `[debouncedSearchTerm, selectedTags, maxPrepMin, sortBy, sortOrder, page, limit]`. React re-runs the effect whenever *any* of these change between renders — that's the entire mechanism that keeps the recipe list in sync with the filters.

The mental model: the dependency array isn't a performance optimization you tack on at the end — it's the actual list of "things this effect cares about." If you filter by tags but forget `selectedTags` in the array, toggling a tag would update the UI checkboxes but never actually refetch — a very common and confusing bug.

```tsx
useEffect(() => {
  fetchResults({ search, sortBy });
}, [search, sortBy]); // <- if you filter by more things, add them here too
```

> **Note:** ESLint's `react-hooks/exhaustive-deps` rule exists specifically to catch missing dependencies like this. Don't silence it without a very good reason.

### 4. Resetting pagination when filters change

There's a second, smaller `useEffect` in `RecipeList` whose only job is: whenever a filter or sort value changes, reset `page` back to `1`. Without this, changing your search term while sitting on page 5 would try to fetch "page 5 of the new, smaller filtered result set" — which might not even exist.

Why a separate effect instead of cramming it into the main fetch effect: it keeps the fetch effect focused on "how to fetch" and this one focused on "what state should reset," and it avoids a subtle bug where you'd need to fetch page 1 *and* the old page in the same tick.

```tsx
useEffect(() => {
  if (page !== 1) setPage(1);
}, [search, tags, sortBy]); // any filter change forces back to page 1
```

### 5. Building query strings for a GET request

`URLSearchParams` builds a correctly-encoded query string from your filter object, only including keys that actually have a value. This lives in `lib/api.ts` as `buildSearchQueryParams`, separate from the component that calls it.

The mental model: a GET request can't have a JSON body, so every parameter — search term, tags, sort field, page number — has to be serialized into the URL itself. `URLSearchParams` handles the encoding (spaces, special characters) so you never have to think about it manually.

```ts
function buildQuery(params: Record<string, string | number | undefined>) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') query.set(key, String(value));
  }
  const str = query.toString();
  return str ? `?${str}` : '';
}
```

### 6. Multi-select filters (tags) with array state

Selected tags live in an array of strings (`selectedTags`). Toggling a tag either adds it to the array (if not present) or filters it out (if present) — a pattern you'll reuse anywhere you need "any number of these can be selected at once."

```tsx
function toggleTag(tag: string, selected: string[], setSelected: (t: string[]) => void) {
  setSelected(
    selected.includes(tag) ? selected.filter(t => t !== tag) : [...selected, tag]
  );
}
```

> **Note:** Always create a *new* array (`.filter`, `[...spread]`) rather than mutating the existing one with `.push()` or `.splice()`. React compares state by reference — mutating in place means React can't tell anything changed, and your UI won't re-render.

### 7. Sorting as derived query state

Sort field (`sortBy`) and direction (`sortOrder`) are just more pieces of state that flow into the same `params` object as search and tags. There's nothing special about "sorting" architecturally — it's another filter that happens to change the order rather than the contents of the result set, and it belongs in the same dependency array as everything else.

```tsx
const [sortBy, setSortBy] = useState<'title' | 'createdAt'>('createdAt');
const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
// both flow into fetchRecipes({ ...otherParams, sortBy, sortOrder })
```

---

## Theory

**Why debounce and not throttle?** Both limit how often something runs, but they solve different problems. **Debouncing** waits for a pause in activity before acting (ideal for search-as-you-type, where you only care about the *final* value). **Throttling** guarantees a function runs at most once per interval regardless of how often it's called (ideal for scroll or resize handlers, where you want steady, periodic updates *while* the activity continues). Search boxes almost always want debounce, not throttle.

**Race conditions in data fetching.** Imagine you type "p", then quickly "pa". Two requests fire (without debouncing): one for "p", one for "pa". If the network is slow and the "p" response arrives *after* the "pa" response, you'd overwrite the correct "pa" results with the stale "p" results. Debouncing reduces how often this can happen by cutting down the number of in-flight requests, but the fully correct fix is either an abort controller (cancel the previous fetch when a new one starts) or an "ignore stale response" flag set in your effect's cleanup function.

**Why the dependency array shouldn't be treated as optional.** `useEffect`'s second argument tells React "only re-run this effect if one of these values changed since the last render." Every value your effect *reads* from the component's scope (state, props) that can change over time should be listed. Omitting one doesn't cause an error — it causes a *stale closure* bug, where the effect keeps using an old value forever because it never re-runs to pick up the new one.

**Cleanup functions prevent overlap.** Any `useEffect` that sets a timer, subscribes to something, or starts an async operation should return a cleanup function that undoes it. In `useDebounce`, `clearTimeout` in the cleanup is what guarantees only the *last* pending timer in a rapid sequence ever actually fires — every earlier one gets cancelled before it can run.

**Pagination and filtering are coupled.** Page count is a function of the *filtered* result set, not the whole dataset. That's why changing a filter must reset `page` to `1` — otherwise you can end up requesting a page number that no longer exists once the result set has shrunk.

---

## Useful Links

| Topic | Link |
|---|---|
| `useEffect` and dependency arrays | https://react.dev/reference/react/useEffect |
| Removing effect dependencies (the "stale closure" guide) | https://react.dev/learn/removing-effect-dependencies |
| Custom Hooks (like `useDebounce`) | https://react.dev/learn/reusing-logic-with-custom-hooks |
| Controlling an input with state | https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable |
| `setTimeout` / `clearTimeout` | https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout |
| `URLSearchParams` | https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams |
| Fetch API | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch |
| Debounce vs. throttle (conceptual overview) | https://css-tricks.com/debouncing-throttling-explained-examples/ |
| Rendering lists and keys | https://react.dev/learn/rendering-lists |
| Conditional rendering | https://react.dev/learn/conditional-rendering |
| Vite environment variables | https://vite.dev/guide/env-and-mode |

---

## Mini Examples

**1. A debounced search hook used against a fake API, outside of the recipe context:**

```tsx
import { useEffect, useState } from 'react';

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function UserSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  useEffect(() => {
    if (!debouncedQuery) return;
    fetch(`/api/users?search=${debouncedQuery}`);
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

**2. A minimal "reset page on filter change" pattern for a generic table:**

```tsx
import { useEffect, useState } from 'react';

function useResettablePage(filters: unknown[]) {
  const [page, setPage] = useState(1);
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, filters); // re-run (and reset) whenever any filter value changes
  return [page, setPage] as const;
}
```

**3. A tiny multi-select checkbox list using array toggle state:**

```tsx
import { useState } from 'react';

function CategoryFilter({ categories }: { categories: string[] }) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (category: string) => {
    setSelected(current =>
      current.includes(category)
        ? current.filter(c => c !== category)
        : [...current, category],
    );
  };

  return (
    <ul>
      {categories.map(category => (
        <li key={category}>
          <label>
            <input
              type="checkbox"
              checked={selected.includes(category)}
              onChange={() => toggle(category)}
            />
            {category}
          </label>
        </li>
      ))}
    </ul>
  );
}
```

**4. Cancelling a stale fetch response with `AbortController`, an alternative to relying on debounce alone:**

```tsx
import { useEffect, useState } from 'react';

function LiveResults({ query }: { query: string }) {
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/search?q=${query}`, { signal: controller.signal })
      .then(res => res.json())
      .then(setResults)
      .catch(err => {
        if (err.name !== 'AbortError') console.error(err);
      });
    return () => controller.abort(); // cancel this request if `query` changes again
  }, [query]);

  return <ul>{results.map(r => <li key={r}>{r}</li>)}</ul>;
}
```

---

## Practice Exercises

**Beginner — Add a "clear filters" button.** Add a single button above the recipe grid that resets `searchTerm`, `selectedTags`, `maxPrepMin`, `sortBy`, and `sortOrder` all back to their defaults in one click.

**Beginner — Show a "no results" message.** When `status === 'success'` and `recipes.length === 0`, render a friendly empty state (e.g. "No recipes match your filters") instead of an empty grid.

**Intermediate — Debounce the max-prep-time filter too.** Right now `maxPrepMin` triggers an immediate refetch on every change. Run it through `useDebounce` the same way `searchTerm` does, so rapidly changing the number doesn't spam the API.

**Intermediate — Persist filters in the URL.** Use `URLSearchParams` (or a router's search-params hook) to sync `searchTerm`, `selectedTags`, and `sortBy` into the browser URL, so refreshing the page or sharing a link preserves the current filters.

**Challenge — Add request cancellation.** Modify `fetchRecipes` in `lib/api.ts` to accept an `AbortSignal`, and update the fetch effect in `RecipeList` to create an `AbortController` per effect run and abort it in the cleanup function. This fully eliminates the race-condition risk described in the Theory section, even without debouncing.

---

> **Keep going!** Search, filtering, and pagination together are one of the most common feature sets you'll build in real apps — mastering the "controlled input → debounce → effect → fetch" chain here will pay off in almost every project you touch next. See you in Class 07! 🚀
