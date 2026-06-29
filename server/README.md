# PantryPal API

NestJS + PostgreSQL REST API for the PantryPal React course.

## Quick start

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env        # edit if your DB credentials differ

# 4. Start in watch mode
npm run start:dev
```

API runs at **http://localhost:3000**  
Swagger UI: **http://localhost:3000/api**

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /recipes | List all recipes |
| GET | /recipes/:id | Get single recipe |
| POST | /recipes | Create recipe |
| PATCH | /recipes/:id | Update recipe (partial) |
| DELETE | /recipes/:id | Delete recipe |
| POST | /recipes/seed | Seed sample data |

## Notes for trainers

- TypeORM with `synchronize: true` is enabled in development — the schema is
  auto-created on first start. Do **not** use `synchronize` in production.
- The `POST /recipes/seed` endpoint is for classroom use only; remove it before
  deploying to a real environment.
- CORS is open for `http://localhost:5173` (Vite default dev port).
