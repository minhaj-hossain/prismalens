# PrismaLens 14-Day Production Curriculum Master Report

**Generated At:** 2026-09-23T06:59:38.744Z  
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
| **Milestone 1** | **Foundations & Schema Modeling**<br>*From Raw SQL to Relational Schemas* | `Days 1–4` | Master the database problems ORMs solve, Prisma v7 setup, declarative schema design, native types, constraints, and all relational patterns (1:1, 1:N, M:N). |
| **Milestone 2** | **Migrations, Operations & Controlled Reads**<br>*Database Evolution & Optimized Querying* | `Days 5–8` | Safely evolve schemas with migrations and seeders, manage connection pools and client singletons, and build precise read queries with select, include, filters, and pagination. |
| **Milestone 3** | **Mutations, Data Integrity & Transactions**<br>*ACID Guarantees & Safe Writes* | `Days 9–12` | Safely accept user input with Zod, execute atomic updates and idempotent upserts, configure referential cascade actions, and master nested writes with ACID transactions. |
| **Milestone 4** | **Production REST APIs & Resilience**<br>*Enterprise Architecture & Hardening* | `Days 13–14` | Intercept Prisma error codes without leaking database internals, build robust Express error middleware, and architect a complete production-grade publishing REST API. |

---

## 📊 Curriculum High-Level Inventory

| Day | Module Title | Est. Mins | Concepts | Tasks (Practice + Challenge) | Key Focus Area |
|:---:|:---|:---:|:---:|:---:|:---|
| Day 01 | **Why Prisma?** | 45m | 3 | 7 + 1 = **8** | `why-prisma` |
| Day 02 | **Setup & Configuration** | 45m | 2 | 4 + 1 = **5** | `prisma-setup-v7` |
| Day 03 | **Models & Constraints** | 50m | 2 | 4 + 1 = **5** | `models-fields-enums` |
| Day 04 | **Relations Modeling** | 55m | 2 | 4 + 1 = **5** | `relations-modeling` |
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
- **Module Overview:** Learn why traditional raw SQL drivers leave your TypeScript code vulnerable to silent runtime bugs, and how Prisma generates a fully type-safe, auto-completing database client directly from your schema.

**Key Learning Takeaways:**
- ✅ Understand the Object-Relational Impedance Mismatch and why raw SQL strings are invisible to the TypeScript compiler
- ✅ Learn how Prisma Client dynamically infers TypeScript return types directly from your query parameters
- ✅ Use findUnique and select to fetch lean, targeted records without over-fetching database columns
- ✅ Understand the three architectural pillars: schema.prisma, Prisma Client, and Prisma Migrate

#### 🧠 Concepts (3)

##### Concept 1: The Type-Safety Gap: Why Raw SQL Fails TypeScript (`day-01-concept-1`)
> **Overview:** Why raw SQL strings leave your backend blind to typos and schema changes, and how Prisma gives your database queries real compile-time guarantees.

- **Theory Core:** When you query a database using raw database drivers (like pg or mysql2) in Node.js, your SQL query is treated as an opaque string:
db.query('SELECT id, name, email FROM users WHERE id = $1', [userId])

To the TypeScript compiler, that SQL string is a complete black box. TypeScript cannot parse SQL grammar, inspect column names, or verify that the "users" table even exists. The driver returns an untyped any or generic row object. If someone renames the database column from "email" to "user_email", TypeScript won't say a word—you only discover the catastrophic null pointer in production when an active user attempts to log in.

Prisma eliminates this entire class of bugs by reversing the relationship: your schema.prisma defines your data models, and Prisma generates a dedicated, strongly typed TypeScript client tailored to your exact database. When you write prisma.user.findUnique({ where: { id } }), TypeScript knows every column, every type, and every constraint in real time.
- **Key Takeaway:** *Prisma turns database queries from fragile, untyped strings into verified, auto-completing TypeScript operations with zero runtime surprises.*
- **Common Pitfalls:**
  - ⚠️ Relying on "as any" or manual type assertions: never cast Prisma query outputs to "any"; let Prisma infer the exact shape.
  - ⚠️ Assuming Prisma replaces SQL knowledge: Prisma generates SQL, and understanding indexes, constraints, and execution plans remains essential.
- **Quick Check MCQ:** *"Why does TypeScript fail to catch typos inside raw SQL query strings like "SELECT usr_name FROM users"?"*
  - *Correct Answer:* Option 2: "TypeScript treats string literals as opaque text and cannot inspect SQL grammar or live database schemas"
  - *Explanation:* To TypeScript, a raw SQL query is merely a string. It cannot know what tables or columns exist in your database without an ORM or code generator like Prisma.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Read and Shape a Record by Primary Key (`task-1-1`)
- **Type:** `guided` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Use prisma.user.findUnique to fetch a single user by ID, selecting only their id and name to create an efficient, type-safe return payload.
- **Instructions & Directives:**
  - [ ] Call prisma.user.findUnique
  - [ ] Pass where: { id: userId } to target the primary key
  - [ ] Use select: { id: true, name: true } so only id and name are retrieved
- **Prisma Validation Rule:**
  - Method: `findUnique`
  - Required Select Fields: `id, name`
  - Required Where Filters: `id`
- **Initial Starter Code:**
```typescript
// In Prisma, your query directly determines the shape of the returned value.
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
- **Success Message:** *"Great job! Notice how the returned TypeScript type is strictly { id: number; name: string } | null."*

###### 📝 Task 1.2: Task 2 (Guided): Query by Unique Constraint (Email Lookup) (`task-1-2`)
- **Type:** `guided` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Look up an account by their unique email address and project their id, name, and email fields.
- **Instructions & Directives:**
  - [ ] Call prisma.user.findUnique
  - [ ] Pass where: { email } to filter by the unique email address
  - [ ] Select id, name, and email in the response
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
- **Success Message:** *"Clean execution! By targeting a @unique field, Prisma guarantees at most one row is returned."*

###### 📝 Task 1.3: Task 3 (Independent): Eliminate Type Bypasses ("as any") (`task-1-3`)
- **Type:** `independent` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** A developer used "as any" to silence a compiler error caused by a misspelled field name. Fix the query to use the actual schema field "email" without hacks.
- **Instructions & Directives:**
  - [ ] Remove "as any" completely from the query
  - [ ] Replace the invalid field user_mail with the schema-defined email field
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
- **Success Message:** *"Well done! You eliminated the type hack and restored genuine compile-time safety."*

##### Concept 2: Lean Projections: Why SELECT * Hurts Production Apps (`day-01-concept-2`)
> **Overview:** Why fetching entire database rows degrades performance, and how Prisma select shapes both network payloads and TypeScript types.

- **Theory Core:** When developers query database tables without specifying columns, the database defaults to SELECT * (fetching every column on the row). In a small toy app, this seems harmless. In production, it creates severe problems:

1. The Payload Tax: Tables often contain heavy text columns, metadata blobs, or internal audit fields. Pulling 50 columns over the network when you only need a user's name wastes memory, CPU serialization, and network bandwidth.
2. The Security Leak: If your user table has password_hash or reset_token columns, a lazy SELECT * risks serializing sensitive secrets into public API JSON responses.
3. Memory Pressure: In high-throughput Node.js microservices, allocating thousands of bloated row objects stresses the V8 garbage collector.

With Prisma, select acts as a surgical scalpel. Specifying select: { name: true, email: true } does two things simultaneously:
- Compiles down to SELECT "name", "email" at the PostgreSQL engine level.
- Narrows the TypeScript return type so only name and email exist on the resulting object.
- **Key Takeaway:** *Always project fields intentionally with select to keep database queries fast, lightweight, and leak-proof.*
- **Common Pitfalls:**
  - ⚠️ Mixing select and include on the same level: Prisma disallows using select and include together on the root object—use nested select instead.
  - ⚠️ Assuming select is just a client-side filter: select translates directly into the SQL column list; unselected columns never leave the database server.
- **Quick Check MCQ:** *"What happens in PostgreSQL when you write prisma.user.findMany({ select: { name: true } })?"*
  - *Correct Answer:* Option 2: "PostgreSQL runs SELECT "name" FROM "users", transmitting only the name column over the network wire"
  - *Explanation:* Prisma generates a targeted SQL query that requests only the specific column from PostgreSQL, saving network and database resources.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Query a Student Directory with Lean Projection (`task-1-4`)
- **Type:** `guided` | **Target Model:** `student` | **Active Tab:** `editor`
- **Description:** Retrieve all students from the database using prisma.student.findMany, selecting only the name and department columns.
- **Instructions & Directives:**
  - [ ] Call prisma.student.findMany
  - [ ] Use select: { name: true, department: true }
  - [ ] Do not fetch unused columns like id, age, or city
- **Prisma Validation Rule:**
  - Method: `findMany`
  - Required Select Fields: `name, department`
- **Initial Starter Code:**
```typescript
// Fetch a lightweight student directory list:
export async function getStudentDirectory() {
  // TODO: Call prisma.student.findMany selecting only 'name' and 'department'
}
```
- **Solution Code:**
```typescript
export async function getStudentDirectory() {
  return await prisma.student.findMany({
    select: {
      name: true,
      department: true
    }
  });
}
```
- **Success Message:** *"Great job! You executed a lean multi-row projection without over-fetching."*

###### 📝 Task 2.2: Task 2 (Independent): Build a Safe User Profile Card (`task-1-5`)
- **Type:** `independent` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Complete the getPublicProfile function to look up a user by their unique email and project only their public name and email fields.
- **Instructions & Directives:**
  - [ ] Call prisma.user.findUnique with where: { email }
  - [ ] Select only name and email in the return payload
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
- **Success Message:** *"Safe and clean! The returned payload contains strictly the public profile fields."*

##### Concept 3: The Prisma Triad: Schema, Client, and Migrate (`day-01-concept-3`)
> **Overview:** How schema.prisma, Prisma Client, and Prisma Migrate coordinate to keep your database, SQL migrations, and TypeScript types in perfect sync.

- **Theory Core:** Prisma is not a monolithic library; it is a coordinated toolchain composed of three distinct parts:

1. schema.prisma (The Single Source of Truth):
   Here you declare your datasource (e.g. PostgreSQL), client generators, and data models with their relations and constraints. Everything in your application flows outward from this declarative file.

2. Prisma Client (The Type-Safe Query Engine):
   A tailor-made query builder generated into your node_modules. It provides auto-completion, compile-time validation, and query compilation. You never manually write type definitions for your database tables—Prisma generates them automatically.

3. Prisma Migrate (The Database Evolution Engine):
   A version-controlled database migration tool. When you modify a model in schema.prisma, Prisma Migrate calculates the difference, writes human-readable SQL migration scripts (e.g. ALTER TABLE), and applies them to your database.

Editing schema.prisma does not magically alter live PostgreSQL tables. You run migrations to update the database, and run "prisma generate" to refresh your TypeScript types.
- **Key Takeaway:** *schema.prisma defines your data models, Prisma Migrate updates your PostgreSQL tables with SQL DDL, and Prisma Client gives your TypeScript code a strongly typed query API.*
- **Common Pitfalls:**
  - ⚠️ Expecting database tables to change automatically just by saving schema.prisma without running a migration.
  - ⚠️ Manually writing TypeScript interfaces that duplicate database models instead of utilizing Prisma-generated types.
- **Quick Check MCQ:** *"What command synchronizes your TypeScript types after you add a new model to schema.prisma?"*
  - *Correct Answer:* Option 2: "prisma generate"
  - *Explanation:* Running "prisma generate" inspects schema.prisma and regenerates the Prisma Client TypeScript definitions in node_modules.

**Practice Tasks for Concept 3:**

###### 📝 Task 3.1: Task 1 (Guided): Query Auth Credentials with Precision (`task-1-6`)
- **Type:** `guided` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Look up an account by ID and project only the authentication credentials (id and email) for an internal token verification check.
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

###### 📝 Task 3.2: Task 2 (Independent): Query with Schema-Defined Unique Constraint (`task-1-7`)
- **Type:** `independent` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Demonstrate client type-safety by fetching the first user matching a verified unique constraint, returning their id, name, and email fields.
- **Instructions & Directives:**
  - [ ] Call prisma.user.findFirst
  - [ ] Filter by where: { email }
  - [ ] Select only id, name, and email
- **Prisma Validation Rule:**
  - Method: `findFirst`
  - Required Select Fields: `id, name, email`
  - Required Where Filters: `email`
- **Initial Starter Code:**
```typescript
// Fetch a single user record projecting only id, name, and email:
export async function getVerifiedUser(email: string) {
  // TODO: Call prisma.user.findFirst with where: { email } and select id, name, and email
}
```
- **Solution Code:**
```typescript
export async function getVerifiedUser(email: string) {
  return await prisma.user.findFirst({
    where: { email },
    select: { id: true, name: true, email: true }
  });
}
```
- **Success Message:** *"Great work! You fetched the verified user record with a strict projection."*

#### 🏆 Day 1 Final Challenge: Day 1 Challenge: The Production API Refactor (`day-01-challenge`)

> **Scenario:** Your backend engineering team is deprecating an old Express microservice that relied on fragile, untyped raw SQL strings. You are tasked with replacing the legacy lookup query with a type-safe Prisma query that fetches an active user by email and projects only their id, name, and email fields.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Replace Legacy Raw SQL with Typed Prisma Query (`challenge-1-1`)
- **Type:** `challenge` | **Target Model:** `user` | **Active Tab:** `editor`
- **Description:** Rewrite the legacy getUser function to find a user by unique email using prisma.user.findUnique. Select id, name, and email without using raw SQL strings or "as any" type hacks.
- **Instructions & Directives:**
  - [ ] Use prisma.user.findUnique
  - [ ] Filter by where: { email }
  - [ ] Select only id, name, and email
  - [ ] Do not use raw SQL strings or "as any" type assertions
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

### 📅 Day 02: Day 2 — Modern Prisma Setup & Configuration

- **ID / Slug:** `day-02` (`prisma-setup-v7`)
- **Milestone:** Milestone 1: Foundations & Schema Modeling
- **Estimated Duration:** 45 minutes
- **Module Overview:** Master datasource configuration, configure connection pooling for serverless and cloud PostgreSQL, and bridge legacy SQL snake_case tables to idiomatic TypeScript camelCase using @map and @@map.

**Key Learning Takeaways:**
- ✅ Understand datasource and client generator declarations in schema.prisma
- ✅ Configure connection pooling parameters for serverless environments (PgBouncer, Neon, Supabase)
- ✅ Map legacy snake_case database tables and columns to clean TypeScript camelCase models without altering live database tables

#### 🧠 Concepts (2)

##### Concept 1: Datasource Architecture & Connection Pooling in Cloud Backends (`day-02-concept-1`)
> **Overview:** How Prisma connects to PostgreSQL, and why serverless environments require connection poolers to prevent database connection exhaustion.

- **Theory Core:** Every Prisma application starts with the datasource block in schema.prisma. It specifies the database provider ("postgresql", "mysql", "sqlite") and the connection URL:

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

In traditional Node.js servers, a long-lived application process maintains a stable pool of 5–10 database connections. However, in modern serverless and containerized cloud platforms (like Vercel, AWS Lambda, or Cloud Run), incoming traffic can spin up hundreds of concurrent function instances simultaneously. If each function opens its own direct connection, PostgreSQL will quickly exceed its max_connections limit and crash with "FATAL: remaining connection slots are reserved".

To prevent this, production deployments route traffic through a connection pooler like PgBouncer or serverless pooling proxies. Prisma supports this by appending query parameters like "?pgbouncer=true&connection_limit=10" to your connection URL.
- **Key Takeaway:** *Always read database credentials from environment variables, and use connection pooling parameters in serverless environments.*
- **Quick Check MCQ:** *"Why do cloud serverless backends require a connection pooler (like PgBouncer) when talking to PostgreSQL?"*
  - *Correct Answer:* Option 2: "Each serverless function instance opens separate connections, quickly overwhelming PostgreSQL connection limits"
  - *Explanation:* Serverless functions scale out horizontally. A connection pooler acts as a reverse proxy that multiplexes hundreds of transient function connections into a fixed pool of persistent database connections.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Configure PostgreSQL Datasource & Generator (`task-2-1`)
- **Type:** `guided` | **Target Model:** `datasource` | **Active Tab:** `schema`
- **Description:** Set up the datasource db block pointing to PostgreSQL using env("DATABASE_URL") and configure the generator client in schema.prisma.
- **Instructions & Directives:**
  - [ ] Define datasource db with provider = "postgresql" and url = env("DATABASE_URL")
  - [ ] Define generator client with provider = "prisma-client-js"
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```prisma
// Configure datasource db and generator client:

```
- **Solution Code:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```
- **Success Message:** *"Great job! Datasource and generator blocks are properly configured."*

###### 📝 Task 1.2: Task 2 (Independent): Append Connection Pooling Parameters (`task-2-2`)
- **Type:** `independent` | **Target Model:** `url` | **Active Tab:** `editor`
- **Description:** Write a helper function to safely append required serverless pool parameters (pgbouncer=true and connection_limit=10) to a PostgreSQL URL.
- **Instructions & Directives:**
  - [ ] Use the standard URL object to parse basePostgresUrl
  - [ ] Set search parameter pgbouncer to "true"
  - [ ] Set search parameter connection_limit to "10"
  - [ ] Return the updated URL string
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```typescript
export function formatPooledDbUrl(basePostgresUrl: string): string {
  // TODO: Append pgbouncer=true and connection_limit=10 to the URL safely
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
- **Success Message:** *"Well done! Connection pooling parameters ensure reliable database connectivity in high-concurrency environments."*

##### Concept 2: The Naming Bridge: Mapping snake_case SQL to camelCase TypeScript (`day-02-concept-2`)
> **Overview:** How to use @map and @@map to write clean, idiomatic TypeScript while preserving legacy database table and column names.

- **Theory Core:** In relational database design, table and column names almost universally adhere to snake_case conventions:
- Tables: tbl_customers, user_audit_logs, order_items
- Columns: first_name, is_email_verified, created_at

However, in TypeScript, writing user.first_name or user.is_email_verified violates idiomatic conventions (camelCase for properties, PascalCase for classes and models). Forcing your TypeScript codebase to adopt database snake_case feels clumsy.

Prisma solves this dilemma with two mapping attributes:
- @map("column_name"): Applied directly to a field. In your TypeScript code, you write user.firstName, but Prisma sends queries to the underlying "first_name" column in SQL.
- @@map("table_name"): Applied at the bottom of a model block. In TypeScript, you write prisma.customer.findMany(), while Prisma targets the "tbl_customers" table in PostgreSQL.

Neither attribute alters your database schema. They act as a compile-time translation bridge.
- **Key Takeaway:** *Use @map for columns and @@map for tables to keep your TypeScript codebase idiomatic without altering database table schemas.*
- **Quick Check MCQ:** *"What is the exact distinction between @map and @@map in Prisma?"*
  - *Correct Answer:* Option 2: "@map maps an individual column name; @@map maps an entire table name"
  - *Explanation:* A single @ directive operates on the field directly preceding it, whereas a double @@ directive operates on the entire model block.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Map Customer Model and Email Column (`task-2-3`)
- **Type:** `guided` | **Target Model:** `Customer` | **Active Tab:** `schema`
- **Description:** Map model Customer to legacy table "tbl_customers" and field email to column "cust_email" in schema.prisma.
- **Instructions & Directives:**
  - [ ] Add @map("cust_email") to field email
  - [ ] Add @@map("tbl_customers") at the bottom of model Customer
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```prisma
model Customer {
  id    Int    @id @default(autoincrement())
  email String

  // Add @@map for tbl_customers
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
- **Success Message:** *"Great job! Clean TypeScript camelCase mapped to legacy database snake_case."*

###### 📝 Task 2.2: Task 2 (Independent): Map Phone & Registered Date Columns (`task-2-4`)
- **Type:** `independent` | **Target Model:** `Customer` | **Active Tab:** `schema`
- **Description:** Add snake_case mappings for phoneNumber -> phone_number and registeredAt -> registered_at on model Customer.
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

#### 🏆 Day 2 Final Challenge: Day 2 Challenge: Modernize an Introspected Auth Schema (`day-02-challenge`)

> **Scenario:** Your engineering team used "prisma db pull" to introspect an existing legacy PostgreSQL database. The generated model uses raw snake_case table and column names. Clean up the AuthUser model so developers use clean camelCase properties while the database keeps its exact snake_case columns intact.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Map AuthUser Model and Columns (`challenge-2-1`)
- **Type:** `challenge` | **Target Model:** `AuthUser` | **Active Tab:** `schema`
- **Description:** Map model AuthUser to "auth_users" and field passwordHash to "password_hash".
- **Instructions & Directives:**
  - [ ] Define model AuthUser with id Int @id @default(autoincrement())
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
- **Success Message:** *"AuthUser model and columns mapped successfully!"*


---

### 📅 Day 03: Day 3 — Models, Fields, Enums & Constraints

- **ID / Slug:** `day-03` (`models-fields-enums`)
- **Milestone:** Milestone 1: Foundations & Schema Modeling
- **Estimated Duration:** 50 minutes
- **Module Overview:** Design production-grade database schemas: choose appropriate scalar types, handle financial precision with Decimal, enforce valid domain values with Enums, and guarantee integrity with composite unique constraints.

**Key Learning Takeaways:**
- ✅ Understand why JavaScript floating-point numbers break financial math and why Prisma Decimal is required
- ✅ Model optional fields (?) vs required fields and use @updatedAt for automated audit timestamps
- ✅ Declare native PostgreSQL Enums and configure default values
- ✅ Enforce multi-column uniqueness using composite constraints like @@unique([studentId, courseId])

#### 🧠 Concepts (2)

##### Concept 1: Scalar Types, Nullability & The Precision Problem (`day-03-concept-1`)
> **Overview:** Why floating-point numbers corrupt financial data, how cuid() provides distributed IDs, and how nullability works in schema.prisma.

- **Theory Core:** In TypeScript and JavaScript, all standard numbers are 64-bit binary floating-point numbers (IEEE 754). This creates subtle calculation errors:
0.1 + 0.2 // equals 0.30000000000000004!

If you use Float to store prices, account balances, or financial transactions, rounding errors will eventually corrupt your accounting ledger. Prisma provides Decimal to represent arbitrary-precision fixed-point numbers mapped directly to PostgreSQL's native DECIMAL/NUMERIC types.

Beyond scalar types, schema.prisma enforces strict nullability:
- title String: Stored as NOT NULL in SQL. TypeScript infers string.
- description String?: Stored as NULL in SQL. TypeScript infers string | null.

For identifiers, autoincrementing integers (1, 2, 3...) are predictable and expose your database record count. Modern distributed systems frequently use cuid() or uuid() to generate collision-resistant string IDs on the client or server without roundtrips.
- **Key Takeaway:** *Use Decimal for financial values to prevent rounding inaccuracies, and use ? to indicate nullable fields.*
- **Quick Check MCQ:** *"Why should you choose Decimal instead of Float for storing monetary amounts in Prisma?"*
  - *Correct Answer:* Option 2: "Float suffers from binary floating-point rounding inaccuracies (e.g. 0.1 + 0.2 !== 0.3), while Decimal provides exact precision"
  - *Explanation:* Decimal maps to SQL NUMERIC/DECIMAL, preserving exact precision for currency and financial calculations.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Create Product Model with Precision Types (`task-3-1`)
- **Type:** `guided` | **Target Model:** `Product` | **Active Tab:** `schema`
- **Description:** Create a Product model with a cuid() id, required title, optional description (String?), Decimal price, and automated timestamps.
- **Instructions & Directives:**
  - [ ] Model Product with id String @id @default(cuid())
  - [ ] title String
  - [ ] description String?
  - [ ] price Decimal
  - [ ] createdAt DateTime @default(now())
  - [ ] updatedAt DateTime @updatedAt
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```prisma
// Define the Product model:

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
- **Success Message:** *"Great job! Model Product matches modern schema standards."*

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

##### Concept 2: Enforcing Invariants: Enums & Multi-Field Constraints (`day-03-concept-2`)
> **Overview:** How Enums eliminate arbitrary string bugs, and how composite constraints (@@unique, @@id) prevent duplicate data in relational tables.

- **Theory Core:** Storing status values as raw strings (e.g. status String) is an anti-pattern. A typo like "pendng" or "canclled" will bypass TypeScript if passed dynamically and corrupt database state.

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

This tells PostgreSQL: allow multiple occurrences of studentId and courseId, but the combination of both must remain strictly unique.
- **Key Takeaway:** *Use Enums to prevent invalid status strings, and use composite constraints to prevent duplicate enrollments, favorites, or memberships.*
- **Quick Check MCQ:** *"When should you declare @@unique([studentId, courseId]) instead of putting @unique on studentId?"*
  - *Correct Answer:* Option 2: "When students can enroll in multiple courses, but must not be enrolled in the exact same course twice"
  - *Explanation:* A composite unique constraint guarantees that the pair (studentId, courseId) is unique, preventing duplicate enrollments while allowing students to take multiple courses.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Define OrderStatus Enum & Order Model (`task-3-3`)
- **Type:** `guided` | **Target Model:** `Order` | **Active Tab:** `schema`
- **Description:** Define enum OrderStatus with PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, and attach it to model Order.
- **Instructions & Directives:**
  - [ ] Define enum OrderStatus with the 5 statuses
  - [ ] Model Order with id Int @id @default(autoincrement()), status OrderStatus @default(PENDING), and total Decimal
- **Prisma Validation Rule:**
  - Method: `any`
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
- **Success Message:** *"Great work! OrderStatus enum provides robust domain constraints."*

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
- **Success Message:** *"Excellent! Duplicate enrollments are prevented at the database level."*

#### 🏆 Day 3 Final Challenge: Day 3 Challenge: Design an E-Commerce Favorites System (`day-03-challenge`)

> **Scenario:** Your e-commerce platform needs a favorites system where users can favorite products. A user can favorite multiple products, and a product can be favorited by multiple users. Design a UserFavorite join model with composite primary key @@id([userId, productId]).

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Design UserFavorite Composite Model (`challenge-3-1`)
- **Type:** `challenge` | **Target Model:** `UserFavorite` | **Active Tab:** `schema`
- **Description:** Create model UserFavorite with userId Int, productId Int, favoritedAt DateTime @default(now()), and composite primary key @@id([userId, productId]).
- **Instructions & Directives:**
  - [ ] Define model UserFavorite
  - [ ] Add userId Int and productId Int
  - [ ] Add favoritedAt DateTime @default(now())
  - [ ] Add @@id([userId, productId])
- **Initial Starter Code:**
```prisma
// Define model UserFavorite with composite primary key:

```
- **Solution Code:**
```prisma
model UserFavorite {
  userId      Int
  productId   Int
  favoritedAt DateTime @default(now())

  @@id([userId, productId])
}
```
- **Success Message:** *"UserFavorite composite model configured!"*


---

### 📅 Day 04: Day 4 — Relational Schema Modeling (1:1, 1:N, M:N)

- **ID / Slug:** `day-04` (`relations-modeling`)
- **Milestone:** Milestone 1: Foundations & Schema Modeling
- **Estimated Duration:** 55 minutes
- **Module Overview:** Master relational modeling in Prisma: understand how foreign keys connect tables, why scalar fields differ from relation fields, enforce 1:1 uniqueness, and model explicit many-to-many join tables.

**Key Learning Takeaways:**
- ✅ Differentiate physical foreign key columns (authorId Int) from virtual TypeScript relation fields (author User)
- ✅ Understand why 1-to-1 relations require @unique on the foreign key to avoid accidentally creating a 1-to-Many relation
- ✅ Model optional relations using nullable foreign keys (Int?)
- ✅ Compare Prisma implicit many-to-many relations with explicit join models

#### 🧠 Concepts (2)

##### Concept 1: One-to-Many (1:N): Scalar Columns vs Virtual Relation Fields (`day-04-concept-1`)
> **Overview:** How foreign keys link tables, and why Prisma cleanly separates the SQL column from the TypeScript navigation property.

- **Theory Core:** In relational databases, relationships are formed using Foreign Keys. In a One-to-Many (1:N) relationship (e.g. an Author has many Books), the foreign key column always lives on the "Many" table (Book).

Prisma introduces a clean architectural distinction that avoids confusion:
1. The Scalar Field (authorId Int):
   This is the actual, physical integer column stored in your PostgreSQL table.
2. The Relation Field (author Author @relation(...)):
   This field does NOT exist as a column in PostgreSQL! It is a virtual navigation property used exclusively in TypeScript to navigate relations and perform typed joins with include or select.

The @relation attribute binds the virtual field to the physical foreign key:
@relation(fields: [authorId], references: [id])
- fields: [authorId] points to the scalar column on this model.
- references: [id] points to the target primary key on the referenced model.
- **Key Takeaway:** *In Prisma 1:N relations, the model that holds the foreign key defines @relation(fields: [...], references: [...]).*
- **Quick Check MCQ:** *"In a 1-to-Many relationship between Author and Book, which model holds the actual database foreign key column?"*
  - *Correct Answer:* Option 2: "Book holds authorId"
  - *Explanation:* The "Many" side (Book) holds the foreign key scalar column pointing back to the primary key of Author.

**Practice Tasks for Concept 1:**

###### 📝 Task 1.1: Task 1 (Guided): Connect Author and Book (1:N) (`task-4-1`)
- **Type:** `guided` | **Target Model:** `Book` | **Active Tab:** `schema`
- **Description:** Add foreign key authorId and relation field author to model Book referencing Author.id.
- **Instructions & Directives:**
  - [ ] In model Book, add authorId Int
  - [ ] Add author Author @relation(fields: [authorId], references: [id])
- **Prisma Validation Rule:**
  - Method: `any`
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
- **Description:** Model a 1-to-Many relation where companyId is optional (Int?) allowing unassigned employees.
- **Instructions & Directives:**
  - [ ] In model Employee, add companyId Int?
  - [ ] Add company Company? @relation(fields: [companyId], references: [id])
- **Prisma Validation Rule:**
  - Method: `any`
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

##### Concept 2: One-to-One (1:1): The @unique Mandate (`day-04-concept-2`)
> **Overview:** Why omitting @unique on a foreign key accidentally creates a 1:Many relation, and how 1:1 relations enforce strict pairing.

- **Theory Core:** A One-to-One (1:1) relationship links exactly one record to at most one other record (such as a User and their private Profile, or a Driver and their License).

Syntactically, a 1:1 relation looks almost identical to a 1:N relation. There is only one critical difference:
The foreign key scalar field MUST have the @unique constraint!

Why is @unique mandatory?
If userId Int does NOT have @unique, nothing stops multiple Profile records from pointing to the same User #1. That would be a One-to-Many relationship. By placing @unique on userId:
userId Int @unique

PostgreSQL enforces that no two Profile rows can ever have the same userId, guaranteeing a strict 1:1 pairing. If you omit @unique, Prisma schema validation will halt with a compile error.
- **Key Takeaway:** *Always place @unique on the foreign key field in a 1:1 relationship.*
- **Quick Check MCQ:** *"What happens if you omit @unique on the foreign key field of a 1:1 relation in Prisma?"*
  - *Correct Answer:* Option 2: "Prisma schema validation flags an error because without @unique the relation is a 1-to-Many"
  - *Explanation:* Prisma validation requires @unique on the foreign key of a 1:1 relation because without a unique constraint, PostgreSQL would permit multiple child records pointing to the same parent.

**Practice Tasks for Concept 2:**

###### 📝 Task 2.1: Task 1 (Guided): Connect Account and AccountSettings (1:1) (`task-4-3`)
- **Type:** `guided` | **Target Model:** `AccountSettings` | **Active Tab:** `schema`
- **Description:** Create a 1:1 relation between Account and AccountSettings, enforcing @unique on accountId.
- **Instructions & Directives:**
  - [ ] Add accountId Int @unique to AccountSettings
  - [ ] Add account Account @relation(fields: [accountId], references: [id])
- **Prisma Validation Rule:**
  - Method: `any`
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
- **Success Message:** *"Great job! 1:1 relationship successfully modeled."*

###### 📝 Task 2.2: Task 2 (Independent): Fix 1:1 Unique Constraint Bug (`task-4-4`)
- **Type:** `independent` | **Target Model:** `License` | **Active Tab:** `schema`
- **Description:** Fix a schema issue where omitting @unique caused relation validation failure.
- **Instructions & Directives:**
  - [ ] Add @unique to driverId in model License
- **Prisma Validation Rule:**
  - Method: `any`
- **Initial Starter Code:**
```prisma
model Driver {
  id      Int      @id @default(autoincrement())
  license License?
}

model License {
  id       Int    @id @default(autoincrement())
  number   String @unique
  driverId Int
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
- **Success Message:** *"Fixed! Adding @unique satisfies the 1:1 relation requirement."*

#### 🏆 Day 4 Final Challenge: Day 4 Challenge: Model a Hospital Doctor-Patient Relational Graph (`day-04-challenge`)

> **Scenario:** A healthcare SaaS platform needs relational models for Doctor and Appointment. A Doctor has many Appointments, and an Appointment belongs to exactly one Doctor. Model this 1-to-Many relationship with proper foreign keys.

**Challenge Tasks (1):**

###### 🎯 Challenge Task 1: Model Doctor-Appointment 1:N Relationship (`challenge-4-1`)
- **Type:** `challenge` | **Target Model:** `Appointment` | **Active Tab:** `schema`
- **Description:** In model Appointment, add doctorId Int and doctor relation referencing Doctor.id. In model Doctor, add appointments Appointment[].
- **Instructions & Directives:**
  - [ ] In model Doctor, add appointments Appointment[]
  - [ ] In model Appointment, add doctorId Int
  - [ ] In model Appointment, add doctor Doctor @relation(fields: [doctorId], references: [id])
- **Initial Starter Code:**
```prisma
model Doctor {
  id           Int    @id @default(autoincrement())
  name         String
  specialty    String
  // Add appointments relation
}

model Appointment {
  id          Int      @id @default(autoincrement())
  scheduledAt DateTime
  // Add doctorId and doctor relation
}
```
- **Solution Code:**
```prisma
model Doctor {
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
}
```
- **Success Message:** *"Outstanding! Doctor-Appointment relational model is production-ready."*


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

