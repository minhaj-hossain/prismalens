// =============================================================================
// MILESTONE 1: DAYS 1 TO 4
// =============================================================================

import { ModuleData } from '../../types/curriculum';

export const MILESTONE_1_MODULES: ModuleData[] = [
  // ---------------------------------------------------------------------------
  // DAY 1: Why Prisma?
  // ---------------------------------------------------------------------------
  {
    id: 'day-01',
    slug: 'why-prisma',
    day: 1,
    title: 'Day 1 — Why Prisma?',
    shortTitle: 'Why Prisma?',
    milestoneId: 'milestone-1',
    description: 'See how Prisma makes database work easier to write, understand, and maintain in a TypeScript application.',
    estimatedMinutes: 45,
    completionLearnings: [
      'Understand why database data and TypeScript code do not naturally use the same types and structure',
      'Understand how schema.prisma, Prisma Client, and Prisma Migrate fit together',
      'Write a simple Prisma Client query and understand what it does in the database'
    ],
    concepts: [
      {
        id: 'day-01-concept-1',
        order: 1,
        title: 'Why Databases and TypeScript Disagree (and How Prisma Fixes It)',
        shortDescription: 'Why SQL strings are invisible to TypeScript and how Prisma gives your backend a generated, strongly typed database API.',
        theory: {
          summary: `When you query a database using SQL drivers in Node.js, SQL is treated as a plain string: db.query('SELECT id, name, email FROM users WHERE id = $1', [userId]).

TypeScript cannot inspect or type-check the contents of an arbitrary SQL string. It sees a function call returning an untyped driver result. If a database column is renamed or removed, TypeScript cannot warn you—the mismatch is only discovered when that query runs.

Prisma solves this by generating strongly typed client methods directly from your schema.prisma file. Prisma Client uses generated types based on your schema, allowing TypeScript to catch invalid model names, misspelled fields, and incorrect argument types while you type your code. Prisma does not replace SQL; SQL remains the language executed by the database, while Prisma provides a type-checked API to work with it.`,
          targetHero: {
            language: 'typescript',
            badge: 'Example Query',
            explanation: 'Your query determines the shape of the returned TypeScript value. With select, Prisma infers only the chosen fields on the returned user.',
            code: `// Your query determines the shape of the returned TypeScript value
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    name: true,
    email: true
  }
});
// TypeScript infers: { id: number; name: string; email: string } | null`
          },
          explanation: [
            'Working directly with SQL gives you precise control over the database, but TypeScript does not automatically know what fields a particular SQL string will return.',
            'Prisma Client uses generated types from your Prisma schema, so TypeScript catches invalid model names, field names, and query arguments while you write code.',
            'Prisma does not replace SQL. It gives your TypeScript application a higher-level, strongly typed API, while SQL remains the underlying language the relational database executes.'
          ],
          stepBreakdowns: [
            {
              stepNumber: 1,
              stepTitle: 'Working directly with SQL',
              codeSnippet: `const result = await db.query(
  'SELECT id, name, email FROM users WHERE id = $1',
  [userId]
);

// TypeScript does not derive the returned row shape from this SQL string:
const user = result.rows[0];`,
              explanation: 'TypeScript treats SQL as an opaque string. If the database schema changes but the SQL string is not updated, the mismatch is usually only discovered when that query executes at runtime.'
            },
            {
              stepNumber: 2,
              stepTitle: 'Querying with Prisma Client',
              codeSnippet: `const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, name: true, email: true }
});
// Inferred result: { id: number; name: string; email: string } | null`,
              explanation: 'Prisma validates model names, field names, and input types while you write. The fields you specify in select determine the exact TypeScript shape of the returned record.'
            }
          ],
          keyTakeaway: 'Prisma gives your TypeScript backend a generated, strongly typed API for working with your database, while SQL remains the underlying language of the database.',
          commonMistakes: [
            'Assuming Prisma replaces SQL knowledge: Prisma generates SQL queries under the hood, and understanding database concepts remains essential.',
            'Using "as any" to bypass TypeScript errors instead of fixing invalid field names against the schema.'
          ],
          mcqs: [
            {
              id: 'mcq-1-1',
              question: 'Why can Prisma catch a typo like "where: { user_mail: email }" before the code runs?',
              options: [
                'PostgreSQL checks the query string before TypeScript compiles',
                'Prisma Client has generated types based on the Prisma schema',
                'Express validates Prisma queries automatically at build time',
                'TypeScript natively understands raw SQL queries without tools'
              ],
              correctIndex: 1,
              explanation: 'Prisma generates TypeScript type definitions from your schema.prisma models, allowing TypeScript to flag any property that does not exist on the model.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-1-1',
            title: 'Task 1 (Guided): Read and Shape a Prisma Query',
            description: 'Inspect a Prisma query that requests specific fields with select, and complete the query to return only id and name.',
            type: 'guided',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Call prisma.user.findUnique',
              'Set where: { id: userId }',
              'Use select: { id: true, name: true } to return only id and name'
            ],
            initialCode: `// In Prisma, your query determines the shape of the returned value.
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
            solutionExplanation: 'Using findUnique with where: { id: userId } queries by unique identifier, and select restricts returned fields to id and name, giving you a lean, inferred return type.',
            hints: [
              { level: 1, text: 'Use the "select" option inside findUnique.' },
              { level: 2, text: 'Add "select: { id: true, name: true }" to only retrieve those two columns.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'findUnique',
              requiredWhereClauses: ['id'],
              requiredFieldsInSelect: ['id', 'name']
            },
            successMessage: 'Well done! Notice how select directly controls both the SQL columns queried and the inferred TypeScript shape.'
          },
          {
            id: 'task-1-2',
            title: 'Task 2 (Guided): Write a findUnique Query by Unique Email',
            description: 'Write a type-safe findUnique query looking up a user by their unique email address, selecting id, name, and email.',
            type: 'guided',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Call prisma.user.findUnique',
              'Pass where: { email } to filter by unique email',
              'Use select to return id, name, and email'
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
            solutionExplanation: 'findUnique targets fields marked @unique or @id in schema.prisma. Passing email in where accurately identifies a single user.',
            hints: [
              { level: 1, text: 'Return await prisma.user.findUnique({ where: { email }, select: { ... } });' },
              { level: 2, text: 'Include id: true, name: true, and email: true inside the select object.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'findUnique',
              requiredWhereClauses: ['email'],
              requiredFieldsInSelect: ['id', 'name', 'email']
            },
            successMessage: 'Great work! You wrote a clean findUnique query with explicit field selection.'
          },
          {
            id: 'task-1-3',
            title: 'Task 3 (Independent): Fix an Invalid Field Name (Without "as any")',
            description: 'A developer used "as any" to silence TypeScript on a nonexistent field user_mail. Fix the query to use the schema-defined email field without any type bypasses.',
            type: 'independent',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Remove "as any" from the query argument',
              'Replace the nonexistent field user_mail with email in the where filter',
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
            solutionExplanation: 'In Prisma, where arguments must match actual model fields defined in schema.prisma. Removing "as any" restores TypeScript compile-time verification.',
            hints: [
              { level: 1, text: 'Delete "as any" and change user_mail to email.' },
              { level: 2, text: 'Add select: { id: true, email: true } for a clean return shape.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'findUnique',
              requiredWhereClauses: ['email']
            },
            successMessage: 'Awesome job! You fixed the query bug without resorting to type-silencing hacks.'
          }
        ]
      },
      {
        id: 'day-01-concept-2',
        order: 2,
        title: 'How Prisma Fits Together (Schema, Client & Migrate)',
        shortDescription: 'How schema.prisma, generated Prisma Client, and Prisma Migrate connect your TypeScript backend to your database.',
        theory: {
          summary: `Prisma consists of three coordinated tools that work together in your application workflow:

1. schema.prisma — The central schema definition that describes your data models, relations, and generator settings.
2. Prisma Client — The strongly typed query builder generated directly from your schema, which you import into your backend code to query the database.
3. Prisma Migrate — The CLI tool that reads changes in schema.prisma, creates versioned SQL migration files, and applies them to your database.

Editing schema.prisma does not automatically alter your live database tables. When you change a model in schema.prisma, Prisma Migrate generates and executes the SQL DDL needed to update your database, and Prisma Client generates fresh TypeScript types so your code immediately reflects the new schema.`,
          targetHero: {
            language: 'prisma',
            badge: 'Central Schema Definition',
            explanation: 'In modern Prisma, the generator block configures where and how Prisma Client is generated, while datasource configures the database connection.',
            code: `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}`
          },
          explanation: [
            'The Prisma schema describes your data models and tells Prisma how to generate the client.',
            'Prisma Client is generated from your schema into your project, giving you auto-completed, type-checked methods like prisma.user.findUnique().',
            'Prisma Migrate translates schema changes into versioned SQL migrations and runs them against your database.',
            "Don't duplicate Prisma's generated database types unnecessarily. Use Prisma's inferred types where they fit, and define separate application or API types (such as DTOs) when you need a different shape."
          ],
          stepBreakdowns: [
            {
              stepNumber: 1,
              stepTitle: 'Describe data in schema.prisma',
              codeSnippet: `model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}`,
              explanation: 'You define models, attributes (@id, @unique), and scalar types in schema.prisma.'
            },
            {
              stepNumber: 2,
              stepTitle: 'Generate and query with Prisma Client',
              codeSnippet: `import { prisma } from './db';

const user = await prisma.user.findUnique({
  where: { email: 'alice@example.com' }
});`,
              explanation: 'Running "prisma generate" creates Prisma Client with types tailored to your User model.'
            }
          ],
          keyTakeaway: 'schema.prisma defines your data models, Prisma Client gives your TypeScript code a typed query API, and Prisma Migrate manages changes to your database schema.',
          commonMistakes: [
            'Assuming modifying schema.prisma automatically updates live database tables without running a migration.',
            'Thinking generator client is the Prisma Client itself: the generator block simply configures how and where the client is generated.'
          ],
          mcqs: [
            {
              id: 'mcq-1-2',
              question: 'What happens when you add a new field to schema.prisma?',
              options: [
                'The live database tables are immediately updated in real time without any commands',
                'You must run a migration to update the database, and generate Prisma Client to update TypeScript types',
                'Prisma deletes and recreates all database tables automatically',
                'TypeScript automatically writes the SQL ALTER TABLE command on save'
              ],
              correctIndex: 1,
              explanation: 'Editing schema.prisma updates your schema definition. You then use Prisma Migrate to apply SQL changes to your database and generate Prisma Client to refresh TypeScript types.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-1-4',
            title: 'Task 1 (Guided): Querying with Precise Field Shape',
            description: 'Write a query function to retrieve only the id and email of a user for authentication verification, observing how select restricts both the returned SQL columns and the TypeScript inferred shape.',
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
            solutionExplanation: 'select shapes the SQL query to only fetch id and email from the users table, and TypeScript infers { id: number; email: string } | null.',
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
          },
          {
            id: 'task-1-5',
            title: 'Task 2 (Independent): Retrieve Public Profile Fields',
            description: 'Complete the getPublicProfile function to look up a user by their unique email and select only name and email.',
            type: 'independent',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Call prisma.user.findUnique',
              'Filter by where: { email }',
              'Use select to return only name and email'
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
            solutionExplanation: 'Selecting name and email ensures internal fields like passwords or timestamps are never fetched or leaked.',
            hints: [
              { level: 1, text: 'Pass where: { email }.' },
              { level: 2, text: 'Include select: { name: true, email: true }.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'findUnique',
              requiredWhereClauses: ['email'],
              requiredFieldsInSelect: ['name', 'email']
            },
            successMessage: 'Well done! Inferred types cleanly match your selected fields.'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-01-challenge',
      title: 'Day 1 Challenge: Replace a Legacy User Lookup',
      scenario: 'Your team is refactoring a legacy Express service. You need to replace an untyped raw SQL helper with a strongly typed Prisma query that retrieves a user by their unique email.',
      tasks: [
        {
          id: 'challenge-1-1',
          title: 'Replace Legacy User Lookup with Typed Prisma Query',
          description: 'Rewrite the legacy getUser function to find a user by email using prisma.user.findUnique. Select only id, name, and email without using raw SQL or "as any".',
          type: 'challenge',
          targetModel: 'user',
          activeTab: 'editor',
          instructions: [
            'Use prisma.user.findUnique',
            'Filter by where: { email }',
            'Select only id, name, and email',
            'Do not use raw SQL strings or "as any"'
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
          solutionExplanation: 'findUnique is designed for fields that uniquely identify one record, such as a primary key or a field marked @unique. The select object ensures only the requested fields are returned, and TypeScript infers the exact shape { id: number; name: string; email: string } | null.',
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
  // DAY 2: Modern Prisma v7 Setup & Configuration
  // ---------------------------------------------------------------------------
  {
    id: 'day-02',
    slug: 'prisma-setup-v7',
    day: 2,
    title: 'Modern Prisma v7 Setup & Configuration',
    shortTitle: 'Setup & CLI Tooling',
    milestoneId: 'milestone-1',
    description: 'Create a working Prisma + PostgreSQL project, understand Prisma CLI tooling, manage connection pooling, and use introspection (db pull).',
    estimatedMinutes: 45,
    completionLearnings: [
      'Mastered essential Prisma CLI commands: init, generate, db pull, and studio',
      'Configured connection pooling strings with PgBouncer query parameters',
      'Mapped snake_case database tables to camelCase TypeScript models with @map and @@map'
    ],
    concepts: [
      {
        id: 'day-02-concept-1',
        order: 1,
        title: 'Prisma CLI Commands & Lifecycle',
        shortDescription: 'Master npx prisma generate, db pull, and connection pooling configuration.',
        theory: {
          summary: 'Prisma CLI is your developer cockpit: "npx prisma generate" reads schema.prisma and compiles typed models into node_modules/@prisma/client. In production serverless setups, connection pooling parameters (pgbouncer=true) prevent database connection exhaustion.',
          targetHero: {
            language: 'bash',
            badge: 'Developer Lifecycle Commands',
            explanation: 'Running generate recompiles types whenever schema.prisma changes.',
            code: `# Initialize a new Prisma project with PostgreSQL
npx prisma init --datasource-provider postgresql

# Re-generate TypeScript Client after modifying schema.prisma
npx prisma generate`
          },
          explanation: [
            'npx prisma generate: Must be called whenever schema.prisma changes or in build scripts (e.g. postinstall).',
            'Connection pooling: Cloud Postgres providers (Supabase, Neon, AWS RDS) use connection poolers like PgBouncer. You append "?pgbouncer=true&connection_limit=10" to your connection URL.'
          ],
          keyTakeaway: 'Always run npx prisma generate in your CI/CD and deployment build steps.',
          mcqs: [
            {
              id: 'mcq-2-1',
              question: 'When should you run "npx prisma generate"?',
              options: [
                'Only once when you first install Node.js',
                'Every time you modify schema.prisma or install dependencies',
                'Whenever a user submits an HTTP request to your API',
                'Only when deploying to a Kubernetes cluster'
              ],
              correctIndex: 1,
              explanation: 'Generating the client recompiles the TypeScript definitions to reflect your latest schema changes.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-2-1',
            title: 'Task 1 (Guided): Identify Client Generation Command',
            description: 'Return the exact CLI command needed to regenerate the TypeScript client after a schema modification.',
            type: 'guided',
            targetModel: 'cli',
            activeTab: 'editor',
            instructions: [
              'Return the string "npx prisma generate" from getGenerateCommand()'
            ],
            initialCode: `// Return the exact CLI command string needed to generate client types:
export function getGenerateCommand(): string {
  return "";
}`,
            solutionCode: `export function getGenerateCommand(): string {
  return "npx prisma generate";
}`,
            solutionExplanation: 'npx prisma generate reads schema.prisma and updates the client types.',
            hints: [
              { level: 1, text: 'The command starts with "npx prisma" and ends with "generate".' }
            ],
            validation: {
              customValidator: (_ast, data) => ({
                valid: data === 'npx prisma generate',
                message: 'Must return exact string "npx prisma generate"'
              })
            },
            successMessage: 'Correct! npx prisma generate keeps your TypeScript types in sync.'
          },
          {
            id: 'task-2-2',
            title: 'Task 2 (Independent): Append Connection Pooling Parameters',
            description: 'Append required parameters (?pgbouncer=true&connection_limit=10) to a PostgreSQL URL.',
            type: 'independent',
            targetModel: 'url',
            activeTab: 'editor',
            instructions: [
              'Parse or manipulate basePostgresUrl',
              'Ensure pgbouncer=true and connection_limit=10 are set as query params'
            ],
            initialCode: `export function formatPooledDbUrl(basePostgresUrl: string): string {
  // Append required query parameters for connection pooling (pgbouncer=true, connection_limit=10)
  return basePostgresUrl;
}`,
            solutionCode: `export function formatPooledDbUrl(basePostgresUrl: string): string {
  const url = new URL(basePostgresUrl);
  url.searchParams.set('pgbouncer', 'true');
  url.searchParams.set('connection_limit', '10');
  return url.toString();
}`,
            solutionExplanation: 'Uses standard URL searchParams to append connection pooling configuration safely.',
            hints: [
              { level: 1, text: 'Use new URL(basePostgresUrl) and url.searchParams.set(...).' }
            ],
            validation: {
              customValidator: (_ast, data) => ({
                valid: typeof data === 'string' && data.includes('pgbouncer=true') && data.includes('connection_limit=10'),
                message: 'URL must contain pgbouncer=true and connection_limit=10'
              })
            },
            successMessage: 'Great job! Connection pooling prevents database pool exhaustion.'
          }
        ]
      },
      {
        id: 'day-02-concept-2',
        order: 2,
        title: 'Database Introspection & Field Mapping (@map, @@map)',
        shortDescription: 'Keep TypeScript idiomatic in camelCase while retaining legacy snake_case in PostgreSQL.',
        theory: {
          summary: 'In relational databases, column names frequently use snake_case (e.g. user_accounts, created_at). In TypeScript, idiomatic code uses camelCase. Prisma bridges this with @map("column_name") on fields and @@map("table_name") on models.',
          targetHero: {
            language: 'prisma',
            badge: 'Idiomatic Mapping Pattern',
            explanation: 'TypeScript sees UserAccount and firstName; PostgreSQL sees user_accounts and first_name.',
            code: `model UserAccount {
  id        Int      @id @default(autoincrement())
  firstName String   @map("first_name")
  createdAt DateTime @default(now()) @map("created_at")

  @@map("user_accounts")
}`
          },
          explanation: [
            '@map("raw_col"): Instructs Prisma Client to expose this field in TypeScript with the model field name, while issuing SQL queries against the mapped column.',
            '@@map("raw_table"): Maps the model name to the actual SQL table name.'
          ],
          keyTakeaway: 'Never compromise TypeScript conventions for SQL naming rules; use @map and @@map.',
          mcqs: [
            {
              id: 'mcq-2-2',
              question: 'What is the difference between @map and @@map in Prisma?',
              options: [
                '@map is for models, @@map is for fields',
                '@map maps individual field/column names; @@map maps entire model/table names',
                '@map works only with SQLite; @@map works with PostgreSQL',
                'There is no difference; they are aliases'
              ],
              correctIndex: 1,
              explanation: 'Single @ applies to the field directly above it; double @@ applies to the entire model block.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-2-3',
            title: 'Task 1 (Guided): Map Legacy Customer Table and Columns',
            description: 'Map model Customer to legacy table "tbl_customers" and field email to "cust_email".',
            type: 'guided',
            targetModel: 'Customer',
            activeTab: 'schema',
            instructions: [
              'Add @map("cust_email") to field email',
              'Add @@map("tbl_customers") to model Customer'
            ],
            initialCode: `model Customer {
  id    Int    @id @default(autoincrement())
  email String // Map this to "cust_email"

  // Map this model to "tbl_customers"
}`,
            solutionCode: `model Customer {
  id    Int    @id @default(autoincrement())
  email String @map("cust_email")

  @@map("tbl_customers")
}`,
            solutionExplanation: '@map("cust_email") maps the column, and @@map("tbl_customers") maps the table.',
            hints: [
              { level: 1, text: 'Append @map("cust_email") to the email line.' },
              { level: 2, text: 'Add @@map("tbl_customers") at the bottom of the Customer model.' }
            ],
            validation: {
              targetModel: 'Customer'
            },
            successMessage: 'Awesome! Clean TypeScript camelCase mapped to legacy database snake_case.'
          },
          {
            id: 'task-2-4',
            title: 'Task 2 (Independent): Map Phone & Registered Date Columns',
            description: 'Add snake_case mappings for phoneNumber -> phone_number and registeredAt -> registered_at.',
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
              targetModel: 'Customer'
            },
            successMessage: 'Well done! All fields mapped successfully.'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-02-challenge',
      title: 'Day 2 Final Challenge: Legacy DB Migration Setup',
      scenario: 'Take an introspected database schema with raw table names (auth_users, sys_logs), rename models into PascalCase TypeScript entities, and apply mappings.',
      tasks: [
        {
          id: 'challenge-2-1',
          title: 'Step 1: Map Auth User Model',
          description: 'Map model AuthUser to "auth_users" and field passwordHash to "password_hash".',
          type: 'challenge',
          targetModel: 'AuthUser',
          activeTab: 'schema',
          instructions: [
            'Define model AuthUser with id Int @id',
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
          solutionExplanation: 'Ensures database integrity while preserving TypeScript naming rules.',
          hints: [{ level: 1, text: 'Use @map("password_hash") and @@map("auth_users").' }],
          validation: { targetModel: 'AuthUser' },
          successMessage: 'AuthUser mapped successfully!'
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
    title: 'Models, Fields, Enums & Constraints',
    shortTitle: 'Models & Constraints',
    milestoneId: 'milestone-1',
    description: 'Design proper database schemas with primary keys, optional fields, native database types, enums, composite unique constraints, and indexes.',
    estimatedMinutes: 50,
    completionLearnings: [
      'Configured scalar types, optional fields (?), and automated timestamps (@updatedAt)',
      'Defined type-safe database enums with default values',
      'Created composite primary keys (@@id) and composite unique constraints (@@unique)'
    ],
    concepts: [
      {
        id: 'day-03-concept-1',
        order: 1,
        title: 'Scalar Types, Optionality & Primary Keys',
        shortDescription: 'Master String, Int, Decimal, Boolean, DateTime, @id, cuid(), and @updatedAt.',
        theory: {
          summary: 'Prisma scalar fields map to SQL columns. Fields are non-nullable by default unless marked with ?. Primary keys are designated with @id (autoincrement, cuid, or uuid). @updatedAt automatically writes timestamps upon every update.',
          targetHero: {
            language: 'prisma',
            badge: 'Production Entity Pattern',
            explanation: 'A production model featuring cuid() IDs, native Decimal precision, optional descriptions, and automated timestamps.',
            code: `model Product {
  id          String   @id @default(cuid())
  sku         String   @unique
  title       String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  inStock     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}`
          },
          explanation: [
            'String?: Question mark indicates an optional (nullable) field.',
            'Decimal: Precise floating numbers for financial and e-commerce calculations without JavaScript IEEE 754 float rounding errors.',
            '@updatedAt: Managed automatically by Prisma engine; records the exact moment any update operation touches the row.'
          ],
          keyTakeaway: 'Always use Decimal for money and currency calculations; never use Float.',
          mcqs: [
            {
              id: 'mcq-3-1',
              question: 'Which type should you always choose for prices and monetary amounts in Prisma?',
              options: [
                'Float',
                'Decimal',
                'Int (cents only)',
                'String'
              ],
              correctIndex: 1,
              explanation: 'Decimal prevents floating-point inaccuracies and maps to SQL DECIMAL(precision, scale).'
            }
          ]
        },
        tasks: [
          {
            id: 'task-3-1',
            title: 'Task 1 (Guided): Create Product Model with Precision Types',
            description: 'Create a Product model with cuid() id, required title, optional description, Decimal price, and timestamps.',
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
            initialCode: `// Define the Product model here:
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
              requiredFieldsInSelect: ['id', 'title', 'price', 'createdAt', 'updatedAt']
            },
            successMessage: 'Great job! Model Product matches production standards.'
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
              requiredFieldsInSelect: ['id', 'slug', 'title', 'isPublished', 'createdAt']
            },
            successMessage: 'Well done! Model Article defined with unique constraint.'
          }
        ]
      },
      {
        id: 'day-03-concept-2',
        order: 2,
        title: 'Enums & Multi-Field Constraints (@@unique, @@index)',
        shortDescription: 'Enforce valid domain states with Enums and composite multi-column uniqueness with @@unique.',
        theory: {
          summary: 'Enums restrict column values to a predefined list in the database. Multi-column composite constraints (@@unique([userId, orgId])) guarantee that combinations of columns remain unique together.',
          targetHero: {
            language: 'prisma',
            badge: 'Composite Constraints Pattern',
            explanation: 'Using enums and composite primary keys with @@id([userId, orgId]).',
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
            'enum: Stored natively in PostgreSQL as an ENUM type.',
            '@@id([a, b]): Creates a composite primary key formed by multiple columns.',
            '@@unique([a, b]): Allows unique pairs while letting each individual column have duplicates.'
          ],
          keyTakeaway: 'Use composite constraints to prevent duplicate enrollments, favorites, or memberships.',
          mcqs: [
            {
              id: 'mcq-3-2',
              question: 'When should you use @@unique([studentId, courseId])?',
              options: [
                'When a student can only ever take one course in their lifetime',
                'When a student cannot enroll in the same course more than once',
                'When only one student is allowed per course',
                'When courses must have unique titles'
              ],
              correctIndex: 1,
              explanation: 'Composite unique ensures the combination of (studentId, courseId) is distinct.'
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
              'Model Order with id Int @id, status OrderStatus @default(PENDING), and total Decimal'
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
              requiredFieldsInSelect: ['id', 'status', 'total']
            },
            successMessage: 'Great work! OrderStatus enum provides robust domain constraint.'
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
              targetModel: 'CourseEnrollment'
            },
            successMessage: 'Excellent! Duplicate enrollments are physically blocked at the database level.'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-03-challenge',
      title: 'Day 3 Final Challenge: Complete E-Commerce Schema Blueprint',
      scenario: 'Design the full schema for DigitalGoodsStore with User (cuid, unique email, role), Product (Decimal price), and UserFavorite (composite primary key).',
      tasks: [
        {
          id: 'challenge-3-1',
          title: 'Step 1: Define UserFavorite Composite Model',
          description: 'Model UserFavorite with userId String, productId String, and @@id([userId, productId]).',
          type: 'challenge',
          targetModel: 'UserFavorite',
          activeTab: 'schema',
          instructions: [
            'Define model UserFavorite',
            'Fields: userId String, productId String, createdAt DateTime @default(now())',
            'Add @@id([userId, productId])'
          ],
          initialCode: `// Define UserFavorite model with composite primary key:
`,
          solutionCode: `model UserFavorite {
  userId    String
  productId String
  createdAt DateTime @default(now())

  @@id([userId, productId])
}`,
          solutionExplanation: 'Creates a clean join model with composite primary key.',
          hints: [{ level: 1, text: 'Use @@id([userId, productId]) to create the composite key.' }],
          validation: { targetModel: 'UserFavorite' },
          successMessage: 'UserFavorite composite model configured!'
        }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // DAY 4: Relations (1-to-1, 1-to-Many, Many-to-Many)
  // ---------------------------------------------------------------------------
  {
    id: 'day-04',
    slug: 'relations-modeling',
    day: 4,
    title: 'Relations (1-to-1, 1-to-Many, Many-to-Many)',
    shortTitle: 'Relations Modeling',
    milestoneId: 'milestone-1',
    description: 'Model real-world relationships in Prisma schemas, understand foreign keys, @relation attributes, and implicit vs explicit join tables.',
    estimatedMinutes: 55,
    completionLearnings: [
      'Mastered 1-to-Many relations: foreign key scalar field (authorId Int) vs relation field (author User)',
      'Understood 1-to-1 relations and why @unique on foreign key turns 1:N into 1:1',
      'Distinguished implicit M:N vs explicit M:N join tables with custom relationship attributes'
    ],
    concepts: [
      {
        id: 'day-04-concept-1',
        order: 1,
        title: 'One-to-Many (1:N) Relations',
        shortDescription: 'The fundamental relational pattern: parent holds array, child holds foreign key.',
        theory: {
          summary: 'In a 1:N relationship (e.g. User has many Posts), the child table (Post) holds the foreign key scalar field (authorId Int) and the virtual relation field (author User @relation(fields: [authorId], references: [id])).',
          targetHero: {
            language: 'prisma',
            badge: '1-to-Many Anatomy',
            explanation: 'Post holds authorId foreign key pointing to id on User. User holds the posts Post[] relation array.',
            code: `model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  title    String
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}`
          },
          explanation: [
            'Scalar Field vs Relation Field: authorId is the actual column in SQL. author is a TypeScript-level relation field used for joins and typed includes.',
            'Optional 1:N: Setting authorId Int? allows child records to exist without being bound to a parent.'
          ],
          keyTakeaway: 'In Prisma 1:N relations, the model that holds the foreign key must define @relation(fields: [...], references: [...]).',
          mcqs: [
            {
              id: 'mcq-4-1',
              question: 'Which model holds the foreign key column in a 1-to-Many relationship between Author and Book?',
              options: [
                'Author holds bookId',
                'Book holds authorId',
                'Both models hold foreign keys',
                'Prisma generates an external join table automatically'
              ],
              correctIndex: 1,
              explanation: 'The "Many" side (Book) holds the foreign key pointing back to the "One" side (Author).'
            }
          ]
        },
        tasks: [
          {
            id: 'task-4-1',
            title: 'Task 1 (Guided): Connect Author and Book (1:N)',
            description: 'Add foreign key authorId and relation field author to model Book.',
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
              requiredFieldsInSelect: ['id', 'title', 'authorId']
            },
            successMessage: 'Great job! 1:N relationship between Author and Book established.'
          },
          {
            id: 'task-4-2',
            title: 'Task 2 (Independent): Optional 1:N Relation (Company & Employee)',
            description: 'Model 1-to-Many relation where companyId is optional (Int?) allowing unassigned employees.',
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
              { level: 1, text: 'Both companyId and company must have question marks (Int?, Company?).' }
            ],
            validation: {
              targetModel: 'Employee',
              requiredFieldsInSelect: ['id', 'name', 'companyId']
            },
            successMessage: 'Well done! Optional foreign keys correctly configured.'
          }
        ]
      },
      {
        id: 'day-04-concept-2',
        order: 2,
        title: 'One-to-One (1:1) Relations',
        shortDescription: 'The foreign key in a 1:1 relation MUST be unique to guarantee exclusivity.',
        theory: {
          summary: 'A 1:1 relationship links one entity to at most one other entity (e.g. User and Profile). Syntactically, it is identical to 1:N, with ONE vital requirement: the foreign key MUST have @unique.',
          targetHero: {
            language: 'prisma',
            badge: '1-to-1 Architecture',
            explanation: '@unique on userId transforms what would be a 1:N relation into a strict 1:1 relation.',
            code: `model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}

model Profile {
  id     Int  @id @default(autoincrement())
  bio    String
  userId Int  @unique // @unique turns 1:N into 1:1!
  user   User @relation(fields: [userId], references: [id])
}`
          },
          explanation: [
            'Without @unique: Multiple Profile rows could have the same userId, making it 1:N.',
            'With @unique: The database rejects duplicate userId entries, guaranteeing exactly 1:1.'
          ],
          keyTakeaway: 'Always place @unique on the foreign key field in a 1:1 relationship.',
          mcqs: [
            {
              id: 'mcq-4-2',
              question: 'What happens if you omit @unique on the foreign key of a 1:1 relation?',
              options: [
                'Prisma silently ignores it',
                'Prisma schema validation throws an error because the relation is ambiguous',
                'The database deletes the parent record',
                'TypeScript automatically forces uniqueness'
              ],
              correctIndex: 1,
              explanation: 'Prisma compiler throws: "A one-to-one relation must have a unique constraint on the foreign key".'
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
              requiredFieldsInSelect: ['id', 'darkMode', 'accountId']
            },
            successMessage: 'Awesome! 1:1 relationship successfully modeled.'
          },
          {
            id: 'task-4-4',
            title: 'Task 2 (Independent): Fix 1:1 Unique Constraint Bug',
            description: 'Fix a schema error where omitting @unique caused Prisma compiler failure.',
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
  driverId Int    // BUG: Missing @unique!
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
            solutionExplanation: 'Adding @unique resolves the relation ambiguity and enables 1:1 navigation.',
            hints: [
              { level: 1, text: 'Append @unique to "driverId Int".' }
            ],
            validation: {
              targetModel: 'License',
              requiredFieldsInSelect: ['id', 'number', 'driverId']
            },
            successMessage: 'Great fix! Driver to License is now a valid 1:1 relation.'
          }
        ]
      },
      {
        id: 'day-04-concept-3',
        order: 3,
        title: 'Many-to-Many (M:N) Relations (Implicit vs Explicit)',
        shortDescription: 'Choose between Prisma-managed implicit join tables and explicit models with extra metadata.',
        theory: {
          summary: 'In implicit M:N relations (Post[] and Tag[]), Prisma manages a hidden join table automatically. When the relationship needs its own data (e.g. assignedAt, role, grade), use an explicit join model with @@id([a, b]).',
          targetHero: {
            language: 'prisma',
            badge: 'Explicit Join Table Pattern',
            explanation: 'PostTag stores extra metadata (assignedAt) between Post and Tag.',
            code: `// Explicit M:N Join Model with extra attribute
model PostTag {
  postId     Int
  tagId      Int
  assignedAt DateTime @default(now())
  post       Post     @relation(fields: [postId], references: [id])
  tag        Tag      @relation(fields: [tagId], references: [id])

  @@id([postId, tagId])
}`
          },
          explanation: [
            'Implicit M:N: Easy and clean when no relation attributes are needed.',
            'Explicit M:N: Essential for audit trails, permissions, timestamps, or quantities in shopping carts.'
          ],
          keyTakeaway: 'If the relationship has attributes of its own, use an explicit join model.',
          mcqs: [
            {
              id: 'mcq-4-3',
              question: 'When MUST you use an explicit Many-to-Many relation instead of an implicit one?',
              options: [
                'Whenever using PostgreSQL',
                'When the relationship itself needs to store additional data (e.g. assignedDate, quantity)',
                'Whenever there are more than 100 rows in the database',
                'When models have more than 5 fields'
              ],
              correctIndex: 1,
              explanation: 'Implicit join tables cannot store extra columns. You must create an explicit join model to hold relation fields.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-4-5',
            title: 'Task 1 (Guided): Define Implicit M:N Relation (Post & Category)',
            description: 'Define an implicit M:N relation between Post and Category by placing array relation fields on both models.',
            type: 'guided',
            targetModel: 'Post',
            activeTab: 'schema',
            instructions: [
              'In model Post, add categories Category[]',
              'In model Category, add posts Post[]'
            ],
            initialCode: `model Post {
  id Int @id @default(autoincrement())
  // Add categories relation
}

model Category {
  id Int @id @default(autoincrement())
  // Add posts relation
}`,
            solutionCode: `model Post {
  id         Int        @id @default(autoincrement())
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  posts Post[]
}`,
            solutionExplanation: 'Prisma handles the underlying _CategoryToPost join table transparently.',
            hints: [
              { level: 1, text: 'Add "categories Category[]" to Post and "posts Post[]" to Category.' }
            ],
            validation: {
              targetModel: 'Post'
            },
            successMessage: 'Implicit M:N relation defined!'
          },
          {
            id: 'task-4-6',
            title: 'Task 2 (Independent): Explicit M:N Join Model with Grade',
            description: 'Define an explicit M:N relation between Student and ClassRoom via join model ClassEnrollment with grade Decimal?.',
            type: 'independent',
            targetModel: 'ClassEnrollment',
            activeTab: 'schema',
            instructions: [
              'Define model ClassEnrollment with studentId Int, classRoomId Int, grade Decimal?',
              'Add relations to Student and ClassRoom',
              'Add composite primary key @@id([studentId, classRoomId])'
            ],
            initialCode: `model Student {
  id          Int               @id @default(autoincrement())
  name        String
  enrollments ClassEnrollment[]
}

model ClassRoom {
  id          Int               @id @default(autoincrement())
  roomNumber  String
  enrollments ClassEnrollment[]
}

// Define model ClassEnrollment with studentId, classRoomId, grade, and @@id:
`,
            solutionCode: `model Student {
  id          Int               @id @default(autoincrement())
  name        String
  enrollments ClassEnrollment[]
}

model ClassRoom {
  id          Int               @id @default(autoincrement())
  roomNumber  String
  enrollments ClassEnrollment[]
}

model ClassEnrollment {
  studentId   Int
  classRoomId Int
  grade       Decimal?
  student     Student   @relation(fields: [studentId], references: [id])
  classRoom   ClassRoom @relation(fields: [classRoomId], references: [id])

  @@id([studentId, classRoomId])
}`,
            solutionExplanation: 'Explicit join model holding studentId, classRoomId, and custom grade attribute.',
            hints: [
              { level: 1, text: 'Include student Student @relation and classRoom ClassRoom @relation.' },
              { level: 2, text: 'Add @@id([studentId, classRoomId]) at the end.' }
            ],
            validation: {
              targetModel: 'ClassEnrollment',
              requiredFieldsInSelect: ['studentId', 'classRoomId']
            },
            successMessage: 'Masterful! Explicit M:N join model accurately crafted.'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-04-challenge',
      title: 'Day 4 Final Challenge: Social Network Relational Core',
      scenario: 'Build the complete relational schema for a social network: User to Profile (1:1), User to Post (1:N), and Post to Comment (1:N).',
      tasks: [
        {
          id: 'challenge-4-1',
          title: 'Step 1: Wire Up Post and Comment Relation',
          description: 'Add postId Int and post relation to Comment referencing Post.id.',
          type: 'challenge',
          targetModel: 'Comment',
          activeTab: 'schema',
          instructions: [
            'In model Comment, add postId Int',
            'Add post Post @relation(fields: [postId], references: [id])'
          ],
          initialCode: `model Post {
  id       Int       @id @default(autoincrement())
  comments Comment[]
}

model Comment {
  id      Int    @id @default(autoincrement())
  content String
  // Add relation to Post
}`,
          solutionCode: `model Post {
  id       Int       @id @default(autoincrement())
  comments Comment[]
}

model Comment {
  id      Int    @id @default(autoincrement())
  content String
  postId  Int
  post    Post   @relation(fields: [postId], references: [id])
}`,
          solutionExplanation: 'Creates 1:N relation between Post and Comment.',
          hints: [{ level: 1, text: 'Add postId Int and post Post @relation.' }],
          validation: { targetModel: 'Comment', requiredFieldsInSelect: ['id', 'content', 'postId'] },
          successMessage: 'Day 4 challenge complete! Relational core wired up.'
        }
      ]
    }
  }
];
