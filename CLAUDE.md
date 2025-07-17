# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Depl is a Firebase Dynamic Links alternative built as a SaaS platform for managing mobile app deep links. It provides URL shortening, platform-specific deep linking, and analytics.

**Tech Stack:**
- Next.js 15.1.5 with App Router
- React 19.0.0 with TypeScript
- Supabase (PostgreSQL + Auth)
- Tailwind CSS + Radix UI
- Paddle for payments

## Essential Commands

```bash
# Development
npm run dev              # Start development server on http://localhost:3000

# Build & Production
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint

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
- `projects`: Multi-tenant projects with client/API keys
- `apps`: iOS/Android app configurations per project
- `deeplinks`: Short URLs with platform parameters and click tracking
- `profiles`: User profiles linked to Supabase auth

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
/dashboard             # Protected area - project list
/dashboard/project/[id] # Project management
/dashboard/project/[id]/docs # API documentation
/link/[slug]           # Deep link redirect endpoint
/blog                  # Blog listing
/blog/[slug]           # Individual blog posts
```

### Key Implementation Details

1. **Deep Link Creation Flow**:
   - Validate project API key
   - Generate unique slug if not provided
   - Store platform-specific parameters
   - Return short URL with redirect logic

2. **Platform Detection**:
   - User-agent based routing for iOS/Android
   - Fallback URL support
   - Social media meta tags

3. **Security Patterns**:
   - Row-level security via Supabase
   - API key validation in middleware
   - Project membership checks in server actions

### Development Tips

- Korean UI text is used throughout - maintain consistency
- Dark mode is the default theme
- All modals use the consistent pattern in `src/components/modal/`
- Server actions should always return `{error?: string}` format
- Use `cn()` utility for className composition