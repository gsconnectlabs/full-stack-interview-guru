import type { Question } from "../types";

/**
 * Microservices — flagship expansion batch (20 questions).
 * Enterprise & product-company patterns: service design & decomposition,
 * communication, resilience (circuit breaker/retries/bulkhead), distributed
 * data (saga/outbox/CQRS), eventual consistency, delivery semantics, and
 * observability.
 *
 * Difficulty mix: 4 Easy · 10 Medium · 6 Hard. Ordered easy → hard.
 */
export const microservicesExtra: Question[] = [
  // ---------------------------------------------------------------- Easy (4)
  {
    slug: "monolith-vs-microservices",
    categoryId: "microservices",
    topic: "Service Design",
    question: "Monolith vs microservices — when should you actually choose microservices?",
    tags: ["monolith", "microservices", "modular monolith", "architecture"],
    shortAnswer:
      "Microservices buy independent deploy/scale and team autonomy at the cost of distributed-systems complexity (network, data consistency, ops). Choose them for large orgs with clear bounded contexts and scaling/team needs — not for new/small products, where a modular monolith is usually the right start.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Monolith", v: "simple deploy/debug, one codebase" },
          { k: "Microservices", v: "independent deploy/scale, team autonomy" },
          { k: "Cost", v: "network, data consistency, ops overhead" },
          { k: "Start with", v: "modular monolith; split when it hurts" },
        ],
      },
    ],
    whatIf: {
      q: "A 5-person startup wants microservices 'to scale later' — good idea?",
      a: "Usually no. At that size the distributed complexity (deploys, tracing, data consistency, infra) slows you down more than it helps. Start with a well-modularized monolith and extract services only when a real scaling or team-autonomy pain appears — premature microservices is a classic over-engineering trap.",
    },
    realWorld:
      "Many teams that 'went microservices' early regret it and consolidate; the pragmatic path is a modular monolith first, extracting services along proven seams (bounded contexts) when they genuinely hurt.",
    interviewerExpectation: ["trade-off: autonomy vs complexity", "bounded contexts", "modular monolith first", "don't split prematurely", "Conway's law / team structure"],
    followUps: [
      "What is a modular monolith?",
      "How does Conway's law influence service boundaries?",
      "What signals tell you it's time to extract a service?",
    ],
    commonMistakes: [
      "Adopting microservices for a small team/product",
      "Splitting by technical layer instead of business capability",
      "Underestimating ops/observability cost",
    ],
    bestPractices: [
      "Start modular; extract along bounded contexts",
      "Split for team autonomy / independent scaling",
      "Invest in CI/CD + observability before splitting",
    ],
    relatedTech: ["modular monolith", "DDD", "Conway's law"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Cognizant", "Accenture"],
    related: ["service-decomposition-ddd", "database-per-service"],
  },
  {
    slug: "service-communication",
    categoryId: "microservices",
    topic: "Communication",
    question: "How do microservices communicate — synchronous vs asynchronous, and when each?",
    tags: ["synchronous", "asynchronous", "rest", "messaging", "kafka", "grpc"],
    shortAnswer:
      "Synchronous (REST/gRPC) is simple and immediate but couples services and propagates failures/latency. Asynchronous (message broker / events) decouples, buffers load, and improves resilience, at the cost of eventual consistency and harder debugging. Use sync for queries needing an immediate answer, async for workflows/notifications.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Sync (REST/gRPC)", v: "immediate, simple, tight coupling" },
          { k: "Async (broker)", v: "decoupled, resilient, eventual" },
          { k: "Sync for", v: "read/query needing an answer now" },
          { k: "Async for", v: "events, workflows, notifications" },
        ],
      },
    ],
    whatIf: {
      q: "A chain of 5 synchronous service calls keeps timing out — what architectural smell is that?",
      a: "Synchronous call chains couple availability multiplicatively (each hop must be up and fast) and amplify latency. It's a sign to flatten the chain, cache, or move parts to async/event-driven so a slow downstream doesn't cascade failures upstream.",
    },
    realWorld:
      "Over-using synchronous calls creates fragile 'distributed monoliths'; mature systems push workflows onto events/queues and reserve sync calls for genuine request/response reads.",
    interviewerExpectation: ["sync vs async trade-offs", "coupling/latency amplification", "eventual consistency cost of async", "choose by use case", "avoid long sync chains"],
    followUps: [
      "What is a 'distributed monolith'?",
      "How does async messaging improve resilience?",
      "When is gRPC preferred over REST internally?",
    ],
    commonMistakes: [
      "Long synchronous call chains",
      "Using async everywhere (debugging pain)",
      "Ignoring partial-failure handling on sync calls",
    ],
    bestPractices: [
      "Async for workflows/events; sync for immediate reads",
      "Add timeouts/circuit breakers to sync calls",
      "Avoid deep synchronous chains",
    ],
    relatedTech: ["Kafka", "RabbitMQ", "gRPC", "REST"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "Deloitte", "Cognizant"],
    related: ["event-driven-kafka", "resilience-retries-timeouts"],
  },
  {
    slug: "service-discovery",
    categoryId: "microservices",
    topic: "Communication",
    question: "What is service discovery, and why can't you just hardcode service URLs?",
    tags: ["service discovery", "eureka", "dns", "load balancing", "kubernetes"],
    shortAnswer:
      "In dynamic environments, service instances come and go with changing IPs/ports (autoscaling, restarts), so hardcoded URLs break. Service discovery (a registry like Eureka/Consul, or Kubernetes DNS) lets a caller look up healthy instances by logical name and load-balance across them.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Problem", v: "instances/IPs change constantly" },
          { k: "Registry", v: "services register; clients look up by name" },
          { k: "Kubernetes", v: "built-in DNS + Service abstraction" },
          { k: "Health", v: "only healthy instances are returned" },
        ],
      },
    ],
    whatIf: {
      q: "On Kubernetes, do you still need Eureka/Consul?",
      a: "Usually not — Kubernetes provides service discovery natively: a Service gives a stable DNS name and virtual IP that load-balances to healthy pods. You call http://order-service and K8s routes it. Client-side registries like Eureka are more common outside K8s.",
    },
    realWorld:
      "On Kubernetes, services call each other by Service DNS name; outside K8s, Spring Cloud + Eureka/Consul fill the role. Either way the point is: never hardcode instance IPs.",
    interviewerExpectation: ["dynamic IPs problem", "registry/lookup by name", "health checks", "K8s DNS/Service", "load balancing"],
    followUps: [
      "Client-side vs server-side discovery?",
      "How does a Kubernetes Service load-balance to pods?",
      "How do health checks affect routing?",
    ],
    commonMistakes: [
      "Hardcoding instance IPs/ports",
      "Adding Eureka on top of Kubernetes unnecessarily",
      "Ignoring health checks in routing",
    ],
    bestPractices: [
      "Use platform discovery (K8s DNS) where available",
      "Route only to healthy instances",
      "Reference services by logical name",
    ],
    relatedTech: ["Kubernetes Service", "Eureka", "Consul", "DNS"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "TCS", "Wipro", "Accenture"],
    related: ["service-communication", "service-mesh"],
  },
  {
    slug: "database-per-service",
    categoryId: "microservices",
    topic: "Data Consistency",
    question: "Why does each microservice own its database, and what problem does that create?",
    tags: ["database per service", "data ownership", "coupling", "joins", "consistency"],
    shortAnswer:
      "Each service owns its data so it can evolve its schema and scale independently — no other service may touch its DB directly (loose coupling). The cost: you can no longer do cross-service JOINs or ACID transactions, so you need API composition, events, and eventual consistency instead.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Why", v: "independent schema + scaling, loose coupling" },
          { k: "Rule", v: "no service touches another's DB directly" },
          { k: "Cost", v: "no cross-service JOIN or ACID txn" },
          { k: "Replace with", v: "API composition / events / saga" },
        ],
      },
    ],
    whatIf: {
      q: "A report needs data from 4 services that each own their DB — how do you build it?",
      a: "You can't JOIN across their databases. Options: API composition (query each service and join in memory), or maintain a read model / materialized view fed by their events (CQRS). For heavy reporting, the event-fed read model scales better than fan-out API calls.",
    },
    realWorld:
      "The 'shared database' anti-pattern silently recouples services (one schema change breaks many); database-per-service is what makes independent deployment real, but it forces you to solve cross-service data via composition/events.",
    interviewerExpectation: ["data ownership/loose coupling", "no direct DB access by others", "lose cross-service JOIN/ACID", "API composition / events / CQRS", "shared-DB anti-pattern"],
    followUps: [
      "Why is a shared database an anti-pattern here?",
      "API composition vs CQRS read model for queries?",
      "How do you keep a read model in sync?",
    ],
    commonMistakes: [
      "Sharing one database across services",
      "Doing cross-service JOINs via direct DB access",
      "Expecting ACID across services",
    ],
    bestPractices: [
      "One database per service; access only via its API",
      "Use API composition or event-fed read models",
      "Accept eventual consistency for cross-service data",
    ],
    relatedTech: ["CQRS", "API composition", "event sourcing"],
    difficulty: "Easy",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["saga-pattern", "cqrs", "eventual-consistency"],
  },

  // -------------------------------------------------------------- Medium (10)
  {
    slug: "saga-pattern",
    categoryId: "microservices",
    topic: "Sagas & Events",
    question: "How does the Saga pattern manage a transaction spanning multiple services?",
    tags: ["saga", "distributed transaction", "compensating transaction", "orchestration", "choreography"],
    shortAnswer:
      "A saga splits a distributed transaction into a sequence of local transactions, each publishing an event/command for the next step. If a step fails, it runs compensating transactions to undo the prior steps. Two styles: orchestration (a central coordinator) or choreography (services react to events).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Local steps", v: "each service does its own txn" },
          { k: "Failure", v: "compensating txns undo prior steps" },
          { k: "Orchestration", v: "central coordinator drives steps" },
          { k: "Choreography", v: "services react to each other's events" },
        ],
      },
    ],
    whatIf: {
      q: "Order → Payment → Inventory; inventory reservation fails. What does the saga do?",
      a: "It runs compensating transactions backward: refund the payment, cancel the order. There's no global rollback (no 2PC), so each completed step needs an explicit 'undo' action. Compensations must be idempotent and the saga must handle them failing too.",
    },
    realWorld:
      "Order/payment/inventory workflows use sagas because you can't hold an ACID transaction across services; orchestration (e.g. a state machine / Temporal) is common when the flow is complex.",
    interviewerExpectation: ["sequence of local txns", "compensating transactions", "orchestration vs choreography", "no global rollback", "idempotent compensations"],
    followUps: [
      "Orchestration vs choreography — trade-offs?",
      "Why must compensations be idempotent?",
      "How is a saga different from 2PC?",
    ],
    commonMistakes: [
      "Expecting automatic global rollback",
      "Non-idempotent compensating actions",
      "Choreography sprawl with no visibility into the flow",
    ],
    bestPractices: [
      "Design explicit, idempotent compensations",
      "Use orchestration for complex flows (visibility)",
      "Make each step retry-safe",
    ],
    relatedTech: ["orchestration (Temporal/Camunda)", "Kafka", "state machine"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "banking", "Deloitte"],
    related: ["distributed-transactions-2pc", "transactional-outbox", "eventual-consistency"],
  },
  {
    slug: "circuit-breaker",
    categoryId: "microservices",
    topic: "Resilience",
    question: "What is the circuit breaker pattern, and how does it stop cascading failures?",
    tags: ["circuit breaker", "resilience4j", "cascading failure", "fallback", "fault tolerance"],
    shortAnswer:
      "A circuit breaker monitors calls to a dependency; when failures cross a threshold it 'opens' and fails fast (returning a fallback) instead of waiting on a dying service. After a cooldown it goes 'half-open' to test recovery. This prevents one slow service from exhausting threads and taking down callers.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Closed", v: "calls flow; count failures" },
          { k: "Open", v: "fail fast + fallback (don't call)" },
          { k: "Half-open", v: "trial calls to test recovery" },
        ],
      },
    ],
    whatIf: {
      q: "Without a circuit breaker, how does one slow downstream service crash the whole system?",
      a: "Callers block waiting on the slow service, holding threads/connections. As traffic continues, the caller's thread pool and connection pool exhaust, so IT stops responding too — and its callers fail next. The slowdown cascades upstream. A breaker fails fast, freeing resources and isolating the failure.",
    },
    realWorld:
      "Circuit breakers (Resilience4j, Istio) are standard in microservices to contain failures; the cascading thread-pool exhaustion they prevent is a textbook outage pattern.",
    interviewerExpectation: ["closed/open/half-open states", "fail fast + fallback", "prevents thread/conn exhaustion", "cascading failure containment", "Resilience4j/mesh"],
    followUps: [
      "How does a breaker combine with retries and timeouts?",
      "What makes a good fallback?",
      "Bulkhead vs circuit breaker?",
    ],
    commonMistakes: [
      "Retrying into an open circuit",
      "No fallback (just an error)",
      "No timeout (breaker can't detect 'slow')",
    ],
    bestPractices: [
      "Pair breaker with timeout + bounded retries",
      "Provide a meaningful fallback",
      "Tune thresholds; add bulkheads",
    ],
    relatedTech: ["Resilience4j", "Istio", "Hystrix (legacy)", "bulkhead"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Wipro"],
    related: ["resilience-retries-timeouts", "service-mesh", "service-communication"],
  },
  {
    slug: "service-mesh",
    categoryId: "microservices",
    topic: "Communication",
    question: "What is a service mesh, and what does it offload from your application code?",
    tags: ["service mesh", "istio", "sidecar", "mtls", "observability"],
    shortAnswer:
      "A service mesh (Istio/Linkerd) puts a sidecar proxy next to each service and handles service-to-service concerns at the infra layer: mTLS encryption, retries/timeouts, circuit breaking, load balancing, traffic shifting (canary), and telemetry — so apps don't reimplement them in every language.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Sidecar proxy", v: "intercepts all service traffic" },
          { k: "Security", v: "automatic mTLS between services" },
          { k: "Traffic", v: "retries, timeouts, canary, LB" },
          { k: "Telemetry", v: "metrics/traces for free" },
        ],
      },
    ],
    whatIf: {
      q: "Service mesh vs API gateway — how do they differ?",
      a: "A gateway sits at the EDGE (north-south traffic: clients → cluster) handling auth, rate limiting, routing. A mesh handles INTERNAL service-to-service traffic (east-west: service → service) via sidecars — mTLS, retries, observability. They're complementary, not competing.",
    },
    realWorld:
      "Meshes move cross-cutting networking out of polyglot app code into the platform, giving uniform mTLS, traffic control, and golden-signal telemetry — at the cost of added operational complexity.",
    interviewerExpectation: ["sidecar proxy", "mTLS/retries/LB/telemetry at infra", "east-west vs gateway north-south", "polyglot benefit", "ops complexity cost"],
    followUps: [
      "What's the cost/complexity of running a mesh?",
      "How does it enable canary/traffic shifting?",
      "Where does the circuit breaker live — app or mesh?",
    ],
    commonMistakes: [
      "Confusing mesh (east-west) with gateway (north-south)",
      "Adopting a mesh for a handful of services",
      "Ignoring sidecar resource overhead",
    ],
    bestPractices: [
      "Use a mesh when polyglot/scale justifies it",
      "Let the mesh own mTLS + traffic policy",
      "Combine with a gateway at the edge",
    ],
    relatedTech: ["Istio", "Linkerd", "Envoy", "Kubernetes"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["circuit-breaker", "service-discovery", "observability-slo"],
  },
  {
    slug: "eventual-consistency",
    categoryId: "microservices",
    topic: "Data Consistency",
    question: "What is eventual consistency, and how do you design a UX around it?",
    tags: ["eventual consistency", "cap theorem", "read-your-writes", "stale data"],
    shortAnswer:
      "With data spread across services, an update propagates asynchronously, so reads may briefly see stale data before all copies converge ('eventually consistent'). Design for it: optimistic UI, read-your-writes via the originating service, idempotent updates, and clear handling of temporary staleness.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Cause", v: "async propagation across services" },
          { k: "Window", v: "reads may be briefly stale" },
          { k: "UX", v: "optimistic UI, show 'pending'" },
          { k: "Trick", v: "read-your-writes from the source" },
        ],
      },
    ],
    whatIf: {
      q: "A user updates their profile, then a search shows the old value — bug or expected?",
      a: "Expected with eventual consistency: the search index is updated asynchronously via events, so there's a propagation lag. Mitigate UX by reading the user's own writes from the source service (read-your-writes), or optimistically reflecting the change in the UI until the index catches up.",
    },
    realWorld:
      "Search indexes, caches, and read models lag their source by design; teams handle it with read-your-writes, optimistic UI, and setting user expectations ('changes may take a moment') rather than forcing strong consistency.",
    interviewerExpectation: ["async convergence", "stale-read window", "CAP trade-off", "read-your-writes", "optimistic UI / idempotency"],
    followUps: [
      "How does CAP relate to this choice?",
      "How do you implement read-your-writes?",
      "When do you actually need strong consistency?",
    ],
    commonMistakes: [
      "Assuming all reads are immediately consistent",
      "Forcing strong consistency everywhere (kills availability)",
      "No UX handling for the staleness window",
    ],
    bestPractices: [
      "Embrace eventual consistency where acceptable",
      "Offer read-your-writes for the editing user",
      "Make updates idempotent",
    ],
    relatedTech: ["CAP theorem", "CQRS", "Kafka", "search index"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft", "Deloitte"],
    related: ["database-per-service", "cqrs", "delivery-semantics"],
  },
  {
    slug: "consumer-idempotency",
    categoryId: "microservices",
    topic: "Sagas & Events",
    question: "Why must event consumers be idempotent, and how do you implement it?",
    tags: ["idempotency", "consumer", "deduplication", "at-least-once", "events"],
    shortAnswer:
      "Message brokers deliver at-least-once, so a consumer can receive the same event more than once (redelivery after a crash before ack, retries). Make processing idempotent: dedupe on a unique event id (processed-ids store) or design effects to be naturally idempotent, so reprocessing causes no duplicate side effects.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Why", v: "at-least-once → duplicate deliveries" },
          { k: "Dedup", v: "track processed event ids" },
          { k: "Or", v: "naturally idempotent operations" },
          { k: "Atomic", v: "process + mark-processed together" },
        ],
      },
    ],
    whatIf: {
      q: "A consumer credits a wallet on each 'payment.received' event and sometimes double-credits — fix?",
      a: "Duplicate delivery. Store each processed event id (idempotency table) and, in the SAME transaction as the credit, check-and-insert the id; if it already exists, skip. That makes the credit happen exactly once per event despite redeliveries.",
    },
    realWorld:
      "Double-charge/double-credit/duplicate-email bugs in event-driven systems almost always come from non-idempotent consumers; the processed-id dedup table (or natural idempotency) is the standard cure.",
    interviewerExpectation: ["at-least-once delivery", "duplicate handling", "dedup by event id", "atomic process+mark", "natural idempotency"],
    followUps: [
      "Why is exactly-once delivery effectively impossible?",
      "How do you store and expire processed ids?",
      "How does this relate to the outbox pattern?",
    ],
    commonMistakes: [
      "Assuming each event is delivered once",
      "Marking processed in a separate transaction (race)",
      "No dedup → duplicate side effects",
    ],
    bestPractices: [
      "Dedup on event id atomically with the effect",
      "Prefer naturally idempotent operations",
      "Expire old processed ids to bound storage",
    ],
    relatedTech: ["Kafka", "idempotency table", "exactly-once-ish"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "banking"],
    related: ["delivery-semantics", "transactional-outbox", "saga-pattern"],
  },
  {
    slug: "externalized-config",
    categoryId: "microservices",
    topic: "Service Design",
    question: "How do you manage configuration and secrets across many microservices?",
    tags: ["config", "externalized configuration", "secrets", "12-factor", "config server"],
    shortAnswer:
      "Externalize config from code (12-factor): inject via environment variables / a config service (Spring Cloud Config, Consul) / Kubernetes ConfigMaps, and keep secrets in a secrets manager (Vault, AWS Secrets Manager / K8s Secrets) — never in the repo. Support per-environment overrides and, ideally, dynamic refresh.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Config", v: "env vars / config server / ConfigMap" },
          { k: "Secrets", v: "Vault / Secrets Manager (NOT in git)" },
          { k: "Per-env", v: "dev/stage/prod overrides" },
          { k: "Bonus", v: "dynamic refresh without redeploy" },
        ],
      },
    ],
    whatIf: {
      q: "A DB password is committed to the repo — what's the remediation?",
      a: "Treat it as compromised: rotate the credential immediately, purge it from history (and assume it's leaked), then move it to a secrets manager injected at runtime. Add secret-scanning to CI to prevent recurrence. Rotating is non-negotiable — removing the commit doesn't un-leak it.",
    },
    realWorld:
      "12-factor externalized config + a secrets manager is standard; the recurring incident is secrets committed to git, which is why secret-scanning and rotation policies exist.",
    interviewerExpectation: ["externalize config (12-factor)", "secrets in a manager not git", "per-env overrides", "dynamic refresh", "rotate leaked secrets"],
    followUps: [
      "Why is config in code an anti-pattern?",
      "How does dynamic config refresh work?",
      "How do K8s Secrets differ from a Vault?",
    ],
    commonMistakes: [
      "Hardcoding config/secrets in the repo",
      "Same config across environments",
      "Not rotating leaked credentials",
    ],
    bestPractices: [
      "Externalize all config; secrets in a manager",
      "Per-environment overrides",
      "Secret-scan CI + rotation policy",
    ],
    relatedTech: ["Spring Cloud Config", "Vault", "K8s ConfigMap/Secret", "AWS Secrets Manager"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Cognizant", "Accenture"],
    related: ["observability-slo", "microservice-versioning-contracts"],
  },
  {
    slug: "distributed-tracing",
    categoryId: "microservices",
    topic: "Observability",
    question: "How do you trace a single request across many microservices?",
    tags: ["distributed tracing", "correlation id", "opentelemetry", "trace id", "span"],
    shortAnswer:
      "Propagate a trace id (and span ids) through every hop — usually via OpenTelemetry and W3C traceparent headers. Each service logs with that id and emits spans to a backend (Jaeger/Tempo/Zipkin), so you can reconstruct the full call tree and timing of one request end-to-end.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Trace id", v: "one id for the whole request" },
          { k: "Span", v: "one operation/hop with timing" },
          { k: "Propagation", v: "W3C traceparent header" },
          { k: "Backend", v: "Jaeger / Tempo / Zipkin" },
        ],
      },
    ],
    whatIf: {
      q: "A request is slow but you don't know which of 8 services is the culprit — what do you reach for?",
      a: "Distributed tracing: pull up the trace by its id and view the span waterfall — it shows exactly which service/span consumed the time (e.g. a slow DB call in service 5). Without trace propagation, you're grepping correlation ids across 8 log streams manually.",
    },
    realWorld:
      "OpenTelemetry-based tracing + a correlation id in logs is the standard way to debug latency and errors across services; it turns 'which service is slow?' from hours of log-diving into a single trace view.",
    interviewerExpectation: ["propagate trace/correlation id", "spans + trace tree", "OpenTelemetry/W3C traceparent", "tracing backend", "log correlation"],
    followUps: [
      "What's the difference between logs, metrics and traces?",
      "How does context propagation work across async boundaries?",
      "What is sampling and why do you need it?",
    ],
    commonMistakes: [
      "Not propagating the trace id across hops",
      "Logs without a correlation id",
      "100% trace sampling at high volume (cost)",
    ],
    bestPractices: [
      "Standardize on OpenTelemetry + traceparent",
      "Put the trace id in every log line",
      "Sample sensibly at high throughput",
    ],
    relatedTech: ["OpenTelemetry", "Jaeger", "Zipkin", "Grafana Tempo"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "Deloitte"],
    related: ["observability-slo", "service-mesh"],
  },
  {
    slug: "resilience-retries-timeouts",
    categoryId: "microservices",
    topic: "Resilience",
    question: "How do timeouts, retries, backoff and bulkheads work together for resilience?",
    tags: ["timeout", "retry", "exponential backoff", "bulkhead", "resilience4j"],
    shortAnswer:
      "Timeouts cap how long you wait (never wait forever). Retries handle transient failures — but only with exponential backoff + jitter and only on idempotent/retryable errors. Bulkheads isolate resources (separate pools per dependency) so one failing dependency can't starve the rest. Combine with a circuit breaker.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Timeout", v: "never wait indefinitely" },
          { k: "Retry", v: "transient only, backoff + jitter, idempotent" },
          { k: "Bulkhead", v: "isolate pools per dependency" },
          { k: "Breaker", v: "stop hammering a dead service" },
        ],
      },
    ],
    whatIf: {
      q: "A team adds aggressive retries with no backoff during an outage and it gets worse — why?",
      a: "Retries without backoff create a 'retry storm' — they multiply load on an already-struggling service, deepening the outage (and can cause a thundering herd on recovery). Use exponential backoff + jitter, cap attempts, and only retry idempotent operations.",
    },
    realWorld:
      "Retry storms and missing timeouts are leading causes of outages amplifying; the standard toolkit (timeout + bounded retry w/ jitter + bulkhead + breaker, e.g. Resilience4j) is table stakes for production services.",
    interviewerExpectation: ["always set timeouts", "backoff+jitter, idempotent-only retries", "bulkhead isolation", "combine with breaker", "avoid retry storms"],
    followUps: [
      "Why add jitter to backoff?",
      "Which errors are safe to retry?",
      "How does a bulkhead differ from a circuit breaker?",
    ],
    commonMistakes: [
      "No timeouts (threads block forever)",
      "Retrying non-idempotent ops / without backoff",
      "Shared pools letting one dependency starve others",
    ],
    bestPractices: [
      "Set timeouts everywhere",
      "Retry idempotent ops with backoff + jitter, capped",
      "Isolate with bulkheads; add a circuit breaker",
    ],
    relatedTech: ["Resilience4j", "exponential backoff", "bulkhead", "circuit breaker"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "Deloitte"],
    related: ["circuit-breaker", "service-communication", "delivery-semantics"],
  },
  {
    slug: "cqrs",
    categoryId: "microservices",
    topic: "Data Consistency",
    question: "What is CQRS, and when is separating reads from writes worth it?",
    tags: ["cqrs", "read model", "write model", "event sourcing", "scalability"],
    shortAnswer:
      "CQRS splits the write model (commands, normalized, validated) from one or more read models (queries, denormalized for fast reads), often kept in sync via events. It's worth it when read and write workloads differ hugely or queries span data that's expensive to assemble — at the cost of eventual consistency and more moving parts.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Command side", v: "writes, normalized, enforces rules" },
          { k: "Query side", v: "denormalized read model(s), fast reads" },
          { k: "Sync", v: "events update the read model" },
          { k: "Cost", v: "eventual consistency + complexity" },
        ],
      },
    ],
    whatIf: {
      q: "Do you need event sourcing to use CQRS?",
      a: "No — they're often paired but independent. You can build CQRS read models from regular domain events or change-data-capture without storing the full event log. Adopt event sourcing only if you specifically need the full history/audit and replay; it adds significant complexity.",
    },
    realWorld:
      "Read-heavy systems (dashboards, search, feeds) use CQRS read models fed by events to serve fast denormalized queries while keeping a clean normalized write model; over-applying it to simple CRUD is a common over-engineering mistake.",
    interviewerExpectation: ["separate read/write models", "denormalized read model", "event-synced", "eventual consistency", "CQRS ≠ event sourcing", "don't over-apply"],
    followUps: [
      "CQRS vs event sourcing — how related?",
      "How do you keep the read model in sync?",
      "When is plain CRUD better?",
    ],
    commonMistakes: [
      "Applying CQRS to simple CRUD",
      "Assuming CQRS requires event sourcing",
      "Ignoring read-model rebuild/consistency",
    ],
    bestPractices: [
      "Use CQRS for divergent read/write needs",
      "Keep read models rebuildable from events",
      "Default to CRUD when adequate",
    ],
    relatedTech: ["event sourcing", "Kafka", "materialized views", "CDC"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["database-per-service", "eventual-consistency", "event-driven-kafka"],
  },
  {
    slug: "event-driven-kafka",
    categoryId: "microservices",
    topic: "Sagas & Events",
    question: "How does an event-driven architecture with Kafka decouple services?",
    tags: ["event-driven", "kafka", "pub-sub", "partitions", "consumer group"],
    shortAnswer:
      "Producers publish events to topics without knowing the consumers; consumers subscribe independently. Kafka persists events in partitions (ordered per partition), and consumer groups scale processing. This decouples services, buffers load, enables replay, and lets new consumers join without changing producers.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Topic", v: "named event stream, partitioned" },
          { k: "Producer", v: "publishes; doesn't know consumers" },
          { k: "Consumer group", v: "parallelism; one partition per consumer" },
          { k: "Replay", v: "events retained → reprocess/onboard" },
        ],
      },
    ],
    whatIf: {
      q: "You need strict ordering of events for a given customer — how do you get it with Kafka?",
      a: "Order is guaranteed only WITHIN a partition. Use the customer id as the partition key so all of that customer's events land in the same partition and are processed in order, while different customers spread across partitions for parallelism.",
    },
    realWorld:
      "Kafka backs order/payment/notification pipelines; partition-key choice (for ordering + even distribution) and consumer-group sizing are the core design levers, and event retention enables replay/onboarding new consumers.",
    interviewerExpectation: ["pub-sub decoupling", "topics/partitions", "ordering per partition + partition key", "consumer groups for parallelism", "retention/replay"],
    followUps: [
      "How does the partition key affect ordering and skew?",
      "How do consumer groups scale consumption?",
      "How does replay help onboard a new service?",
    ],
    commonMistakes: [
      "Expecting global ordering across partitions",
      "Poor partition key → hot partitions / skew",
      "More consumers than partitions (idle consumers)",
    ],
    bestPractices: [
      "Choose a partition key for ordering + balance",
      "Size partitions for target parallelism",
      "Leverage retention for replay/recovery",
    ],
    relatedTech: ["Kafka", "partitions", "consumer groups", "schema registry"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "Deloitte"],
    related: ["consumer-idempotency", "delivery-semantics", "cqrs"],
  },

  // ---------------------------------------------------------------- Hard (6)
  {
    slug: "distributed-transactions-2pc",
    categoryId: "microservices",
    topic: "Data Consistency",
    question: "Why is two-phase commit (2PC) avoided in microservices, and what's used instead?",
    tags: ["2pc", "distributed transaction", "saga", "xa", "availability"],
    shortAnswer:
      "2PC gives ACID across services but needs a coordinator and synchronous locks held across the prepare/commit phases — so it blocks on any slow/failed participant (coordinator is a SPOF) and kills availability and scalability. Microservices instead use sagas (compensating transactions) and eventual consistency.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "2PC", v: "prepare → commit, coordinator, locks held" },
          { k: "Problem", v: "blocking, coordinator SPOF, poor availability" },
          { k: "Instead", v: "saga + compensations, eventual consistency" },
        ],
      },
    ],
    whatIf: {
      q: "When might 2PC still be acceptable?",
      a: "Within a tightly-coupled, low-latency boundary (e.g. a single DB with XA across two resources, or a small set of co-located services) where strong consistency is mandatory and the participants are reliable. Across many independent, internet-scale services it's avoided for availability reasons.",
    },
    realWorld:
      "The CAP/availability trade-off pushes microservices toward sagas; 2PC survives mostly in classic enterprise/XA contexts (single-org, reliable resources), not in elastic distributed systems.",
    interviewerExpectation: ["2PC = ACID but blocking", "coordinator SPOF / held locks", "availability cost", "saga + eventual consistency alternative", "when 2PC is OK"],
    followUps: [
      "How does a saga relate to the CAP theorem choice?",
      "What is the 2PC 'in-doubt' / blocking problem?",
      "Where does XA still make sense?",
    ],
    commonMistakes: [
      "Reaching for 2PC across many services",
      "Assuming distributed ACID is free",
      "Ignoring coordinator failure modes",
    ],
    bestPractices: [
      "Prefer sagas + eventual consistency at scale",
      "Reserve 2PC/XA for reliable, bounded scopes",
      "Design idempotent compensations",
    ],
    relatedTech: ["XA", "saga", "Temporal", "CAP theorem"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "banking", "Google"],
    related: ["saga-pattern", "eventual-consistency", "transactional-outbox"],
  },
  {
    slug: "transactional-outbox",
    categoryId: "microservices",
    topic: "Sagas & Events",
    question: "How does the transactional outbox pattern solve the dual-write problem?",
    tags: ["outbox", "dual write", "cdc", "kafka", "atomicity"],
    shortAnswer:
      "The dual-write problem: you can't atomically update your DB AND publish to a broker — a crash between them leaves them inconsistent. The outbox pattern writes the event into an 'outbox' table in the SAME local transaction as the data change; a separate relay (or CDC like Debezium) then reliably publishes those rows to the broker.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Dual write", v: "DB + broker can't be atomic → drift" },
          { k: "Outbox", v: "event row in same DB txn as the change" },
          { k: "Relay/CDC", v: "publishes outbox rows to the broker" },
          { k: "Result", v: "no lost or phantom events" },
        ],
      },
    ],
    whatIf: {
      q: "Why not just publish to Kafka right after the DB commit succeeds?",
      a: "If the process crashes after the commit but before the publish, the data changed but no event was sent — a lost event (or, if you publish first then the DB write fails, a phantom event). The outbox makes the event part of the same atomic DB transaction, so it can't be lost; the relay guarantees at-least-once publish.",
    },
    realWorld:
      "Transactional outbox (often with Debezium CDC reading the table's log) is the standard reliable way to publish domain events from a service without losing them on crashes — paired with idempotent consumers.",
    interviewerExpectation: ["dual-write inconsistency", "outbox row in same txn", "relay/CDC publishes", "at-least-once → idempotent consumers", "Debezium"],
    followUps: [
      "How does CDC (Debezium) read the outbox?",
      "Why do consumers still need to be idempotent?",
      "Outbox vs listen-to-yourself patterns?",
    ],
    commonMistakes: [
      "Publishing to broker outside the DB transaction",
      "Assuming exactly-once (it's at-least-once + dedup)",
      "No cleanup of published outbox rows",
    ],
    bestPractices: [
      "Write events to an outbox in the same txn",
      "Relay via CDC; consumers dedupe idempotently",
      "Prune/Archive published outbox rows",
    ],
    relatedTech: ["Debezium (CDC)", "Kafka", "outbox table", "idempotency"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "banking"],
    related: ["consumer-idempotency", "saga-pattern", "delivery-semantics"],
  },
  {
    slug: "delivery-semantics",
    categoryId: "microservices",
    topic: "Sagas & Events",
    question: "At-most-once vs at-least-once vs exactly-once — what's realistic in distributed messaging?",
    tags: ["delivery semantics", "exactly-once", "at-least-once", "idempotency", "kafka"],
    shortAnswer:
      "At-most-once: may lose messages (fire-and-forget). At-least-once: never lost but may duplicate — the common, practical default. True end-to-end exactly-once is effectively unachievable across systems; you APPROXIMATE it with at-least-once delivery + idempotent consumers (dedup), which is 'effectively-once'.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "At-most-once", v: "no dup, may LOSE messages" },
          { k: "At-least-once", v: "no loss, may DUPLICATE (default)" },
          { k: "Exactly-once", v: "ideal; impractical end-to-end" },
          { k: "Practical", v: "at-least-once + idempotent consumer" },
        ],
      },
    ],
    whatIf: {
      q: "Kafka advertises 'exactly-once semantics' — does that solve it everywhere?",
      a: "Kafka EOS is exactly-once WITHIN Kafka (transactional produce + consume-process-produce in the same Kafka transaction). The moment you touch an external system (DB, email, payment), you're back to at-least-once at that boundary — so the consumer must still be idempotent. EOS isn't a universal exactly-once.",
    },
    realWorld:
      "The pragmatic industry stance: design for at-least-once and make every consumer idempotent (dedup by id). 'Exactly-once' end-to-end is a marketing-adjacent ideal you engineer around, not rely on.",
    interviewerExpectation: ["three semantics", "at-least-once practical default", "exactly-once impractical end-to-end", "idempotent consumer = effectively-once", "Kafka EOS scope"],
    followUps: [
      "Why is end-to-end exactly-once effectively impossible?",
      "What does Kafka's EOS actually guarantee?",
      "How do idempotent consumers create 'effectively-once'?",
    ],
    commonMistakes: [
      "Relying on exactly-once across system boundaries",
      "At-most-once for important events (silent loss)",
      "At-least-once without idempotent consumers",
    ],
    bestPractices: [
      "Design for at-least-once + idempotency",
      "Understand the scope of any EOS guarantee",
      "Dedup by a stable event id",
    ],
    relatedTech: ["Kafka EOS", "idempotency", "transactional outbox"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "banking"],
    related: ["consumer-idempotency", "transactional-outbox", "event-driven-kafka"],
  },
  {
    slug: "service-decomposition-ddd",
    categoryId: "microservices",
    topic: "Service Design",
    question: "How do you decide service boundaries using Domain-Driven Design?",
    tags: ["ddd", "bounded context", "service boundaries", "decomposition", "coupling"],
    shortAnswer:
      "Draw boundaries around bounded contexts — areas of the domain with their own consistent model and language — not around technical layers or data entities. Good boundaries are high-cohesion, low-coupling, owned by one team, and rarely need synchronous cross-calls. Decompose by business capability.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Bounded context", v: "one consistent model + language" },
          { k: "By capability", v: "not by technical layer/entity" },
          { k: "Goal", v: "high cohesion, low coupling, one team" },
          { k: "Smell", v: "chatty sync calls = wrong boundary" },
        ],
      },
    ],
    whatIf: {
      q: "Two services constantly call each other synchronously to complete one operation — what does that indicate?",
      a: "The boundary is wrong — that chattiness means the logic/data really belongs together (low cohesion across the split). Either merge them or re-cut the boundary along the true bounded context. Excessive synchronous cross-talk is the clearest sign of bad decomposition.",
    },
    realWorld:
      "Bad boundaries (split by entity/layer, or too fine-grained) create distributed monoliths with chatty calls and shared churn; DDD bounded contexts + 'one team owns it' is the durable decomposition heuristic.",
    interviewerExpectation: ["bounded contexts", "decompose by business capability", "high cohesion/low coupling", "chatty calls = wrong boundary", "team ownership"],
    followUps: [
      "What is a bounded context vs an aggregate?",
      "How do you handle shared concepts across contexts?",
      "Why avoid entity- or layer-based splits?",
    ],
    commonMistakes: [
      "Splitting by technical layer or single entity",
      "Too fine-grained ('nano') services",
      "Boundaries that force chatty sync calls",
    ],
    bestPractices: [
      "Cut along bounded contexts / capabilities",
      "Optimize for cohesion + low coupling",
      "One team owns each service",
    ],
    relatedTech: ["DDD", "bounded context", "event storming"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Google"],
    related: ["monolith-vs-microservices", "database-per-service"],
  },
  {
    slug: "observability-slo",
    categoryId: "microservices",
    topic: "Observability",
    question: "What are the three pillars of observability, and how do SLO/SLI/error budgets guide operations?",
    tags: ["observability", "metrics", "logs", "traces", "slo", "sli", "error budget"],
    shortAnswer:
      "Pillars: metrics (aggregate trends/alerts), logs (discrete events/detail), traces (request flow across services). SLIs are measured indicators (e.g. p99 latency, error rate); an SLO is the target (99.9% success); the error budget is the allowed shortfall — when it's spent, you slow feature work and prioritize reliability.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Metrics", v: "trends + alerting (RED/USE)" },
          { k: "Logs", v: "detailed discrete events" },
          { k: "Traces", v: "cross-service request flow" },
          { k: "SLO/budget", v: "target + allowed failure → priorities" },
        ],
      },
    ],
    whatIf: {
      q: "How does an error budget settle the 'ship features vs fix reliability' debate?",
      a: "It makes it data-driven: if you're within budget (meeting the SLO), you can keep shipping features; if you've burned the budget (too many errors/too slow), the policy is to freeze risky launches and invest in reliability until you're back under SLO. It removes the subjective tug-of-war.",
    },
    realWorld:
      "SRE practice: define a few meaningful SLIs (latency, availability), set SLOs, alert on error-budget burn rate (not every blip), and use the budget to balance velocity vs stability — far better than alerting on raw CPU.",
    interviewerExpectation: ["metrics/logs/traces", "SLI vs SLO vs error budget", "alert on symptoms/burn rate", "budget drives priorities", "RED/USE methods"],
    followUps: [
      "Why alert on SLO burn rate instead of CPU?",
      "RED vs USE method — what's the difference?",
      "What makes a good SLI?",
    ],
    commonMistakes: [
      "Logs only, no metrics/traces",
      "Alerting on causes (CPU) not symptoms (latency/errors)",
      "No SLOs / unbounded reliability debates",
    ],
    bestPractices: [
      "Instrument all three pillars (OpenTelemetry)",
      "Define SLIs/SLOs; alert on burn rate",
      "Use the error budget to set priorities",
    ],
    relatedTech: ["OpenTelemetry", "Prometheus/Grafana", "SRE", "PagerDuty"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft", "Deloitte"],
    related: ["distributed-tracing", "resilience-retries-timeouts"],
  },
  {
    slug: "microservice-versioning-contracts",
    categoryId: "microservices",
    topic: "Service Design",
    question: "How do you safely evolve a service's API/events without breaking consumers?",
    tags: ["contract testing", "schema evolution", "backward compatibility", "pact", "avro"],
    shortAnswer:
      "Change schemas additively (backward/forward compatible — add optional fields, never remove/repurpose), use a schema registry for events (Avro/Protobuf compatibility checks), and verify with consumer-driven contract tests (Pact) in CI so a breaking change fails before deploy. Deprecate with a window, never break silently.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Additive", v: "optional fields; tolerant readers" },
          { k: "Schema registry", v: "Avro/Protobuf compat enforcement" },
          { k: "Contract tests", v: "Pact catches breaks in CI" },
          { k: "Deprecate", v: "window + comms, never silent" },
        ],
      },
    ],
    whatIf: {
      q: "How do consumer-driven contract tests prevent a breaking change reaching prod?",
      a: "Consumers publish the shape they expect (a contract); the provider's CI verifies every change still satisfies all consumer contracts. If you remove/rename a field a consumer relies on, the provider build FAILS — so the break is caught at CI time, not by a 2am pager when a downstream service crashes.",
    },
    realWorld:
      "Independent deployability only works if changes are compatible; teams enforce it with schema-registry compatibility modes (for Kafka/Avro) and Pact contract tests so services can deploy independently without coordinated releases.",
    interviewerExpectation: ["additive/compatible changes", "tolerant reader", "schema registry compatibility", "consumer-driven contract tests (Pact)", "deprecation window"],
    followUps: [
      "Backward vs forward vs full compatibility?",
      "How does a schema registry enforce compatibility?",
      "How do contract tests differ from integration tests?",
    ],
    commonMistakes: [
      "Removing/renaming fields in place",
      "No compatibility checks on event schemas",
      "Coordinated 'big bang' releases (defeats independence)",
    ],
    bestPractices: [
      "Evolve schemas additively; tolerant readers",
      "Enforce compatibility via schema registry",
      "Use consumer-driven contract tests in CI",
    ],
    relatedTech: ["Pact", "Confluent Schema Registry", "Avro", "Protobuf"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "Deloitte"],
    related: ["api-backward-compatibility", "event-driven-kafka", "externalized-config"],
  },
];
