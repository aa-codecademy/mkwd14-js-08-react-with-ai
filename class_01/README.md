# Class 01 — Introduction to React

Welcome to your first React class! This document covers everything we explored in class, along with the theory behind it. Don't worry if it feels like a lot at once — React has a small core API and everything builds on the same handful of concepts. Take it one step at a time. 🚀

---

## Table of Contents

1. [What is React?](#1-what-is-react)
2. [What is Vite?](#2-what-is-vite)
3. [Project Setup — Commands Used in Class](#3-project-setup--commands-used-in-class)
4. [Running the App](#4-running-the-app)
5. [Project Structure](#5-project-structure)
6. [Core Concepts](#6-core-concepts)
   - [Components](#components)
   - [JSX](#jsx)
   - [Props](#props)
   - [State & useState](#state--usestate)
   - [Event Handling](#event-handling)
   - [Conditional Rendering](#conditional-rendering)
   - [Fragments](#fragments)
   - [The children Prop](#the-children-prop)
7. [Styling in React](#7-styling-in-react)
   - [Plain CSS files](#plain-css-files)
   - [Inline styles](#inline-styles)
   - [Tailwind CSS](#tailwind-css)
   - [How Tailwind was wired up](#how-tailwind-was-wired-up)
8. [How the App Boots](#8-how-the-app-boots)
9. [Practice Exercises](#9-practice-exercises)

---

## 1. What is React?

React is a **JavaScript library for building user interfaces**. It was created by Meta (Facebook) and is one of the most widely used frontend technologies in the industry.

**The key idea behind React:**

Instead of manually updating the HTML when your data changes (like you would with vanilla JS), you describe *what the UI should look like* for a given state, and React figures out how to update the DOM efficiently.

```text
Data changes → React re-renders the component → DOM updates automatically
```

React introduces two core ideas:

- **Components** — reusable, self-contained pieces of UI
- **Reactivity** — the UI automatically stays in sync with your data (state)

---

## 2. What is Vite?

**Vite** is a modern build tool and development server. When you run your app locally, Vite:

- Serves files instantly using native browser ES modules (no bundling delay during development)
- Provides **Hot Module Replacement (HMR)** — your browser updates immediately when you save a file, without a full page reload
- Handles TypeScript, JSX, and CSS out of the box

For production, Vite bundles everything into optimised static files.

---

## 3. Project Setup — Commands Used in Class

### Creating the React app

```bash
npm create vite@latest examples -- --template react-ts
```

This command scaffolds a new React + TypeScript project inside a folder called `examples` using Vite's official template.

- `react-ts` = React with TypeScript
- Other available templates: `react`, `vue`, `vue-ts`, `svelte`, etc.

### Installing dependencies

```bash
cd examples
npm install
```

This reads `package.json` and installs all listed packages into `node_modules/`.

### Installing Tailwind CSS

```bash
npm install tailwindcss @tailwindcss/vite
```

- `tailwindcss` — the core Tailwind library
- `@tailwindcss/vite` — the official Vite plugin that integrates Tailwind into the build pipeline

> **Note:** Tailwind CSS v4 (used in this project) does not need a `tailwind.config.js` file. Configuration is done via the Vite plugin and a single CSS import.

---

## 4. Running the App

Navigate into the project directory and start the development server:

```bash
cd class_01/examples
npm run dev
```

The terminal will show a local URL, typically `http://localhost:5173`. Open it in your browser.

Other useful commands:

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server with HMR |
| `npm run build` | Compile TypeScript and bundle for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check for code issues |

---

## 5. Project Structure

```text
examples/
├── public/             # Static files served as-is (favicon, icons)
├── src/
│   ├── main.tsx        # Entry point — mounts the app to the DOM
│   ├── App.tsx         # Root component
│   ├── index.css       # Global styles (includes Tailwind import)
│   ├── App.css         # Styles specific to App
│   ├── Panel.tsx       # Component: card styled with CSS
│   ├── Panel.css       # Styles for Panel
│   ├── PanelTailwind.tsx # Same card, styled with Tailwind
│   ├── User.tsx        # Component: displays user data, shows props
│   ├── List.tsx        # Component: shows three ways to return multiple elements
│   └── Wrapper.tsx     # Layout component using the children prop
├── index.html          # HTML shell — React mounts into <div id="root">
├── vite.config.ts      # Vite configuration (plugins: React + Tailwind)
└── package.json        # Project metadata and dependencies
```

---

## 6. Core Concepts

### Components

A **component** is a JavaScript function that returns JSX. It is the fundamental building block of any React app.

```tsx
// A simple component
function Greeting() {
  return <h1>Hello, world!</h1>;
}
```

**Rules for components:**

- The function name **must start with a capital letter** (React uses this to tell components apart from plain HTML tags)
- It must return a **single root element** (or a Fragment)
- Each component lives in its own file and is exported with `export default`

You compose complex UIs by nesting components inside each other:

```tsx
function App() {
  return (
    <div>
      <Greeting />
      <Greeting />
    </div>
  );
}
```

---

### JSX

**JSX** (JavaScript XML) is a syntax extension that lets you write HTML-like markup inside JavaScript. Browsers don't understand JSX natively — Vite + the React plugin compiles it to regular JavaScript under the hood.

```tsx
// JSX
const element = <h1 className="title">Hello!</h1>;

// What it compiles to (you never write this manually)
const element = React.createElement("h1", { className: "title" }, "Hello!");
```

**Key JSX rules:**

| HTML | JSX |
|---|---|
| `class="..."` | `className="..."` |
| `for="..."` (label) | `htmlFor="..."` |
| `onclick="..."` | `onClick={...}` (camelCase) |
| Self-closing `<input>` | Must be `<input />` |

Use `{ }` curly braces to embed any JavaScript **expression** inside JSX:

```tsx
const name = 'Alice';
const age = 30;

return (
  <p>{name} is {age} years old. Next year she will be {age + 1}.</p>
);
```

> **Expression vs Statement:** You can only put *expressions* (things that produce a value) inside `{ }`. `if/else` and `for` loops are statements — use ternaries and `.map()` instead.

---

### Props

**Props** (short for *properties*) are how you pass data from a parent component to a child component. They work just like function arguments.

```tsx
// Defining the shape of props with TypeScript
type UserProps = {
  name: string;
  age: number;
};

// Receiving props in the child component
function User({ name, age }: UserProps) {
  return <p>{name} is {age} years old.</p>;
}

// Passing props from the parent
function App() {
  return <User name="Alice" age={30} />;
  //     ↑ string prop   ↑ number prop (use curly braces for non-string values)
}
```

**The spread operator shorthand:** If you have an object with the same shape as the component's props, you can spread it:

```tsx
const alice = { name: 'Alice', age: 30 };

// These two are identical:
<User name={alice.name} age={alice.age} />
<User {...alice} />
```

**Important:** Props flow **one way** — from parent to child. A child component cannot modify its own props.

---

### State & useState

**State** is data that belongs to a component and can change over time. When state changes, React automatically re-renders the component to reflect the new value.

```tsx
import { useState } from 'react';

function Counter() {
  // useState(0) initialises state with 0.
  // Returns [currentValue, setterFunction].
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**Why not just use a regular variable?**

```tsx
// ❌ This does NOT work — changing a regular variable does not trigger a re-render
let count = 0;
<button onClick={() => { count++; }}>Click</button>

// ✅ This DOES work — state updates trigger a re-render
const [count, setCount] = useState(0);
<button onClick={() => setCount(count + 1)}>Click</button>
```

**State updates are asynchronous.** After calling `setCount(...)`, the new value is not immediately available in the same function call — React schedules the re-render and applies all updates before the next render cycle.

---

### Event Handling

React events are named in **camelCase** and you pass a **function** (not a string) as the handler:

```tsx
// Inline arrow function — fine for simple one-liners
<button onClick={() => alert('Clicked!')}>Click</button>

// Separate function — better for logic that spans multiple lines
const handleClick = () => {
  console.log('clicked');
};
<button onClick={handleClick}>Click</button>
// ↑ Note: NO parentheses here. We pass the function reference, not its return value.
```

**Reading form input values:**

```tsx
const [text, setText] = useState('');

<input onChange={(e) => setText(e.target.value)} />
<p>You typed: {text}</p>
```

`e` is a **SyntheticEvent** — React's wrapper around the browser's native event. `e.target.value` gives you the current value of the input field.

---

### Conditional Rendering

React has no special template syntax for conditionals. You use plain JavaScript:

```tsx
// Ternary operator — use when you need an "else" branch
<p>{isLoggedIn ? 'Welcome back!' : 'Please log in.'}</p>

// Short-circuit (&&) — use when you only want to render something *if* a condition is true
{hasError && <p className="error">Something went wrong.</p>}

// If/else inside the component body (before the return)
function Status({ isOnline }: { isOnline: boolean }) {
  if (isOnline) {
    return <span>Online</span>;
  }
  return <span>Offline</span>;
}
```

---

### Fragments

A component must return **one** root element. But sometimes you don't want to add an extra `<div>` to the DOM. Use a **Fragment** to group elements without adding a real DOM node:

```tsx
// ✅ Shorthand (most common)
return (
  <>
    <h1>Title</h1>
    <p>Paragraph</p>
  </>
);

// ✅ Explicit import — required when you need to pass a "key" prop (for lists)
import { Fragment } from 'react';

return (
  <Fragment>
    <h1>Title</h1>
    <p>Paragraph</p>
  </Fragment>
);
```

---

### The children Prop

The **children** prop lets a component render whatever JSX is placed between its opening and closing tags. This is the foundation of reusable layout components.

```tsx
import type { ReactNode } from 'react';

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

// Usage — anything between the tags becomes children
function App() {
  return (
    <Card>
      <h2>Hello!</h2>
      <p>I am inside the Card component.</p>
    </Card>
  );
}
```

---

## 7. Styling in React

We covered three different approaches in this class. All three are valid — each has its use case.

### Plain CSS files

Create a `.css` file and import it into your component. Class names are referenced via `className`.

```css
/* Panel.css */
.card {
  border: 1px solid gray;
  border-radius: 5px;
  padding: 14px;
}
```

```tsx
import './Panel.css';

function Panel() {
  return <article className="card">...</article>;
}
```

> **Watch out:** CSS files imported this way are **global** — the rules apply everywhere in the app, not just in that component.

---

### Inline styles

Pass a JavaScript object to the `style` prop. Property names are **camelCase**.

```tsx
<p style={{ color: 'gray', fontSize: '12px' }}>Some text</p>
```

Good for dynamic values (e.g., a colour that comes from props or state):

```tsx
<div style={{ backgroundColor: userColor }}>...</div>
```

---

### Tailwind CSS

Tailwind is a **utility-first** CSS framework. Instead of writing CSS rules, you apply pre-built classes directly in your JSX:

```tsx
<button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
  Click me
</button>
```

Each class applies exactly one CSS property. Compose them to build any design you need. The full reference is at [tailwindcss.com/docs](https://tailwindcss.com/docs).

---

### How Tailwind was wired up

This project uses **Tailwind CSS v4**, which has a much simpler setup than older versions. No `tailwind.config.js` is needed.

**Step 1 — Install packages:**
```bash
npm install tailwindcss @tailwindcss/vite
```

**Step 2 — Add the Vite plugin** (`vite.config.ts`):
```ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

**Step 3 — Import Tailwind in your global CSS** (`src/index.css`):
```css
@import 'tailwindcss';
```

That's it! The Vite plugin scans your source files, generates only the CSS classes you actually use, and includes them in the build. This keeps the final CSS bundle tiny.

---

## 8. How the App Boots

Understanding the startup sequence helps demystify what's happening:

```
index.html              ← The browser loads this first
  └── <div id="root">   ← Empty placeholder
  └── <script src="/src/main.tsx">

main.tsx
  └── createRoot(document.getElementById('root'))
        └── .render(<App />)   ← React takes over the #root div

App.tsx
  └── Returns JSX → React builds a Virtual DOM tree
        └── React syncs the Virtual DOM with the real DOM
```

**Virtual DOM:** React maintains a lightweight in-memory representation of the DOM. When state changes, React calculates the *difference* (called a "diff") between the old and new trees, and only updates the parts of the real DOM that changed. This is what makes React fast.

---

## 9. Practice Exercises

Try these on your own — the best way to learn React is to write it!

**Beginner:**

1. Uncomment the `<User {...johnDoe} />` example in `App.tsx` and see it render. Then pass `janeDoe` instead.
2. Uncomment the `<Panel>` and `<PanelTailwind>` components and compare the two styling approaches.
3. Add a third `useState` to `App.tsx` that tracks whether a checkbox is checked (`boolean`). Display a message based on its value.

**Intermediate:**

4. Create a new component called `Greeting.tsx` that accepts a `name` prop (string) and renders `"Hello, {name}!"`. Use it in `App.tsx`.
5. Add a "Reset" button next to the counter that calls `setButtonClickedCount(0)`.
6. Modify `List.tsx` to render the fruit names from an array using `.map()`. Remember: each mapped element needs a `key` prop.

**Challenge:**

7. Create a `Toggle.tsx` component with a button that shows/hides a piece of text using a boolean state value.
8. Create a `ColorPicker.tsx` component with three buttons (Red, Green, Blue). Clicking a button changes the background colour of a `<div>` using an inline style.

---

> **You're doing great!** React has a learning curve at first, but once the component model clicks, everything else follows naturally. Practice consistently, read error messages carefully (React's errors are very descriptive), and don't hesitate to ask questions. See you in Class 02! 💪
