---
applyTo: "**/examples/**"
---

# Side-Example Files — Comments and Teaching Style

Example files are **teaching tools used during live lectures**. Their purpose is to help students understand *why* something works, not just *what* the code does. Copilot should produce richly commented, deliberately explicit code in these files.

## Comment structure

Use section banners to separate major concepts:

```tsx
// ============================================================
// CONCEPT NAME — one-line summary of what this section shows
// ============================================================
```

Add inline comments that explain the *why* before non-obvious lines:

```tsx
// useState() returns a pair: [currentValue, setterFunction].
// When you call the setter, React re-renders the component with the new value.
const [count, setCount] = useState(0);
```

## Contrast correct vs incorrect approaches

When showing a concept, include the wrong approach (commented out) alongside the right one so students can compare:

```tsx
// ❌ A plain variable does NOT trigger a re-render when changed.
// let count = 0;

// ✅ State always triggers a re-render when updated.
const [count, setCount] = useState(0);
```

## Use checkmarks and markers

Mark correct patterns with `✅` and incorrect/discouraged ones with `❌` in comments. This visual cue helps students scan the file quickly.

## Explain React-specific behavior

Whenever a React rule or behavior is demonstrated for the first time in a file, include a comment explaining it:

- JSX is compiled to `React.createElement()` calls.
- `className` is used instead of `class` to avoid conflict with the JS keyword.
- State updates are asynchronous — the value does not change before the next render.
- The `key` prop is required for list rendering and must be unique and stable.

## Commented-out alternatives

Leave alternative implementations as commented-out blocks with a label so the trainer can reveal them one at a time:

```tsx
// ✅ Option 2: Fragment shorthand — no extra DOM node
// return (
//   <>
//     <p>Apple</p>
//     <p>Banana</p>
//   </>
// );
```

## Code style in examples

- Keep components small and self-contained — one concept per file where possible.
- Prefer verbose, readable code over concise one-liners.
- Use descriptive variable names that match the concept being taught (`buttonClickedCount`, not `n`).
