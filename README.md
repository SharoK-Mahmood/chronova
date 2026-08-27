# Chronova

Luxury watch storefront and admin, backed by a single REST API.

## Local development

You need **two terminals**.

### 1. Backend (port 3001)

```bash
cd backend
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

### 2. Frontend (port 3000)

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin is at [http://localhost:3000/admin](http://localhost:3000/admin).

## Seed admin

| | |
|---|---|
| Email | `admin@chronova.local` |
| Password | `ChronovaAdmin123!` |

Customers register at `/register`. Only users with `role === "admin"` can open `/admin`.

## Root scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Frontend only |
| `npm run dev:frontend` | Frontend |
| `npm run dev:backend` | Backend |
| `npm run db:setup` | Backend database + seed |

## Layout

- `backend/` — Express + Prisma (SQLite locally)
- `frontend/` — Next.js storefront and admin
