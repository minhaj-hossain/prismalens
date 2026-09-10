# PrismaLens 14-Day Production Curriculum Master Report

**Generated At:** 2026-09-09T15:23:01.744Z  
**Curriculum Version:** 1.0.0 (Production Master)  
**Total Milestones:** 4  
**Total Days:** 14  
**Total Theoretical Concepts:** 29  
**Total Practice & Challenge Tasks:** 73  
**Total Estimated Learning Time:** 690 minutes (~11.5 hours)

---

## 📂 Exported Content JSON Files

All curriculum content has been exported into formatted, standalone JSON files located in two directories:

### 1. Workspace Directory: `/curriculum-json/`
- **`curriculum-full.json`**: The master dataset containing the entire curriculum (all 14 days, concepts, theory breakdowns, code challenges, test rules, hints, and solutions).
- **`curriculum-summary.json`**: An indexed overview of the entire curriculum with days, concepts, task counts, and validation contracts.
- **`milestones.json`**: The 4 foundational milestone definitions.
- **`day-01.json` through `day-14.json`**: 14 modular daily JSON files containing full theory, tasks, and final challenges for that day.

### 2. Web / Public Directory: `/public/curriculum/`
- Identical JSON files served statically at `/curriculum/curriculum-full.json`, `/curriculum/day-01.json`, etc., for API or in-browser consumption.

---

## 🗺️ Milestone Architectural Roadmap

| Milestone | Title & Subtitle | Days Range | Focus & Scope |
|-----------|------------------|------------|---------------|
| **Milestone 1** | **Foundations & Schema Modeling**<br>*From Raw SQL to Relational Schemas* | `Days 1 – 4` | Master the database problems ORMs solve, Prisma v7 setup, declarative schema design, native types, constraints, and all relational patterns (1:1, 1:N, M:N). |
| **Milestone 2** | **Migrations, Operations & Controlled Reads**<br>*Database Evolution & Optimized Querying* | `Days 5 – 8` | Safely evolve schemas with migrations and seeders, manage connection pools and client singletons, and build precise read queries with select, include, filters, and pagination. |
| **Milestone 3** | **Mutations, Data Integrity & Transactions**<br>*ACID Guarantees & Safe Writes* | `Days 9 – 12` | Safely accept user input with Zod, execute atomic updates and idempotent upserts, configure referential cascade actions, and master nested writes with ACID transactions. |
| **Milestone 4** | **Production REST APIs & Resilience**<br>*Enterprise Architecture & Hardening* | `Days 13 – 14` | Intercept Prisma error codes without leaking database internals, build robust Express error middleware, and architect a complete production-grade publishing REST API. |

---

## 📊 Curriculum High-Level Inventory

| Day | Module Title | Est. Mins | Concepts | Tasks (Practice + Challenge) | Key Focus Area |
|:---:|:---|:---:|:---:|:---:|:---|
| Day 01 | **Why Prisma?** | 45m | 2 | 5 + 1 = **6** | `why-prisma` |
| Day 02 | **Setup & CLI Tooling** | 45m | 2 | 4 + 1 = **5** | `prisma-setup-v7` |
| Day 03 | **Models & Constraints** | 50m | 2 | 4 + 1 = **5** | `models-fields-enums` |
| Day 04 | **Relations Modeling** | 55m | 3 | 6 + 1 = **7** | `relations-modeling` |
| Day 05 | **Migrations & Seeding** | 45m | 2 | 4 + 1 = **5** | `migrations-and-seeding` |
| Day 06 | **Client Lifecycle** | 40m | 2 | 4 + 1 = **5** | `client-lifecycle-connections` |
| Day 07 | **Reading Data** | 50m | 2 | 4 + 1 = **5** | `reading-data-select-include` |
| Day 08 | **Filtering & Pagination** | 55m | 2 | 4 + 1 = **5** | `filtering-sorting-pagination` |
| Day 09 | **Create & Zod Validation** | 50m | 2 | 4 + 1 = **5** | `create-and-zod-validation` |
| Day 10 | **Updates & Upserts** | 45m | 2 | 4 + 1 = **5** | `updates-and-upserts` |
| Day 11 | **Deletes & Cascade Actions** | 45m | 2 | 4 + 1 = **5** | `delete-referential-actions` |
| Day 12 | **Nested Writes & Transactions** | 55m | 2 | 4 + 1 = **5** | `nested-writes-transactions` |
| Day 13 | **Errors & Middleware** | 50m | 2 | 4 + 1 = **5** | `errors-and-middleware` |
| Day 14 | **REST API Capstone** | 60m | 2 | 4 + 1 = **5** | `production-rest-api` |

---

## 📚 Complete Day-by-Day Syllabus

### 📅 Day 01: Day 1 — Why Prisma?

- **ID / Slug:** `day-01` (`why-prisma`)
- **Milestone:** Milestone 1: Foundations & Schema Modeling
- **Estimated Duration:** 45 minutes
- **Module Overview:** See how Prisma makes database work easier to write, understand, and maintain in a TypeScript application.

**Key Learning Takeaways:**
- ✅ Understand why database data and TypeScript code do not naturally use the same types and structure
- ✅ Understand how schema.prisma, Prisma Client, and Prisma Migrate fit together
- ✅ Write a simple Prisma Client query and understand what it does in the database

#### 🧠 Concepts (2)

##### Concept 1: Why Databases and TypeScript Disagree (and How Prisma Fixes It) (`day-01-concept-1`)
> **Overview:** Why SQL strings are invisible to TypeScript and how Prisma gives your backend a generated, strongly typed database API.

- **Theory Core:** When you query a database using SQL drivers in Node.js, SQL is treated as a plain string: db.query('SELECT id, name, email FROM users WHERE id = $1', [userId]).

TypeScript cannot inspect or type-check the contents of an arbitrary SQL string. It sees a function call returning an untyped driver result. If a database column is renamed or removed, TypeScript cannot warn you—the mismatch is only discovered when that query runs.

Prisma solves this by generating strongly typed client methods directly from your schema.prisma file. Prisma Client uses generated types based on your schema, allowing TypeScript to catch invalid model names, misspelled fields, and incorrect argument types while you type your code. Prisma does not replace SQL; SQL remains the language executed by the database, while Prisma provides a type-checked API to work with it.
- **Key Takeaway:** *Prisma gives your TypeScript backend a generated, strongly typed API for working with your database, while SQL remains the underlying language of the database.*
- **Common Pitfalls:**
  - ⚠️ Assuming Prisma replaces SQL knowledge: Prisma generates SQL queries under the hood, and understanding database concepts remains essential.
  - ⚠️ Using "as any" to bypass TypeScript errors instead of fixing invalid field names against the schema.
- **Quick Check MCQ:** *"Why can Prisma catch a typo like "where: { user_mail: email }" before the code runs?"*
  - *Correct Answer:* Option 2: "Prisma Client has generated types based on the Prisma schema"
  - *Explanation:* Prisma generates TypeScript type definitions from your schema.prisma models, allowing TypeScript to flag any property that does not exist on the model.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Read and Shape a Prisma Query (`task-1-1`)
- **Type:** `guided` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Inspect a Prisma query that requests specific fields with select, and complete the query to return only id and name.
- **Instructions & Directives:**
  - [ ] Call prisma.user.findUnique
  - [ ] Set where: { id: userId }
  - [ ] Use select: { id: true, name: true } to return only id and name
- **Prisma Validation Rule:**
  - Method: `findUnique`
  - Required Select Fields: `id, name`
  - Required Where Filters: `id`
- **Initial Starter Code:**
```typescript
// In Prisma, your query determines the shape of the returned value.
// Complete the query to fetch user by id with only 'id' and 'name':
export async function getUserNameOnly(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    // TODO: Use select to return only id and name
  });
}
```
- **Solution Code:**
```typescript
export async function getUserNameOnly(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true }
  });
}
```
- **Success Message:** *"Well done! Notice how select directly controls both the SQL columns queried and the inferred TypeScript shape."*

###### 📝 Task 1.2: Task 2 (Guided): Write a findUnique Query by Unique Email (`task-1-2`)
- **Type:** `guided` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Write a type-safe findUnique query looking up a user by their unique email address, selecting id, name, and email.
- **Instructions & Directives:**
  - [ ] Call prisma.user.findUnique
  - [ ] Pass where: { email } to filter by unique email
  - [ ] Use select to return id, name, and email
- **Prisma Validation Rule:**
  - Method: `findUnique`
  - Required Select Fields: `id, name, email`
  - Required Where Filters: `email`
- **Initial Starter Code:**
```typescript
// Write a type-safe findUnique query looking up a user by email:
export async function getUserByEmail(email: string) {
  // TODO: Call prisma.user.findUnique with where: { email } and select id, name, email
}
```
- **Solution Code:**
```typescript
export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true }
  });
}
```
- **Success Message:** *"Great work! You wrote a clean findUnique query with explicit field selection."*

###### 📝 Task 1.3: Task 3 (Independent): Fix an Invalid Field Name (Without "as any") (`task-1-3`)
- **Type:** `independent` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** A developer used "as any" to silence TypeScript on a nonexistent field user_mail. Fix the query to use the schema-defined email field without any type bypasses.
- **Instructions & Directives:**
  - [ ] Remove "as any" from the query argument
  - [ ] Replace the nonexistent field user_mail with email in the where filter
  - [ ] Select id and email in the returned record
- **Prisma Validation Rule:**
  - Method: `findUnique`
  - Required Where Filters: `email`
- **Initial Starter Code:**
```typescript
export async function getActiveMember(email: string) {
  // A developer used "as any" to silence TypeScript on a nonexistent field 'user_mail'.
  // Fix the query to use the schema-defined 'email' field without using 'as any':
  return await prisma.user.findUnique({
    where: { user_mail: email } as any,
  });
}
```
- **Solution Code:**
```typescript
export async function getActiveMember(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true }
  });
}
```
- **Success Message:** *"Awesome job! You fixed the query bug without resorting to type-silencing hacks."*

##### Concept 2: How Prisma Fits Together (Schema, Client & Migrate) (`day-01-concept-2`)
> **Overview:** How schema.prisma, generated Prisma Client, and Prisma Migrate connect your TypeScript backend to your database.

- **Theory Core:** Prisma consists of three coordinated tools that work together in your application workflow:

1. schema.prisma — The central schema definition that describes your data models, relations, and generator settings.
2. Prisma Client — The strongly typed query builder generated directly from your schema, which you import into your backend code to query the database.
3. Prisma Migrate — The CLI tool that reads changes in schema.prisma, creates versioned SQL migration files, and applies them to your database.

Editing schema.prisma does not automatically alter your live database tables. When you change a model in schema.prisma, Prisma Migrate generates and executes the SQL DDL needed to update your database, and Prisma Client generates fresh TypeScript types so your code immediately reflects the new schema.
- **Key Takeaway:** *schema.prisma defines your data models, Prisma Client gives your TypeScript code a typed query API, and Prisma Migrate manages changes to your database schema.*
- **Common Pitfalls:**
  - ⚠️ Assuming modifying schema.prisma automatically updates live database tables without running a migration.
  - ⚠️ Thinking generator client is the Prisma Client itself: the generator block simply configures how and where the client is generated.
- **Quick Check MCQ:** *"What happens when you add a new field to schema.prisma?"*
  - *Correct Answer:* Option 2: "You must run a migration to update the database, and generate Prisma Client to update TypeScript types"
  - *Explanation:* Editing schema.prisma updates your schema definition. You then use Prisma Migrate to apply SQL changes to your database and generate Prisma Client to refresh TypeScript types.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Querying with Precise Field Shape (`task-1-4`)
- **Type:** `guided` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Write a query function to retrieve only the id and email of a user for authentication verification, observing how select restricts both the returned SQL columns and the TypeScript inferred shape.
- **Instructions & Directives:**
  - [ ] Call prisma.user.findUnique with where: { id: userId }
  - [ ] Select only id: true and email: true
- **Prisma Validation Rule:**
  - Method: `findUnique`
  - Required Select Fields: `id, email`
  - Required Where Filters: `id`
- **Initial Starter Code:**
```typescript
// Fetch user auth credentials returning only 'id' and 'email':
export async function getUserAuthCredentials(userId: number) {
  // TODO: Call prisma.user.findUnique with where: { id: userId }
  // Select only 'id' and 'email'
}
```
- **Solution Code:**
```typescript
export async function getUserAuthCredentials(userId: number) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true }
  });
}
```
- **Success Message:** *"Great job! You shaped the query with select and saw how TypeScript infers only the requested fields."*

###### 📝 Task 2.2: Task 2 (Independent): Retrieve Public Profile Fields (`task-1-5`)
- **Type:** `independent` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Complete the getPublicProfile function to look up a user by their unique email and select only name and email.
- **Instructions & Directives:**
  - [ ] Call prisma.user.findUnique
  - [ ] Filter by where: { email }
  - [ ] Use select to return only name and email
- **Prisma Validation Rule:**
  - Method: `findUnique`
  - Required Select Fields: `name, email`
  - Required Where Filters: `email`
- **Initial Starter Code:**
```typescript
export async function getPublicProfile(email: string) {
  // TODO: Query user by email and return only 'name' and 'email'
}
```
- **Solution Code:**
```typescript
export async function getPublicProfile(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: { name: true, email: true }
  });
}
```
- **Success Message:** *"Well done! Inferred types cleanly match your selected fields."*

#### 🏆 Day 1 Final Challenge: Day 1 Challenge: Replace a Legacy User Lookup (`day-01-challenge`)

> **Scenario:** Your team is refactoring a legacy Express service. You need to replace an untyped raw SQL helper with a strongly typed Prisma query that retrieves a user by their unique email.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Replace Legacy User Lookup with Typed Prisma Query (`challenge-1-1`)
- **Type:** `challenge` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Rewrite the legacy getUser function to find a user by email using prisma.user.findUnique. Select only id, name, and email without using raw SQL or "as any".
- **Instructions & Directives:**
  - [ ] Use prisma.user.findUnique
  - [ ] Filter by where: { email }
  - [ ] Select only id, name, and email
  - [ ] Do not use raw SQL strings or "as any"
- **Initial Starter Code:**
```typescript
// Legacy helper previously did:
// const res = await db.query('SELECT id, name, email FROM users WHERE email = $1', [email]);
// return res.rows[0];

export async function getUser(email: string) {
  // TODO: Replace with a strongly typed prisma.user.findUnique query
  // Filter by where: { email } and select id, name, and email
}
```
- **Solution Code:**
```typescript
export async function getUser(email: string) {
  return await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true }
  });
}
```
- **Success Message:** *"Outstanding! You successfully replaced the legacy query with a strongly typed, auto-completed Prisma Client query."*


---

### 📅 Day 02: Modern Prisma v7 Setup & Configuration

- **ID / Slug:** `day-02` (`prisma-setup-v7`)
- **Milestone:** Milestone 1: Foundations & Schema Modeling
- **Estimated Duration:** 45 minutes
- **Module Overview:** Create a working Prisma + PostgreSQL project, understand Prisma CLI tooling, manage connection pooling, and use introspection (db pull).

**Key Learning Takeaways:**
- ✅ Mastered essential Prisma CLI commands: init, generate, db pull, and studio
- ✅ Configured connection pooling strings with PgBouncer query parameters
- ✅ Mapped snake_case database tables to camelCase TypeScript models with @map and @@map

#### 🧠 Concepts (2)

##### Concept 1: Prisma CLI Commands & Lifecycle (`day-02-concept-1`)
> **Overview:** Master npx prisma generate, db pull, and connection pooling configuration.

- **Theory Core:** Prisma CLI is your developer cockpit: "npx prisma generate" reads schema.prisma and compiles typed models into node_modules/@prisma/client. In production serverless setups, connection pooling parameters (pgbouncer=true) prevent database connection exhaustion.
- **Key Takeaway:** *Always run npx prisma generate in your CI/CD and deployment build steps.*
- **Quick Check MCQ:** *"When should you run "npx prisma generate"?"*
  - *Correct Answer:* Option 2: "Every time you modify schema.prisma or install dependencies"
  - *Explanation:* Generating the client recompiles the TypeScript definitions to reflect your latest schema changes.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Identify Client Generation Command (`task-2-1`)
- **Type:** `guided` | **Target Model:** `cli` | **Active Tab:** `editor`
- **Description:** Return the exact CLI command needed to regenerate the TypeScript client after a schema modification.
- **Instructions & Directives:**
  - [ ] Return the string "npx prisma generate" from getGenerateCommand()
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```typescript
// Return the exact CLI command string needed to generate client types:
export function getGenerateCommand(): string {
  return "";
}
```
- **Solution Code:**
```typescript
export function getGenerateCommand(): string {
  return "npx prisma generate";
}
```
- **Success Message:** *"Correct! npx prisma generate keeps your TypeScript types in sync."*

###### 📝 Task 1.2: Task 2 (Independent): Append Connection Pooling Parameters (`task-2-2`)
- **Type:** `independent` | **Target Model:** `url` | **Active Tab:** `editor`
- **Description:** Append required parameters (?pgbouncer=true&connection_limit=10) to a PostgreSQL URL.
- **Instructions & Directives:**
  - [ ] Parse or manipulate basePostgresUrl
  - [ ] Ensure pgbouncer=true and connection_limit=10 are set as query params
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```typescript
export function formatPooledDbUrl(basePostgresUrl: string): string {
  // Append required query parameters for connection pooling (pgbouncer=true, connection_limit=10)
  return basePostgresUrl;
}
```
- **Solution Code:**
```typescript
export function formatPooledDbUrl(basePostgresUrl: string): string {
  const url = new URL(basePostgresUrl);
  url.searchParams.set('pgbouncer', 'true');
  url.searchParams.set('connection_limit', '10');
  return url.toString();
}
```
- **Success Message:** *"Great job! Connection pooling prevents database pool exhaustion."*

##### Concept 2: Database Introspection & Field Mapping (@map, @@map) (`day-02-concept-2`)
> **Overview:** Keep TypeScript idiomatic in camelCase while retaining legacy snake_case in PostgreSQL.

- **Theory Core:** In relational databases, column names frequently use snake_case (e.g. user_accounts, created_at). In TypeScript, idiomatic code uses camelCase. Prisma bridges this with @map("column_name") on fields and @@map("table_name") on models.
- **Key Takeaway:** *Never compromise TypeScript conventions for SQL naming rules; use @map and @@map.*
- **Quick Check MCQ:** *"What is the difference between @map and @@map in Prisma?"*
  - *Correct Answer:* Option 2: "@map maps individual field/column names; @@map maps entire model/table names"
  - *Explanation:* Single @ applies to the field directly above it; double @@ applies to the entire model block.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Map Legacy Customer Table and Columns (`task-2-3`)
- **Type:** `guided` | **Target Model:** `Customer` | **Active Tab:** `schema`
- **Description:** Map model Customer to legacy table "tbl_customers" and field email to "cust_email".
- **Instructions & Directives:**
  - [ ] Add @map("cust_email") to field email
  - [ ] Add @@map("tbl_customers") to model Customer
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```prisma
model Customer {
  id    Int    @id @default(autoincrement())
  email String // Map this to "cust_email"

  // Map this model to "tbl_customers"
}
```
- **Solution Code:**
```prisma
model Customer {
  id    Int    @id @default(autoincrement())
  email String @map("cust_email")

  @@map("tbl_customers")
}
```
- **Success Message:** *"Awesome! Clean TypeScript camelCase mapped to legacy database snake_case."*

###### 📝 Task 2.2: Task 2 (Independent): Map Phone & Registered Date Columns (`task-2-4`)
- **Type:** `independent` | **Target Model:** `Customer` | **Active Tab:** `schema`
- **Description:** Add snake_case mappings for phoneNumber -> phone_number and registeredAt -> registered_at.
- **Instructions & Directives:**
  - [ ] Map phoneNumber to "phone_number"
  - [ ] Map registeredAt to "registered_at"
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```prisma
model Customer {
  id           Int      @id @default(autoincrement())
  phoneNumber  String
  registeredAt DateTime

  @@map("tbl_customers")
}
```
- **Solution Code:**
```prisma
model Customer {
  id           Int      @id @default(autoincrement())
  phoneNumber  String   @map("phone_number")
  registeredAt DateTime @map("registered_at")

  @@map("tbl_customers")
}
```
- **Success Message:** *"Well done! All fields mapped successfully."*

#### 🏆 Day 2 Final Challenge: Day 2 Final Challenge: Legacy DB Migration Setup (`day-02-challenge`)

> **Scenario:** Take an introspected database schema with raw table names (auth_users, sys_logs), rename models into PascalCase TypeScript entities, and apply mappings.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Step 1: Map Auth User Model (`challenge-2-1`)
- **Type:** `challenge` | **Target Model:** `AuthUser` | **Active Tab:** `schema`
- **Description:** Map model AuthUser to "auth_users" and field passwordHash to "password_hash".
- **Instructions & Directives:**
  - [ ] Define model AuthUser with id Int @id
  - [ ] Map passwordHash String to "password_hash"
  - [ ] Map model to "auth_users"
- **Initial Starter Code:**
```prisma
model AuthUser {
  id           Int    @id @default(autoincrement())
  passwordHash String

  // Add @@map
}
```
- **Solution Code:**
```prisma
model AuthUser {
  id           Int    @id @default(autoincrement())
  passwordHash String @map("password_hash")

  @@map("auth_users")
}
```
- **Success Message:** *"AuthUser mapped successfully!"*


---

### 📅 Day 03: Models, Fields, Enums & Constraints

- **ID / Slug:** `day-03` (`models-fields-enums`)
- **Milestone:** Milestone 1: Foundations & Schema Modeling
- **Estimated Duration:** 50 minutes
- **Module Overview:** Design proper database schemas with primary keys, optional fields, native database types, enums, composite unique constraints, and indexes.

**Key Learning Takeaways:**
- ✅ Configured scalar types, optional fields (?), and automated timestamps (@updatedAt)
- ✅ Defined type-safe database enums with default values
- ✅ Created composite primary keys (@@id) and composite unique constraints (@@unique)

#### 🧠 Concepts (2)

##### Concept 1: Scalar Types, Optionality & Primary Keys (`day-03-concept-1`)
> **Overview:** Master String, Int, Decimal, Boolean, DateTime, @id, cuid(), and @updatedAt.

- **Theory Core:** Prisma scalar fields map to SQL columns. Fields are non-nullable by default unless marked with ?. Primary keys are designated with @id (autoincrement, cuid, or uuid). @updatedAt automatically writes timestamps upon every update.
- **Key Takeaway:** *Always use Decimal for money and currency calculations; never use Float.*
- **Quick Check MCQ:** *"Which type should you always choose for prices and monetary amounts in Prisma?"*
  - *Correct Answer:* Option 2: "Decimal"
  - *Explanation:* Decimal prevents floating-point inaccuracies and maps to SQL DECIMAL(precision, scale).

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Create Product Model with Precision Types (`task-3-1`)
- **Type:** `guided` | **Target Model:** `Product` | **Active Tab:** `schema`
- **Description:** Create a Product model with cuid() id, required title, optional description, Decimal price, and timestamps.
- **Instructions & Directives:**
  - [ ] Model Product with id String @id @default(cuid())
  - [ ] title String
  - [ ] description String?
  - [ ] price Decimal
  - [ ] createdAt DateTime @default(now())
  - [ ] updatedAt DateTime @updatedAt
- **Prisma Validation Rule:**
  - Method: `any`
  - Required Select Fields: `id, title, price, createdAt, updatedAt`
- **Initial Starter Code:**
```prisma
// Define the Product model here:

```
- **Solution Code:**
```prisma
model Product {
  id          String   @id @default(cuid())
  title       String
  description String?
  price       Decimal
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```
- **Success Message:** *"Great job! Model Product matches production standards."*

###### 📝 Task 1.2: Task 2 (Independent): Create Article Model with Unique Slug (`task-3-2`)
- **Type:** `independent` | **Target Model:** `Article` | **Active Tab:** `schema`
- **Description:** Define an Article model with autoincrement ID, unique slug, title, isPublished default false, and createdAt.
- **Instructions & Directives:**
  - [ ] id Int @id @default(autoincrement())
  - [ ] slug String @unique
  - [ ] title String
  - [ ] isPublished Boolean @default(false)
  - [ ] createdAt DateTime @default(now())
- **Prisma Validation Rule:**
  - Method: `any`
  - Required Select Fields: `id, slug, title, isPublished, createdAt`
- **Initial Starter Code:**
```prisma
// Define the Article model:

```
- **Solution Code:**
```prisma
model Article {
  id          Int      @id @default(autoincrement())
  slug        String   @unique
  title       String
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```
- **Success Message:** *"Well done! Model Article defined with unique constraint."*

##### Concept 2: Enums & Multi-Field Constraints (@@unique, @@index) (`day-03-concept-2`)
> **Overview:** Enforce valid domain states with Enums and composite multi-column uniqueness with @@unique.

- **Theory Core:** Enums restrict column values to a predefined list in the database. Multi-column composite constraints (@@unique([userId, orgId])) guarantee that combinations of columns remain unique together.
- **Key Takeaway:** *Use composite constraints to prevent duplicate enrollments, favorites, or memberships.*
- **Quick Check MCQ:** *"When should you use @@unique([studentId, courseId])?"*
  - *Correct Answer:* Option 2: "When a student cannot enroll in the same course more than once"
  - *Explanation:* Composite unique ensures the combination of (studentId, courseId) is distinct.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Define OrderStatus Enum & Order Model (`task-3-3`)
- **Type:** `guided` | **Target Model:** `Order` | **Active Tab:** `schema`
- **Description:** Define enum OrderStatus with PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, and attach it to model Order.
- **Instructions & Directives:**
  - [ ] Define enum OrderStatus with the 5 statuses
  - [ ] Model Order with id Int @id, status OrderStatus @default(PENDING), and total Decimal
- **Prisma Validation Rule:**
  - Method: `any`
  - Required Select Fields: `id, status, total`
- **Initial Starter Code:**
```prisma
// Define enum OrderStatus and model Order:

```
- **Solution Code:**
```prisma
enum OrderStatus {
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
}
```
- **Success Message:** *"Great work! OrderStatus enum provides robust domain constraint."*

###### 📝 Task 2.2: Task 2 (Independent): Add Composite Unique Constraint to Enrollment (`task-3-4`)
- **Type:** `independent` | **Target Model:** `CourseEnrollment` | **Active Tab:** `schema`
- **Description:** Prevent duplicate student enrollments by adding @@unique([studentId, courseId]).
- **Instructions & Directives:**
  - [ ] Add @@unique([studentId, courseId]) inside model CourseEnrollment
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```prisma
model CourseEnrollment {
  id         Int      @id @default(autoincrement())
  studentId  String
  courseId   String
  enrolledAt DateTime @default(now())
  // Add composite unique constraint
}
```
- **Solution Code:**
```prisma
model CourseEnrollment {
  id         Int      @id @default(autoincrement())
  studentId  String
  courseId   String
  enrolledAt DateTime @default(now())

  @@unique([studentId, courseId])
}
```
- **Success Message:** *"Excellent! Duplicate enrollments are physically blocked at the database level."*

#### 🏆 Day 3 Final Challenge: Day 3 Final Challenge: Complete E-Commerce Schema Blueprint (`day-03-challenge`)

> **Scenario:** Design the full schema for DigitalGoodsStore with User (cuid, unique email, role), Product (Decimal price), and UserFavorite (composite primary key).

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Step 1: Define UserFavorite Composite Model (`challenge-3-1`)
- **Type:** `challenge` | **Target Model:** `UserFavorite` | **Active Tab:** `schema`
- **Description:** Model UserFavorite with userId String, productId String, and @@id([userId, productId]).
- **Instructions & Directives:**
  - [ ] Define model UserFavorite
  - [ ] Fields: userId String, productId String, createdAt DateTime @default(now())
  - [ ] Add @@id([userId, productId])
- **Initial Starter Code:**
```prisma
// Define UserFavorite model with composite primary key:

```
- **Solution Code:**
```prisma
model UserFavorite {
  userId    String
  productId String
  createdAt DateTime @default(now())

  @@id([userId, productId])
}
```
- **Success Message:** *"UserFavorite composite model configured!"*


---

### 📅 Day 04: Relations (1-to-1, 1-to-Many, Many-to-Many)

- **ID / Slug:** `day-04` (`relations-modeling`)
- **Milestone:** Milestone 1: Foundations & Schema Modeling
- **Estimated Duration:** 55 minutes
- **Module Overview:** Model real-world relationships in Prisma schemas, understand foreign keys, @relation attributes, and implicit vs explicit join tables.

**Key Learning Takeaways:**
- ✅ Mastered 1-to-Many relations: foreign key scalar field (authorId Int) vs relation field (author User)
- ✅ Understood 1-to-1 relations and why @unique on foreign key turns 1:N into 1:1
- ✅ Distinguished implicit M:N vs explicit M:N join tables with custom relationship attributes

#### 🧠 Concepts (3)

##### Concept 1: One-to-Many (1:N) Relations (`day-04-concept-1`)
> **Overview:** The fundamental relational pattern: parent holds array, child holds foreign key.

- **Theory Core:** In a 1:N relationship (e.g. User has many Posts), the child table (Post) holds the foreign key scalar field (authorId Int) and the virtual relation field (author User @relation(fields: [authorId], references: [id])).
- **Key Takeaway:** *In Prisma 1:N relations, the model that holds the foreign key must define @relation(fields: [...], references: [...]).*
- **Quick Check MCQ:** *"Which model holds the foreign key column in a 1-to-Many relationship between Author and Book?"*
  - *Correct Answer:* Option 2: "Book holds authorId"
  - *Explanation:* The "Many" side (Book) holds the foreign key pointing back to the "One" side (Author).

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Connect Author and Book (1:N) (`task-4-1`)
- **Type:** `guided` | **Target Model:** `Book` | **Active Tab:** `schema`
- **Description:** Add foreign key authorId and relation field author to model Book.
- **Instructions & Directives:**
  - [ ] In model Book, add authorId Int
  - [ ] Add author Author @relation(fields: [authorId], references: [id])
- **Prisma Validation Rule:**
  - Method: `any`
  - Required Select Fields: `id, title, authorId`
- **Initial Starter Code:**
```prisma
model Author {
  id    Int    @id @default(autoincrement())
  name  String
  books Book[]
}

model Book {
  id    Int    @id @default(autoincrement())
  title String
  // Add authorId and author relation
}
```
- **Solution Code:**
```prisma
model Author {
  id    Int    @id @default(autoincrement())
  name  String
  books Book[]
}

model Book {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
  author   Author @relation(fields: [authorId], references: [id])
}
```
- **Success Message:** *"Great job! 1:N relationship between Author and Book established."*

###### 📝 Task 1.2: Task 2 (Independent): Optional 1:N Relation (Company & Employee) (`task-4-2`)
- **Type:** `independent` | **Target Model:** `Employee` | **Active Tab:** `schema`
- **Description:** Model 1-to-Many relation where companyId is optional (Int?) allowing unassigned employees.
- **Instructions & Directives:**
  - [ ] In model Employee, add companyId Int?
  - [ ] Add company Company? @relation(fields: [companyId], references: [id])
- **Prisma Validation Rule:**
  - Method: `any`
  - Required Select Fields: `id, name, companyId`
- **Initial Starter Code:**
```prisma
model Company {
  id        Int        @id @default(autoincrement())
  name      String
  employees Employee[]
}

model Employee {
  id   Int    @id @default(autoincrement())
  name String
  // Define optional companyId and company relation
}
```
- **Solution Code:**
```prisma
model Company {
  id        Int        @id @default(autoincrement())
  name      String
  employees Employee[]
}

model Employee {
  id        Int      @id @default(autoincrement())
  name      String
  companyId Int?
  company   Company? @relation(fields: [companyId], references: [id])
}
```
- **Success Message:** *"Well done! Optional foreign keys correctly configured."*

##### Concept 2: One-to-One (1:1) Relations (`day-04-concept-2`)
> **Overview:** The foreign key in a 1:1 relation MUST be unique to guarantee exclusivity.

- **Theory Core:** A 1:1 relationship links one entity to at most one other entity (e.g. User and Profile). Syntactically, it is identical to 1:N, with ONE vital requirement: the foreign key MUST have @unique.
- **Key Takeaway:** *Always place @unique on the foreign key field in a 1:1 relationship.*
- **Quick Check MCQ:** *"What happens if you omit @unique on the foreign key of a 1:1 relation?"*
  - *Correct Answer:* Option 2: "Prisma schema validation throws an error because the relation is ambiguous"
  - *Explanation:* Prisma compiler throws: "A one-to-one relation must have a unique constraint on the foreign key".

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Connect Account and AccountSettings (1:1) (`task-4-3`)
- **Type:** `guided` | **Target Model:** `AccountSettings` | **Active Tab:** `schema`
- **Description:** Create a 1:1 relation between Account and AccountSettings, enforcing @unique on accountId.
- **Instructions & Directives:**
  - [ ] Add accountId Int @unique to AccountSettings
  - [ ] Add account Account @relation(fields: [accountId], references: [id])
- **Prisma Validation Rule:**
  - Method: `any`
  - Required Select Fields: `id, darkMode, accountId`
- **Initial Starter Code:**
```prisma
model Account {
  id       Int              @id @default(autoincrement())
  email    String           @unique
  settings AccountSettings?
}

model AccountSettings {
  id        Int     @id @default(autoincrement())
  darkMode  Boolean @default(false)
  // Add foreign key accountId and relation to Account
}
```
- **Solution Code:**
```prisma
model Account {
  id       Int              @id @default(autoincrement())
  email    String           @unique
  settings AccountSettings?
}

model AccountSettings {
  id        Int     @id @default(autoincrement())
  darkMode  Boolean @default(false)
  accountId Int     @unique
  account   Account @relation(fields: [accountId], references: [id])
}
```
- **Success Message:** *"Awesome! 1:1 relationship successfully modeled."*

###### 📝 Task 2.2: Task 2 (Independent): Fix 1:1 Unique Constraint Bug (`task-4-4`)
- **Type:** `independent` | **Target Model:** `License` | **Active Tab:** `schema`
- **Description:** Fix a schema error where omitting @unique caused Prisma compiler failure.
- **Instructions & Directives:**
  - [ ] Add @unique to driverId in model License
- **Prisma Validation Rule:**
  - Method: `any`
  - Required Select Fields: `id, number, driverId`
- **Initial Starter Code:**
```prisma
model Driver {
  id      Int      @id @default(autoincrement())
  license License?
}

model License {
  id       Int    @id @default(autoincrement())
  number   String @unique
  driverId Int    // BUG: Missing @unique!
  driver   Driver @relation(fields: [driverId], references: [id])
}
```
- **Solution Code:**
```prisma
model Driver {
  id      Int      @id @default(autoincrement())
  license License?
}

model License {
  id       Int    @id @default(autoincrement())
  number   String @unique
  driverId Int    @unique
  driver   Driver @relation(fields: [driverId], references: [id])
}
```
- **Success Message:** *"Great fix! Driver to License is now a valid 1:1 relation."*

##### Concept 3: Many-to-Many (M:N) Relations (Implicit vs Explicit) (`day-04-concept-3`)
> **Overview:** Choose between Prisma-managed implicit join tables and explicit models with extra metadata.

- **Theory Core:** In implicit M:N relations (Post[] and Tag[]), Prisma manages a hidden join table automatically. When the relationship needs its own data (e.g. assignedAt, role, grade), use an explicit join model with @@id([a, b]).
- **Key Takeaway:** *If the relationship has attributes of its own, use an explicit join model.*
- **Quick Check MCQ:** *"When MUST you use an explicit Many-to-Many relation instead of an implicit one?"*
  - *Correct Answer:* Option 2: "When the relationship itself needs to store additional data (e.g. assignedDate, quantity)"
  - *Explanation:* Implicit join tables cannot store extra columns. You must create an explicit join model to hold relation fields.

**Practice Tasks for Concept 3:**

###### 📝 Task 3.1: Task 1 (Guided): Define Implicit M:N Relation (Post & Category) (`task-4-5`)
- **Type:** `guided` | **Target Model:** `Post` | **Active Tab:** `schema`
- **Description:** Define an implicit M:N relation between Post and Category by placing array relation fields on both models.
- **Instructions & Directives:**
  - [ ] In model Post, add categories Category[]
  - [ ] In model Category, add posts Post[]
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```prisma
model Post {
  id Int @id @default(autoincrement())
  // Add categories relation
}

model Category {
  id Int @id @default(autoincrement())
  // Add posts relation
}
```
- **Solution Code:**
```prisma
model Post {
  id         Int        @id @default(autoincrement())
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
```
- **Success Message:** *"Implicit M:N relation defined!"*

###### 📝 Task 3.2: Task 2 (Independent): Explicit M:N Join Model with Grade (`task-4-6`)
- **Type:** `independent` | **Target Model:** `ClassEnrollment` | **Active Tab:** `schema`
- **Description:** Define an explicit M:N relation between Student and ClassRoom via join model ClassEnrollment with grade Decimal?.
- **Instructions & Directives:**
  - [ ] Define model ClassEnrollment with studentId Int, classRoomId Int, grade Decimal?
  - [ ] Add relations to Student and ClassRoom
  - [ ] Add composite primary key @@id([studentId, classRoomId])
- **Prisma Validation Rule:**
  - Method: `any`
  - Required Select Fields: `studentId, classRoomId`
- **Initial Starter Code:**
```prisma
model Student {
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

```
- **Solution Code:**
```prisma
model Student {
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
}
```
- **Success Message:** *"Masterful! Explicit M:N join model accurately crafted."*

#### 🏆 Day 4 Final Challenge: Day 4 Final Challenge: Social Network Relational Core (`day-04-challenge`)

> **Scenario:** Build the complete relational schema for a social network: User to Profile (1:1), User to Post (1:N), and Post to Comment (1:N).

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Step 1: Wire Up Post and Comment Relation (`challenge-4-1`)
- **Type:** `challenge` | **Target Model:** `Comment` | **Active Tab:** `schema`
- **Description:** Add postId Int and post relation to Comment referencing Post.id.
- **Instructions & Directives:**
  - [ ] In model Comment, add postId Int
  - [ ] Add post Post @relation(fields: [postId], references: [id])
- **Initial Starter Code:**
```prisma
model Post {
  id       Int       @id @default(autoincrement())
  comments Comment[]
}

model Comment {
  id      Int    @id @default(autoincrement())
  content String
  // Add relation to Post
}
```
- **Solution Code:**
```prisma
model Post {
  id       Int       @id @default(autoincrement())
  comments Comment[]
}

model Comment {
  id      Int    @id @default(autoincrement())
  content String
  postId  Int
  post    Post   @relation(fields: [postId], references: [id])
}
```
- **Success Message:** *"Day 4 challenge complete! Relational core wired up."*


---

### 📅 Day 05: Migrations + Seeding

- **ID / Slug:** `day-05` (`migrations-and-seeding`)
- **Milestone:** Milestone 2: Migrations, Operations & Controlled Reads
- **Estimated Duration:** 45 minutes
- **Module Overview:** Safely evolve database schemas with prisma migrate dev, understand migration SQL files, and build idempotent seeders with prisma/seed.ts.

**Key Learning Takeaways:**
- ✅ Mastered the difference between migrate dev (diff & create SQL) and migrate deploy (production CI/CD)
- ✅ Understood how to safely add non-nullable columns to populated tables using @default
- ✅ Built idempotent seeders using upsert to avoid duplicate key errors on repeated runs

#### 🧠 Concepts (2)

##### Concept 1: Prisma Migrate Workflow (migrate dev vs deploy) (`day-05-concept-1`)
> **Overview:** How Prisma compares schema against database state, writes SQL migrations, and applies them.

- **Theory Core:** In local development, "npx prisma migrate dev" calculates the diff between schema.prisma and your database, writes a timestamped SQL migration file, applies it, and runs prisma generate. In production CI/CD, "npx prisma migrate deploy" applies pending migrations without diffing.
- **Key Takeaway:** *Never use migrate dev in production; use migrate deploy.*
- **Quick Check MCQ:** *"Which migration command should be executed in your production deployment script?"*
  - *Correct Answer:* Option 2: "npx prisma migrate deploy"
  - *Explanation:* migrate deploy applies pending migrations safely without interactive prompts or altering files.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Return Production Migration Command (`task-5-1`)
- **Type:** `guided` | **Target Model:** `cli` | **Active Tab:** `editor`
- **Description:** Return the exact CLI command used to apply pending migrations in production CI/CD pipelines.
- **Instructions & Directives:**
  - [ ] Return "npx prisma migrate deploy" from getProductionMigrationCommand()
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```typescript
export function getProductionMigrationCommand(): string {
  // Return the command used in production CI/CD pipelines
  return "";
}
```
- **Solution Code:**
```typescript
export function getProductionMigrationCommand(): string {
  return "npx prisma migrate deploy";
}
```
- **Success Message:** *"Correct! Production deployments require migrate deploy."*

###### 📝 Task 1.2: Task 2 (Independent): Safely Add Required Column with @default (`task-5-2`)
- **Type:** `independent` | **Target Model:** `Order` | **Active Tab:** `schema`
- **Description:** Add a non-nullable status column to Order table that already has rows, using @default("PENDING").
- **Instructions & Directives:**
  - [ ] In model Order, add "status String @default("PENDING")"
- **Prisma Validation Rule:**
  - Method: `any`
  - Required Select Fields: `id, amount, status`
- **Initial Starter Code:**
```prisma
// Model has existing production rows. Add required field 'status' safely:
model Order {
  id     Int    @id @default(autoincrement())
  amount Decimal
  // Add status String with default "PENDING"
}
```
- **Solution Code:**
```prisma
model Order {
  id     Int    @id @default(autoincrement())
  amount Decimal
  status String @default("PENDING")
}
```
- **Success Message:** *"Great job! Adding defaults allows safe migrations on populated tables."*

##### Concept 2: Idempotent Seeding with prisma/seed.ts (`day-05-concept-2`)
> **Overview:** Write reproducible seeds using upsert to prevent unique constraint failures.

- **Theory Core:** Database seeders populate initial data (roles, super-admins, test fixtures). If a seeder uses create, running it a second time crashes with unique constraint violations. An idempotent seeder uses upsert so it can be run repeatedly without failure.
- **Key Takeaway:** *Always use upsert in seed scripts to ensure re-runnability.*
- **Quick Check MCQ:** *"Why is prisma.user.create considered bad practice inside a seed.ts script?"*
  - *Correct Answer:* Option 2: "create will crash with unique constraint errors if the seed script is run more than once"
  - *Explanation:* create will fail on duplicate unique keys (like email) if the database already contains data.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Idempotent Admin Seeder (`task-5-3`)
- **Type:** `guided` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Write an idempotent seed function using prisma.user.upsert to ensure email "admin@prisma.io" exists.
- **Instructions & Directives:**
  - [ ] Call prisma.user.upsert
  - [ ] where: { email: "admin@prisma.io" }
  - [ ] update: {}
  - [ ] create: { email: "admin@prisma.io", name: "Super Admin" }
- **Prisma Validation Rule:**
  - Method: `upsert`
  - Required Where Filters: `email`
- **Initial Starter Code:**
```typescript
export async function seedAdminUser() {
  // Use prisma.user.upsert to ensure email 'admin@prisma.io' exists
  return await prisma.user.upsert({
    // Complete the upsert query
  });
}
```
- **Solution Code:**
```typescript
export async function seedAdminUser() {
  return await prisma.user.upsert({
    where: { email: 'admin@prisma.io' },
    update: {},
    create: {
      email: 'admin@prisma.io',
      name: 'Super Admin',
    }
  });
}
```
- **Success Message:** *"Idempotent admin seed function successfully implemented!"*

###### 📝 Task 2.2: Task 2 (Independent): Bulk Idempotent Category Seeder (`task-5-4`)
- **Type:** `independent` | **Target Model:** `category` | **Active Tab:** `editor`
- **Description:** Seed 3 default categories (Electronics, Books, Clothing) using Promise.all and category.upsert.
- **Instructions & Directives:**
  - [ ] Map over defaultCategories
  - [ ] Perform prisma.category.upsert for each name
  - [ ] Return Promise.all
- **Prisma Validation Rule:**
  - Method: `upsert`
  - Required Where Filters: `name`
- **Initial Starter Code:**
```typescript
const defaultCategories = ['Electronics', 'Books', 'Clothing'];

export async function seedCategories() {
  // Return a Promise.all array of upsert operations
}
```
- **Solution Code:**
```typescript
const defaultCategories = ['Electronics', 'Books', 'Clothing'];

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
}
```
- **Success Message:** *"Great job! Default categories safely seeded."*

#### 🏆 Day 5 Final Challenge: Day 5 Final Challenge: Deterministic Seed Pipeline (`day-05-challenge`)

> **Scenario:** Create an idempotent seed function that seeds an initial discount code "WELCOME10" with 10% discount and active status.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Step 1: Upsert Welcome Discount Code (`challenge-5-1`)
- **Type:** `challenge` | **Target Model:** `discount` | **Active Tab:** `editor`
- **Description:** Use prisma.discount.upsert to ensure "WELCOME10" exists with 10 percent.
- **Instructions & Directives:**
  - [ ] Call prisma.discount.upsert
  - [ ] where: { code: "WELCOME10" }
  - [ ] update: { percent: 10, isActive: true }
  - [ ] create: { code: "WELCOME10", percent: 10, isActive: true }
- **Initial Starter Code:**
```typescript
export async function seedWelcomeDiscount() {
  return await prisma.discount.upsert({
    where: { code: 'WELCOME10' },
    update: { percent: 10, isActive: true },
    create: { code: 'WELCOME10', percent: 10, isActive: true }
  });
}
```
- **Solution Code:**
```typescript
export async function seedWelcomeDiscount() {
  return await prisma.discount.upsert({
    where: { code: 'WELCOME10' },
    update: { percent: 10, isActive: true },
    create: { code: 'WELCOME10', percent: 10, isActive: true }
  });
}
```
- **Success Message:** *"Day 5 challenge completed! Deterministic seeder active."*


---

### 📅 Day 06: PrismaClient Lifecycle & Connections

- **ID / Slug:** `day-06` (`client-lifecycle-connections`)
- **Milestone:** Milestone 2: Migrations, Operations & Controlled Reads
- **Estimated Duration:** 40 minutes
- **Module Overview:** Understand connection management, connection pooling limits, singleton patterns in Next.js/Express, query logging, and graceful shutdown.

**Key Learning Takeaways:**
- ✅ Mastered the global PrismaClient singleton pattern to avoid connection exhaustion in HMR development
- ✅ Configured query performance logging with event listeners for slow-query detection
- ✅ Implemented clean process shutdown handlers with prisma.$disconnect()

#### 🧠 Concepts (2)

##### Concept 1: The Global PrismaClient Singleton Pattern (`day-06-concept-1`)
> **Overview:** Prevent "Too many connections" errors during development hot module reload.

- **Theory Core:** Each new PrismaClient() opens a dedicated connection pool to PostgreSQL. In development frameworks with Hot Module Reloading (Next.js, Vite, Express tsx), editing code re-runs files, creating new client instances until PostgreSQL exhausts its connection limit. Attaching the client to globalThis preserves the single connection pool across reloads.
- **Key Takeaway:** *Always export a single shared prisma instance from a dedicated lib/prisma.ts file.*
- **Quick Check MCQ:** *"What error occurs if you call "new PrismaClient()" inside an API route handler?"*
  - *Correct Answer:* Option 2: "Database connection pool exhaustion ("Error: Too many clients already")"
  - *Explanation:* Every HTTP request would open new database sockets, quickly consuming the database max_connections limit.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Implement lib/prisma.ts Singleton (`task-6-1`)
- **Type:** `guided` | **Target Model:** `singleton` | **Active Tab:** `editor`
- **Description:** Complete the production-ready PrismaClient singleton pattern checking process.env.NODE_ENV.
- **Instructions & Directives:**
  - [ ] Cast globalThis to { prisma: PrismaClient | undefined }
  - [ ] Export const prisma = globalForPrisma.prisma ?? new PrismaClient()
  - [ ] If NODE_ENV !== "production", save prisma to globalForPrisma.prisma
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```typescript
// Implement the global singleton pattern below:
export function getPrismaSingleton(globalObj: any, PrismaClientClass: any, env: string) {
  const client = globalObj.prisma ?? new PrismaClientClass();
  if (env !== 'production') {
    globalObj.prisma = client;
  }
  return client;
}
```
- **Solution Code:**
```typescript
export function getPrismaSingleton(globalObj: any, PrismaClientClass: any, env: string) {
  const client = globalObj.prisma ?? new PrismaClientClass();
  if (env !== 'production') {
    globalObj.prisma = client;
  }
  return client;
}
```
- **Success Message:** *"Singleton pattern successfully configured!"*

###### 📝 Task 1.2: Task 2 (Independent): Fix Connection Exhaustion Bug (`task-6-2`)
- **Type:** `independent` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Fix an Express route that dangerously calls new PrismaClient() inside the request handler.
- **Instructions & Directives:**
  - [ ] Remove "new PrismaClient()" inside handleRequest
  - [ ] Use the passed or imported singleton prisma client
- **Prisma Validation Rule:**
  - Method: `findMany`
- **Initial Starter Code:**
```typescript
// BUG: Instantiating client inside route handler exhausts connections!
export async function handleRequest(req: any, res: any) {
  // Fix: replace with singleton prisma.user.findMany()
  const users = await prisma.user.findMany();
  return res.json(users);
}
```
- **Solution Code:**
```typescript
export async function handleRequest(req: any, res: any) {
  const users = await prisma.user.findMany();
  return res.json(users);
}
```
- **Success Message:** *"Bug eliminated! Database connection pool is now protected."*

##### Concept 2: Query Logging & Graceful Disconnect (`day-06-concept-2`)
> **Overview:** Configure query telemetry and handle SIGINT / SIGTERM signals cleanly.

- **Theory Core:** Prisma Client supports rich logging configuration (query, info, warn, error). Setting log: [{ emit: "event", level: "query" }] lets you inspect query durations. On server termination, calling await prisma.$disconnect() closes open database sockets cleanly.
- **Key Takeaway:** *Always close database pools cleanly when terminating containerized services.*
- **Quick Check MCQ:** *"Why should an application invoke "await prisma.$disconnect()" on process shutdown?"*
  - *Correct Answer:* Option 2: "To close active database sockets and prevent lingering idle connections on the database server"
  - *Explanation:* Graceful disconnection terminates open TCP sockets so the database server does not hold zombie connections.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Instantiate Logged PrismaClient (`task-6-3`)
- **Type:** `guided` | **Target Model:** `logger` | **Active Tab:** `editor`
- **Description:** Return a configuration object specifying log with emit "event" for level "query".
- **Instructions & Directives:**
  - [ ] Return an object with log: [{ emit: "event", level: "query" }]
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```typescript
export function createLoggedClient() {
  return {
    log: [{ emit: 'event', level: 'query' }]
  };
}
```
- **Solution Code:**
```typescript
export function createLoggedClient() {
  return {
    log: [{ emit: 'event', level: 'query' }]
  };
}
```
- **Success Message:** *"Query logging configuration confirmed!"*

###### 📝 Task 2.2: Task 2 (Independent): Register Graceful Disconnect (`task-6-4`)
- **Type:** `independent` | **Target Model:** `lifecycle` | **Active Tab:** `editor`
- **Description:** Create a process termination listener that calls client.$disconnect() on beforeExit.
- **Instructions & Directives:**
  - [ ] Inside setupGracefulShutdown, invoke client.$disconnect()
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```typescript
export function setupGracefulShutdown(client: any) {
  // Call client.$disconnect() when process terminates
  return client.$disconnect();
}
```
- **Solution Code:**
```typescript
export function setupGracefulShutdown(client: any) {
  return client.$disconnect();
}
```
- **Success Message:** *"Graceful shutdown configured!"*

#### 🏆 Day 6 Final Challenge: Day 6 Final Challenge: Enterprise Database Gateway (`day-06-challenge`)

> **Scenario:** Implement a database health check that executes a fast probe query using prisma.user.findFirst to confirm connectivity.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Step 1: Execute Health Probe Query (`challenge-6-1`)
- **Type:** `challenge` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Call prisma.user.findFirst to verify database responsiveness.
- **Instructions & Directives:**
  - [ ] Call prisma.user.findFirst
  - [ ] Select id only
- **Initial Starter Code:**
```typescript
export async function dbHealthCheck() {
  return await prisma.user.findFirst({
    select: { id: true }
  });
}
```
- **Solution Code:**
```typescript
export async function dbHealthCheck() {
  return await prisma.user.findFirst({
    select: { id: true }
  });
}
```
- **Success Message:** *"Day 6 challenge complete! Gateway probe verified."*


---

### 📅 Day 07: Reading Data + select vs include

- **ID / Slug:** `day-07` (`reading-data-select-include`)
- **Milestone:** Milestone 2: Migrations, Operations & Controlled Reads
- **Estimated Duration:** 50 minutes
- **Module Overview:** Build controlled queries with findMany, findUnique, findFirst, understand data pruning with select, and master relation loading with include.

**Key Learning Takeaways:**
- ✅ Mastered the distinction between findUnique (indexed/unique fields only) vs findFirst vs findMany
- ✅ Understood the Golden Rule of Prisma: Never combine select and include at the root of the same object
- ✅ Pruned sensitive columns (password hashes, internal flags) by shaping output with nested select

#### 🧠 Concepts (2)

##### Concept 1: Query Execution: findUnique, findFirst, findMany (`day-07-concept-1`)
> **Overview:** Master the fundamental read methods and their unique constraint rules.

- **Theory Core:** Prisma divides read queries by specificity: findUnique queries strictly by @id or @unique fields, returning 0 or 1 record. findFirst queries by any arbitrary condition and returns the first match. findMany returns an array of all matching rows.
- **Key Takeaway:** *Always prefer findUnique over findFirst when searching by an ID or unique key.*
- **Quick Check MCQ:** *"Why will "prisma.user.findUnique({ where: { status: "ACTIVE" } })" fail to compile in TypeScript?"*
  - *Correct Answer:* Option 2: "Because findUnique strictly requires fields that have an @id or @unique constraint in schema.prisma"
  - *Explanation:* findUnique enforces compile-time safety: only unique columns are allowed in where.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Find Product by Unique SKU (`task-7-1`)
- **Type:** `guided` | **Target Model:** `product` | **Active Tab:** `editor`
- **Description:** Use prisma.product.findUnique to find a product by its unique sku parameter.
- **Instructions & Directives:**
  - [ ] Call prisma.product.findUnique
  - [ ] Set where: { sku }
- **Prisma Validation Rule:**
  - Method: `findUnique`
  - Required Where Filters: `sku`
- **Initial Starter Code:**
```typescript
export async function getProductBySku(sku: string) {
  return await prisma.product.findUnique({
    // Complete query
  });
}
```
- **Solution Code:**
```typescript
export async function getProductBySku(sku: string) {
  return await prisma.product.findUnique({
    where: { sku }
  });
}
```
- **Success Message:** *"Great job! findUnique executed over indexed SKU."*

###### 📝 Task 1.2: Task 2 (Independent): Find Latest Active Discount Code (`task-7-2`)
- **Type:** `independent` | **Target Model:** `discount` | **Active Tab:** `editor`
- **Description:** Find the first active discount code ordered by createdAt descending.
- **Instructions & Directives:**
  - [ ] Call prisma.discount.findFirst
  - [ ] where: { isActive: true }
  - [ ] orderBy: { createdAt: "desc" }
- **Prisma Validation Rule:**
  - Method: `findFirst`
  - Required Where Filters: `isActive`
- **Initial Starter Code:**
```typescript
export async function getLatestDiscount() {
  // Return first active discount code ordered by createdAt descending
}
```
- **Solution Code:**
```typescript
export async function getLatestDiscount() {
  return await prisma.discount.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' }
  });
}
```
- **Success Message:** *"Well done! Latest discount code retrieved."*

##### Concept 2: Data Shaping (select) vs Relation Loading (include) (`day-07-concept-2`)
> **Overview:** The Golden Rule: Never combine select and include at the root of the same object.

- **Theory Core:** select picks specific scalar columns to return. include eager-loads related models. The Golden Rule: you cannot use select and include at the same root level! If you need both scalar pruning and relations, nest select inside select.
- **Key Takeaway:** *To load relations and prune fields simultaneously, use nested select.*
- **Quick Check MCQ:** *"What happens if you provide both "select" and "include" at the root level of a Prisma query?"*
  - *Correct Answer:* Option 2: "TypeScript compiler throws an error: "Please either use select or include on an object, you cannot use both""
  - *Explanation:* Prisma Client enforces strict mutual exclusivity between root select and include.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Nested Select for Author Profile & Posts (`task-7-3`)
- **Type:** `guided` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Retrieve user by id selecting id, name, and nested posts (selecting post id and title).
- **Instructions & Directives:**
  - [ ] Call prisma.user.findUnique where id: authorId
  - [ ] Use select to return id: true, name: true
  - [ ] Inside select, include posts: { select: { id: true, title: true } }
- **Prisma Validation Rule:**
  - Method: `findUnique`
  - Required Select Fields: `id, name, posts`
- **Initial Starter Code:**
```typescript
export async function getAuthorPublicProfile(authorId: number) {
  return await prisma.user.findUnique({
    where: { id: authorId },
    // Select id, name, and nested posts (id, title)
  });
}
```
- **Solution Code:**
```typescript
export async function getAuthorPublicProfile(authorId: number) {
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
}
```
- **Success Message:** *"Perfect nested select query!"*

###### 📝 Task 2.2: Task 2 (Independent): Fix Root select + include Crash (`task-7-4`)
- **Type:** `independent` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Fix a query that crashed with "Please either use select or include on an object, you cannot use both".
- **Instructions & Directives:**
  - [ ] Refactor query to use select only
  - [ ] Move posts: true inside the select block
- **Prisma Validation Rule:**
  - Method: `findUnique`
  - Required Select Fields: `id, email, posts`
- **Initial Starter Code:**
```typescript
export async function getAuthorWithPostsBuggy(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
    include: { posts: true } // ILLEGAL: Cannot combine select and include at root
  } as any);
}
```
- **Solution Code:**
```typescript
export async function getAuthorWithPostsBuggy(id: number) {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      posts: true
    }
  });
}
```
- **Success Message:** *"Crash eliminated! Clean select tree established."*

#### 🏆 Day 7 Final Challenge: Day 7 Final Challenge: High-Performance Profile & Feed Loader (`day-07-challenge`)

> **Scenario:** Build a secure author feed query: retrieve user id and name, and include only published posts (id, title, views).

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Step 1: Build Author Feed Query (`challenge-7-1`)
- **Type:** `challenge` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Query user with nested published posts.
- **Instructions & Directives:**
  - [ ] Find user by id
  - [ ] Select id, name, and posts
  - [ ] In posts select id, title, and views
- **Initial Starter Code:**
```typescript
export async function getSecureAuthorFeed(userId: number) {
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
}
```
- **Solution Code:**
```typescript
export async function getSecureAuthorFeed(userId: number) {
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
}
```
- **Success Message:** *"Day 7 challenge complete! Secure feed query constructed."*


---

### 📅 Day 08: Filtering, Sorting & Pagination

- **ID / Slug:** `day-08` (`filtering-sorting-pagination`)
- **Milestone:** Milestone 2: Migrations, Operations & Controlled Reads
- **Estimated Duration:** 55 minutes
- **Module Overview:** Build production-style list queries using complex operators, case-insensitive string search, multi-column sorting, and scalable pagination.

**Key Learning Takeaways:**
- ✅ Constructed complex boolean filter expressions using AND, OR, gte, lte, and mode: "insensitive"
- ✅ Compared Offset Pagination (take/skip) vs Cursor Pagination (take/cursor)
- ✅ Understood why cursor pagination scales to millions of rows without database degradation

#### 🧠 Concepts (2)

##### Concept 1: Advanced Filtering Operators (where, in, contains, AND, OR) (`day-08-concept-1`)
> **Overview:** Master range filters, text search, and logical operators.

- **Theory Core:** Prisma provides expressive filter operators: comparison (gte, lte, gt, lt), lists (in, notIn), text (contains, startsWith, endsWith with mode: "insensitive"), and boolean logic (AND, OR, NOT).
- **Key Takeaway:** *Always use mode: "insensitive" for user-facing search inputs.*
- **Quick Check MCQ:** *"In PostgreSQL, what SQL operator does "contains: "abc", mode: "insensitive"" generate?"*
  - *Correct Answer:* Option 2: "ILIKE "%abc%""
  - *Explanation:* Prisma generates ILIKE with wildcards for case-insensitive partial string search.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Query Active Adult Users (`task-8-1`)
- **Type:** `guided` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Find all users whose age is greater than or equal to 18 AND status is "ACTIVE".
- **Instructions & Directives:**
  - [ ] Call prisma.user.findMany
  - [ ] where: { age: { gte: 18 }, status: "ACTIVE" }
- **Prisma Validation Rule:**
  - Method: `findMany`
  - Required Where Filters: `age, status`
- **Initial Starter Code:**
```typescript
export async function getActiveAdults() {
  return await prisma.user.findMany({
    // Filter age >= 18 and status 'ACTIVE'
  });
}
```
- **Solution Code:**
```typescript
export async function getActiveAdults() {
  return await prisma.user.findMany({
    where: {
      age: { gte: 18 },
      status: 'ACTIVE'
    }
  });
}
```
- **Success Message:** *"Great job! Active adult filter query executed."*

###### 📝 Task 1.2: Task 2 (Independent): Search Articles in Title OR Content (`task-8-2`)
- **Type:** `independent` | **Target Model:** `article` | **Active Tab:** `editor`
- **Description:** Search articles where title OR content contains a keyword (case-insensitive).
- **Instructions & Directives:**
  - [ ] Use OR array inside where
  - [ ] Check title contains keyword (mode: "insensitive")
  - [ ] Check content contains keyword (mode: "insensitive")
- **Prisma Validation Rule:**
  - Method: `findMany`
  - Required Where Filters: `OR`
- **Initial Starter Code:**
```typescript
export async function searchArticles(keyword: string) {
  // Return articles matching keyword in title OR content (case-insensitive)
}
```
- **Solution Code:**
```typescript
export async function searchArticles(keyword: string) {
  return await prisma.article.findMany({
    where: {
      OR: [
        { title: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } }
      ]
    }
  });
}
```
- **Success Message:** *"Awesome! Case-insensitive OR search constructed."*

##### Concept 2: Pagination Strategies (Offset vs Cursor-Based) (`day-08-concept-2`)
> **Overview:** Compare skip/take offset pagination against cursor-based infinite scrolling.

- **Theory Core:** Offset pagination (skip, take) is simple for page numbers ("Page 3"), but slow on deep pages because the database must scan and discard thousands of rows. Cursor pagination (cursor, take, skip: 1) jumps directly to an indexed record, delivering constant-time O(1) performance.
- **Key Takeaway:** *Use cursor pagination for real-time feeds and infinite scrolls to prevent database degradation.*
- **Quick Check MCQ:** *"Why does "skip: 100000, take: 20" become slow on large database tables?"*
  - *Correct Answer:* Option 2: "The SQL database must read all 100,000 rows into memory before discarding them to return 20"
  - *Explanation:* OFFSET N requires scanning and discarding N rows. Cursor pagination eliminates this by jumping directly to the index position.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Implement Offset Pagination Helper (`task-8-3`)
- **Type:** `guided` | **Target Model:** `product` | **Active Tab:** `editor`
- **Description:** Implement getPaginatedProducts(page, pageSize) using skip and take.
- **Instructions & Directives:**
  - [ ] Calculate skip = (page - 1) * pageSize
  - [ ] Set take = pageSize
  - [ ] Order by id asc
- **Prisma Validation Rule:**
  - Method: `findMany`
- **Initial Starter Code:**
```typescript
export async function getPaginatedProducts(page: number, pageSize: number = 20) {
  return await prisma.product.findMany({
    // Calculate skip and take
  });
}
```
- **Solution Code:**
```typescript
export async function getPaginatedProducts(page: number, pageSize: number = 20) {
  return await prisma.product.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { id: 'asc' }
  });
}
```
- **Success Message:** *"Offset pagination implemented successfully!"*

###### 📝 Task 2.2: Task 2 (Independent): Implement Cursor Activity Stream (`task-8-4`)
- **Type:** `independent` | **Target Model:** `activity` | **Active Tab:** `editor`
- **Description:** Implement getActivityStream(cursorId, limit) using cursor pagination.
- **Instructions & Directives:**
  - [ ] Set take: limit
  - [ ] If cursorId is passed, add skip: 1 and cursor: { id: cursorId }
  - [ ] Order by id desc
- **Prisma Validation Rule:**
  - Method: `findMany`
- **Initial Starter Code:**
```typescript
export async function getActivityStream(cursorId?: number, limit: number = 15) {
  // If cursorId is provided, use cursor pagination; otherwise take the first page
}
```
- **Solution Code:**
```typescript
export async function getActivityStream(cursorId?: number, limit: number = 15) {
  return await prisma.activity.findMany({
    take: limit,
    ...(cursorId ? { skip: 1, cursor: { id: cursorId } } : {}),
    orderBy: { id: 'desc' }
  });
}
```
- **Success Message:** *"Great job! High-speed cursor stream created."*

#### 🏆 Day 8 Final Challenge: Day 8 Final Challenge: Production Catalog Search & Filter Engine (`day-08-challenge`)

> **Scenario:** Create a catalog search query combining price bounds (gte, lte), status check, sorting by price asc, and limiting to 5 items.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Step 1: Implement Filtered Catalog Query (`challenge-8-1`)
- **Type:** `challenge` | **Target Model:** `product` | **Active Tab:** `editor`
- **Description:** Find in-stock products between $10 and $150 ordered by price asc.
- **Instructions & Directives:**
  - [ ] Call prisma.product.findMany
  - [ ] where price >= 10, price <= 150, status == "IN_STOCK"
  - [ ] take 5, orderBy: { price: "asc" }
- **Initial Starter Code:**
```typescript
export async function filterCatalog() {
  return await prisma.product.findMany({
    where: {
      price: { gte: 10, lte: 150 },
      status: 'IN_STOCK'
    },
    take: 5,
    orderBy: { price: 'asc' }
  });
}
```
- **Solution Code:**
```typescript
export async function filterCatalog() {
  return await prisma.product.findMany({
    where: {
      price: { gte: 10, lte: 150 },
      status: 'IN_STOCK'
    },
    take: 5,
    orderBy: { price: 'asc' }
  });
}
```
- **Success Message:** *"Day 8 challenge complete! Catalog engine working."*


---

### 📅 Day 09: create() + Zod Validation

- **ID / Slug:** `day-09` (`create-and-zod-validation`)
- **Milestone:** Milestone 3: Mutations, Data Integrity & Transactions
- **Estimated Duration:** 50 minutes
- **Module Overview:** Safely accept user input, validate payloads with Zod schemas, and persist single and batch records with create() and createMany().

**Key Learning Takeaways:**
- ✅ Mastered single inserts (create) and batched high-throughput inserts (createMany with skipDuplicates: true)
- ✅ Defined runtime validation contracts with Zod schemas before data ever touches the database
- ✅ Inferred TypeScript types directly from Zod schemas with z.infer<typeof Schema>

#### 🧠 Concepts (2)

##### Concept 1: Inserting Data (create(), createMany()) (`day-09-concept-1`)
> **Overview:** Persist records safely into the database with single and batch inserts.

- **Theory Core:** prisma.model.create({ data: { ... } }) creates a single record and returns the newly inserted object with auto-generated IDs and timestamps. createMany({ data: [...], skipDuplicates: true }) inserts multiple rows in a single batch INSERT statement.
- **Key Takeaway:** *Use createMany for high-throughput imports and create when you need the returned inserted object.*
- **Quick Check MCQ:** *"Why does "prisma.model.createMany" not return the full array of created objects in standard PostgreSQL?"*
  - *Correct Answer:* Option 2: "Because createMany optimizes for batch speed, returning { count: N } rather than hydrating entire object graphs"
  - *Explanation:* createMany returns a count object { count: number } for peak performance.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Create Category Record (`task-9-1`)
- **Type:** `guided` | **Target Model:** `category` | **Active Tab:** `editor`
- **Description:** Insert a new Category record with name and slug using prisma.category.create.
- **Instructions & Directives:**
  - [ ] Call prisma.category.create
  - [ ] Pass data: { name, slug }
- **Prisma Validation Rule:**
  - Method: `create`
- **Initial Starter Code:**
```typescript
export async function createCategory(name: string, slug: string) {
  return await prisma.category.create({
    // Fill data
  });
}
```
- **Solution Code:**
```typescript
export async function createCategory(name: string, slug: string) {
  return await prisma.category.create({
    data: { name, slug }
  });
}
```
- **Success Message:** *"Category created successfully!"*

###### 📝 Task 1.2: Task 2 (Independent): Bulk Insert Tags with skipDuplicates (`task-9-2`)
- **Type:** `independent` | **Target Model:** `tag` | **Active Tab:** `editor`
- **Description:** Bulk insert an array of tags using createMany with skipDuplicates: true.
- **Instructions & Directives:**
  - [ ] Call prisma.tag.createMany
  - [ ] Set data: tags and skipDuplicates: true
- **Prisma Validation Rule:**
  - Method: `createMany`
- **Initial Starter Code:**
```typescript
export async function importTags(tags: { name: string }[]) {
  // Use createMany to insert tags without failing on duplicate names
}
```
- **Solution Code:**
```typescript
export async function importTags(tags: { name: string }[]) {
  return await prisma.tag.createMany({
    data: tags,
    skipDuplicates: true
  });
}
```
- **Success Message:** *"Bulk tags inserted with conflict protection!"*

##### Concept 2: Validating Input Payloads with Zod (`day-09-concept-2`)
> **Overview:** Never trust user input. Validate runtime payloads with Zod before writing to DB.

- **Theory Core:** ORMs guarantee database schema types, but they do NOT validate runtime user input (e.g. valid emails, password lengths, or positive quantities). Zod validates payloads at the HTTP layer, ensuring only clean data reaches Prisma.
- **Key Takeaway:** *Always parse API inputs with Zod before calling prisma.model.create.*
- **Quick Check MCQ:** *"What is the role of Zod when paired with Prisma in a web application?"*
  - *Correct Answer:* Option 2: "Zod validates incoming client request bodies at runtime before database operations occur"
  - *Explanation:* Zod guards the API boundary by rejecting malformed payloads before Prisma queries run.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Define CreateProductSchema with Zod (`task-9-3`)
- **Type:** `guided` | **Target Model:** `zod` | **Active Tab:** `editor`
- **Description:** Define CreateProductSchema requiring title (min 3 chars), positive price (number), and optional sku.
- **Instructions & Directives:**
  - [ ] title: z.string().min(3)
  - [ ] price: z.number().positive()
  - [ ] sku: z.string().optional()
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```typescript
import { z } from 'zod';

export const CreateProductSchema = z.object({
  // Define schema fields here
  title: z.string().min(3),
  price: z.number().positive(),
  sku: z.string().optional()
});
```
- **Solution Code:**
```typescript
import { z } from 'zod';

export const CreateProductSchema = z.object({
  title: z.string().min(3),
  price: z.number().positive(),
  sku: z.string().optional()
});
```
- **Success Message:** *"Product schema defined with strict constraints!"*

###### 📝 Task 2.2: Task 2 (Independent): Parse Input and Persist Product (`task-9-4`)
- **Type:** `independent` | **Target Model:** `product` | **Active Tab:** `editor`
- **Description:** Parse rawBody with CreateProductSchema and pass the validated data to prisma.product.create.
- **Instructions & Directives:**
  - [ ] const validated = CreateProductSchema.parse(rawBody)
  - [ ] return await prisma.product.create({ data: validated })
- **Prisma Validation Rule:**
  - Method: `create`
- **Initial Starter Code:**
```typescript
export async function handleCreateProduct(rawBody: unknown) {
  // 1. Validate rawBody with CreateProductSchema
  // 2. Insert into DB and return created product
}
```
- **Solution Code:**
```typescript
export async function handleCreateProduct(rawBody: unknown) {
  const CreateProductSchema = z.object({
    title: z.string().min(3),
    price: z.number().positive(),
    sku: z.string().optional()
  });
  const validatedData = CreateProductSchema.parse(rawBody);
  return await prisma.product.create({
    data: validatedData
  });
}
```
- **Success Message:** *"Safe creation handler implemented!"*

#### 🏆 Day 9 Final Challenge: Day 9 Final Challenge: Secure User Registration Pipeline (`day-09-challenge`)

> **Scenario:** Create a user registration function that validates email and name, then inserts the user record.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Step 1: Validate and Create User (`challenge-9-1`)
- **Type:** `challenge` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Insert user with email and name using prisma.user.create.
- **Instructions & Directives:**
  - [ ] Call prisma.user.create
  - [ ] data: { email, name }
- **Initial Starter Code:**
```typescript
export async function registerUser(email: string, name: string) {
  return await prisma.user.create({
    data: { email, name }
  });
}
```
- **Solution Code:**
```typescript
export async function registerUser(email: string, name: string) {
  return await prisma.user.create({
    data: { email, name }
  });
}
```
- **Success Message:** *"Day 9 challenge complete! Registration workflow verified."*


---

### 📅 Day 10: update(), updateMany() & upsert()

- **ID / Slug:** `day-10` (`updates-and-upserts`)
- **Milestone:** Milestone 3: Mutations, Data Integrity & Transactions
- **Estimated Duration:** 45 minutes
- **Module Overview:** Handle real update workflows, prevent race conditions with atomic numeric operations, apply bulk updates, and master idempotent upserts.

**Key Learning Takeaways:**
- ✅ Used atomic numeric operators (increment, decrement) to eliminate race conditions in concurrent traffic
- ✅ Applied bulk updates with updateMany across filtered sets of rows
- ✅ Mastered the upsert pattern for page views, settings, and idempotent synchronizations

#### 🧠 Concepts (2)

##### Concept 1: Updating Single Records & Atomic Numeric Operations (`day-10-concept-1`)
> **Overview:** Prevent lost updates and race conditions using atomic database increments.

- **Theory Core:** In concurrent environments (e.g. 50 users buying an item simultaneously), reading stock, calculating stock - 1 in JavaScript, and writing it back causes "lost updates". Prisma atomic operators (increment, decrement, multiply, divide) execute directly in SQL (SET stock = stock - 1), guaranteeing thread safety.
- **Key Takeaway:** *Always use { increment } / { decrement } for counters and inventory balances.*
- **Quick Check MCQ:** *"Why should you use "{ stock: { decrement: 1 } }" instead of "data: { stock: currentStock - 1 }"?"*
  - *Correct Answer:* Option 1: "To prevent race conditions where concurrent requests overwrite each other"
  - *Explanation:* Atomic operations are evaluated by the SQL engine in a single atomic step, eliminating race conditions.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Update Customer Email by ID (`task-10-1`)
- **Type:** `guided` | **Target Model:** `customer` | **Active Tab:** `editor`
- **Description:** Update customer email by their primary key id using prisma.customer.update.
- **Instructions & Directives:**
  - [ ] Call prisma.customer.update
  - [ ] where: { id }
  - [ ] data: { email: newEmail }
- **Prisma Validation Rule:**
  - Method: `update`
  - Required Where Filters: `id`
- **Initial Starter Code:**
```typescript
export async function updateCustomerEmail(id: number, newEmail: string) {
  return await prisma.customer.update({
    // Update customer email
  });
}
```
- **Solution Code:**
```typescript
export async function updateCustomerEmail(id: number, newEmail: string) {
  return await prisma.customer.update({
    where: { id },
    data: { email: newEmail }
  });
}
```
- **Success Message:** *"Customer email updated successfully!"*

###### 📝 Task 1.2: Task 2 (Independent): Atomically Decrement Product Stock (`task-10-2`)
- **Type:** `independent` | **Target Model:** `product` | **Active Tab:** `editor`
- **Description:** Atomically decrement product stock by quantity upon purchase.
- **Instructions & Directives:**
  - [ ] Call prisma.product.update
  - [ ] where: { id: productId }
  - [ ] data: { stock: { decrement: quantity } }
- **Prisma Validation Rule:**
  - Method: `update`
  - Required Where Filters: `id`
- **Initial Starter Code:**
```typescript
export async function purchaseItem(productId: number, quantity: number) {
  // Atomically decrement stock
}
```
- **Solution Code:**
```typescript
export async function purchaseItem(productId: number, quantity: number) {
  return await prisma.product.update({
    where: { id: productId },
    data: {
      stock: { decrement: quantity }
    }
  });
}
```
- **Success Message:** *"Inventory atomically decremented without race conditions!"*

##### Concept 2: Idempotent Workflows with upsert() (`day-10-concept-2`)
> **Overview:** Update if exists, insert if missing in one atomic query.

- **Theory Core:** upsert checks for the existence of a row by a unique constraint. If the row exists, it applies update: { ... }; if not, it executes create: { ... }.
- **Key Takeaway:** *Use upsert for user preferences, analytics counters, and webhook idempotency.*
- **Quick Check MCQ:** *"Which clause in "prisma.model.upsert" dictates how existing rows are located?"*
  - *Correct Answer:* Option 2: "where (must target an @id or @unique field)"
  - *Explanation:* upsert requires an indexed unique field in where to determine if update or create should be executed.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Upsert User Notification Preference (`task-10-3`)
- **Type:** `guided` | **Target Model:** `userPreference` | **Active Tab:** `editor`
- **Description:** Implement setPreference(userId, emailNotify) using prisma.userPreference.upsert.
- **Instructions & Directives:**
  - [ ] Call prisma.userPreference.upsert
  - [ ] where: { userId }
  - [ ] update: { emailNotify }
  - [ ] create: { userId, emailNotify }
- **Prisma Validation Rule:**
  - Method: `upsert`
  - Required Where Filters: `userId`
- **Initial Starter Code:**
```typescript
export async function setPreference(userId: number, emailNotify: boolean) {
  return await prisma.userPreference.upsert({
    // Complete upsert
  });
}
```
- **Solution Code:**
```typescript
export async function setPreference(userId: number, emailNotify: boolean) {
  return await prisma.userPreference.upsert({
    where: { userId },
    update: { emailNotify },
    create: { userId, emailNotify }
  });
}
```
- **Success Message:** *"User preference successfully upserted!"*

###### 📝 Task 2.2: Task 2 (Independent): Record Page View with Atomic Upsert (`task-10-4`)
- **Type:** `independent` | **Target Model:** `pageView` | **Active Tab:** `editor`
- **Description:** Upsert page view: if pagePath exists, increment views by 1; if not, create with views = 1.
- **Instructions & Directives:**
  - [ ] Call prisma.pageView.upsert
  - [ ] where: { path: pagePath }
  - [ ] update: { views: { increment: 1 } }
  - [ ] create: { path: pagePath, views: 1 }
- **Prisma Validation Rule:**
  - Method: `upsert`
  - Required Where Filters: `path`
- **Initial Starter Code:**
```typescript
export async function recordPageView(pagePath: string) {
  // Upsert: if pagePath exists, increment views by 1; if not, create with views = 1
}
```
- **Solution Code:**
```typescript
export async function recordPageView(pagePath: string) {
  return await prisma.pageView.upsert({
    where: { path: pagePath },
    update: { views: { increment: 1 } },
    create: { path: pagePath, views: 1 }
  });
}
```
- **Success Message:** *"Page view recorder successfully constructed!"*

#### 🏆 Day 10 Final Challenge: Day 10 Final Challenge: Inventory Reconciliation (`day-10-challenge`)

> **Scenario:** Implement a quantity increment on Product matching productId using atomic increment.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Step 1: Increment Product Stock (`challenge-10-1`)
- **Type:** `challenge` | **Target Model:** `product` | **Active Tab:** `editor`
- **Description:** Increment stock on Product by addedQty.
- **Instructions & Directives:**
  - [ ] Call prisma.product.update
  - [ ] where: { id: productId }
  - [ ] data: { stock: { increment: addedQty } }
- **Initial Starter Code:**
```typescript
export async function restockProduct(productId: number, addedQty: number) {
  return await prisma.product.update({
    where: { id: productId },
    data: { stock: { increment: addedQty } }
  });
}
```
- **Solution Code:**
```typescript
export async function restockProduct(productId: number, addedQty: number) {
  return await prisma.product.update({
    where: { id: productId },
    data: { stock: { increment: addedQty } }
  });
}
```
- **Success Message:** *"Day 10 challenge complete! Stock restocked atomically."*


---

### 📅 Day 11: Delete & Referential Actions

- **ID / Slug:** `day-11` (`delete-referential-actions`)
- **Milestone:** Milestone 3: Mutations, Data Integrity & Transactions
- **Estimated Duration:** 45 minutes
- **Module Overview:** Understand data integrity upon deletion, cascade deletes vs foreign key protection, referential action rules, and the soft-delete pattern.

**Key Learning Takeaways:**
- ✅ Configured referential actions: onDelete: Cascade vs SetNull vs Restrict in schema.prisma
- ✅ Understood how cascade deletes protect applications from orphaned records
- ✅ Implemented the soft-delete pattern with deletedAt timestamps for compliance and data recovery

#### 🧠 Concepts (2)

##### Concept 1: Referential Actions (onDelete: Cascade, SetNull, Restrict) (`day-11-concept-1`)
> **Overview:** Control what happens to child records when a parent entity is deleted.

- **Theory Core:** When a record is deleted, foreign keys dictate child behavior: Cascade deletes all child rows automatically. SetNull sets the child foreign key to null (requires optional foreign key). Restrict blocks parent deletion if child records exist.
- **Key Takeaway:** *Always configure explicit onDelete rules to prevent database foreign key constraint violations.*
- **Quick Check MCQ:** *"What happens when a User is deleted if their Posts have "onDelete: Restrict"?"*
  - *Correct Answer:* Option 2: "The database rejects the deletion with a foreign key constraint violation error (P2003)"
  - *Explanation:* Restrict physically blocks deletion of the parent as long as child records reference it.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Configure onDelete: Cascade on OrderItem (`task-11-1`)
- **Type:** `guided` | **Target Model:** `OrderItem` | **Active Tab:** `schema`
- **Description:** Configure onDelete: Cascade on the OrderItem -> Order relation.
- **Instructions & Directives:**
  - [ ] In model OrderItem, add onDelete: Cascade to the order relation
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```prisma
model OrderItem {
  id      Int   @id @default(autoincrement())
  orderId Int
  order   Order @relation(fields: [orderId], references: [id])
  // Add onDelete: Cascade
}
```
- **Solution Code:**
```prisma
model OrderItem {
  id      Int   @id @default(autoincrement())
  orderId Int
  order   Order @relation(fields: [orderId], references: [id], onDelete: Cascade)
}
```
- **Success Message:** *"Cascade deletion successfully configured!"*

###### 📝 Task 1.2: Task 2 (Independent): Configure onDelete: SetNull on Article Author (`task-11-2`)
- **Type:** `independent` | **Target Model:** `Article` | **Active Tab:** `schema`
- **Description:** Set onDelete: SetNull on Author relation in Article so articles remain if Author is deleted.
- **Instructions & Directives:**
  - [ ] Add onDelete: SetNull inside @relation for author in Article
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```prisma
model Article {
  id       Int     @id @default(autoincrement())
  authorId Int?
  author   Author? @relation(fields: [authorId], references: [id])
  // Configure onDelete: SetNull
}
```
- **Solution Code:**
```prisma
model Article {
  id       Int     @id @default(autoincrement())
  authorId Int?
  author   Author? @relation(fields: [authorId], references: [id], onDelete: SetNull)
}
```
- **Success Message:** *"SetNull referential action configured!"*

##### Concept 2: The Soft Deletion Pattern (`day-11-concept-2`)
> **Overview:** Protect audit trails and GDPR compliance by setting deletedAt instead of physical DELETE.

- **Theory Core:** Hard deletes permanently remove rows from the database, destroying financial, legal, and activity history. The soft-delete pattern adds deletedAt DateTime? to the schema. "Deleting" simply updates deletedAt to now(), and queries filter by where: { deletedAt: null }.
- **Key Takeaway:** *In business-critical databases, soft delete preserves data integrity and financial history.*
- **Quick Check MCQ:** *"What is the key advantage of soft deletion over hard physical deletion?"*
  - *Correct Answer:* Option 2: "Soft delete preserves audit trails, prevents broken historical foreign keys, and allows undoing mistakes"
  - *Explanation:* Preserving historical rows ensures invoices, logs, and references remain intact.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Implement Soft Delete Function (`task-11-3`)
- **Type:** `guided` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Implement softDeleteUser(id) by updating deletedAt to new Date().
- **Instructions & Directives:**
  - [ ] Call prisma.user.update
  - [ ] where: { id }
  - [ ] data: { deletedAt: new Date() }
- **Prisma Validation Rule:**
  - Method: `update`
  - Required Where Filters: `id`
- **Initial Starter Code:**
```typescript
export async function softDeleteUser(id: number) {
  // Update user setting deletedAt to new Date()
}
```
- **Solution Code:**
```typescript
export async function softDeleteUser(id: number) {
  return await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() }
  });
}
```
- **Success Message:** *"Soft delete executed successfully!"*

###### 📝 Task 2.2: Task 2 (Independent): Query Active (Non-Deleted) Accounts (`task-11-4`)
- **Type:** `independent` | **Target Model:** `account` | **Active Tab:** `editor`
- **Description:** Retrieve accounts strictly filtering where: { deletedAt: null }.
- **Instructions & Directives:**
  - [ ] Call prisma.account.findMany
  - [ ] where: { deletedAt: null }
- **Prisma Validation Rule:**
  - Method: `findMany`
  - Required Where Filters: `deletedAt`
- **Initial Starter Code:**
```typescript
export async function getActiveAccounts() {
  // Find all accounts where deletedAt is null
}
```
- **Solution Code:**
```typescript
export async function getActiveAccounts() {
  return await prisma.account.findMany({
    where: { deletedAt: null }
  });
}
```
- **Success Message:** *"Active accounts query successfully filtered!"*

#### 🏆 Day 11 Final Challenge: Day 11 Final Challenge: Cascade Purge Pipeline (`day-11-challenge`)

> **Scenario:** Delete a post and ensure all associated comments are removed via cascade delete.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Step 1: Delete Target Post (`challenge-11-1`)
- **Type:** `challenge` | **Target Model:** `post` | **Active Tab:** `editor`
- **Description:** Execute prisma.post.delete on post with id 4.
- **Instructions & Directives:**
  - [ ] Call prisma.post.delete
  - [ ] where: { id: 4 }
- **Initial Starter Code:**
```typescript
export async function deletePostCascade(id: number = 4) {
  return await prisma.post.delete({
    where: { id }
  });
}
```
- **Solution Code:**
```typescript
export async function deletePostCascade(id: number = 4) {
  return await prisma.post.delete({
    where: { id }
  });
}
```
- **Success Message:** *"Day 11 challenge complete! Post deleted."*


---

### 📅 Day 12: Nested Writes & Transactions

- **ID / Slug:** `day-12` (`nested-writes-transactions`)
- **Milestone:** Milestone 3: Mutations, Data Integrity & Transactions
- **Estimated Duration:** 55 minutes
- **Module Overview:** Perform atomic multi-step operations using nested create/connect, sequential $transaction arrays, and interactive transaction functions.

**Key Learning Takeaways:**
- ✅ Mastered nested writes: creating parents and related children in a single Prisma call with create, connect, and connectOrCreate
- ✅ Understood sequential transactions (prisma.$transaction([op1, op2])) for bulk atomic execution
- ✅ Implemented interactive transactions (prisma.$transaction(async (tx) => ...)) with rollback guarantees on failure

#### 🧠 Concepts (2)

##### Concept 1: Nested Writes (create, connect, connectOrCreate) (`day-12-concept-1`)
> **Overview:** Write parent and related child records simultaneously without manual foreign key plumbing.

- **Theory Core:** Prisma handles relational insertion in a single fluent operation. "create" makes a new child inline; "connect" links an existing record by unique key; "connectOrCreate" connects if found or creates if absent.
- **Key Takeaway:** *Use nested writes to create parents and children atomically without manual foreign key management.*
- **Quick Check MCQ:** *"What happens if a nested write fails (e.g. creating the second child record violates a constraint)?"*
  - *Correct Answer:* Option 2: "Prisma automatically rolls back the entire operation, leaving no orphaned parent"
  - *Explanation:* Nested writes are executed inside an automatic transaction, guaranteeing full rollback on failure.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Create Order with Nested Items (`task-12-1`)
- **Type:** `guided` | **Target Model:** `order` | **Active Tab:** `editor`
- **Description:** Create an Order with customerId and nested items array in a single prisma.order.create call.
- **Instructions & Directives:**
  - [ ] Call prisma.order.create
  - [ ] data: { customerId, items: { create: items } }
- **Prisma Validation Rule:**
  - Method: `create`
- **Initial Starter Code:**
```typescript
export async function createOrderWithItems(customerId: number, items: { title: string; price: number }[]) {
  return await prisma.order.create({
    // Create order with customerId and nested items
  });
}
```
- **Solution Code:**
```typescript
export async function createOrderWithItems(customerId: number, items: { title: string; price: number }[]) {
  return await prisma.order.create({
    data: {
      customerId,
      items: {
        create: items
      }
    }
  });
}
```
- **Success Message:** *"Order and nested line items created atomically!"*

###### 📝 Task 1.2: Task 2 (Independent): Create Post Connecting Existing Author and Category (`task-12-2`)
- **Type:** `independent` | **Target Model:** `post` | **Active Tab:** `editor`
- **Description:** Create a post connecting an existing author by id and connecting category by id.
- **Instructions & Directives:**
  - [ ] Call prisma.post.create
  - [ ] Connect author: { connect: { id: authorId } }
  - [ ] Connect category: { connect: { id: categoryId } }
- **Prisma Validation Rule:**
  - Method: `create`
- **Initial Starter Code:**
```typescript
export async function createConnectedPost(title: string, authorId: number, categoryId: number) {
  // Connect author and category
}
```
- **Solution Code:**
```typescript
export async function createConnectedPost(title: string, authorId: number, categoryId: number) {
  return await prisma.post.create({
    data: {
      title,
      author: { connect: { id: authorId } },
      category: { connect: { id: categoryId } }
    }
  });
}
```
- **Success Message:** *"Post connected to author and category successfully!"*

##### Concept 2: ACID Transactions (Sequential vs Interactive) (`day-12-concept-2`)
> **Overview:** Execute multi-step operations where all succeed or all roll back.

- **Theory Core:** Sequential transactions (prisma.$transaction([op1, op2])) take an array of query promises and execute them in one transaction. Interactive transactions (prisma.$transaction(async (tx) => { ... })) allow subsequent queries to read values returned by earlier operations while the transaction is held open.
- **Key Takeaway:** *Use interactive transactions when writes depend on intermediate read values.*
- **Quick Check MCQ:** *"In an interactive transaction, what client must you execute queries against?"*
  - *Correct Answer:* Option 2: "The scoped "tx" client passed into the async callback"
  - *Explanation:* You must query against the tx instance passed to the callback; querying global prisma runs outside the transaction!

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Wrap Updates in Sequential $transaction (`task-12-3`)
- **Type:** `guided` | **Target Model:** `product` | **Active Tab:** `editor`
- **Description:** Wrap a product stock decrement and audit log creation in a sequential prisma.$transaction array.
- **Instructions & Directives:**
  - [ ] Call prisma.$transaction([ ... ])
  - [ ] First item: prisma.product.update(...)
  - [ ] Second item: prisma.auditLog.create(...)
- **Prisma Validation Rule:**
  - Method: `$transaction`
- **Initial Starter Code:**
```typescript
export async function recordInventoryChange(productId: number, qty: number) {
  // Wrap both updates into prisma.$transaction([ ... ])
}
```
- **Solution Code:**
```typescript
export async function recordInventoryChange(productId: number, qty: number) {
  return await prisma.$transaction([
    prisma.product.update({ where: { id: productId }, data: { stock: { decrement: qty } } }),
    prisma.auditLog.create({ data: { message: `Decremented product ${productId} by ${qty}` } })
  ]);
}
```
- **Success Message:** *"Sequential transaction configured!"*

###### 📝 Task 2.2: Task 2 (Independent): Interactive Transaction for Seat Booking (`task-12-4`)
- **Type:** `independent` | **Target Model:** `seat` | **Active Tab:** `editor`
- **Description:** Check if seat is booked; if not, mark isBooked = true and create ticket.
- **Instructions & Directives:**
  - [ ] Use prisma.$transaction(async (tx) => { ... })
  - [ ] Find seat with tx.seat.findUniqueOrThrow
  - [ ] If seat.isBooked, throw Error("Seat already booked")
  - [ ] Update seat and create ticket with tx.ticket.create
- **Prisma Validation Rule:**
  - Method: `$transaction`
- **Initial Starter Code:**
```typescript
export async function bookSeat(seatId: number, userId: number) {
  return await prisma.$transaction(async (tx) => {
    // 1. Find seat, verify !isBooked
    // 2. Mark seat isBooked = true
    // 3. Create ticket
  });
}
```
- **Solution Code:**
```typescript
export async function bookSeat(seatId: number, userId: number) {
  return await prisma.$transaction(async (tx) => {
    const seat = await tx.seat.findUniqueOrThrow({ where: { id: seatId } });
    if (seat.isBooked) throw new Error('Seat already booked');

    await tx.seat.update({ where: { id: seatId }, data: { isBooked: true } });
    return await tx.ticket.create({ data: { seatId, userId } });
  });
}
```
- **Success Message:** *"Double-booking race condition eliminated!"*

#### 🏆 Day 12 Final Challenge: Day 12 Final Challenge: Multi-Vendor Checkout Engine (`day-12-challenge`)

> **Scenario:** Implement an atomic checkout transaction: decrements stock and creates the order in a single transaction.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Step 1: Execute Checkout Transaction (`challenge-12-1`)
- **Type:** `challenge` | **Target Model:** `order` | **Active Tab:** `editor`
- **Description:** Decrement stock on Product 101 and create Order in prisma.$transaction.
- **Instructions & Directives:**
  - [ ] Use prisma.$transaction([ ... ])
  - [ ] Decrement product 101 stock by 1
  - [ ] Create order with orderNumber and total
- **Initial Starter Code:**
```typescript
export async function checkoutTransaction() {
  return await prisma.$transaction([
    prisma.product.update({ where: { id: 101 }, data: { stock: { decrement: 1 } } }),
    prisma.order.create({ data: { orderNumber: 'ORD-999', userId: 1, total: 129.99 } })
  ]);
}
```
- **Solution Code:**
```typescript
export async function checkoutTransaction() {
  return await prisma.$transaction([
    prisma.product.update({ where: { id: 101 }, data: { stock: { decrement: 1 } } }),
    prisma.order.create({ data: { orderNumber: 'ORD-999', userId: 1, total: 129.99 } })
  ]);
}
```
- **Success Message:** *"Day 12 challenge complete! Checkout transaction secured."*


---

### 📅 Day 13: Errors + Express Error Middleware

- **ID / Slug:** `day-13` (`errors-and-middleware`)
- **Milestone:** Milestone 4: Production REST APIs & Resilience
- **Estimated Duration:** 50 minutes
- **Module Overview:** Intercept Prisma error codes (P2002, P2025), prevent leaking database internals, and build clean Express HTTP error middleware.

**Key Learning Takeaways:**
- ✅ Identified critical Prisma error codes: P2002 (unique constraint violation), P2025 (record not found), and P2003 (foreign key failure)
- ✅ Built centralized Express error middleware mapping database errors to clean HTTP 409, 404, and 400 status responses
- ✅ Hardened production APIs to prevent sensitive stack traces and SQL queries leaking to clients

#### 🧠 Concepts (2)

##### Concept 1: Prisma Error Classification & Error Codes (`day-13-concept-1`)
> **Overview:** Catch Prisma.PrismaClientKnownRequestError and inspect typed error codes.

- **Theory Core:** When a database operation violates a constraint, Prisma throws a PrismaClientKnownRequestError containing a standardized code. Key production codes include P2002 (Unique constraint failed), P2025 (Record to update/delete not found), and P2003 (Foreign key constraint violation).
- **Key Takeaway:** *Always check error.code === "P2002" rather than inspecting raw error message strings.*
- **Quick Check MCQ:** *"Which error code does Prisma throw when a unique constraint is violated (e.g. duplicate email)?"*
  - *Correct Answer:* Option 2: "P2002"
  - *Explanation:* P2002 is the standardized Prisma error code for unique constraint violations.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Intercept P2002 Duplicate Email Error (`task-13-1`)
- **Type:** `guided` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Catch PrismaClientKnownRequestError P2002 when creating a user and return { error: "Email already taken" }.
- **Instructions & Directives:**
  - [ ] Check if error.code === "P2002"
  - [ ] Return { error: "Email already taken" }
- **Prisma Validation Rule:**
  - Method: `create`
- **Initial Starter Code:**
```typescript
export async function safeCreateUser(data: { email: string; name: string }) {
  try {
    return await prisma.user.create({ data });
  } catch (error: any) {
    // Catch P2002 and return { error: "Email already taken" }
    if (error.code === 'P2002') {
      return { error: 'Email already taken' };
    }
    throw error;
  }
}
```
- **Solution Code:**
```typescript
export async function safeCreateUser(data: { email: string; name: string }) {
  try {
    return await prisma.user.create({ data });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Email already taken' };
    }
    throw error;
  }
}
```
- **Success Message:** *"P2002 error successfully intercepted!"*

###### 📝 Task 1.2: Task 2 (Independent): Catch P2025 Record Not Found on Delete (`task-13-2`)
- **Type:** `independent` | **Target Model:** `post` | **Active Tab:** `editor`
- **Description:** Catch P2025 when deleting a post by ID and return { error: "Post not found" } instead of crashing.
- **Instructions & Directives:**
  - [ ] Attempt prisma.post.delete where: { id }
  - [ ] Catch P2025 error and return { error: "Post not found" }
- **Prisma Validation Rule:**
  - Method: `delete`
- **Initial Starter Code:**
```typescript
export async function safeDeletePost(id: number) {
  // Handle P2025 record not found
  try {
    return await prisma.post.delete({ where: { id } });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return { error: 'Post not found' };
    }
    throw error;
  }
}
```
- **Solution Code:**
```typescript
export async function safeDeletePost(id: number) {
  try {
    return await prisma.post.delete({ where: { id } });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return { error: 'Post not found' };
    }
    throw error;
  }
}
```
- **Success Message:** *"P2025 missing record handled cleanly!"*

##### Concept 2: Centralized Express Error Middleware (`day-13-concept-2`)
> **Overview:** Decouple route controllers from error formatting with centralized Express middleware.

- **Theory Core:** Individual API route handlers should never repeat try/catch status code formatting. Centralized Express error middleware (err, req, res, next) intercepts all forwarded errors, converts P2002 to HTTP 409 Conflict, P2025 to HTTP 404 Not Found, and ZodError to HTTP 400 Bad Request.
- **Key Takeaway:** *Centralized error middleware guarantees uniform API error contracts across all endpoints.*
- **Quick Check MCQ:** *"Which HTTP status code corresponds most accurately to a Prisma P2002 unique constraint violation?"*
  - *Correct Answer:* Option 3: "409 Conflict"
  - *Explanation:* HTTP 409 Conflict indicates the request cannot be completed due to a conflict with the current resource state (e.g. duplicate key).

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Express Error Handler for P2002 and P2025 (`task-13-3`)
- **Type:** `guided` | **Target Model:** `middleware` | **Active Tab:** `editor`
- **Description:** Write an Express error handler that converts P2002 into 409 and P2025 into 404.
- **Instructions & Directives:**
  - [ ] If err.code === "P2002", return res.status(409).json({ error: "Resource already exists" })
  - [ ] If err.code === "P2025", return res.status(404).json({ error: "Resource not found" })
  - [ ] Default to res.status(500).json({ error: "Internal server error" })
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```typescript
export function errorHandler(err: any, req: any, res: any, next: any) {
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Resource already exists' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found' });
  }
  return res.status(500).json({ error: 'Internal server error' });
}
```
- **Solution Code:**
```typescript
export function errorHandler(err: any, req: any, res: any, next: any) {
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Resource already exists' });
  }
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Resource not found' });
  }
  return res.status(500).json({ error: 'Internal server error' });
}
```
- **Success Message:** *"Express error handler successfully configured!"*

###### 📝 Task 2.2: Task 2 (Independent): Extend Middleware with Zod 400 Validation (`task-13-4`)
- **Type:** `independent` | **Target Model:** `middleware` | **Active Tab:** `editor`
- **Description:** Extend the middleware to handle Zod validation errors, returning HTTP 400 with issue details.
- **Instructions & Directives:**
  - [ ] Check if err.name === "ZodError" or err instanceof ZodError
  - [ ] Return res.status(400).json({ error: "Validation Error", issues: err.issues })
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```typescript
export function extendedErrorHandler(err: any, req: any, res: any, next: any) {
  if (err.name === 'ZodError' || err.issues) {
    return res.status(400).json({ error: 'Validation Error', issues: err.issues });
  }
  if (err.code === 'P2002') return res.status(409).json({ error: 'Conflict' });
  if (err.code === 'P2025') return res.status(404).json({ error: 'Not Found' });
  return res.status(500).json({ error: 'Internal Server Error' });
}
```
- **Solution Code:**
```typescript
export function extendedErrorHandler(err: any, req: any, res: any, next: any) {
  if (err.name === 'ZodError' || err.issues) {
    return res.status(400).json({ error: 'Validation Error', issues: err.issues });
  }
  if (err.code === 'P2002') return res.status(409).json({ error: 'Conflict' });
  if (err.code === 'P2025') return res.status(404).json({ error: 'Not Found' });
  return res.status(500).json({ error: 'Internal Server Error' });
}
```
- **Success Message:** *"Extended middleware guards database and client contracts!"*

#### 🏆 Day 13 Final Challenge: Day 13 Final Challenge: Production API Error Hardening (`day-13-challenge`)

> **Scenario:** Implement an end-to-end safe create handler that returns HTTP 409 when a duplicate email occurs.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Step 1: Harden User Creation Against Duplicates (`challenge-13-1`)
- **Type:** `challenge` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Catch duplicate user creation and return status 409.
- **Instructions & Directives:**
  - [ ] Try to create user
  - [ ] If error is P2002, return { statusCode: 409, message: "Duplicate email" }
- **Initial Starter Code:**
```typescript
export async function hardenedCreateUser(email: string, name: string) {
  try {
    return await prisma.user.create({ data: { email, name } });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { statusCode: 409, message: 'Duplicate email' };
    }
    throw error;
  }
}
```
- **Solution Code:**
```typescript
export async function hardenedCreateUser(email: string, name: string) {
  try {
    return await prisma.user.create({ data: { email, name } });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { statusCode: 409, message: 'Duplicate email' };
    }
    throw error;
  }
}
```
- **Success Message:** *"Day 13 challenge complete! Production error hardening in place."*


---

### 📅 Day 14: Production REST API Capstone

- **ID / Slug:** `day-14` (`production-rest-api`)
- **Milestone:** Milestone 4: Production REST APIs & Resilience
- **Estimated Duration:** 60 minutes
- **Module Overview:** Put everything together to build an enterprise-grade REST API with Express/Next.js, Prisma, Zod, transactions, relations, and centralized error handling.

**Key Learning Takeaways:**
- ✅ Architected clean multi-tier service layers separating HTTP transport from Prisma queries
- ✅ Implemented full CRUD lifecycle: GET feed, POST creation with nested tags, PATCH partial updates, and DELETE with 204 status
- ✅ Mastered the end-to-end production database engineering workflow with Prisma v7

#### 🧠 Concepts (2)

##### Concept 1: Clean Architecture Layering (Router -> Controller -> Service) (`day-14-concept-1`)
> **Overview:** Decouple database logic from HTTP transport using dedicated Service classes.

- **Theory Core:** In enterprise applications, Prisma calls should live in a dedicated Service layer (e.g. PostService). Route controllers simply parse requests, pass parameters to services, and send HTTP responses. This makes code testable, reusable, and framework-agnostic.
- **Key Takeaway:** *Encapsulate Prisma queries inside Service classes to keep controllers lean.*
- **Quick Check MCQ:** *"Why should database queries be placed inside Service classes rather than directly inside route handlers?"*
  - *Correct Answer:* Option 2: "Service classes decouple database operations from HTTP frameworks, improving testability and code reuse"
  - *Explanation:* Decoupling database queries from HTTP transport allows testing business logic without mocking Express request/response objects.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Assemble PostService.getFeed (`task-14-1`)
- **Type:** `guided` | **Target Model:** `post` | **Active Tab:** `editor`
- **Description:** Implement PostService.getFeed supporting cursor pagination, author selection, and descending order.
- **Instructions & Directives:**
  - [ ] Call prisma.post.findMany
  - [ ] take: limit
  - [ ] include: { author: { select: { id: true, name: true } } }
  - [ ] orderBy: { createdAt: "desc" }
- **Prisma Validation Rule:**
  - Method: `findMany`
  - Required Includes: `author`
- **Initial Starter Code:**
```typescript
export class PostService {
  static async getFeed(cursor?: number, limit = 10) {
    return await prisma.post.findMany({
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}
```
- **Solution Code:**
```typescript
export class PostService {
  static async getFeed(cursor?: number, limit = 10) {
    return await prisma.post.findMany({
      take: limit,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}
```
- **Success Message:** *"PostService.getFeed successfully assembled!"*

###### 📝 Task 1.2: Task 2 (Independent): Implement PostService.createPost with Tags (`task-14-2`)
- **Type:** `independent` | **Target Model:** `post` | **Active Tab:** `editor`
- **Description:** Create post with title, authorId, and nested tags in PostService.
- **Instructions & Directives:**
  - [ ] Call prisma.post.create
  - [ ] data: { title, authorId, tags: { create: tagNames.map(name => ({ name })) } }
  - [ ] include: { tags: true }
- **Prisma Validation Rule:**
  - Method: `create`
- **Initial Starter Code:**
```typescript
export class PostService {
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
}
```
- **Solution Code:**
```typescript
export class PostService {
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
}
```
- **Success Message:** *"PostService.createPost with nested tags implemented!"*

##### Concept 2: Full CRUD Lifecycle & Relational Integrity (`day-14-concept-2`)
> **Overview:** Tie together HTTP status codes (200, 201, 204, 400, 404, 409) with Prisma operations.

- **Theory Core:** A production REST API pairs HTTP semantics with Prisma methods: GET -> 200 OK (findMany/findUnique), POST -> 201 Created (create with Zod), PATCH -> 200 OK (update with atomic counters), and DELETE -> 204 No Content (delete with cascade safety).
- **Key Takeaway:** *Pair correct HTTP status codes with corresponding Prisma CRUD operations.*
- **Quick Check MCQ:** *"Which HTTP status code should be returned after a successful DELETE operation?"*
  - *Correct Answer:* Option 1: "200 OK or 204 No Content"
  - *Explanation:* 204 No Content indicates successful deletion with an empty response body.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Delete Controller Handler (204 No Content) (`task-14-3`)
- **Type:** `guided` | **Target Model:** `post` | **Active Tab:** `editor`
- **Description:** Write deletePostHandler(req, res, next) deleting post and returning res.status(204).send().
- **Instructions & Directives:**
  - [ ] Call prisma.post.delete where id: Number(req.params.id)
  - [ ] Return res.status(204).send()
  - [ ] Forward errors via next(err)
- **Prisma Validation Rule:**
  - Method: `delete`
- **Initial Starter Code:**
```typescript
export async function deletePostHandler(req: any, res: any, next: any) {
  try {
    await prisma.post.delete({
      where: { id: Number(req.params.id) }
    });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
```
- **Solution Code:**
```typescript
export async function deletePostHandler(req: any, res: any, next: any) {
  try {
    await prisma.post.delete({
      where: { id: Number(req.params.id) }
    });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}
```
- **Success Message:** *"Delete handler returning 204 successfully completed!"*

###### 📝 Task 2.2: Task 2 (Independent): Update Post Controller Handler (`task-14-4`)
- **Type:** `independent` | **Target Model:** `post` | **Active Tab:** `editor`
- **Description:** Implement updatePostHandler(req, res, next) updating post title and returning 200 JSON.
- **Instructions & Directives:**
  - [ ] Call prisma.post.update where id: Number(req.params.id)
  - [ ] data: req.body
  - [ ] Return res.status(200).json(updated)
- **Prisma Validation Rule:**
  - Method: `update`
- **Initial Starter Code:**
```typescript
export async function updatePostHandler(req: any, res: any, next: any) {
  try {
    const updated = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}
```
- **Solution Code:**
```typescript
export async function updatePostHandler(req: any, res: any, next: any) {
  try {
    const updated = await prisma.post.update({
      where: { id: Number(req.params.id) },
      data: req.body
    });
    return res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
}
```
- **Success Message:** *"Update controller handler successfully implemented!"*

#### 🏆 Day 14 Final Challenge: Day 14 Capstone Project: Enterprise Publishing REST API (`day-14-challenge`)

> **Scenario:** Complete the final capstone: query the publishing platform feed with author select, comments count, and views counter.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Capstone Step: Build Feed with Relations and Analytics (`challenge-14-1`)
- **Type:** `challenge` | **Target Model:** `post` | **Active Tab:** `editor`
- **Description:** Fetch published posts including author (id, name) and comments.
- **Instructions & Directives:**
  - [ ] Call prisma.post.findMany
  - [ ] where: { published: true }
  - [ ] include: { author: { select: { id: true, name: true } }, comments: true }
- **Initial Starter Code:**
```typescript
export async function getCapstoneFeed() {
  return await prisma.post.findMany({
    where: { published: true },
    include: {
      author: { select: { id: true, name: true } },
      comments: true
    }
  });
}
```
- **Solution Code:**
```typescript
export async function getCapstoneFeed() {
  return await prisma.post.findMany({
    where: { published: true },
    include: {
      author: { select: { id: true, name: true } },
      comments: true
    }
  });
}
```
- **Success Message:** *"CONGRATULATIONS! You have mastered Prisma ORM and production database engineering!"*


---

