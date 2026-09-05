# Chronova API

Express + TypeScript backend for Chronova. Products and orders are stored in PostgreSQL via Prisma. Auth uses JWT with `customer` and `admin` roles.

## Setup

Start Postgres (from the repo root), then set up the API:

```bash
docker compose up -d
cd backend
cp .env.example .env
npm install
npm run db:setup
npm run dev
```

The API listens on [http://localhost:3001](http://localhost:3001).

`db:setup` generates the Prisma client, pushes the schema to Postgres, and seeds:

- Catalog products (same shape as the original storefront catalog)
- Admin user (see credentials below)

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start API with reload |
| `npm run db:setup` | Generate client, push schema, seed |
| `npm run db:seed` | Re-run seed (upserts admin + products) |
| `npm run typecheck` | TypeScript check |

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | API port (Render sets this automatically) |
| `DATABASE_URL` | `postgresql://postgres:postgres@localhost:5432/chronova?schema=public` | Postgres connection string |
| `JWT_SECRET` | `change-me-in-production` | Access token secret |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed frontend origin(s), comma-separated (set to your Vercel URL in production) |
| `ADMIN_EMAIL` | `admin@chronova.local` | Seed admin email |
| `ADMIN_PASSWORD` | `ChronovaAdmin123!` | Seed admin password |
| `GOOGLE_CLIENT_ID` | _(empty)_ | Same Google OAuth Web Client ID as the frontend |

## Deploy (Render)

1. Create a Render **PostgreSQL** instance and copy its internal `DATABASE_URL`.
2. Create a **Web Service** from this `backend/` folder (or monorepo root with root dir `backend`).
3. Build: `npm install && npx prisma generate && npx prisma db push && npm run build`
4. Start: `npm run db:seed && npm start` (or seed once via a one-off job, then `npm start`)
5. Set env: `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN=https://your-app.vercel.app`, `GOOGLE_CLIENT_ID`
6. Optional: attach a persistent disk at `/opt/render/project/src/uploads` (or your app’s uploads path) so admin image uploads survive redeploys. Seeded Rolex/Cartier images are in git and ship with the build.

## Seed admin

- **Email:** `admin@chronova.local`
- **Password:** `ChronovaAdmin123!`

Register a customer from the storefront, or log in as admin and open `/admin`.

Google Sign-In: set `GOOGLE_CLIENT_ID` (and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` on the frontend). See the root README.

## Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google` — body `{ "credential": "<Google ID token>" }`
- `GET /api/auth/me` (Bearer token)

### Products

- `GET /api/products` (public; `?category=` `?brand=`)
- `GET /api/products/:idOrSlug` (public)
- `POST /api/products` (admin)
- `PATCH /api/products/:id` (admin)
- `DELETE /api/products/:id` (admin)

### Orders

- `POST /api/orders` (authenticated)
- `GET /api/orders` (admin: all; customer: own)
- `GET /api/orders/:orderNumber`
- `PATCH /api/orders/:orderNumber/status` (admin) — `confirmed` \| `processing` \| `shipped` \| `delivered`

### Admin

- `GET /api/admin/overview` (admin) — product/order counts
