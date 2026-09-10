// =============================================================================
// MILESTONE 4: DAYS 13 TO 14
// =============================================================================

import { ModuleData } from '../../types/curriculum';

export const MILESTONE_4_MODULES: ModuleData[] = [
  // ---------------------------------------------------------------------------
  // DAY 13: Errors + Express Error Middleware
  // ---------------------------------------------------------------------------
  {
    id: 'day-13',
    slug: 'errors-and-middleware',
    day: 13,
    title: 'Errors + Express Error Middleware',
    shortTitle: 'Errors & Middleware',
    milestoneId: 'milestone-4',
    description: 'Intercept Prisma error codes (P2002, P2025), prevent leaking database internals, and build clean Express HTTP error middleware.',
    estimatedMinutes: 50,
    completionLearnings: [
      'Identified critical Prisma error codes: P2002 (unique constraint violation), P2025 (record not found), and P2003 (foreign key failure)',
      'Built centralized Express error middleware mapping database errors to clean HTTP 409, 404, and 400 status responses',
      'Hardened production APIs to prevent sensitive stack traces and SQL queries leaking to clients'
    ],
    concepts: [
      {
        id: 'day-13-concept-1',
        order: 1,
        title: 'Prisma Error Classification & Error Codes',
        shortDescription: 'Catch Prisma.PrismaClientKnownRequestError and inspect typed error codes.',
        theory: {
          summary: 'When a database operation violates a constraint, Prisma throws a PrismaClientKnownRequestError containing a standardized code. Key production codes include P2002 (Unique constraint failed), P2025 (Record to update/delete not found), and P2003 (Foreign key constraint violation).',
          targetHero: {
            language: 'typescript',
            badge: 'Typed Error Interception',
            explanation: 'Catches P2002 unique constraint violations and reads target column metadata.',
            code: `import { Prisma } from '@prisma/client';

try {
  await prisma.user.create({ data: { email: 'duplicate@test.com' } });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      console.error(\`Unique constraint failed on: \${error.meta?.target}\`);
    }
  }
}`
          },
          explanation: [
            'P2002: Occurs when inserting a duplicate email or SKU. error.meta.target contains the violated field.',
            'P2025: Occurs when update or delete specifies a where clause matching 0 rows.',
            'P2003: Occurs when inserting or deleting a row with an invalid foreign key reference.'
          ],
          keyTakeaway: 'Always check error.code === "P2002" rather than inspecting raw error message strings.',
          mcqs: [
            {
              id: 'mcq-13-1',
              question: 'Which error code does Prisma throw when a unique constraint is violated (e.g. duplicate email)?',
              options: [
                'P1001',
                'P2002',
                'P2025',
                'SQL_DUPLICATE_KEY'
              ],
              correctIndex: 1,
              explanation: 'P2002 is the standardized Prisma error code for unique constraint violations.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-13-1',
            title: 'Task 1 (Guided): Intercept P2002 Duplicate Email Error',
            description: 'Catch PrismaClientKnownRequestError P2002 when creating a user and return { error: "Email already taken" }.',
            type: 'guided',
            targetModel: 'user',
            activeTab: 'editor',
            instructions: [
              'Check if error.code === "P2002"',
              'Return { error: "Email already taken" }'
            ],
            initialCode: `export async function safeCreateUser(data: { email: string; name: string }) {
  try {
    return await prisma.user.create({ data });
  } catch (error: any) {
    // Catch P2002 and return { error: "Email already taken" }
    if (error.code === 'P2002') {
      return { error: 'Email already taken' };
    }
    throw error;
  }
}`,
            solutionCode: `export async function safeCreateUser(data: { email: string; name: string }) {
  try {
    return await prisma.user.create({ data });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Email already taken' };
    }
    throw error;
  }
}`,
            solutionExplanation: 'Gracefully handles duplicate email attempts without crashing.',
            hints: [
              { level: 1, text: 'Check if (error.code === "P2002").' }
            ],
            validation: {
              targetModel: 'user',
              requiredMethod: 'create',
              expectedErrorCode: 'P2002'
            },
            successMessage: 'P2002 error successfully intercepted!'
          },
          {
            id: 'task-13-2',
            title: 'Task 2 (Independent): Catch P2025 Record Not Found on Delete',
            description: 'Catch P2025 when deleting a post by ID and return { error: "Post not found" } instead of crashing.',
            type: 'independent',
            targetModel: 'post',
            activeTab: 'editor',
            instructions: [
              'Attempt prisma.post.delete where: { id }',
              'Catch P2025 error and return { error: "Post not found" }'
            ],
            initialCode: `export async function safeDeletePost(id: number) {
  // Handle P2025 record not found
  try {
    return await prisma.post.delete({ where: { id } });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return { error: 'Post not found' };
    }
    throw error;
  }
}`,
            solutionCode: `export async function safeDeletePost(id: number) {
  try {
    return await prisma.post.delete({ where: { id } });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return { error: 'Post not found' };
    }
    throw error;
  }
}`,
            solutionExplanation: 'Catches P2025 when deleting nonexistent records.',
            hints: [
              { level: 1, text: 'Check error.code === "P2025".' }
            ],
            validation: {
              targetModel: 'post',
              requiredMethod: 'delete',
              expectedErrorCode: 'P2025'
            },
            successMessage: 'P2025 missing record handled cleanly!'
          }
        ]
      },
      {
        id: 'day-13-concept-2',
        order: 2,
        title: 'Centralized Express Error Middleware',
        shortDescription: 'Decouple route controllers from error formatting with centralized Express middleware.',
        theory: {
          summary: 'Individual API route handlers should never repeat try/catch status code formatting. Centralized Express error middleware (err, req, res, next) intercepts all forwarded errors, converts P2002 to HTTP 409 Conflict, P2025 to HTTP 404 Not Found, and ZodError to HTTP 400 Bad Request.',
          targetHero: {
            language: 'typescript',
            badge: 'Production Error Middleware',
            explanation: 'Central error middleware mapping Prisma codes to HTTP status.',
            code: `import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';

export function prismaErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') return res.status(409).json({ error: 'Conflict: Record already exists' });
    if (err.code === 'P2025') return res.status(404).json({ error: 'Not Found: Target record does not exist' });
  }
  return res.status(500).json({ error: 'Internal Server Error' });
}`
          },
          explanation: [
            '409 Conflict: Maps from P2002 unique constraint violations.',
            '404 Not Found: Maps from P2025 missing records.',
            '400 Bad Request: Maps from Zod payload validation errors.'
          ],
          keyTakeaway: 'Centralized error middleware guarantees uniform API error contracts across all endpoints.',
          mcqs: [
            {
              id: 'mcq-13-2',
              question: 'Which HTTP status code corresponds most accurately to a Prisma P2002 unique constraint violation?',
              options: [
                '200 OK',
                '400 Bad Request',
                '409 Conflict',
                '502 Bad Gateway'
              ],
              correctIndex: 2,
              explanation: 'HTTP 409 Conflict indicates the request cannot be completed due to a conflict with the current resource state (e.g. duplicate key).'
            }
          ]
        },
        tasks: [
          {
            id: 'task-13-3',
            title: 'Task 1 (Guided): Express Error Handler for P2002 and P2025',
            description: 'Write an Express error handler that converts P2002 into 409 and P2025 into 404.',
            type: 'guided',
            targetModel: 'middleware',
            activeTab: 'editor',
            instructions: [
              'If err.code === "P2002", return res.status(409).json({ error: "Resource already exists" })',
              'If err.code === "P2025", return res.status(404).json({ error: "Resource not found" })',
              'Default to res.status(500).json({ error: "Internal server error" })'
            ],
            initialCode: `export function errorHandler(err: any, req: any, res: any, next: any) {
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Resource already exists' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found' });
  }
  return res.status(500).json({ error: 'Internal server error' });
}`,
            solutionCode: `export function errorHandler(err: any, req: any, res: any, next: any) {
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Resource already exists' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found' });
  }
  return res.status(500).json({ error: 'Internal server error' });
}`,
            solutionExplanation: 'Maps Prisma errors to standard HTTP status codes.',
            hints: [
              { level: 1, text: 'Check err.code === "P2002" and err.code === "P2025".' }
            ],
            validation: {
              customValidator: () => ({ valid: true })
            },
            successMessage: 'Express error handler successfully configured!'
          },
          {
            id: 'task-13-4',
            title: 'Task 2 (Independent): Extend Middleware with Zod 400 Validation',
            description: 'Extend the middleware to handle Zod validation errors, returning HTTP 400 with issue details.',
            type: 'independent',
            targetModel: 'middleware',
            activeTab: 'editor',
            instructions: [
              'Check if err.name === "ZodError" or err instanceof ZodError',
              'Return res.status(400).json({ error: "Validation Error", issues: err.issues })'
            ],
            initialCode: `export function extendedErrorHandler(err: any, req: any, res: any, next: any) {
  if (err.name === 'ZodError' || err.issues) {
    return res.status(400).json({ error: 'Validation Error', issues: err.issues });
  }
  if (err.code === 'P2002') return res.status(409).json({ error: 'Conflict' });
  if (err.code === 'P2025') return res.status(404).json({ error: 'Not Found' });
  return res.status(500).json({ error: 'Internal Server Error' });
}`,
            solutionCode: `export function extendedErrorHandler(err: any, req: any, res: any, next: any) {
  if (err.name === 'ZodError' || err.issues) {
    return res.status(400).json({ error: 'Validation Error', issues: err.issues });
  }
  if (err.code === 'P2002') return res.status(409).json({ error: 'Conflict' });
  if (err.code === 'P2025') return res.status(404).json({ error: 'Not Found' });
  return res.status(500).json({ error: 'Internal Server Error' });
}`,
            solutionExplanation: 'Ensures invalid request payloads return 400 before hitting the database.',
            hints: [
              { level: 1, text: 'Check err.name === "ZodError" and return 400.' }
            ],
            validation: {
              customValidator: () => ({ valid: true })
            },
            successMessage: 'Extended middleware guards database and client contracts!'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-13-challenge',
      title: 'Day 13 Final Challenge: Production API Error Hardening',
      scenario: 'Implement an end-to-end safe create handler that returns HTTP 409 when a duplicate email occurs.',
      tasks: [
        {
          id: 'challenge-13-1',
          title: 'Step 1: Harden User Creation Against Duplicates',
          description: 'Catch duplicate user creation and return status 409.',
          type: 'challenge',
          targetModel: 'user',
          activeTab: 'editor',
          instructions: [
            'Try to create user',
            'If error is P2002, return { statusCode: 409, message: "Duplicate email" }'
          ],
          initialCode: `export async function hardenedCreateUser(email: string, name: string) {
  try {
    return await prisma.user.create({ data: { email, name } });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { statusCode: 409, message: 'Duplicate email' };
    }
    throw error;
  }
}`,
          solutionCode: `export async function hardenedCreateUser(email: string, name: string) {
  try {
    return await prisma.user.create({ data: { email, name } });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { statusCode: 409, message: 'Duplicate email' };
    }
    throw error;
  }
}`,
          solutionExplanation: 'Shields API consumers with 409 status on duplicate entries.',
          hints: [{ level: 1, text: 'Catch error and check error.code === "P2002".' }],
          validation: { targetModel: 'user', requiredMethod: 'create' },
          successMessage: 'Day 13 challenge complete! Production error hardening in place.'
        }
      ]
    }
  },

  // ---------------------------------------------------------------------------
  // DAY 14: Production REST API Capstone
  // ---------------------------------------------------------------------------
  {
    id: 'day-14',
    slug: 'production-rest-api',
    day: 14,
    title: 'Production REST API Capstone',
    shortTitle: 'REST API Capstone',
    milestoneId: 'milestone-4',
    description: 'Put everything together to build an enterprise-grade REST API with Express/Next.js, Prisma, Zod, transactions, relations, and centralized error handling.',
    estimatedMinutes: 60,
    completionLearnings: [
      'Architected clean multi-tier service layers separating HTTP transport from Prisma queries',
      'Implemented full CRUD lifecycle: GET feed, POST creation with nested tags, PATCH partial updates, and DELETE with 204 status',
      'Mastered the end-to-end production database engineering workflow with Prisma v7'
    ],
    concepts: [
      {
        id: 'day-14-concept-1',
        order: 1,
        title: 'Clean Architecture Layering (Router -> Controller -> Service)',
        shortDescription: 'Decouple database logic from HTTP transport using dedicated Service classes.',
        theory: {
          summary: 'In enterprise applications, Prisma calls should live in a dedicated Service layer (e.g. PostService). Route controllers simply parse requests, pass parameters to services, and send HTTP responses. This makes code testable, reusable, and framework-agnostic.',
          targetHero: {
            language: 'typescript',
            badge: 'Clean Architecture Service Layer',
            explanation: 'PostService isolates database operations from Express/Next.js controllers.',
            code: `// Service Layer: pure database interaction
export class PostService {
  static async getFeed(cursor?: number, limit = 10) {
    return await prisma.post.findMany({
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}`
          },
          explanation: [
            'Separation of Concerns: Controllers handle req/res and status codes. Services handle Prisma queries and transactions.',
            'Maintainability: Switching from Express to Fastify or Next.js requires zero changes to your Prisma Service layer.'
          ],
          keyTakeaway: 'Encapsulate Prisma queries inside Service classes to keep controllers lean.',
          mcqs: [
            {
              id: 'mcq-14-1',
              question: 'Why should database queries be placed inside Service classes rather than directly inside route handlers?',
              options: [
                'Express crashes if you call Prisma inside routes',
                'Service classes decouple database operations from HTTP frameworks, improving testability and code reuse',
                'Service classes run queries in separate CPU threads',
                'Prisma only works inside classes'
              ],
              correctIndex: 1,
              explanation: 'Decoupling database queries from HTTP transport allows testing business logic without mocking Express request/response objects.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-14-1',
            title: 'Task 1 (Guided): Assemble PostService.getFeed',
            description: 'Implement PostService.getFeed supporting cursor pagination, author selection, and descending order.',
            type: 'guided',
            targetModel: 'post',
            activeTab: 'editor',
            instructions: [
              'Call prisma.post.findMany',
              'take: limit',
              'include: { author: { select: { id: true, name: true } } }',
              'orderBy: { createdAt: "desc" }'
            ],
            initialCode: `export class PostService {
  static async getFeed(cursor?: number, limit = 10) {
    return await prisma.post.findMany({
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}`,
            solutionCode: `export class PostService {
  static async getFeed(cursor?: number, limit = 10) {
    return await prisma.post.findMany({
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}`,
            solutionExplanation: 'Assembles production-ready feed retrieval service.',
            hints: [
              { level: 1, text: 'Use prisma.post.findMany with author select and cursor logic.' }
            ],
            validation: {
              targetModel: 'post',
              requiredMethod: 'findMany',
              requiredIncludes: ['author']
            },
            successMessage: 'PostService.getFeed successfully assembled!'
          },
          {
            id: 'task-14-2',
            title: 'Task 2 (Independent): Implement PostService.createPost with Tags',
            description: 'Create post with title, authorId, and nested tags in PostService.',
            type: 'independent',
            targetModel: 'post',
            activeTab: 'editor',
            instructions: [
              'Call prisma.post.create',
              'data: { title, authorId, tags: { create: tagNames.map(name => ({ name })) } }',
              'include: { tags: true }'
            ],
            initialCode: `export class PostService {
  static async createPost(authorId: number, title: string, tagNames: string[]) {
    return await prisma.post.create({
      data: {
        title,
        authorId,
        tags: {
          create: tagNames.map((name) => ({ name }))
        }
      },
      include: { tags: true }
    });
  }
}`,
            solutionCode: `export class PostService {
  static async createPost(authorId: number, title: string, tagNames: string[]) {
    return await prisma.post.create({
      data: {
        title,
        authorId,
        tags: {
          create: tagNames.map((name) => ({ name }))
        }
      },
      include: { tags: true }
    });
  }
}`,
            solutionExplanation: 'Creates post with nested tag records.',
            hints: [
              { level: 1, text: 'Use tags: { create: tagNames.map(...) }.' }
            ],
            validation: {
              targetModel: 'post',
              requiredMethod: 'create'
            },
            successMessage: 'PostService.createPost with nested tags implemented!'
          }
        ]
      },
      {
        id: 'day-14-concept-2',
        order: 2,
        title: 'Full CRUD Lifecycle & Relational Integrity',
        shortDescription: 'Tie together HTTP status codes (200, 201, 204, 400, 404, 409) with Prisma operations.',
        theory: {
          summary: 'A production REST API pairs HTTP semantics with Prisma methods: GET -> 200 OK (findMany/findUnique), POST -> 201 Created (create with Zod), PATCH -> 200 OK (update with atomic counters), and DELETE -> 204 No Content (delete with cascade safety).',
          targetHero: {
            language: 'typescript',
            badge: 'Atomic Controller Endpoint',
            explanation: 'PATCH endpoint that updates views using atomic database increment.',
            code: `// PATCH /api/posts/:id/view - atomic view counter increment
router.patch('/posts/:id/view', async (req, res, next) => {
  try {
    const updated = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: { views: { increment: 1 } }
    });
    res.json(updated);
  } catch (err) { next(err); }
});`
          },
          explanation: [
            '204 No Content: Proper HTTP status for successful DELETE operations.',
            'Next(err): Forwards any database exceptions directly to centralized error middleware.'
          ],
          keyTakeaway: 'Pair correct HTTP status codes with corresponding Prisma CRUD operations.',
          mcqs: [
            {
              id: 'mcq-14-2',
              question: 'Which HTTP status code should be returned after a successful DELETE operation?',
              options: [
                '200 OK or 204 No Content',
                '201 Created',
                '301 Moved Permanently',
                '500 Internal Server Error'
              ],
              correctIndex: 0,
              explanation: '204 No Content indicates successful deletion with an empty response body.'
            }
          ]
        },
        tasks: [
          {
            id: 'task-14-3',
            title: 'Task 1 (Guided): Delete Controller Handler (204 No Content)',
            description: 'Write deletePostHandler(req, res, next) deleting post and returning res.status(204).send().',
            type: 'guided',
            targetModel: 'post',
            activeTab: 'editor',
            instructions: [
              'Call prisma.post.delete where id: Number(req.params.id)',
              'Return res.status(204).send()',
              'Forward errors via next(err)'
            ],
            initialCode: `export async function deletePostHandler(req: any, res: any, next: any) {
  try {
    await prisma.post.delete({
      where: { id: Number(req.params.id) }
    });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}`,
            solutionCode: `export async function deletePostHandler(req: any, res: any, next: any) {
  try {
    await prisma.post.delete({
      where: { id: Number(req.params.id) }
    });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}`,
            solutionExplanation: 'Executes delete and returns clean 204 status.',
            hints: [
              { level: 1, text: 'Use res.status(204).send().' }
            ],
            validation: {
              targetModel: 'post',
              requiredMethod: 'delete'
            },
            successMessage: 'Delete handler returning 204 successfully completed!'
          },
          {
            id: 'task-14-4',
            title: 'Task 2 (Independent): Update Post Controller Handler',
            description: 'Implement updatePostHandler(req, res, next) updating post title and returning 200 JSON.',
            type: 'independent',
            targetModel: 'post',
            activeTab: 'editor',
            instructions: [
              'Call prisma.post.update where id: Number(req.params.id)',
              'data: req.body',
              'Return res.status(200).json(updated)'
            ],
            initialCode: `export async function updatePostHandler(req: any, res: any, next: any) {
  try {
    const updated = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}`,
            solutionCode: `export async function updatePostHandler(req: any, res: any, next: any) {
  try {
    const updated = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}`,
            solutionExplanation: 'Updates post by id and returns 200 with updated entity.',
            hints: [
              { level: 1, text: 'Use prisma.post.update and return res.status(200).json(updated).' }
            ],
            validation: {
              targetModel: 'post',
              requiredMethod: 'update'
            },
            successMessage: 'Update controller handler successfully implemented!'
          }
        ]
      }
    ],
    challenge: {
      id: 'day-14-challenge',
      title: 'Day 14 Capstone Project: Enterprise Publishing REST API',
      scenario: 'Complete the final capstone: query the publishing platform feed with author select, comments count, and views counter.',
      tasks: [
        {
          id: 'challenge-14-1',
          title: 'Capstone Step: Build Feed with Relations and Analytics',
          description: 'Fetch published posts including author (id, name) and comments.',
          type: 'challenge',
          targetModel: 'post',
          activeTab: 'editor',
          instructions: [
            'Call prisma.post.findMany',
            'where: { published: true }',
            'include: { author: { select: { id: true, name: true } }, comments: true }'
          ],
          initialCode: `export async function getCapstoneFeed() {
  return await prisma.post.findMany({
    where: { published: true },
    include: {
      author: { select: { id: true, name: true } },
      comments: true
    }
  });
}`,
          solutionCode: `export async function getCapstoneFeed() {
  return await prisma.post.findMany({
    where: { published: true },
    include: {
      author: { select: { id: true, name: true } },
      comments: true
    }
  });
}`,
          solutionExplanation: 'The capstone query: loads author relation with scalar pruning and comments list.',
          hints: [{ level: 1, text: 'Use findMany with where: { published: true } and author/comments includes.' }],
          validation: { targetModel: 'post', requiredMethod: 'findMany', requiredIncludes: ['author', 'comments'] },
          successMessage: 'CONGRATULATIONS! You have mastered Prisma ORM and production database engineering!'
        }
      ]
    }
  }
];
