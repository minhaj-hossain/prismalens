// =============================================================================
// MILESTONE 2: DAYS 5 TO 8
// =============================================================================

import { ModuleData } from '../../types/curriculum';

export const MILESTONE_2_MODULES: ModuleData[] = [
  // ---------------------------------------------------------------------------
  // DAY 5: Migrations + Seeding
  // ---------------------------------------------------------------------------
  {
    id: 'day-05',
    slug: 'migrations-and-seeding',
    day: 5,
    title: 'Migrations + Seeding',
    shortTitle: 'Migrations & Seeding',
    milestoneId: 'milestone-2',
    description: 'Safely evolve database schemas with prisma migrate dev, understand migration SQL files, and build idempotent seeders with prisma/seed.ts.',
    estimatedMinutes: 45,
    completionLearnings: [
      'Mastered the difference between migrate dev (diff & create SQL) and migrate deploy (production CI/CD)',
      'Understood how to safely add non-nullable columns to populated tables using @default',
      'Built idempotent seeders using upsert to avoid duplicate key errors on repeated runs'
    ],
    concepts: [
      {
        id: 'day-05-concept-1',
        order: 1,
        title: 'Database Migrations: Local Development vs CI/CD Deploy',
        shortDescription: 'Safely evolve database schemas in local development and automate migrations across CI/CD production pipelines.',
        theory: {
          summary: 'In local development, "npx prisma migrate dev" calculates the diff between schema.prisma and your database, writes a timestamped SQL migration file, applies it, and runs prisma generate. In production CI/CD, "npx prisma migrate deploy" applies pending migrations without diffing.',
          targetHero: {
            language: 'bash',
            badge: 'Migration Command Lifecycle',
            explanation: 'Development command that creates versioned SQL and regenerates TypeScript client.',
            code: `# Development: detect changes, create migration SQL, apply, and regenerate client
npx prisma migrate dev --name add_user_profiles

# Production CI/CD: apply pending migrations only
npx prisma migrate deploy`
          },
          explanation: [
            'migrate dev: For developers. Compares schema to DB, prompts if data loss might occur, creates SQL file in prisma/migrations, applies it, and updates Prisma Client.',
            'migrate deploy: For production / Docker / CI. Strictly applies committed SQL migration files; never creates files or touches client generation.'
          ],
          keyTakeaway: 'Never use migrate dev in production; use migrate deploy.',
          mcqs: [
            {
              id: 'mcq-5-1',
              question: 'Which migration command should be executed in your production deployment script?',
              options: [
                'npx prisma migrate dev',
                'npx prisma migrate deploy',
                'npx prisma db push --force-reset',
                'npx prisma format'
              ],
              correctIndex: 1,
              explanation: 'migrate deploy applies pending migrations safely without interactive prompts or altering files.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-5-1',
            title: 'Task 1 (Guided): Return Production Migration Command',
            description: 'Return the exact CLI command used to apply pending migrations in production CI/CD pipelines.',
            type: 'guided',
            targetModel: 'cli',
            activeTab: 'editor',
            instructions: [
              'Return "npx prisma migrate deploy" from getProductionMigrationCommand()'
            ],
            initialCode: `export function getProductionMigrationCommand(): string {
  // Return the command used in production CI/CD pipelines
  return "";
}`,
            solutionCode: `export function getProductionMigrationCommand(): string {
  return "npx prisma migrate deploy";
}`,
            solutionExplanation: 'migrate deploy is designed for automated pipelines.',
            hints: [
              { level: 1, text: 'The command starts with "npx prisma migrate ...".' },
              { level: 2, text: 'Use "npx prisma migrate deploy".' }
            ],
            validation: {
              customValidator: (_ast, data) => ({
                valid: data === 'npx prisma migrate deploy',
                message: 'Must return "npx prisma migrate deploy"'
              })
            },
            successMessage: 'Correct! Production deployments require migrate deploy.'
          },
          {
            id: 'task-5-2',
            title: 'Task 2 (Independent): Safely Add Required Column with @default',
            description: 'Add a non-nullable status column to Order table that already has rows, using @default("PENDING").',
            type: 'independent',
            targetModel: 'Order',
            activeTab: 'schema',
            instructions: [
              'In model Order, add "status String @default("PENDING")"'
            ],
            initialCode: `// Model has existing production rows. Add required field 'status' safely:
model Order {
  id     Int    @id @default(autoincrement())
  amount Decimal
  // Add status String with default "PENDING"
}`,
            solutionCode: `model Order {
  id     Int    @id @default(autoincrement())
  amount Decimal
  status String @default("PENDING")
}`,
            solutionExplanation: 'Adding @default provides values for existing rows so migrations succeed without failing on null constraints.',
            hints: [
              { level: 1, text: 'Add "status String @default(\\"PENDING\\")".' }
            ],
            validation: {
              targetModel: 'Order',
              requiredFieldsInSelect: ['id', 'amount', 'status']
            },
            successMessage: 'Great job! Adding defaults allows safe migrations on populated tables.'
          }
        ]
      },
      {
        id: 'day-05-concept-2',
        order: 2,
        title: 'Reliable Database Seeding with upsert()',
        shortDescription: 'Populate essential roles, accounts, and test fixtures safely without triggering unique constraint errors.',
        theory: {
          summary: 'Database seeders populate initial data (roles, super-admins, test fixtures). If a seeder uses create, running it a second time crashes with unique constraint violations. An idempotent seeder uses upsert so it can be run repeatedly without failure.',
          targetHero: {
            language: 'typescript',
            badge: 'Idempotent Seed Pattern',
            explanation: 'Upsert matches on unique identifier; updates if exists, creates if missing.',
            code: `// prisma/seed.ts
await prisma.role.upsert({
  where: { name: 'ADMIN' },
  update: {},
  create: { name: 'ADMIN', description: 'System Administrator' },
});`
          },
          explanation: [
            'where: Unique filter (e.g. email or code).',
            'update: What to change if already present (pass {} if you want to leave existing rows untouched).',
            'create: Payload to insert if the record does not exist yet.'
          ],
          keyTakeaway: 'Always use upsert in seed scripts to ensure re-runnability.',
          mcqs: [
            {
              id: 'mcq-5-2',
              question: 'Why is prisma.user.create considered bad practice inside a seed.ts script?',
              options: [
                'create runs 10x slower than upsert',
                'create will crash with unique constraint errors if the seed script is run more than once',
                'Prisma forbids create inside files named seed.ts',
                'create cannot insert strings'
              ],
              correctIndex: 1,
              explanation: 'create will fail on duplicate unique keys (like email) if the database already contains data.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-5-3',
            title: 'Task 1 (Guided): Idempotent Admin Seeder',
            description: 'Write an idempotent seed function using prisma.user.upsert to ensure email "admin@prisma.io" exists.',
            type: 'guided',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Call prisma.user.upsert',
              'where: { email: "admin@prisma.io" }',
              'update: {}',
              'create: { email: "admin@prisma.io", name: "Super Admin" }'
            ],
            initialCode: `export async function seedAdminUser() {
  // Use prisma.user.upsert to ensure email 'admin@prisma.io' exists
  return await prisma.user.upsert({
    // Complete the upsert query
  });
}`,
            solutionCode: `export async function seedAdminUser() {
  return await prisma.user.upsert({
    where: { email: 'admin@prisma.io' },
    update: {},
    create: {
      email: 'admin@prisma.io',
      name: 'Super Admin',
    }
  });
}`,
            solutionExplanation: 'Upsert ensures running the seed script 100 times never throws a duplicate key error.',
            hints: [
              { level: 1, text: 'where must match { email: "admin@prisma.io" }.' },
              { level: 2, text: 'Pass update: {} and create: { email: "admin@prisma.io", name: "Super Admin" }.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'upsert',
              requiredWhereClauses: ['email']
            },
            successMessage: 'Idempotent admin seed function successfully implemented!'
          },
          {
            id: 'task-5-4',
            title: 'Task 2 (Independent): Bulk Idempotent Category Seeder',
            description: 'Seed 3 default categories (Electronics, Books, Clothing) using Promise.all and category.upsert.',
            type: 'independent',
            targetModel: 'category',
            activeTab: 'editor',
            instructions: [
              'Map over defaultCategories',
              'Perform prisma.category.upsert for each name',
              'Return Promise.all'
            ],
            initialCode: `const defaultCategories = ['Electronics', 'Books', 'Clothing'];

export async function seedCategories() {
  // Return a Promise.all array of upsert operations
}`,
            solutionCode: `const defaultCategories = ['Electronics', 'Books', 'Clothing'];

export async function seedCategories() {
  return await Promise.all(
    defaultCategories.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name, slug: name.toLowerCase() },
      })
    )
  );
}`,
            solutionExplanation: 'Promise.all parallelizes the upsert queries cleanly.',
            hints: [
              { level: 1, text: 'Use defaultCategories.map(name => prisma.category.upsert(...)).' }
            ],
            validation: {
              targetModel: 'category',
              requiredMethod: 'upsert',
              requiredWhereClauses: ['name']
            },
            successMessage: 'Great job! Default categories safely seeded.'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-05-challenge',
      title: 'Day 5 Final Challenge: Deterministic Seed Pipeline',
      scenario: 'Create an idempotent seed function that seeds an initial discount code "WELCOME10" with 10% discount and active status.',
      tasks: [
        {
          id: 'challenge-5-1',
          title: 'Step 1: Upsert Welcome Discount Code',
          description: 'Use prisma.discount.upsert to ensure "WELCOME10" exists with 10 percent.',
          type: 'challenge',
          targetModel: 'discount',
          activeTab: 'editor',
          instructions: [
            'Call prisma.discount.upsert',
            'where: { code: "WELCOME10" }',
            'update: { percent: 10, isActive: true }',
            'create: { code: "WELCOME10", percent: 10, isActive: true }'
          ],
          initialCode: `export async function seedWelcomeDiscount() {
  return await prisma.discount.upsert({
    where: { code: 'WELCOME10' },
    update: { percent: 10, isActive: true },
    create: { code: 'WELCOME10', percent: 10, isActive: true }
  });
}`,
          solutionCode: `export async function seedWelcomeDiscount() {
  return await prisma.discount.upsert({
    where: { code: 'WELCOME10' },
    update: { percent: 10, isActive: true },
    create: { code: 'WELCOME10', percent: 10, isActive: true }
  });
}`,
          solutionExplanation: 'Ensures discount code is available for tests and checkout workflows.',
          hints: [{ level: 1, text: 'Use prisma.discount.upsert.' }],
          validation: { targetModel: 'discount', requiredMethod: 'upsert', requiredWhereClauses: ['code'] },
          successMessage: 'Day 5 challenge completed! Deterministic seeder active.'
        }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // DAY 6: PrismaClient Lifecycle & Connections
  // ---------------------------------------------------------------------------
  {
    id: 'day-06',
    slug: 'client-lifecycle-connections',
    day: 6,
    title: 'PrismaClient Lifecycle & Connections',
    shortTitle: 'Client Lifecycle',
    milestoneId: 'milestone-2',
    description: 'Understand connection management, connection pooling limits, singleton patterns in Next.js/Express, query logging, and graceful shutdown.',
    estimatedMinutes: 40,
    completionLearnings: [
      'Mastered the global PrismaClient singleton pattern to avoid connection exhaustion in HMR development',
      'Configured query performance logging with event listeners for slow-query detection',
      'Implemented clean process shutdown handlers with prisma.$disconnect()'
    ],
    concepts: [
      {
        id: 'day-06-concept-1',
        order: 1,
        title: 'Connection Management: The PrismaClient Singleton Pattern',
        shortDescription: 'Prevent connection pool exhaustion and memory leaks during backend development and server restarts.',
        theory: {
          summary: 'Each new PrismaClient() opens a dedicated connection pool to PostgreSQL. In development frameworks with Hot Module Reloading (Next.js, Vite, Express tsx), editing code re-runs files, creating new client instances until PostgreSQL exhausts its connection limit. Attaching the client to globalThis preserves the single connection pool across reloads.',
          targetHero: {
            language: 'typescript',
            badge: 'Global Singleton Blueprint',
            explanation: 'Caches the client instance on globalThis during development.',
            code: `// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}`
          },
          explanation: [
            'In production: Server runs once, so global caching is not strictly required, but harmless.',
            'In development: Every file edit retains the existing client rather than re-instantiating connections.'
          ],
          keyTakeaway: 'Always export a single shared prisma instance from a dedicated lib/prisma.ts file.',
          mcqs: [
            {
              id: 'mcq-6-1',
              question: 'What error occurs if you call "new PrismaClient()" inside an API route handler?',
              options: [
                'SyntaxError: Unexpected identifier',
                'Database connection pool exhaustion ("Error: Too many clients already")',
                'TypeScript compilation failure',
                'Prisma drops all tables'
              ],
              correctIndex: 1,
              explanation: 'Every HTTP request would open new database sockets, quickly consuming the database max_connections limit.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-6-1',
            title: 'Task 1 (Guided): Implement lib/prisma.ts Singleton',
            description: 'Complete the production-ready PrismaClient singleton pattern checking process.env.NODE_ENV.',
            type: 'guided',
            targetModel: 'singleton',
            activeTab: 'editor',
            instructions: [
              'Cast globalThis to { prisma: PrismaClient | undefined }',
              'Export const prisma = globalForPrisma.prisma ?? new PrismaClient()',
              'If NODE_ENV !== "production", save prisma to globalForPrisma.prisma'
            ],
            initialCode: `// Implement the global singleton pattern below:
export function getPrismaSingleton(globalObj: any, PrismaClientClass: any, env: string) {
  const client = globalObj.prisma ?? new PrismaClientClass();
  if (env !== 'production') {
    globalObj.prisma = client;
  }
  return client;
}`,
            solutionCode: `export function getPrismaSingleton(globalObj: any, PrismaClientClass: any, env: string) {
  const client = globalObj.prisma ?? new PrismaClientClass();
  if (env !== 'production') {
    globalObj.prisma = client;
  }
  return client;
}`,
            solutionExplanation: 'Guarantees that re-evaluating modules reuses the existing PrismaClient instance.',
            hints: [
              { level: 1, text: 'Check globalObj.prisma ?? new PrismaClientClass().' }
            ],
            validation: {
              customValidator: () => ({ valid: true })
            },
            successMessage: 'Singleton pattern successfully configured!'
          },
          {
            id: 'task-6-2',
            title: 'Task 2 (Independent): Fix Connection Exhaustion Bug',
            description: 'Fix an Express route that dangerously calls new PrismaClient() inside the request handler.',
            type: 'independent',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Remove "new PrismaClient()" inside handleRequest',
              'Use the passed or imported singleton prisma client'
            ],
            initialCode: `// BUG: Instantiating client inside route handler exhausts connections!
export async function handleRequest(req: any, res: any) {
  // Fix: replace with singleton prisma.user.findMany()
  const users = await prisma.user.findMany();
  return res.json(users);
}`,
            solutionCode: `export async function handleRequest(req: any, res: any) {
  const users = await prisma.user.findMany();
  return res.json(users);
}`,
            solutionExplanation: 'Uses shared singleton client, preventing socket exhaustion.',
            hints: [
              { level: 1, text: 'Do not instantiate new PrismaClient() in the handler.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'findMany'
            },
            successMessage: 'Bug eliminated! Database connection pool is now protected.'
          }
        ]
      },
      {
        id: 'day-06-concept-2',
        order: 2,
        title: 'Query Telemetry & Graceful Process Disconnection',
        shortDescription: 'Configure production query observability and cleanly release database pools during service termination.',
        theory: {
          summary: 'Prisma Client supports rich logging configuration (query, info, warn, error). Setting log: [{ emit: "event", level: "query" }] lets you inspect query durations. On server termination, calling await prisma.$disconnect() closes open database sockets cleanly.',
          targetHero: {
            language: 'typescript',
            badge: 'Logging & Shutdown Pattern',
            explanation: 'Register event emitter for query durations and graceful disconnect.',
            code: `const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'stdout', level: 'error' }
  ]
});

prisma.$on('query', (e) => {
  console.log(\`Query: \${e.query} | Duration: \${e.duration}ms\`);
});`
          },
          explanation: [
            'Event-based query logging: Ideal for feeding metrics to Datadog, Prometheus, or OpenTelemetry.',
            'prisma.$disconnect(): Closes the connection pool gracefully when the Node process receives SIGTERM or exits.'
          ],
          keyTakeaway: 'Always close database pools cleanly when terminating containerized services.',
          mcqs: [
            {
              id: 'mcq-6-2',
              question: 'Why should an application invoke "await prisma.$disconnect()" on process shutdown?',
              options: [
                'To delete temporary tables created during runtime',
                'To close active database sockets and prevent lingering idle connections on the database server',
                'Because Node.js will crash if Prisma is left open',
                'To automatically run pending migrations'
              ],
              correctIndex: 1,
              explanation: 'Graceful disconnection terminates open TCP sockets so the database server does not hold zombie connections.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-6-3',
            title: 'Task 1 (Guided): Instantiate Logged PrismaClient',
            description: 'Return a configuration object specifying log with emit "event" for level "query".',
            type: 'guided',
            targetModel: 'logger',
            activeTab: 'editor',
            instructions: [
              'Return an object with log: [{ emit: "event", level: "query" }]'
            ],
            initialCode: `export function createLoggedClient() {
  return {
    log: [{ emit: 'event', level: 'query' }]
  };
}`,
            solutionCode: `export function createLoggedClient() {
  return {
    log: [{ emit: 'event', level: 'query' }]
  };
}`,
            solutionExplanation: 'Configures event emission for query events.',
            hints: [{ level: 1, text: 'Specify log: [{ emit: "event", level: "query" }].' }],
            validation: {
              customValidator: (_ast, data) => ({
                valid: Boolean(data?.log?.[0]?.level === 'query'),
                message: 'Must configure query log event'
              })
            },
            successMessage: 'Query logging configuration confirmed!'
          },
          {
            id: 'task-6-4',
            title: 'Task 2 (Independent): Register Graceful Disconnect',
            description: 'Create a process termination listener that calls client.$disconnect() on beforeExit.',
            type: 'independent',
            targetModel: 'lifecycle',
            activeTab: 'editor',
            instructions: [
              'Inside setupGracefulShutdown, invoke client.$disconnect()'
            ],
            initialCode: `export function setupGracefulShutdown(client: any) {
  // Call client.$disconnect() when process terminates
  return client.$disconnect();
}`,
            solutionCode: `export function setupGracefulShutdown(client: any) {
  return client.$disconnect();
}`,
            solutionExplanation: 'Disconnection terminates the client connection pool cleanly.',
            hints: [{ level: 1, text: 'Return client.$disconnect().' }],
            validation: {
              customValidator: () => ({ valid: true })
            },
            successMessage: 'Graceful shutdown configured!'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-06-challenge',
      title: 'Day 6 Final Challenge: Enterprise Database Gateway',
      scenario: 'Implement a database health check that executes a fast probe query using prisma.user.findFirst to confirm connectivity.',
      tasks: [
        {
          id: 'challenge-6-1',
          title: 'Step 1: Execute Health Probe Query',
          description: 'Call prisma.user.findFirst to verify database responsiveness.',
          type: 'challenge',
          targetModel: 'user',
          activeTab: 'editor',
          instructions: [
            'Call prisma.user.findFirst',
            'Select id only'
          ],
          initialCode: `export async function dbHealthCheck() {
  return await prisma.user.findFirst({
    select: { id: true }
  });
}`,
          solutionCode: `export async function dbHealthCheck() {
  return await prisma.user.findFirst({
    select: { id: true }
  });
}`,
          solutionExplanation: 'A lightweight indexed query confirms healthy connectivity.',
          hints: [{ level: 1, text: 'Use findFirst with select: { id: true }.' }],
          validation: { targetModel: 'user', requiredMethod: 'findFirst', requiredFieldsInSelect: ['id'] },
          successMessage: 'Day 6 challenge complete! Gateway probe verified.'
        }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // DAY 7: Reading Data + select vs include
  // ---------------------------------------------------------------------------
  {
    id: 'day-07',
    slug: 'reading-data-select-include',
    day: 7,
    title: 'Reading Data + select vs include',
    shortTitle: 'Reading Data',
    milestoneId: 'milestone-2',
    description: 'Build controlled queries with findMany, findUnique, findFirst, understand data pruning with select, and master relation loading with include.',
    estimatedMinutes: 50,
    completionLearnings: [
      'Mastered the distinction between findUnique (indexed/unique fields only) vs findFirst vs findMany',
      'Understood the Golden Rule of Prisma: Never combine select and include at the root of the same object',
      'Pruned sensitive columns (password hashes, internal flags) by shaping output with nested select'
    ],
    concepts: [
      {
        id: 'day-07-concept-1',
        order: 1,
        title: 'Reading Records: findUnique, findFirst & findMany',
        shortDescription: 'Master the fundamental query methods and understand when to query by unique keys vs filter criteria.',
        theory: {
          summary: 'Prisma divides read queries by specificity: findUnique queries strictly by @id or @unique fields, returning 0 or 1 record. findFirst queries by any arbitrary condition and returns the first match. findMany returns an array of all matching rows.',
          targetHero: {
            language: 'typescript',
            badge: 'Fast Indexed Lookup',
            explanation: 'findUnique requires a unique field in where, generating an index scan.',
            code: `// Fast indexed single lookup
const user = await prisma.user.findUnique({
  where: { email: 'alice@prisma.io' }
});`
          },
          explanation: [
            'findUnique: Guaranteed to use an index in SQL because the where condition only accepts fields marked with @id or @unique.',
            'findFirst: Useful when filtering by non-unique fields (e.g. status: "ACTIVE") with an orderBy clause.',
            'findMany: Returns an array. Always combine with take and skip in production to avoid fetching millions of rows into memory.'
          ],
          keyTakeaway: 'Always prefer findUnique over findFirst when searching by an ID or unique key.',
          mcqs: [
            {
              id: 'mcq-7-1',
              question: 'Why will "prisma.user.findUnique({ where: { status: "ACTIVE" } })" fail to compile in TypeScript?',
              options: [
                'Because status is a reserved keyword in Prisma',
                'Because findUnique strictly requires fields that have an @id or @unique constraint in schema.prisma',
                'Because findUnique cannot return users',
                'Because active users cannot be queried'
              ],
              correctIndex: 1,
              explanation: 'findUnique enforces compile-time safety: only unique columns are allowed in where.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-7-1',
            title: 'Task 1 (Guided): Find Product by Unique SKU',
            description: 'Use prisma.product.findUnique to find a product by its unique sku parameter.',
            type: 'guided',
            targetModel: 'product',
            activeTab: 'editor',
            instructions: [
              'Call prisma.product.findUnique',
              'Set where: { sku }'
            ],
            initialCode: `export async function getProductBySku(sku: string) {
  return await prisma.product.findUnique({
    // Complete query
  });
}`,
            solutionCode: `export async function getProductBySku(sku: string) {
  return await prisma.product.findUnique({
    where: { sku }
  });
}`,
            solutionExplanation: 'sku is marked @unique on Product, making it valid for findUnique.',
            hints: [
              { level: 1, text: 'Use where: { sku }.' }
            ],
            validation: {
              targetModel: 'product',
              requiredMethod: 'findUnique',
              requiredWhereClauses: ['sku']
            },
            successMessage: 'Great job! findUnique executed over indexed SKU.'
          },
          {
            id: 'task-7-2',
            title: 'Task 2 (Independent): Find Latest Active Discount Code',
            description: 'Find the first active discount code ordered by createdAt descending.',
            type: 'independent',
            targetModel: 'discount',
            activeTab: 'editor',
            instructions: [
              'Call prisma.discount.findFirst',
              'where: { isActive: true }',
              'orderBy: { createdAt: "desc" }'
            ],
            initialCode: `export async function getLatestDiscount() {
  // Return first active discount code ordered by createdAt descending
}`,
            solutionCode: `export async function getLatestDiscount() {
  return await prisma.discount.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });
}`,
            solutionExplanation: 'findFirst paired with orderBy desc retrieves the freshest matching record.',
            hints: [
              { level: 1, text: 'Pass where: { isActive: true } and orderBy: { createdAt: "desc" }.' }
            ],
            validation: {
              targetModel: 'discount',
              requiredMethod: 'findFirst',
              requiredWhereClauses: ['isActive']
            },
            successMessage: 'Well done! Latest discount code retrieved.'
          }
        ]
      },
      {
        id: 'day-07-concept-2',
        order: 2,
        title: 'Query Projection vs Relation Loading: select vs include',
        shortDescription: 'Balance payload sizes and eager relation loading without triggering Prisma root-level conflicts.',
        theory: {
          summary: 'select picks specific scalar columns to return. include eager-loads related models. The Golden Rule: you cannot use select and include at the same root level! If you need both scalar pruning and relations, nest select inside select.',
          targetHero: {
            language: 'typescript',
            badge: 'Nested Select Pattern',
            explanation: 'Nesting relation selection inside select prunes scalar fields while loading related posts.',
            code: `// Nesting relation selection inside select
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    name: true,
    posts: {
      select: { id: true, title: true }
    }
  }
});`
          },
          explanation: [
            'Why root select + include is forbidden: It is ambiguous whether unselected fields on the root should be returned.',
            'Solution: Use select exclusively, and treat relation fields as nested objects with their own select block.'
          ],
          keyTakeaway: 'To load relations and prune fields simultaneously, use nested select.',
          mcqs: [
            {
              id: 'mcq-7-2',
              question: 'What happens if you provide both "select" and "include" at the root level of a Prisma query?',
              options: [
                'Prisma automatically merges them',
                'TypeScript compiler throws an error: "Please either use select or include on an object, you cannot use both"',
                'Prisma ignores the select block and includes everything',
                'The query executes raw SQL instead'
              ],
              correctIndex: 1,
              explanation: 'Prisma Client enforces strict mutual exclusivity between root select and include.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-7-3',
            title: 'Task 1 (Guided): Nested Select for Author Profile & Posts',
            description: 'Retrieve user by id selecting id, name, and nested posts (selecting post id and title).',
            type: 'guided',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Call prisma.user.findUnique where id: authorId',
              'Use select to return id: true, name: true',
              'Inside select, include posts: { select: { id: true, title: true } }'
            ],
            initialCode: `export async function getAuthorPublicProfile(authorId: number) {
  return await prisma.user.findUnique({
    where: { id: authorId },
    // Select id, name, and nested posts (id, title)
  });
}`,
            solutionCode: `export async function getAuthorPublicProfile(authorId: number) {
  return await prisma.user.findUnique({
    where: { id: authorId },
    select: {
      id: true,
      name: true,
      posts: {
        select: { id: true, title: true }
      }
    }
  });
}`,
            solutionExplanation: 'Uses nested select to fetch the author details and their posts simultaneously without sensitive fields.',
            hints: [
              { level: 1, text: 'Place posts: { select: { id: true, title: true } } inside the select block.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'findUnique',
              requiredFieldsInSelect: ['id', 'name', 'posts']
            },
            successMessage: 'Perfect nested select query!'
          },
          {
            id: 'task-7-4',
            title: 'Task 2 (Independent): Fix Root select + include Crash',
            description: 'Fix a query that crashed with "Please either use select or include on an object, you cannot use both".',
            type: 'independent',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Refactor query to use select only',
              'Move posts: true inside the select block'
            ],
            initialCode: `export async function getAuthorWithPostsBuggy(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
    include: { posts: true } // ILLEGAL: Cannot combine select and include at root
  } as any);
}`,
            solutionCode: `export async function getAuthorWithPostsBuggy(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      posts: true
    }
  });
}`,
            solutionExplanation: 'Moving posts: true into select satisfies Prisma type safety.',
            hints: [
              { level: 1, text: 'Delete "include: { posts: true }" and add "posts: true" inside select.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'findUnique',
              requiredFieldsInSelect: ['id', 'email', 'posts']
            },
            successMessage: 'Crash eliminated! Clean select tree established.'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-07-challenge',
      title: 'Day 7 Final Challenge: High-Performance Profile & Feed Loader',
      scenario: 'Build a secure author feed query: retrieve user id and name, and include only published posts (id, title, views).',
      tasks: [
        {
          id: 'challenge-7-1',
          title: 'Step 1: Build Author Feed Query',
          description: 'Query user with nested published posts.',
          type: 'challenge',
          targetModel: 'user',
          activeTab: 'editor',
          instructions: [
            'Find user by id',
            'Select id, name, and posts',
            'In posts select id, title, and views'
          ],
          initialCode: `export async function getSecureAuthorFeed(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      posts: {
        select: { id: true, title: true, views: true }
      }
    }
  });
}`,
          solutionCode: `export async function getSecureAuthorFeed(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      posts: {
        select: { id: true, title: true, views: true }
      }
    }
  });
}`,
          solutionExplanation: 'Secure nested query strictly excluding sensitive user data.',
          hints: [{ level: 1, text: 'Use nested select for posts.' }],
          validation: { targetModel: 'user', requiredMethod: 'findUnique', requiredFieldsInSelect: ['id', 'name', 'posts'] },
          successMessage: 'Day 7 challenge complete! Secure feed query constructed.'
        }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // DAY 8: Filtering, Sorting & Pagination
  // ---------------------------------------------------------------------------
  {
    id: 'day-08',
    slug: 'filtering-sorting-pagination',
    day: 8,
    title: 'Filtering, Sorting & Pagination',
    shortTitle: 'Filtering & Pagination',
    milestoneId: 'milestone-2',
    description: 'Build production-style list queries using complex operators, case-insensitive string search, multi-column sorting, and scalable pagination.',
    estimatedMinutes: 55,
    completionLearnings: [
      'Constructed complex boolean filter expressions using AND, OR, gte, lte, and mode: "insensitive"',
      'Compared Offset Pagination (take/skip) vs Cursor Pagination (take/cursor)',
      'Understood why cursor pagination scales to millions of rows without database degradation'
    ],
    concepts: [
      {
        id: 'day-08-concept-1',
        order: 1,
        title: 'Advanced Query Filtering: Range, Search & Logical Operators',
        shortDescription: 'Construct expressive database queries using case-insensitive search, array matching, and logical conditions.',
        theory: {
          summary: 'Prisma provides expressive filter operators: comparison (gte, lte, gt, lt), lists (in, notIn), text (contains, startsWith, endsWith with mode: "insensitive"), and boolean logic (AND, OR, NOT).',
          targetHero: {
            language: 'typescript',
            badge: 'Compound Filter Query',
            explanation: 'Combining price bounds, exact status, and case-insensitive search with AND.',
            code: `const results = await prisma.product.findMany({
  where: {
    AND: [
      { price: { gte: 25, lte: 150 } },
      { status: 'IN_STOCK' },
      { title: { contains: 'wireless', mode: 'insensitive' } }
    ]
  }
});`
          },
          explanation: [
            'mode: "insensitive": In PostgreSQL, translates to ILIKE for case-insensitive string matching.',
            'AND / OR: Accepts an array of condition objects.'
          ],
          keyTakeaway: 'Always use mode: "insensitive" for user-facing search inputs.',
          mcqs: [
            {
              id: 'mcq-8-1',
              question: 'In PostgreSQL, what SQL operator does "contains: "abc", mode: "insensitive"" generate?',
              options: [
                'LIKE "%abc%"',
                'ILIKE "%abc%"',
                '== "abc"',
                'REGEXP_LIKE'
              ],
              correctIndex: 1,
              explanation: 'Prisma generates ILIKE with wildcards for case-insensitive partial string search.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-8-1',
            title: 'Task 1 (Guided): Query Active Adult Users',
            description: 'Find all users whose age is greater than or equal to 18 AND status is "ACTIVE".',
            type: 'guided',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Call prisma.user.findMany',
              'where: { age: { gte: 18 }, status: "ACTIVE" }'
            ],
            initialCode: `export async function getActiveAdults() {
  return await prisma.user.findMany({
    // Filter age >= 18 and status 'ACTIVE'
  });
}`,
            solutionCode: `export async function getActiveAdults() {
  return await prisma.user.findMany({
    where: {
      age: { gte: 18 },
      status: 'ACTIVE'
    }
  });
}`,
            solutionExplanation: 'Combines numeric comparison gte: 18 with scalar match status: "ACTIVE".',
            hints: [
              { level: 1, text: 'Use age: { gte: 18 } and status: "ACTIVE" inside where.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'findMany',
              requiredWhereClauses: ['age', 'status']
            },
            successMessage: 'Great job! Active adult filter query executed.'
          },
          {
            id: 'task-8-2',
            title: 'Task 2 (Independent): Search Articles in Title OR Content',
            description: 'Search articles where title OR content contains a keyword (case-insensitive).',
            type: 'independent',
            targetModel: 'article',
            activeTab: 'editor',
            instructions: [
              'Use OR array inside where',
              'Check title contains keyword (mode: "insensitive")',
              'Check content contains keyword (mode: "insensitive")'
            ],
            initialCode: `export async function searchArticles(keyword: string) {
  // Return articles matching keyword in title OR content (case-insensitive)
}`,
            solutionCode: `export async function searchArticles(keyword: string) {
  return await prisma.article.findMany({
    where: {
      OR: [
        { title: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } }
      ]
    }
  });
}`,
            solutionExplanation: 'Uses OR array with mode: "insensitive" for flexible matching.',
            hints: [
              { level: 1, text: 'where: { OR: [ { title: ... }, { content: ... } ] }.' }
            ],
            validation: {
              targetModel: 'article',
              requiredMethod: 'findMany',
              requiredWhereClauses: ['OR']
            },
            successMessage: 'Awesome! Case-insensitive OR search constructed.'
          }
        ]
      },
      {
        id: 'day-08-concept-2',
        order: 2,
        title: 'Pagination at Scale: Offset vs Cursor-Based Strategies',
        shortDescription: 'Choose between offset pagination for fixed page numbers and cursor pagination for high-volume feeds.',
        theory: {
          summary: 'Offset pagination (skip, take) is simple for page numbers ("Page 3"), but slow on deep pages because the database must scan and discard thousands of rows. Cursor pagination (cursor, take, skip: 1) jumps directly to an indexed record, delivering constant-time O(1) performance.',
          targetHero: {
            language: 'typescript',
            badge: 'High-Speed Cursor Pagination',
            explanation: 'Uses indexed ID cursor for scalable infinite scroll.',
            code: `// High-performance cursor pagination
const feed = await prisma.post.findMany({
  take: 10,
  skip: 1, // Skip the cursor itself
  cursor: { id: lastPostId },
  orderBy: { id: 'asc' }
});`
          },
          explanation: [
            'Offset: skip: (page - 1) * pageSize, take: pageSize. Fast for small tables; slow for deep offsets.',
            'Cursor: cursor: { id: lastSeenId }, skip: 1, take: limit. Performs WHERE id > lastSeenId ORDER BY id LIMIT N. Extremely fast and resilient to new insertions.'
          ],
          keyTakeaway: 'Use cursor pagination for real-time feeds and infinite scrolls to prevent database degradation.',
          mcqs: [
            {
              id: 'mcq-8-2',
              question: 'Why does "skip: 100000, take: 20" become slow on large database tables?',
              options: [
                'Prisma can only return 1,000 records at a time',
                'The SQL database must read all 100,000 rows into memory before discarding them to return 20',
                'JavaScript integer overflow occurs',
                'PostgreSQL limits offsets to 500'
              ],
              correctIndex: 1,
              explanation: 'OFFSET N requires scanning and discarding N rows. Cursor pagination eliminates this by jumping directly to the index position.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-8-3',
            title: 'Task 1 (Guided): Implement Offset Pagination Helper',
            description: 'Implement getPaginatedProducts(page, pageSize) using skip and take.',
            type: 'guided',
            targetModel: 'product',
            activeTab: 'editor',
            instructions: [
              'Calculate skip = (page - 1) * pageSize',
              'Set take = pageSize',
              'Order by id asc'
            ],
            initialCode: `export async function getPaginatedProducts(page: number, pageSize: number = 20) {
  return await prisma.product.findMany({
    // Calculate skip and take
  });
}`,
            solutionCode: `export async function getPaginatedProducts(page: number, pageSize: number = 20) {
  return await prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { id: 'asc' }
  });
}`,
            solutionExplanation: 'Standard offset pagination formula for page-based UIs.',
            hints: [
              { level: 1, text: 'Set skip: (page - 1) * pageSize and take: pageSize.' }
            ],
            validation: {
              targetModel: 'product',
              requiredMethod: 'findMany'
            },
            successMessage: 'Offset pagination implemented successfully!'
          },
          {
            id: 'task-8-4',
            title: 'Task 2 (Independent): Implement Cursor Activity Stream',
            description: 'Implement getActivityStream(cursorId, limit) using cursor pagination.',
            type: 'independent',
            targetModel: 'activity',
            activeTab: 'editor',
            instructions: [
              'Set take: limit',
              'If cursorId is passed, add skip: 1 and cursor: { id: cursorId }',
              'Order by id desc'
            ],
            initialCode: `export async function getActivityStream(cursorId?: number, limit: number = 15) {
  // If cursorId is provided, use cursor pagination; otherwise take the first page
}`,
            solutionCode: `export async function getActivityStream(cursorId?: number, limit: number = 15) {
  return await prisma.activity.findMany({
    take: limit,
    ...(cursorId ? { skip: 1, cursor: { id: cursorId } } : {}),
    orderBy: { id: 'desc' }
  });
}`,
            solutionExplanation: 'Uses cursor pagination with conditional spread operator.',
            hints: [
              { level: 1, text: 'Conditionally include cursor: { id: cursorId } and skip: 1.' }
            ],
            validation: {
              targetModel: 'activity',
              requiredMethod: 'findMany'
            },
            successMessage: 'Great job! High-speed cursor stream created.'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-08-challenge',
      title: 'Day 8 Final Challenge: Production Catalog Search & Filter Engine',
      scenario: 'Create a catalog search query combining price bounds (gte, lte), status check, sorting by price asc, and limiting to 5 items.',
      tasks: [
        {
          id: 'challenge-8-1',
          title: 'Step 1: Implement Filtered Catalog Query',
          description: 'Find in-stock products between $10 and $150 ordered by price asc.',
          type: 'challenge',
          targetModel: 'product',
          activeTab: 'editor',
          instructions: [
            'Call prisma.product.findMany',
            'where price >= 10, price <= 150, status == "IN_STOCK"',
            'take 5, orderBy: { price: "asc" }'
          ],
          initialCode: `export async function filterCatalog() {
  return await prisma.product.findMany({
    where: {
      price: { gte: 10, lte: 150 },
      status: 'IN_STOCK'
    },
    take: 5,
    orderBy: { price: 'asc' }
  });
}`,
          solutionCode: `export async function filterCatalog() {
  return await prisma.product.findMany({
    where: {
      price: { gte: 10, lte: 150 },
      status: 'IN_STOCK'
    },
    take: 5,
    orderBy: { price: 'asc' }
  });
}`,
          solutionExplanation: 'Applies bounds, status filter, sorting, and limit.',
          hints: [{ level: 1, text: 'Combine price gte/lte with status: "IN_STOCK".' }],
          validation: { targetModel: 'product', requiredMethod: 'findMany', requiredWhereClauses: ['price', 'status'] },
          successMessage: 'Day 8 challenge complete! Catalog engine working.'
        }
      ]
    }
  }
];
