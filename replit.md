# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Auth**: Session-based (express-session + bcryptjs)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── fairview/           # Fairview Realty website (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Fairview Realty Website

A 10-page Nigerian real estate website for Fairview Realty, serving property owners and buyers/renters.

### Pages

1. **Landing** (`/`) - Hero with Nigerian cityscape, CTA buttons, How It Works, Testimonials carousel, About Us with CAC image
2. **Property Owners** (`/property-owners`) - Listing steps, WhatsApp pop-up form
3. **Buyers/Renters** (`/buyers-renters`) - Steps guide, category navigation cards
4. **Lands for Sale** (`/lands-for-sale`) - Search + 3 property cards with video, gallery, comments, WhatsApp CTAs
5. **Properties for Sale** (`/properties-for-sale`) - Same layout as Lands
6. **Apartments for Rent** (`/apartments-for-rent`) - 1 property card + tenant reviews
7. **Shops for Lease** (`/shops-for-lease`) - 1 property card + tenant reviews
8. **FAQs** (`/faqs`) - Accordion FAQs for owners, buyers, general
9. **About Fairview** (`/about`) - Story, Why Fairview, Contact + Google Maps (Ile-Ife)
10. **Login/Register** (`/login`) - Auth toggle, session-based

### Key Features

- WhatsApp integration for inspection bookings (pre-filled messages)
- WhatsApp-linked property listing form (Property Owners)
- Session-based auth (username + password)
- Database-backed comments (requires login)
- Property search by keyword/location/price
- Testimonials carousel
- CAC registration image
- Google Maps embed (Parakin, Ile-Ife, Osun)

### WhatsApp Number
wa.me/2348000000000 (placeholder - update as needed)

### Database Tables
- `users` - id, username, password_hash, created_at
- `comments` - id, property_id, user_id, text, created_at

### API Endpoints
- `GET /api/healthz`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/comments/:propertyId`
- `POST /api/comments/:propertyId`

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Key Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes: health, auth, comments.

### `artifacts/fairview` (`@workspace/fairview`)

React + Vite web app. Uses wouter for routing, TanStack React Query for data fetching, Framer Motion for animations, Embla Carousel for testimonials, Shadcn UI components.
