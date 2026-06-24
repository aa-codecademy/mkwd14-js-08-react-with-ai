****# Homework 2 · New Reservation Form

## Context

**Saveur** is expanding its evening service and the owner now wants staff to create new reservations directly in the tool — no more phone notes passed to the kitchen. You will extend the application from Homework 1 with a reservation form.
****
You must use **`useForm`** from [React Hook Form](https://react-hook-form.com/) to manage the form state and validation.

---

## Requirements

### New reservation form

Add a form that lets staff book a new reservation. The form collects:

| Field        | Type                                      | Required |
| ------------ | ----------------------------------------- | -------- |
| Guest name   | Text input                                | Yes      |
| Party size   | Number input (min 1, max 20)              | Yes      |
| Arrival time | Text input — 24-hour format `HH:MM`       | Yes      |
| Table number | Number input (min 1, max 20)              | Yes      |
| Notes        | Textarea                                  | No       |

Every new reservation starts with a status of **Pending**.

### Validation

Use `useForm`'s built-in validation to enforce the following rules. Error messages must appear beneath the relevant field — not as an alert or console log.

- **Guest name** — required; at least 2 characters
- **Party size** — required; between 1 and 20
- **Arrival time** — required; must match `HH:MM` (e.g. `19:30`)
- **Table number** — required; between 1 and 20; the same table number cannot be booked twice for the evening

### After submission

When the form is submitted successfully:

- The new reservation appears in the list immediately, without a page reload
- The form resets to empty so staff can book the next guest right away
- The dashboard totals update to reflect the new reservation

---

## Bonus

These are optional. Attempt them if the core requirements feel solid.

**Duplicate time warning** — if the chosen table already has a reservation at the same time, show a warning message on the table number field before the form can be submitted.

**Optimistic party size label** — display a live preview of the party size as a human-friendly label while the user types (e.g. `"Table for 4"`). Update it on every keystroke using `watch` from React Hook Form.

**Disable the submit button** — keep the submit button disabled until the form is valid. Use `formState.isValid` to drive this.

---

## Acceptance criteria

Before submitting, verify the following from a user's point of view:

- Submitting the form with any required field empty shows a clear error message under that field
- Submitting with a party size outside 1–20 shows an error on that field
- Submitting with a table number already in use shows an error on the table number field
- A valid submission adds the reservation to the list and resets the form
- The dashboard guest count and pending count are correct after adding a new reservation
