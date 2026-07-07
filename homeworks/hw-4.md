# Homework 4 · Global Notification System with Context

## Context

**Saveur** staff are now creating, cancelling, and updating reservations through a live API. The problem: when something goes wrong (a network error, a duplicate booking, a failed delete), nothing tells the user. And when something succeeds, there is no feedback either.

You will build a **global notification system** — a toast/snackbar mechanism driven entirely by React Context. Any component in the tree will be able to fire a notification without knowing anything about the UI that displays it.

---

## What you will build

A `NotificationContext` that holds a list of active notifications and exposes an API for adding and dismissing them. A `NotificationProvider` wraps the application and renders the notifications in a fixed overlay. A `useNotifications` custom hook gives any component access to that API in one line.

---

## Requirements

### 1 — `NotificationContext` and `NotificationProvider`

Create a context that stores a list of notifications. Each notification has:

| Field      | Type                                  | Description                          |
| ---------- | ------------------------------------- | ------------------------------------ |
| `id`       | `string`                              | Unique identifier (use `crypto.randomUUID()`) |
| `message`  | `string`                              | The text shown to the user           |
| `type`     | `'success' \| 'error' \| 'info'`     | Controls the visual style            |

The context must expose two functions:

- `notify(message, type)` — adds a new notification
- `dismiss(id)` — removes a notification by its ID

Use `useReducer` (not `useState`) to manage the notifications list inside the provider.

Wrap your entire application in `NotificationProvider` inside `main.tsx` (or `App.tsx`).

### 2 — `useNotifications` custom hook

Create a `useNotifications` hook that reads from `NotificationContext`. It should throw a clear error if used outside of a `NotificationProvider`.

Usage in any component should look exactly like this:

```tsx
const { notify, dismiss } = useNotifications();

notify('Reservation created successfully', 'success');
notify('Failed to delete reservation', 'error');
```

### 3 — Notification display

Render all active notifications in a fixed overlay (e.g. bottom-right corner of the screen). Each notification must show:

- The message text
- A visual indicator of the type (different background colour, border, or icon for success / error / info)
- A close button that calls `dismiss(id)` when clicked

### 4 — Wire it into existing API calls

Update the API calls from Homework 3 to use `notify`:

| Action                    | Notification                                       | Type      |
| ------------------------- | -------------------------------------------------- | --------- |
| Reservation created       | `"Reservation for [guestName] has been created."`  | `success` |
| Reservation cancelled     | `"Reservation has been cancelled."`                | `success` |
| Reservation updated       | `"Reservation updated successfully."`              | `success` |
| Any API call fails        | The error message from the API response            | `error`   |

---

## Bonus

### Auto-dismiss

Notifications automatically disappear after 4 seconds. The timer resets if a new notification with the same ID is somehow re-added (this won't happen in normal usage but is a good edge-case to handle).

Use `useEffect` inside the provider (or per-notification component) to set and clear the timer. Make sure to clear the timer on component unmount.

### Notification limit

If more than 5 notifications are active at once, the oldest one is automatically removed to make room. Implement this inside the reducer.

### Pause on hover

When the user hovers over the notification stack, auto-dismiss timers pause. When they move away, timers resume. This is a non-trivial UI interaction — think carefully about where the pause state lives.

---

## Acceptance criteria

Before submitting, verify the following from a user's point of view:

- Creating a reservation shows a green success notification in the overlay
- A failed API request (e.g. turn off the server and try to create) shows a red error notification
- Clicking the close button on a notification removes only that notification — others stay
- If you trigger multiple actions quickly, each has its own notification displayed at the same time
- The notification overlay does not interfere with clicking or scrolling the rest of the page
- `useNotifications()` called outside of `NotificationProvider` throws an error with a helpful message
