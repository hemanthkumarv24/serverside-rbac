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

## RBAC Architecture

The RBAC system is enforced server-side at multiple layers:

1. **Service Layer** — `assertPermission()` throws if role lacks permission
2. **API Routes** — Check session role before calling services
3. **Server Components** — Filter data based on user role
4. **Layout Guards** — Redirect unauthorized users
