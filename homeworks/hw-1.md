# Homework 1 · Restaurant Reservation Management

## Context

**Saveur** is a small upscale bistro. The owner currently tracks all reservations on paper and wants a simple web tool to manage the evening's service. You are the only developer on the project.

For this version, no backend is needed — all data can live directly in the application. A future homework will extend this tool with the ability to create new reservations.

---

## Seed data

Use the following reservations as your starting data. You may add more entries.

| Guest          | Party | Time  | Table | Status    | Notes                 |
| -------------- | ----- | ----- | ----- | --------- | --------------------- |
| Elena Vasquez  | 4     | 18:30 | 7     | Confirmed |                       |
| Marcus Webb    | 2     | 19:00 | 3     | Pending   |                       |
| Yuki Tanaka    | 6     | 19:00 | 12    | Confirmed |                       |
| Nneka Obi      | 3     | 19:30 | 5     | Pending   |                       |
| Thomas Laurent | 2     | 20:00 | 1     | Cancelled | Requested window seat |
| Priya Mehta    | 5     | 20:00 | 9     | Confirmed |                       |
| Dmitri Volkov  | 2     | 20:30 | 2     | Pending   |                       |
| Amara Diallo   | 8     | 21:00 | 14    | Pending   | Birthday celebration  |

---

## Requirements

### Reservation list

The main view shows all reservations for the evening. Each reservation displays:

- Guest name
- Party size
- Arrival time
- Assigned table number
- Current status (Pending, Confirmed, or Cancelled)
- Notes, if any exist for that reservation

### Status management

A pending reservation can be **confirmed** or **cancelled** directly from the list. Once a reservation is confirmed or cancelled, it cannot be changed again — those actions are final.

### Filtering

Staff can narrow the list to show only reservations of a specific status: All, Pending, Confirmed, or Cancelled. The count for each status is visible alongside the filter option so staff can get a quick read of the evening at a glance.

### Dashboard

A second view shows a summary of the night's service:

- Total number of guests expected across all confirmed reservations
- Number of tables confirmed
- Number of reservations still pending action

Navigation between the reservation list and the dashboard does not reload the page.

---

## Bonus

These are optional. Attempt them if the core requirements feel solid.

**Guest search** — staff can type a guest name to filter the list in real time. Works together with the status filter, not instead of it.

**Empty state** — when the active filters return no reservations, show a message that makes it clear why the list is empty and what staff can do about it.

**Sort by time** — staff can toggle the list between earliest-first and latest-first order.

---

## Acceptance criteria

Before submitting, verify the following from a user's point of view:

- A staff member can tell at a glance which reservations still need confirmation
- Confirming or cancelling a reservation updates the list immediately, without a page reload
- The dashboard numbers are always in sync with the current state of the reservations
- Switching between the list and the dashboard does not lose any changes made to reservation statuses
