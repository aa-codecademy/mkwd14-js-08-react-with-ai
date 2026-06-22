---
applyTo: "**/pantry-pal/**"
---

# Pantry Pal — Project-Specific Instructions

## What Pantry Pal is

A pantry and ingredient management app built incrementally across all classes. Each class adds new features on top of the code from the previous class.

## Incremental development rules

- **Respect what is already built.** Do not suggest refactoring existing working code unless the current lesson is about refactoring.
- Only introduce patterns and hooks that are appropriate for the current class level.
- New features should extend the existing component tree — do not reorganize the folder structure unless asked.

## Comments

Keep comments **minimal**. The code should be clear enough to read without narration.

Add a comment only when:
- There is a non-obvious constraint or workaround.
- A subtle invariant would surprise a reader.
- A specific React behavior (e.g., async state) directly affects the logic.

Do **not** add:
- Explanatory comments that repeat what the code already says.
- Section banners or `✅`/`❌` markers (those belong in `examples/`).
- Docstrings or multi-line comment blocks.

## Component guidelines

- Follow all conventions from `react-components.instructions.md` and `typescript.instructions.md`.
- Style exclusively with Tailwind utility classes (see `styling.instructions.md`).
- New components go in a `components/` subfolder when one exists, otherwise alongside `App.tsx`.

## Features built so far (update as the project grows)

_Add a bullet here whenever a new feature is completed in class, so Copilot understands the current state of the app._

- Class 01: Project scaffold, basic component structure, props, state, event handling.
