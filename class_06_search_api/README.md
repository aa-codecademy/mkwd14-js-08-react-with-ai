# Class 5 — Advanced API Integration: Forms, Editing, and Deleting Records

In this class, you take the recipe app from "just displaying data" to a full CRUD (Create, Read, Update, Delete) experience. You'll wire up a real form with validation using `react-hook-form`, add dynamic list fields (ingredients and steps), build an edit dialog that reuses your existing form, wire up delete with instant UI feedback, and manage loading/error states the way production apps do. By the end, you'll understand how a React frontend talks to a real backend across all four HTTP verbs (GET, POST, PATCH, DELETE) and how to keep your UI in sync with the server.

---

## Table of Contents

1. [Core Concepts covered in this class](#core-concepts-covered-in-this-class)
   - [Controlled vs. uncontrolled forms](#1-controlled-vs-uncontrolled-forms)
   - [react-hook-form and `register`](#2-react-hook-form-and-register)
   - [Dynamic field arrays with `useFieldArray`](#3-dynamic-field-arrays-with-usefieldarray)
   - [Status-based async state](#4-status-based-async-state)
   - [Dialogs/modals as conditional rendering](#5-dialogsmodals-as-conditional-rendering)
   - [Lifting state up and callback props](#6-lifting-state-up-and-callback-props)
   - [A service layer for API calls](#7-a-service-layer-for-api-calls)
2. [Theory](#theory)
3. [Useful Links](#useful-links)
4. [Mini Examples](#mini-examples)
5. [Practice Exercises](#practice-exercises)

---

## Core Concepts covered in this class

### 1. Controlled vs. uncontrolled forms

In a **controlled** component, React state is the single source of truth for an input's value — you set `value={state}` and update state `onChange`. In an **uncontrolled** component, the DOM itself holds the value, and you only reach in to read it when you need to (via a ref, or a library like `react-hook-form`).

The mental model: controlled forms give you total control (validate on every keystroke, transform input as it's typed) at the cost of a re-render per keystroke. Uncontrolled forms are cheaper and simpler for forms with many fields, which is exactly why libraries like react-hook-form default to the uncontrolled approach.

```tsx
// Controlled: React state drives the value
function ControlledInput() {
  const [value, setValue] = useState('');
  return <input value={value} onChange={e => setValue(e.target.value)} />;
}

// Uncontrolled: the DOM holds the value, we just register it
function UncontrolledInput() {
  const { register } = useForm();
  return <input {...register('name')} />;
}
```

### 2. react-hook-form and `register`

`react-hook-form` gives you one hook (`useForm`) that replaces dozens of individual `useState` calls for fields, errors, and submission status. `register('fieldName', rules)` returns an object of props (`name`, `onChange`, `onBlur`, `ref`) that you spread onto a native input — this is how the library "hooks into" the DOM without controlling the value directly.

Why it exists: manually tracking value + error + touched state for 10 form fields is repetitive and error-prone. `register` centralizes that bookkeeping and gives you built-in validation rules (`required`, `min`, `validate`) without extra libraries.

```tsx
import { useForm } from 'react-hook-form';

type FormValues = { email: string };

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register('email', { required: 'Email is required' })} />
      {errors.email && <p>{errors.email.message}</p>}
      <button type="submit">Sign up</button>
    </form>
  );
}
```

> **Note:** Always pass `handleSubmit(onSubmit)` to the form's `onSubmit`, never `onSubmit` directly. `handleSubmit` runs validation first and only calls your function if every rule passes.

### 3. Dynamic field arrays with `useFieldArray`

Some forms need a variable number of repeated fields — ingredients, steps, phone numbers. `useFieldArray` manages that array for you: it gives you the current `fields` array (each with a stable `id`), plus `append` and `remove` functions.

The mental model: you can't just `useState<string[]>([])` and re-render inputs by index, because removing an item from the middle would shift every input after it and confuse React's reconciliation. `useFieldArray` solves this by generating a stable key per row that survives insertions/removals.

```tsx
import { useForm, useFieldArray } from 'react-hook-form';

function PhoneListForm() {
  const { control, register } = useForm({ defaultValues: { phones: [{ number: '' }] } });
  const { fields, append, remove } = useFieldArray({ control, name: 'phones' });

  return (
    <div>
      {fields.map((field, i) => (
        <div key={field.id}>
          <input {...register(`phones.${i}.number`)} />
          <button type="button" onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ number: '' })}>Add phone</button>
    </div>
  );
}
```

> **Note:** Always use `field.id` as the React `key`, never the array index. The index changes when you remove a middle item; `field.id` stays stable.

### 4. Status-based async state

Instead of three separate booleans (`isLoading`, `isError`, `isSuccess`) that can drift out of sync, model an async operation as one string: `'idle' | 'loading' | 'success' | 'error'`. Only one value is true at any moment, by construction — you can't accidentally have both `isLoading` and `isSuccess` true at once.

This matters because bugs like "the skeleton and the data both show at once" almost always come from independent booleans getting out of sync. A single status variable makes invalid states unrepresentable.

```tsx
type Status = 'idle' | 'loading' | 'success' | 'error';

function useStatus() {
  const [status, setStatus] = useState<Status>('idle');
  // ... setStatus('loading') before the fetch, 'success'/'error' after
  return status;
}
```

### 5. Dialogs/modals as conditional rendering

A modal doesn't need its own "is open" boolean if you drive it from the data it displays. In this class's code, `EditRecipeDialog` only renders when `isEditing` (a `Recipe | null` in the parent) is truthy — mounting the component *is* opening the dialog, and setting the parent state to `null` unmounts (closes) it.

Why: it avoids a whole class of bugs where "which recipe is open" and "is the dialog open" get out of sync — there's only one source of truth, the selected recipe itself.

```tsx
function ParentWithModal() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <button onClick={() => setSelected('item-1')}>Open</button>
      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
```

### 6. Lifting state up and callback props

When two sibling components need to share or react to the same piece of state, that state moves up to their closest common parent, which then passes it down as props — including callback functions the children call to request a change. The parent never lets a child mutate state directly; the child just "asks" via a function call.

This is why `RecipeForm` takes an `onSuccess` callback instead of importing and calling `setPageInView` itself — it keeps `RecipeForm` reusable in any context (a full page, a dialog) because it doesn't know or care what happens after it succeeds.

```tsx
function Parent() {
  const [count, setCount] = useState(0);
  return <Child count={count} onIncrement={() => setCount(c => c + 1)} />;
}

function Child({ count, onIncrement }: { count: number; onIncrement: () => void }) {
  return <button onClick={onIncrement}>{count}</button>;
}
```

### 7. A service layer for API calls

All `fetch` calls live in one file (`lib/api.ts`) instead of scattered across components. Each function handles the URL, headers, JSON parsing, and error handling once, and returns clean typed data. Components call `createRecipe(payload)` and never think about HTTP again.

Why: `fetch` only rejects on network failure — a 404 or 500 still "resolves" successfully. If every component had to remember to check `response.ok` and parse the error body, that logic (and its bugs) would be duplicated everywhere. Centralizing it means you fix it once.

```ts
async function getUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
```

---

## Theory

**HTTP methods and idempotency.** `GET` (fetch) and `PUT`/`DELETE` are idempotent — calling them multiple times with the same input produces the same end state. `POST` (create) is not idempotent — calling it twice creates two records. `PATCH` is used here for partial updates (only send changed fields) rather than `PUT`, which conventionally replaces the whole resource. This is why `UpdateRecipe` is `Partial<CreateRecipe>` — it mirrors what PATCH semantically means.

**Optimistic vs. pessimistic updates.** This app uses a *pessimistic* update pattern: after `deleteRecipe` or `updateRecipe` resolves, it re-fetches the whole list from the server (`fetchRecipes`) rather than updating local state directly. This guarantees the UI matches the server's truth but means a brief loading flash on every mutation. An *optimistic* update would update local state immediately (assuming success) and roll back only if the request fails — faster-feeling UI, more code to handle failure.

**Why `fetch` doesn't throw on 404/500.** The Fetch API's promise only rejects for network-level failures (DNS failure, CORS block, connection refused). A response with any HTTP status code — including errors — is a "successful" fetch from the API's point of view. You must manually check `response.ok` (true for 200–299) and throw yourself if it's false. This trips up almost every beginner at least once.

**Form validation timing.** react-hook-form validates on submit by default (configurable to `onBlur`/`onChange`). Validating too aggressively (every keystroke) can feel naggy; validating only on submit can feel slow to give feedback. The `validate` custom function pattern (seen in the image URL field) lets you layer custom logic on top of built-in rules like `required`.

**Reconciliation and keys in dynamic lists.** React's diffing algorithm matches old and new list items by `key`. If you use array index as a key in a list where items can be removed from the middle, React will misattribute state (e.g. an input's typed text) to the wrong row after a removal. This is why `useFieldArray` generates a stable `field.id` independent of position.

---

## Useful Links

| Topic | Link |
|---|---|
| Controlled components | https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable |
| react-hook-form `useForm` | https://react-hook-form.com/docs/useform |
| react-hook-form `useFieldArray` | https://react-hook-form.com/docs/usefieldarray |
| Rendering lists and keys | https://react.dev/learn/rendering-lists |
| Conditional rendering | https://react.dev/learn/conditional-rendering |
| Sharing state between components (lifting state up) | https://react.dev/learn/sharing-state-between-components |
| `useEffect` for data fetching | https://react.dev/reference/react/useEffect |
| Fetch API | https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch |
| HTTP request methods (GET/POST/PATCH/DELETE) | https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods |
| HTTP idempotency | https://developer.mozilla.org/en-US/docs/Glossary/Idempotent |
| TypeScript utility types (`Partial<T>`) | https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype |
| Vite env variables | https://vite.dev/guide/env-and-mode |
| Radix UI Dialog (used under shadcn's Dialog) | https://www.radix-ui.com/primitives/docs/components/dialog |

---

## Mini Examples

**1. A tiny controlled search box with debounced state (a common pattern the in-class search input is missing):**

```tsx
import { useState, useEffect } from 'react';

function SearchBox({ onSearch }: { onSearch: (term: string) => void }) {
  const [term, setTerm] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(term), 300); // wait 300ms after typing stops
    return () => clearTimeout(timeout); // cancel the pending call if the user types again
  }, [term, onSearch]);

  return <input value={term} onChange={e => setTerm(e.target.value)} placeholder="Search..." />;
}
```

**2. A minimal status-driven fetch, outside of a recipe context:**

```tsx
import { useEffect, useState } from 'react';

function UserProfile({ id }: { id: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    setStatus('loading');
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(data => { setUser(data); setStatus('success'); })
      .catch(() => setStatus('error'));
  }, [id]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'error') return <p>Something went wrong.</p>;
  return <p>{user?.name}</p>;
}
```

**3. A generic confirm-delete pattern with a callback prop:**

```tsx
function DeleteButton({ onConfirm }: { onConfirm: () => void }) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <>
        <button onClick={onConfirm}>Yes, delete</button>
        <button onClick={() => setConfirming(false)}>Cancel</button>
      </>
    );
  }
  return <button onClick={() => setConfirming(true)}>Delete</button>;
}
```

**4. A minimal `useFieldArray` example for a to-do list form:**

```tsx
import { useForm, useFieldArray } from 'react-hook-form';

function TodoForm() {
  const { control, register, handleSubmit } = useForm({
    defaultValues: { todos: [{ text: '' }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'todos' });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      {fields.map((field, i) => (
        <div key={field.id}>
          <input {...register(`todos.${i}.text`)} />
          <button type="button" onClick={() => remove(i)}>x</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ text: '' })}>+ Add todo</button>
    </form>
  );
}
```

---

## Practice Exercises

**Beginner — Wire up the search input.** The search box in `RecipeList.tsx` currently does nothing. Add a `search` state variable, include it in the `params` object passed to `fetchRecipes`, and add it to the `useEffect` dependency array so typing (on submit, or with a small debounce) refetches the list.

**Beginner — Add a "clear form" button.** In `RecipeForm`, add a button next to "Save recipe" that calls `reset()` to clear all fields back to their defaults without submitting.

**Intermediate — Add optimistic delete.** Change `handleDeleteRecipe` in `RecipeList.tsx` to remove the recipe from local state immediately (`setRecipes(prev => prev.filter(r => r.id !== id))`) before the API call resolves, and roll back (re-fetch or re-add it) if the request fails. Compare how much snappier this feels versus the current re-fetch-after-delete approach.

**Intermediate — Add a "duplicate recipe" feature.** Add a "Duplicate" button on each `Recipe` card that calls `createRecipe` with the same data (minus the `id`) and a modified title like `"{title} (copy)"`, then refreshes the list.

**Challenge — Add sorting and pagination.** The `RecipesQueryParams` type already supports `sortBy`, `sortOrder`, and `page`/`limit`. Add UI controls (a dropdown for sort field/direction, "Next/Previous" buttons for pages) that update state and pass through to `fetchRecipes`. You'll need to handle the loading state carefully so pagination doesn't flash a full-page skeleton on every page change.
