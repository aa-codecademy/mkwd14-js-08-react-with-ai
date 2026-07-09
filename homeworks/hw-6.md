# Homework 6 · Global State Management with Zustand (Optional)

> This homework is **optional**. It's a bonus for anyone who wants extra practice with Zustand — not required to keep up with the course.

## Context

**Saveur** has grown. The reservation data, loading states, and error handling are now scattered across multiple components using `useState`, `useEffect`, and prop drilling. The codebase is getting hard to reason about — changing one thing breaks something else.

You will migrate the application's state to a **Zustand store**. Components will read state directly from the store and call store actions instead of managing their own fetching logic.

---

## Setup

Install Zustand:

```bash
npm install zustand
```

---

## Requirements

### 1 — Create a reservation store

Create a single Zustand store that owns all reservation-related state:

| State field      | Type                        | Initial value |
| ---------------- | --------------------------- | ------------- |
| `reservations`   | `Reservation[]`             | `[]`          |
| `isLoading`      | `boolean`                   | `false`       |
| `error`          | `string \| null`            | `null`        |

The store must expose the following **actions**:

| Action                        | Description                                                  |
| ----------------------------- | ------------------------------------------------------------ |
| `fetchReservations()`         | `GET /reservations` — replaces the list with the API response |
| `addReservation(data)`        | `POST /reservations` — appends the new reservation to the list |
| `cancelReservation(id)`       | `DELETE /reservations/:id` — removes it from the list        |
| `updateReservation(id, data)` | `PATCH /reservations/:id` — replaces the matching item in the list |

Each action must:
- Set `isLoading` to `true` before the request and `false` after
- Set `error` to the message string on failure and `null` on success

### 2 — Replace local state in components

Remove all `useState` / `useEffect` patterns that were managing reservations. Every component that previously owned reservation state should now read from the store using `useReservationStore`.

After this step, no component should be fetching data or storing reservations locally — the store is the single source of truth.

### 3 — Derived state with selectors

Do **not** compute derived values inside components with inline logic. Instead, define selector functions alongside the store and use them with `useReservationStore`:

Define at least these three selectors:

```ts
// Total confirmed guests (sum of partySize where status === 'confirmed')
const totalConfirmedGuests = useReservationStore(selectTotalConfirmedGuests);

// Reservations grouped by status
const pendingReservations = useReservationStore(selectByStatus('pending'));

// Whether any request is in-flight
const isBusy = useReservationStore(selectIsLoading);
```

### 4 — Persist filter state in the store

Move the active status filter (All / Pending / Confirmed / Cancelled) from local component state into the store as well.

Add to the store:

| State field    | Type                                              | Initial value |
| -------------- | ------------------------------------------------- | ------------- |
| `statusFilter` | `'all' \| 'pending' \| 'confirmed' \| 'cancelled'` | `'all'`       |

And an action:

| Action               | Description                        |
| -------------------- | ---------------------------------- |
| `setStatusFilter(s)` | Updates the active filter          |

Add a selector `selectFilteredReservations` that returns the reservations list already filtered by `statusFilter`. The filter component should call `setStatusFilter` and the list component should use `selectFilteredReservations` — neither should know about the other.

---

## Bonus

### Zustand devtools

Enable the `devtools` middleware so you can inspect store state and action history in the Redux DevTools browser extension.

```ts
import { devtools } from 'zustand/middleware';

const useReservationStore = create(devtools(...));
```

Open the extension while using the app and confirm each action appears by name in the timeline.

### Optimistic updates

When cancelling a reservation, remove it from the list **immediately** (before the API responds). If the API call fails, add it back and show an error notification.

This means the UI feels instant even on a slow connection — but you must handle the rollback correctly.

### Persist the filter to localStorage

Use the `persist` middleware to save `statusFilter` to `localStorage`. When the page is refreshed, the previously selected filter is restored automatically.

```ts
import { persist } from 'zustand/middleware';
```

---

## Acceptance criteria

Before submitting, verify the following from a user's point of view:

- The reservation list loads from the store on mount — no `useEffect` fetching inside a component
- Creating, cancelling, and updating reservations all update the store and re-render correctly
- The loading indicator appears while any action is in-flight and disappears when it settles
- Selecting a filter updates the list immediately without triggering a new API request
- No reservation data lives in local component state — confirm by removing all `useState(reservations)` patterns
- Selectors are defined outside of components and reused — no inline `filter()` / `reduce()` inside JSX
