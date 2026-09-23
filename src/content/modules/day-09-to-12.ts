// =============================================================================
// MILESTONE 3: DAYS 9 TO 12
// =============================================================================

import { ModuleData } from '../../types/curriculum';

export const MILESTONE_3_MODULES: ModuleData[] = [
  // ---------------------------------------------------------------------------
  // DAY 9: create() + Zod Validation
  // ---------------------------------------------------------------------------
  {
    id: 'day-09',
    slug: 'create-and-zod-validation',
    day: 9,
    title: 'create() + Zod Validation',
    shortTitle: 'Create & Zod Validation',
    milestoneId: 'milestone-3',
    description: 'Safely accept user input, validate payloads with Zod schemas, and persist single and batch records with create() and createMany().',
    estimatedMinutes: 50,
    completionLearnings: [
      'Mastered single inserts (create) and batched high-throughput inserts (createMany with skipDuplicates: true)',
      'Defined runtime validation contracts with Zod schemas before data ever touches the database',
      'Inferred TypeScript types directly from Zod schemas with z.infer<typeof Schema>'
    ],
    concepts: [
      {
        id: 'day-09-concept-1',
        order: 1,
        title: 'Inserting Records: Single Writes vs Batch Imports',
        shortDescription: 'Persist records safely with create() and execute high-throughput bulk inserts with createMany().',
        theory: {
          summary: 'prisma.model.create({ data: { ... } }) creates a single record and returns the newly inserted object with auto-generated IDs and timestamps. createMany({ data: [...], skipDuplicates: true }) inserts multiple rows in a single batch INSERT statement.',
          targetHero: {
            language: 'typescript',
            badge: 'Data Creation Query',
            explanation: 'Single record creation returning the persisted user object.',
            code: `const newUser = await prisma.user.create({
  data: {
    email: 'newuser@prisma.io',
    name: 'Taylor Developer'
  }
});`
          },
          explanation: [
            'Single write (create): Performs INSERT INTO ... RETURNING *. Returns the fully populated entity.',
            'Batch write (createMany): Performs a multi-row INSERT INTO ... VALUES (...), (...). Extremely fast for migrations and bulk CSV imports.'
          ],
          keyTakeaway: 'Use createMany for high-throughput imports and create when you need the returned inserted object.',
          mcqs: [
            {
              id: 'mcq-9-1',
              question: 'Why does "prisma.model.createMany" not return the full array of created objects in standard PostgreSQL?',
              options: [
                'Because Prisma forbids reading data during writes',
                'Because createMany optimizes for batch speed, returning { count: N } rather than hydrating entire object graphs',
                'Because SQL does not support INSERT statements',
                'Because TypeScript arrays cannot hold more than 10 items'
              ],
              correctIndex: 1,
              explanation: 'createMany returns a count object { count: number } for peak performance.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-9-1',
            title: 'Task 1 (Guided): Create Category Record',
            description: 'Insert a new Category record with name and slug using prisma.category.create.',
            type: 'guided',
            targetModel: 'category',
            activeTab: 'editor',
            instructions: [
              'Call prisma.category.create',
              'Pass data: { name, slug }'
            ],
            initialCode: `export async function createCategory(name: string, slug: string) {
  return await prisma.category.create({
    // Fill data
  });
}`,
            solutionCode: `export async function createCategory(name: string, slug: string) {
  return await prisma.category.create({
    data: { name, slug }
  });
}`,
            solutionExplanation: 'Calls category.create passing the name and slug payload.',
            hints: [
              { level: 1, text: 'Use data: { name, slug }.' }
            ],
            validation: {
              targetModel: 'category',
              requiredMethod: 'create'
            },
            successMessage: 'Category created successfully!'
          },
          {
            id: 'task-9-2',
            title: 'Task 2 (Independent): Bulk Insert Tags with skipDuplicates',
            description: 'Bulk insert an array of tags using createMany with skipDuplicates: true.',
            type: 'independent',
            targetModel: 'tag',
            activeTab: 'editor',
            instructions: [
              'Call prisma.tag.createMany',
              'Set data: tags and skipDuplicates: true'
            ],
            initialCode: `export async function importTags(tags: { name: string }[]) {
  // Use createMany to insert tags without failing on duplicate names
}`,
            solutionCode: `export async function importTags(tags: { name: string }[]) {
  return await prisma.tag.createMany({
    data: tags,
    skipDuplicates: true
  });
}`,
            solutionExplanation: 'createMany with skipDuplicates avoids failing on existing tag names.',
            hints: [
              { level: 1, text: 'Pass data: tags and skipDuplicates: true to tag.createMany.' }
            ],
            validation: {
              targetModel: 'tag',
              requiredMethod: 'createMany'
            },
            successMessage: 'Bulk tags inserted with conflict protection!'
          }
        ]
      },
      {
        id: 'day-09-concept-2',
        order: 2,
        title: 'Runtime Payload Validation with Zod',
        shortDescription: 'Validate incoming user input before database calls to protect schema invariants and catch malicious payloads.',
        theory: {
          summary: 'ORMs guarantee database schema types, but they do NOT validate runtime user input (e.g. valid emails, password lengths, or positive quantities). Zod validates payloads at the HTTP layer, ensuring only clean data reaches Prisma.',
          targetHero: {
            language: 'typescript',
            badge: 'Runtime Validation Schema',
            explanation: 'Zod parses input at the HTTP boundary, inferring the TypeScript contract.',
            code: `import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  age: z.number().int().min(18),
  role: z.enum(['USER', 'ADMIN']).default('USER')
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;`
          },
          explanation: [
            'Schema.parse(rawBody): Throws a ZodError if any field fails validation, returning field-level issue details.',
            'Type Safety: z.infer<typeof Schema> generates the exact TypeScript interface automatically.'
          ],
          keyTakeaway: 'Always parse API inputs with Zod before calling prisma.model.create.',
          mcqs: [
            {
              id: 'mcq-9-2',
              question: 'What is the role of Zod when paired with Prisma in a web application?',
              options: [
                'Zod connects to the PostgreSQL database',
                'Zod validates incoming client request bodies at runtime before database operations occur',
                'Zod replaces schema.prisma',
                'Zod manages database migrations'
              ],
              correctIndex: 1,
              explanation: 'Zod guards the API boundary by rejecting malformed payloads before Prisma queries run.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-9-3',
            title: 'Task 1 (Guided): Define CreateProductSchema with Zod',
            description: 'Define CreateProductSchema requiring title (min 3 chars), positive price (number), and optional sku.',
            type: 'guided',
            targetModel: 'zod',
            activeTab: 'editor',
            instructions: [
              'title: z.string().min(3)',
              'price: z.number().positive()',
              'sku: z.string().optional()'
            ],
            initialCode: `import { z } from 'zod';

export const CreateProductSchema = z.object({
  // Define schema fields here
  title: z.string().min(3),
  price: z.number().positive(),
  sku: z.string().optional()
});`,
            solutionCode: `import { z } from 'zod';

export const CreateProductSchema = z.object({
  title: z.string().min(3),
  price: z.number().positive(),
  sku: z.string().optional()
});`,
            solutionExplanation: 'Zod validates title length and positive price.',
            hints: [
              { level: 1, text: 'Use title: z.string().min(3) and price: z.number().positive().' }
            ],
            validation: {
              customValidator: () => ({ valid: true })
            },
            successMessage: 'Product schema defined with strict constraints!'
          },
          {
            id: 'task-9-4',
            title: 'Task 2 (Independent): Parse Input and Persist Product',
            description: 'Parse rawBody with CreateProductSchema and pass the validated data to prisma.product.create.',
            type: 'independent',
            targetModel: 'product',
            activeTab: 'editor',
            instructions: [
              'const validated = CreateProductSchema.parse(rawBody)',
              'return await prisma.product.create({ data: validated })'
            ],
            initialCode: `export async function handleCreateProduct(rawBody: unknown) {
  // 1. Validate rawBody with CreateProductSchema
  // 2. Insert into DB and return created product
}`,
            solutionCode: `export async function handleCreateProduct(rawBody: unknown) {
  const CreateProductSchema = z.object({
    title: z.string().min(3),
    price: z.number().positive(),
    sku: z.string().optional()
  });
  const validatedData = CreateProductSchema.parse(rawBody);
  return await prisma.product.create({
    data: validatedData
  });
}`,
            solutionExplanation: 'Combines Zod validation with Prisma create in a clean handler.',
            hints: [
              { level: 1, text: 'Parse rawBody and pass result as data in prisma.product.create.' }
            ],
            validation: {
              targetModel: 'product',
              requiredMethod: 'create'
            },
            successMessage: 'Safe creation handler implemented!'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-09-challenge',
      title: 'Day 9 Final Challenge: Secure User Registration Pipeline',
      scenario: 'Create a user registration function that validates email and name, then inserts the user record.',
      tasks: [
        {
          id: 'challenge-9-1',
          title: 'Step 1: Validate and Create User',
          description: 'Insert user with email and name using prisma.user.create.',
          type: 'challenge',
          targetModel: 'user',
          activeTab: 'editor',
          instructions: [
            'Call prisma.user.create',
            'data: { email, name }'
          ],
          initialCode: `export async function registerUser(email: string, name: string) {
  return await prisma.user.create({
    data: { email, name }
  });
}`,
          solutionCode: `export async function registerUser(email: string, name: string) {
  return await prisma.user.create({
    data: { email, name }
  });
}`,
          solutionExplanation: 'Safely creates a new user record.',
          hints: [{ level: 1, text: 'Use prisma.user.create({ data: { email, name } }).' }],
          validation: { targetModel: 'user', requiredMethod: 'create' },
          successMessage: 'Day 9 challenge complete! Registration workflow verified.'
        }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // DAY 10: update(), updateMany() & upsert()
  // ---------------------------------------------------------------------------
  {
    id: 'day-10',
    slug: 'updates-and-upserts',
    day: 10,
    title: 'update(), updateMany() & upsert()',
    shortTitle: 'Updates & Upserts',
    milestoneId: 'milestone-3',
    description: 'Handle real update workflows, prevent race conditions with atomic numeric operations, apply bulk updates, and master idempotent upserts.',
    estimatedMinutes: 45,
    completionLearnings: [
      'Used atomic numeric operators (increment, decrement) to eliminate race conditions in concurrent traffic',
      'Applied bulk updates with updateMany across filtered sets of rows',
      'Mastered the upsert pattern for page views, settings, and idempotent synchronizations'
    ],
    concepts: [
      {
        id: 'day-10-concept-1',
        order: 1,
        title: 'Atomic Record Updates: Preventing Race Conditions',
        shortDescription: 'Safely update record states and perform atomic increments to eliminate concurrency bugs.',
        theory: {
          summary: 'In concurrent environments (e.g. 50 users buying an item simultaneously), reading stock, calculating stock - 1 in JavaScript, and writing it back causes "lost updates". Prisma atomic operators (increment, decrement, multiply, divide) execute directly in SQL (SET stock = stock - 1), guaranteeing thread safety.',
          targetHero: {
            language: 'typescript',
            badge: 'Atomic Update Pattern',
            explanation: 'Atomic increment prevents race conditions by running entirely in the database engine.',
            code: `// Atomic increment prevents lost updates in concurrent environments
const post = await prisma.post.update({
  where: { id: 42 },
  data: {
    views: { increment: 1 },
    title: 'Updated Title'
  }
});`
          },
          explanation: [
            'Race condition risk: Two requests read views: 10 at the same time. Both write views: 11. One view is lost!',
            'Atomic solution: views: { increment: 1 } translates to UPDATE posts SET views = views + 1 WHERE id = 42.'
          ],
          keyTakeaway: 'Always use { increment } / { decrement } for counters and inventory balances.',
          mcqs: [
            {
              id: 'mcq-10-1',
              question: 'Why should you use "{ stock: { decrement: 1 } }" instead of "data: { stock: currentStock - 1 }"?',
              options: [
                'To prevent race conditions where concurrent requests overwrite each other',
                'Because Prisma does not allow numbers in data',
                'Because decrement runs faster than JavaScript arithmetic',
                'To bypass foreign key checks'
              ],
              correctIndex: 0,
              explanation: 'Atomic operations are evaluated by the SQL engine in a single atomic step, eliminating race conditions.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-10-1',
            title: 'Task 1 (Guided): Update Customer Email by ID',
            description: 'Update customer email by their primary key id using prisma.customer.update.',
            type: 'guided',
            targetModel: 'customer',
            activeTab: 'editor',
            instructions: [
              'Call prisma.customer.update',
              'where: { id }',
              'data: { email: newEmail }'
            ],
            initialCode: `export async function updateCustomerEmail(id: number, newEmail: string) {
  return await prisma.customer.update({
    // Update customer email
  });
}`,
            solutionCode: `export async function updateCustomerEmail(id: number, newEmail: string) {
  return await prisma.customer.update({
    where: { id },
    data: { email: newEmail }
  });
}`,
            solutionExplanation: 'Updates email for customer matching id.',
            hints: [
              { level: 1, text: 'where: { id }, data: { email: newEmail }.' }
            ],
            validation: {
              targetModel: 'customer',
              requiredMethod: 'update',
              requiredWhereClauses: ['id']
            },
            successMessage: 'Customer email updated successfully!'
          },
          {
            id: 'task-10-2',
            title: 'Task 2 (Independent): Atomically Decrement Product Stock',
            description: 'Atomically decrement product stock by quantity upon purchase.',
            type: 'independent',
            targetModel: 'product',
            activeTab: 'editor',
            instructions: [
              'Call prisma.product.update',
              'where: { id: productId }',
              'data: { stock: { decrement: quantity } }'
            ],
            initialCode: `export async function purchaseItem(productId: number, quantity: number) {
  // Atomically decrement stock
}`,
            solutionCode: `export async function purchaseItem(productId: number, quantity: number) {
  return await prisma.product.update({
    where: { id: productId },
    data: {
      stock: { decrement: quantity }
    }
  });
}`,
            solutionExplanation: 'Executes atomic stock decrement safely in the database.',
            hints: [
              { level: 1, text: 'Set stock: { decrement: quantity } in data.' }
            ],
            validation: {
              targetModel: 'product',
              requiredMethod: 'update',
              requiredWhereClauses: ['id']
            },
            successMessage: 'Inventory atomically decremented without race conditions!'
          }
        ]
      },
      {
        id: 'day-10-concept-2',
        order: 2,
        title: 'Idempotent Mutations: The upsert() Pattern',
        shortDescription: 'Atomically create missing records or update existing entities without race conditions or duplicate keys.',
        theory: {
          summary: 'upsert checks for the existence of a row by a unique constraint. If the row exists, it applies update: { ... }; if not, it executes create: { ... }.',
          targetHero: {
            language: 'typescript',
            badge: 'Upsert Operation Blueprint',
            explanation: 'Ensures user preference exists and updates theme setting.',
            code: `const userSetting = await prisma.userSetting.upsert({
  where: { userId: 10 },
  update: { theme: 'DARK' },
  create: { userId: 10, theme: 'DARK', notifications: true }
});`
          },
          explanation: [
            'where: Must be a unique field or composite unique key.',
            'update: Partial or full fields to update.',
            'create: Full payload to create if nonexistent.'
          ],
          keyTakeaway: 'Use upsert for user preferences, analytics counters, and webhook idempotency.',
          mcqs: [
            {
              id: 'mcq-10-2',
              question: 'Which clause in "prisma.model.upsert" dictates how existing rows are located?',
              options: [
                'filter',
                'where (must target an @id or @unique field)',
                'findClause',
                'target'
              ],
              correctIndex: 1,
              explanation: 'upsert requires an indexed unique field in where to determine if update or create should be executed.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-10-3',
            title: 'Task 1 (Guided): Upsert User Notification Preference',
            description: 'Implement setPreference(userId, emailNotify) using prisma.userPreference.upsert.',
            type: 'guided',
            targetModel: 'userPreference',
            activeTab: 'editor',
            instructions: [
              'Call prisma.userPreference.upsert',
              'where: { userId }',
              'update: { emailNotify }',
              'create: { userId, emailNotify }'
            ],
            initialCode: `export async function setPreference(userId: number, emailNotify: boolean) {
  return await prisma.userPreference.upsert({
    // Complete upsert
  });
}`,
            solutionCode: `export async function setPreference(userId: number, emailNotify: boolean) {
  return await prisma.userPreference.upsert({
    where: { userId },
    update: { emailNotify },
    create: { userId, emailNotify }
  });
}`,
            solutionExplanation: 'Creates or updates notification preference atomically.',
            hints: [
              { level: 1, text: 'where: { userId }, update: { emailNotify }, create: { userId, emailNotify }.' }
            ],
            validation: {
              targetModel: 'userPreference',
              requiredMethod: 'upsert',
              requiredWhereClauses: ['userId']
            },
            successMessage: 'User preference successfully upserted!'
          },
          {
            id: 'task-10-4',
            title: 'Task 2 (Independent): Record Page View with Atomic Upsert',
            description: 'Upsert page view: if pagePath exists, increment views by 1; if not, create with views = 1.',
            type: 'independent',
            targetModel: 'pageView',
            activeTab: 'editor',
            instructions: [
              'Call prisma.pageView.upsert',
              'where: { path: pagePath }',
              'update: { views: { increment: 1 } }',
              'create: { path: pagePath, views: 1 }'
            ],
            initialCode: `export async function recordPageView(pagePath: string) {
  // Upsert: if pagePath exists, increment views by 1; if not, create with views = 1
}`,
            solutionCode: `export async function recordPageView(pagePath: string) {
  return await prisma.pageView.upsert({
    where: { path: pagePath },
    update: { views: { increment: 1 } },
    create: { path: pagePath, views: 1 }
  });
}`,
            solutionExplanation: 'Pairs upsert with atomic increment for bulletproof view counting.',
            hints: [
              { level: 1, text: 'Use update: { views: { increment: 1 } } and create: { path: pagePath, views: 1 }.' }
            ],
            validation: {
              targetModel: 'pageView',
              requiredMethod: 'upsert',
              requiredWhereClauses: ['path']
            },
            successMessage: 'Page view recorder successfully constructed!'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-10-challenge',
      title: 'Day 10 Final Challenge: Inventory Reconciliation',
      scenario: 'Implement a quantity increment on Product matching productId using atomic increment.',
      tasks: [
        {
          id: 'challenge-10-1',
          title: 'Step 1: Increment Product Stock',
          description: 'Increment stock on Product by addedQty.',
          type: 'challenge',
          targetModel: 'product',
          activeTab: 'editor',
          instructions: [
            'Call prisma.product.update',
            'where: { id: productId }',
            'data: { stock: { increment: addedQty } }'
          ],
          initialCode: `export async function restockProduct(productId: number, addedQty: number) {
  return await prisma.product.update({
    where: { id: productId },
    data: { stock: { increment: addedQty } }
  });
}`,
          solutionCode: `export async function restockProduct(productId: number, addedQty: number) {
  return await prisma.product.update({
    where: { id: productId },
    data: { stock: { increment: addedQty } }
  });
}`,
          solutionExplanation: 'Atomically restocks inventory.',
          hints: [{ level: 1, text: 'stock: { increment: addedQty }.' }],
          validation: { targetModel: 'product', requiredMethod: 'update', requiredWhereClauses: ['id'] },
          successMessage: 'Day 10 challenge complete! Stock restocked atomically.'
        }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // DAY 11: Delete & Referential Actions
  // ---------------------------------------------------------------------------
  {
    id: 'day-11',
    slug: 'delete-referential-actions',
    day: 11,
    title: 'Delete & Referential Actions',
    shortTitle: 'Deletes & Cascade Actions',
    milestoneId: 'milestone-3',
    description: 'Understand data integrity upon deletion, cascade deletes vs foreign key protection, referential action rules, and the soft-delete pattern.',
    estimatedMinutes: 45,
    completionLearnings: [
      'Configured referential actions: onDelete: Cascade vs SetNull vs Restrict in schema.prisma',
      'Understood how cascade deletes protect applications from orphaned records',
      'Implemented the soft-delete pattern with deletedAt timestamps for compliance and data recovery'
    ],
    concepts: [
      {
        id: 'day-11-concept-1',
        order: 1,
        title: 'Referential Integrity: Cascade Deletes & Foreign Key Rules',
        shortDescription: 'Define explicit child record behaviors on deletion to safeguard database consistency.',
        theory: {
          summary: 'When a record is deleted, foreign keys dictate child behavior: Cascade deletes all child rows automatically. SetNull sets the child foreign key to null (requires optional foreign key). Restrict blocks parent deletion if child records exist.',
          targetHero: {
            language: 'prisma',
            badge: 'Referential Action Blueprint',
            explanation: 'Setting onDelete: Cascade on Comment automatically purges comments when parent Post is deleted.',
            code: `model Post {
  id       Int       @id @default(autoincrement())
  authorId Int?
  author   User?     @relation(fields: [authorId], references: [id], onDelete: SetNull)
  comments Comment[] // Comments configure onDelete: Cascade in Comment model
}

model Comment {
  id     Int  @id @default(autoincrement())
  postId Int
  post   Post @relation(fields: [postId], references: [id], onDelete: Cascade)
}`
          },
          explanation: [
            'onDelete: Cascade: Best for tight compositions (e.g. Order and OrderItems).',
            'onDelete: SetNull: Best when child should survive parent removal (e.g. Article author is deleted, but article remains).',
            'onDelete: Restrict: Prevents accidental deletions (e.g. cannot delete a User who has active Orders).'
          ],
          keyTakeaway: 'Always configure explicit onDelete rules to prevent database foreign key constraint violations.',
          mcqs: [
            {
              id: 'mcq-11-1',
              question: 'What happens when a User is deleted if their Posts have "onDelete: Restrict"?',
              options: [
                'The user and all their posts are deleted',
                'The database rejects the deletion with a foreign key constraint violation error (P2003)',
                'The posts are reassigned to an admin',
                'The posts become null'
              ],
              correctIndex: 1,
              explanation: 'Restrict physically blocks deletion of the parent as long as child records reference it.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-11-1',
            title: 'Task 1 (Guided): Configure onDelete: Cascade on OrderItem',
            description: 'Configure onDelete: Cascade on the OrderItem -> Order relation.',
            type: 'guided',
            targetModel: 'OrderItem',
            activeTab: 'schema',
            instructions: [
              'In model OrderItem, add onDelete: Cascade to the order relation'
            ],
            initialCode: `model OrderItem {
  id      Int   @id @default(autoincrement())
  orderId Int
  order   Order @relation(fields: [orderId], references: [id])
  // Add onDelete: Cascade
}`,
            solutionCode: `model OrderItem {
  id      Int   @id @default(autoincrement())
  orderId Int
  order   Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
}`,
            solutionExplanation: 'Adds onDelete: Cascade so deleting an Order deletes its items automatically.',
            hints: [
              { level: 1, text: 'Append ", onDelete: Cascade" inside @relation(...).' }
            ],
            validation: {
              targetModel: 'OrderItem'
            },
            successMessage: 'Cascade deletion successfully configured!'
          },
          {
            id: 'task-11-2',
            title: 'Task 2 (Independent): Configure onDelete: SetNull on Article Author',
            description: 'Set onDelete: SetNull on Author relation in Article so articles remain if Author is deleted.',
            type: 'independent',
            targetModel: 'Article',
            activeTab: 'schema',
            instructions: [
              'Add onDelete: SetNull inside @relation for author in Article'
            ],
            initialCode: `model Article {
  id       Int     @id @default(autoincrement())
  authorId Int?
  author   Author? @relation(fields: [authorId], references: [id])
  // Configure onDelete: SetNull
}`,
            solutionCode: `model Article {
  id       Int     @id @default(autoincrement())
  authorId Int?
  author   Author? @relation(fields: [authorId], references: [id], onDelete: SetNull)
}`,
            solutionExplanation: 'SetNull nullifies authorId when Author is removed.',
            hints: [
              { level: 1, text: 'Add onDelete: SetNull to @relation.' }
            ],
            validation: {
              targetModel: 'Article'
            },
            successMessage: 'SetNull referential action configured!'
          }
        ]
      },
      {
        id: 'day-11-concept-2',
        order: 2,
        title: 'Audit-Safe Soft Deletions: The deletedAt Pattern',
        shortDescription: 'Preserve relational history and compliance audit trails by transitioning from physical deletes to soft timestamps.',
        theory: {
          summary: 'Hard deletes permanently remove rows from the database, destroying financial, legal, and activity history. The soft-delete pattern adds deletedAt DateTime? to the schema. "Deleting" simply updates deletedAt to now(), and queries filter by where: { deletedAt: null }.',
          targetHero: {
            language: 'typescript',
            badge: 'Soft Delete Execution',
            explanation: 'Updates deletedAt timestamp instead of removing the database row.',
            code: `// Soft delete execution
await prisma.user.update({
  where: { id: userId },
  data: { deletedAt: new Date() }
});`
          },
          explanation: [
            'Audit Safety: Deleted users can be restored or referenced by historical billing invoices.',
            'Prisma Client Extensions: You can create a client extension that automatically appends where: { deletedAt: null } to all read queries.'
          ],
          keyTakeaway: 'In business-critical databases, soft delete preserves data integrity and financial history.',
          mcqs: [
            {
              id: 'mcq-11-2',
              question: 'What is the key advantage of soft deletion over hard physical deletion?',
              options: [
                'Soft delete speeds up SQL queries',
                'Soft delete preserves audit trails, prevents broken historical foreign keys, and allows undoing mistakes',
                'Soft delete uses zero disk space',
                'Prisma does not support hard deletes'
              ],
              correctIndex: 1,
              explanation: 'Preserving historical rows ensures invoices, logs, and references remain intact.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-11-3',
            title: 'Task 1 (Guided): Implement Soft Delete Function',
            description: 'Implement softDeleteUser(id) by updating deletedAt to new Date().',
            type: 'guided',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Call prisma.user.update',
              'where: { id }',
              'data: { deletedAt: new Date() }'
            ],
            initialCode: `export async function softDeleteUser(id: number) {
  // Update user setting deletedAt to new Date()
}`,
            solutionCode: `export async function softDeleteUser(id: number) {
  return await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
}`,
            solutionExplanation: 'Updates deletedAt timestamp rather than deleting the row.',
            hints: [
              { level: 1, text: 'Pass data: { deletedAt: new Date() } to user.update.' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'update',
              requiredWhereClauses: ['id']
            },
            successMessage: 'Soft delete executed successfully!'
          },
          {
            id: 'task-11-4',
            title: 'Task 2 (Independent): Query Active (Non-Deleted) Accounts',
            description: 'Retrieve accounts strictly filtering where: { deletedAt: null }.',
            type: 'independent',
            targetModel: 'account',
            activeTab: 'editor',
            instructions: [
              'Call prisma.account.findMany',
              'where: { deletedAt: null }'
            ],
            initialCode: `export async function getActiveAccounts() {
  // Find all accounts where deletedAt is null
}`,
            solutionCode: `export async function getActiveAccounts() {
  return await prisma.account.findMany({
    where: { deletedAt: null }
  });
}`,
            solutionExplanation: 'Excludes soft-deleted records by checking for null.',
            hints: [
              { level: 1, text: 'Pass where: { deletedAt: null }.' }
            ],
            validation: {
              targetModel: 'account',
              requiredMethod: 'findMany',
              requiredWhereClauses: ['deletedAt']
            },
            successMessage: 'Active accounts query successfully filtered!'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-11-challenge',
      title: 'Day 11 Final Challenge: Cascade Purge Pipeline',
      scenario: 'Delete a post and ensure all associated comments are removed via cascade delete.',
      tasks: [
        {
          id: 'challenge-11-1',
          title: 'Step 1: Delete Target Post',
          description: 'Execute prisma.post.delete on post with id 4.',
          type: 'challenge',
          targetModel: 'post',
          activeTab: 'editor',
          instructions: [
            'Call prisma.post.delete',
            'where: { id: 4 }'
          ],
          initialCode: `export async function deletePostCascade(id: number = 4) {
  return await prisma.post.delete({
    where: { id }
  });
}`,
          solutionCode: `export async function deletePostCascade(id: number = 4) {
  return await prisma.post.delete({
    where: { id }
  });
}`,
          solutionExplanation: 'Performs delete operation on post.',
          hints: [{ level: 1, text: 'Use prisma.post.delete({ where: { id } }).' }],
          validation: { targetModel: 'post', requiredMethod: 'delete', requiredWhereClauses: ['id'] },
          successMessage: 'Day 11 challenge complete! Post deleted.'
        }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // DAY 12: Nested Writes & Transactions
  // ---------------------------------------------------------------------------
  {
    id: 'day-12',
    slug: 'nested-writes-transactions',
    day: 12,
    title: 'Nested Writes & Transactions',
    shortTitle: 'Nested Writes & Transactions',
    milestoneId: 'milestone-3',
    description: 'Perform atomic multi-step operations using nested create/connect, sequential $transaction arrays, and interactive transaction functions.',
    estimatedMinutes: 55,
    completionLearnings: [
      'Mastered nested writes: creating parents and related children in a single Prisma call with create, connect, and connectOrCreate',
      'Understood sequential transactions (prisma.$transaction([op1, op2])) for bulk atomic execution',
      'Implemented interactive transactions (prisma.$transaction(async (tx) => ...)) with rollback guarantees on failure'
    ],
    concepts: [
      {
        id: 'day-12-concept-1',
        order: 1,
        title: 'Relational Nested Writes: Atomic Parent & Child Mutations',
        shortDescription: 'Create or associate related models in a single fluent operation without manual foreign key assignments.',
        theory: {
          summary: 'Prisma handles relational insertion in a single fluent operation. "create" makes a new child inline; "connect" links an existing record by unique key; "connectOrCreate" connects if found or creates if absent.',
          targetHero: {
            language: 'typescript',
            badge: 'Nested Relational Write',
            explanation: 'Creates a post, connects author by email, and creates nested tags simultaneously.',
            code: `const post = await prisma.post.create({
  data: {
    title: 'Prisma v7 Deep Dive',
    author: { connect: { email: 'alex@prisma.io' } },
    tags: {
      create: [{ name: 'typescript' }, { name: 'orm' }]
    }
  }
});`
          },
          explanation: [
            'Atomic by default: Nested writes execute in an automatic transaction. If tag creation fails, the post is not inserted.',
            'connect: Eliminates querying for authorId first before inserting the post.'
          ],
          keyTakeaway: 'Use nested writes to create parents and children atomically without manual foreign key management.',
          mcqs: [
            {
              id: 'mcq-12-1',
              question: 'What happens if a nested write fails (e.g. creating the second child record violates a constraint)?',
              options: [
                'The parent is created, but the child is omitted',
                'Prisma automatically rolls back the entire operation, leaving no orphaned parent',
                'The database corrupts the table',
                'The operation retries infinitely'
              ],
              correctIndex: 1,
              explanation: 'Nested writes are executed inside an automatic transaction, guaranteeing full rollback on failure.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-12-1',
            title: 'Task 1 (Guided): Create Order with Nested Items',
            description: 'Create an Order with customerId and nested items array in a single prisma.order.create call.',
            type: 'guided',
            targetModel: 'order',
            activeTab: 'editor',
            instructions: [
              'Call prisma.order.create',
              'data: { customerId, items: { create: items } }'
            ],
            initialCode: `export async function createOrderWithItems(customerId: number, items: { title: string; price: number }[]) {
  return await prisma.order.create({
    // Create order with customerId and nested items
  });
}`,
            solutionCode: `export async function createOrderWithItems(customerId: number, items: { title: string; price: number }[]) {
  return await prisma.order.create({
    data: {
      customerId,
      items: {
        create: items
      }
    }
  });
}`,
            solutionExplanation: 'Uses items: { create: items } for inline child creation.',
            hints: [
              { level: 1, text: 'Use data: { customerId, items: { create: items } }.' }
            ],
            validation: {
              targetModel: 'order',
              requiredMethod: 'create'
            },
            successMessage: 'Order and nested line items created atomically!'
          },
          {
            id: 'task-12-2',
            title: 'Task 2 (Independent): Create Post Connecting Existing Author and Category',
            description: 'Create a post connecting an existing author by id and connecting category by id.',
            type: 'independent',
            targetModel: 'post',
            activeTab: 'editor',
            instructions: [
              'Call prisma.post.create',
              'Connect author: { connect: { id: authorId } }',
              'Connect category: { connect: { id: categoryId } }'
            ],
            initialCode: `export async function createConnectedPost(title: string, authorId: number, categoryId: number) {
  // Connect author and category
}`,
            solutionCode: `export async function createConnectedPost(title: string, authorId: number, categoryId: number) {
  return await prisma.post.create({
    data: {
      title,
      author: { connect: { id: authorId } },
      category: { connect: { id: categoryId } }
    }
  });
}`,
            solutionExplanation: 'connect links existing records without fetching IDs first.',
            hints: [
              { level: 1, text: 'Use author: { connect: { id: authorId } }.' }
            ],
            validation: {
              targetModel: 'post',
              requiredMethod: 'create'
            },
            successMessage: 'Post connected to author and category successfully!'
          }
        ]
      },
      {
        id: 'day-12-concept-2',
        order: 2,
        title: 'ACID Transactions: Batch vs Interactive Workflows',
        shortDescription: 'Ensure data integrity across multiple queries with all-or-nothing transactional guarantees.',
        theory: {
          summary: 'Sequential transactions (prisma.$transaction([op1, op2])) take an array of query promises and execute them in one transaction. Interactive transactions (prisma.$transaction(async (tx) => { ... })) allow subsequent queries to read values returned by earlier operations while the transaction is held open.',
          targetHero: {
            language: 'typescript',
            badge: 'Interactive ACID Transaction',
            explanation: 'Reads sender balance, validates funds, and transfers atomically.',
            code: `// Interactive transaction for balance transfer
const transfer = await prisma.$transaction(async (tx) => {
  const sender = await tx.account.findUniqueOrThrow({ where: { id: senderId } });
  if (sender.balance < amount) throw new Error('Insufficient balance');

  await tx.account.update({ where: { id: senderId }, data: { balance: { decrement: amount } } });
  return await tx.account.update({ where: { id: receiverId }, data: { balance: { increment: amount } } });
});`
          },
          explanation: [
            'Sequential: Ideal when queries do not depend on outputs of other queries in the same transaction.',
            'Interactive: Essential for bank transfers, seat bookings, and inventory checkout where reading state dictates subsequent writes.'
          ],
          keyTakeaway: 'Use interactive transactions when writes depend on intermediate read values.',
          mcqs: [
            {
              id: 'mcq-12-2',
              question: 'In an interactive transaction, what client must you execute queries against?',
              options: [
                'The global prisma client',
                'The scoped "tx" client passed into the async callback',
                'Raw SQL connection pool',
                'A new PrismaClient() instance'
              ],
              correctIndex: 1,
              explanation: 'You must query against the tx instance passed to the callback; querying global prisma runs outside the transaction!'
            }
          ]
        },
        tasks: [
          {
            id: 'task-12-3',
            title: 'Task 1 (Guided): Wrap Updates in Sequential $transaction',
            description: 'Wrap a product stock decrement and audit log creation in a sequential prisma.$transaction array.',
            type: 'guided',
            targetModel: 'product',
            activeTab: 'editor',
            instructions: [
              'Call prisma.$transaction([ ... ])',
              'First item: prisma.product.update(...)',
              'Second item: prisma.auditLog.create(...)'
            ],
            initialCode: `export async function recordInventoryChange(productId: number, qty: number) {
  // Wrap both updates into prisma.$transaction([ ... ])
}`,
            solutionCode: `export async function recordInventoryChange(productId: number, qty: number) {
  return await prisma.$transaction([
    prisma.product.update({ where: { id: productId }, data: { stock: { decrement: qty } } }),
    prisma.auditLog.create({ data: { message: \`Decremented product \${productId} by \${qty}\` } })
  ]);
}`,
            solutionExplanation: 'Ensures audit log is written if and only if inventory is decremented.',
            hints: [
              { level: 1, text: 'Return prisma.$transaction([ op1, op2 ]).' }
            ],
            validation: {
              targetModel: 'product',
              requiredMethod: '$transaction'
            },
            successMessage: 'Sequential transaction configured!'
          },
          {
            id: 'task-12-4',
            title: 'Task 2 (Independent): Interactive Transaction for Seat Booking',
            description: 'Check if seat is booked; if not, mark isBooked = true and create ticket.',
            type: 'independent',
            targetModel: 'seat',
            activeTab: 'editor',
            instructions: [
              'Use prisma.$transaction(async (tx) => { ... })',
              'Find seat with tx.seat.findUniqueOrThrow',
              'If seat.isBooked, throw Error("Seat already booked")',
              'Update seat and create ticket with tx.ticket.create'
            ],
            initialCode: `export async function bookSeat(seatId: number, userId: number) {
  return await prisma.$transaction(async (tx) => {
    // 1. Find seat, verify !isBooked
    // 2. Mark seat isBooked = true
    // 3. Create ticket
  });
}`,
            solutionCode: `export async function bookSeat(seatId: number, userId: number) {
  return await prisma.$transaction(async (tx) => {
    const seat = await tx.seat.findUniqueOrThrow({ where: { id: seatId } });
    if (seat.isBooked) throw new Error('Seat already booked');

    await tx.seat.update({ where: { id: seatId }, data: { isBooked: true } });
    return await tx.ticket.create({ data: { seatId, userId } });
  });
}`,
            solutionExplanation: 'Interactive transaction prevents double-booking race conditions.',
            hints: [
              { level: 1, text: 'Use tx.seat.update and tx.ticket.create inside tx callback.' }
            ],
            validation: {
              targetModel: 'seat',
              requiredMethod: '$transaction'
            },
            successMessage: 'Double-booking race condition eliminated!'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-12-challenge',
      title: 'Day 12 Final Challenge: Multi-Vendor Checkout Engine',
      scenario: 'Implement an atomic checkout transaction: decrements stock and creates the order in a single transaction.',
      tasks: [
        {
          id: 'challenge-12-1',
          title: 'Step 1: Execute Checkout Transaction',
          description: 'Decrement stock on Product 101 and create Order in prisma.$transaction.',
          type: 'challenge',
          targetModel: 'order',
          activeTab: 'editor',
          instructions: [
            'Use prisma.$transaction([ ... ])',
            'Decrement product 101 stock by 1',
            'Create order with orderNumber and total'
          ],
          initialCode: `export async function checkoutTransaction() {
  return await prisma.$transaction([
    prisma.product.update({ where: { id: 101 }, data: { stock: { decrement: 1 } } }),
    prisma.order.create({ data: { orderNumber: 'ORD-999', userId: 1, total: 129.99 } })
  ]);
}`,
          solutionCode: `export async function checkoutTransaction() {
  return await prisma.$transaction([
    prisma.product.update({ where: { id: 101 }, data: { stock: { decrement: 1 } } }),
    prisma.order.create({ data: { orderNumber: 'ORD-999', userId: 1, total: 129.99 } })
  ]);
}`,
          solutionExplanation: 'Guarantees both stock update and order creation commit atomically.',
          hints: [{ level: 1, text: 'Pass array of operations to prisma.$transaction.' }],
          validation: { targetModel: 'order', requiredMethod: '$transaction' },
          successMessage: 'Day 12 challenge complete! Checkout transaction secured.'
        }
      ]
    }
  }
];
