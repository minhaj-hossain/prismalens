// =============================================================================
// SEED DATABASE SCHEMAS & IN-MEMORY FIXTURES
// =============================================================================

export interface DatabaseFixture {
  id: string;
  name: string;
  description: string;
  schemaPrisma: string;
  tables: Record<string, any[]>;
}

export const ECOM_SCHEMA_PRISMA = `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  USER
  ADMIN
  SELLER
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String
  role      Role      @default(USER)
  age       Int?
  status    String    @default("ACTIVE")
  createdAt DateTime  @default(now())
  profile   Profile?
  posts     Post[]
  orders    Order[]
  accounts  Account[]

  @@map("users")
}

model Profile {
  id       Int     @id @default(autoincrement())
  bio      String?
  avatar   String?
  userId   Int     @unique
  user     User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Product {
  id          Int         @id @default(autoincrement())
  sku         String      @unique
  title       String
  description String?
  price       Decimal     @db.Decimal(10, 2)
  stock       Int         @default(100)
  status      String      @default("IN_STOCK")
  categoryId  Int?
  category    Category?   @relation(fields: [categoryId], references: [id])
  items       OrderItem[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt

  @@index([status])
  @@map("products")
}

model Category {
  id       Int       @id @default(autoincrement())
  name     String    @unique
  slug     String    @unique
  products Product[]

  @@map("categories")
}

model Order {
  id         Int         @id @default(autoincrement())
  orderNumber String     @unique
  userId     Int
  user       User        @relation(fields: [userId], references: [id])
  total      Decimal     @db.Decimal(10, 2)
  status     OrderStatus @default(PENDING)
  createdAt  DateTime    @default(now())
  items      OrderItem[]

  @@map("orders")
}

model OrderItem {
  id        Int     @id @default(autoincrement())
  orderId   Int
  order     Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId Int
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int     @default(1)
  price     Decimal @db.Decimal(10, 2)

  @@map("order_items")
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String?
  published Boolean   @default(false)
  views     Int       @default(0)
  authorId  Int
  author    User      @relation(fields: [authorId], references: [id])
  tags      Tag[]
  comments  Comment[]
  createdAt DateTime  @default(now())

  @@map("posts")
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]

  @@map("tags")
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  postId    Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  authorName String
  createdAt DateTime @default(now())

  @@map("comments")
}

model Discount {
  id        Int      @id @default(autoincrement())
  code      String   @unique
  percent   Int
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())

  @@map("discounts")
}

model AuditLog {
  id        Int      @id @default(autoincrement())
  message   String
  createdAt DateTime @default(now())

  @@map("audit_logs")
}

model Student {
  id         Int    @id @default(autoincrement())
  name       String
  age        Int
  department String
  city       String

  @@map("students")
}
`;

export const INITIAL_ECOM_FIXTURES: Record<string, any[]> = {
  students: [
    { id: 1, name: 'Rahim', age: 21, department: 'CSE', city: 'Dhaka' },
    { id: 2, name: 'Karim', age: 22, department: 'EEE', city: 'Gazipur' },
    { id: 3, name: 'Ayesha', age: 20, department: 'CSE', city: 'Dhaka' },
    { id: 4, name: 'Sumaiya', age: 23, department: 'BBA', city: 'Chattogram' },
    { id: 5, name: 'Tanvir', age: 21, department: 'CSE', city: 'Rajshahi' }
  ],
  users: [
    { id: 1, email: 'alice@prisma.io', name: 'Alice Jenkins', role: 'ADMIN', age: 29, status: 'ACTIVE', createdAt: new Date('2024-01-10T08:00:00Z').toISOString() },
    { id: 2, email: 'bob@prisma.io', name: 'Bob Smith', role: 'USER', age: 34, status: 'ACTIVE', createdAt: new Date('2024-02-15T10:30:00Z').toISOString() },
    { id: 3, email: 'charlie@prisma.io', name: 'Charlie Dave', role: 'USER', age: 17, status: 'INACTIVE', createdAt: new Date('2024-03-01T14:15:00Z').toISOString() },
    { id: 4, email: 'diana@prisma.io', name: 'Diana Prince', role: 'SELLER', age: 28, status: 'ACTIVE', createdAt: new Date('2024-04-12T09:45:00Z').toISOString() },
    { id: 5, email: 'edward@prisma.io', name: 'Edward Elric', role: 'USER', age: 22, status: 'ACTIVE', createdAt: new Date('2024-05-20T16:20:00Z').toISOString() },
  ],
  profiles: [
    { id: 1, bio: 'Full-stack developer and database architect.', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', userId: 1 },
    { id: 2, bio: 'Open source contributor & Prisma enthusiast.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', userId: 2 },
    { id: 3, bio: 'TypeScript lover & performance tinkerer.', avatar: null, userId: 4 }
  ],
  products: [
    { id: 101, sku: 'TECH-WIR-001', title: 'Wireless Ergonomic Keyboard', description: 'Split ergonomic mechanical keyboard with hot-swappable switches.', price: 129.99, stock: 45, status: 'IN_STOCK', categoryId: 1 },
    { id: 102, sku: 'TECH-MOU-002', title: 'Precision Wireless Mouse', description: 'High DPI optical sensor with silent clicks.', price: 69.50, stock: 80, status: 'IN_STOCK', categoryId: 1 },
    { id: 103, sku: 'BOOK-PRISMA-003', title: 'Production Prisma & TypeScript Guide', description: 'Master relational schema modeling and query optimization.', price: 42.00, stock: 120, status: 'IN_STOCK', categoryId: 2 },
    { id: 104, sku: 'APPR-HOOD-004', title: 'Developer Heavyweight Hoodie', description: 'Cozy organic cotton hoodie with embroidered terminal prompt.', price: 85.00, stock: 12, status: 'IN_STOCK', categoryId: 3 },
    { id: 105, sku: 'TECH-HUB-005', title: 'Thunderbolt 4 Docking Station', description: 'Triple 4K display output and 100W power delivery.', price: 219.00, stock: 0, status: 'OUT_OF_STOCK', categoryId: 1 },
  ],
  categories: [
    { id: 1, name: 'Electronics', slug: 'electronics' },
    { id: 2, name: 'Books', slug: 'books' },
    { id: 3, name: 'Clothing', slug: 'clothing' }
  ],
  orders: [
    { id: 501, orderNumber: 'ORD-2024-001', userId: 1, total: 171.99, status: 'DELIVERED', createdAt: new Date('2024-05-01T10:00:00Z').toISOString() },
    { id: 502, orderNumber: 'ORD-2024-002', userId: 2, total: 42.00, status: 'PROCESSING', createdAt: new Date('2024-05-05T12:30:00Z').toISOString() },
    { id: 503, orderNumber: 'ORD-2024-003', userId: 1, total: 219.00, status: 'PENDING', createdAt: new Date('2024-05-10T14:45:00Z').toISOString() },
  ],
  order_items: [
    { id: 1, orderId: 501, productId: 101, quantity: 1, price: 129.99 },
    { id: 2, orderId: 501, productId: 103, quantity: 1, price: 42.00 },
    { id: 3, orderId: 502, productId: 103, quantity: 1, price: 42.00 },
    { id: 4, orderId: 503, productId: 105, quantity: 1, price: 219.00 }
  ],
  posts: [
    { id: 1, title: 'Prisma v7 Deep Dive: What is New?', content: 'Exploring typed SQL, engine optimizations, and improved relation ergonomics.', published: true, views: 1420, authorId: 1, createdAt: new Date('2024-04-01T09:00:00Z').toISOString() },
    { id: 2, title: 'Preventing N+1 Queries with Include and Batching', content: 'How to inspect generated SQL and avoid catastrophic database overhead.', published: true, views: 890, authorId: 1, createdAt: new Date('2024-04-10T11:00:00Z').toISOString() },
    { id: 3, title: 'Building Resilient Express Error Middleware', content: 'Map PrismaClientKnownRequestError codes (P2002, P2025) cleanly to HTTP status.', published: true, views: 560, authorId: 2, createdAt: new Date('2024-04-20T15:00:00Z').toISOString() },
    { id: 4, title: 'Draft: Advanced PostgreSQL Constraints', content: 'Using @@unique, @@index, and native database decimal precision.', published: false, views: 12, authorId: 1, createdAt: new Date('2024-05-02T13:00:00Z').toISOString() }
  ],
  tags: [
    { id: 1, name: 'typescript' },
    { id: 2, name: 'prisma' },
    { id: 3, name: 'database' },
    { id: 4, name: 'performance' }
  ],
  comments: [
    { id: 1, content: 'Outstanding walkthrough! The SQL Lens made this click.', postId: 1, authorName: 'Sarah K.', createdAt: new Date('2024-04-02T10:00:00Z').toISOString() },
    { id: 2, content: 'Saved our team hours of debugging connection pool exhaustion.', postId: 2, authorName: 'Liam Chen', createdAt: new Date('2024-04-11T16:20:00Z').toISOString() }
  ],
  discounts: [
    { id: 1, code: 'WELCOME10', percent: 10, isActive: true, createdAt: new Date('2024-01-01T00:00:00Z').toISOString() },
    { id: 2, code: 'FLASH30', percent: 30, isActive: true, createdAt: new Date('2024-05-01T00:00:00Z').toISOString() },
    { id: 3, code: 'EXPIRED20', percent: 20, isActive: false, createdAt: new Date('2023-12-01T00:00:00Z').toISOString() }
  ],
  audit_logs: [
    { id: 1, message: 'Initial database seed completed successfully.', createdAt: new Date('2024-01-01T00:00:00Z').toISOString() }
  ]
};

export const ALL_DATABASES: DatabaseFixture[] = [
  {
    id: 'ecom_db',
    name: 'ecom_db (PostgreSQL)',
    description: 'E-commerce platform with Users, Profiles, Products, Orders, Categories, Posts, and Audit Logs.',
    schemaPrisma: ECOM_SCHEMA_PRISMA,
    tables: INITIAL_ECOM_FIXTURES
  }
];
