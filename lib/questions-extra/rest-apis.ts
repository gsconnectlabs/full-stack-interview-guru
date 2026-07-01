import type { Question } from "../types";

/**
 * REST API — flagship expansion batch (20 questions).
 * Enterprise & product-company patterns: API design, versioning, auth, rate
 * limiting, caching, error contracts, security (OWASP API), async/long-running,
 * batch APIs, gateways and webhooks. (Basic verbs/status-codes/idempotency/JWT
 * live in the base bank; these are distinct, deeper questions.)
 *
 * Difficulty mix: 4 Easy · 10 Medium · 6 Hard. Ordered easy → hard.
 */
export const restApisExtra: Question[] = [
  // ---------------------------------------------------------------- Easy (4)
  {
    slug: "put-vs-patch",
    categoryId: "rest-apis",
    topic: "HTTP Methods",
    question: "PUT vs PATCH — which do you use to update a resource, and why does it matter?",
    tags: ["put", "patch", "idempotency", "partial update", "rest"],
    shortAnswer:
      "PUT replaces the entire resource (send the full representation) and is idempotent. PATCH applies a partial modification (only changed fields) and isn't necessarily idempotent. Use PUT for full replacement, PATCH for partial updates — and document the PATCH format (merge vs JSON Patch).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "PUT", v: "full replace, idempotent" },
          { k: "PATCH", v: "partial update, maybe not idempotent" },
          { k: "Gotcha", v: "PUT with missing fields can null them" },
        ],
      },
    ],
    handsOn: {
      lang: "http",
      code: `PUT /users/101        { "name":"John", "email":"j@x.com" }  # full
PATCH /users/101      { "email":"new@x.com" }                # partial`,
    },
    whatIf: {
      q: "A client sends PUT with only the changed field and other fields get wiped — why?",
      a: "PUT means 'replace the whole resource' — fields omitted from the body are treated as removed/defaulted. The client either must send the complete representation with PUT, or use PATCH for partial updates. This is a very common API bug.",
    },
    realWorld:
      "Accidental data loss from partial PUTs is a frequent API bug; teams standardize on PATCH (often JSON Merge Patch) for edits and reserve PUT for full replacement or upsert.",
    interviewerExpectation: ["PUT replaces, PATCH partial", "PUT idempotent", "missing fields on PUT", "PATCH format (merge/JSON Patch)"],
    followUps: [
      "Is PATCH idempotent? When is it / isn't it?",
      "JSON Merge Patch vs JSON Patch (RFC 6902)?",
      "Can PUT create a resource (upsert)?",
    ],
    commonMistakes: [
      "Using PUT for partial updates (wipes fields)",
      "Assuming PATCH is always idempotent",
      "Not documenting the PATCH body format",
    ],
    bestPractices: [
      "PATCH for partial edits, PUT for full replace",
      "Pick and document a PATCH format",
      "Validate the full body on PUT",
    ],
    relatedTech: ["JSON Merge Patch", "JSON Patch (RFC 6902)", "idempotency"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Cognizant", "Accenture"],
    related: ["rest-statelessness", "idempotency-keys"],
  },
  {
    slug: "path-query-body-params",
    categoryId: "rest-apis",
    topic: "HTTP Methods",
    question: "When do you use path params vs query params vs the request body?",
    tags: ["path params", "query params", "request body", "api design"],
    shortAnswer:
      "Path params identify a resource (/orders/42). Query params filter/sort/paginate or pass optional modifiers (?status=open&page=2). The body carries the resource payload for POST/PUT/PATCH. Don't put sensitive data in the URL — it's logged and cached.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Path", v: "identify a resource: /orders/42" },
          { k: "Query", v: "filter/sort/paginate: ?status=open" },
          { k: "Body", v: "payload for create/update" },
        ],
      },
    ],
    whatIf: {
      q: "Why shouldn't you pass an API token or password as a query parameter?",
      a: "URLs (including query strings) are logged by servers/proxies, stored in browser history, and may be cached or appear in Referer headers — leaking the secret. Put credentials in the Authorization header (or body over HTTPS), never the URL.",
    },
    realWorld:
      "Leaking tokens via query strings into access logs is a real security finding; the convention 'path = identity, query = filters, header = auth, body = payload' keeps APIs clean and safe.",
    interviewerExpectation: ["path identifies resource", "query filters/optional", "body = payload", "no secrets in URL", "URLs are logged/cached"],
    followUps: [
      "Where do you put a date range — query or body?",
      "When is a POST with a body acceptable for a 'search'?",
      "How long can a URL safely be?",
    ],
    commonMistakes: [
      "Secrets/PII in query strings",
      "Filters in the path instead of query",
      "GET with a body (poorly supported)",
    ],
    bestPractices: [
      "Path = identity, query = filters, body = payload",
      "Auth via Authorization header",
      "Keep URLs free of sensitive data",
    ],
    relatedTech: ["Authorization header", "URL encoding", "HTTPS"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["TCS", "Infosys", "Wipro", "Capgemini"],
    related: ["api-auth-oauth-jwt", "rest-pagination-filtering"],
  },
  {
    slug: "rest-statelessness",
    categoryId: "rest-apis",
    topic: "Auth",
    question: "What does 'stateless' mean in REST, and how does it enable horizontal scaling?",
    tags: ["stateless", "session", "scaling", "load balancing", "rest"],
    shortAnswer:
      "Each request must carry everything the server needs (auth token, params) — the server keeps no client session between requests. That lets any instance handle any request, so you can scale out behind a load balancer without sticky sessions.",
    mindMap: [
      { type: "text", content: "Stateless = no server-side session tied to a client. Every request is self-contained, so request #2 can hit a different instance than request #1 with no shared memory needed." },
    ],
    whatIf: {
      q: "If REST is stateless, where does session/login state go?",
      a: "Into a self-contained token (JWT) the client sends each request, or into a shared external store (Redis) all instances read. The key is the app server stays stateless — state lives in the token or a shared store, not in instance memory.",
    },
    realWorld:
      "Statelessness is why you can autoscale API pods freely; the moment someone stores session in instance memory, you need sticky sessions and lose elastic scaling — a common scaling regression.",
    interviewerExpectation: ["self-contained requests", "no server session", "any instance handles any request", "token or shared store for state", "no sticky sessions"],
    followUps: [
      "What breaks if you store session in instance memory?",
      "JWT vs server-side session in Redis — trade-offs?",
      "How do you handle logout with stateless JWTs?",
    ],
    commonMistakes: [
      "Storing session state in instance memory",
      "Requiring sticky sessions (defeats scaling)",
      "Confusing statelessness with 'no database'",
    ],
    bestPractices: [
      "Keep app servers stateless",
      "Use tokens or a shared store for state",
      "Avoid sticky sessions where possible",
    ],
    relatedTech: ["JWT", "Redis", "load balancer", "Kubernetes HPA"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "Cognizant", "Deloitte"],
    related: ["api-auth-oauth-jwt", "api-gateway"],
  },
  {
    slug: "content-negotiation",
    categoryId: "rest-apis",
    topic: "HTTP Methods",
    question: "How does HTTP content negotiation work (Accept vs Content-Type)?",
    tags: ["content negotiation", "accept", "content-type", "media type"],
    shortAnswer:
      "Content-Type describes the body the sender is providing; Accept tells the server what the client wants back. The server picks a representation matching Accept (or returns 406 Not Acceptable). This also powers media-type API versioning.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Content-Type", v: "format of THIS request/response body" },
          { k: "Accept", v: "formats the client will accept back" },
          { k: "406", v: "server can't meet the Accept" },
          { k: "415", v: "server can't read the Content-Type" },
        ],
      },
    ],
    whatIf: {
      q: "A client gets 415 Unsupported Media Type on a POST — what's wrong?",
      a: "The client sent a body in a format the endpoint doesn't accept (or omitted/typo'd Content-Type, e.g. sending JSON without Content-Type: application/json). Set the correct Content-Type so the server picks the right parser.",
    },
    realWorld:
      "Content negotiation underlies returning JSON vs CSV from the same endpoint and media-type versioning (application/vnd.myapi.v2+json); 415/406 errors are everyday API debugging.",
    interviewerExpectation: ["Content-Type = body format", "Accept = desired response", "406 vs 415", "media-type versioning"],
    followUps: [
      "406 vs 415 — which is which?",
      "How does media-type versioning use Accept?",
      "How would you serve both JSON and CSV from one endpoint?",
    ],
    commonMistakes: [
      "Omitting Content-Type on JSON POSTs",
      "Confusing Accept with Content-Type",
      "Returning 400 where 415/406 fits",
    ],
    bestPractices: [
      "Always set Content-Type on requests with a body",
      "Use Accept for negotiation",
      "Return precise 406/415 codes",
    ],
    relatedTech: ["media types", "Spring @RequestMapping produces/consumes", "vendor media types"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "Accenture", "Deloitte"],
    related: ["api-versioning", "api-error-handling"],
  },

  // -------------------------------------------------------------- Medium (10)
  {
    slug: "api-versioning",
    categoryId: "rest-apis",
    topic: "Versioning",
    question: "What are the API versioning strategies, and which do you choose for a public API?",
    tags: ["versioning", "uri versioning", "header versioning", "media type", "backward compatibility"],
    shortAnswer:
      "URI versioning (/v1/orders) — simplest, most visible, most common. Header/media-type versioning (Accept: ...v2+json) — cleaner URLs, harder to test. Query param (?version=2) — easy but messy. For public APIs, URI versioning wins on clarity; whichever you pick, additive changes shouldn't need a new version.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "URI /v1/", v: "visible, cache-friendly, most common" },
          { k: "Header/media-type", v: "clean URLs, harder to test" },
          { k: "Query ?v=2", v: "easy but clutters" },
          { k: "Best", v: "version only on breaking changes" },
        ],
      },
    ],
    whatIf: {
      q: "Which changes require a new API version vs which are safe to add in place?",
      a: "Additive, non-breaking changes (new optional fields, new endpoints, new optional params) should NOT bump the version — clients ignore what they don't know. Only breaking changes (removing/renaming fields, changing types/semantics, making a field required) warrant a new version.",
    },
    realWorld:
      "Most public APIs (Stripe, GitHub) version deliberately and rarely; the discipline is designing additively so you almost never need v2 — versioning is the escape hatch, not the default.",
    interviewerExpectation: ["URI vs header vs query", "URI most common for public", "additive vs breaking changes", "minimize version bumps"],
    followUps: [
      "How does Stripe version with a date header?",
      "What counts as a breaking change?",
      "How long do you support old versions (deprecation)?",
    ],
    commonMistakes: [
      "Versioning for additive changes",
      "Never deprecating old versions",
      "Inconsistent versioning across endpoints",
    ],
    bestPractices: [
      "Design additively to avoid version bumps",
      "Version on breaking changes only",
      "Publish a deprecation policy/timeline",
    ],
    relatedTech: ["URI versioning", "media-type versioning", "OpenAPI"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["api-backward-compatibility", "content-negotiation"],
  },
  {
    slug: "rest-pagination-filtering",
    categoryId: "rest-apis",
    topic: "Versioning",
    question: "How do you design pagination, filtering and sorting for a list endpoint?",
    tags: ["pagination", "filtering", "sorting", "cursor", "api design"],
    shortAnswer:
      "Support filtering via query params, sorting via ?sort=field,-field, and pagination via cursor (?cursor=...&limit=) for large/real-time data or page/size for small admin lists. Always cap the page size, return total/next-cursor metadata, and keep results stably ordered.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Filter", v: "?status=open&created_after=..." },
          { k: "Sort", v: "?sort=-created_at,id" },
          { k: "Paginate", v: "cursor for scale; page/size for small sets" },
          { k: "Always", v: "cap limit, stable order, next-cursor meta" },
        ],
      },
    ],
    whatIf: {
      q: "Why prefer cursor pagination over page/offset for a large, frequently-changing list?",
      a: "Offset gets slower the deeper you page and can skip/duplicate rows when items are inserted/deleted between requests. A cursor (keyset) seeks via an indexed key — constant time and stable under concurrent changes. (Same reason as DB keyset pagination.)",
    },
    realWorld:
      "Public list endpoints expose opaque `next` cursors and capped limits; uncapped page sizes and offset pagination are common causes of API DoS and slow deep pages.",
    interviewerExpectation: ["query-based filter/sort", "cursor vs offset", "cap page size", "return pagination metadata", "stable ordering"],
    followUps: [
      "How do you make a cursor opaque and stable?",
      "How do you prevent clients requesting limit=1000000?",
      "How does sort interact with cursor stability?",
    ],
    commonMistakes: [
      "Uncapped page sizes (DoS risk)",
      "Offset pagination on huge/live lists",
      "Unstable sort breaking cursors",
    ],
    bestPractices: [
      "Cap and default the limit",
      "Use cursor pagination at scale",
      "Return next-cursor + (optional) total",
    ],
    relatedTech: ["cursor pagination", "keyset pagination", "OpenAPI"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["keyset-vs-offset-pagination", "api-versioning"],
  },
  {
    slug: "idempotency-keys",
    categoryId: "rest-apis",
    topic: "Idempotency",
    question: "How do you make a POST safe to retry using idempotency keys?",
    tags: ["idempotency key", "post", "retry", "exactly-once", "payments"],
    shortAnswer:
      "The client sends a unique Idempotency-Key header per logical operation. The server stores the key with the first result; on a retry with the same key it returns the original response instead of re-processing — turning an unsafe POST into a safe-to-retry one.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Client", v: "unique Idempotency-Key per operation" },
          { k: "First call", v: "process + persist (key → result)" },
          { k: "Retry (same key)", v: "return stored result, no re-process" },
        ],
      },
    ],
    handsOn: {
      lang: "http",
      code: `POST /payments
Idempotency-Key: 3f1c-...-9a
{ "amount": 5000, "currency": "INR" }
# retry with same key → same 201 + same payment, no double charge`,
    },
    whatIf: {
      q: "Two identical requests with the same key arrive concurrently — how do you avoid double processing?",
      a: "Insert the key into a unique-constrained store (DB unique index / Redis SETNX) BEFORE processing. The first wins and processes; the concurrent one hits the constraint and either waits for / returns the in-flight result. The unique key is the concurrency guard.",
    },
    realWorld:
      "Payment and order APIs (Stripe) require idempotency keys so client retries after a timeout don't double-charge; it's the standard pattern for safe POST retries over flaky networks.",
    interviewerExpectation: ["unique key per operation", "store key→result", "return original on retry", "unique-constraint guards concurrency", "key TTL/scope"],
    followUps: [
      "How long do you retain idempotency keys?",
      "How does this relate to exactly-once semantics?",
      "What's the scope of a key (per-endpoint, per-user)?",
    ],
    commonMistakes: [
      "Processing before persisting the key (race window)",
      "No TTL/cleanup for stored keys",
      "Reusing keys across different operations",
    ],
    bestPractices: [
      "Persist the key atomically before processing",
      "Return the stored response on duplicates",
      "Define key scope + retention",
    ],
    relatedTech: ["Redis SETNX", "DB unique index", "Stripe idempotency"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "banking", "Deloitte"],
    related: ["put-vs-patch", "webhooks-design", "async-rest-long-running"],
  },
  {
    slug: "api-auth-oauth-jwt",
    categoryId: "rest-apis",
    topic: "Auth",
    question: "API keys vs OAuth2 vs JWT — when do you use each for API auth?",
    tags: ["oauth2", "jwt", "api key", "authentication", "authorization"],
    shortAnswer:
      "API keys: simple service/server identification (no user context). OAuth2: delegated authorization — third parties act on a user's behalf without their password (access + refresh tokens). JWT: a token FORMAT often used as the OAuth2 access token. They're complementary, not competing.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "API key", v: "identify a service/app, simple" },
          { k: "OAuth2", v: "delegated authZ, access+refresh tokens" },
          { k: "JWT", v: "a token format (often the access token)" },
        ],
      },
    ],
    whatIf: {
      q: "Why are short-lived access tokens + refresh tokens better than one long-lived token?",
      a: "A short-lived access token limits the damage window if leaked; the refresh token (stored more securely, revocable) mints new access tokens without re-login. You get both security (short exposure) and UX (no constant logins), plus a revocation point.",
    },
    realWorld:
      "Typical setup: OAuth2 issues short-lived JWT access tokens + refresh tokens for user-facing apps, while server-to-server integrations use API keys or client-credentials OAuth — chosen by who the caller is.",
    interviewerExpectation: ["API key = service identity", "OAuth2 = delegated authZ", "JWT = format not protocol", "access vs refresh tokens", "short-lived + revocation"],
    followUps: [
      "AuthN vs AuthZ — which does OAuth2 do?",
      "How do you revoke a stateless JWT?",
      "What is the client-credentials grant for?",
    ],
    commonMistakes: [
      "Calling JWT an alternative to OAuth2",
      "Long-lived access tokens with no refresh/revocation",
      "Putting secrets/PII in the JWT payload",
    ],
    bestPractices: [
      "Short-lived access + refresh tokens",
      "Use scopes for least-privilege",
      "Validate signature, exp, audience, issuer",
    ],
    relatedTech: ["OAuth2", "OIDC", "JWT", "API gateway"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "Deloitte"],
    related: ["rest-statelessness", "api-security-bola", "api-gateway"],
  },
  {
    slug: "rate-limiting",
    categoryId: "rest-apis",
    topic: "Auth",
    question: "How do you design API rate limiting, and what do you return when a client exceeds it?",
    tags: ["rate limiting", "token bucket", "429", "retry-after", "throttling"],
    shortAnswer:
      "Use a token-bucket or sliding-window limiter keyed per client/API key (in Redis for distributed enforcement). On exceed, return 429 Too Many Requests with a Retry-After header; expose limit/remaining/reset headers so well-behaved clients can self-throttle.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Algorithm", v: "token bucket / sliding window" },
          { k: "Key by", v: "API key / user / IP" },
          { k: "Exceed", v: "429 + Retry-After" },
          { k: "Headers", v: "X-RateLimit-Limit/Remaining/Reset" },
        ],
      },
    ],
    whatIf: {
      q: "Why does rate limiting need a shared store like Redis in a multi-instance deployment?",
      a: "Per-instance counters let a client multiply their limit by the number of instances (and counts reset on deploys). A shared store (Redis) — or the API gateway — enforces one global limit across all instances consistently.",
    },
    realWorld:
      "Rate limiting protects against abuse, runaway clients, and cost blowouts; it's usually enforced at the API gateway with Redis-backed counters and standard 429 + Retry-After semantics.",
    interviewerExpectation: ["token bucket/sliding window", "per-client key", "429 + Retry-After", "rate-limit headers", "shared store for distributed"],
    followUps: [
      "Token bucket vs sliding window vs fixed window?",
      "Where do you enforce it — gateway or app?",
      "How do you handle burst vs sustained rate?",
    ],
    commonMistakes: [
      "Per-instance counters (limit multiplied)",
      "Returning 503 instead of 429",
      "No Retry-After / rate headers",
    ],
    bestPractices: [
      "Enforce centrally (gateway + Redis)",
      "Return 429 + Retry-After + limit headers",
      "Tune burst vs sustained with token bucket",
    ],
    relatedTech: ["Redis", "API gateway", "Resilience4j RateLimiter", "Bucket4j"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["api-gateway", "rest-vs-graphql-grpc"],
  },
  {
    slug: "api-error-handling",
    categoryId: "rest-apis",
    topic: "Status Codes",
    question: "How do you design consistent, useful API error responses?",
    tags: ["error handling", "problem details", "rfc 7807", "status codes", "api design"],
    shortAnswer:
      "Use correct HTTP status codes plus a consistent machine-readable error body (RFC 7807 Problem Details: type, title, status, detail, instance, plus a stable error code and field-level validation errors). Never leak stack traces; include a correlation id for support.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Status code", v: "right 4xx/5xx" },
          { k: "Body (RFC 7807)", v: "type/title/status/detail" },
          { k: "Add", v: "stable error code + field errors + traceId" },
          { k: "Never", v: "stack traces / internal details" },
        ],
      },
    ],
    handsOn: {
      lang: "json",
      code: `{
  "type": "https://api.x.com/errors/validation",
  "title": "Validation failed",
  "status": 400,
  "code": "ORDER_INVALID",
  "errors": [{ "field": "amount", "message": "must be > 0" }],
  "traceId": "abc-123"
}`,
    },
    whatIf: {
      q: "Why is a stable machine-readable 'error code' better than relying on the HTTP status alone?",
      a: "Many distinct failures map to the same status (400 covers dozens of validation errors). A stable code (ORDER_INVALID) lets clients branch logic and lets you change wording without breaking them — the status says the category, the code says the exact reason.",
    },
    realWorld:
      "Inconsistent error shapes across endpoints are a top API-consumer complaint; standardizing on RFC 7807 + stable error codes + a correlation id (for log lookup) is the enterprise norm.",
    interviewerExpectation: ["correct status codes", "RFC 7807 / consistent body", "stable error codes", "field-level validation errors", "correlation id, no stack traces"],
    followUps: [
      "How do field-level validation errors look?",
      "Why include a correlation/trace id?",
      "Where do you centralize error mapping (e.g. @ControllerAdvice)?",
    ],
    commonMistakes: [
      "Leaking stack traces / internal messages",
      "Inconsistent error shapes per endpoint",
      "Using 200 with an error in the body",
    ],
    bestPractices: [
      "Adopt RFC 7807 + stable error codes",
      "Centralize mapping (@ControllerAdvice)",
      "Always include a traceId; never leak internals",
    ],
    relatedTech: ["RFC 7807 Problem Details", "@ControllerAdvice", "OpenTelemetry"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Cognizant"],
    related: ["content-negotiation", "api-versioning"],
  },
  {
    slug: "richardson-maturity-hateoas",
    categoryId: "rest-apis",
    topic: "HATEOAS",
    question: "What is the Richardson Maturity Model, and is HATEOAS worth implementing?",
    tags: ["hateoas", "richardson maturity model", "rest", "hypermedia"],
    shortAnswer:
      "It grades REST maturity: L0 (RPC over HTTP), L1 (resources), L2 (HTTP verbs + status codes — where most 'REST' APIs sit), L3 (HATEOAS: responses include hypermedia links to next actions). HATEOAS adds discoverability but real-world adoption is low due to client complexity.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "L0", v: "one endpoint, RPC-style" },
          { k: "L1", v: "multiple resources" },
          { k: "L2", v: "proper verbs + status codes (most APIs)" },
          { k: "L3", v: "HATEOAS — hypermedia links" },
        ],
      },
    ],
    whatIf: {
      q: "Why do most production APIs stop at Level 2 instead of full HATEOAS?",
      a: "HATEOAS promises clients that discover actions via links, but in practice clients hard-code URLs anyway, and building/consuming hypermedia adds complexity for little payoff. Most teams get the value (resources + verbs + codes) at L2 and skip L3.",
    },
    realWorld:
      "Knowing the model helps you discuss API design maturity in interviews; pragmatically, most 'RESTful' APIs are Level 2, and that's a defensible, common choice.",
    interviewerExpectation: ["four levels", "L2 = verbs+codes (most APIs)", "L3 = HATEOAS/hypermedia", "discoverability vs client complexity", "pragmatic adoption"],
    followUps: [
      "What does a HATEOAS response look like (_links)?",
      "When is hypermedia actually valuable?",
      "Is GraphQL a different answer to discoverability?",
    ],
    commonMistakes: [
      "Claiming an API is 'fully REST' without HATEOAS (it's L2)",
      "Over-engineering hypermedia clients ignore",
      "Confusing the model levels",
    ],
    bestPractices: [
      "Aim for solid Level 2 by default",
      "Add hypermedia only where it pays off",
      "Document the contract regardless (OpenAPI)",
    ],
    relatedTech: ["HAL", "Spring HATEOAS", "OpenAPI"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Microsoft"],
    related: ["rest-vs-graphql-grpc", "api-versioning"],
  },
  {
    slug: "http-caching-etag",
    categoryId: "rest-apis",
    topic: "Status Codes",
    question: "How do ETags and Cache-Control make APIs faster and prevent lost updates?",
    tags: ["etag", "cache-control", "conditional request", "304", "optimistic concurrency"],
    shortAnswer:
      "Cache-Control/max-age lets clients/CDNs reuse responses. ETags enable conditional GETs (If-None-Match → 304 Not Modified, saving bandwidth) and conditional writes (If-Match → 412 Precondition Failed) for optimistic concurrency, preventing lost updates.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Cache-Control", v: "max-age / no-store caching rules" },
          { k: "ETag + If-None-Match", v: "GET → 304 if unchanged" },
          { k: "ETag + If-Match", v: "write → 412 if changed (concurrency)" },
        ],
      },
    ],
    handsOn: {
      lang: "http",
      code: `GET /orders/42         -> 200 ETag: "v7"
GET /orders/42 If-None-Match: "v7"  -> 304 Not Modified
PUT /orders/42 If-Match: "v7"       -> 412 if someone else changed it`,
    },
    whatIf: {
      q: "How does If-Match prevent two users from overwriting each other's edit?",
      a: "Each response carries an ETag (a version). A client must send If-Match: <etag> on update; if the resource changed since they read it, the ETag won't match and the server returns 412 Precondition Failed — the classic optimistic-concurrency 'someone else edited this' guard.",
    },
    realWorld:
      "ETags power both bandwidth savings (304s on unchanged resources, big for mobile) and HTTP-level optimistic locking (412 on concurrent edits) — used by GitHub, S3, and many APIs.",
    interviewerExpectation: ["Cache-Control caching", "ETag conditional GET → 304", "If-Match → 412 concurrency", "lost-update prevention"],
    followUps: [
      "Strong vs weak ETags?",
      "How does this map to DB optimistic locking?",
      "When use no-store vs no-cache?",
    ],
    commonMistakes: [
      "No caching headers on cacheable GETs",
      "Ignoring concurrency (last-write-wins)",
      "Caching user-specific data publicly",
    ],
    bestPractices: [
      "Set Cache-Control appropriately per resource",
      "Use ETags for 304s and conditional writes",
      "Mark private/user data no-store",
    ],
    relatedTech: ["ETag", "CDN", "optimistic locking", "Cache-Control"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["optimistic-vs-pessimistic-locking", "api-gateway"],
  },
  {
    slug: "cors",
    categoryId: "rest-apis",
    topic: "Auth",
    question: "What is CORS, why does the browser block requests, and how do you fix it correctly?",
    tags: ["cors", "preflight", "same-origin", "browser security", "options"],
    shortAnswer:
      "CORS is a browser security mechanism: by default a page can't read responses from a different origin unless the server sends Access-Control-Allow-Origin (and friends). The browser may send a preflight OPTIONS first. Fix it on the SERVER by allowing the specific origin/methods/headers — not with a wildcard for credentialed requests.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Why", v: "browser same-origin policy" },
          { k: "Preflight", v: "OPTIONS for non-simple requests" },
          { k: "Fix", v: "server: Access-Control-Allow-* headers" },
          { k: "Credentials", v: "no '*' with cookies — name the origin" },
        ],
      },
    ],
    whatIf: {
      q: "CORS works in Postman but fails in the browser — why?",
      a: "CORS is enforced ONLY by browsers — Postman/curl ignore it. The request itself succeeds; the browser blocks the page from READING the response because the server didn't return the right Access-Control-Allow-Origin. The fix is server-side CORS config, not client code.",
    },
    realWorld:
      "CORS errors are a daily frontend↔API friction; the fix is always configuring allowed origins/methods/headers on the server (or gateway), and never '*' when cookies/credentials are involved.",
    interviewerExpectation: ["browser same-origin policy", "preflight OPTIONS", "server-side Allow-* headers", "no wildcard with credentials", "not enforced outside browsers"],
    followUps: [
      "What makes a request 'simple' vs 'preflighted'?",
      "Why can't you use '*' with credentials: include?",
      "Where do you configure CORS — app or gateway?",
    ],
    commonMistakes: [
      "Trying to fix CORS on the client",
      "Allow-Origin '*' with credentials",
      "Forgetting to allow custom headers/methods",
    ],
    bestPractices: [
      "Configure CORS server/gateway-side",
      "Allow specific origins for credentialed requests",
      "Limit allowed methods/headers to what's needed",
    ],
    relatedTech: ["Spring CORS config", "API gateway", "same-origin policy"],
    difficulty: "Medium",
    experience: ["3-5 years"],
    askedIn: ["Amazon", "Cognizant", "Accenture", "Wipro"],
    related: ["api-gateway", "api-auth-oauth-jwt"],
  },
  {
    slug: "rest-vs-graphql-grpc",
    categoryId: "rest-apis",
    topic: "HATEOAS",
    question: "REST vs GraphQL vs gRPC — when would you choose each?",
    tags: ["rest", "graphql", "grpc", "api design", "protobuf"],
    shortAnswer:
      "REST: resource CRUD, public APIs, cache-friendly, ubiquitous. GraphQL: clients need flexible, exact field selection across many resources (avoids over/under-fetching) — great for varied frontends. gRPC: high-performance internal service-to-service (HTTP/2, Protobuf, streaming, codegen).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "REST", v: "public CRUD, cacheable, simple" },
          { k: "GraphQL", v: "client-shaped queries, no over-fetch" },
          { k: "gRPC", v: "internal, fast, Protobuf, streaming" },
        ],
      },
    ],
    whatIf: {
      q: "A mobile app over-fetches huge REST payloads and makes many round-trips — REST tweak or GraphQL?",
      a: "You can fix REST with sparse fieldsets (?fields=) and composite endpoints, but if many clients need wildly different shapes across many resources, GraphQL lets each client request exactly what it needs in one round-trip. Choose by how variable the client needs are vs added server complexity.",
    },
    realWorld:
      "Common architecture: REST/GraphQL at the public edge for clients, gRPC for fast internal service-to-service calls — each used where its strengths fit, not dogmatically.",
    interviewerExpectation: ["REST public/cacheable", "GraphQL flexible field selection / over-fetch", "gRPC internal/HTTP2/Protobuf/streaming", "choose by use case"],
    followUps: [
      "What problems does GraphQL introduce (caching, N+1, complexity)?",
      "Why is gRPC poor for browsers directly?",
      "How do you cache GraphQL?",
    ],
    commonMistakes: [
      "Picking GraphQL/gRPC by hype, not need",
      "Ignoring GraphQL's caching/N+1 challenges",
      "Exposing gRPC directly to browsers",
    ],
    bestPractices: [
      "Match protocol to the use case",
      "REST/GraphQL at the edge, gRPC internally",
      "Weigh added complexity vs benefit",
    ],
    relatedTech: ["GraphQL", "gRPC", "Protobuf", "HTTP/2"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["richardson-maturity-hateoas", "api-gateway"],
  },

  // ---------------------------------------------------------------- Hard (6)
  {
    slug: "api-security-bola",
    categoryId: "rest-apis",
    topic: "Auth",
    question: "What are the top API security risks (OWASP API), and how do you prevent BOLA?",
    tags: ["api security", "owasp", "bola", "idor", "authorization"],
    shortAnswer:
      "The #1 OWASP API risk is BOLA/IDOR — Broken Object Level Authorization: a user requests /orders/{id} for an id they don't own and the server returns it because it only checks authentication, not ownership. Prevent it by enforcing per-object authorization on every request, server-side.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "BOLA/IDOR", v: "access others' objects by guessing ids" },
          { k: "Cause", v: "auth check ≠ ownership check" },
          { k: "Fix", v: "verify caller owns/can access THIS object" },
          { k: "Also", v: "broken auth, excessive data exposure, no rate limit" },
        ],
      },
    ],
    whatIf: {
      q: "Does using a random UUID instead of a sequential id fix BOLA?",
      a: "No — that's security by obscurity. UUIDs are harder to guess but still leak (logs, referrals, shared links). The real fix is an authorization check: does THIS authenticated user have the right to THIS object? Enforce it on every read/write, never trust the id alone.",
    },
    realWorld:
      "BOLA is the most common and damaging real-world API vulnerability (mass data exposure by iterating ids). The durable fix is centralized per-object authorization, often verified by automated tests that try cross-tenant access.",
    interviewerExpectation: ["BOLA/IDOR #1", "authN vs object-level authZ", "check ownership per request", "UUID ≠ fix", "OWASP API top risks"],
    followUps: [
      "Why is UUID not an authorization control?",
      "How do you test for BOLA automatically?",
      "What are excessive data exposure and mass assignment?",
    ],
    commonMistakes: [
      "Checking authentication but not ownership",
      "Relying on unguessable ids for security",
      "Returning full objects (excessive data exposure)",
    ],
    bestPractices: [
      "Enforce object-level authorization everywhere",
      "Centralize authZ; test cross-tenant access",
      "Return only needed fields (DTOs)",
    ],
    relatedTech: ["OWASP API Top 10", "Spring Security", "OPA/policy engines"],
    references: [{ label: "OWASP API Security Top 10", url: "https://owasp.org/API-Security/editions/2023/en/0x11-t10/" }],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "banking"],
    related: ["api-auth-oauth-jwt", "api-gateway"],
  },
  {
    slug: "api-backward-compatibility",
    categoryId: "rest-apis",
    topic: "Versioning",
    question: "How do you evolve a public API without breaking existing clients?",
    tags: ["backward compatibility", "deprecation", "contract", "breaking change", "api design"],
    shortAnswer:
      "Change additively: add optional fields/endpoints, never remove or repurpose existing ones, keep defaults stable, and tolerate unknown fields. For unavoidable breaks, introduce a new version, support both during a published deprecation window, and communicate via docs + Deprecation/Sunset headers.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Safe", v: "add optional fields/endpoints" },
          { k: "Breaking", v: "remove/rename/retype/make-required" },
          { k: "Process", v: "new version + deprecation window" },
          { k: "Signal", v: "Deprecation/Sunset headers + docs" },
        ],
      },
    ],
    whatIf: {
      q: "You must remove a field thousands of clients still use — what's the rollout?",
      a: "Don't remove it abruptly. Mark it deprecated in docs and via Deprecation/Sunset headers, monitor who still uses it (telemetry), reach out to those consumers, keep it working through the announced window, then remove only after usage drops — ideally behind a new version.",
    },
    realWorld:
      "Stripe/GitHub-style API longevity comes from additive evolution + clear deprecation policies; the costliest API mistakes are silent breaking changes that take down integrations.",
    interviewerExpectation: ["additive changes", "what counts as breaking", "tolerant reader", "deprecation window + headers", "usage telemetry"],
    followUps: [
      "What is the 'tolerant reader' principle?",
      "How do consumer-driven contract tests help?",
      "How do you measure who still uses a deprecated field?",
    ],
    commonMistakes: [
      "Removing/renaming fields in place",
      "Repurposing an existing field's meaning",
      "No deprecation communication",
    ],
    bestPractices: [
      "Evolve additively; tolerate unknown fields",
      "Publish + signal deprecations (Sunset header)",
      "Use contract tests + usage telemetry",
    ],
    relatedTech: ["OpenAPI", "Pact (contract testing)", "Deprecation/Sunset headers"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "Stripe-like"],
    related: ["api-versioning", "rest-vs-graphql-grpc"],
  },
  {
    slug: "async-rest-long-running",
    categoryId: "rest-apis",
    topic: "Idempotency",
    question: "How do you design a REST API for a long-running operation (can't finish in one request)?",
    tags: ["async api", "202 accepted", "polling", "webhooks", "long-running"],
    shortAnswer:
      "Don't block the request. Return 202 Accepted with a status URL (Location). The client polls GET /operations/{id} for state (pending/succeeded/failed) and the result link — or you notify via webhook on completion. Make the trigger idempotent so retries don't start duplicate jobs.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Trigger", v: "POST → 202 Accepted + Location" },
          { k: "Poll", v: "GET /operations/{id} → status + result" },
          { k: "Or push", v: "webhook on completion" },
          { k: "Guard", v: "idempotent trigger (no duplicate jobs)" },
        ],
      },
    ],
    handsOn: {
      lang: "http",
      code: `POST /reports        -> 202 Accepted
                        Location: /operations/op_123
GET /operations/op_123 -> 200 { "status":"running" }
                        ... later ...
                     -> 200 { "status":"done", "result":"/reports/9" }`,
    },
    whatIf: {
      q: "Why not just hold the HTTP connection open until the job finishes?",
      a: "Long-held connections hit client/proxy/gateway timeouts, tie up server threads, and can't survive a restart or retry safely. The async (202 + poll/webhook) pattern decouples request duration from job duration and is resilient to retries and failures.",
    },
    realWorld:
      "Report generation, video processing, bulk imports use 202 + status resource (or webhooks); cloud APIs (AWS, GCP) expose exactly this 'operation resource' pattern for long tasks.",
    interviewerExpectation: ["202 Accepted + status URL", "poll vs webhook", "idempotent trigger", "avoid long-held connections", "operation resource"],
    followUps: [
      "Polling vs webhooks — trade-offs?",
      "How do you make the trigger idempotent?",
      "How do you handle job failure/retry status?",
    ],
    commonMistakes: [
      "Blocking the request until completion (timeouts)",
      "Non-idempotent trigger spawning duplicate jobs",
      "No way to query job status",
    ],
    bestPractices: [
      "Return 202 + a queryable operation resource",
      "Offer webhooks for completion",
      "Make the trigger idempotent",
    ],
    relatedTech: ["202 Accepted", "webhooks", "message queue", "cloud operation APIs"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google"],
    related: ["idempotency-keys", "webhooks-design", "bulk-batch-apis"],
  },
  {
    slug: "bulk-batch-apis",
    categoryId: "rest-apis",
    topic: "Status Codes",
    question: "How do you design a bulk/batch API and handle partial failures?",
    tags: ["bulk api", "batch", "partial failure", "207 multi-status", "idempotency"],
    shortAnswer:
      "Accept an array of items, cap the batch size, and decide the failure model: all-or-nothing (transactional) or best-effort with per-item results. For best-effort, return a per-item status array (or 207 Multi-Status) so clients know exactly which items succeeded/failed and can retry just the failures.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "All-or-nothing", v: "transactional; one fails → all roll back" },
          { k: "Best-effort", v: "per-item results, partial success" },
          { k: "Response", v: "per-item status / 207 Multi-Status" },
          { k: "Always", v: "cap batch size; idempotent items" },
        ],
      },
    ],
    handsOn: {
      lang: "json",
      code: `POST /orders/batch
{ "items": [ {...}, {...}, {...} ] }
-->
{ "results": [
  { "index":0, "status":201, "id":"o1" },
  { "index":1, "status":422, "error":"INVALID_SKU" },
  { "index":2, "status":201, "id":"o3" }
]}`,
    },
    whatIf: {
      q: "A client retries a failed batch — how do you avoid duplicating the items that already succeeded?",
      a: "Make each item idempotent (client supplies a per-item key, or you dedupe on a natural key). On retry, already-processed items return their prior result instead of re-creating. Per-item idempotency is what makes batch retries safe under partial failure.",
    },
    realWorld:
      "Bulk import/sync APIs (and email/SMS/order batch endpoints) return per-item results so clients retry only the failures; capping batch size protects the server from giant payloads.",
    interviewerExpectation: ["all-or-nothing vs best-effort", "per-item result / 207", "cap batch size", "per-item idempotency for retries", "clear partial-failure contract"],
    followUps: [
      "When is transactional (all-or-nothing) the right model?",
      "How does 207 Multi-Status work?",
      "How do you keep batch processing within timeouts?",
    ],
    commonMistakes: [
      "Single status code hiding partial failures",
      "Uncapped batch sizes",
      "Non-idempotent items breaking retries",
    ],
    bestPractices: [
      "Return per-item status; document the failure model",
      "Cap and validate batch size",
      "Make items idempotent for safe retries",
    ],
    relatedTech: ["207 Multi-Status", "idempotency keys", "message queues"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["idempotency-keys", "async-rest-long-running"],
  },
  {
    slug: "api-gateway",
    categoryId: "rest-apis",
    topic: "Auth",
    question: "What does an API gateway do, and why put one in front of your services?",
    tags: ["api gateway", "cross-cutting", "auth", "rate limiting", "routing"],
    shortAnswer:
      "A gateway is a single entry point that handles cross-cutting concerns — authentication, rate limiting, routing/load balancing, TLS termination, request/response transformation, caching, and observability — so individual services don't each reimplement them. It also decouples clients from internal service topology.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Cross-cutting", v: "auth, rate limit, TLS, logging" },
          { k: "Routing", v: "path → service, load balance" },
          { k: "Decouple", v: "clients don't know internal topology" },
          { k: "Risk", v: "can become a bottleneck / SPOF" },
        ],
      },
    ],
    whatIf: {
      q: "What's the downside of putting business logic in the gateway?",
      a: "It becomes a fat, shared bottleneck and a single point of failure, couples teams to one deploy, and is hard to test. Keep the gateway to generic cross-cutting concerns; business logic belongs in the services (and run the gateway redundantly).",
    },
    realWorld:
      "API gateways (Kong, AWS API Gateway, Spring Cloud Gateway) centralize auth/rate-limit/routing in microservices; the anti-pattern is an 'ESB-like' gateway stuffed with business logic.",
    interviewerExpectation: ["single entry point", "cross-cutting concerns", "routing/LB/TLS", "decouples clients", "avoid business logic / SPOF"],
    followUps: [
      "Gateway vs service mesh — how do they differ?",
      "How do you avoid the gateway being a SPOF?",
      "What is BFF (backend-for-frontend)?",
    ],
    commonMistakes: [
      "Business logic in the gateway",
      "Single non-redundant gateway (SPOF)",
      "Skipping per-service authZ (trusting the gateway alone)",
    ],
    bestPractices: [
      "Gateway for generic cross-cutting only",
      "Run it redundantly; still authorize in services",
      "Consider BFF for client-specific needs",
    ],
    relatedTech: ["Kong", "AWS API Gateway", "Spring Cloud Gateway", "service mesh"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "Deloitte"],
    related: ["rate-limiting", "api-auth-oauth-jwt", "cors"],
  },
  {
    slug: "webhooks-design",
    categoryId: "rest-apis",
    topic: "Idempotency",
    question: "How do you design reliable, secure webhooks for event delivery?",
    tags: ["webhooks", "delivery guarantees", "signing", "retries", "idempotency"],
    shortAnswer:
      "Deliver events via signed POSTs (HMAC signature header) so receivers can verify authenticity. Use at-least-once delivery with retries + exponential backoff, include a unique event id so receivers dedupe (idempotent processing), and provide a way to replay missed events. Return 2xx fast; process async.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Authenticity", v: "HMAC signature header + secret" },
          { k: "Delivery", v: "at-least-once + retry/backoff" },
          { k: "Dedup", v: "unique event id → idempotent receiver" },
          { k: "Receiver", v: "ack 2xx fast, process async" },
        ],
      },
    ],
    whatIf: {
      q: "Why must a webhook receiver be idempotent even if the sender 'tries once'?",
      a: "Networks make exactly-once impossible: a receiver might process an event, then its 2xx ack is lost, so the sender retries and delivers the same event again. The receiver must dedupe on the event id and process idempotently — otherwise retries cause duplicate side effects (double order, double email).",
    },
    realWorld:
      "Stripe/GitHub webhooks sign payloads (HMAC), retry with backoff, and send a unique event id precisely so consumers can verify and dedupe; consumers that aren't idempotent get duplicate-processing bugs.",
    interviewerExpectation: ["HMAC signing/verification", "at-least-once + retries/backoff", "unique event id + idempotent receiver", "fast 2xx ack + async processing", "replay"],
    followUps: [
      "How does HMAC signature verification work?",
      "Why ack quickly and process asynchronously?",
      "How do you let consumers replay missed events?",
    ],
    commonMistakes: [
      "Unsigned webhooks (spoofable)",
      "Non-idempotent receivers (duplicate side effects)",
      "Doing heavy work before acking (timeouts → retries)",
    ],
    bestPractices: [
      "Sign payloads (HMAC) and verify on receipt",
      "Ack 2xx fast; process async; dedupe by event id",
      "Retry with backoff; offer replay",
    ],
    relatedTech: ["HMAC", "message queue", "Stripe/GitHub webhooks", "idempotency"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Stripe-like", "Deloitte"],
    related: ["idempotency-keys", "async-rest-long-running"],
  },
];
