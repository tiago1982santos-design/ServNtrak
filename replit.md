# Service Pro - Garden, Pool & Jacuzzi Management App

## Overview

Service Pro is a mobile-first web application for service professionals to manage their gardening, pool, and jacuzzi maintenance business. The app enables users to track clients, schedule appointments, and log completed services. Built with React frontend and Express backend, using PostgreSQL for data persistence and Replit Auth for user authentication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom theme variables for nature-inspired palette (greens, blues, earth tones)
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite with path aliases (`@/` for client src, `@shared/` for shared code)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas for type-safe request/response validation
- **Authentication**: Replit Auth (OpenID Connect) with Passport.js, session-based with PostgreSQL session store
- **Database Access**: Drizzle ORM with PostgreSQL

### Data Layer
- **Database**: PostgreSQL (provisioned via Replit)
- **ORM**: Drizzle ORM with schema defined in `shared/schema.ts`
- **Schema Migration**: Drizzle Kit (`db:push` command)
- **Core Tables**:
  - `users` - User accounts (managed by Replit Auth)
  - `sessions` - Session storage for authentication
  - `clients` - Customer records with service type flags (garden/pool/jacuzzi)
  - `appointments` - Scheduled service appointments
  - `serviceLogs` - Completed service records

### Authentication Flow
- Uses Replit Auth blueprint integration in `server/replit_integrations/auth/`
- Session storage in PostgreSQL via `connect-pg-simple`
- Protected API routes use `requireAuth` middleware checking `req.isAuthenticated()`
- User data synced to local `users` table on login via upsert

### Shared Code Pattern
- `shared/schema.ts` - Drizzle table definitions and Zod insert schemas
- `shared/routes.ts` - API route definitions with path, method, input/output schemas
- `shared/models/auth.ts` - Auth-specific table definitions (users, sessions)

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable

### Authentication
- **Replit Auth**: OpenID Connect provider at `https://replit.com/oidc`
- **Required Environment Variables**: `DATABASE_URL`, `SESSION_SECRET`, `REPL_ID`, `ISSUER_URL`

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `passport` / `openid-client` - Authentication
- `express-session` / `connect-pg-simple` - Session management
- `react-day-picker` / `date-fns` - Calendar functionality
- `@tanstack/react-query` - Data fetching and caching
- `zod` / `drizzle-zod` - Runtime validation and type generation

### UI Framework Dependencies
- Full shadcn/ui component library (accordion, dialog, form, etc.)
- Radix UI primitives for accessible components
- Lucide React for icons
- Tailwind CSS for styling