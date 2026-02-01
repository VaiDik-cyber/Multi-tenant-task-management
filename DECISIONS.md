# Architecture Decisions & Tradeoffs

## 1. Database: MySQL vs MongoDB
**Decision**: We chose **MySQL** (Relational) over MongoDB (NoSQL).
**Why**:
- **ACID Compliance**: Task management requires strict data integrity (Atomicity, Consistency, Isolation, Durability). MySQL guarantees this, ensuring that critical operations like status updates are reliable.
- **Relational Integrity**: Our data model (Organizations -> Projects -> Tasks) is highly structured. MySQL's `FOREIGN KEY` constraints (e.g., `ON DELETE CASCADE`) natively enforce data integrity, preventing orphaned records.
- **Structured Data**: The schema is well-defined and stable, making a normalized SQL approach more suitable than a schemaless document store.

## 2. Concurrency: Optimistic Locking
**Decision**: We implemented **Optimistic Locking** using a `version` column.
**Why**:
- **Performance**: Traditional "Table Locking" (or Pessimistic Locking) requires holding database connections open and blocking other transactions, which severely limits scalability. Optimistic Locking is stateless and non-blocking.
- **User Experience**: It handles race conditions (e.g., two users editing the same task) by preventing "Last Write Wins" without freezing the UI.
