import { Concept, ModuleData } from '../../types/curriculum';

export interface VisualTable {
  title: string;
  badge?: string;
  columns: string[];
  rows: Array<Record<string, string | number | boolean>>;
  countLabel: string;
}

export interface QuestionCard {
  tag: string;
  question: string;
}

export interface ProcessingStep {
  number: number;
  title: string;
  pillBadge: string;
  description: string;
  table?: VisualTable;
  codeSnippet?: string;
}

export interface ConceptVisualModel {
  leadHook: string;
  introText: string;
  sourceTable: VisualTable;
  questions: [QuestionCard, QuestionCard];
  queryBreakdown: {
    title: string;
    code: string;
    explanation: string;
  };
  processingSteps: ProcessingStep[];
  meaningSummary: string[];
}

// Sample dataset tables stored in our simulated database
const USERS_TABLE: VisualTable = {
  title: 'users',
  badge: 'This table is already stored in the database.',
  columns: ['id', 'name', 'email', 'role', 'city'],
  rows: [
    { id: 1, name: 'Rahim', email: 'rahim@prisma.io', role: 'ADMIN', city: 'Dhaka' },
    { id: 2, name: 'Karim', email: 'karim@dev.io', role: 'USER', city: 'Gazipur' },
    { id: 3, name: 'Ayesha', email: 'ayesha@tech.org', role: 'USER', city: 'Dhaka' },
    { id: 4, name: 'Sumaiya', email: 'sumaiya@corp.net', role: 'USER', city: 'Chattogram' },
    { id: 5, name: 'Tanvir', email: 'tanvir@studio.io', role: 'EDITOR', city: 'Rajshahi' }
  ],
  countLabel: '5 rows'
};

const POSTS_TABLE: VisualTable = {
  title: 'posts',
  badge: 'This table is already stored in the database.',
  columns: ['id', 'title', 'published', 'authorId', 'views'],
  rows: [
    { id: 101, title: 'Getting Started with Prisma', published: true, authorId: 1, views: 1420 },
    { id: 102, title: 'Database Migrations Made Simple', published: true, authorId: 1, views: 890 },
    { id: 103, title: 'TypeScript Compile-Time Safety', published: false, authorId: 2, views: 0 },
    { id: 104, title: 'Optimizing SQL Queries with Indexes', published: true, authorId: 3, views: 2310 },
    { id: 105, title: 'Building Production REST Endpoints', published: false, authorId: 4, views: 50 }
  ],
  countLabel: '5 rows'
};

const PROFILES_TABLE: VisualTable = {
  title: 'profiles',
  badge: 'This table is already stored in the database.',
  columns: ['id', 'bio', 'avatarUrl', 'userId', 'country'],
  rows: [
    { id: 1, bio: 'Full-stack TypeScript developer', avatarUrl: '/avatars/1.png', userId: 1, country: 'Bangladesh' },
    { id: 2, bio: 'Database architect & mentor', avatarUrl: '/avatars/2.png', userId: 2, country: 'Bangladesh' },
    { id: 3, bio: 'Backend engineer at scale', avatarUrl: '/avatars/3.png', userId: 3, country: 'Bangladesh' }
  ],
  countLabel: '3 rows'
};

/**
 * Returns tailored visual tables, step-by-step breakdown, and conceptual questions
 * matching the exact teaching layout in the reference screenshot for ANY concept.
 */
export function getConceptVisualModel(concept: Concept, module: ModuleData): ConceptVisualModel {
  const cid = concept.id.toLowerCase();
  const mid = module.id.toLowerCase();

  // ---------------------------------------------------------------------------
  // Case A: Day 1 Concept 1 - Why Prisma & Type Safety / SELECT 101
  // ---------------------------------------------------------------------------
  if (cid.includes('day-01-concept-1') || (mid === 'day-01' && concept.order === 1)) {
    return {
      leadHook:
        'Every database query poses two fundamental questions: where does the data live, and what shape do you want back?',
      introText:
        'Every database query answers two questions: WHERE does the data come from, and WHICH fields do you want back? Imagine we have a database containing a table called users:',
      sourceTable: USERS_TABLE,
      questions: [
        {
          tag: 'WHERE',
          question: 'Where should I get the data from?'
        },
        {
          tag: 'SELECT',
          question: 'What columns do I want to see?'
        }
      ],
      queryBreakdown: {
        title: "THE QUERY WE'RE GOING TO BREAK DOWN",
        code: `const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    name: true,
    email: true
  }
});`,
        explanation: 'From the users table, retrieve only the name and email with compile-time type verification.'
      },
      processingSteps: [
        {
          number: 1,
          title: 'prisma.user (Find the source table)',
          pillBadge: 'prisma.user',
          description:
            'Prisma begins by finding the users table. At this stage, all 5 rows and all 5 columns are available.',
          table: {
            ...USERS_TABLE,
            title: 'users (Source Table)'
          }
        },
        {
          number: 2,
          title: 'where: { id: 1 } (Filter the target record)',
          pillBadge: 'where: { id: 1 }',
          description:
            'Next, Prisma filters by the unique @id primary key. At this stage, row 1 is isolated from the 5 available rows.',
          table: {
            title: 'users (Filtered Record)',
            columns: ['id', 'name', 'email', 'role', 'city'],
            rows: [USERS_TABLE.rows[0]],
            countLabel: '1 row'
          }
        },
        {
          number: 3,
          title: 'select: { name, email } (Extract the columns)',
          pillBadge: 'select: { name, email }',
          description:
            'Next, Prisma extracts only the name and email columns from each matched row, producing a clean inferred TypeScript return type.',
          table: {
            title: 'Final Query Result',
            columns: ['name', 'email'],
            rows: [{ name: 'Rahim', email: 'rahim@prisma.io' }],
            countLabel: '1 row'
          }
        }
      ],
      meaningSummary: [
        'Prisma client queries are compiled into parameterized SQL: SELECT "name", "email" FROM "users" WHERE "id" = $1 LIMIT 1;',
        'TypeScript enforces that fields inside select must exist on the User model in schema.prisma.',
        'The inferred TypeScript type is exactly { name: string; email: string } | null, preventing undefined property bugs.'
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // Case B: Day 1 Concept 2 - Schema, Client & Migrate
  // ---------------------------------------------------------------------------
  if (cid.includes('day-01-concept-2') || (mid === 'day-01' && concept.order === 2)) {
    return {
      leadHook:
        'Prisma bridges the divide between your database schema and your TypeScript backend through three coordinated tools.',
      introText:
        'When you edit data structures in TypeScript, your database does not change automatically. Imagine we have our initial users table in PostgreSQL:',
      sourceTable: USERS_TABLE,
      questions: [
        {
          tag: 'SCHEMA',
          question: 'How do models describe the database?'
        },
        {
          tag: 'CLIENT',
          question: 'How does TypeScript get strongly typed queries?'
        }
      ],
      queryBreakdown: {
        title: "THE WORKFLOW WE'RE GOING TO BREAK DOWN",
        code: `// 1. Describe structure in schema.prisma
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}

// 2. Query in TypeScript with generated types
const user = await prisma.user.findUnique({
  where: { email: 'rahim@prisma.io' }
});`,
        explanation: 'schema.prisma defines the single source of truth for both your PostgreSQL DDL and TypeScript client types.'
      },
      processingSteps: [
        {
          number: 1,
          title: 'schema.prisma (Declare the model)',
          pillBadge: 'schema.prisma',
          description:
            'You define the User model, field types, and unique constraints in schema.prisma.',
          table: {
            title: 'Declared Model Fields',
            columns: ['Field', 'Prisma Type', 'Attributes', 'SQL Mapping'],
            rows: [
              { Field: 'id', 'Prisma Type': 'Int', Attributes: '@id @default(autoincrement())', 'SQL Mapping': 'SERIAL PRIMARY KEY' },
              { Field: 'email', 'Prisma Type': 'String', Attributes: '@unique', 'SQL Mapping': 'VARCHAR UNIQUE' },
              { Field: 'name', 'Prisma Type': 'String?', Attributes: 'Optional', 'SQL Mapping': 'VARCHAR NULL' }
            ],
            countLabel: '3 fields'
          }
        },
        {
          number: 2,
          title: 'prisma migrate dev (Generate SQL DDL)',
          pillBadge: 'prisma migrate',
          description:
            'Prisma Migrate detects changes, generates an idempotent migration.sql file, and applies it to PostgreSQL.',
          table: {
            title: 'Generated Migration DDL',
            columns: ['Operation', 'Target Object', 'Status'],
            rows: [
              { Operation: 'CREATE TABLE', 'Target Object': '"User"', Status: 'Applied' },
              { Operation: 'CREATE UNIQUE INDEX', 'Target Object': '"User_email_key"', Status: 'Applied' }
            ],
            countLabel: '2 SQL operations'
          }
        },
        {
          number: 3,
          title: 'prisma generate (Instantiate Type-Safe Client)',
          pillBadge: 'prisma generate',
          description:
            'Prisma Client generates TypeScript definitions into node_modules/.prisma/client so autocompletion works instantly.',
          table: {
            title: 'Generated Client Delegate API',
            columns: ['Method', 'Arguments', 'Return Type'],
            rows: [
              { Method: 'prisma.user.findUnique', Arguments: '{ where: { id | email } }', 'Return Type': 'Promise<User | null>' },
              { Method: 'prisma.user.findMany', Arguments: '{ where?, select?, take? }', 'Return Type': 'Promise<User[]>' }
            ],
            countLabel: '2 primary methods'
          }
        }
      ],
      meaningSummary: [
        'schema.prisma is the single source of truth for database migrations and TypeScript types.',
        'Prisma Migrate generates versioned, reversible SQL scripts so team members share exact database state.',
        'Prisma Client eliminates handwritten type definitions and prevents schema drift.'
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // Case C: Relations / Include / Join concepts (Day 4, Day 7, Day 11, etc.)
  // ---------------------------------------------------------------------------
  if (cid.includes('relation') || cid.includes('include') || cid.includes('join') || mid === 'day-04') {
    return {
      leadHook:
        'Relational databases store related records across separate tables. Prisma allows seamless navigation without manual SQL joins.',
      introText:
        'In relational databases, parent records and child records live in separate tables connected by foreign keys. Imagine we have users and their published posts:',
      sourceTable: USERS_TABLE,
      questions: [
        {
          tag: 'RELATION',
          question: 'Which foreign key connects these models?'
        },
        {
          tag: 'INCLUDE',
          question: 'Do I want parent data, child relations, or both?'
        }
      ],
      queryBreakdown: {
        title: "THE RELATIONAL QUERY WE'RE GOING TO BREAK DOWN",
        code: `const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true
  }
});`,
        explanation: 'Retrieve Rahim from the users table along with all associated posts authored by user 1.'
      },
      processingSteps: [
        {
          number: 1,
          title: 'prisma.user.findUnique (Fetch Parent Record)',
          pillBadge: 'prisma.user',
          description:
            'Prisma executes the primary query to find the user with id = 1 from the users table.',
          table: {
            title: 'Parent User Record',
            columns: ['id', 'name', 'email', 'role'],
            rows: [USERS_TABLE.rows[0]],
            countLabel: '1 parent row'
          }
        },
        {
          number: 2,
          title: 'posts: true (Hydrate Matching Child Records)',
          pillBadge: 'posts (relation)',
          description:
            'Prisma executes a secondary batched query or relational join matching posts where authorId = 1.',
          table: {
            title: 'Related Child Posts (authorId = 1)',
            columns: ['id', 'title', 'published', 'authorId'],
            rows: POSTS_TABLE.rows.filter(r => r.authorId === 1),
            countLabel: '2 child rows'
          }
        },
        {
          number: 3,
          title: 'Combined Inferred Type (Nested Object Assembly)',
          pillBadge: 'User & { posts: Post[] }',
          description:
            'Prisma stitches the parent record and child array into a single strongly-typed TypeScript object.',
          table: {
            title: 'Final Inferred Hydrated Result',
            columns: ['User Name', 'Email', 'Post Count', 'First Post Title'],
            rows: [
              {
                'User Name': 'Rahim',
                Email: 'rahim@prisma.io',
                'Post Count': 2,
                'First Post Title': 'Getting Started with Prisma'
              }
            ],
            countLabel: '1 assembled record'
          }
        }
      ],
      meaningSummary: [
        'Prisma handles relational queries with include without requiring error-prone SQL JOIN string concatenation.',
        'TypeScript automatically infers that userWithPosts has a posts array attached.',
        'Foreign key constraints (@relation(fields: [authorId], references: [id])) guarantee referential integrity in the database.'
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // Case D: Filtering, Pagination & Sorting (Day 8, etc.)
  // ---------------------------------------------------------------------------
  if (cid.includes('filter') || cid.includes('where') || cid.includes('take') || cid.includes('page') || mid === 'day-08') {
    return {
      leadHook:
        'Production applications must filter specific subsets of data and paginate results to ensure high performance.',
      introText:
        'Databases hold thousands of rows, but client screens only need specific subsets. Imagine querying the posts table for published articles:',
      sourceTable: POSTS_TABLE,
      questions: [
        {
          tag: 'WHERE',
          question: 'Which conditional operators filter the rows?'
        },
        {
          tag: 'PAGINATION',
          question: 'How do take and skip slice the result window?'
        }
      ],
      queryBreakdown: {
        title: "THE FILTERED QUERY WE'RE GOING TO BREAK DOWN",
        code: `const recentPosts = await prisma.post.findMany({
  where: { published: true },
  orderBy: { views: 'desc' },
  take: 2,
  select: { title: true, views: true }
});`,
        explanation: 'Fetch the top 2 published posts sorted by view count, selecting only title and views.'
      },
      processingSteps: [
        {
          number: 1,
          title: 'where: { published: true } (Filter Rows)',
          pillBadge: 'where filter',
          description:
            'Prisma appends a WHERE "published" = true clause, filtering out all draft posts.',
          table: {
            title: 'Published Posts Filtered',
            columns: ['id', 'title', 'published', 'views'],
            rows: POSTS_TABLE.rows.filter(p => p.published),
            countLabel: '3 published rows'
          }
        },
        {
          number: 2,
          title: 'orderBy: { views: "desc" } (Sort in Database)',
          pillBadge: 'orderBy',
          description:
            'Prisma appends ORDER BY "views" DESC, utilizing PostgreSQL indexes to order rows before sending over network.',
          table: {
            title: 'Sorted by Views (Descending)',
            columns: ['id', 'title', 'views'],
            rows: [
              { id: 104, title: 'Optimizing SQL Queries with Indexes', views: 2310 },
              { id: 101, title: 'Getting Started with Prisma', views: 1420 },
              { id: 102, title: 'Database Migrations Made Simple', views: 890 }
            ],
            countLabel: '3 ordered rows'
          }
        },
        {
          number: 3,
          title: 'take: 2 & select (Extract Top Window)',
          pillBadge: 'take & select',
          description:
            'Prisma appends LIMIT 2 and selects only the title and views columns for the response payload.',
          table: {
            title: 'Final Query Result',
            columns: ['title', 'views'],
            rows: [
              { title: 'Optimizing SQL Queries with Indexes', views: 2310 },
              { title: 'Getting Started with Prisma', views: 1420 }
            ],
            countLabel: '2 rows'
          }
        }
      ],
      meaningSummary: [
        'Filtering and sorting inside the database leverages indexes and avoids pulling unnecessary rows across the network.',
        'Combining where with take and skip provides reliable pagination.',
        'Prisma generates strongly typed filter arguments such as equals, contains, in, gt, and lt.'
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // Case E: Generic / Default Fallback for All Other Concepts
  // ---------------------------------------------------------------------------
  const heroCode =
    concept.theory.targetHero?.code ||
    `const result = await prisma.user.findMany({
  where: { role: 'ADMIN' },
  select: { id: true, name: true, email: true }
});`;

  const heroExplanation =
    concept.theory.targetHero?.explanation ||
    'Execute a type-safe Prisma Client operation with verified schema fields and inferred TypeScript return types.';

  return {
    leadHook:
      concept.theory.summary?.split('\n\n')[0] ||
      'Master this core database engineering pattern using Prisma v7 compile-time verification.',
    introText:
      `When building production TypeScript backends, understanding how ${concept.title} operates ensures clean schema design and high query performance. Imagine we have our database table:`,
    sourceTable: USERS_TABLE,
    questions: [
      {
        tag: 'DATABASE',
        question: 'What happens inside the PostgreSQL database?'
      },
      {
        tag: 'TYPESCRIPT',
        question: 'How does Prisma Client guarantee type safety?'
      }
    ],
    queryBreakdown: {
      title: "THE QUERY WE'RE GOING TO BREAK DOWN",
      code: heroCode,
      explanation: heroExplanation
    },
    processingSteps: [
      {
        number: 1,
        title: 'Source Model & Schema Verification',
        pillBadge: 'schema.prisma',
        description:
          'Prisma verifies that all models and fields targeted by this query exist and conform to schema.prisma definitions.',
        table: USERS_TABLE
      },
      {
        number: 2,
        title: 'Query Optimization & Parameterization',
        pillBadge: 'Prisma Engine',
        description:
          'Prisma compiles the query into parameterized SQL, preventing SQL injection vulnerabilities and utilizing connection pools.',
        table: {
          title: 'Target Records',
          columns: ['id', 'name', 'email', 'role', 'city'],
          rows: [USERS_TABLE.rows[0], USERS_TABLE.rows[1]],
          countLabel: '2 matched rows'
        }
      },
      {
        number: 3,
        title: 'Inferred Result & Type Hydration',
        pillBadge: 'Inferred Type',
        description:
          'Prisma parses the returned database rows into strongly-typed JavaScript objects adhering to the query shape.',
        table: {
          title: 'Final Query Result',
          columns: ['id', 'name', 'email'],
          rows: [
            { id: 1, name: 'Rahim', email: 'rahim@prisma.io' },
            { id: 2, name: 'Karim', email: 'karim@dev.io' }
          ],
          countLabel: '2 rows'
        }
      }
    ],
    meaningSummary: [
      concept.theory.keyTakeaway || 'Prisma ensures declarative modeling, compile-time safety, and optimized SQL execution.',
      'All query arguments are verified by TypeScript prior to execution.',
      'Generated SQL is clean, parameterized, and resilient against schema drift.'
    ]
  };
}
