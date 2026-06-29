# Homework 3 · Reservations API Integration

## Context

**Saveur** is growing. The owner wants the reservation system backed by a real database so data persists across sessions and multiple staff members can use it simultaneously. You will connect your React application to a NestJS REST API backed by PostgreSQL.

A fully working backend is provided for you — your job is to get it running locally and wire your React front-end to it.

---

## Backend Setup

The backend lives in the `server/` folder alongside this file. It is shared across all homeworks, so you only need to set it up once.

### Prerequisites

Make sure you have the following installed before you start:

- [Node.js](https://nodejs.org/) v18 or later
- [npm](https://www.npmjs.com/) v9 or later
- [PostgreSQL](https://www.postgresql.org/) v14 or later (running locally)

---

### Step-by-step local setup

#### 1. Navigate to the server folder

```bash
cd server
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Create your environment file

Copy the example environment file and fill in your local values:

```bash
cp .env.example .env
```

Open `.env` and update the values to match your local PostgreSQL installation:

```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=saveur_db
```

> **Note:** Replace `your_password_here` with the password you set when installing PostgreSQL. If you used the default PostgreSQL installation on macOS via Homebrew, the username is typically `postgres` with no password — leave `DB_PASSWORD` empty in that case.

#### 4. Create the database

Open a terminal and connect to PostgreSQL:

```bash
psql -U postgres
```

Then create the database:

```sql
CREATE DATABASE saveur_db;
\q
```

#### 5. Run the application

```bash
npm run start:dev
```

The server starts on `http://localhost:3000`. TypeORM will automatically create the `reservations` table on first run.

#### 6. Verify it works

Open your browser and navigate to:

```
http://localhost:3000/docs
```

You should see the interactive **Swagger UI** documentation listing all available endpoints.

---

### Available API endpoints

| Method   | URL                 | Description                    |
| -------- | ------------------- | ------------------------------ |
| `GET`    | `/reservations`     | Fetch all reservations         |
| `POST`   | `/reservations`     | Create a new reservation       |
| `DELETE` | `/reservations/:id` | Cancel (delete) a reservation  |
| `PATCH`  | `/reservations/:id` | Update a reservation _(bonus)_ |

Full request/response schemas are documented in the Swagger UI at `http://localhost:3000/docs`.

---

## React Requirements

### 1 — Fetch reservations from the API

Replace your existing hard-coded reservation data (or local state) with data fetched from `GET /reservations`.

- Fetch the reservations when the component mounts using `useEffect`
- Show a loading indicator while the request is in-flight
- Show a user-friendly error message if the request fails
- Display the fetched reservations in the existing reservation list

### 2 — Create a reservation via the API

When the form from Homework 2 is submitted successfully, send a `POST /reservations` request with the form data instead of only updating local state.

- The new reservation should appear in the list after the API responds successfully
- If the API returns a validation error, show it on the relevant form field
- Keep the loading/disabled state on the submit button while the request is in-flight

**Request body shape:**

```json
{
	"guestName": "Jane Smith",
	"partySize": 4,
	"arrivalTime": "19:30",
	"tableNumber": 5,
	"notes": "Window seat preferred"
}
```

### 3 — Cancel a reservation via the API

Add a **Cancel** button to each reservation card. When clicked:

- Send a `DELETE /reservations/:id` request
- Remove the reservation from the list after the API responds successfully
- Show a confirmation prompt (a simple `window.confirm` is acceptable) before sending the request
- Handle errors gracefully — show a message if the deletion fails

---

## Bonus

### Update a reservation

Add an **Edit** button to each reservation card that opens a pre-filled form (modal or inline). When the form is submitted:

- Send a `PATCH /reservations/:id` request with only the changed fields
- Update the reservation in the list after the API responds successfully

**Partial request body example:**

```json
{
	"partySize": 6,
	"notes": "Anniversary dinner, please add a candle"
}
```

### Search, pagination, and sorting

The `GET /reservations` endpoint supports the following query parameters:

| Parameter   | Type     | Description                                                            |
| ----------- | -------- | ---------------------------------------------------------------------- |
| `search`    | `string` | Filter by guest name (partial, case-insensitive)                       |
| `status`    | `string` | Filter by status: `pending`, `confirmed`, or `cancelled`               |
| `sortBy`    | `string` | Field to sort by: `createdAt`, `arrivalTime`, `guestName`, `partySize` |
| `sortOrder` | `string` | `ASC` or `DESC`                                                        |
| `page`      | `number` | Page number, 1-based (default: `1`)                                    |
| `limit`     | `number` | Results per page (default: `10`)                                       |

The response shape changes when using pagination:

```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

Wire these up in the React UI:

- Add a **search input** above the reservation list that filters by guest name as the user types (debounce the input — wait 300 ms after the user stops typing before sending the request)
- Add **Previous / Next** buttons below the list for pagination; show the current page and total pages
- Add a **sort control** that lets staff choose the sort field and direction

---

## Acceptance criteria

Before submitting, verify the following from a user's point of view:

- The reservation list loads from the API on page load and shows real data
- A loading state is shown while any request is in-flight
- Creating a reservation via the form persists it — refreshing the page still shows it
- Cancelling a reservation removes it permanently — refreshing the page confirms it is gone
- All API errors are surfaced to the user with a readable message (not just a console log)
- The dashboard totals reflect the current state of the API data
