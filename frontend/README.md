# Chronova Frontend

E-commerce storefront for **Chronova**, built with Next.js, TypeScript, and Tailwind CSS using a **feature-based** architecture.

## Stack

- **Next.js 16** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS v4**

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript compiler |

## Project structure

```
src/
├── app/                  # Next.js routes (thin — compose features here)
│   ├── page.tsx          # Home
│   ├── products/         # Catalog & product detail
│   └── cart/
├── features/             # Domain features (self-contained modules)
│   ├── home/
│   ├── products/
│   ├── cart/
│   ├── auth/
│   └── checkout/
├── shared/               # Cross-feature code
│   ├── components/       # Layout shell & UI primitives
│   ├── constants/
│   ├── lib/              # API client, utilities
│   └── types/
└── config/               # App configuration (env, etc.)
```

### Feature module convention

Each feature lives under `src/features/<name>/` and may contain:

- `components/` — UI scoped to the feature
- `types/` — Feature-specific TypeScript types
- `hooks/` — Client-side logic (add as needed)
- `services/` — API calls (add as needed)
- `index.ts` — Public exports for the feature

Import from a feature's barrel file (e.g. `@/features/products`) rather than reaching into internal paths from routes or other features.

### Shared layer

Code used by two or more features belongs in `src/shared/`. Keep features independent — shared code should be generic, not feature-specific.

## Environment variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3001/api` |

Copy `.env.example` to `.env.local` and adjust values for your environment.
