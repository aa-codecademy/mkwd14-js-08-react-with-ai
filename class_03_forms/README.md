# Class 03 — Forms, Validation & react-hook-form

Welcome to Class 03! This class is all about forms in React — one of the most common and tricky things you'll build as a frontend developer. We start with a hand-rolled controlled form, understand why managing lots of form state manually gets painful, and then solve it elegantly with **react-hook-form**. By the end you'll know how to build real-world forms with validation, dynamic field lists, and live previews.

---

## Table of Contents

1. [Controlled vs Uncontrolled Forms](#1-controlled-vs-uncontrolled-forms)
2. [The Problem with Manual Form State](#2-the-problem-with-manual-form-state)
3. [Core Concepts](#3-core-concepts)
   - [useForm](#useform)
   - [register](#register)
   - [handleSubmit](#handlesubmit)
   - [formState — errors & isSubmitting](#formstate--errors--issubmitting)
   - [watch](#watch)
   - [reset](#reset)
   - [useFieldArray](#usefieldarray)
   - [Validation Rules](#validation-rules)
4. [Form UX Patterns](#4-form-ux-patterns)
   - [Touched / Dirty](#touched--dirty)
   - [Live Previews](#live-previews)
   - [Dynamic Field Lists](#dynamic-field-lists)
5. [Theory](#5-theory)
6. [Project Structure](#6-project-structure)
7. [Useful Links](#7-useful-links)
8. [Mini Examples](#8-mini-examples)
9. [Practice Exercises](#9-practice-exercises)

---

## 1. Controlled vs Uncontrolled Forms

In React, an input can be **controlled** or **uncontrolled**.

| | Controlled | Uncontrolled |
|---|---|---|
| Who owns the value? | React state | The DOM |
| How do you read it? | From state | Via a `ref` |
| When to use it? | Almost always | File inputs, 3rd-party libs |

A **controlled input** has both `value` and `onChange` wired to React state:

```tsx
const [name, setName] = useState('');

<input
  value={name}                          // React drives the display value
  onChange={e => setName(e.target.value)} // keep state in sync as the user types
/>
```

If you only set `value` without `onChange`, React will warn you ("You provided a `value` prop without an `onChange` handler"). That warning exists because the input would appear frozen — you can type but nothing changes.

> **Note:** The naming is slightly confusing. The `examples/` folder calls its form "Uncontrolled" in the heading, but the inputs are actually controlled (they have `value` + `onChange`). "Uncontrolled" in that context refers to the form *management approach* — no form library — not to the input type.

---

## 2. The Problem with Manual Form State

Imagine a form with 8 fields, each needing:
- A state value
- A state setter
- An error message
- A "has the user visited this field?" flag (touched)
- A "has the user changed the value?" flag (dirty)

That's 40 pieces of state — before you even write validation logic. Maintaining all of that is fragile and repetitive. **react-hook-form** solves this by managing all of it internally, exposing a clean API.

---

## 3. Core Concepts

### useForm

`useForm` is the entry point to react-hook-form. Call it at the top of your component and destructure what you need:

```tsx
const {
  register,
  handleSubmit,
  reset,
  control,
  watch,
  formState: { errors, isSubmitting },
} = useForm<FormValues>({
  defaultValues: DEFAULT_VALUES,
});
```

- `FormValues` is a TypeScript type that describes the shape of your form data.
- `defaultValues` initialises each field — without it, fields start as `undefined` and you get "uncontrolled → controlled" warnings.

---

### register

`register` connects a native HTML input to react-hook-form. You spread its return value onto the input:

```tsx
<input {...register('title', { required: 'Title is required' })} />
```

Under the hood, `register('title')` returns `{ name, ref, onChange, onBlur }`. By spreading it, you hand those handlers to the input without any extra code. The second argument is the **validation rules** for that field.

> **Gotcha:** Never manually add `value` or `onChange` to an input that's already registered. react-hook-form manages those internally using an uncontrolled approach (ref-based), even though the API looks controlled.

---

### handleSubmit

`handleSubmit` wraps your submit handler. You never call `onSubmit` directly:

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
```

react-hook-form calls `onSubmit(data)` only if **all** validation rules pass. If any field is invalid, it populates `errors` and prevents submission — without you writing a single `if` statement.

Your `onSubmit` function receives a fully typed `data` object:

```tsx
const onSubmit = (data: FormValues) => {
  console.log(data); // all fields, validated and typed
};
```

---

### formState — errors & isSubmitting

`errors` is a nested object. If the `title` field fails validation, `errors.title.message` contains the error string you provided in `register`:

```tsx
{errors.title && <p>{errors.title.message}</p>}
```

`isSubmitting` is `true` while your async `onSubmit` is running. Use it to disable the submit button and prevent double-clicks:

```tsx
<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save'}
</button>
```

---

### watch

`watch` subscribes your component to a field's live value — it causes a re-render every time that field changes:

```tsx
const imageUrl = watch('imageUrl');
// imageUrl always reflects what the user is currently typing
```

Use it sparingly — for things that *need* to drive the UI (like a live preview). Watching every field would cause unnecessary re-renders.

---

### reset

`reset` clears the form back to its default values. Call it after a successful submission:

```tsx
reset(DEFAULT_VALUES);
```

You can also call `reset()` with no arguments to go back to the `defaultValues` you passed to `useForm`.

---

### useFieldArray

`useFieldArray` manages a **dynamic list** of fields (ingredients, steps, etc.):

```tsx
const { fields, append, remove } = useFieldArray({
  control,        // must come from the same useForm instance
  name: 'steps',  // the field array key in your FormValues type
});
```

- `fields` — the current array (each item has a stable `id` from react-hook-form — use it as the `key`)
- `append(value)` — adds a new item to the end
- `remove(index)` — removes the item at that index

> **Important:** Use `field.id` as the list `key`, not the array index. When you remove item 2 from a 5-item list, the indices shift — this causes React to misidentify which DOM nodes to reuse, breaking focus and animation.

---

### Validation Rules

The second argument to `register` is a rules object:

```tsx
register('prepMinutes', {
  required: 'This field is required',
  min: { value: 1, message: 'Must be at least 1' },
  max: { value: 999, message: 'Unreasonably large' },
  valueAsNumber: true,        // cast string input to a JS number
  validate: (value) =>
    isValidUrl(value) || 'Must be a valid URL',  // custom rule
})
```

Common rules:

| Rule | Type | Notes |
|---|---|---|
| `required` | `string` (error message) | Field cannot be empty |
| `min` / `max` | `{ value, message }` | Numeric or date bounds |
| `minLength` / `maxLength` | `{ value, message }` | String length bounds |
| `pattern` | `{ value: RegExp, message }` | Regex match |
| `validate` | `(value) => true \| string` | Custom function |
| `valueAsNumber` | `boolean` | Auto-cast to number |

---

## 4. Form UX Patterns

### Touched / Dirty

- **Touched**: the user has visited (focused then blurred) a field. Show errors only on touched fields so you don't immediately yell at the user before they've typed anything.
- **Dirty**: the user has changed a field's value from its initial value. Useful for "unsaved changes" warnings.

react-hook-form tracks both in `formState.touchedFields` and `formState.dirtyFields`.

---

### Live Previews

Use `watch` to show live feedback as the user types:

```tsx
const imageUrl = watch('imageUrl');
const isUrlValid = !errors.imageUrl && imageUrl.trim();

{isUrlValid && <img src={imageUrl} alt="Preview" />}
```

---

### Dynamic Field Lists

The "add / remove" pattern for dynamic fields:

```tsx
// Adding a new empty row
<button type="button" onClick={() => append({ name: '', amount: '' })}>
  + Add ingredient
</button>

// Removing a specific row
<button type="button" onClick={() => remove(index)}>
  Remove
</button>
```

Always use `type="button"` on these buttons. A button inside a form defaults to `type="submit"` — forgetting this causes the entire form to submit when you try to add a row.

---

## 5. Theory

### Why react-hook-form uses refs internally

Most form libraries (like Formik) are "controlled" — every keystroke triggers a state update, which triggers a re-render. For a 20-field form, that's 20 re-renders per second of typing.

react-hook-form is different: it uses **uncontrolled inputs with refs**. The DOM owns each input value. react-hook-form reads the values via refs only when needed (on submit, or when you explicitly call `watch`). This makes it significantly faster for large forms.

The tradeoff: `watch` re-subscribes you to a field the "controlled" way — you get re-renders for that specific field, but everything else stays fast.

### e.preventDefault() — why it matters

A native form submit causes a **full page reload** (the browser sends a GET or POST request to the URL in the form's `action` attribute). Calling `e.preventDefault()` intercepts this before the browser acts, giving you control over what happens next. react-hook-form's `handleSubmit` calls `e.preventDefault()` for you automatically.

### crypto.randomUUID()

`crypto.randomUUID()` generates a **UUID v4** — a 128-bit random identifier, practically guaranteed to be unique. It's built into modern browsers (no library needed). This is better than using an incrementing counter because:
- Counters reset when the page reloads
- Counters from different clients can clash if you later add a backend
- UUIDs are compatible with database IDs (which are often strings)

---

## 6. Project Structure

```text
class_03/
├── examples/               # Hands-on form: manual controlled inputs + validation
│   └── src/
│       └── App.tsx         # Single-file form showing touched, dirty, conditional rendering
│
└── pantry-pal/             # Full recipe app with react-hook-form
    └── src/
        ├── App.tsx          # Root — renders Header, RecipeForm, and the recipe grid
        ├── main.tsx         # Entry point (StrictMode toggled off for debugging)
        ├── components/
        │   ├── Header.tsx   # Static page header
        │   ├── Recipe.tsx   # Recipe card (article + TagList)
        │   ├── RecipeForm.tsx  # The main form — useForm + useFieldArray
        │   └── TagList.tsx  # Renders tag pills from recipe.tags[]
        ├── data/
        │   └── seedData.ts  # Static array of 12 sample recipes
        └── types/
            └── recipe.ts    # Shared Recipe and Ingredient types
```

---

## 7. Useful Links

| Topic | Link |
|---|---|
| react-hook-form docs | https://react-hook-form.com/docs |
| `useForm` API | https://react-hook-form.com/docs/useform |
| `useFieldArray` API | https://react-hook-form.com/docs/usefieldarray |
| Validation rules reference | https://react-hook-form.com/docs/useform/register |
| MDN — HTMLFormElement: submit event | https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/submit_event |
| MDN — crypto.randomUUID() | https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID |
| Tailwind CSS docs | https://tailwindcss.com/docs |
| TypeScript — utility types | https://www.typescriptlang.org/docs/handbook/utility-types.html |

---

## 8. Mini Examples

### Example 1 — Simple login form with react-hook-form

```tsx
import { useForm } from 'react-hook-form';

type LoginForm = { email: string; password: string };

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = (data: LoginForm) => {
    console.log('Login:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('email', {
          required: 'Email is required',
          pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
        })}
        placeholder="Email"
      />
      {errors.email && <p>{errors.email.message}</p>}

      <input
        type="password"
        {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' } })}
        placeholder="Password"
      />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Log in</button>
    </form>
  );
}
```

---

### Example 2 — Controlled form with touched state (manual approach)

```tsx
import { useState, type FormEvent } from 'react';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);

  const emailError = !email.includes('@') ? 'Enter a valid email' : '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true); // force all errors to show on submit attempt
    if (emailError) return;
    alert('Signed up!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
        placeholder="Email"
      />
      {/* only show error after the user has interacted with the field */}
      {touched && emailError && <p style={{ color: 'red' }}>{emailError}</p>}
      <button type="submit">Sign up</button>
    </form>
  );
}
```

---

### Example 3 — Dynamic list with useFieldArray

```tsx
import { useForm, useFieldArray } from 'react-hook-form';

type TodoForm = { todos: { text: string }[] };

function TodoForm() {
  const { register, handleSubmit, control } = useForm<TodoForm>({
    defaultValues: { todos: [{ text: '' }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'todos' });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`todos.${index}.text`)} placeholder={`Todo ${index + 1}`} />
          {fields.length > 1 && (
            <button type="button" onClick={() => remove(index)}>Remove</button>
          )}
        </div>
      ))}
      <button type="button" onClick={() => append({ text: '' })}>+ Add todo</button>
      <button type="submit">Save</button>
    </form>
  );
}
```

---

### Example 4 — Live character count with watch

```tsx
import { useForm } from 'react-hook-form';

type BioForm = { bio: string };
const MAX_LENGTH = 160;

function BioForm() {
  const { register, watch, handleSubmit } = useForm<BioForm>({
    defaultValues: { bio: '' },
  });

  const bio = watch('bio');
  const remaining = MAX_LENGTH - bio.length;

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <textarea
        {...register('bio', { maxLength: { value: MAX_LENGTH, message: 'Too long' } })}
        rows={4}
        placeholder="Tell us about yourself..."
      />
      {/* Live counter — updates on every keystroke because watch() re-renders the component */}
      <p style={{ color: remaining < 20 ? 'red' : 'gray' }}>
        {remaining} characters remaining
      </p>
      <button type="submit">Save bio</button>
    </form>
  );
}
```

---

## 9. Practice Exercises

### Beginner

1. **Add a "website" field** to the `examples/` form. It should only appear if the user has typed a first name. Use conditional rendering (`&&`).

2. **Show a character count** below the Description textarea in `RecipeForm.tsx`. Use `watch('description')` to get the current value and display `{value.length} / 200 characters`.

3. **Make tags required** in `RecipeForm.tsx`. Add a `required` rule to the `tags` field and display the error message.

### Intermediate

4. **Validate min/max servings** so the form rejects values less than 1 or greater than 50. Display appropriate error messages.

5. **Add a "Cuisine" dropdown** (`<select>`) to `RecipeForm.tsx` with options like Italian, Asian, Mexican, Other. Register it with react-hook-form and include it in the `onSubmit` recipe object.

6. **Show a "form is dirty" banner** at the top of `RecipeForm.tsx` when any field has been changed from its default value. Use `formState.isDirty`.

### Challenge

7. **Add cross-field validation**: the form should reject submission if the title appears anywhere in the description (e.g. a recipe called "Pasta" with a description containing "Pasta" is invalid). Use a custom `validate` function on the `description` field and access the sibling field via `getValues('title')` (available from `useForm`).

8. **Build a multi-step form**: split `RecipeForm.tsx` into two steps — Step 1: basic info (title, description, image, prep, servings, tags). Step 2: ingredients and steps. Use a `currentStep` state variable to toggle between them. The "Next" button on Step 1 should validate only the Step 1 fields using `trigger(['title', 'description', 'imageUrl', 'prepMinutes', 'servings'])` from `useForm`.

---

> **Keep going!** Forms are everywhere — login pages, checkout flows, settings panels, search filters. Every pattern you learned here (validation rules, dynamic lists, touched state, live preview) transfers directly to real projects. The more forms you build, the more natural this feels. See you in Class 04!
