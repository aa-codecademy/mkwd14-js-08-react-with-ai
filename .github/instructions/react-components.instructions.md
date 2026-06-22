---
applyTo: "**/*.tsx"
---

# React Component Conventions

## Structure

- Always use **functional components** — never class components.
- **One component per file**, named identically to the file (PascalCase).
- **Default export** at the bottom of every component file.
- Destructure props directly in the function signature.

```tsx
// ✅ correct
function UserCard({ name, age }: UserCardProps) {
  return <div>{name}</div>;
}
export default UserCard;

// ❌ avoid
function UserCard(props: UserCardProps) {
  const { name, age } = props;
  ...
}
```

## JSX rules

- Return a single root element. Use `<>...</>` (Fragment shorthand) to avoid unnecessary DOM nodes.
- Use `className` — never `class`.
- Embed JavaScript expressions with `{}`. Use `||` or `??` for fallback values.
- When rendering lists always include a **`key` prop** on the outermost element.

```tsx
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

## State

- Manage reactive values with `useState`. Name the pair `[value, setValue]`.
- State updates are **asynchronous** — never read the new value immediately after calling the setter.
- Define event handlers as named arrow functions above the `return`, not as inline lambdas (unless trivial).

```tsx
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
};
```

## Hooks

- Call hooks at the **top level** of the component — never inside conditions or loops.
- Import hooks from `react`: `import { useState, useEffect } from 'react';`
- Use `ReactNode` from `react` for the `children` prop type.

```tsx
import type { ReactNode } from 'react';

function Wrapper({ children }: { children: ReactNode }) {
  return <section>{children}</section>;
}
```

## What NOT to generate

- No class components.
- No `useRef`, `useReducer`, `useContext`, `useMemo`, or `useCallback` in early class examples — only introduce them when the lesson explicitly covers them.
- No custom hooks, HOCs, or render-props patterns unless the lesson requires it.
- No splitting a simple component into sub-components unless the example is teaching composition.
