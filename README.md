# PrismaLens

PrismaLens is an interactive, browser-based learning platform for mastering the Prisma ORM, PostgreSQL schema design, and production database patterns.

---

## Quickstart

### Prerequisites
- Node.js 18+
- npm 9+

### Setup & Run
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run automated test suite (curriculum & proxy engine)
npm test

# Type check codebase
npm run lint

# Production build
npm run build
```

---

## Architectural Highlights

- **In-Browser Prisma Engine (`src/lib/prisma-engine/proxy-executor.ts`)**:
  - Implements a reactive proxy engine that models PrismaClient queries in pure TypeScript.
  - Generates educational SQL representations using Prisma AST mapping.
  - Supports transaction rollbacks (`$transaction`) with table state snapshots.
  - Calculates detailed row-level diffs (`tableDiff`) on data mutations (`create`, `update`, `delete`, `upsert`).
  - Timeout protection (3500ms) against infinite loops or hung promises.

- **Trustworthy Grading Pipeline (`src/lib/prisma-engine/validator.ts`)**:
  - Validates submissions against runtime execution logs, returned values, and mutated rows.
  - Defends against deceptive comments and syntactical workarounds.
  - Verified across all 14 curriculum days and challenge tasks.

- **Curriculum Architecture (`src/content/modules/`)**:
  - 14 full learning days split across 4 milestones:
    1. Days 1–4: Reading Data & Foundations (`findUnique`, `findMany`, `select`, `include`, filtering).
    2. Days 5–8: Relationships & Advanced Queries (relations, pagination, search, transactions).
    3. Days 9–12: Writing Data & Data Modeling (`create`, `createMany`, Zod validation, `update`, `upsert`, soft delete).
    4. Days 13–14: Production Prisma (Error handling, connection pooling, indexing, full capstone).

- **Visual Tools (`src/components/learning/ErdVisualizer.tsx` & `SandboxPlayground.tsx`)**:
  - AST-driven Entity Relationship Diagram (ERD) visualizer parsing `.prisma` schema models and relationships.
  - Interactive table explorer and free-form query playground.

For a breakdown of real versus simulated engine behaviors, see [SIMULATOR_CAPABILITIES.md](./SIMULATOR_CAPABILITIES.md).
