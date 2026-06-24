# Annotate Class

You are helping annotate a React course class for students.

When invoked, do the following two things in order:

---

## Step 1 — Add educational comments to source files

Scan all `.tsx`, `.ts`, `.jsx`, `.js`, and `.css` files inside the relevant `class_<N>/` folder (or the folder the user specifies / the one currently being worked on).

For each file, add inline comments that:

- **Explain the "why"** behind patterns (not just what the code does — students can read that; tell them *why* it is written that way).
- **Call out React/JS concepts** by name (e.g. "// This is a controlled component — the input value is always driven by state, never the DOM").
- **Highlight gotchas and common mistakes** (e.g. "// Do NOT call this function directly here — pass the reference without () or it fires on every render").
- **Use plain language** a junior developer or student would understand — no jargon without a short explanation.
- **Are concise** — one or two lines per comment, placed immediately above or beside the relevant code. No paragraph-length comment blocks.
- **Are useful across class topics**: Components, JSX, Props, State, Event handling, Hooks, Conditional rendering, Lists & keys, Styling, etc.

Do NOT add comments that merely restate what the code already says. Only add comments where a student would genuinely benefit from the explanation.

---

## Step 2 — Update the README in the class folder

Update (or create) the `README.md` in `class_<N>/` with the following structure. Keep the style consistent with the existing `class_01/README.md` — clear headers, code blocks for examples, tables where appropriate, friendly tone.

### Required sections:

1. **Class N — [Topic Name]** — H1 title and a one-paragraph welcome/overview.
2. **Table of Contents** — links to every section below.
3. **Core Concepts covered in this class** — for each concept:
   - A plain-English explanation (2–4 sentences)
   - The mental model / "why does this exist"
   - A minimal code example showing the concept in isolation
4. **Theory** — deeper background that helps students understand the "bigger picture" (e.g. how the Virtual DOM works, what reconciliation is, what the event loop means for async setState).
5. **Useful Links** — a table with:
   - Official React / MDN / Vite docs for each concept covered
   - Any tools used in class (Tailwind docs, TypeScript handbook sections, etc.)
6. **Mini Examples** — 2–4 short, self-contained code snippets (10–20 lines each) that show the class topic in a different context than the in-class code, so students have extra reference material.
7. **Practice Exercises** — 3–5 exercises at beginner / intermediate / challenge levels, tied directly to what was taught.

### Tone and style rules:
- Write in second person ("you") — direct, encouraging, conversational.
- Avoid passive voice.
- Every code block must have a language tag (` ```tsx `, ` ```bash `, etc.).
- Callout blocks (` > **Note:** `) for important caveats.
- Keep it thorough but scannable — students should be able to jump to any section independently.

---

## How to identify the target class folder

1. If the user passes an argument (e.g. `/annotate-class class_02`), use that folder.
2. Otherwise, look at which files were recently edited or are open, and infer the class number from the folder path.
3. If still ambiguous, ask the user: "Which class folder should I annotate? (e.g. class_02)"

Do both steps before reporting back. When finished, give a one-sentence summary: which files were annotated and that the README was updated.
