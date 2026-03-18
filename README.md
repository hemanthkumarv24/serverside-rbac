# Server-Side RBAC with Next.js

A production-grade Next.js 14 application demonstrating server-side Role-Based Access Control (RBAC).

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **Prisma ORM** + SQLite
- **NextAuth.js v5** (Auth.js) with credentials provider
- **Zod** for validation
- **Vitest** for unit testing

## Roles

| Role | Permissions |
|------|-------------|
| `VIEWER` | View published pages only |
| `EDITOR` | Create/edit drafts, view previews |
| `ADMIN` | Publish content, manage users, delete pages |
| `SUPER_ADMIN` | Full access including role assignment |

## Page States

- **draft** — Created but not visible to viewers
- **preview** — Shareable via token link, not publicly listed
- **published** — Publicly visible to all authenticated users

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your values
```

### Database Setup

```bash
npm run db:push
npm run db:seed
```

### Development

```bash
npm run dev
```

### Testing

```bash
npm test
```

## Demo Credentials

| Email | Password | Role |
|-------|----------|------|
| superadmin@example.com | password123 | SUPER_ADMIN |
| admin@example.com | password123 | ADMIN |
| editor@example.com | password123 | EDITOR |
| viewer@example.com | password123 | VIEWER |

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/             # Login page
│   └── preview/           # Preview pages (token-based)
├── lib/
│   ├── auth/              # NextAuth.js configuration
│   ├── db/                # Prisma client
│   ├── rbac/              # RBAC logic
│   └── validators/        # Zod schemas
├── repositories/          # Data access layer
├── services/              # Business logic layer
├── types/                 # TypeScript types
└── __tests__/             # Unit tests
```

## API Endpoints

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| `GET` | `/api/pages` | List pages (filtered by role) | Any authenticated |
| `POST` | `/api/pages` | Create a draft page | `EDITOR`, `ADMIN`, `SUPER_ADMIN` |
| `GET` | `/api/pages/:id` | Get a single page | Any authenticated (RBAC filtered) |
| `PUT` | `/api/pages/:id` | Update a draft page | `EDITOR`, `ADMIN`, `SUPER_ADMIN` |
| `DELETE` | `/api/pages/:id` | Delete a page | `ADMIN`, `SUPER_ADMIN` |
| `POST` | `/api/pages/:id/publish` | Publish a page | `ADMIN`, `SUPER_ADMIN` |
| `POST` | `/api/pages/:id/preview` | Generate preview token | `EDITOR`, `ADMIN`, `SUPER_ADMIN` |
| `GET` | `/api/users` | List all users | `ADMIN`, `SUPER_ADMIN` |
| `PATCH` | `/api/users/:id/role` | Update user role | `SUPER_ADMIN` |

## RBAC Architecture

The RBAC system is enforced server-side at multiple layers:

1. **Service Layer** — `assertPermission()` throws if role lacks permission
2. **API Routes** — Check session role before calling services
3. **Server Components** — Filter data based on user role
4. **Layout Guards** — Redirect unauthorized users

### Permission Matrix

| Permission | VIEWER | EDITOR | ADMIN | SUPER_ADMIN |
|-----------|--------|--------|-------|-------------|
| View published pages | ✅ | ✅ | ✅ | ✅ |
| View draft pages | ❌ | ✅ | ✅ | ✅ |
| View preview pages | ❌ | ✅ | ✅ | ✅ |
| Create pages | ❌ | ✅ | ✅ | ✅ |
| Edit pages | ❌ | ✅ | ✅ | ✅ |
| Publish pages | ❌ | ❌ | ✅ | ✅ |
| Delete pages | ❌ | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ | ✅ |
| Assign roles | ❌ | ❌ | ❌ | ✅ |

## Deployment (Vercel)

1. Push your code to GitHub
2. Connect the repository to [Vercel](https://vercel.com)
3. Set the following environment variables in Vercel dashboard:
   - `DATABASE_URL` — Your PostgreSQL connection string (use Vercel Postgres or Neon)
   - `AUTH_SECRET` — A secure random string (run `openssl rand -base64 32`)
   - `NEXTAUTH_URL` — Your deployed URL (e.g. `https://your-app.vercel.app`)
4. For PostgreSQL deployment, update `prisma/schema.prisma`:
   - Change `provider = "sqlite"` to `provider = "postgresql"`
5. Run database migrations: `npx prisma migrate deploy`
6. Run the seed script: `npm run db:seed`

> **Note:** For local development, SQLite is used for simplicity. For production on Vercel, switch to PostgreSQL (Vercel Postgres, Neon, Supabase, etc.).

## CI/CD

GitHub Actions runs on every push:
- Installs dependencies
- Generates Prisma client
- Runs all unit tests (Vitest)

A successful CI run is required before deploying to Vercel via branch protection rules.

## Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — New features
- `fix:` — Bug fixes
- `refactor:` — Code refactoring
- `test:` — Test additions/changes
- `chore:` — Build, config, dependency updates
- `docs:` — Documentation changes
