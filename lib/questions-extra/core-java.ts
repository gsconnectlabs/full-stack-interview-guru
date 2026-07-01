import type { Question } from "../types";

/**
 * Core Java — flagship expansion batch (20 questions).
 * Enterprise & product-company patterns: language internals, memory, exceptions,
 * generics, immutability, serialization, ORM identity, classloader leaks.
 * Collections-specific questions live in the dedicated `java-collections` batch.
 *
 * Difficulty mix: 4 Easy · 10 Medium · 6 Hard.
 */
export const coreJavaExtra: Question[] = [
  // ---------------------------------------------------------------- Easy (4)
  {
    slug: "string-equals-vs-double-equals",
    categoryId: "core-java",
    topic: "Strings",
    question: "Why does comparing two Strings with == sometimes pass and sometimes fail in production?",
    tags: ["string", "==", "equals", "string pool", "interning"],
    shortAnswer:
      "== compares references; .equals() compares content. String literals share one pooled object (== passes), but Strings built at runtime (new, concatenation, DB/JSON) are distinct objects — so == fails. Always use .equals() for content.",
    mindMap: [
      { type: "text", content: "`==` asks *'same object?'*, `.equals()` asks *'same characters?'*. Literals are **interned** into the String pool, so two equal literals are the same object — which is why `==` accidentally works in unit tests and then breaks in prod." },
      {
        type: "kv",
        rows: [
          { k: '"a" == "a"', v: "true — both pooled" },
          { k: 'new String("a") == "a"', v: "false — heap object" },
          { k: "userInput == \"a\"", v: "false — runtime String" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `String a = "INV-100";
String b = new String("INV-100");
System.out.println(a == b);        // reference
System.out.println(a.equals(b));   // content`,
      output: "false\ntrue",
    },
    whatIf: {
      q: "Why did the bug only appear once data came from the database?",
      a: "Literals in code are pooled, so == passed in tests. Strings read from JDBC/JSON are fresh heap objects, so == compares two different references and returns false even when the text is identical.",
    },
    realWorld:
      "A classic enterprise outage: a status check `status == \"ACTIVE\"` worked in tests (literal vs literal) but silently rejected every record once `status` was hydrated from Oracle, because the DB String was a new object.",
    interviewerExpectation: ["reference vs content", "String pool / interning", ".equals() for content", "literals vs new/runtime Strings"],
    followUps: [
      "What does String.intern() do and when would you call it?",
      "How do you null-safely compare — \"ACTIVE\".equals(status) vs Objects.equals()?",
      "Does == ever work for Integers? (Integer cache -128..127)",
    ],
    commonMistakes: [
      "Using == for business-string comparisons",
      "Assuming unit-test behavior (pooled literals) matches runtime data",
      "Calling status.equals(\"ACTIVE\") and getting an NPE when status is null",
    ],
    bestPractices: [
      "Compare content with .equals() — or Objects.equals(a, b) for null safety",
      "Put the constant first: \"ACTIVE\".equals(status) to avoid NPEs",
      "Reserve == for null checks and enum/primitive comparisons",
    ],
    relatedTech: ["String pool", "Objects.equals", "Integer cache", "enums"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Cognizant", "Accenture", "Wipro"],
    related: ["why-string-immutable", "string-intern-pool", "java-equals-hashcode"],
  },
  {
    slug: "why-string-immutable",
    categoryId: "core-java",
    topic: "Strings",
    question: "Why is String immutable in Java, and how does that help a high-throughput service?",
    tags: ["string", "immutability", "thread-safety", "string pool", "security"],
    shortAnswer:
      "String is immutable so it can be safely shared and pooled. Benefits: thread-safety without locks, a cacheable hashCode, safe use as HashMap keys, and security (a path/credential can't be mutated after a check).",
    mindMap: [
      { type: "text", content: "Immutability means once created, a String's value never changes — `s.toUpperCase()` returns a **new** String. That lets the JVM share one copy across threads and the pool, and cache its hashCode." },
      {
        type: "kv",
        rows: [
          { k: "Thread-safety", v: "shareable with no synchronization" },
          { k: "Performance", v: "hashCode cached → fast map keys" },
          { k: "Security", v: "can't be tampered after validation" },
        ],
      },
    ],
    whatIf: {
      q: "If String were mutable, what breaks in a HashMap?",
      a: "A key's hashCode could change after insertion, so it would land in the wrong bucket and become unfindable — corrupting every cache and config map that uses String keys.",
    },
    realWorld:
      "Connection strings, file paths and security principals are passed around as Strings precisely because no downstream code can mutate them after a security check — a key defense against TOCTOU bugs.",
    interviewerExpectation: ["final char[]/byte[] backing", "pooling & sharing", "cached hashCode", "thread-safety", "security rationale"],
    followUps: [
      "How is the String pool stored since Java 7 (heap, not PermGen)?",
      "What is StringBuilder for, and is it thread-safe?",
      "How would you build your own immutable value class?",
    ],
    commonMistakes: [
      "Thinking s.replace(...) changes s in place",
      "Building large Strings with + in a loop",
      "Believing immutability alone makes a whole object graph thread-safe",
    ],
    bestPractices: [
      "Use StringBuilder for heavy concatenation",
      "Don't keep secrets in String — use char[] you can zero out",
      "Lean on immutability for safe sharing across threads",
    ],
    relatedTech: ["StringBuilder", "String pool", "char[] for secrets", "records"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "TCS", "Deloitte"],
    related: ["string-equals-vs-double-equals", "stringbuilder-vs-stringbuffer", "immutable-class-design"],
  },
  {
    slug: "checked-vs-unchecked-exceptions",
    categoryId: "core-java",
    topic: "Exceptions",
    question: "Checked vs unchecked exceptions — which do you use in a service layer, and why?",
    tags: ["exceptions", "checked", "unchecked", "runtimeexception", "api design"],
    shortAnswer:
      "Checked = recoverable, caller must handle (compile-time). Unchecked (RuntimeException) = programming/unrecoverable errors. Modern service layers favour unchecked custom exceptions to avoid throws-clause pollution and leaky abstractions.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Checked", v: "Exception subclasses — must catch or declare" },
          { k: "Unchecked", v: "RuntimeException — optional handling" },
          { k: "Error", v: "JVM-level (OOM) — don't catch" },
        ],
      },
      { type: "text", content: "Teams wrap low-level checked exceptions (SQLException, IOException) in a domain `RuntimeException` so business code isn't littered with `throws` and stays decoupled from the data layer." },
    ],
    whatIf: {
      q: "Why do Spring and JPA use unchecked exceptions?",
      a: "Spring translates SQLException into an unchecked DataAccessException hierarchy so your service/controller code isn't forced to catch or declare persistence details — keeping layers decoupled and code clean.",
    },
    realWorld:
      "A payments service defines `PaymentDeclinedException extends RuntimeException`; a @ControllerAdvice handler maps it to HTTP 402 once, instead of every method declaring `throws`.",
    interviewerExpectation: ["compile-time vs runtime", "recoverable vs programming error", "wrap & rethrow", "Spring DataAccessException", "don't catch Error"],
    followUps: [
      "Why is catching Throwable or Exception dangerous?",
      "How do you preserve the original cause when re-throwing?",
      "Where do you centralize exception-to-HTTP mapping?",
    ],
    commonMistakes: [
      "Swallowing exceptions with an empty catch block",
      "Wrapping without passing the cause (losing the stack trace)",
      "Using exceptions for normal control flow",
    ],
    bestPractices: [
      "Wrap-and-rethrow with the cause: throw new DomainException(msg, e)",
      "Catch narrowly; never swallow",
      "Centralize mapping via @ControllerAdvice / global handler",
    ],
    relatedTech: ["Spring DataAccessException", "@ControllerAdvice", "SLF4J", "try-with-resources"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Cognizant", "Accenture", "Infosys", "Deloitte"],
    related: ["exception-anti-patterns", "try-with-resources-leak"],
  },
  {
    slug: "autoboxing-performance-trap",
    categoryId: "core-java",
    topic: "Primitives",
    question: "How can autoboxing silently slow down a hot loop or cause a subtle bug?",
    tags: ["autoboxing", "performance", "integer cache", "primitives", "gc"],
    shortAnswer:
      "Autoboxing creates a wrapper object per operation. In a hot loop (e.g. a Long accumulator) that means millions of allocations and GC pressure. It also breaks == comparisons outside the Integer cache (-128..127).",
    mindMap: [
      { type: "text", content: "A `Long sum = 0L; sum += i;` re-boxes on every iteration — each `+=` unboxes, adds, and **allocates a new Long**. Use the primitive `long` and the allocations vanish." },
      {
        type: "kv",
        rows: [
          { k: "Boxed Long sum", v: "millions of objects → GC churn" },
          { k: "primitive long sum", v: "zero allocations" },
          { k: "Integer == trap", v: "cached only -128..127" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `Long boxed = 0L;
for (long i = 0; i < 1_000_000; i++) boxed += i; // boxes 1M times

long fast = 0L;
for (long i = 0; i < 1_000_000; i++) fast += i;  // no boxing`,
      time: "O(n) both — but boxed allocates O(n) objects",
    },
    whatIf: {
      q: "Why does Integer a = 1000, b = 1000; a == b print false but 100 prints true?",
      a: "The Integer cache reuses one instance for -128..127, so == is true there. 1000 is outside the cache, so two distinct objects are created and == compares references → false.",
    },
    realWorld:
      "A reporting job summing order totals into a `Long` ran 4x slower and triggered frequent young-GC; switching the accumulator to `long` removed the allocation storm.",
    interviewerExpectation: ["wrapper allocation cost", "GC pressure in loops", "Integer cache -128..127", "== vs .equals for wrappers"],
    followUps: [
      "Where does the Integer cache come from and can you tune it?",
      "Why can unboxing a null Integer throw NPE?",
      "When are wrappers unavoidable (generics, collections)?",
    ],
    commonMistakes: [
      "Using wrapper types for loop counters/accumulators",
      "Comparing wrappers with ==",
      "Unboxing a possibly-null Integer into an int",
    ],
    bestPractices: [
      "Prefer primitives in hot paths and accumulators",
      "Use .equals()/Objects.equals for wrapper comparison",
      "Guard against null before unboxing",
    ],
    relatedTech: ["Integer cache", "JIT", "GC", "primitive streams (IntStream)"],
    difficulty: "Easy",
    experience: ["3-5 years"],
    askedIn: ["Amazon", "Microsoft", "Wipro"],
    related: ["java-memory-leak-diagnosis", "string-equals-vs-double-equals"],
  },

  // -------------------------------------------------------------- Medium (10)
  {
    slug: "string-intern-pool",
    categoryId: "core-java",
    topic: "Strings",
    question: "How does String interning work, and when would you actually use intern() in production?",
    tags: ["string", "intern", "string pool", "memory", "deduplication"],
    shortAnswer:
      "intern() returns the pooled canonical instance for an equal String, so duplicates share one object. Useful when ingesting huge volumes of repeated Strings (e.g. country codes) to cut heap — but misuse can bloat the pool and hurt GC.",
    mindMap: [
      { type: "text", content: "The String pool is a JVM-managed set of canonical Strings. `intern()` says *'give me the shared copy of this value'*. Two interned equal Strings are `==`." },
      {
        type: "kv",
        rows: [
          { k: "Before intern", v: "1M duplicate \"IN\" objects" },
          { k: "After intern", v: "1 shared \"IN\" object" },
          { k: "Risk", v: "interning unique values bloats the pool" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `String a = new String("IN").intern();
String b = "IN";
System.out.println(a == b); // true — both pooled`,
      output: "true",
    },
    whatIf: {
      q: "You intern() every value from a 50M-row feed and GC time spikes — why?",
      a: "Interning unique/high-cardinality values fills the pool, which lives on the heap and is GC-scanned. Only intern low-cardinality, frequently-repeated values; otherwise you trade duplicate Strings for a giant pool.",
    },
    realWorld:
      "A market-data pipeline interned a small set of exchange/currency codes appearing billions of times, cutting heap noticeably — but the team explicitly avoided interning order IDs (all unique).",
    interviewerExpectation: ["canonical pooled instance", "low-cardinality dedup", "pool lives on heap (Java 7+)", "GC/bloat risk"],
    followUps: [
      "Where did the pool move in Java 7 and why?",
      "What is JVM string deduplication (-XX:+UseStringDeduplication) with G1?",
      "How does this relate to flyweight pattern?",
    ],
    commonMistakes: [
      "Interning high-cardinality values",
      "Assuming intern() is free",
      "Using intern() for locking (anti-pattern)",
    ],
    bestPractices: [
      "Intern only low-cardinality, high-frequency Strings",
      "Prefer G1 string deduplication over manual intern() for general dedup",
      "Measure heap before/after with a profiler",
    ],
    relatedTech: ["G1 UseStringDeduplication", "Flyweight pattern", "GC", "JMH"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Deloitte"],
    related: ["why-string-immutable", "java-memory-leak-diagnosis"],
  },
  {
    slug: "try-with-resources-leak",
    categoryId: "core-java",
    topic: "Exceptions",
    question: "How does try-with-resources prevent JDBC connection and file-handle leaks?",
    tags: ["try-with-resources", "autocloseable", "resource leak", "jdbc", "finally"],
    shortAnswer:
      "try-with-resources auto-closes any AutoCloseable in reverse order, even on exception, and suppresses-but-preserves close() errors. It replaces error-prone finally blocks that leak connections when close() itself throws or is forgotten.",
    mindMap: [
      { type: "text", content: "Resources declared in `try (...)` get `close()` called automatically — no manual finally, no leak if the body throws. Closes happen in reverse declaration order." },
      {
        type: "kv",
        rows: [
          { k: "Old finally", v: "verbose; leaks if close() throws" },
          { k: "try-with-resources", v: "auto close, exception-safe" },
          { k: "Suppressed", v: "close() error attached, not lost" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `try (Connection c = ds.getConnection();
     PreparedStatement ps = c.prepareStatement(SQL)) {
    ps.setLong(1, id);
    return ps.executeQuery();
} // c & ps closed automatically, even on exception`,
    },
    whatIf: {
      q: "Your pool reports 'connection leak detected' under load — likely cause?",
      a: "A code path acquires a Connection but an exception skips a manual close (or close() is in the wrong place). Switching to try-with-resources guarantees release on every path; pool 'leak detection' just surfaces the unreturned connection.",
    },
    realWorld:
      "Connection-pool exhaustion (HikariCP timeouts) under peak load almost always traces to a non-try-with-resources path leaking connections during exceptions.",
    interviewerExpectation: ["AutoCloseable", "reverse-order close", "exception-safe", "suppressed exceptions", "pool exhaustion symptom"],
    followUps: [
      "What is a suppressed exception and how do you read it?",
      "Why does HikariCP report leaks via leakDetectionThreshold?",
      "Order of close when multiple resources throw?",
    ],
    commonMistakes: [
      "Closing in catch instead of finally/try-with-resources",
      "Ignoring exceptions thrown by close()",
      "Reusing a resource after the try block",
    ],
    bestPractices: [
      "Always acquire closeable resources in try-with-resources",
      "Keep one resource per declaration for clarity",
      "Set a pool leakDetectionThreshold in non-prod to catch leaks early",
    ],
    relatedTech: ["AutoCloseable", "HikariCP", "JDBC", "Spring JdbcTemplate"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Deloitte", "Cognizant", "Accenture", "Wipro"],
    related: ["checked-vs-unchecked-exceptions", "exception-anti-patterns"],
  },
  {
    slug: "stringbuilder-vs-stringbuffer",
    categoryId: "core-java",
    topic: "Strings",
    question: "StringBuilder vs StringBuffer — does the difference still matter in modern code?",
    tags: ["stringbuilder", "stringbuffer", "thread-safety", "performance"],
    shortAnswer:
      "Both are mutable char buffers; StringBuffer is synchronized, StringBuilder isn't. Use StringBuilder by default (local, single-threaded). StringBuffer's per-call locking is rarely useful since builders are almost always method-local.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "StringBuilder", v: "not synchronized — faster, default" },
          { k: "StringBuffer", v: "synchronized — legacy" },
          { k: "Reality", v: "buffers are local → no sharing → no lock needed" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `StringBuilder sb = new StringBuilder(64); // pre-size to avoid resizes
for (Order o : orders) sb.append(o.id()).append(',');
String csv = sb.toString();`,
      time: "O(n) total — vs O(n²) for String + in a loop",
    },
    whatIf: {
      q: "Is String concatenation with + in a loop the same as StringBuilder?",
      a: "No. `+` in a loop creates a new String each iteration → O(n²) copying. The compiler optimizes a single-expression concat, but loops need an explicit StringBuilder for O(n).",
    },
    realWorld:
      "Building a large CSV/JSON payload with `result += line` in a loop is a frequent cause of CPU spikes; switching to a pre-sized StringBuilder fixes it.",
    interviewerExpectation: ["synchronized vs not", "default to StringBuilder", "+ in loop is O(n²)", "pre-sizing capacity"],
    followUps: [
      "How does StringBuilder grow its internal array?",
      "What does the compiler do with a + b + c in one expression?",
      "When is StringBuffer ever justified?",
    ],
    commonMistakes: [
      "Using StringBuffer 'just in case' for thread-safety it doesn't need",
      "String += inside a loop",
      "Not pre-sizing when the length is known",
    ],
    bestPractices: [
      "Default to StringBuilder; pre-size with an initial capacity",
      "Reserve StringBuffer for genuinely shared mutable buffers (rare)",
      "Use String.join / Collectors.joining for simple cases",
    ],
    relatedTech: ["String.join", "Collectors.joining", "StringConcatFactory (invokedynamic)"],
    difficulty: "Medium",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Capgemini"],
    related: ["why-string-immutable", "autoboxing-performance-trap"],
  },
  {
    slug: "comparable-vs-comparator",
    categoryId: "core-java",
    topic: "OOP",
    question: "Comparable vs Comparator — how do you sort domain objects by multiple fields?",
    tags: ["comparable", "comparator", "sorting", "streams"],
    shortAnswer:
      "Comparable defines a single natural order inside the class (compareTo). Comparator defines external, swappable orders. For multi-field sorting use Comparator.comparing(...).thenComparing(...) — clean and null-safe.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Comparable", v: "natural order, one per class" },
          { k: "Comparator", v: "many orders, external, composable" },
          { k: "Multi-field", v: "comparing().thenComparing()" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `orders.sort(
    Comparator.comparing(Order::priority)
              .thenComparing(Order::createdAt,
                             Comparator.reverseOrder())
              .thenComparing(Order::id));`,
      output: "sorted by priority, then newest, then id",
    },
    whatIf: {
      q: "Your compareTo throws when a field is null — how do you fix it cleanly?",
      a: "Use Comparator.comparing(Order::name, Comparator.nullsLast(naturalOrder())) so nulls sort predictably instead of NPE-ing inside compareTo.",
    },
    realWorld:
      "Sorting a results grid by status, then date, then id is a one-liner with thenComparing — replacing brittle hand-written compareTo logic that breaks on the next field added.",
    interviewerExpectation: ["natural vs external order", "comparing/thenComparing", "nullsFirst/nullsLast", "consistency with equals"],
    followUps: [
      "Why should compareTo be consistent with equals?",
      "How do you reverse only one field in a chain?",
      "How does this interact with TreeMap/TreeSet ordering?",
    ],
    commonMistakes: [
      "Returning a.field - b.field (int overflow) instead of Integer.compare",
      "Ignoring nulls in comparators",
      "Inconsistent compareTo vs equals breaking TreeSet",
    ],
    bestPractices: [
      "Use Comparator.comparing/thenComparing for readability",
      "Use Integer.compare/Long.compare, never subtraction",
      "Handle nulls explicitly with nullsFirst/nullsLast",
    ],
    relatedTech: ["TreeMap/TreeSet", "Stream.sorted", "Collections.sort"],
    difficulty: "Medium",
    experience: ["3-5 years"],
    askedIn: ["Amazon", "Cognizant", "Deloitte"],
    related: ["java-equals-hashcode", "enum-with-behavior"],
  },
  {
    slug: "generics-type-erasure",
    categoryId: "core-java",
    topic: "Generics",
    question: "How does generic type erasure affect runtime behavior, and what breaks because of it?",
    tags: ["generics", "type erasure", "reflection", "heap pollution"],
    shortAnswer:
      "Generics are compile-time only; the JVM erases type parameters to their bounds (often Object). So you can't do new T[], instanceof List<String>, or have overloads differing only by generic type — and unchecked casts can cause runtime ClassCastException.",
    mindMap: [
      { type: "text", content: "At runtime `List<String>` and `List<Integer>` are both just `List`. The compiler inserts casts and checks at compile time, then throws the type info away (erasure)." },
      {
        type: "kv",
        rows: [
          { k: "Can't", v: "new T[], T.class, instanceof List<String>" },
          { k: "Why", v: "type param gone at runtime" },
          { k: "Leak", v: "raw types → heap pollution" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass()); // true — both ArrayList`,
      output: "true",
    },
    whatIf: {
      q: "How do frameworks recover the generic type at runtime if it's erased?",
      a: "Type parameters on a class/field/method signature ARE retained in metadata. Jackson/Spring use a 'super type token' (TypeReference / ParameterizedTypeReference) — an anonymous subclass — to read that retained signature via reflection.",
    },
    realWorld:
      "Deserializing JSON into List<Dto> with Jackson requires `new TypeReference<List<Dto>>(){}` precisely because the bare `List<Dto>.class` type is erased.",
    interviewerExpectation: ["compile-time only", "erasure to bound/Object", "no new T[]/instanceof generic", "super type tokens", "heap pollution via raw types"],
    followUps: [
      "What is heap pollution and how does @SafeVarargs relate?",
      "How does PECS (Producer Extends, Consumer Super) guide wildcards?",
      "Why can't you catch a generic exception type?",
    ],
    commonMistakes: [
      "Mixing raw and generic types",
      "Expecting instanceof to check the type argument",
      "Creating generic arrays directly",
    ],
    bestPractices: [
      "Avoid raw types; keep -Xlint:unchecked clean",
      "Use TypeReference/ParameterizedTypeReference for generic deserialization",
      "Follow PECS for flexible APIs",
    ],
    relatedTech: ["Jackson TypeReference", "Spring ParameterizedTypeReference", "reflection"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google"],
    related: ["classcast-generics-legacy", "immutable-class-design"],
  },
  {
    slug: "enum-with-behavior",
    categoryId: "core-java",
    topic: "OOP",
    question: "Why prefer enums over int/String constants, and how do you put behavior in an enum?",
    tags: ["enum", "constants", "strategy", "type safety"],
    shortAnswer:
      "Enums are type-safe, exhaustively switchable, serializable singletons. Unlike int/String constants they can't take an invalid value, and they can carry fields and abstract methods — turning a switch into polymorphism.",
    mindMap: [
      { type: "text", content: "An `int STATUS_ACTIVE = 1` accepts any int; an `enum Status { ACTIVE, ... }` accepts only valid members. Add a field/method and each constant becomes a tiny strategy object." },
    ],
    handsOn: {
      lang: "java",
      code: `enum Plan {
    FREE(0), PRO(999), ENTERPRISE(4999);
    private final int priceCents;
    Plan(int c) { this.priceCents = c; }
    int priceCents() { return priceCents; }
}
System.out.println(Plan.PRO.priceCents());`,
      output: "999",
    },
    whatIf: {
      q: "Why is an enum the recommended way to implement a singleton?",
      a: "Enum singletons are serialization-safe and reflection-proof by construction — the JVM guarantees a single instance, unlike a private-constructor class that can be broken via reflection or deserialization.",
    },
    realWorld:
      "Order states modeled as an enum with an abstract `next()` method replace sprawling switch statements and make illegal transitions impossible to represent.",
    interviewerExpectation: ["type safety", "fields + constructors", "abstract methods per constant", "enum singleton", "EnumMap/EnumSet"],
    followUps: [
      "What are EnumSet/EnumMap and why are they fast?",
      "How do you persist enums in JPA safely (name vs ordinal)?",
      "How does an enum implement a state machine?",
    ],
    commonMistakes: [
      "Persisting enum ordinal() (breaks when order changes)",
      "Using int/String constants instead of enums",
      "Giant switch statements instead of per-constant behavior",
    ],
    bestPractices: [
      "Persist enums by name, never ordinal",
      "Use EnumMap/EnumSet for enum-keyed collections",
      "Put behavior in the enum to kill switch statements",
    ],
    relatedTech: ["EnumSet", "EnumMap", "JPA @Enumerated(STRING)", "state machine"],
    difficulty: "Medium",
    experience: ["3-5 years"],
    askedIn: ["Amazon", "Deloitte", "Accenture"],
    related: ["comparable-vs-comparator", "immutable-class-design"],
  },
  {
    slug: "java-pass-by-value",
    categoryId: "core-java",
    topic: "OOP",
    question: "Is Java pass-by-value or pass-by-reference? Prove it.",
    tags: ["pass by value", "references", "method arguments", "mutability"],
    shortAnswer:
      "Java is always pass-by-value. For objects, the value passed is a copy of the reference — so you can mutate the pointed-to object, but reassigning the parameter doesn't affect the caller's variable.",
    mindMap: [
      { type: "text", content: "The method gets a **copy of the reference**. Following it lets you mutate shared state; reassigning the copy is local only." },
      {
        type: "kv",
        rows: [
          { k: "obj.setX(9)", v: "caller sees it — same object" },
          { k: "obj = new()", v: "caller does NOT see it — local copy" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `void tweak(StringBuilder sb) {
    sb.append("!");      // mutates shared object → visible
    sb = new StringBuilder("x"); // reassign copy → invisible
}
StringBuilder s = new StringBuilder("hi");
tweak(s);
System.out.println(s); // hi!`,
      output: "hi!",
    },
    whatIf: {
      q: "A method 'swaps' two object parameters but the caller sees no change — why?",
      a: "Swapping only exchanges the local reference copies inside the method. The caller's variables still point to the original objects. Java can't swap caller references — that would require pass-by-reference.",
    },
    realWorld:
      "A common bug: passing a list to a method expecting it to 'replace' the list (param = newList) — it doesn't; you must mutate (list.clear()/addAll) or return the new list.",
    interviewerExpectation: ["always pass-by-value", "copy of the reference", "mutate vs reassign", "no reference swapping"],
    followUps: [
      "How would you return multiple values without out-params?",
      "Why are immutable params safer in concurrent code?",
      "How does this differ from C++ references?",
    ],
    commonMistakes: [
      "Believing objects are pass-by-reference",
      "Expecting param reassignment to affect the caller",
      "Mutating a shared collection passed by another layer",
    ],
    bestPractices: [
      "Return new values instead of mutating params",
      "Prefer immutable arguments",
      "Defensively copy collections crossing API boundaries",
    ],
    relatedTech: ["immutability", "records", "defensive copy"],
    difficulty: "Medium",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Cognizant", "Wipro"],
    related: ["immutable-class-design", "why-string-immutable"],
  },
  {
    slug: "immutable-class-design",
    categoryId: "core-java",
    topic: "OOP",
    question: "How do you design a correct immutable class for a multi-threaded service?",
    tags: ["immutability", "thread-safety", "defensive copy", "records", "value object"],
    shortAnswer:
      "Make the class final, all fields private final, no setters, initialize in the constructor, and defensively copy any mutable inputs/outputs (collections, dates). Java records do most of this — but you must still deep-copy mutable members.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "final class", v: "no subclass can add mutability" },
          { k: "private final fields", v: "set once" },
          { k: "no setters", v: "no post-construction change" },
          { k: "defensive copy", v: "in (ctor) and out (getters)" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `public final class Money {
    private final long cents;
    private final List<String> tags;
    public Money(long cents, List<String> tags) {
        this.cents = cents;
        this.tags = List.copyOf(tags); // defensive copy in
    }
    public List<String> tags() { return tags; } // already unmodifiable
}`,
    },
    whatIf: {
      q: "A record holds a List field — is it truly immutable?",
      a: "No. The record reference is final, but the List itself is still mutable, so callers can change its contents. You must copy it in the compact constructor (List.copyOf) and expose an unmodifiable view.",
    },
    realWorld:
      "Immutable value objects (Money, DateRange, Coordinates) are shared freely across threads with zero synchronization — the backbone of thread-safe domain models and functional-style services.",
    interviewerExpectation: ["final class/fields", "no setters", "defensive copies of mutable members", "records caveat", "thread-safety benefit"],
    followUps: [
      "How do records help, and where do they fall short?",
      "How do you 'modify' an immutable object (with-er / copy)?",
      "Why are immutable objects inherently thread-safe?",
    ],
    commonMistakes: [
      "Storing a mutable collection/date without copying",
      "Returning the internal mutable reference from a getter",
      "Forgetting final on the class, allowing a mutable subclass",
    ],
    bestPractices: [
      "Defensive-copy mutable inputs and outputs",
      "Prefer records + List.copyOf for value objects",
      "Provide with-style copy methods for 'changes'",
    ],
    relatedTech: ["records", "List.copyOf", "Collections.unmodifiableList", "Lombok @Value"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["why-string-immutable", "java-pass-by-value", "hibernate-equals-hashcode"],
  },
  {
    slug: "static-init-deadlock",
    categoryId: "core-java",
    topic: "JVM/Class loading",
    question: "How can static initialization order cause a subtle bug or even a deadlock?",
    tags: ["static", "class loading", "initialization", "deadlock", "singleton"],
    shortAnswer:
      "Static initializers run once at class load, in textual order, and can deadlock if two classes initialize each other from different threads. Circular static dependencies also yield half-initialized (null/zero) values.",
    mindMap: [
      { type: "text", content: "Class init holds a per-class lock. If thread A loads ClassX (which needs ClassY) while thread B loads ClassY (which needs ClassX), each waits on the other's init lock → deadlock." },
    ],
    handsOn: {
      lang: "java",
      code: `class A { static int x = B.y + 1; }
class B { static int y = A.x + 1; } // circular init
// One of x/y reads the other while it's still 0`,
    },
    whatIf: {
      q: "An app hangs only at startup under load — how do you confirm a static-init deadlock?",
      a: "Take a thread dump (jstack). You'll see two threads BLOCKED in <clinit> of different classes, each waiting on the other's class-init monitor. Fix by breaking the cycle or lazy-loading.",
    },
    realWorld:
      "Static-init deadlocks surface as intermittent startup hangs in multi-threaded bootstrapping (e.g. parallel class loading, driver registration); the thread dump shows BLOCKED <clinit> frames.",
    interviewerExpectation: ["<clinit> runs once, in order", "per-class init lock", "circular dependency → deadlock/partial init", "thread dump diagnosis"],
    followUps: [
      "How does the JVM guarantee init runs once and thread-safely?",
      "Why is the initialization-on-demand holder idiom a safe lazy singleton?",
      "How do you read <clinit> frames in a thread dump?",
    ],
    commonMistakes: [
      "Circular static dependencies between classes",
      "Heavy work (I/O, network) in static initializers",
      "Assuming static fields are set before another class reads them",
    ],
    bestPractices: [
      "Avoid cross-class static cycles",
      "Use the holder idiom for lazy, thread-safe singletons",
      "Keep static blocks trivial; do heavy init lazily",
    ],
    relatedTech: ["holder idiom", "jstack", "classloaders"],
    difficulty: "Medium",
    experience: ["8-15 years"],
    askedIn: ["Google", "Amazon", "Microsoft"],
    related: ["classloader-leak-redeploy", "java-memory-leak-diagnosis"],
  },
  {
    slug: "exception-anti-patterns",
    categoryId: "core-java",
    topic: "Exceptions",
    question: "What are the exception anti-patterns that cause silent failures in production?",
    tags: ["exceptions", "logging", "anti-patterns", "observability"],
    shortAnswer:
      "Swallowing exceptions (empty catch), catching Exception/Throwable too broadly, losing the cause when re-wrapping, logging-and-rethrowing (double logs), and using exceptions for control flow. Each hides root cause or floods logs.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Swallow", v: "catch {} → invisible failure" },
          { k: "Too broad", v: "catch (Exception) hides bugs" },
          { k: "Lost cause", v: "throw new X() without e" },
          { k: "Log+rethrow", v: "duplicate noise" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `// BAD
try { pay(); } catch (Exception e) { } // swallowed

// GOOD
try { pay(); }
catch (PaymentException e) {
    throw new OrderFailedException("pay failed for " + id, e); // keep cause
}`,
    },
    whatIf: {
      q: "A request fails but the logs show nothing — most likely cause?",
      a: "A swallowed exception (empty catch) or a catch that logs at DEBUG/returns null. The fix: never swallow; log at the right level once, at the boundary, with the full stack trace and a correlation id.",
    },
    realWorld:
      "The hardest production incidents to debug are the ones with empty catch blocks — the failure happened, but there's no trace, so you're blind. Log-once-at-the-edge with correlation ids is the cure.",
    interviewerExpectation: ["never swallow", "catch narrowly", "preserve cause", "log once at boundary", "correlation id"],
    followUps: [
      "Where should you log vs rethrow in a layered app?",
      "How do correlation/trace ids help across microservices?",
      "Why is catching Throwable especially dangerous?",
    ],
    commonMistakes: [
      "Empty catch blocks",
      "throw new RuntimeException(e.getMessage()) — drops the stack",
      "Logging and rethrowing the same exception repeatedly",
    ],
    bestPractices: [
      "Log once at the boundary with the full cause + correlation id",
      "Catch the most specific type",
      "Wrap with the cause; fail fast on programming errors",
    ],
    relatedTech: ["SLF4J/Logback", "MDC correlation id", "@ControllerAdvice", "OpenTelemetry"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Cognizant", "Accenture"],
    related: ["checked-vs-unchecked-exceptions", "try-with-resources-leak"],
  },

  // ---------------------------------------------------------------- Hard (6)
  {
    slug: "java-memory-leak-diagnosis",
    categoryId: "core-java",
    topic: "Memory/GC",
    question: "A long-running service's heap keeps growing until OutOfMemoryError — how do you diagnose it?",
    tags: ["memory leak", "heap dump", "oom", "gc", "profiling", "production"],
    shortAnswer:
      "Confirm with GC logs (old gen not reclaimed after Full GC), capture a heap dump (jmap / -XX:+HeapDumpOnOutOfMemoryError), analyze dominator tree in Eclipse MAT to find the GC root holding the growing object set — usually an unbounded cache, static collection, or ThreadLocal.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "1. Confirm", v: "GC logs — old gen grows post-Full-GC" },
          { k: "2. Capture", v: "HeapDumpOnOutOfMemoryError / jmap" },
          { k: "3. Analyze", v: "MAT dominator tree → GC root" },
          { k: "Usual suspect", v: "unbounded cache / static map / ThreadLocal" },
        ],
      },
    ],
    handsOn: {
      lang: "bash",
      code: `# auto-capture on OOM
-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/dumps
# or on demand
jmap -dump:live,format=b,file=heap.hprof <pid>
# then open heap.hprof in Eclipse MAT → 'Leak Suspects'`,
    },
    whatIf: {
      q: "GC runs constantly but frees little and CPU is pegged — what's happening?",
      a: "That's GC thrashing: the live set nearly fills the heap, so Full GCs run back-to-back reclaiming little (the 'GC overhead limit exceeded' precursor). Either the heap is too small or there's a leak retaining objects.",
    },
    realWorld:
      "The #1 enterprise Java leak is an unbounded HashMap cache (no eviction/TTL) or a static List that only ever grows. MAT's dominator tree points straight at the retaining GC root.",
    interviewerExpectation: ["GC logs first", "heap dump + MAT dominator tree", "GC roots / retained size", "unbounded cache / static / ThreadLocal", "bounded cache fix"],
    followUps: [
      "How do you tell a leak from just under-sized heap?",
      "What's retained vs shallow size in MAT?",
      "How does a ThreadLocal leak in a thread pool?",
    ],
    commonMistakes: [
      "Just bumping -Xmx instead of finding the root cause",
      "Analyzing without a heap dump (guessing)",
      "Caches with no max size or eviction policy",
    ],
    bestPractices: [
      "Always enable HeapDumpOnOutOfMemoryError in prod",
      "Bound every cache (size + TTL) — Caffeine/Guava",
      "Watch old-gen occupancy as an alert signal",
    ],
    relatedTech: ["Eclipse MAT", "jmap/jcmd", "Caffeine cache", "G1/ZGC", "Prometheus JVM metrics"],
    references: [
      { label: "Eclipse Memory Analyzer (MAT)", url: "https://eclipse.dev/mat/" },
    ],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "Deloitte"],
    related: ["threadlocal-memory-leak", "classloader-leak-redeploy", "autoboxing-performance-trap"],
  },
  {
    slug: "threadlocal-memory-leak",
    categoryId: "core-java",
    topic: "Memory/GC",
    question: "How can ThreadLocal cause a memory leak in a thread-pool / application server?",
    tags: ["threadlocal", "memory leak", "thread pool", "tomcat", "classloader"],
    shortAnswer:
      "Pool threads live forever, so a value set in ThreadLocal is never garbage-collected unless you remove() it. Worse, the value can pin an entire web-app ClassLoader, leaking on redeploy. Always remove() in a finally.",
    mindMap: [
      { type: "text", content: "ThreadLocal lives as long as the **thread**. In a pool the thread is reused indefinitely, so the value survives the request and accumulates — and may hold a reference to your whole app classloader." },
    ],
    handsOn: {
      lang: "java",
      code: `private static final ThreadLocal<Ctx> CTX = new ThreadLocal<>();
try {
    CTX.set(new Ctx(userId));
    handle(request);
} finally {
    CTX.remove(); // MUST clean up on pooled threads
}`,
    },
    whatIf: {
      q: "After several hot redeploys, Tomcat OOMs with 'previous web app failed to stop it' warnings — why?",
      a: "A ThreadLocal (often from a library) on a pooled request thread still references a class from the old web app, pinning its ClassLoader so the entire old app can't be GC'd. Each redeploy leaks another copy.",
    },
    realWorld:
      "Tomcat explicitly warns about ThreadLocal-related classloader leaks on undeploy. Frameworks that store context (security, MDC, transactions) in ThreadLocal must clear it at request end.",
    interviewerExpectation: ["thread lifetime = value lifetime", "pooled threads never die", "remove() in finally", "classloader pinning on redeploy"],
    followUps: [
      "Why does ThreadLocal use weak keys but strong values?",
      "How do filters/interceptors guarantee cleanup?",
      "How does this interact with virtual threads?",
    ],
    commonMistakes: [
      "set() without remove() on pooled threads",
      "Assuming request end clears ThreadLocal",
      "Storing large objects / classloader-bound objects in ThreadLocal",
    ],
    bestPractices: [
      "Always remove() in a finally (or a servlet filter at request end)",
      "Keep ThreadLocal values small and short-lived",
      "Audit library ThreadLocals when chasing redeploy leaks",
    ],
    relatedTech: ["Tomcat", "MDC (Logback)", "Spring SecurityContextHolder", "virtual threads"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Google"],
    related: ["java-memory-leak-diagnosis", "classloader-leak-redeploy"],
  },
  {
    slug: "serialization-pitfalls",
    categoryId: "core-java",
    topic: "Serialization",
    question: "What are the pitfalls of Java serialization in distributed/enterprise systems?",
    tags: ["serialization", "serialversionuid", "security", "deserialization", "versioning"],
    shortAnswer:
      "Native Java serialization is brittle (version skew via serialVersionUID), leaks internals, breaks across languages, and is a major security risk — deserializing untrusted bytes enables remote code execution. Prefer JSON/Protobuf/Avro with explicit schemas.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Versioning", v: "field changes break readObject" },
          { k: "Security", v: "untrusted deserialization → RCE" },
          { k: "Coupling", v: "Java-only, exposes private fields" },
          { k: "Fix", v: "JSON / Protobuf / Avro schemas" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `class Order implements Serializable {
    private static final long serialVersionUID = 1L; // pin it!
    private transient String secret;  // skip from the wire
}`,
    },
    whatIf: {
      q: "Why is 'never deserialize untrusted data' a security rule?",
      a: "Native deserialization can instantiate arbitrary classes and invoke gadget chains (readObject side effects), leading to remote code execution — the root of many CVEs (e.g. Apache Commons Collections gadgets). Use allow-lists or avoid Java serialization entirely.",
    },
    realWorld:
      "Enterprises migrate session/cache payloads off Java serialization to JSON/Protobuf both for cross-service/language compatibility and to close deserialization-RCE attack surface.",
    interviewerExpectation: ["serialVersionUID versioning", "transient for secrets", "deserialization RCE risk", "schema formats (Protobuf/Avro/JSON)", "cross-language"],
    followUps: [
      "What does serialVersionUID actually control?",
      "How do ObjectInputFilter allow-lists mitigate gadget attacks?",
      "Why are Protobuf/Avro better for schema evolution?",
    ],
    commonMistakes: [
      "Letting the JVM auto-generate serialVersionUID (breaks on recompile)",
      "Serializing secrets (not marking transient)",
      "Deserializing untrusted input with native Java serialization",
    ],
    bestPractices: [
      "Declare an explicit serialVersionUID",
      "Use schema-based formats (Protobuf/Avro/JSON) for interchange",
      "If you must, apply ObjectInputFilter allow-lists",
    ],
    relatedTech: ["Protobuf", "Avro", "Jackson", "ObjectInputFilter"],
    references: [
      { label: "OWASP — Deserialization of Untrusted Data", url: "https://owasp.org/www-community/vulnerabilities/Deserialization_of_untrusted_data" },
    ],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["hibernate-equals-hashcode", "immutable-class-design"],
  },
  {
    slug: "finalize-and-cleaner",
    categoryId: "core-java",
    topic: "Memory/GC",
    question: "Why is finalize() discouraged, and what replaces it for resource cleanup?",
    tags: ["finalize", "cleaner", "phantomreference", "resource management", "gc"],
    shortAnswer:
      "finalize() runs on an unpredictable schedule (or never), can resurrect objects, slows GC, and may not run at all — so it can't be trusted to release resources. It's deprecated; use try-with-resources/AutoCloseable, or Cleaner/PhantomReference as a safety net.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Unpredictable", v: "no guarantee it ever runs" },
          { k: "Slow", v: "extra GC cycle to finalize" },
          { k: "Risky", v: "object resurrection, exceptions ignored" },
          { k: "Use instead", v: "AutoCloseable + try-with-resources" },
        ],
      },
    ],
    whatIf: {
      q: "If close() is deterministic, why add a Cleaner at all?",
      a: "As a last-resort safety net: if a caller forgets close(), the Cleaner releases the native resource when the object becomes unreachable — preventing a permanent leak. The primary path is still explicit close().",
    },
    realWorld:
      "Classes wrapping native/OS resources (files, sockets, off-heap buffers) implement AutoCloseable for deterministic release and register a Cleaner purely as a backstop — never relying on finalize().",
    interviewerExpectation: ["finalize deprecated/unreliable", "try-with-resources primary", "Cleaner/PhantomReference backstop", "no resurrection"],
    followUps: [
      "How does java.lang.ref.Cleaner work?",
      "Why must the Cleaner action not reference the object it cleans?",
      "What's the difference between weak/soft/phantom references?",
    ],
    commonMistakes: [
      "Releasing resources in finalize()",
      "Relying on GC timing for cleanup",
      "Capturing the host object inside the Cleaner action (prevents collection)",
    ],
    bestPractices: [
      "Implement AutoCloseable; close deterministically",
      "Use Cleaner only as a safety net",
      "Never depend on finalize() — it's removed in newer JDKs",
    ],
    relatedTech: ["AutoCloseable", "java.lang.ref.Cleaner", "PhantomReference", "off-heap buffers"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Google", "Amazon", "Microsoft"],
    related: ["try-with-resources-leak", "java-memory-leak-diagnosis"],
  },
  {
    slug: "hibernate-equals-hashcode",
    categoryId: "core-java",
    topic: "OOP",
    question: "How should equals() and hashCode() be implemented for JPA/Hibernate entities?",
    tags: ["equals", "hashcode", "jpa", "hibernate", "orm", "identity"],
    shortAnswer:
      "Don't use the auto-generated DB id (it's null before persist) or all mutable fields. Use a stable business key, or a UUID assigned at construction. Inconsistent equals/hashCode breaks Sets and causes duplicates after merge/persist.",
    mindMap: [
      { type: "text", content: "The trap: a new entity has `id == null`. If equals/hashCode use id, the object's hash **changes** once persisted — so it's lost in any HashSet it was added to before saving." },
      {
        type: "kv",
        rows: [
          { k: "All fields", v: "breaks on mutation / lazy proxies" },
          { k: "DB id", v: "null pre-persist → hash changes" },
          { k: "Best", v: "stable business key or app-assigned UUID" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `@Entity class Customer {
    @Id private final UUID id = UUID.randomUUID(); // assigned at creation
    @Override public boolean equals(Object o) {
        return o instanceof Customer c && id.equals(c.id);
    }
    @Override public int hashCode() { return id.hashCode(); }
}`,
    },
    whatIf: {
      q: "Why can equals fail on a lazily-loaded entity inside a Set?",
      a: "Hibernate may hand you a proxy subclass, so getClass()-based equals returns false against the real class. Use instanceof (not getClass()) and compare the id field directly — proxies still resolve the id.",
    },
    realWorld:
      "Duplicate rows in a @OneToMany Set, or entities 'disappearing' from a HashSet after save, almost always trace to id-based equals/hashCode on entities whose id is generated by the database.",
    interviewerExpectation: ["null id before persist", "hash must be stable", "business key / app-assigned UUID", "instanceof not getClass (proxies)", "Set semantics"],
    followUps: [
      "Why prefer app-assigned UUIDs over DB-generated ids for identity?",
      "How do Hibernate proxies affect equals/getClass?",
      "When is it OK to rely on default Object identity?",
    ],
    commonMistakes: [
      "equals/hashCode based on a DB-generated id",
      "Using all mutable fields in equals",
      "getClass() comparison failing against lazy proxies",
    ],
    bestPractices: [
      "Assign a UUID/business key at construction for identity",
      "Use instanceof in equals to tolerate proxies",
      "Keep hashCode stable across the entity's lifecycle",
    ],
    relatedTech: ["JPA/Hibernate", "UUID", "Lombok @EqualsAndHashCode(of=...)", "Spring Data"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Deloitte", "Amazon", "Cognizant", "Accenture"],
    related: ["java-equals-hashcode", "immutable-class-design", "serialization-pitfalls"],
  },
  {
    slug: "classloader-leak-redeploy",
    categoryId: "core-java",
    topic: "JVM/Class loading",
    question: "What causes a ClassLoader leak on application redeploy, and how do you fix it?",
    tags: ["classloader", "memory leak", "redeploy", "tomcat", "metaspace", "production"],
    shortAnswer:
      "On undeploy the old web-app ClassLoader should be GC'd. If anything outside the app (a JVM-wide thread, ThreadLocal, JDBC driver, or static cache) still references a class loaded by it, the whole ClassLoader (and all its classes) is pinned — leaking Metaspace each redeploy until OOM.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Pin sources", v: "ThreadLocals, JVM threads, JDBC drivers" },
          { k: "Also", v: "static caches, shutdown hooks, MBeans" },
          { k: "Symptom", v: "Metaspace grows per redeploy → OOM" },
        ],
      },
    ],
    whatIf: {
      q: "How do you actually find what's pinning the old ClassLoader?",
      a: "Heap-dump after a couple of redeploys and use MAT's 'Path to GC Roots' on the leaked WebappClassLoader instances — it shows the exact reference chain (e.g. a Thread's ThreadLocal or a static driver list) holding it.",
    },
    realWorld:
      "The textbook case: an app registers a JDBC driver but never deregisters it, so the JVM's DriverManager (a system class) keeps a strong reference to the app's driver class — pinning the whole app ClassLoader on every redeploy.",
    interviewerExpectation: ["per-webapp classloader", "external strong ref pins it", "ThreadLocal/driver/thread/static causes", "Metaspace growth", "MAT path-to-GC-roots"],
    followUps: [
      "Why does deregistering the JDBC driver on shutdown matter?",
      "How is this different from a normal heap leak?",
      "How does Metaspace differ from the old PermGen?",
    ],
    commonMistakes: [
      "Not deregistering JDBC drivers / stopping threads on shutdown",
      "Library ThreadLocals left set on container threads",
      "Static caches holding app-loaded classes",
    ],
    bestPractices: [
      "Clean up in ServletContextListener.contextDestroyed (threads, drivers, ThreadLocals)",
      "Monitor Metaspace; alert on per-redeploy growth",
      "Prefer full restarts over hot redeploys in production",
    ],
    relatedTech: ["Tomcat WebappClassLoader", "Metaspace", "DriverManager", "Eclipse MAT", "ServletContextListener"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["threadlocal-memory-leak", "java-memory-leak-diagnosis", "static-init-deadlock"],
  },
];
