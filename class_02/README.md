# Class 02 — useEffect, Lifecycle & Lists

Welcome back! In this class you moved beyond static components and into **dynamic, side-effect-driven React**. You learned how to respond to the component lifecycle with `useEffect`, how to render lists of data with `.map()`, how to keep state in sync across multiple components by lifting it up, and how to model your data cleanly with TypeScript types. The Pantry Pal project ties it all together as a real-world card grid. Great work getting this far — it only gets more fun from here.

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Running the Apps](#2-running-the-apps)
3. [Core Concepts](#3-core-concepts)
   - [useEffect — Running Side Effects](#useeffect--running-side-effects)
   - [The Dependency Array](#the-dependency-array)
   - [Cleanup Functions](#cleanup-functions)
   - [Lists with .map() and the key Prop](#lists-with-map-and-the-key-prop)
   - [Lifting State Up](#lifting-state-up)
   - [Functional State Updater](#functional-state-updater)
   - [TypeScript Types for Components](#typescript-types-for-components)
   - [import type](#import-type)
4. [Theory](#4-theory)
5. [Useful Links](#5-useful-links)
6. [Mini Examples](#6-mini-examples)
7. [Practice Exercises](#7-practice-exercises)

---

## 1. Project Structure

```text
class_02/
├── examples/               # Standalone demo: SPA navigation, useEffect, employee list
│   └── src/
│       ├── main.tsx        # Entry point (StrictMode intentionally disabled for learning)
│       └── App.tsx         # All components: App, Navigation, HomePage, AboutUs, Employees
│
└── pantry-pal/             # Real-world project: recipe card grid
    └── src/
        ├── App.tsx                       # Root layout, renders recipe grid
        ├── components/
        │   ├── Header.tsx                # Page header
        │   ├── Recipe.tsx                # Single recipe card
        │   └── TagList.tsx               # Tag badge list inside a card
        ├── data/
        │   └── seedData.ts               # Static recipe data (typed array)
        └── types/
            └── recipe.ts                 # Recipe and Ingredient TypeScript types
```

---

## 2. Running the Apps

**Examples project:**

```bash
cd class_02/examples
npm install
npm run dev
```

**Pantry Pal:**

```bash
cd class_02/pantry-pal
npm install
npm run dev
```

Both apps run at `http://localhost:5173` by default. Stop one before starting the other, or check the terminal — Vite will pick the next available port automatically.

---

## 3. Core Concepts

### useEffect — Running Side Effects

A **side effect** is anything your component does that reaches *outside* the React rendering process — fetching data from an API, setting a timer, updating the browser title, subscribing to an event, etc.

You can't put side effects directly in the component body because that code runs on *every render*, which would cause infinite loops or duplicate subscriptions. `useEffect` gives you a safe place to run this code *after* React has updated the DOM.

```tsx
import { useEffect } from 'react';

function Clock() {
  useEffect(() => {
    // This runs AFTER the component appears on the screen.
    console.log('Clock mounted!');
  }, []);

  return <p>Tick tock</p>;
}
```

**Mental model:** think of `useEffect` as saying *"after you've finished painting the screen, go do this extra work."*

---

### The Dependency Array

The second argument to `useEffect` controls *when* the effect runs:

| Dependency array | When the effect runs |
|---|---|
| Omitted (no array) | After **every** render — almost always a bug waiting to happen |
| `[]` (empty array) | Once, when the component **mounts** |
| `[value]` (with values) | On mount, and again whenever `value` changes |

```tsx
// Runs once on mount (like componentDidMount)
useEffect(() => {
  console.log('mounted');
}, []);

// Runs whenever `userId` changes
useEffect(() => {
  console.log('user changed:', userId);
}, [userId]);
```

> **Note:** If your effect uses a variable from the component, you must include it in the dependency array. The ESLint plugin `eslint-plugin-react-hooks` will warn you if you forget.

---

### Cleanup Functions

Some effects need to clean up after themselves when the component is removed from the screen — otherwise you get memory leaks, stale event listeners, or timers that keep firing on nothing.

Return a function from `useEffect` to register a cleanup:

```tsx
useEffect(() => {
  const id = window.setInterval(() => {
    console.log('tick');
  }, 1000);

  // React calls this when the component unmounts.
  return () => clearInterval(id);
}, []);
```

**Real-world examples that always need cleanup:** `setInterval`, `setTimeout`, `addEventListener`, WebSocket connections, data-fetch abort controllers.

---

### Lists with .map() and the key Prop

To render a list of items you use JavaScript's `.map()` method — there is no special React template syntax for loops.

```tsx
const fruits = ['apple', 'banana', 'cherry'];

return (
  <ul>
    {fruits.map(fruit => (
      <li key={fruit}>{fruit}</li>
    ))}
  </ul>
);
```

**The `key` prop is mandatory.** React uses it internally to match elements between renders — without it, React re-renders the wrong items, animations break, and inputs lose focus unexpectedly.

Rules for keys:
- Must be **unique among siblings** (not globally unique)
- Must be **stable** — the same item should have the same key every render
- Use a database id if you have one; avoid array indexes for dynamic lists

```tsx
// ✅ Good — stable, unique id
employees.map(e => <li key={e.id}>{e.name}</li>)

// ❌ Avoid for dynamic lists — index shifts when items are added/removed
employees.map((e, index) => <li key={index}>{e.name}</li>)
```

---

### Lifting State Up

When two sibling components both need the same piece of state, you move that state to their **closest common ancestor** and pass it down as props.

In the examples app, `activePage` lives in `App` because both `Navigation` (reads it to highlight the active link) and `App` (reads it to decide which page to render) need it.

```tsx
// State lives in the parent
function App() {
  const [activePage, setActivePage] = useState('home');

  return (
    <>
      {/* Child reads and updates the parent's state via props */}
      <Navigation activePage={activePage} setActivePage={setActivePage} />
      {activePage === 'home' ? <HomePage /> : <AboutUs />}
    </>
  );
}

// Child receives the state AND the setter as props
function Navigation({ activePage, setActivePage }) {
  return (
    <button onClick={() => setActivePage('about-us')}>
      About us
    </button>
  );
}
```

**Mental model:** data flows *down* via props; events flow *up* via callback props.

---

### Functional State Updater

When your new state depends on the previous state, use the **functional updater** form of the setter:

```tsx
// ❌ Can read stale state if React batches multiple updates
setCount(count + 1);

// ✅ React guarantees `prev` is always the latest value
setCount(prev => prev + 1);
```

This matters most when:
- You call the setter multiple times in the same event handler
- You're updating state inside an async callback (e.g. inside a timer or fetch handler)

For arrays, always return a *new* array — never mutate state in place:

```tsx
// ❌ Mutation — React won't see the change and won't re-render
items.push(newItem);
setItems(items);

// ✅ New array — React detects the change and re-renders
setItems(prev => [...prev, newItem]);
```

---

### TypeScript Types for Components

Define a `type` for your props so TypeScript can catch mismatches at compile time:

```tsx
type UserProps = {
  name: string;
  age: number;
  isAdmin?: boolean; // The ? makes it optional
};

function User({ name, age, isAdmin = false }: UserProps) {
  return <p>{name} ({age}) {isAdmin && '— Admin'}</p>;
}

// TypeScript now errors if you pass the wrong types:
<User name="Alice" age="thirty" /> // ❌ Error: age should be a number
<User name="Bob" age={25} />       // ✅ Correct
```

Separating types into a `types/` folder (like `types/recipe.ts`) lets multiple components import the same shape without duplicating it.

---

### import type

```tsx
// Runtime import — ships code to the browser
import { Recipe } from '../types/recipe';

// Type-only import — erased completely at build time, zero runtime cost
import type { Recipe } from '../types/recipe';
```

Use `import type` whenever you only need something for TypeScript checking, not at runtime. It's a good habit that makes your imports self-documenting and can help bundlers tree-shake more aggressively.

---

## 4. Theory

### The Component Lifecycle

Every React component goes through three stages:

```
Mount  →  Update  →  Unmount
```

- **Mount:** The component appears on screen for the first time. `useEffect(() => {...}, [])` fires here.
- **Update:** Props or state change, React re-renders the component. `useEffect(() => {...}, [dep])` fires when `dep` changes.
- **Unmount:** The component is removed from the screen (e.g. you navigate away, a condition turns false). The cleanup function returned from any `useEffect` fires here.

Understanding this cycle is the key to knowing *where* to put your code and *when* it will run.

### Why StrictMode doubles your effects

React's `StrictMode` deliberately mounts, unmounts, and re-mounts every component in development. This forces you to write correct cleanup code — if your effect leaks when the component is destroyed and recreated, you'll catch it in dev before it reaches users. In production, `StrictMode` has zero effect on behaviour.

In the examples app, `StrictMode` is commented out intentionally so that `useEffect` logs are easier to read while learning.

### How React Reconciles Lists

When state changes and React re-renders a list, it compares the old and new lists to figure out what changed. The `key` prop is the anchor for this comparison — React finds the element with the same key in the new list and updates only what changed, instead of destroying and recreating everything.

Without `key`, React falls back to comparing by *position* in the array. This works until items are added, removed, or reordered — then React updates the wrong elements, which causes visual glitches and broken input state.

### The Virtual DOM and Why .map() is Safe

React never writes directly to the real DOM in your code. Instead, `.map()` builds an array of *virtual* elements (plain JavaScript objects). React then compares this virtual tree with the previous one, calculates the minimal set of real DOM changes needed, and applies only those. This is why you can return a new array from `.map()` on every render without trashing the whole DOM.

---

## 5. Useful Links

| Topic | Resource |
|---|---|
| `useEffect` | [React docs — useEffect](https://react.dev/reference/react/useEffect) |
| Synchronizing with Effects | [React docs — Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects) |
| You Might Not Need an Effect | [React docs — You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect) |
| Lists and Keys | [React docs — Rendering Lists](https://react.dev/learn/rendering-lists) |
| Lifting State Up | [React docs — Sharing State Between Components](https://react.dev/learn/sharing-state-between-components) |
| TypeScript with React | [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) |
| Tailwind responsive prefixes | [Tailwind docs — Responsive Design](https://tailwindcss.com/docs/responsive-design) |
| Array methods (map, filter) | [MDN — Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) |

---

## 6. Mini Examples

### Fetching data on mount

```tsx
import { useEffect, useState } from 'react';

type Post = { id: number; title: string };

function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  // Empty [] → runs once after mount. Good for data fetching.
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

---

### Effect that re-runs when a prop changes

```tsx
import { useEffect } from 'react';

type Props = { userId: number };

function UserProfile({ userId }: Props) {
  useEffect(() => {
    console.log('Fetching user', userId);
    // fetch(`/api/users/${userId}`) ...
  }, [userId]); // Re-runs every time userId changes

  return <p>Profile for user #{userId}</p>;
}
```

---

### Tab switcher (lifting state up)

```tsx
import { useState } from 'react';

type Tab = 'overview' | 'reviews' | 'faq';

function Tabs({ active, onSelect }: { active: Tab; onSelect: (t: Tab) => void }) {
  const tabs: Tab[] = ['overview', 'reviews', 'faq'];
  return (
    <nav>
      {tabs.map(tab => (
        <button
          key={tab}
          style={{ fontWeight: active === tab ? 'bold' : 'normal' }}
          onClick={() => onSelect(tab)}>
          {tab}
        </button>
      ))}
    </nav>
  );
}

function ProductPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div>
      <Tabs active={activeTab} onSelect={setActiveTab} />
      {activeTab === 'overview' && <p>Overview content</p>}
      {activeTab === 'reviews' && <p>Reviews content</p>}
      {activeTab === 'faq' && <p>FAQ content</p>}
    </div>
  );
}
```

---

### Cleanup with an event listener

```tsx
import { useEffect, useState } from 'react';

function MouseTracker() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMove);

    // Cleanup removes the listener when the component unmounts.
    // Without this, the listener stays active forever.
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return <p>Mouse: {pos.x}, {pos.y}</p>;
}
```

---

## 7. Practice Exercises

**Beginner**

1. Open `class_02/examples/src/App.tsx`. The `Employees` component logs a message every 2 seconds. Add your name to the log message and verify it appears in the browser console.
2. Open `class_02/pantry-pal/src/App.tsx`. Notice the missing `key` prop on the `<Recipe />` element inside `.map()`. Add `key={recipe.id}` to fix the React warning.
3. Add a fourth recipe object to `seedData.ts`. Make sure it matches the `Recipe` type — TypeScript will tell you if anything is missing.

**Intermediate**

4. Add a "Home" page component to the Pantry Pal app that shows a welcome message. Create a simple two-item navigation (`Home` / `Recipes`) that swaps between the welcome page and the recipe grid. Use lifted state in `App.tsx`.
5. In the examples `Employees` component, add a second `useEffect` with `[employees]` as its dependency. Log how many employees are currently in state every time the list changes.
6. Create a `SearchBar` component in Pantry Pal that filters recipes by title as you type. The filtered list should live in state in `App.tsx` and be passed down to where the grid is rendered.

**Challenge**

7. In the examples app, the "Mark as EOTM" button currently mutates the employee objects inside `.map()` (sets `employee.isEmployeeOfTheMonth = true` directly). Refactor the handler to be immutable — use the spread operator (`{ ...employee, isEmployeeOfTheMonth: true }`) to create a new object instead of mutating the existing one.
8. Add a `useEffect` to the `Navigation` component that updates `document.title` to `"SPA — {activePage}"` whenever `activePage` changes. Don't forget to reset the title in the cleanup function.
9. Add a `useEffect` to `App.tsx` in Pantry Pal that logs how many recipes are in the RECIPES array when the app mounts. Then extend it: if you add state for a filtered list, log the filtered count every time it changes.

---

> **You're building real skills now.** `useEffect` trips up even experienced developers at first — the key is to practise reading dependency arrays and thinking about *when* things run. Keep experimenting, check the console often, and see you in Class 03! 💪
