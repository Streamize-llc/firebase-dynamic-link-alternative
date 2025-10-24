# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Depl is a Firebase Dynamic Links alternative built as a SaaS platform for managing mobile app deep links. It provides URL shortening, platform-specific deep linking, and analytics.

**Tech Stack:**
- Next.js 15.1.5 with App Router
- React 19.0.0 with TypeScript
- Supabase (PostgreSQL + Auth)
- Tailwind CSS + Radix UI + shadcn/ui
- Paddle for payments
- Fonts: Geist Sans, Geist Mono, Space Grotesk

## Essential Commands

```bash
# Development
npm run dev              # Start development server on http://localhost:3000

# Build & Production
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint

# Supabase Local Development
npm run supabase:start  # Start local Supabase instance
npm run supabase:stop   # Stop local Supabase instance
npm run supabase:status # Check status of local Supabase

# Database Management
npm run db:new          # Create new migration file
npm run db:reset        # Reset local database (WARNING: destructive)
npm run db:push         # Push migrations to remote database
npm run db:pull         # Pull schema from remote database
npm run db:diff         # Show schema differences
npm run db:link         # Link to remote Supabase project

# Type Generation
npm run generate-types  # Generate TypeScript types from Supabase schema
```

## Architecture Overview

### API Structure
- **Authentication**: Bearer token using `client_key` or `api_key` headers
- **Deep Link API**: `/api/deeplink` - Create/retrieve deep links
- **Platform Files**: `/api/apple-app-site-association`, `/api/assetlinks` - Mobile app verification

### Database Schema (Supabase)
Key tables:
- `workspaces`: Multi-tenant workspaces with client/API keys (formerly `projects`)
- `apps`: iOS/Android app configurations per workspace
- `deeplinks`: Short URLs with platform parameters, click tracking, and source attribution
- `profiles`: User profiles linked to Supabase auth

Schema is managed via Supabase migrations in `supabase/migrations/`. After schema changes, always regenerate types with `npm run generate-types`.

### Server Actions Pattern
All data mutations use server actions in `src/utils/action/`:
- Type-safe database operations
- Consistent error handling
- Session validation

### Component Architecture
- UI components in `src/components/ui/` follow shadcn/ui pattern
- Modal components in `src/components/modal/` for CRUD operations
- Page blocks in `src/components/blocks/` for landing page sections

### Routing Structure
```
/                       # Landing page
/dashboard             # Protected area - workspace list
/dashboard/[id]        # Workspace management (deep links, apps, settings)
/dashboard/[id]/docs   # API documentation for workspace
/link/[slug]           # Deep link redirect endpoint (internal route)
/blog                  # Blog listing
/blog/[slug]           # Individual blog posts
/docs                  # Documentation pages (MDX)
```

**Note**: The project recently migrated from "projects" to "workspaces" terminology. Database table is now `workspaces`.

### Key Implementation Details

1. **Deep Link Creation Flow**:
   - Validate workspace API key via `/api/deeplink`
   - Generate unique slug if not provided
   - Store platform-specific parameters (iOS/Android URLs, fallback)
   - Return short URL with redirect logic
   - Support for source attribution tracking

2. **URL Rewriting & Routing**:
   - Middleware (`src/utils/supabase/middleware.ts`) handles custom subdomain routing
   - Production: `*.depl.link` subdomains rewrite to `/link/[slug]`
   - Development: `*.localhost:3000` subdomains rewrite to `/link/[slug]`
   - Root path shortcodes: `depl.link/{slug}` rewrites to `/link/[slug]`
   - Excluded paths: `/dashboard`, `/api`, `/blog`, `/callback`, `/test`, `/landing2`, `/docs`

3. **Platform Detection**:
   - User-agent based routing for iOS/Android in `/link/[slug]`
   - Fallback URL support for web/desktop
   - Dynamic meta tags for social media sharing

4. **Security Patterns**:
   - Row-level security (RLS) via Supabase
   - API key validation (`client_key` for read, `api_key` for write)
   - Workspace membership checks in server actions
   - Session-based authentication for dashboard

### Development Tips

- Korean UI text is used throughout - maintain consistency
- Dark mode is the default theme (black background with white/gray text)
- All modals use the consistent pattern in `src/components/modal/`
- Server actions should always return `{error?: string}` format
- Use `cn()` utility from `@/lib/utils` for className composition
- Typography: Use `font-space-grotesk` for prominent headings (e.g., "Why DEPL?")
- Landing page uses minimal, high-end design with subtle gradients and hover effects