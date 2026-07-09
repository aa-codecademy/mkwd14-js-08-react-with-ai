# Homework 5 · Routing with React Router

## Context

Right now **Saveur** renders every screen (reservation list, new reservation form, etc.) by toggling state in a single page — there's no real URL for anything. You will introduce **React Router** so the app has actual multi-page navigation: a home page, a "new reservation" page, and a shared layout with a navbar.

---

## Setup

Install React Router:

```bash
npm install react-router-dom
```

Wrap your app in `<BrowserRouter>` inside `main.tsx`.

---

## Requirements

### 1 — App layout

Create an `AppLayout` component with a `<Navbar>` at the top and an `<Outlet />` below it for the page content. Use this layout as the parent route for every page in the app.

### 2 — Routes

Set up the following routes:

| Path              | Component            | Notes                                  |
| ----------------- | --------------------- | --------------------------------------- |
| `/`                | `ReservationsPage`    | Index route — the current reservation list |
| `/reservations/new`| `NewReservationPage`  | The "create reservation" form            |
| `*`                | `NotFoundPage`        | Catch-all for unmatched URLs             |

### 3 — Navigation

- In the navbar, use `<NavLink>` (not `<a>`) to link to `/` and `/reservations/new`, and style the active link differently.
- After successfully submitting the new reservation form, use `useNavigate()` to redirect back to `/`.
- On `NotFoundPage`, add a `<Link to="/">` back to the reservation list.

### 4 — Dynamic route for reservation details

Add a route `/reservations/:id` that renders a `ReservationDetailsPage`. Use `useParams()` to read the `id` and show that single reservation's details. Each reservation in the list should link to its own details page.

---

## Acceptance criteria

- Navigating between pages never triggers a full page reload (check the URL bar updates without a flash).
- The active nav link is visually highlighted.
- Visiting a nonexistent URL shows the not-found page with a working link back home.
- Visiting `/reservations/:id` directly (e.g. pasting the URL) shows the correct reservation.
