---
applyTo: "**/*.ts, **/*.tsx"
---

# TypeScript Conventions

## Imports

- **Never import the whole React namespace.** Always destructure exactly what is needed.
- Use `import type` for type-only imports to keep runtime bundles clean.

```tsx
// ✅ correct — import only what you use
import { useState, useEffect } from 'react';
import type { ReactNode, ChangeEvent } from 'react';

// ❌ avoid — pollutes scope, obscures dependencies
import React from 'react';
import * as React from 'react';
```

- The same rule applies to any other library: destructure named exports, never import the whole module default just to access properties off it.

## Prop types

- Use `type` (not `interface`) for all prop shapes.
- Name prop types `<ComponentName>Props`.
- Define prop types explicitly — do not rely on inference alone.

```tsx
// ✅ correct
type UserCardProps = {
  name: string;
  age: number;
  isMarried: boolean;
};

// ❌ avoid
interface UserCardProps {
  name: string;
}
```

## Event types

- Never use `any` for event handler types when a more specific type is available.

```tsx
// ✅ correct — ChangeEvent destructured from 'react'
import type { ChangeEvent } from 'react';

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  setValue(e.target.value);
};

// ❌ avoid — React namespace prefix
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... };

// ❌ avoid — any
const handleChange = (e: any) => { ... };
```

## General rules

- Prefer explicit types over inference for function parameters and return values.
- Keep types co-located with the component they describe (top of the same file).
- Use `ReactNode` for children, not `JSX.Element` or `React.ReactElement`.
