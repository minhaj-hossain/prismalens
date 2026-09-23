# PrismaLens Simulator Capabilities & Architecture Matrix

## Overview
PrismaLens executes Prisma-like queries entirely in the user's browser, providing an interactive learning loop without requiring external cloud databases or Docker containers.

To ensure learners build authentic real-world intuition, this document outlines what is **real** versus **simulated**.

---

## Real vs. Simulated Capabilities

| Component / Layer | Status | Implementation Details |
|---|---|---|
| **Code Execution** | **Real** | Dynamic JS runtime evaluation with function argument injection and sandboxed async scope. Protected by a 3500ms infinite-loop timeout. |
| **Grading & Assertions** | **Real** | Evaluates actual runtime `ExecutionResult`, inspecting query logs, returned data, and table mutations (`tableDiff`). Comments or syntax patterns alone cannot fake a pass. |
| **Transaction Rollback** | **Real** | `$transaction([ ... ])` snapshots database tables prior to execution. If any operation fails, the engine performs atomic state rollback. |
| **Table State & Diffing** | **Real** | In-memory relational tables track mutations across calls. `computeTableDiff` calculates `inserted`, `updated`, and `deleted` rows. |
| **Runtime Zod Validation** | **Real** | Real Zod schemas execute and validate payloads directly in browser memory. |
| **Progress Persistence & Streak** | **Real** | Versioned localStorage state schema (`prismalens_user_progress_v2`) tracking timestamps, XP, completed tasks, and streak continuity. |
| **Schema AST Parsing** | **Real** | Full AST tokenizer and parser converting `.prisma` schemas into models, fields, types, attributes (`@id`, `@unique`, `@default`), and relation graphs for the ERD visualizer. |
| **Database Network / Sockets** | **Simulated** | In-browser mock engine. Does not open TCP sockets to a live PostgreSQL server. |
| **Compiled SQL** | **Simulated** | AST-derived SQL generation (`generateSqlFromPrismaCall`). Projects model, operation (`findMany`, `create`, `update`), filters, and joins to standard PostgreSQL dialect for educational inspection. |

---

## Method Support Matrix

| Prisma Method | Supported in Engine | SQL Generation | Mutation Diff |
|---|---|---|---|
| `model.findMany` | ✅ Yes (where, select, include, orderBy, skip, take) | ✅ `SELECT ... FROM ...` | N/A |
| `model.findFirst` | ✅ Yes (where, orderBy, skip) | ✅ `SELECT ... LIMIT 1` | N/A |
| `model.findUnique` | ✅ Yes (where single/unique keys) | ✅ `SELECT ... WHERE ... LIMIT 1` | N/A |
| `model.create` | ✅ Yes (scalar data, auto-id, timestamps) | ✅ `INSERT INTO ... VALUES (...) RETURNING *` | ✅ `inserted` |
| `model.createMany` | ✅ Yes (batch data, `skipDuplicates`) | ✅ `INSERT INTO ... VALUES (...), (...)` | ✅ `inserted` |
| `model.update` | ✅ Yes (where, data mutations) | ✅ `UPDATE ... SET ... WHERE ...` | ✅ `updated` |
| `model.updateMany` | ✅ Yes (where, data mutations) | ✅ `UPDATE ... SET ... WHERE ...` | ✅ `updated` |
| `model.delete` | ✅ Yes (where) | ✅ `DELETE FROM ... WHERE ...` | ✅ `deleted` |
| `model.deleteMany` | ✅ Yes (where filter) | ✅ `DELETE FROM ... WHERE ...` | ✅ `deleted` |
| `model.upsert` | ✅ Yes (where, create, update) | ✅ `INSERT ... ON CONFLICT DO UPDATE` | ✅ `inserted` / `updated` |
| `$transaction` | ✅ Yes (array of queries with rollback) | ✅ `BEGIN; ... COMMIT; / ROLLBACK;` | ✅ Atomic rollback |

---

## Limitations & Edge Cases
1. **Raw SQL (`$queryRaw`)**: Simulates common educational queries; does not embed a full SQLite WebAssembly engine.
2. **Migrations (`prisma migrate dev`)**: Conceptual simulation; changes are reflected directly in memory and AST schemas.
3. **Database Drivers**: Runs in standard web browsers and environments without native Node C++ addons.
