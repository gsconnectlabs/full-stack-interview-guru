import type { Question } from "../types";

/**
 * System Design — flagship expansion batch (20 questions), the final flagship set.
 * Enterprise & product-company patterns: scaling, caching, sharding, consistency,
 * messaging, and full design questions (feed, search, chat, notifications, payments)
 * plus capacity estimation and probabilistic structures.
 *
 * Difficulty mix: 4 Easy · 10 Medium · 6 Hard. Ordered easy → hard.
 */
export const systemDesignExtra: Question[] = [
  // ---------------------------------------------------------------- Easy (4)
  {
    slug: "horizontal-vs-vertical-scaling",
    categoryId: "system-design",
    topic: "Scaling",
    question: "Horizontal vs vertical scaling — which do you reach for and why?",
    tags: ["horizontal scaling", "vertical scaling", "scale out", "scale up"],
    shortAnswer:
      "Vertical (scale up) = bigger machine: simple but capped by hardware and a single point of failure. Horizontal (scale out) = more machines behind a load balancer: near-limitless and fault-tolerant, but needs stateless services and distributed coordination. Prefer horizontal for web tiers; vertical is a quick stopgap.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Vertical", v: "bigger box — simple, capped, SPOF" },
          { k: "Horizontal", v: "more boxes — scales far, fault-tolerant" },
          { k: "Needs", v: "stateless services for horizontal" },
        ],
      },
    ],
    whatIf: {
      q: "What must be true about your app before you can scale it horizontally?",
      a: "It must be stateless (or externalize state to a shared store/DB), so any instance can handle any request behind a load balancer. If it keeps session/data in instance memory, you're stuck with sticky sessions and can't scale out cleanly.",
    },
    realWorld:
      "Web tiers scale horizontally (stateless + LB + autoscaling); databases often scale vertically first, then shard. Vertical scaling buys time but hits a ceiling and leaves a single point of failure.",
    interviewerExpectation: ["up vs out", "vertical SPOF/cap", "horizontal needs stateless", "load balancer", "cost/fault-tolerance trade-off"],
    followUps: [
      "Why is statelessness required for horizontal scaling?",
      "When do you scale the database differently from the app?",
      "What are the limits of vertical scaling?",
    ],
    commonMistakes: [
      "Assuming you can scale out a stateful app",
      "Vertical scaling as a permanent solution",
      "Ignoring the DB as the real bottleneck",
    ],
    bestPractices: [
      "Keep app tiers stateless; scale out",
      "Externalize state to shared stores",
      "Plan DB scaling (replicas/shards) separately",
    ],
    relatedTech: ["load balancer", "autoscaling", "stateless services"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "TCS", "Accenture"],
    related: ["load-balancing-basics", "database-sharding"],
  },
  {
    slug: "load-balancing-basics",
    categoryId: "system-design",
    topic: "Load Balancing",
    question: "How does a load balancer distribute traffic, and what algorithms are common?",
    tags: ["load balancing", "round robin", "least connections", "l4 l7", "health checks"],
    shortAnswer:
      "A load balancer spreads requests across healthy backends and removes failed ones via health checks. Common algorithms: round-robin, least-connections, and consistent-hashing (sticky by key). L4 balances by TCP/IP (fast), L7 by HTTP content (path/host routing).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Round-robin", v: "even rotation" },
          { k: "Least-connections", v: "to the least-busy backend" },
          { k: "Hash/sticky", v: "same client/key → same backend" },
          { k: "L4 vs L7", v: "TCP fast / HTTP content routing" },
        ],
      },
    ],
    whatIf: {
      q: "Why are health checks essential to a load balancer?",
      a: "Without them the LB keeps sending traffic to dead/unhealthy instances, so users get errors. Health checks let the LB detect failures and route only to healthy targets — the core of self-healing and zero-downtime deploys.",
    },
    realWorld:
      "L7 load balancers (ALB/Nginx) do path/host routing and TLS termination; least-connections suits uneven request costs. Health checks + connection draining make deploys and failures invisible to users.",
    interviewerExpectation: ["distribute + health check", "round-robin/least-conn/hash", "L4 vs L7", "sticky sessions trade-off", "removes unhealthy"],
    followUps: [
      "When do you need sticky sessions (and why avoid them)?",
      "L4 vs L7 — trade-offs?",
      "How does the LB itself avoid being a SPOF?",
    ],
    commonMistakes: [
      "No/weak health checks",
      "Sticky sessions defeating even distribution",
      "Single LB as a SPOF",
    ],
    bestPractices: [
      "Health checks + connection draining",
      "Pick the algorithm to match request cost",
      "Run the LB redundantly",
    ],
    relatedTech: ["ALB/Nginx", "consistent hashing", "health checks"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "Cognizant", "Wipro"],
    related: ["horizontal-vs-vertical-scaling", "consistent-hashing"],
  },
  {
    slug: "caching-strategies",
    categoryId: "system-design",
    topic: "Caching",
    question: "Where do you add caching, and what are the common caching patterns?",
    tags: ["caching", "cache-aside", "write-through", "ttl", "invalidation"],
    shortAnswer:
      "Cache at multiple layers (browser/CDN, app, DB). Patterns: cache-aside (app loads on miss, most common), write-through (write cache+DB together), write-behind (async). Always set a TTL and a sensible eviction policy (LRU) — and remember cache invalidation is the hard part.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Cache-aside", v: "load on miss, app-managed (common)" },
          { k: "Write-through", v: "write cache + DB together" },
          { k: "Write-behind", v: "write cache, flush to DB async" },
          { k: "Always", v: "TTL + eviction (LRU)" },
        ],
      },
    ],
    whatIf: {
      q: "What is a cache stampede, and how do you prevent it?",
      a: "When a hot key expires, many requests miss simultaneously and all hit the DB at once (thundering herd). Prevent it with request coalescing (single flight — one loader, others wait), slightly randomized TTLs (jitter), or serving stale-while-revalidate.",
    },
    realWorld:
      "Cache-aside with Redis is the default; the classic incidents are stale data (bad invalidation) and cache stampedes on hot keys — solved with TTL jitter and single-flight loading.",
    interviewerExpectation: ["cache-aside/write-through/behind", "TTL + eviction", "invalidation is hard", "stampede/thundering herd", "multi-layer caching"],
    followUps: [
      "Cache-aside vs write-through — trade-offs?",
      "How do you keep the cache consistent with the DB?",
      "What is stale-while-revalidate?",
    ],
    commonMistakes: [
      "No TTL (stale forever)",
      "No stampede protection on hot keys",
      "Caching data that must be strongly consistent",
    ],
    bestPractices: [
      "Cache-aside + TTL with jitter",
      "Single-flight loading for hot keys",
      "Plan invalidation explicitly",
    ],
    relatedTech: ["Redis", "CDN", "Caffeine", "stale-while-revalidate"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["cdn-content-delivery", "hot-key-problem", "design-distributed-cache"],
  },
  {
    slug: "cap-theorem",
    categoryId: "system-design",
    topic: "CAP Theorem",
    question: "Explain the CAP theorem and how it guides real design decisions.",
    tags: ["cap theorem", "consistency", "availability", "partition tolerance"],
    shortAnswer:
      "In a distributed system you can't have all three of Consistency, Availability, Partition-tolerance during a network partition — and partitions WILL happen, so you must choose C or A when one occurs. CP systems reject requests to stay consistent; AP systems stay available and reconcile later (eventual consistency).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Partition happens", v: "network split is inevitable" },
          { k: "CP", v: "stay consistent, reject some requests" },
          { k: "AP", v: "stay available, eventual consistency" },
          { k: "Choice", v: "per operation, not whole system" },
        ],
      },
    ],
    whatIf: {
      q: "Is CAP really 'pick 2 of 3'?",
      a: "Not quite — partition tolerance isn't optional in a distributed system (networks fail), so the real choice is C vs A during a partition. And it's per-operation: a payment might choose consistency (CP) while a 'likes' counter chooses availability (AP). PACELC extends it to the no-partition case (latency vs consistency).",
    },
    realWorld:
      "CAP frames concrete choices: a bank ledger leans CP (correctness over availability), a social feed leans AP (always up, eventually consistent). Mature designs pick per feature, not globally.",
    interviewerExpectation: ["partition inevitable", "C vs A during partition", "CP vs AP examples", "per-operation choice", "PACELC nuance"],
    followUps: [
      "Give a CP and an AP real-world example.",
      "What does PACELC add?",
      "Where does eventual consistency fit?",
    ],
    commonMistakes: [
      "Treating CAP as a static 'pick 2'",
      "Applying one choice to the whole system",
      "Ignoring that partitions are unavoidable",
    ],
    bestPractices: [
      "Choose C vs A per operation/feature",
      "Use CP for correctness-critical paths",
      "Use AP + eventual consistency for scale",
    ],
    relatedTech: ["PACELC", "quorum", "eventual consistency"],
    difficulty: "Easy",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["consistency-patterns", "database-sharding"],
  },

  // -------------------------------------------------------------- Medium (10)
  {
    slug: "database-sharding",
    categoryId: "system-design",
    topic: "Databases",
    question: "How does database sharding work, and what makes a good shard key?",
    tags: ["sharding", "partitioning", "shard key", "hotspot", "scaling"],
    shortAnswer:
      "Sharding splits data across independent databases by a shard key (hash or range), so each shard holds a subset — scaling writes/storage horizontally. A good shard key has high cardinality and even access; a bad one creates hotspots and forces cross-shard queries (which are slow and lose transactions).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Hash sharding", v: "even spread, no range scans" },
          { k: "Range sharding", v: "range scans, risk of hotspots" },
          { k: "Good key", v: "high cardinality, even access" },
          { k: "Cost", v: "cross-shard joins/txns are hard" },
        ],
      },
    ],
    whatIf: {
      q: "You shard orders by date and the current shard is overwhelmed — why?",
      a: "Range-by-date puts all NEW writes on the 'current' shard — a hotspot — while old shards sit idle. Shard by a high-cardinality key (customer_id hash) to spread writes evenly. Range sharding suits time-range reads but concentrates recent writes.",
    },
    realWorld:
      "Sharding is the last resort after replicas/caching; shard-key choice is the make-or-break decision — a bad key means hotspots, cross-shard fan-out, and painful resharding.",
    interviewerExpectation: ["split by shard key", "hash vs range", "high-cardinality even key", "hotspots", "cross-shard query/txn cost"],
    followUps: [
      "How do you handle cross-shard queries?",
      "How does resharding work without downtime?",
      "Hash vs range sharding trade-offs?",
    ],
    commonMistakes: [
      "Low-cardinality or time-based shard keys (hotspots)",
      "Frequent cross-shard joins",
      "Sharding before exhausting replicas/caching",
    ],
    bestPractices: [
      "Pick a high-cardinality, evenly-accessed key",
      "Avoid cross-shard transactions",
      "Plan for resharding (consistent hashing)",
    ],
    relatedTech: ["consistent hashing", "Vitess", "Citus", "read replicas"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["consistent-hashing", "read-write-scaling", "hot-key-problem"],
  },
  {
    slug: "consistent-hashing",
    categoryId: "system-design",
    topic: "Scaling",
    question: "What problem does consistent hashing solve, and how does it work?",
    tags: ["consistent hashing", "sharding", "rehashing", "virtual nodes", "distributed cache"],
    shortAnswer:
      "With plain hash-mod-N, adding/removing a node changes N and remaps almost ALL keys (cache-invalidating churn). Consistent hashing maps nodes and keys onto a ring; adding/removing a node only moves the keys in one arc (~1/N), minimizing remapping. Virtual nodes even out the distribution.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Problem", v: "hash%N remaps ~all keys on resize" },
          { k: "Ring", v: "nodes + keys on a hash ring" },
          { k: "Add/remove", v: "only ~1/N keys move" },
          { k: "Virtual nodes", v: "balance load across the ring" },
        ],
      },
    ],
    whatIf: {
      q: "Why does consistent hashing use virtual nodes?",
      a: "With few physical nodes on the ring, key distribution is uneven (some nodes own big arcs). Assigning each physical node many virtual points on the ring smooths the distribution and, on failure, spreads the departing node's keys across many others instead of dumping them on one neighbor.",
    },
    realWorld:
      "Consistent hashing powers distributed caches (Memcached/Redis clients), DynamoDB/Cassandra partitioning, and load balancers — anywhere you add/remove nodes without reshuffling everything.",
    interviewerExpectation: ["hash%N remap problem", "ring mapping", "~1/N keys move", "virtual nodes for balance", "cache/partition use cases"],
    followUps: [
      "How does it help a distributed cache on node failure?",
      "How do virtual nodes affect rebalancing?",
      "Where is it used in real systems (Dynamo/Cassandra)?",
    ],
    commonMistakes: [
      "Using hash%N for a scalable cache/cluster",
      "Too few virtual nodes (uneven load)",
      "Ignoring rebalancing on node changes",
    ],
    bestPractices: [
      "Use consistent hashing for elastic clusters",
      "Tune virtual-node count for balance",
      "Combine with replication for availability",
    ],
    relatedTech: ["Cassandra", "DynamoDB", "Memcached", "Ketama"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["database-sharding", "design-distributed-cache"],
  },
  {
    slug: "read-write-scaling",
    categoryId: "system-design",
    topic: "Databases",
    question: "How do you scale a read-heavy vs a write-heavy database workload?",
    tags: ["read replicas", "write scaling", "replication lag", "cqrs", "sharding"],
    shortAnswer:
      "Read-heavy: add read replicas / caching / CQRS read models (watch out for replication lag on read-after-write). Write-heavy: you can't replicate writes away — you shard/partition, batch, use write-optimized stores (LSM-tree DBs), or buffer via a queue. Reads scale by copying; writes scale by splitting.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Read-heavy", v: "replicas + cache + CQRS read models" },
          { k: "Write-heavy", v: "shard/partition, batch, queue" },
          { k: "Watch", v: "replica lag → stale reads" },
          { k: "Rule", v: "copy for reads, split for writes" },
        ],
      },
    ],
    whatIf: {
      q: "A user updates data then immediately reads it from a replica and sees the old value — fix?",
      a: "Replication lag causes stale read-after-write. Route the user's own subsequent reads to the primary (read-your-writes), or read from cache updated on write, until the replica catches up. Reading from a lagging replica right after a write is a classic bug.",
    },
    realWorld:
      "Most apps are read-heavy → replicas + caching handle it; genuine write-scaling forces sharding or write-optimized stores. Replication lag and read-your-writes are the recurring gotchas.",
    interviewerExpectation: ["reads: replicas/cache/CQRS", "writes: shard/batch/queue", "replication lag/read-your-writes", "LSM for write-heavy"],
    followUps: [
      "How do you handle read-after-write consistency?",
      "Why can't read replicas scale writes?",
      "What are LSM-tree databases good for?",
    ],
    commonMistakes: [
      "Expecting replicas to scale writes",
      "Reading from lagging replicas after a write",
      "Sharding before adding replicas/cache",
    ],
    bestPractices: [
      "Replicas + cache for reads",
      "Shard/queue/batch for writes",
      "Read-your-writes where consistency matters",
    ],
    relatedTech: ["read replicas", "Cassandra/LSM", "Kafka buffering", "CQRS"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["database-sharding", "consistency-patterns", "message-queues-async"],
  },
  {
    slug: "message-queues-async",
    categoryId: "system-design",
    topic: "Message Queues",
    question: "When do you introduce a message queue, and what does it buy you?",
    tags: ["message queue", "async", "decoupling", "backpressure", "buffering"],
    shortAnswer:
      "Add a queue to decouple producers from consumers, absorb traffic spikes (buffer/backpressure), smooth load, enable retries/DLQs, and do slow work (emails, image processing) off the request path. The cost is eventual consistency, ordering concerns, and more operational complexity.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Decouple", v: "producer/consumer independent" },
          { k: "Buffer", v: "absorb spikes, smooth load" },
          { k: "Reliability", v: "retries + DLQ" },
          { k: "Cost", v: "eventual consistency, ops complexity" },
        ],
      },
    ],
    whatIf: {
      q: "A signup triggers a slow welcome-email + analytics + provisioning — how do you keep signup fast?",
      a: "Do the minimum synchronously (create the user), then publish an event to a queue; consumers handle email/analytics/provisioning asynchronously. The user gets an instant response, and a slow downstream can't block or fail the signup. Retries/DLQ handle consumer failures.",
    },
    realWorld:
      "Queues (SQS/Kafka/RabbitMQ) move slow/spiky work off the request path and absorb load spikes; the trade-off is embracing eventual consistency and building idempotent consumers.",
    interviewerExpectation: ["decouple + buffer", "retries/DLQ", "off-request-path work", "backpressure", "eventual consistency cost"],
    followUps: [
      "Queue vs pub/sub — when each?",
      "How do you preserve ordering when needed?",
      "Why must consumers be idempotent?",
    ],
    commonMistakes: [
      "Adding a queue where a sync call is fine (complexity)",
      "No DLQ / retry strategy",
      "Assuming strict global ordering",
    ],
    bestPractices: [
      "Queue slow/spiky/off-path work",
      "Idempotent consumers + DLQs",
      "Bound queues for backpressure",
    ],
    relatedTech: ["Kafka", "SQS", "RabbitMQ", "DLQ"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["read-write-scaling", "design-notification-system"],
  },
  {
    slug: "rate-limiter-design",
    categoryId: "system-design",
    topic: "Scaling",
    question: "How would you design a distributed rate limiter?",
    tags: ["rate limiter", "token bucket", "sliding window", "redis", "distributed"],
    shortAnswer:
      "Use a token-bucket or sliding-window-log/counter algorithm, keyed per client, with counters in a shared low-latency store (Redis) so the limit is enforced globally across all app instances. Update atomically (Lua/INCR+EXPIRE), and decide fail-open vs fail-closed if the store is down.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Algorithm", v: "token bucket / sliding window" },
          { k: "State", v: "Redis (shared, atomic)" },
          { k: "Key", v: "per client/API key" },
          { k: "On store down", v: "fail-open vs fail-closed" },
        ],
      },
    ],
    whatIf: {
      q: "Why not just keep the counter in each app instance's memory?",
      a: "Per-instance counters let a client multiply the limit by the instance count and reset on deploys/scaling — the global limit isn't enforced. A shared atomic store (Redis) gives one consistent count across instances; the gateway is a common enforcement point.",
    },
    realWorld:
      "Distributed rate limiting lives at the gateway with Redis-backed counters and atomic Lua scripts; the design questions are algorithm choice (burst vs smoothness) and fail-open/closed behavior.",
    interviewerExpectation: ["token bucket vs sliding window", "shared atomic store (Redis)", "per-key global enforcement", "atomicity (Lua/INCR)", "fail-open/closed"],
    followUps: [
      "Token bucket vs sliding-window-log vs counter?",
      "Fail-open or fail-closed when Redis is down?",
      "How do you handle bursts vs sustained rate?",
    ],
    commonMistakes: [
      "Per-instance counters (limit multiplied)",
      "Non-atomic read-modify-write races",
      "No plan for the limiter store failing",
    ],
    bestPractices: [
      "Shared atomic counters (Redis Lua)",
      "Enforce at the gateway",
      "Choose algorithm for burst vs smoothness; decide fail mode",
    ],
    relatedTech: ["Redis", "token bucket", "API gateway", "Lua scripts"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["caching-strategies", "hot-key-problem"],
  },
  {
    slug: "design-notification-system",
    categoryId: "system-design",
    topic: "Message Queues",
    question: "How would you design a notification system (email / SMS / push) at scale?",
    tags: ["notifications", "fanout", "queue", "provider", "idempotency"],
    shortAnswer:
      "Accept notification requests via an API, enqueue them, and have workers fan out to channel providers (email/SMS/push) with retries, rate limits per provider, and a DLQ. Add user preferences/opt-outs, templating, idempotency (dedupe), and delivery tracking. Decouple everything with queues so spikes and provider outages don't cascade.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Ingest", v: "API → queue (decouple)" },
          { k: "Workers", v: "fan out per channel/provider" },
          { k: "Reliability", v: "retries, DLQ, provider rate limits" },
          { k: "Rules", v: "preferences/opt-out, idempotency, tracking" },
        ],
      },
    ],
    whatIf: {
      q: "A campaign sends 10M notifications and a provider starts rate-limiting you — what happens?",
      a: "The queue absorbs the backlog (backpressure) while workers respect the provider's rate limit and retry with backoff; failed sends go to a DLQ for inspection. Without the queue + rate-aware workers, you'd hammer the provider, get throttled/blocked, and drop notifications.",
    },
    realWorld:
      "Notification platforms are queue-driven fan-out with per-provider rate limits, retries/DLQ, user preferences, and dedup; the queue is what makes million-scale bursts and provider hiccups survivable.",
    interviewerExpectation: ["API → queue → workers fan-out", "retries/DLQ", "per-provider rate limits", "preferences/opt-out", "idempotency + tracking"],
    followUps: [
      "How do you dedupe / ensure idempotent sends?",
      "How do you handle user preferences and quiet hours?",
      "How do you track delivery/bounce status?",
    ],
    commonMistakes: [
      "Sending synchronously (spikes/outages cascade)",
      "No per-provider rate limiting",
      "No dedup → duplicate notifications",
    ],
    bestPractices: [
      "Queue + rate-aware workers + DLQ",
      "Respect preferences/opt-outs",
      "Idempotent sends + delivery tracking",
    ],
    relatedTech: ["SQS/Kafka", "SNS/FCM/APNs", "DLQ", "template engine"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["message-queues-async", "design-news-feed"],
  },
  {
    slug: "cdn-content-delivery",
    categoryId: "system-design",
    topic: "Caching",
    question: "How does a CDN speed up a global application, and what belongs on it?",
    tags: ["cdn", "edge", "static content", "latency", "cache"],
    shortAnswer:
      "A CDN caches content at edge locations near users, cutting latency and offloading the origin. Put static/cacheable assets on it (images, JS/CSS, videos) with long TTLs + cache-busting; some CDNs also cache API/dynamic responses and terminate TLS at the edge. It's the first big win for global latency and origin load.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Edge cache", v: "content near users → low latency" },
          { k: "Offload", v: "origin serves fewer requests" },
          { k: "Static", v: "assets with long TTL + versioning" },
          { k: "Bonus", v: "edge TLS, DDoS absorption" },
        ],
      },
    ],
    whatIf: {
      q: "Your origin is in one region but users are global and complain about slow page loads — first move?",
      a: "Put a CDN in front: static assets (and cacheable responses) are served from edge nodes near each user, so latency drops dramatically and the origin's load falls. It's usually the highest-ROI, lowest-effort global latency fix before re-architecting.",
    },
    realWorld:
      "CDNs (CloudFront/Cloudflare/Akamai) are the default for global static delivery, TLS termination at the edge, and DDoS absorption; cache-busting via hashed filenames avoids stale-asset bugs.",
    interviewerExpectation: ["edge caching/latency", "origin offload", "static + versioning", "edge TLS/DDoS", "cache key/TTL"],
    followUps: [
      "How do you avoid serving stale assets?",
      "Can a CDN cache dynamic/API responses?",
      "How does a CDN help with DDoS?",
    ],
    commonMistakes: [
      "Not using a CDN for global static content",
      "Manual invalidations instead of versioning",
      "Caching personalized responses at the edge",
    ],
    bestPractices: [
      "CDN for static + cacheable content",
      "Cache-bust with hashed filenames",
      "Terminate TLS at the edge",
    ],
    relatedTech: ["CloudFront", "Cloudflare", "edge locations"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["caching-strategies", "design-news-feed"],
  },
  {
    slug: "consistency-patterns",
    categoryId: "system-design",
    topic: "Databases",
    question: "Strong vs eventual consistency, and how do quorums (R+W>N) tune it?",
    tags: ["consistency", "quorum", "eventual", "strong", "replication"],
    shortAnswer:
      "Strong consistency: every read sees the latest write (simpler reasoning, lower availability/higher latency). Eventual: replicas converge over time (higher availability/scale, stale-read window). Quorum systems tune it: with N replicas, requiring R+W>N reads/writes guarantees overlap and read-your-writes.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Strong", v: "always latest, lower availability" },
          { k: "Eventual", v: "converges, stale window, scalable" },
          { k: "Quorum", v: "R + W > N → overlap = fresh reads" },
          { k: "Choice", v: "per data criticality" },
        ],
      },
    ],
    whatIf: {
      q: "With N=3 replicas, why does W=2, R=2 give consistent reads while W=1, R=1 doesn't?",
      a: "R+W>N (2+2>3) forces the read set and write set to overlap on at least one replica that has the latest value, so a read sees the newest write. W=1,R=1 (1+1<3) can read a replica that missed the write → stale. Quorum sizing is the knob between consistency and availability/latency.",
    },
    realWorld:
      "Dynamo-style stores (Cassandra) expose tunable R/W quorums so you choose consistency vs latency per query; picking consistency by data criticality (money = strong, feed = eventual) is the design skill.",
    interviewerExpectation: ["strong vs eventual trade-offs", "quorum R+W>N", "overlap = fresh read", "per-data choice", "availability/latency cost"],
    followUps: [
      "How does Cassandra's tunable consistency work?",
      "What is read-repair / anti-entropy?",
      "When is strong consistency worth the cost?",
    ],
    commonMistakes: [
      "Assuming eventual = 'sometimes wrong forever'",
      "Strong consistency everywhere (availability/latency hit)",
      "Misunderstanding quorum math",
    ],
    bestPractices: [
      "Tune R/W quorums per query need",
      "Strong for money/inventory; eventual for feeds",
      "Design for the stale-read window",
    ],
    relatedTech: ["Cassandra", "DynamoDB", "quorum", "read-repair"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft", "banking"],
    related: ["cap-theorem", "read-write-scaling"],
  },
  {
    slug: "design-news-feed",
    categoryId: "system-design",
    topic: "Scaling",
    question: "How would you design a social news feed (timeline)?",
    tags: ["news feed", "fanout", "timeline", "celebrity problem", "caching"],
    shortAnswer:
      "Two models: fan-out-on-write (push each post into followers' precomputed feeds — fast reads, expensive for users with many followers) and fan-out-on-read (assemble the feed from followees at read time — cheap writes, slower reads). Real systems use a hybrid: push for normal users, pull for celebrities.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Fan-out-on-write", v: "push to follower feeds — fast read" },
          { k: "Fan-out-on-read", v: "assemble at read — cheap write" },
          { k: "Celebrity", v: "millions of followers breaks push" },
          { k: "Hybrid", v: "push normal, pull celebrities" },
        ],
      },
    ],
    whatIf: {
      q: "A celebrity with 50M followers posts — why does pure fan-out-on-write fall over?",
      a: "One post triggers 50M feed writes — a massive, slow write amplification that can lag or overwhelm the system. The hybrid fix: don't fan-out celebrity posts on write; instead pull their recent posts at read time and merge into each follower's feed. Push for the long tail, pull for the few huge accounts.",
    },
    realWorld:
      "Twitter/Instagram-style feeds use hybrid fan-out with heavy caching of precomputed timelines; the 'celebrity/hot-key' problem is the classic reason pure push doesn't scale.",
    interviewerExpectation: ["fan-out write vs read", "write amplification", "celebrity problem", "hybrid approach", "feed caching"],
    followUps: [
      "How do you rank/order the feed?",
      "Where does caching fit in the feed?",
      "How do you handle the hot-key/celebrity case?",
    ],
    commonMistakes: [
      "Pure fan-out-on-write ignoring celebrities",
      "Pure fan-out-on-read (slow feeds at scale)",
      "No caching of precomputed timelines",
    ],
    bestPractices: [
      "Hybrid push/pull by follower count",
      "Cache precomputed feeds",
      "Handle hot keys explicitly",
    ],
    relatedTech: ["Redis", "Kafka", "fan-out", "feed ranking"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["hot-key-problem", "cdn-content-delivery", "caching-strategies"],
  },

  {
    slug: "design-search-system",
    categoryId: "system-design",
    topic: "Databases",
    question: "How would you design a search system (e.g. product or document search)?",
    tags: ["search", "inverted index", "elasticsearch", "indexing", "ranking"],
    shortAnswer:
      "Build an inverted index (term → list of documents) so queries are fast lookups, not full scans. Ingest documents through an analysis pipeline (tokenize, lowercase, stem), index them (Elasticsearch/OpenSearch), keep the index eventually consistent with the source via events, and rank results (TF-IDF/BM25 + business signals). Add pagination, filters, and typo tolerance.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Inverted index", v: "term → documents (fast lookup)" },
          { k: "Analysis", v: "tokenize, lowercase, stem" },
          { k: "Sync", v: "index from source via events (eventual)" },
          { k: "Rank", v: "BM25/TF-IDF + business signals" },
        ],
      },
    ],
    whatIf: {
      q: "Why use Elasticsearch instead of SQL LIKE '%term%' for search?",
      a: "LIKE '%term%' can't use an index (non-SARGable) → full table scan, no relevance ranking, no stemming/typo tolerance. An inverted index looks up matching docs in near-constant time and ranks them by relevance (BM25), with analyzers for stemming/synonyms — purpose-built for search where a relational LIKE collapses at scale.",
    },
    realWorld:
      "Product/document search runs on Elasticsearch/OpenSearch fed asynchronously from the primary DB (CDC/events); the index is eventually consistent, and ranking blends text relevance with business signals (popularity, recency).",
    interviewerExpectation: ["inverted index", "analysis pipeline", "async indexing / eventual consistency", "relevance ranking (BM25)", "why not SQL LIKE"],
    followUps: [
      "How do you keep the search index in sync with the DB?",
      "How does relevance ranking (TF-IDF/BM25) work?",
      "How do you add typo tolerance / autocomplete?",
    ],
    commonMistakes: [
      "SQL LIKE '%...%' for real search (full scans)",
      "Synchronous indexing on the write path",
      "Ignoring relevance ranking",
    ],
    bestPractices: [
      "Use an inverted index (Elasticsearch/OpenSearch)",
      "Index asynchronously from the source of truth",
      "Blend text relevance with business signals",
    ],
    relatedTech: ["Elasticsearch", "OpenSearch", "BM25", "CDC"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["cdn-content-delivery", "read-write-scaling", "design-news-feed"],
  },

  // ---------------------------------------------------------------- Hard (6)
  {
    slug: "design-distributed-cache",
    categoryId: "system-design",
    topic: "Caching",
    question: "How would you design a distributed cache like Redis Cluster?",
    tags: ["distributed cache", "redis", "consistent hashing", "replication", "eviction"],
    shortAnswer:
      "Partition keys across nodes with consistent hashing, replicate each shard (primary + replicas) for availability with automatic failover, and evict via LRU/LFU under memory pressure with TTLs. Handle hot keys (replication/local cache), cache stampedes (single-flight), and decide the consistency model (usually eventual).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Partition", v: "consistent hashing across nodes" },
          { k: "Replicate", v: "primary + replicas, auto-failover" },
          { k: "Evict", v: "LRU/LFU + TTL under pressure" },
          { k: "Handle", v: "hot keys, stampedes, consistency" },
        ],
      },
    ],
    whatIf: {
      q: "One key is so hot it overloads its shard's node — how do you handle it?",
      a: "Replicate that hot key to multiple nodes and read from any (or add a small local/client-side cache in front), and use single-flight to prevent stampedes. Consistent hashing spreads keys, but a single super-hot key still needs replication or client-side caching to spread the read load.",
    },
    realWorld:
      "Redis Cluster/Memcached designs combine consistent hashing, replication + failover, and eviction; the hard parts in interviews are hot keys, stampedes, and the consistency/availability trade-off.",
    interviewerExpectation: ["consistent hashing partitioning", "replication + failover", "LRU/LFU + TTL eviction", "hot-key handling", "stampede prevention", "consistency model"],
    followUps: [
      "How does failover pick a new primary?",
      "LRU vs LFU eviction — when each?",
      "How do you keep the cache consistent with the DB?",
    ],
    commonMistakes: [
      "No hot-key strategy",
      "No replication (cache node failure = thundering herd)",
      "Ignoring eviction policy tuning",
    ],
    bestPractices: [
      "Consistent hashing + replication + failover",
      "TTL + LRU/LFU; single-flight loads",
      "Replicate/local-cache hot keys",
    ],
    relatedTech: ["Redis Cluster", "Memcached", "consistent hashing"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["consistent-hashing", "caching-strategies", "hot-key-problem"],
  },
  {
    slug: "design-chat-system",
    categoryId: "system-design",
    topic: "Message Queues",
    question: "How would you design a real-time chat/messaging system?",
    tags: ["chat", "websocket", "message delivery", "presence", "fanout"],
    shortAnswer:
      "Use persistent connections (WebSocket) via a gateway layer that tracks which server holds each user's connection. Persist messages (ordered per conversation), route via a pub/sub bus to the recipient's gateway, handle offline delivery + read receipts, and design presence and group fan-out. Guarantee ordering per conversation and at-least-once delivery with dedup.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Transport", v: "WebSocket + connection registry" },
          { k: "Persist", v: "ordered messages per conversation" },
          { k: "Route", v: "pub/sub to recipient's gateway" },
          { k: "Also", v: "offline delivery, presence, receipts" },
        ],
      },
    ],
    whatIf: {
      q: "User A and B are connected to different chat servers — how does A's message reach B?",
      a: "A connection registry (e.g. Redis) maps each user to the server holding their WebSocket. A's server persists the message and publishes it to a pub/sub channel; B's server (subscribed / looked up via the registry) receives it and pushes over B's WebSocket. If B is offline, it's stored and delivered on reconnect.",
    },
    realWorld:
      "WhatsApp/Slack-style chat uses WebSocket gateways + a connection registry + pub/sub routing + durable per-conversation storage; ordering, offline delivery, presence, and delivery/read receipts are the hard requirements.",
    interviewerExpectation: ["WebSocket + connection registry", "per-conversation ordering", "pub/sub routing", "offline delivery + receipts", "presence, group fan-out", "at-least-once + dedup"],
    followUps: [
      "How do you guarantee message ordering?",
      "How do you handle presence at scale?",
      "How do group messages fan out?",
    ],
    commonMistakes: [
      "Polling instead of persistent connections",
      "No connection registry for cross-server routing",
      "Ignoring offline delivery / ordering",
    ],
    bestPractices: [
      "WebSocket + registry + pub/sub routing",
      "Order per conversation; dedup for at-least-once",
      "Durable storage + offline delivery",
    ],
    relatedTech: ["WebSocket", "Redis pub/sub", "Kafka", "presence service"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["message-queues-async", "design-news-feed"],
  },
  {
    slug: "capacity-estimation",
    categoryId: "system-design",
    topic: "Scaling",
    question: "How do you do back-of-the-envelope capacity estimation in a design interview?",
    tags: ["capacity estimation", "back of envelope", "qps", "storage", "bandwidth"],
    shortAnswer:
      "Derive QPS from DAU × actions/day ÷ 86,400 (and apply a peak factor of ~2–5×). Estimate storage from objects/day × size × retention, and bandwidth from QPS × payload size. Round to powers of ten — the goal is order-of-magnitude sizing to justify architecture (caches, shards, replicas), not precision.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "QPS", v: "DAU × actions ÷ 86,400 × peak factor" },
          { k: "Storage", v: "items/day × size × retention" },
          { k: "Bandwidth", v: "QPS × payload size" },
          { k: "Goal", v: "order-of-magnitude, not exact" },
        ],
      },
    ],
    handsOn: {
      lang: "text",
      code: `100M DAU, 10 reads/user/day:
  reads/day = 1e9
  avg QPS   = 1e9 / 86,400 ≈ 11.6k
  peak QPS  ≈ 11.6k × 3 ≈ 35k
2 KB/response → peak BW ≈ 35k × 2KB ≈ 70 MB/s`,
    },
    whatIf: {
      q: "Why bother estimating if the numbers are rough?",
      a: "The magnitude drives the architecture: 35k QPS says you need caching, multiple app instances, and read replicas/sharding — a single DB won't do. Estimation justifies WHY you add each component and shows the interviewer you can size a system, which is the point (not the exact number).",
    },
    realWorld:
      "Every senior system-design interview expects quick capacity math to justify caches, shards, and replicas; the skill is reasonable assumptions + powers-of-ten arithmetic, not precision.",
    interviewerExpectation: ["QPS from DAU × actions", "peak factor", "storage = rate × size × retention", "bandwidth = QPS × payload", "order-of-magnitude, justify architecture"],
    followUps: [
      "How does the estimate justify adding a cache or shards?",
      "Read:write ratio — why does it matter?",
      "How do you estimate storage growth over a year?",
    ],
    commonMistakes: [
      "Skipping estimation entirely",
      "Forgetting the peak factor",
      "Over-precise math instead of magnitudes",
    ],
    bestPractices: [
      "State assumptions; round to powers of ten",
      "Apply a peak/burst multiplier",
      "Tie the numbers to architecture choices",
    ],
    relatedTech: ["QPS", "read:write ratio", "capacity planning"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft", "Meta-style"],
    related: ["horizontal-vs-vertical-scaling", "database-sharding"],
  },
  {
    slug: "hot-key-problem",
    categoryId: "system-design",
    topic: "Scaling",
    question: "What is the hot-key (celebrity) problem, and how do you solve it?",
    tags: ["hot key", "celebrity problem", "skew", "caching", "sharding"],
    shortAnswer:
      "One key gets disproportionate traffic (a viral post, a popular product), overwhelming its single shard/cache node despite good overall partitioning. Solutions: replicate the hot key across nodes, add a client-side/local cache in front, shard the key with a suffix, or precompute/serve it from a CDN.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Problem", v: "one key ≫ traffic → single-node overload" },
          { k: "Replicate", v: "copy hot key to many nodes" },
          { k: "Local cache", v: "cache in front of the shard" },
          { k: "Shard/suffix", v: "split a hot write key" },
        ],
      },
    ],
    whatIf: {
      q: "Consistent hashing spreads keys evenly — why doesn't it fix a single hot key?",
      a: "Consistent hashing balances DIFFERENT keys across nodes, but ALL requests for one specific key still hash to the SAME node — so a single super-popular key concentrates load on one node regardless. You need per-key remedies: replication, local caching, or key-sharding, not just good partitioning.",
    },
    realWorld:
      "Hot keys (celebrity accounts, flash-sale products, viral content) are a recurring scaling problem; the fixes — replicate/local-cache reads, shard hot writes, CDN static hot content — appear across feed, cache, and DB designs.",
    interviewerExpectation: ["skewed single-key load", "hashing doesn't help one key", "replicate/local cache reads", "shard hot writes", "CDN for static hot content"],
    followUps: [
      "How do you detect a hot key at runtime?",
      "Read hot key vs write hot key — different fixes?",
      "How does this show up in a news feed design?",
    ],
    commonMistakes: [
      "Assuming consistent hashing solves hot keys",
      "No detection/mitigation for viral content",
      "Same fix for read vs write hotspots",
    ],
    bestPractices: [
      "Replicate/local-cache hot read keys",
      "Shard hot write keys with a suffix",
      "Detect hotspots and serve static ones via CDN",
    ],
    relatedTech: ["Redis replicas", "client-side cache", "CDN", "key sharding"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["design-news-feed", "consistent-hashing", "design-distributed-cache"],
  },
  {
    slug: "bloom-filters",
    categoryId: "system-design",
    topic: "Databases",
    question: "What is a Bloom filter, and where does it save huge amounts of work?",
    tags: ["bloom filter", "probabilistic", "false positive", "membership", "cache"],
    shortAnswer:
      "A Bloom filter is a space-efficient probabilistic set: it answers 'definitely not present' or 'possibly present' — no false negatives, tunable false positives. It lets you skip expensive lookups (disk/DB/network) for items that definitely aren't there, at a tiny memory cost.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Answers", v: "'no' (certain) or 'maybe' (false positive)" },
          { k: "No", v: "false negatives — never misses a real member" },
          { k: "Cost", v: "tiny memory, k hash functions + bit array" },
          { k: "Use", v: "skip expensive lookups for absent items" },
        ],
      },
    ],
    whatIf: {
      q: "How does a database like Cassandra use a Bloom filter to speed up reads?",
      a: "Each SSTable has a Bloom filter of its keys. On a read, Cassandra checks the filter first — if it says 'definitely not here', it skips reading that SSTable from disk entirely. Only 'maybe present' triggers the costly disk read. This avoids most unnecessary disk I/O for non-existent keys.",
    },
    realWorld:
      "Bloom filters power SSTable read-skipping (Cassandra/HBase/RocksDB), cache/CDN 'is this even cacheable?' checks, and dedup/'have I seen this URL?' at scale — trading a small false-positive rate for massive I/O savings.",
    interviewerExpectation: ["probabilistic membership", "no false negatives", "tunable false positives", "skip expensive lookups", "SSTable/cache use cases"],
    followUps: [
      "How do false-positive rate, bits, and hash count relate?",
      "Why can't you delete from a standard Bloom filter?",
      "What's a counting/scalable Bloom filter?",
    ],
    commonMistakes: [
      "Expecting exact membership (it's probabilistic)",
      "Ignoring the false-positive rate in design",
      "Trying to delete from a plain Bloom filter",
    ],
    bestPractices: [
      "Size bits/hashes for an acceptable FP rate",
      "Use to skip expensive negative lookups",
      "Consider counting Bloom filters if deletes needed",
    ],
    relatedTech: ["Cassandra/RocksDB", "counting Bloom filter", "HyperLogLog"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["design-distributed-cache", "database-sharding"],
  },
  {
    slug: "design-payment-system",
    categoryId: "system-design",
    topic: "Databases",
    question: "How would you design a payment/ledger system for correctness under failure?",
    tags: ["payments", "ledger", "idempotency", "double-entry", "consistency"],
    shortAnswer:
      "Correctness over availability (lean CP). Use idempotency keys so retries don't double-charge, a double-entry immutable ledger (every movement is balanced debits/credits, append-only) as the source of truth, strong consistency / transactions on the ledger, sagas for multi-step flows, and reconciliation jobs to catch drift.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Idempotency", v: "keys → no double charge on retry" },
          { k: "Double-entry ledger", v: "balanced, append-only, source of truth" },
          { k: "Consistency", v: "strong/transactional on money" },
          { k: "Safety net", v: "reconciliation + audit" },
        ],
      },
    ],
    whatIf: {
      q: "A payment request times out and the client retries — how do you guarantee they aren't charged twice?",
      a: "The client sends an idempotency key with both attempts. The server records the key with the outcome atomically; on the retry it detects the key and returns the ORIGINAL result instead of charging again. Combined with the append-only ledger, this makes the charge exactly-once from the user's perspective.",
    },
    realWorld:
      "Real payment systems (Stripe-like) are built on idempotency keys + an immutable double-entry ledger + strong consistency + reconciliation; they deliberately trade some availability for correctness because money must never be wrong.",
    interviewerExpectation: ["correctness over availability (CP)", "idempotency keys", "double-entry immutable ledger", "strong consistency/transactions", "saga for multi-step", "reconciliation/audit"],
    followUps: [
      "Why a double-entry ledger instead of a balance column?",
      "How do sagas handle a multi-service payment flow?",
      "What does reconciliation catch?",
    ],
    commonMistakes: [
      "Mutable balance field instead of an append-only ledger",
      "No idempotency (double charges on retry)",
      "Choosing availability over correctness for money",
    ],
    bestPractices: [
      "Idempotency keys + immutable double-entry ledger",
      "Strong consistency on money; sagas for flows",
      "Reconciliation + audit trails",
    ],
    relatedTech: ["idempotency", "double-entry ledger", "saga", "reconciliation"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "banking", "Stripe-like"],
    related: ["consistency-patterns", "cap-theorem", "design-notification-system"],
  },
];
