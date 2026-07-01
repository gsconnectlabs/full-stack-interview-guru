import type { Question } from "../types";

/**
 * SQL — flagship expansion batch (20 questions).
 * Enterprise & product-company patterns: query optimization, indexing strategy,
 * transactions & isolation, locking/deadlocks, ORM N+1, pagination at scale, and
 * production slow-query diagnosis. (Basic joins / "what is an index" live in the
 * base bank; these are distinct, deeper questions.)
 *
 * Difficulty mix: 4 Easy · 10 Medium · 6 Hard. Ordered easy → hard.
 */
export const sqlExtra: Question[] = [
  // ---------------------------------------------------------------- Easy (4)
  {
    slug: "where-vs-having",
    categoryId: "sql",
    topic: "Optimization",
    question: "WHERE vs HAVING — what's the difference, and which is faster?",
    tags: ["where", "having", "group by", "aggregate", "filtering"],
    shortAnswer:
      "WHERE filters rows BEFORE grouping/aggregation; HAVING filters groups AFTER aggregation. WHERE can use indexes and reduces rows early (faster), so push filters into WHERE and reserve HAVING for conditions on aggregates like COUNT(*) > 5.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "WHERE", v: "filters rows before GROUP BY (index-usable)" },
          { k: "HAVING", v: "filters groups after aggregation" },
          { k: "Rule", v: "filter early in WHERE; aggregates in HAVING" },
        ],
      },
    ],
    handsOn: {
      lang: "sql",
      code: `SELECT region, COUNT(*) AS orders
FROM orders
WHERE status = 'PAID'        -- row filter (uses index)
GROUP BY region
HAVING COUNT(*) > 100;       -- group filter`,
    },
    whatIf: {
      q: "Someone filters a non-aggregate column in HAVING — why is that a code smell?",
      a: "Filtering a plain column in HAVING forces the DB to group ALL rows first, then discard groups — wasteful. That predicate belongs in WHERE so rows are eliminated before grouping and an index can help.",
    },
    realWorld:
      "Moving a misplaced row-filter from HAVING to WHERE is a common quick win on slow reporting queries — it cuts the rows that reach the aggregation step.",
    interviewerExpectation: ["before vs after aggregation", "WHERE uses indexes", "HAVING for aggregates", "filter early"],
    followUps: [
      "Can you reference a SELECT alias in WHERE? In HAVING?",
      "What's the logical order of SQL clause evaluation?",
      "When is HAVING genuinely required?",
    ],
    commonMistakes: [
      "Putting row filters in HAVING",
      "Expecting WHERE to filter aggregates",
      "Assuming SELECT aliases are usable in WHERE",
    ],
    bestPractices: [
      "Filter rows in WHERE, groups in HAVING",
      "Index the WHERE predicates",
      "Reduce the working set as early as possible",
    ],
    relatedTech: ["GROUP BY", "indexes", "query planner"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Cognizant", "Accenture"],
    related: ["reading-execution-plan", "window-functions"],
  },
  {
    slug: "delete-truncate-drop",
    categoryId: "sql",
    topic: "Transactions",
    question: "DELETE vs TRUNCATE vs DROP — how do they differ, and which is transactional?",
    tags: ["delete", "truncate", "drop", "ddl", "dml", "rollback"],
    shortAnswer:
      "DELETE (DML) removes rows with optional WHERE, is logged row-by-row and rollback-able. TRUNCATE (DDL) drops all rows fast by deallocating pages, usually can't be rolled back and resets identity. DROP removes the whole table (structure + data).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "DELETE", v: "DML, WHERE, logged, rollback-able, fires triggers" },
          { k: "TRUNCATE", v: "DDL, all rows, fast, resets identity" },
          { k: "DROP", v: "removes table structure entirely" },
        ],
      },
    ],
    whatIf: {
      q: "You need to empty a 100M-row staging table nightly — DELETE or TRUNCATE?",
      a: "TRUNCATE: it deallocates data pages in one operation (near-instant) with minimal logging and resets the identity counter, whereas DELETE logs every row and bloats the transaction log. Use DELETE only when you need a WHERE filter or transactional rollback.",
    },
    realWorld:
      "ETL/staging cleanups use TRUNCATE for speed; audited deletes use DELETE for rollback + triggers. Confusing them (TRUNCATE can't be easily undone) causes real data-loss incidents.",
    interviewerExpectation: ["DML vs DDL", "DELETE logged/rollback/WHERE", "TRUNCATE fast/resets identity", "DROP removes table", "triggers fire on DELETE only"],
    followUps: [
      "Why can TRUNCATE be faster than DELETE?",
      "Does TRUNCATE fire DELETE triggers? Reset identity?",
      "Which can you roll back inside a transaction?",
    ],
    commonMistakes: [
      "Using DELETE without WHERE for full-table clears (slow, log bloat)",
      "Assuming TRUNCATE is easily reversible",
      "Forgetting TRUNCATE resets auto-increment",
    ],
    bestPractices: [
      "TRUNCATE for fast full clears of non-audited tables",
      "DELETE ... WHERE for selective, recoverable removal",
      "Always confirm backups before TRUNCATE/DROP in prod",
    ],
    relatedTech: ["transaction log", "identity/sequence", "triggers"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["TCS", "Infosys", "Wipro", "Capgemini"],
    related: ["acid-isolation-levels", "large-table-partitioning"],
  },
  {
    slug: "union-vs-union-all",
    categoryId: "sql",
    topic: "Optimization",
    question: "UNION vs UNION ALL — why does the wrong one quietly slow your query?",
    tags: ["union", "union all", "distinct", "performance"],
    shortAnswer:
      "UNION removes duplicates (an implicit DISTINCT → sort/hash, extra cost). UNION ALL concatenates results and keeps duplicates (no dedup work). Use UNION ALL whenever you know results are already disjoint — it's significantly faster.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "UNION", v: "dedups → sort/hash, slower" },
          { k: "UNION ALL", v: "keeps all rows, no dedup, faster" },
          { k: "Rule", v: "UNION ALL unless you NEED dedup" },
        ],
      },
    ],
    whatIf: {
      q: "A report combining 6 monthly tables is slow — quick fix?",
      a: "If the monthly partitions can't overlap, switch UNION to UNION ALL. UNION forces a costly dedup across the whole combined set; UNION ALL just appends, often turning a sort-heavy plan into a cheap concatenation.",
    },
    realWorld:
      "Defaulting to UNION 'to be safe' is a frequent hidden cost in reports that combine partitioned/disjoint sources where duplicates are impossible.",
    interviewerExpectation: ["UNION dedups (DISTINCT cost)", "UNION ALL keeps duplicates", "UNION ALL faster on disjoint sets", "column count/type must match"],
    followUps: [
      "How does the DB implement the UNION dedup?",
      "When is UNION (dedup) actually required?",
      "What rules govern column matching across the parts?",
    ],
    commonMistakes: [
      "Using UNION when duplicates are impossible",
      "Assuming UNION ALL sorts the result",
      "Mismatched column counts/types across parts",
    ],
    bestPractices: [
      "Prefer UNION ALL unless dedup is needed",
      "Ensure disjoint sources before using UNION ALL",
      "Check the plan for an unexpected sort/dedup",
    ],
    relatedTech: ["DISTINCT", "sort/hash aggregate", "query planner"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "Cognizant", "Accenture"],
    related: ["reading-execution-plan", "where-vs-having"],
  },
  {
    slug: "primary-unique-foreign-key",
    categoryId: "sql",
    topic: "Normalization",
    question: "Primary key vs unique key vs foreign key — and how do they relate to indexes?",
    tags: ["primary key", "unique key", "foreign key", "constraints", "index"],
    shortAnswer:
      "PRIMARY KEY = unique + NOT NULL, one per table, usually the clustered index. UNIQUE = enforces uniqueness, allows (typically one) NULL, multiple per table. FOREIGN KEY = references another table's key for referential integrity. PK/UNIQUE auto-create indexes; FK columns should be indexed too.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "PRIMARY KEY", v: "unique + NOT NULL, one per table" },
          { k: "UNIQUE", v: "unique, allows NULL, many per table" },
          { k: "FOREIGN KEY", v: "referential integrity to a parent" },
        ],
      },
    ],
    whatIf: {
      q: "Deletes/joins on a child table are slow — what's a common missing index?",
      a: "The foreign-key column. PK/UNIQUE auto-index, but FK columns usually don't get an index automatically — so joins and cascade/check-on-delete do full scans. Add an index on every FK column.",
    },
    realWorld:
      "Un-indexed foreign keys are a classic cause of slow joins and lock escalation on parent deletes; adding the FK index is a frequent, high-impact fix.",
    interviewerExpectation: ["PK unique+not null+1", "UNIQUE allows null/many", "FK referential integrity", "PK/UNIQUE auto-index", "index FK columns manually"],
    followUps: [
      "Why index foreign-key columns explicitly?",
      "Can a unique key contain NULLs? How many?",
      "What does ON DELETE CASCADE cost?",
    ],
    commonMistakes: [
      "Leaving FK columns un-indexed",
      "Assuming UNIQUE disallows all NULLs",
      "Multiple primary keys (only one allowed)",
    ],
    bestPractices: [
      "Index every foreign-key column",
      "Use a stable surrogate PK (usually)",
      "Enforce integrity with constraints, not app code alone",
    ],
    relatedTech: ["clustered index", "referential integrity", "cascade"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["TCS", "Infosys", "Deloitte", "Wipro"],
    related: ["clustered-vs-nonclustered-index", "normalization-denormalization"],
  },

  // -------------------------------------------------------------- Medium (10)
  {
    slug: "reading-execution-plan",
    categoryId: "sql",
    topic: "Optimization",
    question: "How do you read an execution plan to find why a query is slow?",
    tags: ["explain", "execution plan", "full scan", "index seek", "optimization"],
    shortAnswer:
      "Run EXPLAIN/EXPLAIN ANALYZE. Look for full table scans on big tables (missing/unused index), the join order and join type (nested loop vs hash), the rows estimated vs actual (bad stats), and the most expensive node. Fix the costliest operation first.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Seq/Table Scan", v: "reading whole table — index?" },
          { k: "Index Seek/Scan", v: "using an index (good)" },
          { k: "Estimated vs actual rows", v: "mismatch = stale stats" },
          { k: "Join type", v: "nested loop / hash / merge" },
        ],
      },
    ],
    handsOn: {
      lang: "sql",
      code: `EXPLAIN ANALYZE
SELECT * FROM orders o JOIN customers c ON c.id = o.customer_id
WHERE o.status = 'OPEN';
-- look for: Seq Scan on orders? rows est vs actual? join method?`,
    },
    whatIf: {
      q: "Estimated rows = 10 but actual = 2,000,000 — what does that tell you?",
      a: "The optimizer is working off stale/missing statistics, so it picked a bad plan (e.g. nested loop instead of hash join). Update statistics / ANALYZE the table so the planner estimates correctly and chooses an efficient plan.",
    },
    realWorld:
      "Reading EXPLAIN is the core skill for query tuning; the estimated-vs-actual row gap is the single most useful signal for 'why did it pick this terrible plan?'.",
    interviewerExpectation: ["EXPLAIN ANALYZE", "scan vs seek", "join types", "estimated vs actual rows", "update stats / fix costliest node"],
    followUps: [
      "Nested loop vs hash vs merge join — when each?",
      "How do stale statistics cause bad plans?",
      "What's the difference between EXPLAIN and EXPLAIN ANALYZE?",
    ],
    commonMistakes: [
      "Optimizing without looking at the plan",
      "Ignoring the estimated-vs-actual row gap",
      "Adding indexes blindly instead of reading the plan",
    ],
    bestPractices: [
      "Always EXPLAIN ANALYZE slow queries",
      "Keep statistics fresh (auto-analyze/ANALYZE)",
      "Target the most expensive plan node first",
    ],
    relatedTech: ["EXPLAIN ANALYZE", "statistics", "query planner"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["index-not-used", "slow-query-diagnosis", "composite-index-leftmost-prefix"],
  },
  {
    slug: "composite-index-leftmost-prefix",
    categoryId: "sql",
    topic: "Indexes",
    question: "How does a composite index work, and what is the leftmost-prefix rule?",
    tags: ["composite index", "leftmost prefix", "index order", "multi-column"],
    shortAnswer:
      "A composite index on (a, b, c) is sorted by a, then b, then c. The optimizer can use it for predicates that include a left prefix — (a), (a,b), (a,b,c) — but NOT for (b) or (c) alone. Column order must match your query's filter/sort patterns.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Index (a,b,c)", v: "sorted by a, then b, then c" },
          { k: "Usable", v: "a / a,b / a,b,c (left prefix)" },
          { k: "NOT usable", v: "b alone, c alone" },
        ],
      },
    ],
    handsOn: {
      lang: "sql",
      code: `CREATE INDEX idx ON orders (customer_id, status, created_at);
-- uses idx:  WHERE customer_id=? AND status=?
-- ignores idx: WHERE status=?   (skips leftmost customer_id)`,
    },
    whatIf: {
      q: "You have an index on (status, customer_id) but queries filter only by customer_id — why no speedup?",
      a: "customer_id isn't the leftmost column, so the index can't seek on it directly. Reorder to (customer_id, status) to match the dominant query, or add a separate index on customer_id.",
    },
    realWorld:
      "Column ordering in composite indexes is one of the highest-leverage tuning decisions; the wrong order leaves an index 'present but unused' for the queries that matter.",
    interviewerExpectation: ["sorted by column order", "leftmost-prefix rule", "order by selectivity/query pattern", "equality before range"],
    followUps: [
      "Why put equality columns before range columns?",
      "How does column order interact with ORDER BY?",
      "When is one composite index better than several single-column ones?",
    ],
    commonMistakes: [
      "Wrong column order for the dominant query",
      "Expecting non-leftmost columns to be seekable",
      "Creating many single-column indexes instead of one composite",
    ],
    bestPractices: [
      "Order columns: equality first, then range, by query pattern",
      "Design indexes around real query predicates",
      "Verify usage in the execution plan",
    ],
    relatedTech: ["B-tree index", "covering index", "query planner"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google"],
    related: ["covering-index", "index-not-used", "reading-execution-plan"],
  },
  {
    slug: "covering-index",
    categoryId: "sql",
    topic: "Indexes",
    question: "What is a covering index, and how does it eliminate table lookups?",
    tags: ["covering index", "index-only scan", "include", "performance"],
    shortAnswer:
      "A covering index contains every column a query needs (in the key or as INCLUDE columns), so the DB answers entirely from the index — an index-only scan, skipping the costly lookup back to the table (heap/clustered) for each row.",
    mindMap: [
      { type: "text", content: "Normally an index seek finds row IDs, then does a **table lookup** per row to fetch other columns. A **covering** index already has those columns → no lookup → much faster reads." },
    ],
    handsOn: {
      lang: "sql",
      code: `-- query: SELECT status, total FROM orders WHERE customer_id = ?
CREATE INDEX idx ON orders (customer_id) INCLUDE (status, total);
-- now an index-only scan; no table access needed`,
    },
    whatIf: {
      q: "Why not just add every column to a covering index?",
      a: "A wide index bloats storage, slows writes (every INSERT/UPDATE maintains it), and reduces how many entries fit per page. Cover only the hot, read-heavy queries — it's a targeted optimization, not a default.",
    },
    realWorld:
      "Covering indexes are a go-to fix for hot read endpoints (dashboards, lookups) — turning seek + N lookups into a single index-only scan, often a multiplicative speedup.",
    interviewerExpectation: ["index has all needed columns", "index-only scan / no table lookup", "INCLUDE columns", "write/storage trade-off"],
    followUps: [
      "Key columns vs INCLUDE columns — what's the difference?",
      "Why do covering indexes slow down writes?",
      "How do you confirm an index-only scan in the plan?",
    ],
    commonMistakes: [
      "Over-wide covering indexes hurting writes",
      "Covering rarely-run queries",
      "Putting INCLUDE columns in the key unnecessarily",
    ],
    bestPractices: [
      "Cover only hot read queries",
      "Use INCLUDE for non-search output columns",
      "Re-check write impact after adding",
    ],
    relatedTech: ["index-only scan", "INCLUDE columns", "clustered index"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["composite-index-leftmost-prefix", "clustered-vs-nonclustered-index"],
  },
  {
    slug: "acid-isolation-levels",
    categoryId: "sql",
    topic: "Transactions",
    question: "Explain ACID and the four transaction isolation levels — which is the default?",
    tags: ["acid", "isolation levels", "read committed", "serializable", "mvcc"],
    shortAnswer:
      "ACID = Atomicity, Consistency, Isolation, Durability. Isolation levels trade consistency for concurrency: READ UNCOMMITTED < READ COMMITTED < REPEATABLE READ < SERIALIZABLE. Most DBs default to READ COMMITTED (Postgres/Oracle/SQL Server); MySQL/InnoDB defaults to REPEATABLE READ.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "READ UNCOMMITTED", v: "dirty reads possible" },
          { k: "READ COMMITTED", v: "no dirty reads (common default)" },
          { k: "REPEATABLE READ", v: "no non-repeatable reads" },
          { k: "SERIALIZABLE", v: "fully isolated, lowest concurrency" },
        ],
      },
    ],
    whatIf: {
      q: "Higher isolation is 'safer' — why not always use SERIALIZABLE?",
      a: "SERIALIZABLE maximizes correctness but minimizes concurrency: it takes more locks (or aborts more transactions under MVCC), causing blocking, deadlocks, and serialization failures that you must retry. You pick the lowest level that prevents the anomalies your workload actually cares about.",
    },
    realWorld:
      "Most OLTP runs at READ COMMITTED and adds explicit locking (SELECT ... FOR UPDATE) or optimistic versioning only where needed — rather than globally raising isolation and tanking throughput.",
    interviewerExpectation: ["ACID meaning", "four levels + anomalies prevented", "default per DB", "concurrency vs consistency trade-off", "MVCC"],
    followUps: [
      "Which anomalies does each level prevent?",
      "How does MVCC provide isolation without read locks?",
      "What is a serialization failure and how do you handle it?",
    ],
    commonMistakes: [
      "Defaulting to SERIALIZABLE everywhere",
      "Assuming all DBs share the same default",
      "Ignoring retry handling at high isolation",
    ],
    bestPractices: [
      "Use the lowest level that prevents your anomalies",
      "Add targeted locking/versioning where needed",
      "Retry on serialization failures",
    ],
    relatedTech: ["MVCC", "SELECT FOR UPDATE", "optimistic locking"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "banking"],
    related: ["read-phenomena", "optimistic-vs-pessimistic-locking", "db-deadlock"],
  },
  {
    slug: "read-phenomena",
    categoryId: "sql",
    topic: "Transactions",
    question: "Dirty read, non-repeatable read and phantom read — what are they and how do you prevent each?",
    tags: ["dirty read", "non-repeatable read", "phantom read", "isolation", "anomalies"],
    shortAnswer:
      "Dirty read = seeing another txn's uncommitted data (prevented by READ COMMITTED). Non-repeatable read = same row returns different values within a txn (prevented by REPEATABLE READ). Phantom read = new rows appear for a re-run range query (prevented by SERIALIZABLE).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Dirty read", v: "reads uncommitted data → READ COMMITTED" },
          { k: "Non-repeatable", v: "row value changes → REPEATABLE READ" },
          { k: "Phantom", v: "new rows in range → SERIALIZABLE" },
        ],
      },
    ],
    whatIf: {
      q: "A balance check then debit double-spends under load — which anomaly, and the fix?",
      a: "A read-then-write race (often a phantom/non-repeatable issue). Fix with SELECT ... FOR UPDATE to lock the row during the transaction, or optimistic locking with a version check, rather than just raising the global isolation level.",
    },
    realWorld:
      "These anomalies underlie real money bugs (double-spend, oversell). Engineers pick the isolation level — or explicit locking — that blocks the specific anomaly their invariant needs.",
    interviewerExpectation: ["define all three", "which level prevents which", "read-then-write race", "FOR UPDATE / optimistic locking", "MVCC nuance"],
    followUps: [
      "How does MVCC handle non-repeatable reads without locks?",
      "What's a write skew and which level prevents it?",
      "When do you reach for SELECT FOR UPDATE?",
    ],
    commonMistakes: [
      "Confusing non-repeatable read with phantom read",
      "Relying on app logic for read-then-write safety",
      "Assuming default isolation prevents all anomalies",
    ],
    bestPractices: [
      "Lock or version read-then-write critical sections",
      "Match isolation to the invariant you must protect",
      "Test concurrency paths under load",
    ],
    relatedTech: ["MVCC", "SELECT FOR UPDATE", "@Version (JPA)"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "banking", "Deloitte"],
    related: ["acid-isolation-levels", "optimistic-vs-pessimistic-locking"],
  },
  {
    slug: "n-plus-one-query",
    categoryId: "sql",
    topic: "Optimization",
    question: "What is the N+1 query problem, and how do you fix it in an ORM?",
    tags: ["n+1", "orm", "hibernate", "lazy loading", "join fetch", "batch"],
    shortAnswer:
      "N+1 = one query loads N parents, then the ORM fires one more query per parent to load its children (1 + N). Fix with a JOIN FETCH / eager join, an IN-clause batch fetch (@BatchSize), or an entity graph — turning N+1 round-trips into 1–2 queries.",
    mindMap: [
      { type: "text", content: "Loop over 100 orders, touch `order.getItems()` → 1 query for orders + 100 lazy queries for items = **101 round-trips**. Fetch the children in the same query instead." },
    ],
    handsOn: {
      lang: "sql",
      code: `-- N+1 (lazy): SELECT * FROM orders;  then per order:
--             SELECT * FROM items WHERE order_id = ?
-- Fix: one query
SELECT * FROM orders o JOIN items i ON i.order_id = o.id;`,
    },
    whatIf: {
      q: "An endpoint is fast in dev (10 rows) but times out in prod (10k rows) — likely cause?",
      a: "Classic N+1: it scales with row count, so it's invisible on small dev data but explodes in prod. Detect it by logging SQL counts per request, then fix with JOIN FETCH / batch fetching / entity graph.",
    },
    realWorld:
      "N+1 is the #1 ORM performance bug. Teams catch it by asserting query counts in tests and watching SQL logs; the cure is fetch-joins or batch sizing, not turning off lazy loading globally.",
    interviewerExpectation: ["1 + N queries", "lazy loading cause", "JOIN FETCH / @BatchSize / entity graph", "scales with row count", "detect via query count"],
    followUps: [
      "JOIN FETCH vs @BatchSize vs entity graph — trade-offs?",
      "Why can JOIN FETCH with pagination be dangerous?",
      "How do you assert query count in tests?",
    ],
    commonMistakes: [
      "Eager-loading everything to 'fix' N+1 (over-fetch)",
      "Not noticing N+1 until prod load",
      "JOIN FETCH a collection with LIMIT (in-memory pagination)",
    ],
    bestPractices: [
      "Fetch what you need with JOIN FETCH / entity graphs",
      "Use @BatchSize for collections",
      "Assert SQL query counts in integration tests",
    ],
    relatedTech: ["Hibernate", "JPA entity graph", "@BatchSize", "p6spy"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Cognizant", "Accenture"],
    related: ["reading-execution-plan", "keyset-vs-offset-pagination"],
  },
  {
    slug: "clustered-vs-nonclustered-index",
    categoryId: "sql",
    topic: "Indexes",
    question: "Clustered vs non-clustered index — how do they physically differ?",
    tags: ["clustered index", "non-clustered index", "primary key", "heap", "lookup"],
    shortAnswer:
      "A clustered index defines the physical row order on disk — one per table (often the PK). A non-clustered index is a separate structure pointing back to rows (via the clustered key or row id). Non-clustered lookups may need a second hop to the clustered index ('key lookup').",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Clustered", v: "row data sorted by this key (1 per table)" },
          { k: "Non-clustered", v: "separate index → pointer to row (many)" },
          { k: "Key lookup", v: "non-clustered → clustered to fetch columns" },
        ],
      },
    ],
    whatIf: {
      q: "Why can a random UUID clustered primary key hurt insert performance?",
      a: "A clustered index keeps rows in key order. Random UUIDs insert all over the index, causing page splits and fragmentation, whereas a monotonic key (auto-increment / sequential UUID) appends to the end. That's why many teams use sequential/ULID keys for clustered PKs.",
    },
    realWorld:
      "Choosing the clustered key (usually the PK) affects insert patterns, range-scan speed, and fragmentation; the 'random UUID clustered PK' anti-pattern is a well-known write-performance pitfall.",
    interviewerExpectation: ["clustered = physical order, 1/table", "non-clustered = pointer, many", "key lookup hop", "monotonic vs random key inserts"],
    followUps: [
      "How does the clustered key choice affect range queries?",
      "Why are sequential/ULID keys friendlier than random UUIDs?",
      "How does InnoDB use the PK as the clustered index?",
    ],
    commonMistakes: [
      "Random UUID as a clustered PK (fragmentation)",
      "Too many non-clustered indexes (write cost)",
      "Ignoring key-lookup cost on wide queries",
    ],
    bestPractices: [
      "Prefer monotonic clustered keys for write-heavy tables",
      "Cover hot queries to avoid key lookups",
      "Limit redundant non-clustered indexes",
    ],
    relatedTech: ["InnoDB", "page splits", "ULID", "covering index"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Oracle-shops"],
    related: ["covering-index", "primary-unique-foreign-key"],
  },
  {
    slug: "window-functions",
    categoryId: "sql",
    topic: "Window Functions",
    question: "What problems do window functions solve that GROUP BY can't?",
    tags: ["window functions", "row_number", "rank", "partition by", "running total"],
    shortAnswer:
      "Window functions compute across a set of rows WITHOUT collapsing them — so you keep every row AND get aggregates/rankings. ROW_NUMBER/RANK for top-N-per-group, SUM() OVER for running totals, LAG/LEAD for row-to-row comparisons. GROUP BY would collapse the detail.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "ROW_NUMBER/RANK", v: "top-N per group, dedup" },
          { k: "SUM() OVER", v: "running totals" },
          { k: "LAG/LEAD", v: "compare to prev/next row" },
        ],
      },
    ],
    handsOn: {
      lang: "sql",
      code: `-- latest order per customer
SELECT * FROM (
  SELECT *, ROW_NUMBER() OVER (
    PARTITION BY customer_id ORDER BY created_at DESC) rn
  FROM orders
) t WHERE rn = 1;`,
    },
    whatIf: {
      q: "How would you get the top 3 highest-paid employees PER department in one query?",
      a: "RANK()/ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) in a subquery/CTE, then filter rank <= 3. GROUP BY can't do this — it would collapse each department to one row and lose the individual employees.",
    },
    realWorld:
      "Top-N-per-group, running totals, period-over-period deltas, and de-duplication ('keep the latest row per key') are everyday reporting tasks that window functions express cleanly and efficiently.",
    interviewerExpectation: ["keep rows vs collapse", "PARTITION BY/ORDER BY", "ROW_NUMBER/RANK/DENSE_RANK", "running totals", "LAG/LEAD", "top-N-per-group"],
    followUps: [
      "ROW_NUMBER vs RANK vs DENSE_RANK?",
      "How do frames (ROWS BETWEEN) change a running total?",
      "How do you deduplicate keeping the latest row?",
    ],
    commonMistakes: [
      "Using GROUP BY where you must keep detail rows",
      "Self-joins for top-N instead of window functions",
      "Confusing RANK gaps with DENSE_RANK",
    ],
    bestPractices: [
      "Use ROW_NUMBER for top-N-per-group / dedup",
      "Use SUM() OVER for running totals",
      "Index the PARTITION/ORDER columns",
    ],
    relatedTech: ["CTEs", "PARTITION BY", "analytic functions"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft", "Deloitte"],
    related: ["where-vs-having", "keyset-vs-offset-pagination"],
  },
  {
    slug: "keyset-vs-offset-pagination",
    categoryId: "sql",
    topic: "Optimization",
    question: "Why is OFFSET pagination slow at scale, and how does keyset (cursor) pagination fix it?",
    tags: ["pagination", "offset", "keyset", "cursor", "performance", "scalability"],
    shortAnswer:
      "OFFSET N must scan and discard N rows before returning the page, so deep pages get linearly slower (page 10,000 scans 200k rows). Keyset pagination uses WHERE (sort_key) > last_seen + LIMIT, seeking directly via an index — constant time regardless of depth.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "OFFSET 100000 LIMIT 20", v: "scans 100020 rows, drops 100000" },
          { k: "Keyset", v: "WHERE id > :last LIMIT 20 — index seek" },
          { k: "Result", v: "O(page) vs O(offset+page)" },
        ],
      },
    ],
    handsOn: {
      lang: "sql",
      code: `-- slow deep page
SELECT * FROM orders ORDER BY id LIMIT 20 OFFSET 100000;
-- keyset: pass the last id from the previous page
SELECT * FROM orders WHERE id > 100000 ORDER BY id LIMIT 20;`,
    },
    whatIf: {
      q: "What's the trade-off of keyset pagination vs OFFSET?",
      a: "Keyset can't jump to an arbitrary page number and needs a stable, indexed sort key (often a tiebreaker like id). But it's vastly faster for infinite scroll / 'next page' and avoids missing/duplicate rows when data shifts between page loads.",
    },
    realWorld:
      "Infinite-scroll feeds and large admin tables use keyset/cursor pagination (it's what most APIs' 'next cursor' is) precisely because OFFSET collapses on deep pages.",
    interviewerExpectation: ["OFFSET scans+discards", "deep pages O(offset)", "keyset uses index seek", "needs stable sort key", "no random page jump"],
    followUps: [
      "How do you make keyset stable with non-unique sort columns?",
      "Why can OFFSET pagination skip/duplicate rows on live data?",
      "How do API cursors encode the keyset?",
    ],
    commonMistakes: [
      "OFFSET for deep pagination on big tables",
      "Keyset without a unique tiebreaker",
      "Not indexing the sort key",
    ],
    bestPractices: [
      "Use keyset/cursor pagination for large datasets",
      "Sort by an indexed, unique (or tie-broken) key",
      "Expose an opaque cursor in APIs",
    ],
    relatedTech: ["cursor pagination", "composite index", "REST/GraphQL cursors"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["composite-index-leftmost-prefix", "window-functions"],
  },
  {
    slug: "optimistic-vs-pessimistic-locking",
    categoryId: "sql",
    topic: "Transactions",
    question: "Optimistic vs pessimistic locking — which do you use for concurrent updates?",
    tags: ["optimistic locking", "pessimistic locking", "version", "select for update", "concurrency"],
    shortAnswer:
      "Optimistic: no lock; a version/timestamp column is checked on UPDATE and the txn retries if it changed (great for low-contention, high-read). Pessimistic: SELECT ... FOR UPDATE locks the row up front (best for high-contention hotspots), at the cost of blocking and deadlock risk.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Optimistic", v: "version check on write, retry on conflict" },
          { k: "Pessimistic", v: "FOR UPDATE locks the row now" },
          { k: "Pick", v: "low contention → optimistic; hot row → pessimistic" },
        ],
      },
    ],
    handsOn: {
      lang: "sql",
      code: `-- optimistic
UPDATE account SET balance = ?, version = version + 1
WHERE id = ? AND version = ?;   -- 0 rows updated → conflict, retry

-- pessimistic
SELECT balance FROM account WHERE id = ? FOR UPDATE;`,
    },
    whatIf: {
      q: "A single 'hot' inventory row gets thousands of concurrent decrements — optimistic or pessimistic?",
      a: "On a hot row, optimistic locking causes a storm of version conflicts and retries (livelock-ish). Pessimistic FOR UPDATE (or an atomic UPDATE ... SET qty = qty - 1 WHERE qty > 0) serializes access cleanly — better for high contention.",
    },
    realWorld:
      "JPA's @Version implements optimistic locking — the default for most entities; pessimistic FOR UPDATE is reserved for genuine hotspots like inventory/seat booking where conflicts are frequent.",
    interviewerExpectation: ["version-check + retry", "FOR UPDATE locks", "contention drives the choice", "@Version", "atomic UPDATE alternative"],
    followUps: [
      "How does JPA @Version detect conflicts?",
      "Why can pessimistic locking deadlock?",
      "When is a single atomic UPDATE better than either?",
    ],
    commonMistakes: [
      "Optimistic locking on a high-contention hot row",
      "Pessimistic locks held across long/external calls",
      "No retry handling for optimistic conflicts",
    ],
    bestPractices: [
      "Optimistic for low-contention; pessimistic for hotspots",
      "Keep pessimistic locks short",
      "Prefer atomic conditional UPDATEs where possible",
    ],
    relatedTech: ["JPA @Version", "SELECT FOR UPDATE", "MVCC"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "banking", "Deloitte"],
    related: ["read-phenomena", "db-deadlock", "acid-isolation-levels"],
  },

  // ---------------------------------------------------------------- Hard (6)
  {
    slug: "index-not-used",
    categoryId: "sql",
    topic: "Optimization",
    question: "An index exists but the query still does a full scan — what are the likely reasons?",
    tags: ["index", "full scan", "sargable", "selectivity", "implicit cast", "statistics"],
    shortAnswer:
      "Common causes: a non-SARGable predicate (function/expression on the column, leading-wildcard LIKE), an implicit type cast (string vs number), low selectivity (the optimizer judges a scan cheaper), stale statistics, or the column isn't the index's leftmost prefix.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Function on column", v: "WHERE UPPER(x)=? → not SARGable" },
          { k: "Implicit cast", v: "col = '123' on a numeric col" },
          { k: "Low selectivity", v: "scan cheaper than many seeks" },
          { k: "Stale stats", v: "bad row estimates" },
        ],
      },
    ],
    handsOn: {
      lang: "sql",
      code: `-- NOT SARGable (index unused)
WHERE YEAR(created_at) = 2026;
-- SARGable rewrite (index used)
WHERE created_at >= '2026-01-01' AND created_at < '2027-01-01';`,
    },
    whatIf: {
      q: "WHERE phone = 9876543210 ignores the index on a VARCHAR phone column — why?",
      a: "Type mismatch: comparing a VARCHAR column to a numeric literal forces an implicit cast on the column, making the predicate non-SARGable so the index can't seek. Quote the literal ('9876543210') to match the column type.",
    },
    realWorld:
      "Wrapping a column in a function (YEAR(), UPPER()) or an accidental type mismatch silently disables an index — a top cause of 'we have an index but it's still slow' tickets.",
    interviewerExpectation: ["SARGable predicates", "function/expression on column", "implicit cast", "selectivity", "stale stats", "leftmost prefix"],
    followUps: [
      "What does SARGable mean?",
      "How do function-based indexes help when you must use a function?",
      "How does selectivity drive the optimizer's choice?",
    ],
    commonMistakes: [
      "Wrapping indexed columns in functions",
      "Type mismatches forcing casts",
      "Assuming an index guarantees it'll be used",
    ],
    bestPractices: [
      "Keep predicates SARGable (no function on the column)",
      "Match literal types to columns",
      "Use function-based/expression indexes when needed; keep stats fresh",
    ],
    relatedTech: ["function-based index", "statistics", "query planner"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Oracle-shops", "Google"],
    related: ["reading-execution-plan", "composite-index-leftmost-prefix", "slow-query-diagnosis"],
  },
  {
    slug: "db-deadlock",
    categoryId: "sql",
    topic: "Transactions",
    question: "What causes database deadlocks, and how do you prevent them in a busy OLTP system?",
    tags: ["deadlock", "lock ordering", "transaction", "oltp", "production"],
    shortAnswer:
      "Two transactions acquire the same rows/locks in opposite order and wait on each other; the DB detects the cycle and kills one (deadlock victim). Prevent with a consistent lock/update order, short transactions, the right indexes (to lock fewer rows), and retry logic on the victim.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Cause", v: "opposite lock-acquisition order" },
          { k: "DB action", v: "detect cycle → kill a victim" },
          { k: "Prevent", v: "consistent order, short txns, good indexes" },
          { k: "Handle", v: "catch + retry the victim" },
        ],
      },
    ],
    whatIf: {
      q: "Why can a MISSING index actually cause more deadlocks?",
      a: "Without a good index, a query scans and locks far more rows (or escalates to range/table locks), widening the window for lock conflicts. Adding the right index narrows locking to the exact rows, reducing both contention and deadlocks.",
    },
    realWorld:
      "OLTP deadlocks (order/inventory/ledger) are routine under load; the durable fixes are consistent update ordering, keeping transactions short, indexing to lock fewer rows, and idempotent retry on the deadlock victim.",
    interviewerExpectation: ["opposite-order lock cycle", "victim selection", "consistent ordering", "short txns + indexes reduce locking", "retry the victim"],
    followUps: [
      "How do you read a deadlock graph / log?",
      "Why do shorter transactions reduce deadlocks?",
      "How does lock escalation contribute?",
    ],
    commonMistakes: [
      "Updating rows in inconsistent order across code paths",
      "Long transactions holding locks across external calls",
      "No retry on the deadlock victim",
    ],
    bestPractices: [
      "Acquire/update rows in a consistent order",
      "Keep transactions short; index to lock fewer rows",
      "Implement idempotent retry on deadlock errors",
    ],
    relatedTech: ["deadlock graph", "lock escalation", "retry/backoff"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "banking", "Deloitte"],
    related: ["optimistic-vs-pessimistic-locking", "acid-isolation-levels", "index-not-used"],
  },
  {
    slug: "slow-query-diagnosis",
    categoryId: "sql",
    topic: "Optimization",
    question: "Walk me through diagnosing a slow query in production.",
    tags: ["slow query", "diagnosis", "explain analyze", "slow query log", "production"],
    shortAnswer:
      "Find it (slow-query log / pg_stat_statements / APM), reproduce with EXPLAIN ANALYZE, identify the costly node (full scan, bad join, sort/spill), check indexes + statistics + the estimated-vs-actual gap, then fix: add/fix index, rewrite SARGable predicates, update stats, or reduce returned data. Verify p95/p99 after.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "1. Find", v: "slow log / pg_stat_statements / APM" },
          { k: "2. Explain", v: "EXPLAIN ANALYZE the real query" },
          { k: "3. Diagnose", v: "scan? bad join? sort spill? stats?" },
          { k: "4. Fix + verify", v: "index/rewrite/stats → re-measure" },
        ],
      },
    ],
    whatIf: {
      q: "The query is fast in isolation but slow only in production — what else do you check?",
      a: "Look beyond the plan: parameter-sniffing/plan-cache issues, lock contention/blocking (it's waiting, not running), connection-pool saturation, cold cache vs warm, and data volume/skew differences. 'Slow' in prod is often waiting, not executing.",
    },
    realWorld:
      "pg_stat_statements / the slow-query log surfaces the worst offenders by total time; the fix is usually an index, a SARGable rewrite, or fresher statistics — validated by p99 latency, not a one-off run.",
    interviewerExpectation: ["find via slow log/pg_stat_statements", "EXPLAIN ANALYZE", "scan/join/sort diagnosis", "stats + estimate gap", "consider waiting/locking/pool", "verify p99"],
    followUps: [
      "How do you find the worst queries by total impact?",
      "How do you tell 'slow executing' from 'slow waiting'?",
      "What is parameter sniffing and how do you handle it?",
    ],
    commonMistakes: [
      "Optimizing a single run, not aggregate impact",
      "Ignoring lock waits / pool saturation",
      "Not re-measuring p99 after the change",
    ],
    bestPractices: [
      "Prioritize by total time (pg_stat_statements)",
      "Separate execution time from wait time",
      "Validate with percentiles after the fix",
    ],
    relatedTech: ["pg_stat_statements", "slow query log", "APM", "EXPLAIN ANALYZE"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "Deloitte"],
    related: ["reading-execution-plan", "index-not-used", "connection-pool-exhaustion"],
  },
  {
    slug: "normalization-denormalization",
    categoryId: "sql",
    topic: "Normalization",
    question: "When do you deliberately denormalize, and what are the trade-offs?",
    tags: ["normalization", "denormalization", "schema design", "read performance"],
    shortAnswer:
      "Normalize by default (3NF) to avoid update anomalies and redundancy. Denormalize selectively for read-heavy hotspots — duplicating/precomputing data (totals, counts, flattened views) to avoid expensive joins — accepting that you must now keep the copies in sync on writes.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Normalized (3NF)", v: "no redundancy, write-safe, more joins" },
          { k: "Denormalized", v: "fewer joins, faster reads, sync burden" },
          { k: "Trade", v: "read speed vs write complexity/consistency" },
        ],
      },
    ],
    whatIf: {
      q: "A dashboard joins 6 tables and is too slow even with indexes — denormalize how?",
      a: "Precompute the result: a summary/rollup table or materialized view refreshed on a schedule (or maintained via triggers/events). Reads hit one table; the cost moves to keeping the rollup current — a deliberate read/write trade.",
    },
    realWorld:
      "Reporting/read-heavy paths use materialized views, summary tables, and cached counters; the discipline is denormalize only proven hotspots and own the consistency story (refresh strategy).",
    interviewerExpectation: ["normalize by default", "denormalize hot reads", "update/insert anomalies", "materialized views/summary tables", "consistency/sync cost"],
    followUps: [
      "How do you keep denormalized data in sync?",
      "Materialized view vs trigger-maintained summary — trade-offs?",
      "What anomalies does 3NF prevent?",
    ],
    commonMistakes: [
      "Denormalizing prematurely (everywhere)",
      "Denormalizing without a sync/refresh plan",
      "Over-normalizing read-critical paths",
    ],
    bestPractices: [
      "Normalize first; denormalize measured hotspots",
      "Own the consistency strategy for copies",
      "Use materialized views for heavy aggregates",
    ],
    relatedTech: ["materialized views", "triggers", "CQRS read models"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "Deloitte"],
    related: ["primary-unique-foreign-key", "large-table-partitioning"],
  },
  {
    slug: "connection-pool-exhaustion",
    categoryId: "sql",
    topic: "Optimization",
    question: "What causes database connection-pool exhaustion, and how do you fix it?",
    tags: ["connection pool", "hikaricp", "leak", "timeout", "production"],
    shortAnswer:
      "The pool runs out when connections are held too long (slow queries, long transactions, external calls inside a txn) or leaked (not closed). Symptoms: 'connection timeout' waits. Fix: right-size the pool, shorten transactions, never call remote services while holding a connection, and use try-with-resources + leak detection.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Causes", v: "leaks, long txns, slow queries, blocking calls" },
          { k: "Symptom", v: "pool timeout waiting for a connection" },
          { k: "Fix", v: "close (try-with-resources), short txns, size pool" },
        ],
      },
    ],
    whatIf: {
      q: "Is the fix usually to just increase the pool size?",
      a: "Rarely. A bigger pool can overwhelm the DB (each connection costs DB memory/CPU) and only masks the real issue: connections held too long. Fix the holding time (slow queries, transactions spanning HTTP calls, leaks) first; size the pool to the DB's capacity.",
    },
    realWorld:
      "HikariCP timeouts under load almost always trace to leaked connections or transactions that wrap a slow downstream call; the durable fix is reducing hold time, not inflating the pool.",
    interviewerExpectation: ["hold-time/leak causes", "timeout symptom", "don't just enlarge pool", "try-with-resources + leak detection", "no remote calls inside txn"],
    followUps: [
      "Why can a bigger pool make things worse?",
      "How does HikariCP leakDetectionThreshold help?",
      "Why is calling an API inside a DB transaction dangerous?",
    ],
    commonMistakes: [
      "Increasing pool size as the first fix",
      "Holding a connection across external/HTTP calls",
      "Leaking connections (no try-with-resources)",
    ],
    bestPractices: [
      "Acquire connections in try-with-resources",
      "Keep transactions short; no remote calls inside",
      "Size the pool to DB capacity; enable leak detection",
    ],
    relatedTech: ["HikariCP", "try-with-resources", "Spring @Transactional"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Wipro"],
    related: ["slow-query-diagnosis", "db-deadlock"],
  },
  {
    slug: "large-table-partitioning",
    categoryId: "sql",
    topic: "Optimization",
    question: "How do you keep queries fast on a table with billions of rows?",
    tags: ["partitioning", "archiving", "large table", "scalability", "sharding"],
    shortAnswer:
      "Use partitioning (range by date / hash by key) so queries prune to one partition and old data is dropped cheaply; archive/purge cold data; index for the dominant access pattern; consider summary tables for aggregates; and shard across nodes only when a single DB can't keep up.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Partitioning", v: "prune to relevant partition (date/hash)" },
          { k: "Archiving", v: "move/drop cold data; DROP PARTITION is fast" },
          { k: "Indexes", v: "tuned to dominant queries" },
          { k: "Sharding", v: "scale-out when one node isn't enough" },
        ],
      },
    ],
    whatIf: {
      q: "Why is dropping old data via partitions far better than DELETE on a huge table?",
      a: "DROP/TRUNCATE PARTITION removes a whole chunk as a metadata operation — near-instant, minimal logging, no bloat. A DELETE on billions of rows logs every row, holds locks, and leaves dead tuples needing vacuum/rebuild. Date-range partitioning makes retention a one-line drop.",
    },
    realWorld:
      "Time-series / event / audit tables are range-partitioned by date so reads prune to recent partitions and retention is enforced by dropping old partitions — standard practice at scale before reaching for sharding.",
    interviewerExpectation: ["partition pruning", "range vs hash partitioning", "DROP PARTITION for retention", "index for access pattern", "shard as last resort"],
    followUps: [
      "Range vs hash vs list partitioning — when each?",
      "What is partition pruning and how does the planner use it?",
      "When do you move from partitioning to sharding?",
    ],
    commonMistakes: [
      "DELETE-ing huge ranges instead of dropping partitions",
      "Partition key that doesn't match query filters (no pruning)",
      "Sharding prematurely before partitioning/indexing",
    ],
    bestPractices: [
      "Partition on the dominant filter (often date)",
      "Use DROP PARTITION for retention",
      "Exhaust partitioning/indexing before sharding",
    ],
    relatedTech: ["table partitioning", "sharding", "materialized views", "time-series DBs"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["normalization-denormalization", "delete-truncate-drop", "slow-query-diagnosis"],
  },
];
