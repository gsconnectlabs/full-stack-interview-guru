import type { Question } from "../types";

/**
 * Java 8+ — content expansion batch (8 questions, ROADMAP CE4).
 *
 * Senior-level Stream API and functional-programming pitfalls: parallelStream()
 * production risk, Stream vs Collection semantics, laziness/short-circuiting,
 * pipeline-vs-loop cost, Collectors.toMap() merge conflicts, Optional misuse,
 * method-reference performance, and custom functional-interface design.
 *
 * Category state change: `java-8` had only 2 live base questions (`java-stream-api`,
 * `java-optional`) — below `MIN_LIVE_TO_LIST` (10), so the category was `noindex` and
 * unlisted. This batch takes it to 10 live, crossing the threshold (same pattern as
 * CE1 Python 2→27, CE2 JSON 1→26, CE3 Advanced Java 3→28).
 *
 * DELIBERATE NON-DUPLICATION: `java-stream-api` and `java-optional` (base bank) are
 * intro-level "what is it" questions. Every question here takes a distinct, deeper
 * production-facing angle and cross-links to the base question via `related`.
 */
export const java8Extra: Question[] = [
  {
    slug: "parallel-stream-production-pitfalls",
    categoryId: "java-8",
    topic: "Stream API",
    question: "Why can parallelStream() make a service slower instead of faster in production?",
    seoTitle: "parallelStream() Pitfalls in Production: Interview Q&A | Full Stack Interview Guru",
    seoDescription:
      "Why parallelStream() often backfires in production: shared ForkJoinPool.commonPool() contention, blocking I/O inside parallel streams, small-collection overhead, and when parallelism actually pays off.",
    heading: "parallelStream() Production Pitfalls — Interview Questions",
    tags: ["parallelstream", "forkjoinpool", "common pool", "performance", "streams"],
    shortAnswer:
      "parallelStream() runs on the shared ForkJoinPool.commonPool() by default — the same pool every other parallel stream and CompletableFuture.supplyAsync() in the JVM uses. A CPU-heavy stream can starve unrelated work, and a single blocking call inside one can stall the whole pool. On small collections the fork/join coordination overhead usually costs more than it saves — it's a throughput tool for large, CPU-bound, splittable work, not a free speed-up.",
    mindMap: [
      { type: "text", content: "parallelStream() doesn't spin up dedicated threads — it borrows from `ForkJoinPool.commonPool()`, a **JVM-wide singleton** sized to `availableProcessors() - 1`. Every parallel stream and every `CompletableFuture.supplyAsync()` in your process shares that one pool." },
      {
        type: "kv",
        rows: [
          { k: "Good fit", v: "Large, CPU-bound, splittable, side-effect-free work" },
          { k: "Bad fit", v: "Small collections, I/O-bound tasks, stateful pipelines" },
          { k: "Shared resource", v: "ForkJoinPool.commonPool() — one pool, whole JVM" },
          { k: "Real risk", v: "One blocking call anywhere stalls unrelated parallel work" },
        ],
      },
      { type: "text", content: "**Key takeaway:** parallelStream() turns a sequential-vs-parallel decision into a shared-resource-contention decision. Benchmark on realistic data sizes, and never put blocking I/O inside one." },
    ],
    handsOn: {
      lang: "java",
      code: `// Dangerous: a blocking HTTP call inside a parallel stream
// ties up ForkJoinPool.commonPool() threads for EVERY caller in the JVM
List<String> results = orderIds.parallelStream()
    .map(id -> httpClient.fetchOrder(id))   // blocks a common-pool thread
    .toList();

// Safer: run I/O-bound work on its own executor, not the common pool
List<String> results = orderIds.stream()
    .map(id -> CompletableFuture.supplyAsync(() -> httpClient.fetchOrder(id), ioExecutor))
    .map(CompletableFuture::join)
    .toList();`,
    },
    whatIf: {
      q: "What happens if two unrelated features both call parallelStream() under load at the same time?",
      a: "They compete for the same commonPool() threads. If one is CPU-heavy, the other's parallel stream queues behind it — independent code paths become coupled in latency, a classic 'noisy neighbor' bug invisible in isolated testing.",
    },
    realWorld:
      "This bites teams that reach for parallelStream() on a batch job doing one REST call per item — the blocking HTTP call ties up common-pool threads, so an unrelated parallel stream elsewhere in the same process slows down for no visible reason. Fix: a dedicated ForkJoinPool via pool.submit(), or skip parallelStream() for I/O-bound work entirely.",
    guruTake:
      "In an interview I'd frame it as: parallelStream() isn't 'stream but faster' — it's opting into the JVM's shared common pool. I only reach for it on CPU-bound, in-memory work where I've actually measured a win, and I never put a network or DB call inside one.",
    interviewerExpectation: [
      "Knows commonPool() is shared JVM-wide",
      "Distinguishes CPU-bound from I/O-bound workloads",
      "Won't put blocking calls inside parallel streams",
      "Understands small-collection overhead",
      "Mentions benchmarking before adopting",
    ],
    followUps: [
      "How would you run a parallel stream on a custom ForkJoinPool instead of the common pool?",
      "Why does parallelStream() perform worse on a LinkedList than an ArrayList?",
      "How does parallelStream() interact with ordered operations like sorted() or limit()?",
    ],
    commonMistakes: [
      "Assuming parallelStream() always helps",
      "Using it on small collections",
      "Running blocking I/O inside a parallel stream",
      "Not measuring before/after with a real benchmark",
    ],
    bestPractices: [
      "Benchmark with realistic data size before adopting",
      "Keep parallel-stream work CPU-bound and side-effect-free",
      "Use a dedicated ForkJoinPool for isolation when needed",
      "Prefer sequential stream + explicit executor for I/O work",
    ],
    relatedTech: ["ForkJoinPool", "CompletableFuture", "Executors", "Spliterator"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Deloitte"],
    related: ["forkjoinpool-work-stealing", "stream-vs-collection-semantics"],
  },
  {
    slug: "stream-vs-collection-semantics",
    categoryId: "java-8",
    topic: "Stream API",
    question: "Why isn't a Stream a data structure, and what does that mean for how you use it?",
    seoTitle: "Stream vs Collection in Java: Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Why Java Streams aren't a data structure: single-use traversal, laziness, no storage, and what that means for reuse, debugging, and API design.",
    heading: "Stream vs Collection Semantics — Interview Questions",
    tags: ["stream", "collection", "laziness", "single-use", "java 8"],
    shortAnswer:
      "A Collection stores elements you can iterate repeatedly; a Stream describes a pipeline of computation over a source and is consumed exactly once — call a terminal operation twice and you get IllegalStateException: stream has already been operated upon or closed. Streams have no backing storage; they compute values on demand as the terminal operation pulls them through the pipeline.",
    mindMap: [
      { type: "text", content: "Think of a Collection as a **warehouse** (elements sitting in memory, revisitable) and a Stream as a **conveyor belt** (elements pass through once, transformed on the way, then gone). The belt doesn't store anything — it just describes what happens as things move through it." },
      {
        type: "kv",
        rows: [
          { k: "Collection", v: "In-memory, stores elements, reusable, eager" },
          { k: "Stream", v: "No storage, describes computation, single-use, lazy" },
          { k: "Reuse a stream", v: "IllegalStateException on the second terminal op" },
          { k: "Get a new stream", v: "Re-derive from the source (list.stream() again)" },
        ],
      },
      { type: "text", content: "**Key takeaway:** if you find yourself wanting to iterate a Stream twice, that's a signal you actually wanted a Collection — `.toList()`/`.collect()` and keep the result, or re-derive `.stream()` from the source each time." },
    ],
    handsOn: {
      lang: "java",
      code: `Stream<String> names = list.stream().filter(n -> n.startsWith("A"));

long count = names.count();       // terminal op #1 — consumes the stream
long again = names.count();       // throws IllegalStateException

// Correct: re-derive, or materialize once and reuse the List
List<String> filtered = list.stream().filter(n -> n.startsWith("A")).toList();
long count1 = filtered.size();
long count2 = filtered.size();    // fine — it's a real Collection now`,
    },
    whatIf: {
      q: "If Streams have no storage, how does .toList() or .collect() work?",
      a: "The terminal operation itself builds and returns a real, storable Collection — that's the whole point of a terminal op. Everything before it is just a lazily-evaluated description; nothing actually runs until the terminal operation pulls elements through and, if it's a collector, accumulates them somewhere.",
    },
    realWorld:
      "This shows up as a real bug when a method returns a Stream field or gets passed a Stream that's logged/inspected before being used — the logging code consumes the stream, and downstream code hits IllegalStateException. The fix is almost always: stop passing Streams around as if they were data; pass a List/Collection, and only build a Stream right where you're about to consume it.",
    guruTake:
      "I'd tell an interviewer: a Stream is a recipe, not a pantry. If a teammate asks why their stream 'went empty' after one pass, that's exactly this — the pipeline already ran; you need to rebuild it from the source or collect it into something reusable.",
    interviewerExpectation: [
      "Streams are single-use, Collections are reusable",
      "Streams have no backing storage",
      "Knows the IllegalStateException failure mode",
      "Understands laziness — nothing runs until the terminal op",
    ],
    followUps: [
      "What counts as an intermediate operation vs a terminal operation?",
      "Why shouldn't you store a Stream as a class field?",
      "How would you design a method that needs to be traversed multiple times by different callers?",
    ],
    commonMistakes: [
      "Storing a Stream in a field or passing it around like a List",
      "Trying to reuse a stream after a terminal operation",
      "Logging/inspecting a stream before its intended consumer runs",
    ],
    bestPractices: [
      "Build the stream right where you consume it",
      "Materialize to a List/Set with .toList()/.collect() when reuse is needed",
      "Treat a Stream reference as write-once, read-once",
    ],
    relatedTech: ["Collectors", "Spliterator", "Optional"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Microsoft", "Oracle", "Amazon"],
    related: ["java-stream-api", "stream-laziness-short-circuit"],
  },
  {
    slug: "stream-laziness-short-circuit",
    categoryId: "java-8",
    topic: "Stream API",
    question: "How does Stream laziness and short-circuiting actually work, and why does peek() surprise people?",
    seoTitle: "Stream Laziness & Short-Circuiting: Interview Q&A | Full Stack Interview Guru",
    seoDescription:
      "How Java Stream laziness and short-circuiting (findFirst, anyMatch, limit) actually execute element-by-element, and why peek() output confuses developers debugging pipelines.",
    heading: "Stream Laziness & Short-Circuiting — Interview Questions",
    tags: ["stream", "laziness", "short-circuit", "peek", "findfirst"],
    shortAnswer:
      "Intermediate operations (filter, map, peek) build up a pipeline description but run nothing; only a terminal operation (forEach, collect, findFirst) triggers execution, and even then elements are pulled through one at a time, not processed stage-by-stage across the whole collection. Short-circuiting terminal ops like findFirst() or anyMatch() stop pulling as soon as they have an answer, so later elements never enter the pipeline at all — which is why peek() output often looks 'incomplete' to developers expecting every element to pass through every stage.",
    mindMap: [
      { type: "text", content: "Java Streams evaluate **depth-first per element**, not breadth-first per stage. Element 1 runs through filter → map → peek → terminal before element 2 even starts — the opposite of how most people mentally model a pipeline of loops." },
      {
        type: "kv",
        rows: [
          { k: "Intermediate ops", v: "filter, map, peek — lazy, build the pipeline description" },
          { k: "Terminal ops", v: "forEach, collect, findFirst — trigger execution" },
          { k: "Short-circuit ops", v: "findFirst, anyMatch, limit — stop pulling early" },
          { k: "peek() surprise", v: "Only fires for elements actually pulled through" },
        ],
      },
      { type: "text", content: "**Key takeaway:** a stream pipeline is a pull-based, per-element evaluation, not a batch transform. Short-circuiting means later stages may never see later elements — that's a feature (it avoids wasted work), not a bug." },
    ],
    handsOn: {
      lang: "java",
      code: `List<Integer> nums = List.of(1, 2, 3, 4, 5);

Optional<Integer> first = nums.stream()
    .peek(n -> System.out.println("checking " + n))
    .filter(n -> n > 2)
    .findFirst();

// Output: checking 1, checking 2, checking 3   -- stops at 3, never checks 4 or 5
// findFirst() short-circuits the moment filter() matches`,
    },
    whatIf: {
      q: "Why might peek() print elements in an order that doesn't match a simple top-to-bottom mental model?",
      a: "Because peek() runs per-element, interleaved with every other stage for that same element — it's not 'run filter on everything, then peek on everything.' For a short-circuiting terminal op, peek() also simply won't fire for elements the pipeline never had to pull.",
    },
    realWorld:
      "Teams debug 'missing' log lines from a peek() call and assume a bug — it's almost always a short-circuiting terminal operation (findFirst, anyMatch, limit) further down the chain that stopped pulling elements early. Understanding this pull-based model is also what explains why an infinite stream (Stream.iterate) can still terminate: limit() makes it short-circuit before the infinite source is ever fully realized.",
    guruTake:
      "When someone tells me their peek() 'isn't working', the first question I ask is what the terminal operation is — nine times out of ten it's findFirst or anyMatch, and the pipeline is doing exactly what it should: the minimum work necessary.",
    interviewerExpectation: [
      "Understands per-element, pull-based evaluation",
      "Knows which operations are short-circuiting",
      "Can explain why peek() output looks incomplete",
      "Connects laziness to infinite streams working with limit()",
    ],
    followUps: [
      "How does Stream.iterate() combined with limit() avoid running forever?",
      "Is peek() safe to use for anything other than debugging?",
      "What's the difference between findFirst() and findAny(), especially in a parallel stream?",
    ],
    commonMistakes: [
      "Assuming a stage-by-stage (breadth-first) execution model",
      "Using peek() for production side effects instead of debugging",
      "Being confused when short-circuiting skips later elements",
    ],
    bestPractices: [
      "Use peek() only for debugging, never for side effects that matter",
      "Reach for short-circuiting ops (anyMatch, findFirst, limit) to avoid wasted work",
      "Reason about pipelines element-by-element, not stage-by-stage",
    ],
    relatedTech: ["Spliterator", "Stream.iterate", "Optional"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Microsoft", "Amazon", "Oracle"],
    related: ["stream-vs-collection-semantics", "stream-pipeline-vs-loop-hot-path"],
  },
  {
    slug: "stream-pipeline-vs-loop-hot-path",
    categoryId: "java-8",
    topic: "Stream API",
    question: "When does a Stream pipeline cost more than a plain loop in a hot path?",
    seoTitle: "Stream Pipeline vs Loop Performance: Interview Q&A | Full Stack Interview Guru",
    seoDescription:
      "When Java Stream pipelines cost more than a plain for-loop in hot paths: boxing overhead, lambda call-site megamorphism, and how to reason about it instead of guessing.",
    heading: "Stream Pipeline vs Loop in Hot Paths — Interview Questions",
    tags: ["stream", "performance", "boxing", "jit", "hot path"],
    shortAnswer:
      "For simple operations at high call frequency, a Stream pipeline has real, measurable overhead versus a plain loop: boxing when the pipeline crosses Stream<Integer> instead of IntStream, extra object allocation for lambdas and intermediate Stream stages, and the JIT sometimes struggling to inline call sites that see many different lambda shapes. For most application code the difference is noise; in a genuinely hot, high-throughput inner loop (millions of iterations, low-latency path) it can matter — and the fix is to measure, not to reflexively avoid Streams everywhere.",
    mindMap: [
      { type: "text", content: "Streams aren't 'slow' — they add a small, mostly-fixed **abstraction cost** per pipeline: allocating Stream stage objects, boxing on Stream<Integer>-style generics, and lambda invocation through an interface call. That cost is invisible at normal call frequencies and only shows up when you're doing it millions of times per second in a tight loop." },
      {
        type: "kv",
        rows: [
          { k: "Usually fine", v: "Request handlers, batch jobs, typical business logic" },
          { k: "Worth checking", v: "Inner loops running millions of times, latency-critical paths" },
          { k: "Common cost", v: "Boxing (Stream<Integer> vs IntStream), stage allocation" },
          { k: "Fix", v: "Use primitive streams, or drop to a loop, only where measured" },
        ],
      },
      { type: "text", content: "**Key takeaway:** don't pre-optimize by avoiding Streams everywhere — profile the actual hot path first. Readability usually wins; only trade it for a loop where a profiler shows the pipeline is the bottleneck." },
    ],
    handsOn: {
      lang: "java",
      code: `// Boxes every element: List<Integer> -> Stream<Integer> -> Integer sum via boxing
int total = list.stream().mapToInt(Integer::intValue).sum(); // OK: uses IntStream

int totalBoxed = list.stream().reduce(0, Integer::sum);      // boxes each add

// In a real hot path, a loop avoids all pipeline/boxing overhead
int total2 = 0;
for (int n : primitiveArray) {
    total2 += n;
}`,
    },
    whatIf: {
      q: "If Streams have overhead, why does the JDK itself use them so heavily internally?",
      a: "Because most code isn't a hot inner loop — it's I/O-bound, runs at modest frequency, and readability/correctness matter far more than a few nanoseconds. The JDK's own hot paths (e.g. String, Collections internals) mostly still use plain loops; Streams are a productivity tool for the 99% of code that isn't performance-critical.",
    },
    realWorld:
      "This question mostly comes up when someone is optimizing a genuinely hot path — a tight numeric loop in a pricing engine, a serialization routine called per-request at high QPS — and profiling (not guessing) shows Stream allocation or boxing in the flame graph. Outside of that, rewriting readable Stream code as loops 'for performance' without measurement is itself an anti-pattern the codebase then has to maintain forever.",
    guruTake:
      "My honest answer in an interview: I don't avoid Streams by default — I write the readable version first, and only drop to a loop when a profiler actually points at the pipeline. Premature de-optimization is as real a smell as premature optimization.",
    interviewerExpectation: [
      "Knows the real sources of Stream overhead (boxing, allocation)",
      "Distinguishes hot-path code from typical business logic",
      "Won't blanket-avoid Streams without measuring",
      "Mentions primitive streams (IntStream/LongStream) as a mitigation",
    ],
    followUps: [
      "How do IntStream/LongStream/DoubleStream avoid the boxing cost?",
      "How would you profile whether a Stream pipeline is actually your bottleneck?",
      "Does the JIT ever fully inline and eliminate Stream overhead?",
    ],
    commonMistakes: [
      "Rewriting readable Streams as loops without profiling first",
      "Ignoring boxing costs on Stream<Integer>/Stream<Long> pipelines",
      "Treating all Stream code as equally hot",
    ],
    bestPractices: [
      "Write the readable Stream version first",
      "Use primitive streams (IntStream, etc.) to avoid boxing",
      "Profile before rewriting a pipeline as a loop",
      "Reserve manual loops for measured, genuinely hot paths",
    ],
    relatedTech: ["IntStream", "JIT", "Escape Analysis", "JMH"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Oracle"],
    related: ["object-creation-cost-primitive-streams", "jmh-microbenchmarking-pitfalls"],
  },
  {
    slug: "collectors-groupingby-tomap-pitfalls",
    categoryId: "java-8",
    topic: "Stream API",
    question: "What's the silent bug when Collectors.toMap() hits a duplicate key?",
    seoTitle: "Collectors.toMap() Duplicate Key Bug: Interview Q&A | Full Stack Interview Guru",
    seoDescription:
      "Why Collectors.toMap() throws IllegalStateException on duplicate keys, how the merge-function overload fixes it, and the groupingBy() alternative for one-to-many results.",
    heading: "Collectors.toMap() Duplicate Key Pitfalls — Interview Questions",
    tags: ["collectors", "tomap", "groupingby", "streams", "merge function"],
    shortAnswer:
      "Collectors.toMap(keyFn, valueFn) throws IllegalStateException: Duplicate key the moment two elements produce the same key — it has no default merge strategy. The three-argument overload, toMap(keyFn, valueFn, mergeFn), lets you decide what happens on a collision (keep first, keep last, sum, concatenate); if you actually want every value per key rather than one, you wanted Collectors.groupingBy() instead.",
    mindMap: [
      { type: "text", content: "`toMap()` assumes **keys are unique** — it's building a Map, and a Map can't hold two values under one key. Without a merge function it has no idea what you'd want to happen on a collision, so it fails loudly rather than silently picking one." },
      {
        type: "kv",
        rows: [
          { k: "toMap(k, v)", v: "Throws on duplicate keys — no default merge" },
          { k: "toMap(k, v, merge)", v: "You decide: keep first/last, sum, concatenate" },
          { k: "groupingBy(k)", v: "Map<K, List<V>> — collects ALL values per key" },
          { k: "Choose by", v: "Do you want one value per key, or every value per key?" },
        ],
      },
      { type: "text", content: "**Key takeaway:** a `toMap()` crash on duplicate keys isn't a bug in the collector — it's the collector telling you the data has a cardinality you didn't account for. Either supply a merge function or switch to `groupingBy`." },
    ],
    handsOn: {
      lang: "java",
      code: `record Employee(String department, String name) {}

// Throws IllegalStateException if two employees share a department
Map<String, String> byDept = employees.stream()
    .collect(Collectors.toMap(Employee::department, Employee::name));

// Fix 1: decide how to merge on collision
Map<String, String> lastWins = employees.stream()
    .collect(Collectors.toMap(Employee::department, Employee::name, (a, b) -> b));

// Fix 2: you actually wanted every name per department
Map<String, List<String>> allNames = employees.stream()
    .collect(Collectors.groupingBy(Employee::department,
        Collectors.mapping(Employee::name, Collectors.toList())));`,
    },
    whatIf: {
      q: "Why doesn't toMap() just silently keep the first or last value instead of throwing?",
      a: "Because silently dropping data is worse than a loud failure — a 'last value wins' default would hide a real modeling mistake (your keys aren't actually unique) behind a Map that quietly lost information. Forcing you to supply a merge function makes the decision explicit and intentional.",
    },
    realWorld:
      "This shows up constantly when building a lookup Map from what looks like unique data (e.g., 'user ID to latest order') but production data has a duplicate the sample data didn't — an old test dataset with unique keys passes, then a real dataset throws in production. The fix is always to ask 'can this key actually repeat?' before choosing toMap() over groupingBy() in the first place.",
    guruTake:
      "I'd tell an interviewer: the exception message is doing you a favor. The real skill isn't memorizing the merge-function signature — it's asking upfront whether your key is genuinely unique, which tells you whether you wanted toMap or groupingBy before you write a line of code.",
    interviewerExpectation: [
      "Knows toMap() throws IllegalStateException on duplicate keys",
      "Can write the three-argument merge-function overload",
      "Knows when groupingBy() is the right tool instead",
      "Frames it as a data-modeling question, not just an API quirk",
    ],
    followUps: [
      "How would you collect a Map<K, List<V>> instead of Map<K, V>?",
      "What does Collectors.toMap()'s fourth overload (with a map supplier) let you control?",
      "How does groupingBy() with a downstream collector work?",
    ],
    commonMistakes: [
      "Assuming toMap() will just keep one value silently",
      "Using toMap() when the key isn't guaranteed unique",
      "Not testing with data that actually has duplicate keys",
    ],
    bestPractices: [
      "Confirm key uniqueness before choosing toMap() over groupingBy()",
      "Always consider supplying an explicit merge function",
      "Test with duplicate-key data, not just clean sample data",
    ],
    relatedTech: ["Collectors", "groupingBy", "Collectors.mapping"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["stream-vs-collection-semantics", "object-creation-cost-primitive-streams"],
  },
  {
    slug: "optional-when-to-use-and-avoid",
    categoryId: "java-8",
    topic: "Optional",
    question: "When is Optional the right call, and when does it become an anti-pattern?",
    seoTitle: "Optional Best Practices vs Anti-Patterns: Interview Q&A | Full Stack Interview Guru",
    seoDescription:
      "When java.util.Optional is the right design choice vs an anti-pattern: return types, fields, method parameters, serialization, and interview-ready reasoning.",
    heading: "Optional: Best Practices vs Anti-Patterns — Interview Questions",
    tags: ["optional", "null safety", "api design", "java 8"],
    shortAnswer:
      "Optional was designed for one job: as a return type signaling 'this method might legitimately have no result' — it forces callers to handle absence explicitly instead of risking a NullPointerException. It was never meant for fields, method parameters, or anything Serializable; using it there adds an allocation and a layer of indirection without solving a problem Optional actually addresses, and Optional itself doesn't implement Serializable, so it breaks entity/DTO serialization outright.",
    mindMap: [
      { type: "text", content: "Optional's entire value proposition is at the **API boundary**: it's a signal in a method signature that says 'read the return type, you must handle absence.' Everywhere else, it's just a wrapper object with no such contract to enforce." },
      {
        type: "kv",
        rows: [
          { k: "Good: return type", v: "Optional<User> findById(id) — forces callers to handle absence" },
          { k: "Bad: field", v: "Adds allocation, breaks Serializable, no enforcement benefit" },
          { k: "Bad: parameter", v: "Caller can pass null anyway — use overloads instead" },
          { k: "Bad: collections", v: "Optional<List<T>> — an empty List already means 'nothing'" },
        ],
      },
      { type: "text", content: "**Key takeaway:** Optional isn't 'null but safer' everywhere — it's a specific tool for one specific seam (public return types). Reach for it there, and use plain null/validation/overloads everywhere else." },
    ],
    handsOn: {
      lang: "java",
      code: `// Good: return type communicates "might be absent"
public Optional<User> findById(String id) { ... }

User user = repository.findById(id)
    .orElseThrow(() -> new UserNotFoundException(id));

// Bad: Optional field — breaks Serializable, adds no real safety
class UserDto implements Serializable {
    private Optional<String> middleName; // don't do this
}

// Bad: Optional parameter — caller can still pass null; use an overload instead
void sendEmail(User user, Optional<String> ccAddress) { ... } // don't do this`,
    },
    whatIf: {
      q: "If Optional prevents NullPointerException, why not use it for every nullable field?",
      a: "Optional doesn't prevent NPE — it just moves the risk: calling .get() on an empty Optional without checking throws NoSuchElementException instead. On a field it also costs an extra allocation per instance, breaks Serializable, and doesn't stop a caller from setting the field to null anyway (the wrapper isn't enforced at construction).",
    },
    realWorld:
      "Teams that adopt Optional enthusiastically often end up with Optional<Optional<T>> nesting or Optional fields on JPA entities that then fail to serialize — Jackson and JPA don't handle Optional fields cleanly by default, requiring extra module configuration that a plain nullable field never needed. The pragmatic rule that survives code review: Optional at public return boundaries only.",
    guruTake:
      "When I see Optional on a field in review, I ask what problem it's solving that a null-check and good naming wouldn't — usually the honest answer is 'it felt more modern,' which isn't a reason. I reserve it for the one place it earns its keep: public API return types.",
    interviewerExpectation: [
      "Knows Optional's intended use is return types, not fields/params",
      "Explains why Optional isn't Serializable-friendly",
      "Knows .get() without a check just trades NPE for NoSuchElementException",
      "Distinguishes 'Optional as documentation' from 'Optional as safety'",
    ],
    followUps: [
      "Why doesn't Optional implement Serializable?",
      "What's the difference between orElse() and orElseGet(), and when does it matter?",
      "How would you avoid an Optional<List<T>> return type?",
    ],
    commonMistakes: [
      "Using Optional for fields or method parameters",
      "Calling .get() without checking isPresent()/isEmpty() first",
      "Wrapping a collection return type in Optional instead of returning an empty collection",
    ],
    bestPractices: [
      "Use Optional only for public return types that may legitimately be absent",
      "Prefer orElseThrow()/orElseGet() over unchecked .get()",
      "Return an empty collection instead of Optional<Collection<T>>",
    ],
    relatedTech: ["Jackson", "JPA", "NullPointerException"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Oracle", "Deloitte"],
    related: ["java-optional"],
  },
  {
    slug: "method-reference-vs-lambda-performance",
    categoryId: "java-8",
    topic: "Functional Interfaces",
    question: "Is there a real performance difference between a method reference and an equivalent lambda?",
    seoTitle: "Method Reference vs Lambda Performance: Interview Q&A | Full Stack Interview Guru",
    seoDescription:
      "Method references and lambdas both compile to invokedynamic with a generated implementation class — but 'identical performance' isn't quite right. Capturing vs non-capturing, JIT inlining, and when to actually reach for JMH.",
    heading: "Method Reference vs Lambda Performance — Interview Questions",
    tags: ["method reference", "lambda", "invokedynamic", "capturing lambda", "performance", "java 8"],
    shortAnswer:
      "There's no difference tied to the syntax choice itself — a lambda and an equivalent method reference both compile to an invokedynamic call site resolved via LambdaMetafactory, and once the JIT treats the call site as monomorphic it inlines through either exactly the same way. But 'identical performance' isn't quite accurate as a blanket claim: what actually matters is whether the lambda or method reference is capturing (closes over a local variable, instance field, or `this`) or non-capturing. A non-capturing lambda or unbound method reference (s -> s.length(), String::toUpperCase) is effectively reusable after its first bootstrap; a capturing lambda or bound method reference (s -> s.startsWith(prefix), someInstance::someMethod) allocates a fresh instance on every evaluation, because each one has to close over potentially different state. That's a real, measurable cost difference — it's just orthogonal to method-reference-vs-lambda syntax, not caused by it. For anything where the difference might actually matter, measure with JMH rather than reasoning from syntax alone.",
    mindMap: [
      { type: "text", content: "Neither a lambda nor a method reference is 'compiled to an anonymous class' the way pre-Java-8 code was. Both become an `invokedynamic` instruction that, on first execution, asks `LambdaMetafactory` to spin up a lightweight implementation class. The mechanism is identical — but **capturing vs non-capturing** is a separate axis that cuts across both forms and is where the real allocation cost lives." },
      {
        type: "kv",
        rows: [
          { k: "Syntax choice (ref vs lambda)", v: "No inherent performance difference — same invokedynamic mechanism" },
          { k: "Non-capturing (either form)", v: "Effectively reusable after first bootstrap — no per-call allocation" },
          { k: "Capturing (either form)", v: "Allocates a new instance per evaluation — closes over live state" },
          { k: "Steady-state JIT", v: "Monomorphic call sites inline through either form the same way" },
          { k: "When it might matter", v: "Measure with JMH — don't reason from syntax alone" },
        ],
      },
      { type: "text", content: "**Key takeaway:** 'method reference vs lambda' is the wrong axis to reason about performance on. 'Capturing vs non-capturing' is the right one, and it applies equally to both syntaxes — a bound method reference (someInstance::method) is just as capturing as an equivalent lambda." },
    ],
    handsOn: {
      lang: "java",
      code: `// Non-capturing — both forms are effectively reusable after first bootstrap
list.forEach(s -> System.out.println(s));
list.forEach(System.out::println);

// Capturing — BOTH forms allocate a new instance per evaluation, because
// each closes over a different live value (prefix / this)
String prefix = "A";
Predicate<String> lambdaCapturing = s -> s.startsWith(prefix);   // captures 'prefix'
Predicate<String> refCapturing    = prefix::equalsIgnoreCase;    // captures 'prefix' (bound receiver)

// If this is ever on a genuinely hot path, don't guess — measure:
// a JMH @Benchmark comparing capturing vs non-capturing forms, not
// eyeballing which syntax "looks" cheaper.`,
    },
    whatIf: {
      q: "If they're the same mechanism, why does everyone say 'prefer method references'?",
      a: "It's a readability guideline, not a performance one — String::toUpperCase reads as 'call this method' more directly than s -> s.toUpperCase() for a simple pass-through. The moment you need extra logic (a null check, a transformation), a lambda is clearer, and reaching for a method reference just to 'be idiomatic' can actually hurt readability. Neither the readability guideline nor the capturing/non-capturing performance distinction cares which syntax you picked.",
    },
    realWorld:
      "This comes up when a code reviewer flags every lambda as 'should be a method reference' expecting a performance win — the right response is that it's a style preference for simple cases, and if performance genuinely matters on that path, the real question to ask is whether the callback captures anything, not which syntax it's written in. Rewriting a capturing lambda as a capturing (bound) method reference 'for performance' changes nothing.",
    guruTake:
      "If an interviewer asks this expecting 'method references are faster,' I'd correct that gently — they're the same mechanism under the hood, and the real performance lever is capturing vs non-capturing, which cuts across both syntaxes equally. And if we're far enough into the weeds that this actually matters, I'd want a JMH benchmark before I'd trust either of our intuitions.",
    interviewerExpectation: [
      "Knows both compile via invokedynamic + LambdaMetafactory",
      "Doesn't claim 'identical performance' as an unqualified blanket statement",
      "Explains capturing vs non-capturing as the real cost axis, independent of syntax",
      "Recommends JMH over reasoning from syntax when it might actually matter",
    ],
    followUps: [
      "What does LambdaMetafactory actually generate at runtime?",
      "Why does a capturing lambda allocate a new instance on every evaluation?",
      "What happens at a megamorphic call site that sees many different lambda shapes?",
    ],
    commonMistakes: [
      "Claiming method references are faster than lambdas",
      "Asserting the two are unconditionally 'identical performance' with no capturing caveat",
      "Rewriting a capturing lambda as a capturing method reference expecting a performance win",
    ],
    bestPractices: [
      "Choose method reference vs lambda based on readability at the call site",
      "Reason about capturing vs non-capturing when allocation actually matters",
      "Use JMH to verify a performance claim on a genuinely hot path instead of guessing from syntax",
    ],
    relatedTech: ["invokedynamic", "LambdaMetafactory", "Functional Interfaces", "JMH"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Microsoft", "Oracle", "Google"],
    related: ["custom-functional-interface-design", "jmh-microbenchmarking-pitfalls"],
  },
  {
    slug: "custom-functional-interface-design",
    categoryId: "java-8",
    topic: "Functional Interfaces",
    question: "When do you design a custom functional interface instead of reusing java.util.function?",
    seoTitle: "Custom Functional Interfaces in Java: Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "When to design a custom @FunctionalInterface instead of reusing Function/Supplier/Consumer from java.util.function, with real API-design trade-offs for interviews.",
    heading: "Custom Functional Interfaces — Interview Questions",
    tags: ["functional interface", "java.util.function", "api design", "checked exceptions"],
    shortAnswer:
      "Reach for java.util.function's built-ins (Function, Supplier, Consumer, Predicate, BiFunction) by default — they're familiar and composable. Design a custom functional interface when you need a method name that documents intent (e.g. OrderValidator instead of a bare Predicate<Order>), a method that throws a checked exception (none of the built-ins allow that), or an arity/shape the standard library doesn't cover (three or more arguments, a primitive-specialized combination).",
    mindMap: [
      { type: "text", content: "The built-in functional interfaces are deliberately generic and unnamed — that's their strength (interoperability) and their weakness (a `Function<Order, Boolean>` tells you nothing about what it validates). A custom interface trades some interoperability for a self-documenting API." },
      {
        type: "kv",
        rows: [
          { k: "Use built-in", v: "Standard shape, no checked exception, generic use" },
          { k: "Go custom: naming", v: "OrderValidator reads better than Predicate<Order>" },
          { k: "Go custom: checked ex", v: "No built-in functional interface allows 'throws IOException'" },
          { k: "Go custom: shape", v: "3+ args, or a primitive-specialized combination not in the JDK" },
        ],
      },
      { type: "text", content: "**Key takeaway:** a custom functional interface is an API-design decision, not a language requirement — `@FunctionalInterface` just enables the compiler to enforce single-abstract-method shape at compile time; you still need a real reason to reach for it over the built-ins." },
    ],
    handsOn: {
      lang: "java",
      code: `// Built-in works, but is generic and unnamed
Predicate<Order> isEligible = order -> order.total() > 100;

// Custom interface: self-documenting, and can declare a checked exception
@FunctionalInterface
interface OrderValidator {
    boolean validate(Order order) throws ValidationException;
}

OrderValidator validator = order -> {
    if (order.items().isEmpty()) throw new ValidationException("empty order");
    return order.total() > 100;
};`,
    },
    whatIf: {
      q: "Why can't you just use Function<Order, Boolean> and throw a checked exception from the lambda body?",
      a: "You can throw an unchecked exception freely, but a checked exception won't compile inside a lambda implementing a built-in functional interface, because none of their single abstract methods declare a `throws` clause. You either wrap the checked exception as unchecked inside the lambda, or define a custom functional interface whose method declares `throws`.",
    },
    realWorld:
      "This comes up constantly wiring lambdas around checked-exception-throwing APIs (file I/O, JDBC, reflection) — teams either litter the code with try/catch-and-rethrow-unchecked inside every lambda, or define one small custom functional interface once and get clean call sites everywhere. The second approach usually wins once the pattern repeats more than twice.",
    guruTake:
      "My rule of thumb: start with java.util.function, and only introduce a custom interface once I can point to a concrete reason — a checked exception I need to propagate, or a name that would make three call sites clearer. Introducing one 'just because' adds a type nobody outside the file recognizes.",
    interviewerExpectation: [
      "Defaults to java.util.function built-ins",
      "Knows built-in interfaces can't declare checked exceptions",
      "Names naming/documentation as a legitimate reason to go custom",
      "Understands @FunctionalInterface is a compiler-enforced contract, not magic",
    ],
    followUps: [
      "How would you adapt a checked-exception-throwing method to fit Function<T,R>?",
      "What does @FunctionalInterface actually enforce at compile time?",
      "Why does BiFunction exist but there's no built-in TriFunction?",
    ],
    commonMistakes: [
      "Reflexively defining custom interfaces instead of using java.util.function",
      "Swallowing or wrapping checked exceptions inside a lambda without a clear reason",
      "Forgetting @FunctionalInterface, allowing a second abstract method to slip in later",
    ],
    bestPractices: [
      "Default to java.util.function; go custom only with a concrete reason",
      "Annotate custom functional interfaces with @FunctionalInterface",
      "Use a custom interface to legitimately propagate a checked exception",
    ],
    relatedTech: ["java.util.function", "Checked Exceptions", "invokedynamic"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["method-reference-vs-lambda-performance"],
  },
];
