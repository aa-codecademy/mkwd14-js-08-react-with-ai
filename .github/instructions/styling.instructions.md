---
applyTo: "**/*.tsx, **/*.css"
---

# Styling Conventions

Follow this priority order — always try option 1 first, fall back to 2 only if 1 is insufficient, fall back to 3 only if 2 is also insufficient.

## 1. Tailwind CSS — always the first choice

Apply styles via Tailwind utility classes in `className`. This covers the vast majority of cases.

```tsx
// ✅ correct
<article className='max-w-xs m-3 border border-emerald-900 rounded-lg p-3'>
<button className='bg-amber-400 rounded-lg p-1'>
```

- Keep class lists readable — break onto a new line if more than ~5 classes.
- Prefer the simplest combination that achieves the goal; avoid chains of 10+ classes without justification.
- Use spacing scale (`m-`, `p-`, `gap-`) and typography scale (`text-sm`, `text-xl`) consistently.
- Arbitrary values (`[...]`), responsive prefixes (`md:`, `lg:`), and dark mode are fine when the lesson covers them.

## 2. Inline `style={{}}` — when Tailwind is not precise enough

Use inline styles only when a value cannot be expressed with Tailwind utilities — typically a **dynamic or computed value** from state or props.

```tsx
// ✅ correct — dynamic value impossible to express with Tailwind
<div style={{ backgroundColor: userColor }}>
<div style={{ width: `${progress}%` }}>

// ❌ avoid — Tailwind can handle this
<div style={{ marginTop: '12px', fontSize: '14px' }}>
```

Inline styles accept a JavaScript object with camelCase property names and string (or unitless number) values.

## 3. `.css` file — last resort only

Create a `.css` file only when neither Tailwind nor inline styles can achieve what is needed (e.g., complex pseudo-selectors, keyframe animations, or third-party component overrides that require a global class).

```tsx
// Only if options 1 and 2 are genuinely insufficient
import './Component.css';
```

- Name the file after the component it belongs to (`Panel.css` for `Panel.tsx`).
- Keep the file small and scoped — only the rules that cannot live in Tailwind or inline styles.
