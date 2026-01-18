# Peralta Gardens - Gestão de Jardins, Piscinas e Jacuzzis

## Overview

A Peralta Gardens é uma aplicação mobile-first desenvolvida para o Tiago Santos gerir a sua empresa de manutenção de jardins, piscinas e jacuzzis. A aplicação permite acompanhar clientes, agendar serviços e registar atividades concluídas. Foi construída com React no frontend e Express no backend, utilizando PostgreSQL para persistência de dados e Replit Auth para autenticação.

## User Preferences

- **Utilizador**: Tiago Santos
- **Empresa**: Peralta Gardens
- **Língua**: Português de Portugal (PT-PT)
- **Estilo de Comunicação**: Simples e direto.
- **Serviços Atuais**: Jardim, Piscina, Jacuzzi e Geral.

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
- `jspdf` / `jspdf-autotable` - PDF generation for exports
- `xlsx` - Excel file generation for exports

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