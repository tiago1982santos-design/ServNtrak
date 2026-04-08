# ServNtrak - Gestão de Serviços e Tarefas

## Overview

ServNtrak é uma aplicação mobile-first para gestão de serviços de manutenção de jardins, piscinas e jacuzzis. A aplicação permite acompanhar clientes, agendar serviços e registar atividades concluídas. Foi construída com React no frontend e Express no backend, utilizando PostgreSQL para persistência de dados e Replit Auth para autenticação.

## User Preferences

- **Utilizador**: Tiago Santos
- **Empresa**: Peralta Gardens
- **Língua**: Português de Portugal (PT-PT)
- **Estilo de Comunicação**: Simples e direto.
- **Serviços Atuais**: Jardim, Piscina, Jacuzzi e Geral.

## Home Page Design — "Dia de Sol (Polido)"

The Home page was redesigned from a dark-green gradient to a warm amber/orange "Sunny" aesthetic:
- **Background**: `#FFFCF5` (warm cream)
- **Primary accent**: Orange-to-amber gradient (`#F97316` → `#EAB308`)
- **Text colours**: `#2D1B0E` (headings), `#9B7B5E` (secondary), `#6B7B3A` (sage/success)
- **Layout sections**:
  1. White header card: live clock, greeting, weather pill, segmented progress bar
  2. Hero "A Seguir" card: next uncompleted appointment with countdown, address + maps link, CTA
  3. Urgency strip (amber): unpaid services total → links to /billing
  4. 4 Quick Actions: Mapa, Faturas, Fotos, Relatórios
  5. "Fila de Espera": all today's appointments sorted by time
  6. "Mais": Tarefas Pendentes, Funcionários, Compras e Despesas
- **BottomNav** updated: amber active state (`bg-orange-50`, `text-amber-500`), warm `border-orange-100` top border

## Geofencing — Registo Automático de Visitas

### How It Works
- **Hook**: `client/src/hooks/useGeofencing.ts` — uses browser `watchPosition` + 30s interval polling to detect proximity (75m radius) to client locations
- **Flow**: When user enters a client's geofence → active visit card shown (green, "Em visita"). When user leaves → confirmation card appears with duration. User can Confirm, Adjust duration, or Ignore.
- **Backend**: `POST /api/geofencing/visit` — Zod-validated endpoint that creates a `serviceVisits` record with `source: "geofencing"` and `status: "concluida"`, verifies client ownership, and marks linked appointment as completed
- **Schema additions**: `serviceVisits` table has `end_time`, `source` (default "manual"), `status` (default "concluida") columns; `actual_duration_minutes` is nullable

### Key Files
- `client/src/hooks/useGeofencing.ts` — GPS tracking hook
- `client/src/pages/Home.tsx` — UI integration (tracking button, active visit card, confirmation cards)
- `server/routes.ts` — `/api/geofencing/visit` endpoint

## Scheduling Rules

### Business Hours
- **Normal Hours**: 8:00-17:00 (Segunda a Sexta)
- **Lunch Break**: 13:00-14:00
- **Extended Hours**: Até 18:00 ou 19:00 em dias maiores (requer confirmação)
- **Saturdays**: 8:00-13:00 ocasionalmente (requer confirmação)

### Visit Frequencies
- **Jardim (Sazonal)**:
  - Época Alta (Abril-Setembro): 2 visitas/mês
  - Época Baixa (Outubro-Março): 1 visita/mês
- **Jardim (Acordo Especial)**: 1 visita/mês todo o ano
- **Piscina/Jacuzzi**:
  - Época Alta: 1 visita/semana (4/mês)
  - Época Baixa: 2 visitas/mês

### Confirmation Required
- Agendamentos fora do horário normal (18:00-19:00)
- Agendamentos aos Sábados
- Reagendamentos de trabalhos não concretizados

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
- **Authentication**: Custom auth with Passport.js (email/password via passport-local + Google OAuth via passport-google-oauth20), session-based with PostgreSQL session store. Apple and Facebook OAuth prepared for future activation.
- **Database Access**: Drizzle ORM with PostgreSQL

### Data Layer
- **Database**: PostgreSQL (provisioned via Replit)
- **ORM**: Drizzle ORM with schema defined in `shared/schema.ts`
- **Schema Migration**: Drizzle Kit (`db:push` command)
- **Core Tables**:
  - `users` - User accounts (custom auth with email/password and OAuth support)
  - `sessions` - Session storage for authentication
  - `clients` - Customer records with service type flags (garden/pool/jacuzzi)
  - `appointments` - Scheduled service appointments
  - `serviceLogs` - Completed service records
  - `employees` - Employee records with hourly pay/charge rates

### Employee Management
- **Employees Page**: Full CRUD for managing employees via "Mais" → "Funcionários"
- **Hourly Rates**: Each employee has:
  - `hourlyPayRate` - What the employee is paid per hour (internal cost)
  - `hourlyChargeRate` - What is charged to clients per hour (billing rate)
- **Service Log Integration**: When creating a service log, labor entries can select from registered employees
  - Selecting an employee auto-fills the hourly charge rate
  - Supports manual entry for non-registered workers
- **Active Status**: Employees can be deactivated when they leave (preserved for historical records)

### Authentication Flow
- Custom auth system in `server/replit_integrations/auth/` using Passport.js
- **Email/Password**: passport-local strategy with bcryptjs hashing (cost 12)
- **Google OAuth**: passport-google-oauth20 (requires GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET env vars)
- **Apple/Facebook OAuth**: Prepared for future activation (buttons shown as "Em breve")
- Session storage in PostgreSQL via `connect-pg-simple`
- Protected API routes use `requireAuth` middleware checking `req.isAuthenticated()`
- User ID accessed via `(req.user as any).id` in route handlers
- Login page supports: social login buttons, email/password login, account registration, password reset
- **Password Reset**: `POST /api/auth/forgot-password` sends hashed-token email via Resend; `POST /api/auth/reset-password` validates SHA-256 hashed token and updates password. Uses `passwordResetTokens` table. Tokens expire after 1 hour. Requires `RESEND_API_KEY` env var (optional `APP_BASE_URL` for custom domain).

### Client Profitability
- **Page**: `client/src/pages/ClientProfitability.tsx` at route `/profitability`
- **Endpoint**: `GET /api/clients/profitability` — calculates revenue vs labor cost per client
- **Data**: Aggregates paid `clientPayments` (revenue), completed `serviceVisits` (hours), and `serviceLogLaborEntries` (labor cost) per client
- **Features**: Global totals (4 summary cards), top-10 bar chart (recharts), sortable client list (by margin €, revenue, margin %, hours), color-coded margin badges
- **Access**: "Rentabilidade por Cliente" button on Reports page

### Push Notifications
- **Service Worker** (`client/public/sw.js`): Handles `push` events and `notificationclick` (opens app to specified URL)
- **Backend** (`server/pushService.ts`): Web Push API with VAPID keys, saves/removes subscriptions, sends notifications to user devices
- **Frontend hook** (`client/src/hooks/use-push-notifications.ts`): Subscribe/unsubscribe/test with state management
- **Profile section**: Toggle notifications on/off, test button, handles denied/unsupported states
- **DB table**: `push_subscriptions` (userId, endpoint, p256dh, auth, deviceInfo)
- **Endpoints**: `GET /api/push/vapid-public-key`, `POST /api/push/subscribe`, `POST /api/push/unsubscribe`, `POST /api/push/test`
- **Env vars**: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_EMAIL`

### Automatic Appointment Generation
- **Calendar "Gerar Mês" button**: Opens a modal to auto-generate monthly appointments based on client service contracts
- **Logic**: Reads each client's `hasGarden/hasPool/hasJacuzzi` flags and `*VisitFrequency` settings (`seasonal`, `once_monthly`, `on_demand`)
- **Seasonal rules**: Apr-Sep (high season) = more visits; Oct-Mar (low season) = fewer visits
- **Endpoints**: `POST /api/appointments/generate-preview` (returns preview list), `POST /api/appointments/generate-confirm` (creates selected appointments)
- **Deduplication**: Skips clients who already have appointments for the selected month+type

### Expense Notes (Notas de Despesa)
- **DB tables**: `expense_notes` (header with noteNumber, clientId, serviceLogId, status draft/issued) + `expense_note_items` (description, type, quantity, unitPrice, total, sourceType auto/manual/edited, editReason)
- **Backend** (`server/storage.ts`): Full CRUD with ownership enforcement, issued-note immutability, sequential numbering (ND-YYYY-NNN)
- **Endpoints**: `GET/POST /api/expense-notes`, `GET/PATCH/DELETE /api/expense-notes/:id`, `PUT /api/expense-notes/:id/items`, `GET /api/expense-notes/:id/pdf`, `POST /api/expense-notes/from-service-log/:logId`
- **PDF generation** (frontend): `client/src/lib/expenseNotesPdf.ts` using jsPDF + jspdf-autotable, with document template (`client/src/lib/documentTemplate.ts`) for header/logo/footer
- **From service log**: Auto-populates items from labor entries, material entries, and extra billing
- **Edited items**: Require `editReason`, shown in orange/italic in PDF with warning footnote

### Shared Code Pattern
- `shared/schema.ts` - Drizzle table definitions and Zod insert schemas
- `shared/routes.ts` - API route definitions with path, method, input/output schemas
- `shared/models/auth.ts` - Auth-specific table definitions (users, sessions)

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable

### Authentication
- **Custom Auth**: Email/password + OAuth providers
- **Required Environment Variables**: `DATABASE_URL`, `SESSION_SECRET`
- **Optional Environment Variables**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (for Google OAuth)

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `passport` / `passport-local` / `passport-google-oauth20` - Authentication
- `bcryptjs` - Password hashing
- `express-session` / `connect-pg-simple` - Session management
- `react-day-picker` / `date-fns` - Calendar functionality
- `@tanstack/react-query` - Data fetching and caching
- `zod` / `drizzle-zod` - Runtime validation and type generation
- `jspdf` / `jspdf-autotable` - PDF generation for exports
- CSV export utility (built-in) - Spreadsheet-compatible file generation for exports

### UI Framework Dependencies
- Full shadcn/ui component library (accordion, dialog, form, etc.)
- Radix UI primitives for accessible components
- Lucide React for icons
- Tailwind CSS for styling

## Ideias para a Comercialização da App

### Funcionalidades a Desenvolver
- **Multi-utilizador**: Adaptar a aplicação para suportar várias empresas independentes
- **Planos de Subscrição**: Definir funcionalidades por nível (básico, profissional, empresarial)
- **Dashboard de Administração**: Painel para gestão de contas e métricas de uso
- **Integração com Pagamentos**: Sistema de subscrições (Stripe, etc.)

### Requisitos Legais e Compliance
- **Política de Privacidade**: Documento detalhado sobre tratamento de dados
- **Termos de Serviço**: Condições de utilização da plataforma
- **RGPD**: Conformidade com regulamentação europeia de proteção de dados
- **Faturação**: Emissão de faturas para clientes empresariais

### Suporte e Documentação
- **Centro de Ajuda**: Documentação para utilizadores
- **Suporte ao Cliente**: Sistema de tickets ou chat
- **Onboarding**: Tutoriais e guias de início rápido

### Marketing e Distribuição
- **Landing Page**: Página promocional com funcionalidades e preços
- **Período de Teste**: Free trial para novos utilizadores
- **Testemunhos**: Casos de sucesso de clientes