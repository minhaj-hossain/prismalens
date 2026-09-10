// =============================================================================
// MILESTONE 1: DAYS 1 TO 4 (PRISMA FUNDAMENTALS & SCHEMA ARCHITECTURE)
// =============================================================================

import { ModuleData } from '../../types/curriculum';

export const MILESTONE_1_MODULES: ModuleData[] = [
  // ---------------------------------------------------------------------------
  // DAY 1: Why Prisma? (The End of Untyped SQL)
  // ---------------------------------------------------------------------------
  {
    id: 'day-01',
    slug: 'why-prisma',
    day: 1,
    title: 'Day 1 — Why Prisma?',
    shortTitle: 'Why Prisma?',
    milestoneId: 'milestone-1',
    description: 'Learn why traditional raw SQL drivers leave your TypeScript code vulnerable to silent runtime bugs, and how Prisma generates a fully type-safe, auto-completing database client directly from your schema.',
    estimatedMinutes: 45,
    completionLearnings: [
      'Understand the Object-Relational Impedance Mismatch and why raw SQL strings are invisible to the TypeScript compiler',
      'Learn how Prisma Client dynamically infers TypeScript return types directly from your query parameters',
      'Use findUnique and select to fetch lean, targeted records without over-fetching database columns',
      'Understand the three architectural pillars: schema.prisma, Prisma Client, and Prisma Migrate'
    ],
    concepts: [
      {
        id: 'day-01-concept-1',
        order: 1,
        title: 'The Type-Safety Gap: Why Raw SQL Fails TypeScript',
        shortDescription: 'Why raw SQL strings leave your backend blind to typos and schema changes, and how Prisma gives your database queries real compile-time guarantees.',
        theory: {
          summary: `When you query a database using raw database drivers (like pg or mysql2) in Node.js, your SQL query is treated as an opaque string:
db.query('SELECT id, name, email FROM users WHERE id = $1', [userId])

To the TypeScript compiler, that SQL string is a complete black box. TypeScript cannot parse SQL grammar, inspect column names, or verify that the "users" table even exists. The driver returns an untyped any or generic row object. If someone renames the database column from "email" to "user_email", TypeScript won't say a word—you only discover the catastrophic null pointer in production when an active user attempts to log in.

Prisma eliminates this entire class of bugs by reversing the relationship: your schema.prisma defines your data models, and Prisma generates a dedicated, strongly typed TypeScript client tailored to your exact database. When you write prisma.user.findUnique({ where: { id } }), TypeScript knows every column, every type, and every constraint in real time.`,
          targetHero: {
            language: 'typescript',
            badge: 'Query Shapes Return Type',
            explanation: 'Your query parameters directly dictate the inferred TypeScript type. With select, only the requested fields exist on the returned object.',
            code: `// The TypeScript compiler automatically derives the exact shape from your query:
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    name: true,
    email: true
  }
});

// Inferred Type:
// { id: number; name: string; email: string } | null
// Trying to access user.passwordHash will fail at compile time!`
          },
          explanation: [
            'Raw SQL drivers treat queries as unverified strings. If a column is dropped or misspelled, errors only surface at runtime.',
            'Prisma Client is generated directly from your schema, so TypeScript validates your model names, field names, and input types while you type.',
            'Prisma does not replace SQL. Under the hood, Prisma compiles your typed query into clean, parameterized SQL executed by PostgreSQL.'
          ],
          stepBreakdowns: [
            {
              stepNumber: 1,
              stepTitle: 'The Raw Driver Problem',
              codeSnippet: `// Untyped and fragile:
const result = await db.query('SELECT id, full_name FROM users WHERE id = $1', [id]);
const user = result.rows[0]; // Type is 'any'
console.log(user.email); // undefined — no compiler warning!`,
              explanation: 'The driver cannot tell TypeScript what columns were selected. Typos pass build checks silently.'
            },
            {
              stepNumber: 2,
              stepTitle: 'The Prisma Type-Safe Solution',
              codeSnippet: `const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true }
});
// TypeScript knows: user is { id: number; name: string } | null`,
              explanation: 'Autocompletion guides every property. Renaming a schema column immediately highlights every affected query across your codebase.'
            }
          ],
          keyTakeaway: 'Prisma turns database queries from fragile, untyped strings into verified, auto-completing TypeScript operations with zero runtime surprises.',
          commonMistakes: [
            'Relying on "as any" or manual type assertions: never cast Prisma query outputs to "any"; let Prisma infer the exact shape.',
            'Assuming Prisma replaces SQL knowledge: Prisma generates SQL, and understanding indexes, constraints, and execution plans remains essential.'
          ],
          mcqs: [
            {
              id: 'mcq-1-1',
              question: 'Why does TypeScript fail to catch typos inside raw SQL query strings like "SELECT usr_name FROM users"?',
              options: [
                'TypeScript only supports frontend browser JavaScript code',
                'TypeScript treats string literals as opaque text and cannot inspect SQL grammar or live database schemas',
                'PostgreSQL deliberately hides column names from the Node.js process',
                'The TypeScript compiler requires an active database connection to parse SQL'
              ],
              correctIndex: 1,
              explanation: 'To TypeScript, a raw SQL query is merely a string. It cannot know what tables or columns exist in your database without an ORM or code generator like Prisma.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-1-1',
            title: 'Task 1 (Guided): Read and Shape a Record by Primary Key',
            description: 'Use prisma.user.findUnique to fetch a single user by ID, selecting only their id and name to create an efficient, type-safe return payload.',
            type: 'guided',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Call prisma.user.findUnique',
              'Pass where: { id: userId } to target the primary key',
              'Use select: { id: true, name: true } so only id and name are retrieved'
            ],
            initialCode: `// In Prisma, your query directly determines the shape of the returned value.
// Complete the query to fetch user by id with only 'id' and 'name':
export async function getUserNameOnly(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    // TODO: Use select to return only id and name
  });
}`,
            solutionCode: `export async function getUserNameOnly(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true }
  });
}`,
            solutionExplanation: 'findUnique targets fields marked with @id or @unique in schema.prisma. The select object restricts the database query to just the two requested columns.',
            hints: [
              { level: 1, text: 'Add the "select" option inside findUnique.' },
              { level: 2, text: 'Write select: { id: true, name: true } to project only those columns.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'findUnique',
              requiredWhereClauses: ['id'],
              requiredFieldsInSelect: ['id', 'name']
            },
            successMessage: 'Great job! Notice how the returned TypeScript type is strictly { id: number; name: string } | null.'
          },
          {
            id: 'task-1-2',
            title: 'Task 2 (Guided): Query by Unique Constraint (Email Lookup)',
            description: 'Look up an account by their unique email address and project their id, name, and email fields.',
            type: 'guided',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Call prisma.user.findUnique',
              'Pass where: { email } to filter by the unique email address',
              'Select id, name, and email in the response'
            ],
            initialCode: `// Write a type-safe findUnique query looking up a user by email:
export async function getUserByEmail(email: string) {
  // TODO: Call prisma.user.findUnique with where: { email } and select id, name, email
}`,
            solutionCode: `export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true }
  });
}`,
            solutionExplanation: 'findUnique requires a unique identifier (such as @id or @unique). Because email has @unique in the schema, Prisma allows filtering by email.',
            hints: [
              { level: 1, text: 'Return await prisma.user.findUnique({ where: { email }, select: { ... } });' },
              { level: 2, text: 'Set id: true, name: true, and email: true inside the select block.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'findUnique',
              requiredWhereClauses: ['email'],
              requiredFieldsInSelect: ['id', 'name', 'email']
            },
            successMessage: 'Clean execution! By targeting a @unique field, Prisma guarantees at most one row is returned.'
          },
          {
            id: 'task-1-3',
            title: 'Task 3 (Independent): Eliminate Type Bypasses ("as any")',
            description: 'A developer used "as any" to silence a compiler error caused by a misspelled field name. Fix the query to use the actual schema field "email" without hacks.',
            type: 'independent',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Remove "as any" completely from the query',
              'Replace the invalid field user_mail with the schema-defined email field',
              'Select id and email in the returned record'
            ],
            initialCode: `export async function getActiveMember(email: string) {
  // A developer used "as any" to silence TypeScript on a nonexistent field 'user_mail'.
  // Fix the query to use the schema-defined 'email' field without using 'as any':
  return await prisma.user.findUnique({
    where: { user_mail: email } as any,
  });
}`,
            solutionCode: `export async function getActiveMember(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true }
  });
}`,
            solutionExplanation: 'Never silence TypeScript with "as any". Aligning query properties with schema.prisma restores compile-time verification across your codebase.',
            hints: [
              { level: 1, text: 'Delete "as any" and rename user_mail to email.' },
              { level: 2, text: 'Add select: { id: true, email: true } to project clean fields.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'findUnique',
              requiredWhereClauses: ['email']
            },
            successMessage: 'Well done! You eliminated the type hack and restored genuine compile-time safety.'
          }
        ]
      },
      {
        id: 'day-01-concept-2',
        order: 2,
        title: 'Lean Projections: Why SELECT * Hurts Production Apps',
        shortDescription: 'Why fetching entire database rows degrades performance, and how Prisma select shapes both network payloads and TypeScript types.',
        theory: {
          summary: `When developers query database tables without specifying columns, the database defaults to SELECT * (fetching every column on the row). In a small toy app, this seems harmless. In production, it creates severe problems:

1. The Payload Tax: Tables often contain heavy text columns, metadata blobs, or internal audit fields. Pulling 50 columns over the network when you only need a user's name wastes memory, CPU serialization, and network bandwidth.
2. The Security Leak: If your user table has password_hash or reset_token columns, a lazy SELECT * risks serializing sensitive secrets into public API JSON responses.
3. Memory Pressure: In high-throughput Node.js microservices, allocating thousands of bloated row objects stresses the V8 garbage collector.

With Prisma, select acts as a surgical scalpel. Specifying select: { name: true, email: true } does two things simultaneously:
- Compiles down to SELECT "name", "email" at the PostgreSQL engine level.
- Narrows the TypeScript return type so only name and email exist on the resulting object.`,
          targetHero: {
            language: 'typescript',
            badge: 'Surgical Column Selection',
            explanation: 'select guarantees that unrequested columns are never transmitted across the database connection.',
            code: `// Fetching a student directory without dragging heavy fields across the wire:
const students = await prisma.student.findMany({
  select: {
    name: true,
    department: true
  }
});

// Return Type: Array<{ name: string; department: string }>
// Fields like 'id', 'age', and 'city' are omitted from SQL and TypeScript!`
          },
          explanation: [
            'By default, findMany() fetches every scalar column in the model (equivalent to SQL SELECT *).',
            'Using select restricts both the SQL columns queried from PostgreSQL and the inferred TypeScript object properties.',
            'Security best practice: Always use select on sensitive tables to guarantee authentication hashes are never sent to callers.'
          ],
          stepBreakdowns: [
            {
              stepNumber: 1,
              stepTitle: 'Default findMany (Over-fetching)',
              codeSnippet: `const all = await prisma.student.findMany();
// SQL: SELECT id, name, age, department, city FROM students;
// Fetches every column even if you only need the student's name.`,
              explanation: 'Transfers all data across the wire, consuming unnecessary memory and bandwidth.'
            },
            {
              stepNumber: 2,
              stepTitle: 'Field Projection with select',
              codeSnippet: `const lean = await prisma.student.findMany({
  select: { name: true, department: true }
});
// SQL: SELECT name, department FROM students;`,
              explanation: 'Only requests the exact columns needed. PostgreSQL executes faster and memory allocation drops.'
            }
          ],
          keyTakeaway: 'Always project fields intentionally with select to keep database queries fast, lightweight, and leak-proof.',
          commonMistakes: [
            'Mixing select and include on the same level: Prisma disallows using select and include together on the root object—use nested select instead.',
            'Assuming select is just a client-side filter: select translates directly into the SQL column list; unselected columns never leave the database server.'
          ],
          mcqs: [
            {
              id: 'mcq-1-2',
              question: 'What happens in PostgreSQL when you write prisma.user.findMany({ select: { name: true } })?',
              options: [
                'PostgreSQL runs SELECT * and Prisma deletes the other fields in Node.js memory',
                'PostgreSQL runs SELECT "name" FROM "users", transmitting only the name column over the network wire',
                'PostgreSQL creates a temporary view in the database',
                'TypeScript compiles the query into an in-memory array filter'
              ],
              correctIndex: 1,
              explanation: 'Prisma generates a targeted SQL query that requests only the specific column from PostgreSQL, saving network and database resources.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-1-4',
            title: 'Task 1 (Guided): Query a Student Directory with Lean Projection',
            description: 'Retrieve all students from the database using prisma.student.findMany, selecting only the name and department columns.',
            type: 'guided',
            targetModel: 'student',
            activeTab: 'editor',
            instructions: [
              'Call prisma.student.findMany',
              'Use select: { name: true, department: true }',
              'Do not fetch unused columns like id, age, or city'
            ],
            initialCode: `// Fetch a lightweight student directory list:
export async function getStudentDirectory() {
  // TODO: Call prisma.student.findMany selecting only 'name' and 'department'
}`,
            solutionCode: `export async function getStudentDirectory() {
  return await prisma.student.findMany({
    select: {
      name: true,
      department: true
    }
  });
}`,
            solutionExplanation: 'Using findMany with select outputs SELECT "name", "department" FROM "students", returning a typed array of student names and departments.',
            hints: [
              { level: 1, text: 'Call await prisma.student.findMany({ select: { ... } });' },
              { level: 2, text: 'Inside select, set name: true and department: true.' }
            ],
            validation: {
              targetModel: 'student',
              requiredMethod: 'findMany',
              requiredFieldsInSelect: ['name', 'department']
            },
            successMessage: 'Great job! You executed a lean multi-row projection without over-fetching.'
          },
          {
            id: 'task-1-5',
            title: 'Task 2 (Independent): Build a Safe User Profile Card',
            description: 'Complete the getPublicProfile function to look up a user by their unique email and project only their public name and email fields.',
            type: 'independent',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Call prisma.user.findUnique with where: { email }',
              'Select only name and email in the return payload'
            ],
            initialCode: `export async function getPublicProfile(email: string) {
  // TODO: Query user by email and return only 'name' and 'email'
}`,
            solutionCode: `export async function getPublicProfile(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: { name: true, email: true }
  });
}`,
            solutionExplanation: 'Selecting name and email ensures private or internal fields are never queried or leaked to the caller.',
            hints: [
              { level: 1, text: 'Filter by where: { email }.' },
              { level: 2, text: 'Include select: { name: true, email: true }.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'findUnique',
              requiredWhereClauses: ['email'],
              requiredFieldsInSelect: ['name', 'email']
            },
            successMessage: 'Safe and clean! The returned payload contains strictly the public profile fields.'
          }
        ]
      },
      {
        id: 'day-01-concept-3',
        order: 3,
        title: 'The Prisma Triad: Schema, Client, and Migrate',
        shortDescription: 'How schema.prisma, Prisma Client, and Prisma Migrate coordinate to keep your database, SQL migrations, and TypeScript types in perfect sync.',
        theory: {
          summary: `Prisma is not a monolithic library; it is a coordinated toolchain composed of three distinct parts:

1. schema.prisma (The Single Source of Truth):
   Here you declare your datasource (e.g. PostgreSQL), client generators, and data models with their relations and constraints. Everything in your application flows outward from this declarative file.

2. Prisma Client (The Type-Safe Query Engine):
   A tailor-made query builder generated into your node_modules. It provides auto-completion, compile-time validation, and query compilation. You never manually write type definitions for your database tables—Prisma generates them automatically.

3. Prisma Migrate (The Database Evolution Engine):
   A version-controlled database migration tool. When you modify a model in schema.prisma, Prisma Migrate calculates the difference, writes human-readable SQL migration scripts (e.g. ALTER TABLE), and applies them to your database.

Editing schema.prisma does not magically alter live PostgreSQL tables. You run migrations to update the database, and run "prisma generate" to refresh your TypeScript types.`,
          targetHero: {
            language: 'prisma',
            badge: 'The Declarative Blueprint',
            explanation: 'The schema defines the database connection and the client generator in one place.',
            code: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}`
          },
          explanation: [
            'schema.prisma is the single source of truth for your database structure and application types.',
            'Prisma Client is generated directly into your codebase, offering full auto-completion and compile-time verification.',
            'Prisma Migrate converts schema edits into versioned SQL files so database changes are reproducible across development, staging, and production.'
          ],
          keyTakeaway: 'schema.prisma defines your data models, Prisma Migrate updates your PostgreSQL tables with SQL DDL, and Prisma Client gives your TypeScript code a strongly typed query API.',
          commonMistakes: [
            'Expecting database tables to change automatically just by saving schema.prisma without running a migration.',
            'Manually writing TypeScript interfaces that duplicate database models instead of utilizing Prisma-generated types.'
          ],
          mcqs: [
            {
              id: 'mcq-1-3',
              question: 'What command synchronizes your TypeScript types after you add a new model to schema.prisma?',
              options: [
                'tsc --watch',
                'prisma generate',
                'npm start',
                'docker restart postgres'
              ],
              correctIndex: 1,
              explanation: 'Running "prisma generate" inspects schema.prisma and regenerates the Prisma Client TypeScript definitions in node_modules.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-1-6',
            title: 'Task 1 (Guided): Query Auth Credentials with Precision',
            description: 'Look up an account by ID and project only the authentication credentials (id and email) for an internal token verification check.',
            type: 'guided',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Call prisma.user.findUnique with where: { id: userId }',
              'Select only id: true and email: true'
            ],
            initialCode: `// Fetch user auth credentials returning only 'id' and 'email':
export async function getUserAuthCredentials(userId: number) {
  // TODO: Call prisma.user.findUnique with where: { id: userId }
  // Select only 'id' and 'email'
}`,
            solutionCode: `export async function getUserAuthCredentials(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true }
  });
}`,
            solutionExplanation: 'select limits the SQL query to only fetch id and email from the users table, and TypeScript infers { id: number; email: string } | null.',
            hints: [
              { level: 1, text: 'Filter by where: { id: userId }.' },
              { level: 2, text: 'Specify select: { id: true, email: true }.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'findUnique',
              requiredWhereClauses: ['id'],
              requiredFieldsInSelect: ['id', 'email']
            },
            successMessage: 'Great job! You shaped the query with select and saw how TypeScript infers only the requested fields.'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-01-challenge',
      title: 'Day 1 Challenge: The Production API Refactor',
      scenario: 'Your backend engineering team is deprecating an old Express microservice that relied on fragile, untyped raw SQL strings. You are tasked with replacing the legacy lookup query with a type-safe Prisma query that fetches an active user by email and projects only their id, name, and email fields.',
      tasks: [
        {
          id: 'challenge-1-1',
          title: 'Replace Legacy Raw SQL with Typed Prisma Query',
          description: 'Rewrite the legacy getUser function to find a user by unique email using prisma.user.findUnique. Select id, name, and email without using raw SQL strings or "as any" type hacks.',
          type: 'challenge',
          targetModel: 'user',
          activeTab: 'editor',
          instructions: [
            'Use prisma.user.findUnique',
            'Filter by where: { email }',
            'Select only id, name, and email',
            'Do not use raw SQL strings or "as any" type assertions'
          ],
          initialCode: `// Legacy helper previously did:
// const res = await db.query('SELECT id, name, email FROM users WHERE email = $1', [email]);
// return res.rows[0];

export async function getUser(email: string) {
  // TODO: Replace with a strongly typed prisma.user.findUnique query
  // Filter by where: { email } and select id, name, and email
}`,
          solutionCode: `export async function getUser(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true }
  });
}`,
          solutionExplanation: 'findUnique is designed for unique lookups. The select object ensures only the requested fields are queried and returned in the resulting TypeScript object.',
          hints: [
            { level: 1, text: 'Call prisma.user.findUnique with where: { email }.' },
            { level: 2, text: 'Add select: { id: true, name: true, email: true } to restrict the returned fields.' }
          ],
          validation: {
            targetModel: 'user',
            requiredMethod: 'findUnique',
            requiredWhereClauses: ['email'],
            requiredFieldsInSelect: ['id', 'name', 'email']
          },
          successMessage: 'Outstanding! You successfully replaced the legacy query with a strongly typed, auto-completed Prisma Client query.'
        }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // DAY 2: Modern Prisma Setup & Configuration
  // ---------------------------------------------------------------------------
  {
    id: 'day-02',
    slug: 'prisma-setup-v7',
    day: 2,
    title: 'Day 2 — Modern Prisma Setup & Configuration',
    shortTitle: 'Setup & Configuration',
    milestoneId: 'milestone-1',
    description: 'Master datasource configuration, configure connection pooling for serverless and cloud PostgreSQL, and bridge legacy SQL snake_case tables to idiomatic TypeScript camelCase using @map and @@map.',
    estimatedMinutes: 45,
    completionLearnings: [
      'Understand datasource and client generator declarations in schema.prisma',
      'Configure connection pooling parameters for serverless environments (PgBouncer, Neon, Supabase)',
      'Map legacy snake_case database tables and columns to clean TypeScript camelCase models without altering live database tables'
    ],
    concepts: [
      {
        id: 'day-02-concept-1',
        order: 1,
        title: 'Datasource Architecture & Connection Pooling in Cloud Backends',
        shortDescription: 'How Prisma connects to PostgreSQL, and why serverless environments require connection poolers to prevent database connection exhaustion.',
        theory: {
          summary: `Every Prisma application starts with the datasource block in schema.prisma. It specifies the database provider ("postgresql", "mysql", "sqlite") and the connection URL:

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

In traditional Node.js servers, a long-lived application process maintains a stable pool of 5–10 database connections. However, in modern serverless and containerized cloud platforms (like Vercel, AWS Lambda, or Cloud Run), incoming traffic can spin up hundreds of concurrent function instances simultaneously. If each function opens its own direct connection, PostgreSQL will quickly exceed its max_connections limit and crash with "FATAL: remaining connection slots are reserved".

To prevent this, production deployments route traffic through a connection pooler like PgBouncer or serverless pooling proxies. Prisma supports this by appending query parameters like "?pgbouncer=true&connection_limit=10" to your connection URL.`,
          targetHero: {
            language: 'prisma',
            badge: 'Datasource & Generator Block',
            explanation: 'The foundation of schema.prisma: database provider and client generator settings.',
            code: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}`
          },
          explanation: [
            'datasource db specifies the target database engine and the connection string loaded from the environment.',
            'generator client instructs the Prisma CLI where and how to generate the TypeScript client during build time.',
            'Serverless architectures must use pooled connection strings to prevent exhausting PostgreSQL connection limits.'
          ],
          keyTakeaway: 'Always read database credentials from environment variables, and use connection pooling parameters in serverless environments.',
          mcqs: [
            {
              id: 'mcq-2-1',
              question: 'Why do cloud serverless backends require a connection pooler (like PgBouncer) when talking to PostgreSQL?',
              options: [
                'PostgreSQL cannot execute SQL statements over TCP/IP without PgBouncer',
                'Each serverless function instance opens separate connections, quickly overwhelming PostgreSQL connection limits',
                'Prisma Client is not compatible with Linux containers without a pooler',
                'Connection poolers compile TypeScript files faster'
              ],
              correctIndex: 1,
              explanation: 'Serverless functions scale out horizontally. A connection pooler acts as a reverse proxy that multiplexes hundreds of transient function connections into a fixed pool of persistent database connections.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-2-1',
            title: 'Task 1 (Guided): Configure PostgreSQL Datasource & Generator',
            description: 'Set up the datasource db block pointing to PostgreSQL using env("DATABASE_URL") and configure the generator client in schema.prisma.',
            type: 'guided',
            targetModel: 'datasource',
            activeTab: 'schema',
            instructions: [
              'Define datasource db with provider = "postgresql" and url = env("DATABASE_URL")',
              'Define generator client with provider = "prisma-client-js"'
            ],
            initialCode: `// Configure datasource db and generator client:
`,
            solutionCode: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}`,
            solutionExplanation: 'The datasource block connects Prisma to your PostgreSQL instance, and the generator block configures Prisma Client generation.',
            hints: [
              { level: 1, text: 'Use provider = "postgresql" and url = env("DATABASE_URL").' },
              { level: 2, text: 'Use generator client { provider = "prisma-client-js" }.' }
            ],
            validation: {
              codeContains: ['provider = "postgresql"', 'url = env("DATABASE_URL")', 'generator client']
            },
            successMessage: 'Great job! Datasource and generator blocks are properly configured.'
          },
          {
            id: 'task-2-2',
            title: 'Task 2 (Independent): Append Connection Pooling Parameters',
            description: 'Write a helper function to safely append required serverless pool parameters (pgbouncer=true and connection_limit=10) to a PostgreSQL URL.',
            type: 'independent',
            targetModel: 'url',
            activeTab: 'editor',
            instructions: [
              'Use the standard URL object to parse basePostgresUrl',
              'Set search parameter pgbouncer to "true"',
              'Set search parameter connection_limit to "10"',
              'Return the updated URL string'
            ],
            initialCode: `export function formatPooledDbUrl(basePostgresUrl: string): string {
  // TODO: Append pgbouncer=true and connection_limit=10 to the URL safely
  return basePostgresUrl;
}`,
            solutionCode: `export function formatPooledDbUrl(basePostgresUrl: string): string {
  const url = new URL(basePostgresUrl);
  url.searchParams.set('pgbouncer', 'true');
  url.searchParams.set('connection_limit', '10');
  return url.toString();
}`,
            solutionExplanation: 'Using the WHATWG URL searchParams API ensures query strings are safely formatted and escaped.',
            hints: [
              { level: 1, text: 'Use new URL(basePostgresUrl) and url.searchParams.set(...).' },
              { level: 2, text: 'Call url.toString() to return the updated connection string.' }
            ],
            validation: {
              codeContains: ['searchParams', 'pgbouncer', 'connection_limit']
            },
            successMessage: 'Well done! Connection pooling parameters ensure reliable database connectivity in high-concurrency environments.'
          }
        ]
      },
      {
        id: 'day-02-concept-2',
        order: 2,
        title: 'The Naming Bridge: Mapping snake_case SQL to camelCase TypeScript',
        shortDescription: 'How to use @map and @@map to write clean, idiomatic TypeScript while preserving legacy database table and column names.',
        theory: {
          summary: `In relational database design, table and column names almost universally adhere to snake_case conventions:
- Tables: tbl_customers, user_audit_logs, order_items
- Columns: first_name, is_email_verified, created_at

However, in TypeScript, writing user.first_name or user.is_email_verified violates idiomatic conventions (camelCase for properties, PascalCase for classes and models). Forcing your TypeScript codebase to adopt database snake_case feels clumsy.

Prisma solves this dilemma with two mapping attributes:
- @map("column_name"): Applied directly to a field. In your TypeScript code, you write user.firstName, but Prisma sends queries to the underlying "first_name" column in SQL.
- @@map("table_name"): Applied at the bottom of a model block. In TypeScript, you write prisma.customer.findMany(), while Prisma targets the "tbl_customers" table in PostgreSQL.

Neither attribute alters your database schema. They act as a compile-time translation bridge.`,
          targetHero: {
            language: 'prisma',
            badge: 'Mapping Blueprint',
            explanation: 'TypeScript code accesses UserAccount and firstName; SQL queries run against user_accounts and first_name.',
            code: `model UserAccount {
  id        Int      @id @default(autoincrement())
  firstName String   @map("first_name")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("user_accounts")
}`
          },
          explanation: [
            '@map applies to individual columns, letting you rename fields in TypeScript without changing database columns.',
            '@@map applies to the whole model, letting you use clean PascalCase model names in TypeScript while querying legacy table names.',
            'Using @map and @@map is especially crucial when working with pre-existing databases or third-party database schemas.'
          ],
          keyTakeaway: 'Use @map for columns and @@map for tables to keep your TypeScript codebase idiomatic without altering database table schemas.',
          mcqs: [
            {
              id: 'mcq-2-2',
              question: 'What is the exact distinction between @map and @@map in Prisma?',
              options: [
                '@map is for models, while @@map is for fields',
                '@map maps an individual column name; @@map maps an entire table name',
                '@map is deprecated in modern Prisma',
                '@map only works with SQLite; @@map works with PostgreSQL'
              ],
              correctIndex: 1,
              explanation: 'A single @ directive operates on the field directly preceding it, whereas a double @@ directive operates on the entire model block.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-2-3',
            title: 'Task 1 (Guided): Map Customer Model and Email Column',
            description: 'Map model Customer to legacy table "tbl_customers" and field email to column "cust_email" in schema.prisma.',
            type: 'guided',
            targetModel: 'Customer',
            activeTab: 'schema',
            instructions: [
              'Add @map("cust_email") to field email',
              'Add @@map("tbl_customers") at the bottom of model Customer'
            ],
            initialCode: `model Customer {
  id    Int    @id @default(autoincrement())
  email String

  // Add @@map for tbl_customers
}`,
            solutionCode: `model Customer {
  id    Int    @id @default(autoincrement())
  email String @map("cust_email")

  @@map("tbl_customers")
}`,
            solutionExplanation: '@map("cust_email") maps the column, and @@map("tbl_customers") maps the table in PostgreSQL.',
            hints: [
              { level: 1, text: 'Append @map("cust_email") to the email line.' },
              { level: 2, text: 'Add @@map("tbl_customers") at the bottom of the Customer model.' }
            ],
            validation: {
              targetModel: 'Customer',
              codeContains: ['@map("cust_email")', '@@map("tbl_customers")']
            },
            successMessage: 'Great job! Clean TypeScript camelCase mapped to legacy database snake_case.'
          },
          {
            id: 'task-2-4',
            title: 'Task 2 (Independent): Map Phone & Registered Date Columns',
            description: 'Add snake_case mappings for phoneNumber -> phone_number and registeredAt -> registered_at on model Customer.',
            type: 'independent',
            targetModel: 'Customer',
            activeTab: 'schema',
            instructions: [
              'Map phoneNumber to "phone_number"',
              'Map registeredAt to "registered_at"'
            ],
            initialCode: `model Customer {
  id           Int      @id @default(autoincrement())
  phoneNumber  String
  registeredAt DateTime

  @@map("tbl_customers")
}`,
            solutionCode: `model Customer {
  id           Int      @id @default(autoincrement())
  phoneNumber  String   @map("phone_number")
  registeredAt DateTime @map("registered_at")

  @@map("tbl_customers")
}`,
            solutionExplanation: 'Both fields now translate cleanly to their respective snake_case SQL counterparts.',
            hints: [
              { level: 1, text: 'Use @map("phone_number") and @map("registered_at").' }
            ],
            validation: {
              targetModel: 'Customer',
              codeContains: ['@map("phone_number")', '@map("registered_at")']
            },
            successMessage: 'Well done! All fields mapped successfully.'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-02-challenge',
      title: 'Day 2 Challenge: Modernize an Introspected Auth Schema',
      scenario: 'Your engineering team used "prisma db pull" to introspect an existing legacy PostgreSQL database. The generated model uses raw snake_case table and column names. Clean up the AuthUser model so developers use clean camelCase properties while the database keeps its exact snake_case columns intact.',
      tasks: [
        {
          id: 'challenge-2-1',
          title: 'Map AuthUser Model and Columns',
          description: 'Map model AuthUser to "auth_users" and field passwordHash to "password_hash".',
          type: 'challenge',
          targetModel: 'AuthUser',
          activeTab: 'schema',
          instructions: [
            'Define model AuthUser with id Int @id @default(autoincrement())',
            'Map passwordHash String to "password_hash"',
            'Map model to "auth_users"'
          ],
          initialCode: `model AuthUser {
  id           Int    @id @default(autoincrement())
  passwordHash String

  // Add @@map
}`,
          solutionCode: `model AuthUser {
  id           Int    @id @default(autoincrement())
  passwordHash String @map("password_hash")

  @@map("auth_users")
}`,
          solutionExplanation: 'Ensures database table integrity while keeping TypeScript property naming clean and idiomatic.',
          hints: [{ level: 1, text: 'Use @map("password_hash") and @@map("auth_users").' }],
          validation: {
            targetModel: 'AuthUser',
            codeContains: ['@map("password_hash")', '@@map("auth_users")']
          },
          successMessage: 'AuthUser model and columns mapped successfully!'
        }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // DAY 3: Models, Fields, Enums & Constraints
  // ---------------------------------------------------------------------------
  {
    id: 'day-03',
    slug: 'models-fields-enums',
    day: 3,
    title: 'Day 3 — Models, Fields, Enums & Constraints',
    shortTitle: 'Models & Constraints',
    milestoneId: 'milestone-1',
    description: 'Design production-grade database schemas: choose appropriate scalar types, handle financial precision with Decimal, enforce valid domain values with Enums, and guarantee integrity with composite unique constraints.',
    estimatedMinutes: 50,
    completionLearnings: [
      'Understand why JavaScript floating-point numbers break financial math and why Prisma Decimal is required',
      'Model optional fields (?) vs required fields and use @updatedAt for automated audit timestamps',
      'Declare native PostgreSQL Enums and configure default values',
      'Enforce multi-column uniqueness using composite constraints like @@unique([studentId, courseId])'
    ],
    concepts: [
      {
        id: 'day-03-concept-1',
        order: 1,
        title: 'Scalar Types, Nullability & The Precision Problem',
        shortDescription: 'Why floating-point numbers corrupt financial data, how cuid() provides distributed IDs, and how nullability works in schema.prisma.',
        theory: {
          summary: `In TypeScript and JavaScript, all standard numbers are 64-bit binary floating-point numbers (IEEE 754). This creates subtle calculation errors:
0.1 + 0.2 // equals 0.30000000000000004!

If you use Float to store prices, account balances, or financial transactions, rounding errors will eventually corrupt your accounting ledger. Prisma provides Decimal to represent arbitrary-precision fixed-point numbers mapped directly to PostgreSQL's native DECIMAL/NUMERIC types.

Beyond scalar types, schema.prisma enforces strict nullability:
- title String: Stored as NOT NULL in SQL. TypeScript infers string.
- description String?: Stored as NULL in SQL. TypeScript infers string | null.

For identifiers, autoincrementing integers (1, 2, 3...) are predictable and expose your database record count. Modern distributed systems frequently use cuid() or uuid() to generate collision-resistant string IDs on the client or server without roundtrips.`,
          targetHero: {
            language: 'prisma',
            badge: 'Production Field Design',
            explanation: 'Demonstrating cuid IDs, Decimal precision for money, optional fields, and automatic timestamps.',
            code: `model Product {
  id          String   @id @default(cuid())
  sku         String   @unique
  title       String
  description String?  // Optional field
  price       Decimal  // Arbitrary-precision decimal for currency
  inStock     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt // Automatically updated on every save!
}`
          },
          explanation: [
            'Always use Decimal instead of Float for prices and monetary amounts to prevent binary rounding bugs.',
            'The question mark (?) denotes optionality. In TypeScript, it translates to string | null.',
            '@updatedAt is automatically maintained by the Prisma engine on every update query.'
          ],
          keyTakeaway: 'Use Decimal for financial values to prevent rounding inaccuracies, and use ? to indicate nullable fields.',
          mcqs: [
            {
              id: 'mcq-3-1',
              question: 'Why should you choose Decimal instead of Float for storing monetary amounts in Prisma?',
              options: [
                'PostgreSQL does not support Float columns',
                'Float suffers from binary floating-point rounding inaccuracies (e.g. 0.1 + 0.2 !== 0.3), while Decimal provides exact precision',
                'Decimal columns take up less storage space than Float',
                'Float requires manual migrations while Decimal does not'
              ],
              correctIndex: 1,
              explanation: 'Decimal maps to SQL NUMERIC/DECIMAL, preserving exact precision for currency and financial calculations.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-3-1',
            title: 'Task 1 (Guided): Create Product Model with Precision Types',
            description: 'Create a Product model with a cuid() id, required title, optional description (String?), Decimal price, and automated timestamps.',
            type: 'guided',
            targetModel: 'Product',
            activeTab: 'schema',
            instructions: [
              'Model Product with id String @id @default(cuid())',
              'title String',
              'description String?',
              'price Decimal',
              'createdAt DateTime @default(now())',
              'updatedAt DateTime @updatedAt'
            ],
            initialCode: `// Define the Product model:
`,
            solutionCode: `model Product {
  id          String   @id @default(cuid())
  title       String
  description String?
  price       Decimal
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}`,
            solutionExplanation: 'Creates Product model with cuid primary key, nullable description, and timestamp directives.',
            hints: [
              { level: 1, text: 'Use "model Product { ... }".' },
              { level: 2, text: 'Mark description as String? and updatedAt with @updatedAt.' }
            ],
            validation: {
              targetModel: 'Product',
              codeContains: ['@id', '@default(cuid())', 'String?', 'Decimal', '@updatedAt']
            },
            successMessage: 'Great job! Model Product matches modern schema standards.'
          },
          {
            id: 'task-3-2',
            title: 'Task 2 (Independent): Create Article Model with Unique Slug',
            description: 'Define an Article model with autoincrement ID, unique slug, title, isPublished default false, and createdAt.',
            type: 'independent',
            targetModel: 'Article',
            activeTab: 'schema',
            instructions: [
              'id Int @id @default(autoincrement())',
              'slug String @unique',
              'title String',
              'isPublished Boolean @default(false)',
              'createdAt DateTime @default(now())'
            ],
            initialCode: `// Define the Article model:
`,
            solutionCode: `model Article {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  title       String
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
}`,
            solutionExplanation: 'Enforces uniqueness on slug and defaults isPublished to false.',
            hints: [
              { level: 1, text: 'Add @unique to the slug field and @default(false) to isPublished.' }
            ],
            validation: {
              targetModel: 'Article',
              codeContains: ['@id', '@default(autoincrement())', '@unique', '@default(false)']
            },
            successMessage: 'Well done! Model Article defined with unique constraint.'
          }
        ]
      },
      {
        id: 'day-03-concept-2',
        order: 2,
        title: 'Enforcing Invariants: Enums & Multi-Field Constraints',
        shortDescription: 'How Enums eliminate arbitrary string bugs, and how composite constraints (@@unique, @@id) prevent duplicate data in relational tables.',
        theory: {
          summary: `Storing status values as raw strings (e.g. status String) is an anti-pattern. A typo like "pendng" or "canclled" will bypass TypeScript if passed dynamically and corrupt database state.

Prisma solves this with Enums:
enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

Prisma creates a native PostgreSQL ENUM type. At the database engine level, PostgreSQL rejects any value not in the enum list, storing the value as a compact 4-byte internal identifier.

Furthermore, many domain rules require multi-column uniqueness. For example, a student can enroll in multiple courses, and a course has many students. But a student must never be allowed to enroll in the same course twice! Placing @unique on studentId prevents multiple courses; placing @unique on courseId limits the course to one student. The correct solution is a composite unique constraint:
@@unique([studentId, courseId])

This tells PostgreSQL: allow multiple occurrences of studentId and courseId, but the combination of both must remain strictly unique.`,
          targetHero: {
            language: 'prisma',
            badge: 'Composite Constraints Pattern',
            explanation: 'Combining Enums with multi-column composite constraints for domain integrity.',
            code: `enum Role {
  USER
  EDITOR
  ADMIN
}

model Membership {
  userId String
  orgId  String
  role   Role   @default(USER)

  @@id([userId, orgId])
  @@index([role])
}`
          },
          explanation: [
            'Enums restrict column values to a finite set validated at both compile time and database level.',
            '@@unique([colA, colB]) guarantees that no two rows can have the same combination of values.',
            '@@id([colA, colB]) establishes a composite primary key formed by multiple columns.'
          ],
          keyTakeaway: 'Use Enums to prevent invalid status strings, and use composite constraints to prevent duplicate enrollments, favorites, or memberships.',
          mcqs: [
            {
              id: 'mcq-3-2',
              question: 'When should you declare @@unique([studentId, courseId]) instead of putting @unique on studentId?',
              options: [
                'When each student can only enroll in a single course in their entire life',
                'When students can enroll in multiple courses, but must not be enrolled in the exact same course twice',
                'When each course can only have one enrolled student',
                'When you want course IDs to be generated automatically'
              ],
              correctIndex: 1,
              explanation: 'A composite unique constraint guarantees that the pair (studentId, courseId) is unique, preventing duplicate enrollments while allowing students to take multiple courses.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-3-3',
            title: 'Task 1 (Guided): Define OrderStatus Enum & Order Model',
            description: 'Define enum OrderStatus with PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, and attach it to model Order.',
            type: 'guided',
            targetModel: 'Order',
            activeTab: 'schema',
            instructions: [
              'Define enum OrderStatus with the 5 statuses',
              'Model Order with id Int @id @default(autoincrement()), status OrderStatus @default(PENDING), and total Decimal'
            ],
            initialCode: `// Define enum OrderStatus and model Order:
`,
            solutionCode: `enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model Order {
  id     Int         @id @default(autoincrement())
  status OrderStatus @default(PENDING)
  total  Decimal
}`,
            solutionExplanation: 'Defines an enum in the database and references it as a field type on Order.',
            hints: [
              { level: 1, text: 'Use "enum OrderStatus { PENDING PROCESSING SHIPPED DELIVERED CANCELLED }".' },
              { level: 2, text: 'In model Order, set "status OrderStatus @default(PENDING)".' }
            ],
            validation: {
              targetModel: 'Order',
              codeContains: ['enum OrderStatus', 'PENDING', 'OrderStatus', '@default(PENDING)']
            },
            successMessage: 'Great work! OrderStatus enum provides robust domain constraints.'
          },
          {
            id: 'task-3-4',
            title: 'Task 2 (Independent): Add Composite Unique Constraint to Enrollment',
            description: 'Prevent duplicate student enrollments by adding @@unique([studentId, courseId]).',
            type: 'independent',
            targetModel: 'CourseEnrollment',
            activeTab: 'schema',
            instructions: [
              'Add @@unique([studentId, courseId]) inside model CourseEnrollment'
            ],
            initialCode: `model CourseEnrollment {
  id         Int      @id @default(autoincrement())
  studentId  String
  courseId   String
  enrolledAt DateTime @default(now())
  // Add composite unique constraint
}`,
            solutionCode: `model CourseEnrollment {
  id         Int      @id @default(autoincrement())
  studentId  String
  courseId   String
  enrolledAt DateTime @default(now())

  @@unique([studentId, courseId])
}`,
            solutionExplanation: '@@unique([studentId, courseId]) instructs PostgreSQL to enforce unique pairs.',
            hints: [
              { level: 1, text: 'Write @@unique([studentId, courseId]) at the bottom of the model.' }
            ],
            validation: {
              targetModel: 'CourseEnrollment',
              codeContains: ['@@unique([studentId, courseId])']
            },
            successMessage: 'Excellent! Duplicate enrollments are prevented at the database level.'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-03-challenge',
      title: 'Day 3 Challenge: Design an E-Commerce Favorites System',
      scenario: 'Your e-commerce platform needs a favorites system where users can favorite products. A user can favorite multiple products, and a product can be favorited by multiple users. Design a UserFavorite join model with composite primary key @@id([userId, productId]).',
      tasks: [
        {
          id: 'challenge-3-1',
          title: 'Design UserFavorite Composite Model',
          description: 'Create model UserFavorite with userId Int, productId Int, favoritedAt DateTime @default(now()), and composite primary key @@id([userId, productId]).',
          type: 'challenge',
          targetModel: 'UserFavorite',
          activeTab: 'schema',
          instructions: [
            'Define model UserFavorite',
            'Add userId Int and productId Int',
            'Add favoritedAt DateTime @default(now())',
            'Add @@id([userId, productId])'
          ],
          initialCode: `// Define model UserFavorite with composite primary key:
`,
          solutionCode: `model UserFavorite {
  userId      Int
  productId   Int
  favoritedAt DateTime @default(now())

  @@id([userId, productId])
}`,
          solutionExplanation: 'Creates a clean join model with composite primary key.',
          hints: [{ level: 1, text: 'Use @@id([userId, productId]) to create the composite key.' }],
          validation: {
            targetModel: 'UserFavorite',
            codeContains: ['@@id([userId, productId])']
          },
          successMessage: 'UserFavorite composite model configured!'
        }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // DAY 4: Relational Schema Modeling (1:1, 1:N, M:N)
  // ---------------------------------------------------------------------------
  {
    id: 'day-04',
    slug: 'relations-modeling',
    day: 4,
    title: 'Day 4 — Relational Schema Modeling (1:1, 1:N, M:N)',
    shortTitle: 'Relations Modeling',
    milestoneId: 'milestone-1',
    description: 'Master relational modeling in Prisma: understand how foreign keys connect tables, why scalar fields differ from relation fields, enforce 1:1 uniqueness, and model explicit many-to-many join tables.',
    estimatedMinutes: 55,
    completionLearnings: [
      'Differentiate physical foreign key columns (authorId Int) from virtual TypeScript relation fields (author User)',
      'Understand why 1-to-1 relations require @unique on the foreign key to avoid accidentally creating a 1-to-Many relation',
      'Model optional relations using nullable foreign keys (Int?)',
      'Compare Prisma implicit many-to-many relations with explicit join models'
    ],
    concepts: [
      {
        id: 'day-04-concept-1',
        order: 1,
        title: 'One-to-Many (1:N): Scalar Columns vs Virtual Relation Fields',
        shortDescription: 'How foreign keys link tables, and why Prisma cleanly separates the SQL column from the TypeScript navigation property.',
        theory: {
          summary: `In relational databases, relationships are formed using Foreign Keys. In a One-to-Many (1:N) relationship (e.g. an Author has many Books), the foreign key column always lives on the "Many" table (Book).

Prisma introduces a clean architectural distinction that avoids confusion:
1. The Scalar Field (authorId Int):
   This is the actual, physical integer column stored in your PostgreSQL table.
2. The Relation Field (author Author @relation(...)):
   This field does NOT exist as a column in PostgreSQL! It is a virtual navigation property used exclusively in TypeScript to navigate relations and perform typed joins with include or select.

The @relation attribute binds the virtual field to the physical foreign key:
@relation(fields: [authorId], references: [id])
- fields: [authorId] points to the scalar column on this model.
- references: [id] points to the target primary key on the referenced model.`,
          targetHero: {
            language: 'prisma',
            badge: '1-to-Many Architecture',
            explanation: 'Book holds the physical authorId column. Author holds the virtual books relation array.',
            code: `model Author {
  id    Int    @id @default(autoincrement())
  name  String
  books Book[] // Virtual relation array (not a database column)
}

model Book {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int    // Physical SQL foreign key column
  author   Author @relation(fields: [authorId], references: [id])
}`
          },
          explanation: [
            'The model on the "Many" side holds the foreign key scalar column (authorId Int).',
            'The relation field (author Author) is a virtual TypeScript property that enables eager loading with include.',
            'Optional 1:N: Setting authorId Int? allows child records to exist without being bound to a parent record.'
          ],
          keyTakeaway: 'In Prisma 1:N relations, the model that holds the foreign key defines @relation(fields: [...], references: [...]).',
          mcqs: [
            {
              id: 'mcq-4-1',
              question: 'In a 1-to-Many relationship between Author and Book, which model holds the actual database foreign key column?',
              options: [
                'Author holds bookId',
                'Book holds authorId',
                'Both models hold foreign keys',
                'Prisma generates a separate join table automatically'
              ],
              correctIndex: 1,
              explanation: 'The "Many" side (Book) holds the foreign key scalar column pointing back to the primary key of Author.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-4-1',
            title: 'Task 1 (Guided): Connect Author and Book (1:N)',
            description: 'Add foreign key authorId and relation field author to model Book referencing Author.id.',
            type: 'guided',
            targetModel: 'Book',
            activeTab: 'schema',
            instructions: [
              'In model Book, add authorId Int',
              'Add author Author @relation(fields: [authorId], references: [id])'
            ],
            initialCode: `model Author {
  id    Int    @id @default(autoincrement())
  name  String
  books Book[]
}

model Book {
  id    Int    @id @default(autoincrement())
  title String
  // Add authorId and author relation
}`,
            solutionCode: `model Author {
  id    Int    @id @default(autoincrement())
  name  String
  books Book[]
}

model Book {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
  author   Author @relation(fields: [authorId], references: [id])
}`,
            solutionExplanation: 'Configures foreign key authorId referencing Author.id.',
            hints: [
              { level: 1, text: 'Add "authorId Int".' },
              { level: 2, text: 'Add "author Author @relation(fields: [authorId], references: [id])".' }
            ],
            validation: {
              targetModel: 'Book',
              codeContains: ['authorId Int', 'author Author @relation']
            },
            successMessage: 'Great job! 1:N relationship between Author and Book established.'
          },
          {
            id: 'task-4-2',
            title: 'Task 2 (Independent): Optional 1:N Relation (Company & Employee)',
            description: 'Model a 1-to-Many relation where companyId is optional (Int?) allowing unassigned employees.',
            type: 'independent',
            targetModel: 'Employee',
            activeTab: 'schema',
            instructions: [
              'In model Employee, add companyId Int?',
              'Add company Company? @relation(fields: [companyId], references: [id])'
            ],
            initialCode: `model Company {
  id        Int        @id @default(autoincrement())
  name      String
  employees Employee[]
}

model Employee {
  id   Int    @id @default(autoincrement())
  name String
  // Define optional companyId and company relation
}`,
            solutionCode: `model Company {
  id        Int        @id @default(autoincrement())
  name      String
  employees Employee[]
}

model Employee {
  id        Int      @id @default(autoincrement())
  name      String
  companyId Int?
  company   Company? @relation(fields: [companyId], references: [id])
}`,
            solutionExplanation: 'Using Int? and Company? permits null foreign keys in SQL.',
            hints: [
              { level: 1, text: 'Both companyId and company must be optional (Int?, Company?).' }
            ],
            validation: {
              targetModel: 'Employee',
              codeContains: ['companyId Int?', 'company Company? @relation']
            },
            successMessage: 'Well done! Optional foreign keys correctly configured.'
          }
        ]
      },
      {
        id: 'day-04-concept-2',
        order: 2,
        title: 'One-to-One (1:1): The @unique Mandate',
        shortDescription: 'Why omitting @unique on a foreign key accidentally creates a 1:Many relation, and how 1:1 relations enforce strict pairing.',
        theory: {
          summary: `A One-to-One (1:1) relationship links exactly one record to at most one other record (such as a User and their private Profile, or a Driver and their License).

Syntactically, a 1:1 relation looks almost identical to a 1:N relation. There is only one critical difference:
The foreign key scalar field MUST have the @unique constraint!

Why is @unique mandatory?
If userId Int does NOT have @unique, nothing stops multiple Profile records from pointing to the same User #1. That would be a One-to-Many relationship. By placing @unique on userId:
userId Int @unique

PostgreSQL enforces that no two Profile rows can ever have the same userId, guaranteeing a strict 1:1 pairing. If you omit @unique, Prisma schema validation will halt with a compile error.`,
          targetHero: {
            language: 'prisma',
            badge: '1-to-1 Architecture',
            explanation: '@unique on userId guarantees that each User has at most one Profile.',
            code: `model User {
  id      Int      @id @default(autoincrement())
  profile Profile? // Optional 1:1 reference
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique // MANDATORY: @unique turns 1:N into 1:1!
  user   User   @relation(fields: [userId], references: [id])
}`
          },
          explanation: [
            'Without @unique on the foreign key, the database permits multiple child rows per parent (1:Many).',
            'With @unique, the database guarantees that at most one child row can reference a given parent (1:1).',
            'In Prisma, the parent model typically marks the relation as optional (Profile?) because a User might not have a profile yet.'
          ],
          keyTakeaway: 'Always place @unique on the foreign key field in a 1:1 relationship.',
          mcqs: [
            {
              id: 'mcq-4-2',
              question: 'What happens if you omit @unique on the foreign key field of a 1:1 relation in Prisma?',
              options: [
                'Prisma silently ignores it and creates a 1:1 relation anyway',
                'Prisma schema validation flags an error because without @unique the relation is a 1-to-Many',
                'The database deletes the parent record on startup',
                'TypeScript automatically forces uniqueness at runtime'
              ],
              correctIndex: 1,
              explanation: 'Prisma validation requires @unique on the foreign key of a 1:1 relation because without a unique constraint, PostgreSQL would permit multiple child records pointing to the same parent.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-4-3',
            title: 'Task 1 (Guided): Connect Account and AccountSettings (1:1)',
            description: 'Create a 1:1 relation between Account and AccountSettings, enforcing @unique on accountId.',
            type: 'guided',
            targetModel: 'AccountSettings',
            activeTab: 'schema',
            instructions: [
              'Add accountId Int @unique to AccountSettings',
              'Add account Account @relation(fields: [accountId], references: [id])'
            ],
            initialCode: `model Account {
  id       Int              @id @default(autoincrement())
  email    String           @unique
  settings AccountSettings?
}

model AccountSettings {
  id        Int     @id @default(autoincrement())
  darkMode  Boolean @default(false)
  // Add foreign key accountId and relation to Account
}`,
            solutionCode: `model Account {
  id       Int              @id @default(autoincrement())
  email    String           @unique
  settings AccountSettings?
}

model AccountSettings {
  id        Int     @id @default(autoincrement())
  darkMode  Boolean @default(false)
  accountId Int     @unique
  account   Account @relation(fields: [accountId], references: [id])
}`,
            solutionExplanation: 'accountId @unique guarantees only one AccountSettings row per Account.',
            hints: [
              { level: 1, text: 'Define accountId Int @unique.' },
              { level: 2, text: 'Define account Account @relation(fields: [accountId], references: [id]).' }
            ],
            validation: {
              targetModel: 'AccountSettings',
              codeContains: ['accountId Int @unique', 'account Account @relation']
            },
            successMessage: 'Great job! 1:1 relationship successfully modeled.'
          },
          {
            id: 'task-4-4',
            title: 'Task 2 (Independent): Fix 1:1 Unique Constraint Bug',
            description: 'Fix a schema issue where omitting @unique caused relation validation failure.',
            type: 'independent',
            targetModel: 'License',
            activeTab: 'schema',
            instructions: [
              'Add @unique to driverId in model License'
            ],
            initialCode: `model Driver {
  id      Int      @id @default(autoincrement())
  license License?
}

model License {
  id       Int    @id @default(autoincrement())
  number   String @unique
  driverId Int
  driver   Driver @relation(fields: [driverId], references: [id])
}`,
            solutionCode: `model Driver {
  id      Int      @id @default(autoincrement())
  license License?
}

model License {
  id       Int    @id @default(autoincrement())
  number   String @unique
  driverId Int    @unique
  driver   Driver @relation(fields: [driverId], references: [id])
}`,
            solutionExplanation: 'driverId @unique enforces that each driver has at most one license.',
            hints: [{ level: 1, text: 'Change "driverId Int" to "driverId Int @unique".' }],
            validation: {
              targetModel: 'License',
              codeContains: ['driverId Int @unique']
            },
            successMessage: 'Fixed! Adding @unique satisfies the 1:1 relation requirement.'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-04-challenge',
      title: 'Day 4 Challenge: Model a Hospital Doctor-Patient Relational Graph',
      scenario: 'A healthcare SaaS platform needs relational models for Doctor and Appointment. A Doctor has many Appointments, and an Appointment belongs to exactly one Doctor. Model this 1-to-Many relationship with proper foreign keys.',
      tasks: [
        {
          id: 'challenge-4-1',
          title: 'Model Doctor-Appointment 1:N Relationship',
          description: 'In model Appointment, add doctorId Int and doctor relation referencing Doctor.id. In model Doctor, add appointments Appointment[].',
          type: 'challenge',
          targetModel: 'Appointment',
          activeTab: 'schema',
          instructions: [
            'In model Doctor, add appointments Appointment[]',
            'In model Appointment, add doctorId Int',
            'In model Appointment, add doctor Doctor @relation(fields: [doctorId], references: [id])'
          ],
          initialCode: `model Doctor {
  id           Int    @id @default(autoincrement())
  name         String
  specialty    String
  // Add appointments relation
}

model Appointment {
  id          Int      @id @default(autoincrement())
  scheduledAt DateTime
  // Add doctorId and doctor relation
}`,
          solutionCode: `model Doctor {
  id           Int           @id @default(autoincrement())
  name         String
  specialty    String
  appointments Appointment[]
}

model Appointment {
  id          Int      @id @default(autoincrement())
  scheduledAt DateTime
  doctorId    Int
  doctor      Doctor   @relation(fields: [doctorId], references: [id])
}`,
          solutionExplanation: 'Establishes a type-safe 1:N relation with doctorId foreign key.',
          hints: [
            { level: 1, text: 'In Doctor: appointments Appointment[]. In Appointment: doctorId Int and doctor Doctor @relation(...).' }
          ],
          validation: {
            targetModel: 'Appointment',
            codeContains: ['appointments Appointment[]', 'doctorId Int', 'doctor Doctor @relation']
          },
          successMessage: 'Outstanding! Doctor-Appointment relational model is production-ready.'
        }
      ]
    }
  }
];
