# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 19 + Vite + Tailwind CSS + Shadcn UI
- **Routing**: Wouter
- **Backend (unused)**: Express 5 (API server exists but frontend does not call it)
- **Database / Auth / Storage**: Supabase (all live data)

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server (not used by frontend)
│   └── fairview/           # Fairview Realty website (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/
│   ├── api-client-react/
│   ├── api-zod/
│   └── db/
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── package.json
```

## Fairview Realty Website

Nigerian real estate web app for the Ile-Ife region. Deployed on Netlify (frontend). All data is managed via Supabase.

### Architecture

- **Frontend** → Netlify (`ifeproperties.space`)
- **Auth** → Supabase Auth (`supabase.auth.signInWithPassword`, `signUp`)
- **Properties** → Supabase `properties` table
- **Comments** → Supabase `comments` table + `profiles` table
- **Image storage** → Supabase Storage (`property-images` bucket, Public)
- **Admin panel** → `/admin-panel` (React, writes directly to Supabase)
- **Decap CMS** → Fully removed

### Data Flow

All property data is loaded from Supabase (`properties` table). There is no local JSON fallback. The admin panel at `/admin-panel` is the sole content management interface.

### Supabase Tables

- `properties` — slug, title, price, location, size, category, listing_type, main_image, gallery[], video_url, description, features[], reviews jsonb, created_at
- `comments` — id, property_id, user_id, text, parent_id, created_at
- `profiles` — id (= auth.uid), username, created_at

### Supabase Storage

- Bucket: `property-images` (Public) — stores uploaded property images

### Pages

1. `/` — Home / Landing
2. `/property-owners` — For property owners
3. `/buyers-renters` — For buyers and renters
4. `/lands-for-sale` — Land listings (filterCategory=land, filterListingType=sale)
5. `/properties-for-sale` — Property listings (filterListingType=sale)
6. `/apartments-for-rent` — Apartment listings (filterCategory=apartment, filterListingType=rent)
7. `/shops-for-lease` — Shop listings (filterCategory=shop, filterListingType=lease)
8. `/property/:slug` — Property detail (images, gallery, video, comments)
9. `/faqs` — FAQs
10. `/about` — About Fairview
11. `/login` — Login / Register (Supabase Auth)
12. `/admin-panel` — Admin dashboard (list, delete properties)
13. `/admin-panel/new` — Create property form
14. `/admin-panel/edit/:slug` — Edit property form

### Admin Access

- Protected by `VITE_ADMIN_EMAIL` environment variable (set on Netlify)
- Only the matching email gets admin access
- Admin can create, edit, delete properties and upload images

### Key Files

- `src/lib/supabase.ts` — Supabase client
- `src/lib/supabase-properties.ts` — All Supabase CRUD for properties + image upload
- `src/lib/mock-data.ts` — TypeScript types (Property, PropertyCategory, ListingType, Review)
- `src/pages/admin/AdminPanel.tsx` — Admin dashboard
- `src/pages/admin/PropertyForm.tsx` — Create/edit property form
- `src/pages/PropertyListingPage.tsx` — Shared listing page (filtered by category/type)
- `src/pages/PropertyDetail.tsx` — Single property detail page
- `src/components/CommentSection.tsx` — Comments (Supabase)
- `src/hooks/use-auth.tsx` — Auth state (Supabase)

### Environment Variables (Netlify)

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anon key
- `VITE_ADMIN_EMAIL` — Email address with admin panel access

### GitHub / Deployment

- GitHub repo: `Alchemist924/Fairview-version-1`, branch: `master`
- Deployed on Netlify with continuous deployment from master
- `public/_redirects` — SPA fallback for wouter routing
