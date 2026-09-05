# Chronova

Luxury watch storefront and admin, backed by a single REST API.

## Local development

You need **PostgreSQL** and **two terminals**.

### 0. Database

With Docker:

```bash
docker compose up -d
```

Or point `DATABASE_URL` in `backend/.env` at any Postgres instance. Default:

```text
postgresql://postgres:postgres@localhost:5432/chronova?schema=public
```

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

Customers register at `/register` or sign in with Google. Only users with `role === "admin"` can open `/admin`.

## Google Sign-In

Fake account pickers were removed. Chronova uses real Google Identity.

1. Create an OAuth 2.0 **Web** client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
2. Under **Authorized JavaScript origins**, add `http://localhost:3000`.
3. Copy the Client ID into both env files (same value):

```bash
# frontend/.env.local
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# backend/.env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

4. Restart frontend and backend.

Without those variables, the Google button shows a configuration message instead of Jane Doe / shopper mocks.

## Root scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Frontend only |
| `npm run dev:frontend` | Frontend |
| `npm run dev:backend` | Backend |
| `npm run db:setup` | Backend database + seed |

## Product images

All product photos live in **one folder** (not in the database):

```text
backend/uploads/products/{product-slug}/your-image.avif
```

- Admin uploads use the product **slug** as the folder name
- You can also drop files there manually, then paste the URL in admin:
  `/uploads/products/{slug}/filename.avif`
- The database only stores those URL strings
- Seed model folders (Rolex + Cartier) are committed so Render can serve them after deploy
- On Render, add a **persistent disk** mounted at `backend/uploads` if you want admin uploads to survive redeploys

Migrate older flat uploads / public images:

```bash
cd backend
npm run images:migrate
npm run db:seed
```

## Layout

- `backend/` — Express + Prisma (PostgreSQL)
- `backend/uploads/products/` — product image library (by model slug)
- `frontend/` — Next.js storefront and admin
