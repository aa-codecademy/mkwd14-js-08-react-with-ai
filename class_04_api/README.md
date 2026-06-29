# Class 4 — APIs, useEffect & Async Data Fetching

Welcome to Class 4! This class is about connecting your React app to the outside world. Until now, all your data has lived inside the component (in state or hardcoded arrays). Today you learn how to **fetch data from a server**, handle the **loading, success, and error states** that come with async operations, and **send data back** with POST requests. By the end you'll have a full read/write app backed by a real REST API.

---

## Table of Contents

1. [Core Concepts](#1-core-concepts)
   - [useEffect](#useeffect)
   - [The fetch API](#the-fetch-api)
   - [async/await vs .then()](#asyncawait-vs-then)
   - [The HttpStatus pattern](#the-httpstatus-pattern)
   - [Separating API calls into a lib file](#separating-api-calls-into-a-lib-file)
   - [POST requests with JSON](#post-requests-with-json)
2. [Theory](#2-theory)
3. [Project Structure](#3-project-structure)
4. [Useful Links](#4-useful-links)
5. [Mini Examples](#5-mini-examples)
6. [Practice Exercises](#6-practice-exercises)

---

## 1. Core Concepts

### useEffect

`useEffect` lets you run **side effects** after a component renders. A side effect is anything that reaches outside of React — fetching data, setting a timer, subscribing to an event.

```tsx
import { useEffect } from 'react';

useEffect(() => {
  // your side effect here
}, [dependencies]);
```

The second argument is the **dependency array**:

| Value | What it means |
|---|---|
| `[]` (empty) | Run once after the first render (on mount) |
| `[count]` | Run after every render where `count` changed |
| omitted | Run after every render — usually not what you want |

> **Gotcha:** If you forget the `[]` in a data-fetch effect, React will re-fetch on every render, causing an infinite loop. Always include the dependency array.

---

### The fetch API

`fetch` is a browser built-in for making HTTP requests. It returns a **Promise** that resolves to a `Response` object.

```tsx
const response = await fetch('https://api.example.com/data');
```

**Critical rule:** `fetch` only rejects (throws) on **network errors** (no connection, DNS failure). A `404 Not Found` or `500 Server Error` still *resolves* — you have to check `response.ok` yourself:

```tsx
const response = await fetch('https://api.example.com/data');

// response.ok is true for status codes 200–299
if (!response.ok) {
  throw new Error('Request failed'); // you must throw manually
}

const data = await response.json(); // parse the JSON body
```

> **Note:** `response.json()` is also async — it reads the response body stream. Always `await` it.

---

### async/await vs .then()

Both styles do the same thing — they handle Promises. Pick the style that is clearest for the task.

**`.then()` style** — good for simple chains, works well with `.finally()`:

```tsx
fetch(URL)
  .then(res => res.json())
  .then(data => setData(data))
  .catch(err => setError(err.message))
  .finally(() => setIsLoading(false));
```

**`async/await` style** — reads more like synchronous code, easier to follow for multiple steps:

```tsx
async function loadData() {
  try {
    const res = await fetch(URL);
    const data = await res.json();
    setData(data);
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
}
```

> **Gotcha:** You cannot make the `useEffect` callback itself `async` (it would return a Promise, but React expects either nothing or a cleanup function). Instead, define an async function *inside* the effect and call it immediately:
> 
> ```tsx
> useEffect(() => {
>   async function load() {
>     const data = await fetchSomething();
>     setData(data);
>   }
>   load(); // call it right away
> }, []);
> ```

---

### The HttpStatus pattern

Instead of three separate boolean flags (`isLoading`, `isError`, `isSuccess`), use **one string** that can only hold one value at a time:

```tsx
type HttpStatus = 'idle' | 'loading' | 'success' | 'error';

const [status, setStatus] = useState<HttpStatus>('idle');
```

Why this is better:

- Booleans can contradict each other (`isLoading: true, isSuccess: true` makes no sense — but TypeScript can't prevent it).
- A union type enforces that only one state is active at any moment.
- Conditional rendering reads clearly: `{status === 'loading' && <Skeleton />}`

The four states:

| Status | Meaning |
|---|---|
| `'idle'` | Nothing has happened yet — initial render |
| `'loading'` | Request is in flight |
| `'success'` | Data arrived successfully |
| `'error'` | Request failed |

---

### Separating API calls into a lib file

Putting `fetch` calls directly in components couples two concerns: *what to render* and *how to talk to a server*. When the API changes, you'd have to hunt through every component that calls it.

A better approach: create `src/lib/api.ts` and export plain async functions:

```ts
// src/lib/api.ts
export async function fetchRecipes(): Promise<Recipe[]> {
  const response = await fetch(`${BASE_URL}/recipes`);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.data;
}
```

Your component just calls the function — it doesn't care about URLs, headers, or JSON parsing:

```tsx
// RecipeList.tsx
fetchRecipes()
  .then(data => setRecipes(data))
  .catch(err => setError(err.message));
```

This separation is sometimes called a **service layer** or **API module**.

---

### POST requests with JSON

To send data to the server, pass an options object to `fetch`:

```tsx
await fetch(`${BASE_URL}/recipes`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json', // tells the server how to read the body
  },
  body: JSON.stringify(newRecipe), // JS object → JSON string
});
```

Three things to remember every time:
1. Set `method: 'POST'`
2. Set `Content-Type: application/json` — without it, most servers ignore the body
3. `JSON.stringify` the body — `fetch` can only send strings or binary data, not JS objects

---

## 2. Theory

### Why useEffect exists

React's rendering is a **pure function**: given the same props and state, the component always returns the same JSX. Side effects (network calls, timers, DOM manipulations) break that purity — they have consequences *outside* the render.

`useEffect` is React's escape hatch: it lets you say "after rendering, do this thing that affects the outside world." React keeps the render pure and isolates impure code in effects.

### The Promise mental model

Think of a Promise as an IOU note. `fetch(url)` hands you an IOU immediately ("I promise to give you the response eventually"). You can `.then()` to say "when the promise is fulfilled, do this with the value" and `.catch()` to say "if it fails, handle it here."

`async/await` is just cleaner syntax for the same concept — `await` pauses the async function until the Promise resolves, then continues with the value.

### Why fetch doesn't throw on 4xx/5xx

The `fetch` spec was designed to only reject on *network-level* failures (you couldn't even reach the server). Once the server responds — even with an error code — from the network's perspective the request succeeded. This is why you always check `response.ok` yourself.

### Response streaming

`response.json()` is async because the response body arrives as a **stream** — the browser reads it in chunks. `.json()` reads all the chunks, assembles them, and parses the JSON. For large responses this takes a measurable amount of time, which is why you always `await` it.

### Skeleton loading vs spinner

In `RecipeList.tsx`, the loading state shows **skeleton cards** (grey placeholder boxes) instead of a spinner. Skeletons reduce *perceived* load time — the page layout is established immediately and items "pop in" rather than the whole page jumping from empty to full. This is a common production pattern.

---

## 3. Project Structure

```text
class_04_api/
├── examples/                   # Minimal standalone fetch demo
│   └── src/
│       └── App.tsx             # useEffect + fetch + loading/error states in one file
│
└── pantry-pal/                 # Full recipe app with read + write API calls
    └── src/
        ├── App.tsx             # Root — manages pageInView state (simple client router)
        ├── main.tsx            # Entry point
        ├── components/
        │   ├── Header.tsx      # Static page header (not used in final version)
        │   ├── Navbar.tsx      # Tab nav — calls onPageSelect prop to signal App
        │   ├── Recipe.tsx      # Recipe card component
        │   ├── RecipeForm.tsx  # Form with react-hook-form + createRecipe API call
        │   ├── RecipeList.tsx  # Fetches recipes on mount, renders loading/error/success
        │   └── TagList.tsx     # Renders tag pills from recipe.tags[]
        ├── lib/
        │   └── api.ts          # All fetch calls live here — fetchRecipes, createRecipe
        └── types/
            ├── http-status.ts  # HttpStatus union type
            └── recipe.ts       # Recipe, CreateRecipe, Ingredient types
```

---

## 4. Useful Links

| Topic | Link |
|---|---|
| MDN — `fetch` API | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch |
| MDN — `useEffect` | https://react.dev/reference/react/useEffect |
| MDN — `Response.ok` | https://developer.mozilla.org/en-US/docs/Web/API/Response/ok |
| MDN — `Response.json()` | https://developer.mozilla.org/en-US/docs/Web/API/Response/json |
| MDN — `JSON.stringify` | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify |
| React docs — synchronising with effects | https://react.dev/learn/synchronizing-with-effects |
| React docs — you might not need an effect | https://react.dev/learn/you-might-not-need-an-effect |
| MDN — Promises | https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise |
| JSONPlaceholder (fake REST API for practice) | https://jsonplaceholder.typicode.com |

---

## 5. Mini Examples

### Example 1 — Fetch a single item and display it

```tsx
import { useEffect, useState } from 'react';

type User = { id: number; name: string; email: string };

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error('User not found');
        return res.json();
      })
      .then(data => {
        setUser(data);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [userId]); // re-fetch whenever userId changes

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>Could not load user.</p>;

  return (
    <div>
      <h2>{user!.name}</h2>
      <p>{user!.email}</p>
    </div>
  );
}
```

---

### Example 2 — POST request button

```tsx
import { useState } from 'react';

function LikeButton({ postId }: { postId: number }) {
  const [liked, setLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked: true }),
      });
      if (!res.ok) throw new Error('Failed to like');
      setLiked(true);
    } catch (err) {
      alert('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button onClick={handleLike} disabled={isLoading || liked}>
      {liked ? '❤️ Liked' : isLoading ? 'Liking...' : '🤍 Like'}
    </button>
  );
}
```

---

### Example 3 — fetch with async/await inside useEffect

```tsx
import { useEffect, useState } from 'react';

type Todo = { id: number; title: string; completed: boolean };

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Define the async function inside the effect — you can't make the effect callback itself async.
    async function loadTodos() {
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: Todo[] = await res.json();
        setTodos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
    loadTodos();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
          {todo.title}
        </li>
      ))}
    </ul>
  );
}
```

---

### Example 4 — Re-fetch when a search term changes

```tsx
import { useEffect, useState } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  // Every time `query` changes, this effect re-runs and fetches fresh results.
  // The dependency array [query] is what triggers the re-fetch.
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => setResults(data.results));
  }, [query]);

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <ul>
        {results.map((r, i) => <li key={i}>{r}</li>)}
      </ul>
    </div>
  );
}
```

---

## 6. Practice Exercises

### Beginner

1. **Show the count in the title.** In `RecipeList.tsx`, update the success message to also say "recipes found" only when the count is greater than zero. When zero, show "No recipes yet — add one!".

2. **Add a retry button.** When `status === 'error'`, add a "Try again" button that re-runs the fetch. Hint: move the fetch logic into a named function inside the component and call it both in `useEffect` and on the button click.

3. **Explore the examples app.** Change `API_URL` in `examples/src/App.tsx` to `https://jsonplaceholder.typicode.com/users` and update the `Post` type and JSX to display user names and email addresses.

### Intermediate

4. **Add a loading spinner to RecipeForm.** The form already disables the submit button while `isSubmitting` is true. Display a visible spinner (a simple rotating CSS circle or an emoji like `⏳`) next to the button text while the request is in flight.

5. **Handle 404 gracefully.** In `api.ts`, update `fetchRecipes` so that if the server returns a 404, the error message reads "Recipes not found" instead of whatever the server sends. Hint: check `response.status === 404` before the generic `throw`.

6. **Success toast notification.** After `createRecipe` succeeds in `RecipeForm.tsx`, show a temporary "Recipe saved!" message for 3 seconds before it disappears. Use a boolean state and `setTimeout` inside the `onSuccess` callback.

### Challenge

7. **Debounce a search field.** Add a text input to `RecipeList.tsx` that filters recipes by title. Instead of filtering on every keypress, use `useEffect` with a `setTimeout` to wait 300ms after the user stops typing before filtering. Clear the timeout with a cleanup function (`return () => clearTimeout(id)` inside `useEffect`).

8. **Optimistic UI.** When the user submits a new recipe in `RecipeForm.tsx`, add it to the displayed list immediately (before the server responds) by passing a callback to `RecipeList`. If the server call fails, remove the optimistically added item and show an error. This is how most modern apps feel fast — they assume success and roll back on failure.

---

> **Well done!** Connecting React to a real server is one of the most important skills you'll use in every project. The patterns you learned here — `useEffect` for fetching, `HttpStatus` for state modeling, a dedicated `lib/api.ts` module — are battle-tested and transfer directly to production code. Next class we'll look at routing, so your navigation will update the URL instead of just swapping components. See you there!
