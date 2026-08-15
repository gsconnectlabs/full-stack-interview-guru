import type { Question } from "../types";

/**
 * Advanced Java — content expansion batch (25 questions, ROADMAP CE3 / Release 10).
 *
 * Senior-level, interview-grade coverage of the JVM internals, class loading,
 * memory model, references/GC, serialization, metaprogramming (reflection,
 * dynamic proxies, annotations), the object contracts (Comparable/Comparator,
 * equals/hashCode, immutability), generics variance & erasure pitfalls, safe
 * iteration, and the modern concurrency stack (Executor lifecycle, task
 * exception propagation, CompletableFuture composition, ForkJoin, ThreadLocal /
 * ScopedValue, virtual threads in production).
 *
 * DELIBERATE NON-DUPLICATION (DECISIONS — Release 10). The flagship `jvm`,
 * `core-java`, `java-collections` and `multithreading` batches already own the
 * canonical page for most of these topics (e.g. `jvm-jre-jdk`,
 * `classloading-delegation`, `java-memory-model`, `reference-types`,
 * `comparable-vs-comparator`, `java-equals-hashcode`, `immutable-class-design`,
 * `generics-type-erasure`, `fail-fast-vs-fail-safe`, `executorservice-thread-pools`,
 * `runnable-vs-callable-future`, `completablefuture-async`,
 * `forkjoinpool-work-stealing`, `threadlocal-memory-leak`, `virtual-threads`).
 * To avoid keyword cannibalisation, every question here takes a *distinct,
 * deeper advanced facet* than the existing base question and cross-links to it
 * via `related` (the same pattern CE2 used for `json-vs-xml-differences` →
 * `json-vs-xml`). The five genuinely-missing topics — Serialization vs
 * Externalization, `transient`, Reflection API, Dynamic Proxy, Annotations,
 * Records & Sealed Classes — are covered head-on.
 *
 * This batch takes the `advanced-java` category from 3 live questions to 28,
 * crossing MIN_LIVE_TO_LIST (10) so the category becomes listed + indexed + in
 * the sitemap. No route/URL/schema change. Difficulty skews senior: 9 Medium ·
 * 16 Hard. Each question also sets the SEO overrides (`seoTitle`,
 * `seoDescription`, `heading`) from DECISIONS #033.
 */
export const advancedJavaExtra: Question[] = [
  // ============================================ Section 1 — JVM & Class Loading
  {
    slug: "jdk-jre-jvm-internals",
    categoryId: "advanced-java",
    topic: "JVM Internals",
    question: "Beyond the definitions, what actually happens between javac and native execution across the JDK, JRE and JVM?",
    seoTitle: "JDK vs JRE vs JVM Internals: Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "How the JDK, JRE and JVM cooperate from source to machine code: javac → bytecode → class loading → interpreter → tiered JIT (C1/C2). JDK tooling, jlink runtime images, and interview answers.",
    heading: "JDK vs JRE vs JVM Internals — Interview Questions",
    tags: ["jvm", "jdk", "jre", "jit", "bytecode", "tiered compilation"],
    shortAnswer:
      "The JDK is the toolchain that compiles and packages (javac, jlink, javap, jshell); the JRE is the runtime = JVM + core libraries; the JVM is the execution engine that loads bytecode, verifies it, interprets it, and — once code is hot — JIT-compiles it to native machine code via tiered compilation (C1 → C2). Modern Java has no standalone JRE download: you ship a trimmed runtime image built with jlink.",
    mindMap: [
      { type: "text", content: "Think of three layers stacked by responsibility: **JDK builds it, JRE runs it, JVM executes it**. `javac` never produces machine code — it produces portable **bytecode** (`.class`), and the JVM turns that into native instructions at runtime." },
      {
        type: "kv",
        rows: [
          { k: "JDK", v: "Compiler + tools (javac, javap, jlink, jshell, jcmd)" },
          { k: "JRE", v: "JVM + core class libraries (the run layer)" },
          { k: "JVM", v: "Loads → verifies → interprets → JIT-compiles bytecode" },
          { k: "Execution", v: "Interpreter first, then C1/C2 JIT for hot paths" },
        ],
      },
      { type: "text", content: "**Tiered compilation**: methods start interpreted (fast startup), get profiled, then the C1 (client) and C2 (server) compilers produce increasingly optimised native code for the hot ones. That's why a JVM app speeds up after warm-up." },
      { type: "text", content: "**Key takeaway:** the JVM is not just a container — it's a profiling, self-optimising runtime. 'Write once, run anywhere' is the JVM's doing, not the compiler's." },
    ],
    handsOn: {
      lang: "bash",
      code: `# JDK compiles source -> portable bytecode (not native code)
javac Hello.java          # produces Hello.class

# Inspect the bytecode the JVM will actually run
javap -c Hello            # disassemble methods

# See tiered JIT decisions at runtime
java -XX:+PrintCompilation Hello

# Build a small, JRE-free custom runtime image (replaces the old JRE)
jlink --add-modules java.base --output myruntime`,
    },
    whatIf: {
      q: "If bytecode is portable, why is the JVM platform-specific?",
      a: "Because the JVM is the layer that maps portable bytecode onto a specific OS/CPU — memory model, threading, and JIT code generation are all native. You download a different JVM build per platform, but the same .class/.jar runs on all of them. Portability lives in the bytecode contract; the JVM absorbs the platform differences.",
    },
    realWorld:
      "This shows up in Docker sizing and cold-start tuning: teams ship a jlink'd runtime image (tens of MB, no full JRE) and tune warm-up because tiered compilation means the first thousand requests run interpreted/C1 before C2 kicks in — which is exactly why benchmarks must warm up before measuring.",
    interviewerExpectation: ["JDK = build, JRE = run, JVM = execute", "javac → bytecode, not native", "class loading + verification", "interpreter then tiered JIT (C1/C2)", "no standalone JRE — jlink images"],
    followUps: [
      "What does the bytecode verifier check and why?",
      "How does C2 decide a method is 'hot'?",
      "What's the difference between AOT (GraalVM native-image) and JIT?",
    ],
    commonMistakes: [
      "Saying javac produces machine code",
      "Treating the JVM as a passive sandbox rather than a JIT compiler",
      "Assuming a full JRE still ships with modern JDKs",
    ],
    bestPractices: [
      "Build slim runtime images with jlink for containers",
      "Warm up before benchmarking (let C2 compile hot paths)",
      "Use javap/PrintCompilation to reason about performance",
    ],
    relatedTech: ["javac", "jlink", "GraalVM", "C2 JIT"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Oracle", "Microsoft", "Deloitte"],
    related: ["jvm-jre-jdk", "jit-compilation", "bytecode-platform-independence"],
  },
  {
    slug: "classloader-architecture",
    categoryId: "advanced-java",
    topic: "Class Loading",
    question: "Explain the ClassLoader hierarchy (Bootstrap, Platform, Application) and how you'd write a custom class loader.",
    seoTitle: "ClassLoader Architecture Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Java ClassLoader architecture for interviews: Bootstrap, Platform and Application loaders, class-loader namespaces, defineClass/findClass, and writing a custom ClassLoader with real examples.",
    heading: "ClassLoader Architecture — Interview Questions",
    tags: ["classloader", "jvm", "custom classloader", "namespaces", "class loading"],
    shortAnswer:
      "Java uses a hierarchy of loaders: Bootstrap (loads java.base / core JDK, written in native code, parent = null), Platform (formerly Extension, loads JDK modules), and Application/System (loads your classpath). Each loader defines a namespace, so a class's identity is (fully-qualified name + defining loader). You write a custom loader by extending ClassLoader and overriding findClass() to fetch bytes and call defineClass().",
    mindMap: [
      { type: "text", content: "A class's runtime identity is **name + the loader that defined it** — the same `com.app.Foo` loaded by two different loaders are two *distinct* classes that can't be cast to each other. That fact is the root of most 'class loading' interview questions." },
      {
        type: "kv",
        rows: [
          { k: "Bootstrap", v: "Native; loads java.base core classes; parent = null" },
          { k: "Platform", v: "Loads platform JDK modules (was 'Extension')" },
          { k: "Application", v: "Loads your classpath/modulepath" },
          { k: "Custom", v: "extends ClassLoader, override findClass → defineClass" },
        ],
      },
      { type: "text", content: "Custom loaders power plugins, hot reload, and isolation: app servers give each web app its own loader so two apps can use different versions of the same library without clashing." },
      { type: "text", content: "**Key takeaway:** loaders create isolated namespaces. If you ever see `ClassCastException: Foo cannot be cast to Foo`, two loaders defined the same class — that's the tell." },
    ],
    handsOn: {
      lang: "java",
      code: `class InMemoryClassLoader extends ClassLoader {
    private final Map<String, byte[]> classBytes;

    InMemoryClassLoader(ClassLoader parent, Map<String, byte[]> bytes) {
        super(parent);              // keep delegation intact
        this.classBytes = bytes;
    }

    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] b = classBytes.get(name);
        if (b == null) throw new ClassNotFoundException(name);
        return defineClass(name, b, 0, b.length);   // bytes -> Class
    }
}`,
    },
    whatIf: {
      q: "Why does the same class loaded by two loaders cause a ClassCastException?",
      a: "Because class identity in the JVM is (fully-qualified name, defining loader) — not the name alone. Two loaders each running defineClass on the same bytes create two separate Class objects with separate static state. Assigning one to a reference typed by the other fails, even though the source is identical. This is exactly why plugin/app-server isolation works — and why it bites you when types leak across loader boundaries.",
    },
    realWorld:
      "Tomcat/WildFly give every deployed WAR its own loader so app A can use Jackson 2.12 and app B Jackson 2.16 simultaneously; OSGi and IDE plugin systems do the same. Build tools and bytecode agents use custom loaders to instrument or hot-swap classes.",
    interviewerExpectation: ["Bootstrap/Platform/Application tiers", "loader defines a namespace", "identity = name + defining loader", "findClass + defineClass", "used for isolation/plugins"],
    followUps: [
      "How does the parent-delegation model change loading order?",
      "When would you deliberately break delegation?",
      "How do class-loader leaks happen on redeploy?",
    ],
    commonMistakes: [
      "Thinking a class name alone identifies a class",
      "Overriding loadClass instead of findClass (breaks delegation)",
      "Forgetting each loader has its own static state",
    ],
    bestPractices: [
      "Override findClass, not loadClass, to preserve delegation",
      "Give plugins/apps isolated loaders for version independence",
      "Null out custom loaders on undeploy to avoid leaks",
    ],
    relatedTech: ["Tomcat", "OSGi", "java.lang.instrument", "modulepath"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Oracle", "Amazon", "Microsoft", "Red Hat"],
    related: ["classloading-delegation", "parent-delegation-breaking", "classloader-leak-redeploy"],
  },
  {
    slug: "parent-delegation-breaking",
    categoryId: "advanced-java",
    topic: "Class Loading",
    question: "When and how do you deliberately break the parent-delegation model?",
    seoTitle: "Breaking Parent Delegation Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Breaking the Java parent-delegation model for interviews: thread-context class loaders, SPI/JDBC, servlet 'child-first' loading, and why frameworks invert delegation — with concrete examples.",
    heading: "Breaking Parent Delegation — Interview Questions",
    tags: ["classloader", "parent delegation", "thread context classloader", "spi", "jdbc"],
    shortAnswer:
      "Normal delegation asks the parent first, so core classes always win. You break it in two classic cases: (1) SPI/JDBC, where a core class (DriverManager) must load an implementation from the application loader below it — solved with the Thread Context ClassLoader; and (2) servlet containers, which use 'child-first' (parent-last) loading so a web app's bundled library shadows the server's version. You break it by overriding loadClass to search locally before delegating.",
    mindMap: [
      { type: "text", content: "Default = **ask your parent first** (child-last). This guarantees you can't override `java.lang.String`. But sometimes a class high in the hierarchy needs to load something defined *below* it — delegation runs the wrong way for that." },
      {
        type: "kv",
        rows: [
          { k: "SPI / JDBC", v: "Core code loads app impl via Thread Context CL" },
          { k: "Servlet apps", v: "Child-first: WAR libs shadow server libs" },
          { k: "How", v: "Override loadClass → try findClass before super" },
          { k: "Risk", v: "Shadowing core/JDK classes → subtle breakage" },
        ],
      },
      { type: "text", content: "The **Thread Context ClassLoader** (Thread.currentThread().getContextClassLoader()) is the escape hatch: frameworks set it so parent-level code can reach child-level implementations without hard-coding a loader." },
      { type: "text", content: "**Key takeaway:** break delegation only for SPI or intentional isolation — never to override JDK classes. Child-first is a scalpel, not a default." },
    ],
    handsOn: {
      lang: "java",
      code: `// SPI pattern: core code loads a provider it doesn't compile against
ClassLoader tccl = Thread.currentThread().getContextClassLoader();
ServiceLoader<Driver> drivers = ServiceLoader.load(Driver.class, tccl);
for (Driver d : drivers) {
    // 'd' was loaded by the application loader, not the bootstrap loader
    System.out.println("Loaded via: " + d.getClass().getClassLoader());
}`,
    },
    whatIf: {
      q: "Why can't DriverManager (a core class) just load your JDBC driver directly?",
      a: "Because the bootstrap/platform loader that defined DriverManager can't see the application classpath where your driver lives — delegation only goes upward. The Thread Context ClassLoader inverts that: the running thread carries a reference to the application loader, so core code can reach 'down' to load the concrete Driver. Without the TCCL, SPI (JDBC, JAXP, JNDI) couldn't work.",
    },
    realWorld:
      "Every JDBC connection, every ServiceLoader-based plugin, and every servlet container relies on this. When you hit 'driver not found' or the wrong library version loading in an app server, it's almost always a delegation/TCCL issue — you fix it by setting or passing the right context loader.",
    interviewerExpectation: ["default = parent-first (child-last)", "SPI needs Thread Context ClassLoader", "servlet = child-first/parent-last", "override loadClass to invert", "never shadow JDK classes"],
    followUps: [
      "What is ServiceLoader and how does it use the TCCL?",
      "What breaks if a web app bundles a JDK class?",
      "How does JPMS (modules) change the loading picture?",
    ],
    commonMistakes: [
      "Using child-first loading to override core JDK classes",
      "Forgetting to set the Thread Context ClassLoader in worker threads",
      "Assuming delegation can search downward by default",
    ],
    bestPractices: [
      "Use the TCCL for SPI lookups, not a hard-coded loader",
      "Restrict child-first shadowing to app libraries only",
      "Document any custom loadClass override carefully",
    ],
    relatedTech: ["ServiceLoader", "JDBC", "Servlet containers", "JPMS"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Oracle", "Amazon", "Red Hat", "Google"],
    related: ["classloading-delegation", "classloader-architecture", "classloader-leak-redeploy"],
  },
  {
    slug: "jmm-happens-before-advanced",
    categoryId: "advanced-java",
    topic: "Memory Model",
    question: "How do you reason about safe publication and reordering with the Java Memory Model in lock-free code?",
    seoTitle: "Java Memory Model & Safe Publication Interview Questions | Full Stack Interview Guru",
    seoDescription:
      "Java Memory Model for interviews: happens-before edges, safe publication, final-field semantics, volatile, and correct double-checked locking. Reason about visibility and reordering in lock-free code.",
    heading: "JMM Safe Publication — Interview Questions",
    tags: ["jmm", "happens-before", "safe publication", "volatile", "final fields"],
    shortAnswer:
      "The JMM defines happens-before edges that guarantee one thread sees another's writes. Beyond volatile and locks, 'safe publication' is the practical rule: an object is safely published if you share it via a volatile/final field, a static initializer, or a concurrent collection — otherwise another thread may see a partially-constructed object. final fields get a special freeze at the end of the constructor, which is what makes immutable objects safe to share without synchronization.",
    mindMap: [
      { type: "text", content: "Without a happens-before edge, a write in thread A **may never become visible** to thread B, and instructions can be reordered. Correctness in lock-free code = making sure every read is reachable from the matching write through a happens-before chain." },
      {
        type: "kv",
        rows: [
          { k: "volatile write→read", v: "establishes happens-before" },
          { k: "final fields", v: "frozen at constructor end → safe to publish" },
          { k: "Safe publication", v: "volatile / final / static init / concurrent map" },
          { k: "Danger", v: "publishing 'this' or a ref via a plain field" },
        ],
      },
      { type: "text", content: "Classic trap: **double-checked locking** is only correct if the field is `volatile` — otherwise a thread can see a non-null but not-yet-constructed instance. The volatile read/write supplies the missing happens-before edge." },
      { type: "text", content: "**Key takeaway:** immutability + final fields is the cheapest correct concurrency. If a field is written once and shared, make it final or volatile — never plain." },
    ],
    handsOn: {
      lang: "java",
      code: `class Holder {
    // volatile is REQUIRED for correct double-checked locking
    private static volatile Config instance;

    static Config get() {
        Config c = instance;                 // 1 volatile read
        if (c == null) {
            synchronized (Holder.class) {
                c = instance;
                if (c == null) instance = c = new Config();  // safe publish
            }
        }
        return c;
    }
}`,
    },
    whatIf: {
      q: "Why can another thread see a non-null but half-built object without volatile?",
      a: "Because object construction (allocate, run constructor, assign reference) can be reordered so the reference is visible before the constructor's writes are. A second thread reads the non-null reference and then reads uninitialised/default fields. Marking the field volatile inserts a happens-before edge that forbids that reordering — the reference can't be published until the constructor's writes are complete.",
    },
    realWorld:
      "This is the invisible bug behind 'it works 99.9% of the time, then a field is randomly null under load on a many-core box.' Framework internals (lazy singletons, caches, event buses) live and die by safe publication — which is why libraries lean on volatile, final, and java.util.concurrent instead of hand-rolled flags.",
    interviewerExpectation: ["happens-before edges", "safe publication rules", "final-field freeze semantics", "volatile fixes double-checked locking", "prefer immutability"],
    followUps: [
      "What exactly does the final-field freeze guarantee?",
      "How do VarHandle acquire/release modes relate to happens-before?",
      "Why is a plain boolean 'stop' flag broken?",
    ],
    commonMistakes: [
      "Double-checked locking without a volatile field",
      "Publishing 'this' from a constructor (escapes half-built)",
      "Assuming a normal write is eventually visible",
    ],
    bestPractices: [
      "Prefer immutable objects with final fields",
      "Publish shared state via volatile, final, or concurrent collections",
      "Reach for java.util.concurrent before hand-rolled sync",
    ],
    relatedTech: ["volatile", "VarHandle", "java.util.concurrent", "final"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Google", "Amazon", "Microsoft", "Netflix"],
    related: ["java-memory-model", "volatile-visibility", "double-checked-locking"],
  },
  {
    slug: "stack-frames-stackoverflow",
    categoryId: "advanced-java",
    topic: "Memory",
    question: "How do JVM thread stacks work, and what's the difference between StackOverflowError and OutOfMemoryError?",
    seoTitle: "Stack Frames & StackOverflowError Interview Questions | Full Stack Interview Guru",
    seoDescription:
      "JVM thread stacks for interviews: stack-frame anatomy, -Xss sizing, deep recursion and StackOverflowError vs heap OutOfMemoryError, and why thousands of threads exhaust memory. Real examples.",
    heading: "Stack Frames & StackOverflowError — Interview Questions",
    tags: ["stack", "stackoverflowerror", "outofmemoryerror", "recursion", "xss"],
    shortAnswer:
      "Each Java thread gets its own stack (size set by -Xss, ~512KB–1MB default) holding a frame per active method call — local variables, operand stack, and the return address. Too-deep recursion overflows one thread's stack → StackOverflowError. Creating too many threads exhausts native memory for all those stacks → OutOfMemoryError: unable to create new native thread. One is per-thread depth; the other is process-wide thread count.",
    mindMap: [
      { type: "text", content: "The stack is **per thread**; the heap is **shared**. A method call pushes a frame; returning pops it. Primitives and references live in the frame — the objects they point to live on the shared heap." },
      {
        type: "kv",
        rows: [
          { k: "Frame holds", v: "locals, operand stack, return address" },
          { k: "-Xss", v: "per-thread stack size (~512KB–1MB)" },
          { k: "StackOverflowError", v: "one thread recursed too deep" },
          { k: "OOM: native thread", v: "too many threads × stack size" },
        ],
      },
      { type: "text", content: "This is exactly why **millions of platform threads are impossible** (each reserves ~1MB) and why virtual threads — with tiny, resizable, heap-stored stacks — change the game for high-concurrency I/O." },
      { type: "text", content: "**Key takeaway:** StackOverflowError = go deeper than one stack allows (fix the recursion or raise -Xss); native-thread OOM = you created too many threads (pool them or use virtual threads)." },
    ],
    handsOn: {
      lang: "java",
      code: `// StackOverflowError: unbounded recursion blows ONE thread's stack
static int depth(int n) {
    return depth(n + 1);          // no base case
}

public static void main(String[] a) {
    try {
        depth(0);
    } catch (StackOverflowError e) {
        System.out.println("Blew the stack: " + e);
    }
}`,
      output: "Blew the stack: java.lang.StackOverflowError",
    },
    whatIf: {
      q: "Your service dies with 'OutOfMemoryError: unable to create new native thread' but heap looks fine — why?",
      a: "Because that OOM isn't about the heap at all — it's native memory for thread stacks. Each thread reserves ~1MB (-Xss), so a few thousand threads (a leaking thread-per-request design, or an unbounded pool) exhaust the OS limit even with a healthy heap. Fix it by bounding the pool, lowering -Xss, or switching I/O-bound work to virtual threads — not by raising -Xmx.",
    },
    realWorld:
      "Two of the most common production incidents map directly here: a recursive parser/serializer hitting cyclic data (StackOverflowError), and a thread-per-connection server or leaking executor exhausting native thread memory under load. Knowing which OOM you're looking at tells you whether to fix code depth or thread count.",
    interviewerExpectation: ["per-thread stack, shared heap", "frame = locals + operand stack", "StackOverflowError = depth", "native-thread OOM = thread count", "virtual threads change the math"],
    followUps: [
      "How do virtual threads avoid the ~1MB stack cost?",
      "When would you increase -Xss instead of fixing recursion?",
      "What are the different OutOfMemoryError subtypes?",
    ],
    commonMistakes: [
      "Confusing StackOverflowError with heap OutOfMemoryError",
      "Raising -Xmx to fix a native-thread OOM",
      "Ignoring recursion depth on untrusted/cyclic input",
    ],
    bestPractices: [
      "Bound recursion or convert deep recursion to iteration",
      "Cap thread pools; never create unbounded threads",
      "Use virtual threads for high-concurrency blocking I/O",
    ],
    relatedTech: ["-Xss", "virtual threads", "JFR", "thread dumps"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Oracle"],
    related: ["stack-vs-heap-memory", "outofmemoryerror-types", "virtual-threads"],
  },
  {
    slug: "gc-collectors-tradeoffs",
    categoryId: "advanced-java",
    topic: "Garbage Collection",
    question: "How do the modern collectors (Parallel, G1, ZGC, Shenandoah) trade off throughput vs latency, and how do you choose?",
    seoTitle: "GC Collectors Trade-offs Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Choosing a Java garbage collector for interviews: Parallel vs G1 vs ZGC vs Shenandoah, throughput vs pause latency, heap size limits, and workload-based selection. A clear decision guide.",
    heading: "Choosing a GC: Throughput vs Latency — Interview Questions",
    tags: ["garbage collection", "g1", "zgc", "shenandoah", "latency", "throughput"],
    shortAnswer:
      "It's a throughput-vs-latency trade-off. Parallel GC maximises throughput but has long stop-the-world pauses — good for batch. G1 (the default) balances the two with region-based, mostly-concurrent collection and a pause-time target — good for general server apps. ZGC and Shenandoah are concurrent, region-based collectors that keep pauses sub-millisecond even on multi-hundred-GB heaps — pick them for latency-sensitive services with large heaps, at a small throughput cost.",
    mindMap: [
      { type: "text", content: "There's no 'best' collector — there's the right one for your **SLO**. Every collector trades some combination of pause time, throughput, footprint, and heap-size ceiling." },
      {
        type: "kv",
        rows: [
          { k: "Parallel", v: "Max throughput, long STW — batch/ETL" },
          { k: "G1 (default)", v: "Balanced, pause-target, region-based" },
          { k: "ZGC / Shenandoah", v: "Sub-ms pauses, huge heaps, concurrent" },
          { k: "Serial", v: "Tiny heaps / single-core / containers" },
        ],
      },
      { type: "text", content: "Rule of thumb: **batch → Parallel**, **typical service → G1**, **low-latency / very large heap → ZGC or Shenandoah**, **tiny footprint → Serial**. Measure allocation rate and pause SLO before switching." },
      { type: "text", content: "**Key takeaway:** choose by SLO, then tune. Reach for the deep-dive pages (G1 internals, ZGC) once you've picked the family that matches your latency budget." },
    ],
    handsOn: {
      lang: "bash",
      code: `# Batch job: favour throughput
java -XX:+UseParallelGC -Xmx8g BatchJob

# Latency-sensitive service on a large heap
java -XX:+UseZGC -Xmx64g -XX:+ZGenerational Service

# G1 (default) with an explicit pause target
java -XX:MaxGCPauseMillis=100 -Xmx8g Service`,
    },
    whatIf: {
      q: "A trading service has a 200GB heap and a 1ms pause SLO — which collector, and why not G1?",
      a: "ZGC or Shenandoah. G1's stop-the-world pauses grow with heap and live-set size, so at 200GB it can't hold a 1ms SLO. ZGC/Shenandoah do their marking, relocation, and reference processing concurrently with the application using load/read barriers, keeping pauses sub-millisecond almost independently of heap size — the exact profile a large, latency-critical service needs. You accept a modest throughput/CPU overhead for that predictability.",
    },
    realWorld:
      "Nightly analytics or Spark jobs run Parallel GC to finish faster; a typical Spring Boot API runs the G1 default and rarely needs to change; latency-critical trading, ad-serving, and gaming backends on big heaps move to ZGC/Shenandoah specifically to kill tail-latency pauses that show up as p99 spikes.",
    interviewerExpectation: ["throughput vs latency trade-off", "Parallel = batch", "G1 = balanced default", "ZGC/Shenandoah = sub-ms, large heap", "choose by SLO then tune"],
    followUps: [
      "How does G1 achieve its pause target internally?",
      "How do ZGC/Shenandoah stay concurrent (barriers)?",
      "How do you measure whether GC is actually your bottleneck?",
    ],
    commonMistakes: [
      "Assuming one collector is universally fastest",
      "Using G1 for a very large heap with tight pause SLOs",
      "Switching collectors without measuring allocation rate/pauses",
    ],
    bestPractices: [
      "Pick the collector family from your latency SLO",
      "Right-size the heap before blaming the collector",
      "Verify with GC logs / JFR after any change",
    ],
    relatedTech: ["G1", "ZGC", "Shenandoah", "JFR"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Netflix", "Google", "Goldman Sachs"],
    related: ["g1-gc-internals", "zgc-low-pause", "choosing-a-gc"],
  },
  {
    slug: "reference-types-gc-caching",
    categoryId: "advanced-java",
    topic: "References",
    question: "How do you build a leak-free cache or cleanup mechanism with soft, weak and phantom references?",
    seoTitle: "Weak & Soft Reference Caches Interview Questions | Full Stack Interview Guru",
    seoDescription:
      "Applying Java reference types for interviews: WeakHashMap canonical maps, soft-reference caches, ReferenceQueue with phantom references for cleanup, and why they replace finalizers. Real examples.",
    heading: "Weak/Soft Reference Caches — Interview Questions",
    tags: ["weak reference", "soft reference", "phantom reference", "cache", "referencequeue"],
    shortAnswer:
      "Use weak references for memory-sensitive canonical maps (WeakHashMap keys vanish when no strong ref remains); use soft references for caches you want the GC to reclaim only under memory pressure; use phantom references with a ReferenceQueue to run deterministic cleanup after an object is collected — the modern, safe replacement for finalize(). The trick is pairing the reference with a ReferenceQueue so you're notified when the referent is cleared.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Weak", v: "Cleared eagerly at next GC — canonical maps" },
          { k: "Soft", v: "Cleared only under memory pressure — caches" },
          { k: "Phantom", v: "Enqueued after collection — cleanup hooks" },
          { k: "ReferenceQueue", v: "How you learn a referent was cleared" },
        ],
      },
      { type: "text", content: "**WeakHashMap** is the canonical example: entries disappear automatically once the key has no strong reference elsewhere — perfect for metadata keyed by an object you don't own the lifecycle of." },
      { type: "text", content: "**Phantom + ReferenceQueue + Cleaner** replaced `finalize()` because finalizers are unpredictable, can resurrect objects, and stall GC. Cleaner gives you post-mortem cleanup without those hazards." },
      { type: "text", content: "**Key takeaway:** soft = 'keep if you can', weak = 'drop when unreferenced', phantom = 'tell me after it's gone'. Never use finalize()." },
    ],
    handsOn: {
      lang: "java",
      code: `// Soft-reference cache: GC reclaims entries only under memory pressure
Map<Key, SoftReference<Value>> cache = new ConcurrentHashMap<>();

Value get(Key k) {
    SoftReference<Value> ref = cache.get(k);
    Value v = (ref != null) ? ref.get() : null;   // may be null after GC
    if (v == null) {
        v = load(k);
        cache.put(k, new SoftReference<>(v));
    }
    return v;
}`,
    },
    whatIf: {
      q: "Why is a soft-reference cache risky as your main caching strategy?",
      a: "Because you cede eviction control to the GC: entries are kept until the heap is under pressure, then dropped en masse — so hit-rate is unpredictable and a full GC can wipe the cache right when you're busiest. Softs also delay reclamation and add GC work. For real caching, prefer a bounded, policy-driven cache (Caffeine/LRU with a size or TTL limit); reserve soft/weak refs for canonical maps and last-resort memory safety.",
    },
    realWorld:
      "WeakHashMap backs framework metadata and listener registries so they don't pin objects in memory; Cleaner/phantom references release native handles (off-heap buffers, file descriptors) deterministically. Teams that tried soft-reference 'caches' usually migrate to Caffeine after seeing erratic hit rates and GC pauses.",
    interviewerExpectation: ["weak = eager clear", "soft = memory-pressure clear", "phantom + queue = post-collection cleanup", "WeakHashMap use case", "Cleaner replaces finalize"],
    followUps: [
      "Why is finalize() deprecated and what replaced it?",
      "How does ReferenceQueue notify you of cleared referents?",
      "When would you choose Caffeine over reference-based caching?",
    ],
    commonMistakes: [
      "Using SoftReferences as a primary cache and expecting stable hit rates",
      "Relying on finalize() for resource cleanup",
      "Forgetting a WeakHashMap value can strongly reference its key",
    ],
    bestPractices: [
      "Use bounded caches (Caffeine) for real caching",
      "Use WeakHashMap for lifecycle-borrowed metadata",
      "Use Cleaner/phantom refs — never finalize() — for native cleanup",
    ],
    relatedTech: ["WeakHashMap", "Cleaner", "Caffeine", "ReferenceQueue"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Oracle", "Microsoft"],
    related: ["reference-types", "finalize-and-cleaner", "threadlocal-memory-leak"],
  },

  // ==================================== Section 2 — Serialization & Metaprogramming
  {
    slug: "serialization-vs-externalization",
    categoryId: "advanced-java",
    topic: "Serialization",
    question: "What is the difference between Serializable and Externalizable, and when would you implement Externalizable?",
    seoTitle: "Serialization vs Externalization Interview Questions (Java) | Full Stack Interview Guru",
    seoDescription:
      "Serializable vs Externalizable in Java for interviews: automatic vs fully-controlled serialization, writeExternal/readExternal, performance and versioning trade-offs, and why teams avoid both. Examples.",
    heading: "Serialization vs Externalization — Interview Questions",
    tags: ["serialization", "externalizable", "serializable", "writeexternal", "java"],
    shortAnswer:
      "Serializable is a marker interface — the JVM serializes the whole object graph automatically via reflection. Externalizable extends it but makes YOU implement writeExternal()/readExternal(), so you fully control the format and which fields go out. Externalizable can be faster and more compact but requires a public no-arg constructor and manual maintenance. In practice both are largely superseded by JSON/Protobuf for cross-service data.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Serializable", v: "Marker; JVM serializes graph via reflection" },
          { k: "Externalizable", v: "You write writeExternal/readExternal" },
          { k: "Control", v: "Serializable = automatic; Externalizable = manual" },
          { k: "Ctor", v: "Externalizable needs a public no-arg constructor" },
        ],
      },
      { type: "text", content: "With **Serializable**, the runtime walks the object graph, honours `transient`/`serialVersionUID`, and calls optional `writeObject`/`readObject` hooks. With **Externalizable**, none of that is automatic — you decide the exact bytes, giving speed/size control at the cost of maintenance and safety." },
      { type: "text", content: "Externalizable's public no-arg constructor is a real gotcha: on read, the JVM constructs the object with that constructor *then* calls readExternal — so any final fields can't be restored the normal way." },
      { type: "text", content: "**Key takeaway:** Serializable = convenience + reflection; Externalizable = full control + manual work. For interop, prefer an explicit format (JSON/Protobuf/Avro) over either." },
    ],
    handsOn: {
      lang: "java",
      code: `class Point implements Externalizable {
    private int x, y;

    public Point() {}                    // REQUIRED public no-arg ctor

    @Override public void writeExternal(ObjectOutput out) throws IOException {
        out.writeInt(x);                 // you control the exact format
        out.writeInt(y);
    }
    @Override public void readExternal(ObjectInput in) throws IOException {
        this.x = in.readInt();
        this.y = in.readInt();
    }
}`,
    },
    whatIf: {
      q: "Externalizable can be faster — so why do most teams avoid it?",
      a: "Because the maintenance and safety costs usually outweigh the speed. You must hand-write and version the format, keep read/write in sync, and provide a public no-arg constructor that weakens invariants (no final fields). Java's native serialization (either flavour) is also a well-known security risk — deserialising untrusted bytes has caused major RCE vulnerabilities. For interop, an explicit schema (Protobuf/Avro/JSON) is faster to evolve and safer, so Externalizable is reserved for niche, performance-critical internal formats.",
    },
    realWorld:
      "You'll see Serializable on DTOs cached in distributed caches or session stores, and Externalizable in a few latency-critical internal RPC/serialization layers that predate Protobuf. Modern services almost always serialize to JSON or Protobuf at the boundary and keep Java serialization off the wire entirely for security reasons.",
    interviewerExpectation: ["Serializable = automatic/reflection", "Externalizable = manual writeExternal/readExternal", "public no-arg constructor requirement", "control vs convenience", "prefer explicit formats for interop"],
    followUps: [
      "What role does serialVersionUID play across versions?",
      "How does transient interact with each approach?",
      "Why is Java deserialization a security risk?",
    ],
    commonMistakes: [
      "Forgetting Externalizable's public no-arg constructor",
      "Expecting final fields to restore under Externalizable",
      "Deserialising untrusted data with native Java serialization",
    ],
    bestPractices: [
      "Prefer JSON/Protobuf/Avro at service boundaries",
      "Set an explicit serialVersionUID when you must use Serializable",
      "Never deserialize untrusted input with ObjectInputStream",
    ],
    relatedTech: ["Protobuf", "Avro", "ObjectInputStream", "serialVersionUID"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Oracle", "Amazon", "Deloitte", "TCS"],
    related: ["transient-keyword", "serialization-pitfalls", "records-sealed-classes"],
  },
  {
    slug: "transient-keyword",
    categoryId: "advanced-java",
    topic: "Serialization",
    question: "What does the transient keyword do, and what are its gotchas?",
    seoTitle: "transient Keyword Interview Questions & Answers (Java) | Full Stack Interview Guru",
    seoDescription:
      "The Java transient keyword for interviews: excluding fields from serialization, default values on restore, interaction with final and static, and why it protects secrets. Clear code examples.",
    heading: "transient Keyword — Interview Questions",
    tags: ["transient", "serialization", "java", "keywords", "security"],
    shortAnswer:
      "transient marks a field to be skipped during Java serialization. On deserialization that field is NOT restored — it comes back as the type's default (null, 0, false), and any value must be recomputed or re-injected. Use it for derived/cached data, unserializable references (threads, connections), and secrets you must never write to disk or the wire.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Effect", v: "Field skipped by serialization" },
          { k: "On restore", v: "Default value (null / 0 / false)" },
          { k: "Use for", v: "Derived data, non-serializable refs, secrets" },
          { k: "static", v: "Already not serialized (it's class-level)" },
        ],
      },
      { type: "text", content: "The big gotcha: a transient field silently returns as its **default** after a round-trip. If code assumes it's populated, you get NullPointerExceptions or wrong results only *after* serialize→deserialize — a bug that never shows in unit tests that don't round-trip." },
      { type: "text", content: "To restore a transient field, implement a custom `readObject` (Serializable) or `readExternal` (Externalizable) that recomputes or re-reads it — e.g. reopen a connection, rehydrate a cache, re-derive a checksum." },
      { type: "text", content: "**Key takeaway:** transient = 'don't persist this.' Always plan how a transient field gets a valid value again after deserialization." },
    ],
    handsOn: {
      lang: "java",
      code: `class Session implements Serializable {
    private String userId;
    private transient String authToken;     // secret: never serialized
    private transient long cachedHash;       // derived: recompute on read

    private void readObject(ObjectInputStream in)
            throws IOException, ClassNotFoundException {
        in.defaultReadObject();              // restores non-transient fields
        this.cachedHash = userId.hashCode(); // re-derive the transient value
        // authToken stays null — must be re-issued, not restored
    }
}`,
    },
    whatIf: {
      q: "Does transient have any effect on a static field?",
      a: "No — static fields belong to the class, not the instance, so they're never part of an object's serialized state to begin with. Marking a static field transient is redundant (and a code smell that suggests a misunderstanding). transient only matters for instance fields that would otherwise be written out.",
    },
    realWorld:
      "transient keeps passwords, tokens, and open resources (DB connections, sockets, threads) out of serialized session state and caches — both a correctness and a security measure. The classic production bug is a transient cache/derived field coming back null after a session is restored from a distributed store, so teams pair transient fields with a readObject that rehydrates them.",
    interviewerExpectation: ["skips field on serialization", "restored as default value", "for derived/secret/unserializable fields", "rehydrate via readObject", "static is already excluded"],
    followUps: [
      "How do you restore a transient field after deserialization?",
      "Why mark an authentication token transient?",
      "How does transient behave with Externalizable?",
    ],
    commonMistakes: [
      "Assuming a transient field keeps its value after a round-trip",
      "Marking static fields transient (redundant)",
      "Serializing secrets by forgetting transient",
    ],
    bestPractices: [
      "Mark secrets and open resources transient",
      "Rehydrate transient fields in readObject/readExternal",
      "Use transient for derived/cacheable data to shrink payloads",
    ],
    relatedTech: ["Serializable", "readObject", "session stores", "security"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Infosys", "TCS", "Accenture", "Oracle"],
    related: ["serialization-vs-externalization", "serialization-pitfalls", "immutability-advanced"],
  },
  {
    slug: "reflection-api",
    categoryId: "advanced-java",
    topic: "Reflection",
    question: "What is the Reflection API, and what are its costs and risks?",
    seoTitle: "Java Reflection API Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Java Reflection for interviews: inspecting and invoking classes/methods/fields at runtime, how frameworks use it (Spring, Jackson, JUnit), performance costs, security/encapsulation risks, and examples.",
    heading: "Reflection API — Interview Questions",
    tags: ["reflection", "metaprogramming", "runtime", "frameworks", "java"],
    shortAnswer:
      "Reflection lets code inspect and manipulate classes, methods, fields and constructors at runtime — discovering type information and invoking members that weren't known at compile time. It powers frameworks (Spring DI, Jackson, Hibernate, JUnit) but costs performance (no inlining, access checks), breaks compile-time safety, can violate encapsulation via setAccessible, and is increasingly restricted by the module system.",
    mindMap: [
      { type: "text", content: "Reflection is **runtime introspection**: given a Class object you can list its methods/fields, read annotations, construct instances, and call methods dynamically — all decided at runtime instead of compile time." },
      {
        type: "kv",
        rows: [
          { k: "Inspect", v: "getMethods / getFields / getAnnotations" },
          { k: "Invoke", v: "Method.invoke, Constructor.newInstance" },
          { k: "Access", v: "setAccessible(true) bypasses private" },
          { k: "Cost", v: "Slower, no compile checks, module restrictions" },
        ],
      },
      { type: "text", content: "Every DI container, JSON mapper, ORM, and test runner leans on reflection to wire beans, map fields, and discover @Test methods — you use it indirectly all day even if you never call it directly." },
      { type: "text", content: "**Key takeaway:** reflection trades compile-time safety and speed for runtime flexibility. Great for frameworks; a smell in ordinary application code where a normal call or interface would do." },
    ],
    handsOn: {
      lang: "java",
      code: `Class<?> clazz = Class.forName("com.app.User");
Object user = clazz.getDeclaredConstructor().newInstance();

Method setName = clazz.getMethod("setName", String.class);
setName.invoke(user, "Guru");                 // dynamic call

Field id = clazz.getDeclaredField("id");
id.setAccessible(true);                        // bypass 'private'
id.set(user, 101);
System.out.println(user);`,
    },
    whatIf: {
      q: "Why is reflective method invocation slower than a direct call?",
      a: "Because the JIT can't resolve and inline the target the way it does for a static call site: each Method.invoke does access/argument checks, boxes primitives into an Object[], and goes through a generic dispatch path. It also blocks some optimisations. The gap has narrowed (and MethodHandles/VarHandle are faster), but in hot loops reflection is measurably costlier — so frameworks cache Method/Field objects and increasingly generate code or use MethodHandles instead.",
    },
    realWorld:
      "Spring uses reflection to instantiate beans and inject dependencies; Jackson maps JSON to fields; Hibernate populates entities; JUnit finds and runs @Test methods. When you see 'InaccessibleObjectException' after upgrading Java, it's the module system blocking a framework's setAccessible — the runtime cost of reflection meeting JPMS encapsulation.",
    interviewerExpectation: ["runtime inspection + invocation", "powers DI/ORM/JSON/test frameworks", "setAccessible breaks encapsulation", "performance cost vs direct calls", "restricted by modules"],
    followUps: [
      "How do MethodHandles/VarHandle compare to reflection?",
      "How does the module system restrict setAccessible?",
      "How do dynamic proxies build on reflection?",
    ],
    commonMistakes: [
      "Using reflection where an interface/polymorphism suffices",
      "Not caching Method/Field objects in hot paths",
      "Assuming setAccessible always works under JPMS",
    ],
    bestPractices: [
      "Prefer normal calls/interfaces in application code",
      "Cache reflective handles; consider MethodHandles for speed",
      "Open modules deliberately when frameworks need reflection",
    ],
    relatedTech: ["Spring", "Jackson", "MethodHandles", "JPMS"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Oracle", "Microsoft", "Deloitte"],
    related: ["dynamic-proxy", "java-annotations", "classloader-architecture"],
  },
  {
    slug: "dynamic-proxy",
    categoryId: "advanced-java",
    topic: "Dynamic Proxy",
    question: "How do Java dynamic proxies work, and how do frameworks use them for AOP?",
    seoTitle: "Java Dynamic Proxy Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Java dynamic proxies explained: Proxy.newProxyInstance, InvocationHandler, JDK vs CGLIB, and how Spring AOP applies the dynamic proxy pattern for transactions and logging.",
    heading: "Dynamic Proxy — Interview Questions",
    updated: "2026-08-15",
    tags: ["dynamic proxy", "invocationhandler", "aop", "spring", "cglib"],
    shortAnswer:
      "A dynamic proxy is a class generated at runtime that implements one or more interfaces and routes every method call to a single InvocationHandler.invoke(). That handler can add behaviour — logging, timing, transactions, security — before/after delegating to the real object. JDK proxies work on interfaces; CGLIB/ByteBuddy subclass concrete classes. It's the mechanism behind Spring AOP, @Transactional, and mock libraries.",
    mindMap: [
      { type: "text", content: "A proxy is a **stand-in** that looks like the real interface but funnels every call through your `invoke()` method, so you can wrap cross-cutting behaviour around the real target without editing it." },
      {
        type: "kv",
        rows: [
          { k: "JDK proxy", v: "Proxy.newProxyInstance — interfaces only" },
          { k: "Handler", v: "InvocationHandler.invoke(proxy, method, args)" },
          { k: "CGLIB/ByteBuddy", v: "Subclass concrete classes (no interface)" },
          { k: "Powers", v: "Spring AOP, @Transactional, mocks" },
        ],
      },
      { type: "text", content: "Spring wraps your bean in a proxy: calling `save()` actually hits the proxy, which opens a transaction, calls the real `save()`, then commits or rolls back — all without a line of transaction code in your method." },
      { type: "text", content: "**Key takeaway:** proxies add behaviour around method calls at runtime. JDK = interfaces via InvocationHandler; CGLIB = subclassing — and self-invocation inside a bean bypasses the proxy." },
    ],
    handsOn: {
      lang: "java",
      code: `interface Repo { void save(String s); }

Repo real = s -> System.out.println("saved " + s);

Repo proxy = (Repo) Proxy.newProxyInstance(
    Repo.class.getClassLoader(),
    new Class<?>[]{ Repo.class },
    (p, method, args) -> {                       // InvocationHandler
        System.out.println("BEGIN tx");
        Object r = method.invoke(real, args);     // delegate
        System.out.println("COMMIT tx");
        return r;
    });

proxy.save("order-1");`,
      output: "BEGIN tx\nsaved order-1\nCOMMIT tx",
    },
    whatIf: {
      q: "Why does calling one @Transactional method from another method in the same bean skip the transaction?",
      a: "Because the proxy only intercepts calls that come through it from outside. An internal `this.otherMethod()` call goes straight to the target object, bypassing the proxy wrapper entirely — so the advice (transaction, cache, retry) never runs. This 'self-invocation' gotcha is why Spring's proxy-based AOP can silently skip @Transactional/@Cacheable on internal calls; you fix it by refactoring into a separate bean, self-injecting the proxy, or switching to AspectJ weaving.",
    },
    realWorld:
      "Spring's @Transactional, @Cacheable, @Async, @Retryable, and security checks are all proxy-based advice; Mockito generates proxies for mocks; mapping and RPC libraries proxy interfaces to turn method calls into network requests. The self-invocation gotcha is one of the most common 'why didn't my transaction roll back?' bugs in real Spring apps.",
    interviewerExpectation: ["runtime-generated proxy over interfaces", "InvocationHandler.invoke intercepts calls", "JDK (interface) vs CGLIB (subclass)", "powers Spring AOP/@Transactional", "self-invocation bypasses the proxy"],
    followUps: [
      "JDK dynamic proxy vs CGLIB — when is each used?",
      "How does reflection enable dynamic proxies?",
      "Why can't CGLIB proxy a final class or method?",
      "How does the JDK dynamic proxy relate to the classic Proxy design pattern (GoF)?",
      "What happens if InvocationHandler.invoke() throws an exception?",
    ],
    commonMistakes: [
      "Expecting @Transactional to apply on self-invocation",
      "Trying to JDK-proxy a class with no interface",
      "Forgetting CGLIB can't subclass final classes/methods",
    ],
    bestPractices: [
      "Program to interfaces so JDK proxies apply cleanly",
      "Avoid self-invocation for proxied cross-cutting concerns",
      "Use AspectJ weaving when proxy limits get in the way",
    ],
    relatedTech: ["Spring AOP", "CGLIB", "ByteBuddy", "Mockito"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Oracle", "Google"],
    related: ["reflection-api", "java-annotations", "jmm-happens-before-advanced"],
  },
  {
    slug: "java-annotations",
    categoryId: "advanced-java",
    topic: "Annotations",
    question: "How do Java annotations work — retention policies, targets, and how are they processed?",
    seoTitle: "Java Annotations Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Java annotations for interviews: @Retention SOURCE/CLASS/RUNTIME, @Target, meta-annotations, compile-time annotation processors vs runtime reflection, and how frameworks read them. With examples.",
    heading: "Java Annotations — Interview Questions",
    tags: ["annotations", "retention", "annotation processor", "reflection", "metadata"],
    shortAnswer:
      "Annotations are typed metadata attached to code. @Retention decides how long they survive — SOURCE (compile only, e.g. @Override), CLASS (in bytecode, not at runtime), or RUNTIME (readable via reflection). @Target limits where they apply. They're processed two ways: at compile time by annotation processors (Lombok, MapStruct, Dagger generate code), or at runtime via reflection (Spring, JUnit, Jackson read them to drive behaviour).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "@Retention SOURCE", v: "Discarded after compile (@Override)" },
          { k: "@Retention CLASS", v: "In .class, not visible at runtime (default)" },
          { k: "@Retention RUNTIME", v: "Readable via reflection (@Autowired)" },
          { k: "@Target", v: "Where it's allowed (TYPE, METHOD, FIELD…)" },
        ],
      },
      { type: "text", content: "Two processing worlds: **compile-time** annotation processors (APT) generate code or fail the build (Lombok, MapStruct, Dagger); **runtime** frameworks reflect over RUNTIME-retention annotations to configure themselves (Spring's @Component, JUnit's @Test, Jackson's @JsonProperty)." },
      { type: "text", content: "A custom annotation is just an `@interface` with elements; you add meta-annotations (@Retention, @Target) to control its lifetime and placement, then read it with reflection or a processor." },
      { type: "text", content: "**Key takeaway:** retention decides *who can read it* — pick RUNTIME only if a framework reflects over it; otherwise SOURCE/CLASS keeps it out of the runtime." },
    ],
    handsOn: {
      lang: "java",
      code: `@Retention(RetentionPolicy.RUNTIME)     // visible to reflection
@Target(ElementType.METHOD)
@interface Audited { String value() default ""; }

class Service {
    @Audited("payment")
    void pay() { }
}

// A framework reads it at runtime:
Method m = Service.class.getMethod("pay");
Audited a = m.getAnnotation(Audited.class);
if (a != null) System.out.println("audit: " + a.value());`,
      output: "audit: payment",
    },
    whatIf: {
      q: "You wrote a custom annotation but reflection returns null for it at runtime — why?",
      a: "Almost certainly the retention policy. The default is RetentionPolicy.CLASS, which keeps the annotation in the .class file but does NOT make it visible to reflection — so getAnnotation() returns null. Add @Retention(RetentionPolicy.RUNTIME) so the annotation survives into the runtime constant pool where reflection can read it. If you only need compile-time processing, use an annotation processor instead of reflection.",
    },
    realWorld:
      "Spring (@Component/@Autowired/@Transactional), JUnit (@Test), Jackson (@JsonProperty), and Bean Validation (@NotNull) all read RUNTIME annotations reflectively; Lombok, MapStruct, and Dagger use SOURCE-level processors to generate boilerplate at compile time — no runtime cost. Choosing the wrong retention is a frequent cause of 'my annotation does nothing.'",
    interviewerExpectation: ["metadata on code", "SOURCE/CLASS/RUNTIME retention", "@Target restricts placement", "compile-time processors vs runtime reflection", "RUNTIME needed for reflective frameworks"],
    followUps: [
      "When would you use an annotation processor over reflection?",
      "What are meta-annotations and repeatable annotations?",
      "How does Bean Validation use annotations at runtime?",
    ],
    commonMistakes: [
      "Leaving retention at the default when reflection needs RUNTIME",
      "Reading a SOURCE-retained annotation at runtime",
      "Over-annotating instead of using plain configuration",
    ],
    bestPractices: [
      "Set RUNTIME retention only when a framework reflects over it",
      "Constrain placement with @Target",
      "Prefer compile-time processors for zero runtime overhead",
    ],
    relatedTech: ["Spring", "Lombok", "MapStruct", "Bean Validation"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Oracle", "Infosys", "Microsoft"],
    related: ["reflection-api", "dynamic-proxy", "records-sealed-classes"],
  },

  // ==================================== Section 3 — Object Contracts & Generics
  {
    slug: "comparable-comparator-advanced",
    categoryId: "advanced-java",
    topic: "Ordering",
    question: "How do you compose Comparators safely, and why must ordering be consistent with equals?",
    seoTitle: "Comparator Composition & equals-Consistency Interview Questions | Full Stack Interview Guru",
    seoDescription:
      "Advanced Comparator interview questions: thenComparing/reversed/nullsFirst composition, comparingInt to avoid boxing, and why TreeMap/TreeSet break when ordering is inconsistent with equals. Examples.",
    heading: "Comparator Composition & Consistency — Interview Questions",
    tags: ["comparator", "comparable", "ordering", "treeset", "consistency with equals"],
    shortAnswer:
      "Build multi-key ordering with Comparator.comparing(...).thenComparing(...), use comparingInt/Long/Double to avoid boxing, and handle nulls with nullsFirst/nullsLast. The subtle rule: for sorted sets and maps (TreeSet/TreeMap), ordering should be consistent with equals — two elements the comparator calls 'equal' (compare == 0) are treated as the same key, even if equals() disagrees, which can silently drop elements.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "comparing().thenComparing()", v: "multi-field ordering" },
          { k: "comparingInt/Long/Double", v: "avoid autoboxing in keys" },
          { k: "nullsFirst / nullsLast", v: "null-safe ordering" },
          { k: "reversed()", v: "flip an existing comparator" },
        ],
      },
      { type: "text", content: "For **TreeSet/TreeMap**, the *comparator* — not equals() — defines identity. If compare() returns 0 for two 'different' objects, the set keeps only one. That's the 'my TreeSet lost elements' bug." },
      { type: "text", content: "Comparators must obey the contract: consistent, transitive, and antisymmetric. A comparator like `(a,b) -> a.x - b.x` can overflow for large ints — use `Integer.compare` / `comparingInt` instead." },
      { type: "text", content: "**Key takeaway:** compose comparators declaratively, keep them null-safe and overflow-safe, and make sure sorted-collection ordering agrees with equals." },
    ],
    handsOn: {
      lang: "java",
      code: `Comparator<Employee> byDeptThenSalaryDesc =
    Comparator.comparing(Employee::dept)
              .thenComparing(Comparator.comparingInt(Employee::salary).reversed())
              .thenComparing(Employee::name, Comparator.nullsLast(naturalOrder()));

employees.sort(byDeptThenSalaryDesc);`,
    },
    whatIf: {
      q: "You add 100 distinct objects to a TreeSet but size() is 60 — what happened?",
      a: "The comparator returned 0 for elements you consider different, so TreeSet treated them as duplicates and dropped them. TreeSet/TreeMap use compareTo/compare (not equals/hashCode) to decide membership, so ordering that isn't consistent with equals silently collapses distinct elements. Fix it by making the comparator a total order that ends in a tie-breaker unique per element (e.g. an id), so compare() only returns 0 for genuinely equal objects.",
    },
    realWorld:
      "Multi-column sorting in APIs (sort by status, then date, then id), leaderboards, and priority ordering all use composed comparators; the 'consistent with equals' rule bites teams who put domain objects in a TreeSet keyed by a non-unique field and quietly lose rows. Adding a unique tie-breaker is the standard fix.",
    interviewerExpectation: ["thenComparing composition", "comparingInt avoids boxing", "nullsFirst/nullsLast", "TreeSet/TreeMap use compare not equals", "consistent-with-equals contract"],
    followUps: [
      "Why prefer Integer.compare over a - b in a comparator?",
      "When is natural ordering (Comparable) better than a Comparator?",
      "How does this interact with equals()/hashCode()?",
    ],
    commonMistakes: [
      "Using a - b (overflow) instead of Integer.compare",
      "Putting objects in a TreeSet with a non-unique comparator",
      "Ignoring nulls and getting NullPointerException while sorting",
    ],
    bestPractices: [
      "Compose with comparing/thenComparing for readability",
      "End sorted-collection comparators with a unique tie-breaker",
      "Use comparingInt/Long/Double to avoid boxing",
    ],
    relatedTech: ["TreeMap", "Stream.sorted", "Comparator", "natural ordering"],
    difficulty: "Hard",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Google"],
    related: ["comparable-vs-comparator", "treemap-navigablemap", "equals-hashcode-inheritance"],
  },
  {
    slug: "equals-hashcode-inheritance",
    categoryId: "advanced-java",
    topic: "Object Contract",
    question: "How does the equals()/hashCode() contract break under inheritance, and with ORM proxies?",
    seoTitle: "equals/hashCode with Inheritance Interview Questions | Full Stack Interview Guru",
    seoDescription:
      "Advanced equals()/hashCode() interview questions: the symmetry problem with subclasses, getClass vs instanceof, business-key equality, and Hibernate proxy pitfalls. Design a correct contract.",
    heading: "equals/hashCode Under Inheritance — Interview Questions",
    tags: ["equals", "hashcode", "inheritance", "symmetry", "hibernate"],
    shortAnswer:
      "Adding a value field in a subclass makes it nearly impossible to keep equals() symmetric and transitive with its superclass — the classic Point/ColorPoint problem. You get two imperfect options: use getClass() (breaks Liskov — a subclass is never equal to its parent) or instanceof (can break symmetry/transitivity). The clean fixes: prefer composition over inheritance for value types, or define equality on a stable business key. With Hibernate, proxies and generated ids make identity-based equals dangerous.",
    mindMap: [
      { type: "text", content: "The trap: once a subclass adds a significant field, no equals() can satisfy **reflexive + symmetric + transitive** with the parent at the same time. It's a genuine design conflict, not a coding mistake." },
      {
        type: "kv",
        rows: [
          { k: "getClass()", v: "Symmetric, but breaks Liskov (no subtype equality)" },
          { k: "instanceof", v: "Allows subtype equality, risks asymmetry" },
          { k: "Best fix", v: "Composition over inheritance for value types" },
          { k: "Hibernate", v: "Use a business key, not the generated id" },
        ],
      },
      { type: "text", content: "**Hibernate/JPA**: entities are wrapped in proxies (so getClass() != real class → use instanceof), and the id is null until persisted (so id-based hashCode changes after save, corrupting HashSets). Equality on an immutable natural/business key avoids both." },
      { type: "text", content: "**Key takeaway:** value equality and inheritance don't mix cleanly — favour composition, base equality on immutable business keys, and never key a HashSet on a field that changes after construction/persistence." },
    ],
    handsOn: {
      lang: "java",
      code: `@Entity
class User {
    @Id @GeneratedValue Long id;          // null until persisted!
    @Column(unique = true) String email;   // stable business key

    @Override public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User other)) return false;
        return email != null && email.equals(other.email);  // key, not id
    }
    @Override public int hashCode() {
        return Objects.hashCode(email);     // stable across persist
    }
}`,
    },
    whatIf: {
      q: "Why is basing a JPA entity's hashCode on its @GeneratedValue id dangerous?",
      a: "Because the id is null before the entity is persisted and gets assigned on flush — so an entity's hashCode changes after you've already added it to a HashSet/HashMap. Once the hash changes, the collection can't find the element (it's in the wrong bucket), leading to duplicates, lost lookups, and leaks. Base equals/hashCode on an immutable business key (email, natural id) that's set at construction and never changes, so identity is stable across the entity's whole lifecycle.",
    },
    realWorld:
      "Any project mixing JPA entities with HashSet/HashMap membership hits this: entities 'disappear' from sets after being saved, or bidirectional associations behave oddly, all because id-based hashCode changed on flush. Teams standardise on business-key equality (or documented reference equality) to keep collections correct.",
    interviewerExpectation: ["subclass value field breaks symmetry", "getClass breaks Liskov, instanceof risks asymmetry", "composition over inheritance", "business key over generated id", "Hibernate proxy + null-id pitfalls"],
    followUps: [
      "getClass() vs instanceof in equals — trade-offs?",
      "Why do records sidestep some of these issues?",
      "How do Hibernate proxies affect getClass() comparisons?",
    ],
    commonMistakes: [
      "Basing entity hashCode on a generated id",
      "Mixing inheritance with value equality",
      "Using getClass() and being surprised proxies never match",
    ],
    bestPractices: [
      "Prefer composition for value types",
      "Use immutable business keys for entity equality",
      "Consider records for simple immutable value objects",
    ],
    relatedTech: ["Hibernate", "JPA", "records", "HashSet"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Oracle", "Microsoft", "Deloitte"],
    related: ["java-equals-hashcode", "hibernate-equals-hashcode", "immutability-advanced"],
  },
  {
    slug: "immutability-advanced",
    categoryId: "advanced-java",
    topic: "Immutability",
    question: "Beyond final fields, how do you guarantee deep immutability with defensive copies and immutable collections?",
    seoTitle: "Deep Immutability & Defensive Copies Interview Questions | Full Stack Interview Guru",
    seoDescription:
      "Advanced immutability interview questions: defensive copies of mutable fields, deep vs shallow immutability, List.copyOf and unmodifiable views, records as carriers, and safe publication. With examples.",
    heading: "Deep Immutability & Defensive Copies — Interview Questions",
    tags: ["immutability", "defensive copy", "immutable collections", "records", "final"],
    shortAnswer:
      "final only stops the reference from changing — it doesn't stop the referenced object from mutating. True immutability needs defensive copies: copy mutable arguments in the constructor and copy (or return unmodifiable views of) mutable fields in getters, so callers can't reach in and change internal state. Use List.copyOf/Map.copyOf for truly immutable collections, and prefer records for simple carriers — but remember records give shallow immutability, so still defensively copy mutable components.",
    mindMap: [
      { type: "text", content: "`final` freezes the **reference**, not the **object**. A `final List` can still have items added. Deep immutability means no reachable state can change after construction — which requires copying at both the in and out boundaries." },
      {
        type: "kv",
        rows: [
          { k: "Constructor", v: "Defensively copy incoming mutable args" },
          { k: "Getter", v: "Return a copy or unmodifiable view" },
          { k: "Collections", v: "List.copyOf / Map.copyOf (truly immutable)" },
          { k: "Records", v: "Shallow — still copy mutable components" },
        ],
      },
      { type: "text", content: "`Collections.unmodifiableList(x)` is a *view* — if you keep a reference to the backing list you can still mutate it. `List.copyOf(x)` makes an independent immutable snapshot. Know which one you have." },
      { type: "text", content: "**Key takeaway:** immutability = final + defensive copies at both boundaries + genuinely immutable collections. It's the cheapest thread-safety you can buy — and safe publication comes almost for free." },
    ],
    handsOn: {
      lang: "java",
      code: `final class Trip {
    private final String name;
    private final List<String> stops;      // mutable type

    Trip(String name, List<String> stops) {
        this.name = name;
        this.stops = List.copyOf(stops);   // defensive copy IN
    }
    String name() { return name; }
    List<String> stops() { return stops; } // already immutable (copyOf)
}
// Caller mutating their original list can't affect the Trip's copy.`,
    },
    whatIf: {
      q: "A record has a List component — is the record immutable?",
      a: "Only shallowly. The record's reference to the list is final, but the list itself can still be mutated by anyone holding the original reference, and callers get the same reference back from the accessor. To make it truly immutable, use a compact constructor to defensively copy the incoming list (this.items = List.copyOf(items)) — now the stored collection is independent and unmodifiable. Records remove boilerplate but they don't automatically deep-copy mutable components.",
    },
    realWorld:
      "Value objects, config snapshots, event payloads, and cache keys are all made immutable so they can be shared across threads without locks and used safely as map keys. The classic bug is a 'final' collection field that a caller keeps mutating — fixed by List.copyOf in the constructor. Records + copyOf is the modern idiom for these carriers.",
    interviewerExpectation: ["final freezes reference not object", "defensive copy in constructor and getter", "copyOf vs unmodifiable view", "records are shallowly immutable", "immutability enables safe publication"],
    followUps: [
      "unmodifiableList view vs copyOf snapshot — difference?",
      "How do records help and where do they fall short?",
      "How does immutability guarantee safe publication?",
    ],
    commonMistakes: [
      "Thinking final makes the object immutable",
      "Returning the internal mutable collection directly",
      "Assuming a record with mutable components is fully immutable",
    ],
    bestPractices: [
      "Defensively copy mutable args in and out",
      "Use List.copyOf/Map.copyOf for immutable collections",
      "Use records + copyOf for immutable value carriers",
    ],
    relatedTech: ["records", "List.copyOf", "Guava Immutable", "safe publication"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Oracle", "Google"],
    related: ["immutable-class-design", "immutable-collections", "records-sealed-classes"],
  },
  {
    slug: "generics-bounded-wildcards",
    categoryId: "advanced-java",
    topic: "Generics",
    question: "How do bounded wildcards and the PECS rule let you design flexible generic APIs?",
    seoTitle: "Bounded Wildcards & PECS Interview Questions (Java Generics) | Full Stack Interview Guru",
    seoDescription:
      "Java generics wildcards for interviews: PECS (Producer Extends, Consumer Super), ? extends vs ? super, generic methods, recursive bounds, and designing flexible APIs. Clear code examples.",
    heading: "Bounded Wildcards & PECS — Interview Questions",
    tags: ["generics", "wildcards", "pecs", "variance", "bounded types"],
    shortAnswer:
      "Wildcards add flexibility to invariant generics. PECS — Producer Extends, Consumer Super — is the rule: use <? extends T> when a structure produces T values you read out, and <? super T> when it consumes T values you put in. This lets a method like copy(dest, src) accept a wider range of type arguments safely. Generic methods and recursive bounds (<T extends Comparable<T>>) round out flexible, type-safe API design.",
    mindMap: [
      { type: "text", content: "Generics are **invariant**: List<Integer> is NOT a List<Number>. Wildcards reintroduce controlled variance so APIs can accept related types without losing type safety." },
      {
        type: "kv",
        rows: [
          { k: "? extends T", v: "Producer — read T out (covariant)" },
          { k: "? super T", v: "Consumer — put T in (contravariant)" },
          { k: "PECS", v: "Producer Extends, Consumer Super" },
          { k: "Recursive bound", v: "<T extends Comparable<T>>" },
        ],
      },
      { type: "text", content: "You can read from a `? extends T` (everything is at least a T) but can't add to it; you can add a T to a `? super T` but can only read Object out. That asymmetry IS the safety — and PECS tells you which to pick." },
      { type: "text", content: "**Key takeaway:** if a parameter is a source you read, use extends; if it's a sink you write to, use super; if you do both, use an exact type T." },
    ],
    handsOn: {
      lang: "java",
      code: `// PECS in action: src PRODUCES (extends), dest CONSUMES (super)
static <T> void copy(List<? super T> dest, List<? extends T> src) {
    for (T item : src) dest.add(item);
}

List<Integer> ints = List.of(1, 2, 3);
List<Number> nums = new ArrayList<>();
copy(nums, ints);          // Number super Integer, Integer extends Number — OK`,
    },
    whatIf: {
      q: "Why can't you add an element to a List<? extends Number>?",
      a: "Because the compiler only knows the list is 'some unknown subtype of Number' — it could be a List<Integer>, a List<Double>, etc. Adding a Double to what might actually be a List<Integer> would corrupt type safety, so the compiler forbids all adds (except null). You can safely READ (every element is at least a Number), which is exactly why <? extends> is for producers you read from. To add elements, you need <? super Number>, where any Number is a valid input.",
    },
    realWorld:
      "The JDK is full of PECS: Collections.copy(List<? super T>, List<? extends T>), Stream.forEach(Consumer<? super T>), Comparator<? super T> in sort. Designing library methods with the right wildcards is what lets callers pass Integer lists where Number is expected without casts — a hallmark of well-designed generic APIs in code reviews.",
    interviewerExpectation: ["generics are invariant", "? extends = producer/read", "? super = consumer/write", "PECS mnemonic", "recursive bounds for self-comparison"],
    followUps: [
      "Why is List<Integer> not a subtype of List<Number>?",
      "What does <T extends Comparable<? super T>> buy you?",
      "How do wildcards relate to type erasure at runtime?",
    ],
    commonMistakes: [
      "Trying to add to a <? extends T> collection",
      "Using an exact type where a wildcard would generalise the API",
      "Confusing which side needs extends vs super",
    ],
    bestPractices: [
      "Apply PECS to method parameters for flexible APIs",
      "Use ? super for consumers (e.g. Comparator, Consumer)",
      "Keep return types concrete; put wildcards on inputs",
    ],
    relatedTech: ["Collections API", "Stream", "Comparator", "type bounds"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Google", "Amazon", "Microsoft", "Oracle"],
    related: ["generics-type-erasure", "generics-heap-pollution-safevarargs", "comparable-comparator-advanced"],
  },
  {
    slug: "generics-heap-pollution-safevarargs",
    categoryId: "advanced-java",
    topic: "Generics",
    question: "What is heap pollution with generic varargs, and when is @SafeVarargs appropriate?",
    seoTitle: "Heap Pollution & @SafeVarargs Interview Questions (Java) | Full Stack Interview Guru",
    seoDescription:
      "Java heap pollution for interviews: how generic varargs create unchecked warnings, the generic array creation problem, when @SafeVarargs is safe, and bridge methods. Clear examples.",
    heading: "Heap Pollution & @SafeVarargs — Interview Questions",
    tags: ["generics", "heap pollution", "safevarargs", "varargs", "type erasure"],
    shortAnswer:
      "Because arrays are reified but generics are erased, a generic varargs parameter (T...) is really a T[] the compiler can't fully type-check — so a value of the wrong type can slip in. That mismatch is 'heap pollution,' and it triggers an unchecked warning at every call site. @SafeVarargs suppresses that warning, and you should only add it when the method merely reads the varargs array and never stores it or lets it escape — otherwise the pollution is real.",
    mindMap: [
      { type: "text", content: "Root cause: **arrays know their element type at runtime; generics don't**. A `List<String>...` becomes a `List[]` under erasure, so the runtime can't stop a `List<Integer>` sneaking into that array — a variable of type `List<String>` ends up referring to a `List<Integer>`." },
      {
        type: "kv",
        rows: [
          { k: "Heap pollution", v: "Var of type T holds a non-T value" },
          { k: "Cause", v: "Reified arrays + erased generics (T... = T[])" },
          { k: "@SafeVarargs", v: "Suppress the unchecked warning" },
          { k: "Only if", v: "Method just reads the array, nothing escapes" },
        ],
      },
      { type: "text", content: "Safe pattern: iterate the varargs and read values (like List.of does). Unsafe: store the array, return it, or pass it somewhere it can be written — then @SafeVarargs is a lie and you can get a ClassCastException far from the cause." },
      { type: "text", content: "**Key takeaway:** @SafeVarargs is a promise you don't expose or write the varargs array. If you can't honour that promise, fix the design instead of silencing the warning." },
    ],
    handsOn: {
      lang: "java",
      code: `// Safe: only READS the varargs array, nothing escapes
@SafeVarargs
static <T> List<T> listOf(T... items) {
    List<T> result = new ArrayList<>();
    for (T item : items) result.add(item);   // read only
    return result;
}

// UNSAFE (do NOT @SafeVarargs): the array escapes and can be polluted
static <T> T[] leak(T... items) { return items; }`,
    },
    whatIf: {
      q: "When is adding @SafeVarargs actually a bug waiting to happen?",
      a: "When the method does more than read the array — if it stores the T[] in a field, returns it, or passes it to code that writes into it, then a caller's mismatched generic type can pollute it and blow up with a ClassCastException at some unrelated later read. @SafeVarargs suppresses the warning but doesn't make the operation safe, so you've hidden a real defect. The rule: only annotate methods that treat the varargs as a read-only sequence and never let the backing array escape.",
    },
    realWorld:
      "You meet this designing utility/factory methods (List.of, EnumSet.of style, test data builders) that take T.... The compiler's unchecked warning nudges you to check whether the array escapes; correctly reasoning about it — and only then adding @SafeVarargs — is exactly the kind of generics judgement senior interviews probe.",
    interviewerExpectation: ["reified arrays vs erased generics", "T... is really T[]", "heap pollution definition", "@SafeVarargs only for read-only/no-escape", "risk of ClassCastException later"],
    followUps: [
      "Why can't you write new T[] directly?",
      "What are bridge methods and how do they relate to erasure?",
      "How does this connect to the PECS wildcard rules?",
    ],
    commonMistakes: [
      "Adding @SafeVarargs to a method that lets the array escape",
      "Assuming varargs generics are fully type-checked",
      "Silencing the unchecked warning without reasoning about safety",
    ],
    bestPractices: [
      "Only annotate read-only, non-escaping varargs methods",
      "Avoid returning or storing the varargs array",
      "Prefer collections over generic arrays in APIs",
    ],
    relatedTech: ["type erasure", "varargs", "List.of", "bridge methods"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Google", "Oracle", "Amazon", "Microsoft"],
    related: ["generics-type-erasure", "generics-bounded-wildcards", "immutability-advanced"],
  },
  {
    slug: "safe-removal-during-iteration",
    categoryId: "advanced-java",
    topic: "Collections",
    question: "How do you safely modify a collection while iterating it, and what causes ConcurrentModificationException?",
    seoTitle: "Safe Removal During Iteration Interview Questions | Full Stack Interview Guru",
    seoDescription:
      "Modifying a collection during iteration for interviews: modCount and ConcurrentModificationException, Iterator.remove, removeIf, and weakly-consistent concurrent iterators. With code examples.",
    heading: "Safe Removal During Iteration — Interview Questions",
    tags: ["concurrentmodificationexception", "iterator", "removeif", "modcount", "collections"],
    shortAnswer:
      "Standard collections are fail-fast: they track a modCount, and if it changes during iteration (because you called list.remove() while looping) the next iterator step throws ConcurrentModificationException — even in a single thread. Safe options: use Iterator.remove(), use Collection.removeIf() (cleanest), collect-then-remove, or use a concurrent/copy-on-write collection whose iterators are weakly consistent and never throw.",
    mindMap: [
      { type: "text", content: "CME is usually **not about threads** — it's a single-thread bug: modifying the collection directly (not through the iterator) while a for-each loop is running. The iterator detects the structural change via modCount and fails fast." },
      {
        type: "kv",
        rows: [
          { k: "Cause", v: "Structural change during iteration (modCount)" },
          { k: "Iterator.remove()", v: "Safe removal during a manual loop" },
          { k: "removeIf(pred)", v: "Cleanest bulk conditional removal" },
          { k: "CopyOnWrite / concurrent", v: "Weakly-consistent, never throws" },
        ],
      },
      { type: "text", content: "For-each is just syntactic sugar over an Iterator, so calling `list.remove(x)` inside it bumps modCount behind the iterator's back → CME on the next `next()`. Going through the iterator (or removeIf) keeps modCount in sync." },
      { type: "text", content: "**Key takeaway:** never structurally modify a fail-fast collection directly while iterating. Use removeIf for bulk deletes, Iterator.remove for manual loops, or a concurrent collection when you truly iterate under concurrency." },
    ],
    handsOn: {
      lang: "java",
      code: `List<Integer> nums = new ArrayList<>(List.of(1, 2, 3, 4, 5));

// ❌ throws ConcurrentModificationException
// for (Integer n : nums) if (n % 2 == 0) nums.remove(n);

// ✅ cleanest — bulk conditional removal
nums.removeIf(n -> n % 2 == 0);

// ✅ manual loop alternative
Iterator<Integer> it = nums.iterator();
while (it.hasNext()) if (it.next() > 3) it.remove();
System.out.println(nums);`,
      output: "[1, 3]",
    },
    whatIf: {
      q: "Does ConcurrentModificationException mean there was a concurrency (multi-thread) bug?",
      a: "Not necessarily — despite the name, it's most often thrown in purely single-threaded code that modifies a collection directly during a for-each loop. It's a fail-fast guard based on a modCount check, a best-effort detector of structural changes, not a thread-safety mechanism. (It CAN also fire when another thread mutates the collection mid-iteration, but you should never rely on it to detect that — use a proper concurrent collection instead.)",
    },
    realWorld:
      "Filtering a list in place — removing expired sessions, invalid records, completed jobs — is where developers hit CME constantly. removeIf is the modern one-liner; CopyOnWriteArrayList backs listener lists that are iterated far more than mutated; ConcurrentHashMap's weakly-consistent iterator lets background sweeps run without throwing.",
    interviewerExpectation: ["fail-fast via modCount", "CME often single-threaded", "Iterator.remove / removeIf", "for-each is iterator sugar", "concurrent collections are weakly consistent"],
    followUps: [
      "How do fail-fast and fail-safe iterators differ internally?",
      "How does CopyOnWriteArrayList avoid CME?",
      "Why is removeIf preferable to a manual loop?",
    ],
    commonMistakes: [
      "Calling list.remove() inside a for-each loop",
      "Assuming CME implies a threading bug",
      "Using a synchronized wrapper and still iterating without a lock",
    ],
    bestPractices: [
      "Prefer removeIf for conditional bulk removal",
      "Use Iterator.remove() in manual loops",
      "Use concurrent collections when iterating under real concurrency",
    ],
    relatedTech: ["removeIf", "CopyOnWriteArrayList", "ConcurrentHashMap", "Iterator"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Infosys", "Amazon", "TCS", "Deloitte"],
    related: ["fail-fast-vs-fail-safe", "concurrent-modification-exception", "copyonwritearraylist"],
  },

  // ==================================== Section 4 — Concurrency Framework
  {
    slug: "executor-shutdown-rejection",
    categoryId: "advanced-java",
    topic: "Executors",
    question: "How do you shut down an ExecutorService cleanly and handle rejected tasks?",
    seoTitle: "ExecutorService Shutdown & Rejection Interview Questions | Full Stack Interview Guru",
    seoDescription:
      "ExecutorService lifecycle for interviews: shutdown vs shutdownNow, awaitTermination, RejectedExecutionHandler policies, bounded queues, and pool sizing. Graceful termination with code examples.",
    heading: "ExecutorService Shutdown & Rejection — Interview Questions",
    tags: ["executorservice", "shutdown", "rejectedexecutionhandler", "thread pool", "concurrency"],
    shortAnswer:
      "Shut down gracefully with shutdown() (stop accepting new tasks, finish queued ones) then awaitTermination() with a timeout, falling back to shutdownNow() (interrupt running tasks, drain the queue) if it overruns. For overload, use a bounded queue plus a RejectedExecutionHandler — CallerRunsPolicy applies natural back-pressure by running the task on the submitting thread, while AbortPolicy (default) throws. Size the pool from the workload: CPU-bound ≈ cores; I/O-bound higher.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "shutdown()", v: "No new tasks; finish queued work" },
          { k: "shutdownNow()", v: "Interrupt running, return pending tasks" },
          { k: "awaitTermination", v: "Block up to a timeout for completion" },
          { k: "RejectedExecutionHandler", v: "Policy when the queue is full" },
        ],
      },
      { type: "text", content: "The safe shutdown idiom: `shutdown()` → `awaitTermination(timeout)` → if still running, `shutdownNow()` → await again. Skipping this leaks threads and can hang JVM exit (non-daemon pool threads keep the process alive)." },
      { type: "text", content: "A **bounded** queue + `CallerRunsPolicy` gives back-pressure: when the pool and queue are full, the caller runs the task itself, naturally slowing intake instead of exploding memory with an unbounded queue." },
      { type: "text", content: "**Key takeaway:** always own the pool's lifecycle and its overflow policy. Unbounded queues hide overload until OOM; a bounded queue with a rejection policy fails loudly and safely." },
    ],
    handsOn: {
      lang: "java",
      code: `ExecutorService pool = new ThreadPoolExecutor(
    4, 8, 60, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(100),                 // bounded → back-pressure
    new ThreadPoolExecutor.CallerRunsPolicy());    // rejection policy

// Graceful shutdown
pool.shutdown();                                    // stop accepting
if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {
    pool.shutdownNow();                             // force-interrupt
}`,
    },
    whatIf: {
      q: "Why can Executors.newFixedThreadPool() silently cause an OutOfMemoryError under load?",
      a: "Because its factory uses an UNBOUNDED LinkedBlockingQueue. When tasks arrive faster than the fixed threads can process them, they pile up in that queue without limit — the pool never rejects anything, so memory grows until the heap is exhausted. There's no back-pressure signal, so the failure appears as a sudden OOM rather than a controlled rejection. The fix is to construct a ThreadPoolExecutor with a bounded queue and an explicit RejectedExecutionHandler so overload is visible and handled.",
    },
    realWorld:
      "Every request-processing service, batch worker, and async pipeline needs this: graceful shutdown so in-flight work drains on deploy (and the JVM actually exits), plus bounded queues so a traffic spike triggers back-pressure or a 503 instead of a heap death spiral. The unbounded-queue OOM is a genuinely common production incident.",
    interviewerExpectation: ["shutdown vs shutdownNow", "awaitTermination with timeout", "bounded queue + rejection policy", "CallerRunsPolicy back-pressure", "avoid unbounded Executors.newFixedThreadPool"],
    followUps: [
      "How do you size a thread pool for CPU vs I/O work?",
      "What are the four built-in rejection policies?",
      "Where do exceptions thrown by pooled tasks go?",
    ],
    commonMistakes: [
      "Never calling shutdown (leaks threads, blocks JVM exit)",
      "Using unbounded-queue Executors factory methods in production",
      "Calling only shutdownNow and losing queued work",
    ],
    bestPractices: [
      "Construct ThreadPoolExecutor with a bounded queue explicitly",
      "Follow shutdown → awaitTermination → shutdownNow",
      "Choose a rejection policy that fits your back-pressure needs",
    ],
    relatedTech: ["ThreadPoolExecutor", "ArrayBlockingQueue", "CallerRunsPolicy", "back-pressure"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Netflix", "Google"],
    related: ["executorservice-thread-pools", "threadpoolexecutor-tuning", "task-exception-handling-executors"],
  },
  {
    slug: "task-exception-handling-executors",
    categoryId: "advanced-java",
    topic: "Executors",
    question: "Where do exceptions go when a task fails in an executor, and why does submit() swallow them?",
    seoTitle: "Task Exception Handling in Executors Interview Questions | Full Stack Interview Guru",
    seoDescription:
      "Handling task exceptions for interviews: why submit() hides exceptions in the Future, execute() vs submit(), Future.get and ExecutionException, and UncaughtExceptionHandler. With code examples.",
    heading: "Task Exceptions in Executors — Interview Questions",
    tags: ["executor", "exception handling", "future", "executionexception", "submit vs execute"],
    shortAnswer:
      "It depends on how you submitted. With execute(Runnable), an uncaught exception propagates to the thread's UncaughtExceptionHandler and typically prints a stack trace. With submit(...), the exception is captured inside the returned Future and stays silent until you call Future.get(), which rethrows it wrapped in an ExecutionException. So submit() 'swallows' failures unless you actually inspect the Future — a very common source of invisible errors.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "execute(Runnable)", v: "Exception → UncaughtExceptionHandler" },
          { k: "submit(...)", v: "Exception stored in the Future (silent)" },
          { k: "future.get()", v: "Rethrows as ExecutionException" },
          { k: "Result", v: "Unchecked get() → errors vanish" },
        ],
      },
      { type: "text", content: "The trap: you fire off `submit(task)`, never look at the Future (fire-and-forget), and the task throws. Nothing is logged, no handler runs — the failure is buried in a Future nobody reads. Switching to `execute` or always inspecting the Future surfaces it." },
      { type: "text", content: "For pools, set a `ThreadFactory` with an `UncaughtExceptionHandler` (and/or wrap task bodies in try/catch with logging) so failures are never silent, regardless of submit vs execute." },
      { type: "text", content: "**Key takeaway:** submit hides exceptions in the Future; execute routes them to the uncaught handler. Either read every Future's result or log inside the task — never fire-and-forget with submit." },
    ],
    handsOn: {
      lang: "java",
      code: `ExecutorService pool = Executors.newFixedThreadPool(2);

// submit(): exception is hidden until you call get()
Future<?> f = pool.submit(() -> { throw new IllegalStateException("boom"); });
try {
    f.get();                       // rethrows wrapped
} catch (ExecutionException e) {
    System.out.println("caught: " + e.getCause());  // the real cause
} catch (InterruptedException e) {
    Thread.currentThread().interrupt();
}`,
      output: "caught: java.lang.IllegalStateException: boom",
    },
    whatIf: {
      q: "A pooled task clearly throws, but nothing appears in the logs — why?",
      a: "You almost certainly used submit() and never called get() on the returned Future. submit() catches the throwable and stores it in the Future as the task's outcome instead of propagating it, so no UncaughtExceptionHandler fires and nothing is logged. The exception only re-surfaces (wrapped in ExecutionException) when someone calls Future.get(). Fixes: inspect every Future, wrap the task body in try/catch with logging, or use execute() so uncaught exceptions reach the thread's handler.",
    },
    realWorld:
      "This is behind countless 'the background job just stopped working and we had no idea' incidents — scheduled tasks, async event handlers, and worker pools where results are ignored. Teams standardise on logging inside task bodies and installing an UncaughtExceptionHandler so no failure is ever silent, especially for fire-and-forget work.",
    interviewerExpectation: ["execute → uncaught handler", "submit → exception in Future", "get() rethrows ExecutionException", "fire-and-forget submit hides errors", "install UncaughtExceptionHandler / log in task"],
    followUps: [
      "How do you set an UncaughtExceptionHandler for pool threads?",
      "How does CompletableFuture surface exceptions differently?",
      "What happens to a scheduled task that throws?",
    ],
    commonMistakes: [
      "Fire-and-forget submit() without reading the Future",
      "Assuming submit exceptions reach the uncaught handler",
      "Not logging inside task bodies",
    ],
    bestPractices: [
      "Inspect every Future or log within the task",
      "Install an UncaughtExceptionHandler via a ThreadFactory",
      "Prefer CompletableFuture with explicit error handling for async flows",
    ],
    relatedTech: ["Future", "UncaughtExceptionHandler", "ThreadFactory", "CompletableFuture"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Oracle"],
    related: ["runnable-vs-callable-future", "executor-shutdown-rejection", "completablefuture-error-handling"],
  },
  {
    slug: "completablefuture-error-handling",
    categoryId: "advanced-java",
    topic: "CompletableFuture",
    question: "How do you handle errors, timeouts, and combine multiple CompletableFutures without blocking?",
    seoTitle: "CompletableFuture Error Handling Interview Questions | Full Stack Interview Guru",
    seoDescription:
      "CompletableFuture for interviews: exceptionally/handle/whenComplete, allOf/anyOf, thenCompose vs thenApply, orTimeout, and which executor runs callbacks. Compose async pipelines with examples.",
    heading: "CompletableFuture Error Handling — Interview Questions",
    tags: ["completablefuture", "async", "error handling", "thencompose", "allof"],
    shortAnswer:
      "Recover from failures with exceptionally() (fallback value), handle() (see result OR exception), or whenComplete() (side-effect, doesn't alter the result). Bound latency with orTimeout()/completeOnTimeout(). Chain dependent async calls with thenCompose() (flatMap — avoids nested futures) and independent transforms with thenApply(). Fan out with allOf()/anyOf(). Mind which executor runs each stage: thenApply may run on the completing thread; thenApplyAsync uses the common pool or one you pass.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "exceptionally", v: "Fallback value on failure" },
          { k: "handle", v: "Receives (result, throwable) — transform either" },
          { k: "thenCompose", v: "Chain dependent futures (flatMap)" },
          { k: "allOf / anyOf", v: "Wait for all / first of many" },
        ],
      },
      { type: "text", content: "**thenApply vs thenCompose**: thenApply(fn) maps a value; if `fn` itself returns a CompletableFuture you'd get a nested CompletableFuture<CompletableFuture<T>> — thenCompose flattens it. Use compose for dependent async steps, apply for plain transforms." },
      { type: "text", content: "Watch the executor: non-Async stages can run on whatever thread completed the previous stage (sometimes your caller). Pass an explicit Executor to the *Async variants for predictable threading and to avoid starving the common ForkJoinPool with blocking work." },
      { type: "text", content: "**Key takeaway:** compose async pipelines with thenCompose, recover with handle/exceptionally, bound them with orTimeout, and always control the executor for blocking stages." },
    ],
    handsOn: {
      lang: "java",
      code: `CompletableFuture<String> profile =
    fetchUser(id)                                   // CF<User>
        .thenCompose(u -> fetchOrders(u.id()))       // dependent async → flatten
        .orTimeout(2, TimeUnit.SECONDS)              // bound latency
        .thenApply(Orders::summary)                  // plain transform
        .exceptionally(ex -> "unavailable: " + ex.getMessage());  // recover

System.out.println(profile.join());`,
    },
    whatIf: {
      q: "Why is running blocking JDBC/HTTP calls on the default CompletableFuture executor dangerous?",
      a: "Because the *Async methods default to the common ForkJoinPool, which is sized to the number of cores and shared JVM-wide (parallel streams use it too). Blocking those few threads on I/O starves every other user of the pool, tanking throughput and causing mysterious stalls elsewhere. For blocking work, always pass your own dedicated Executor to thenApplyAsync/supplyAsync (or use a ManagedBlocker/virtual threads), keeping the common pool for short CPU-bound tasks only.",
    },
    realWorld:
      "Aggregating a page from several microservices (user + orders + recommendations in parallel with allOf), calling downstream APIs with per-call timeouts and fallbacks, and composing dependent calls are all everyday CompletableFuture use. The 'common pool starvation' and 'nested future from thenApply' mistakes are frequent code-review catches.",
    interviewerExpectation: ["exceptionally/handle/whenComplete", "thenCompose vs thenApply", "allOf/anyOf fan-out", "orTimeout for latency", "control the executor for blocking stages"],
    followUps: [
      "handle vs exceptionally vs whenComplete — differences?",
      "How does allOf give you the individual results?",
      "How do virtual threads change async composition?",
    ],
    commonMistakes: [
      "Blocking on the common ForkJoinPool",
      "Using thenApply where thenCompose is needed (nested futures)",
      "Ignoring exceptions because no stage handles them",
    ],
    bestPractices: [
      "Pass a dedicated Executor for blocking stages",
      "Recover with handle/exceptionally and bound with orTimeout",
      "Use thenCompose for dependent async calls",
    ],
    relatedTech: ["CompletableFuture", "ForkJoinPool", "reactive", "virtual threads"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Netflix", "Microsoft", "Google"],
    related: ["completablefuture-async", "task-exception-handling-executors", "forkjoin-recursivetask-commonpool"],
  },
  {
    slug: "forkjoin-recursivetask-commonpool",
    categoryId: "advanced-java",
    topic: "ForkJoin",
    question: "How do you write a correct ForkJoin task, and why is the common pool a shared resource to respect?",
    seoTitle: "ForkJoin RecursiveTask & Common Pool Interview Questions | Full Stack Interview Guru",
    seoDescription:
      "ForkJoinPool for interviews: RecursiveTask/RecursiveAction, correct fork/compute/join order, the shared common pool, why blocking in parallel streams is dangerous, and ManagedBlocker. With examples.",
    heading: "ForkJoin & the Common Pool — Interview Questions",
    tags: ["forkjoin", "recursivetask", "common pool", "parallel streams", "work stealing"],
    shortAnswer:
      "Model divide-and-conquer work as a RecursiveTask (returns a result) or RecursiveAction (no result): split until a threshold, fork() one half to run asynchronously, compute() the other half on the current thread, then join() the forked half. The critical ordering is fork-one / compute-other / join — join before computing serialises the work. Respect the common pool: it's a shared, core-sized resource, so never run blocking I/O on it (parallel streams use it too) without a ManagedBlocker.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "RecursiveTask<T>", v: "Divide-and-conquer, returns a result" },
          { k: "RecursiveAction", v: "Same, no result" },
          { k: "Correct order", v: "fork() one, compute() other, join()" },
          { k: "Common pool", v: "Shared, core-sized — don't block it" },
        ],
      },
      { type: "text", content: "**Work-stealing**: idle worker threads steal subtasks from busy ones' deques, keeping cores fed. This is why ForkJoin excels at recursive, splittable, CPU-bound problems (sorts, tree/array reductions) — but not at blocking I/O." },
      { type: "text", content: "The ordering matters: `left.fork(); T r = right.compute(); return combine(r, left.join());` keeps both halves busy. Calling `left.join()` before computing the right half runs them one-after-another, throwing away the parallelism." },
      { type: "text", content: "**Key takeaway:** ForkJoin is for recursive CPU-bound work. Fork one branch, compute the other, join last — and keep blocking work off the shared common pool." },
    ],
    handsOn: {
      lang: "java",
      code: `class SumTask extends RecursiveTask<Long> {
    private final long[] a; private final int lo, hi;
    SumTask(long[] a, int lo, int hi) { this.a = a; this.lo = lo; this.hi = hi; }

    @Override protected Long compute() {
        if (hi - lo <= 10_000) {                    // threshold: go sequential
            long s = 0; for (int i = lo; i < hi; i++) s += a[i]; return s;
        }
        int mid = (lo + hi) >>> 1;
        SumTask left = new SumTask(a, lo, mid);
        left.fork();                                 // async: one half
        long right = new SumTask(a, mid, hi).compute();  // this thread: other half
        return right + left.join();                  // combine
    }
}`,
    },
    whatIf: {
      q: "Why can a blocking call inside a parallel stream stall unrelated parts of your app?",
      a: "Because parallel streams run on the shared ForkJoinPool.commonPool(), which has only about (cores - 1) worker threads for the entire JVM. If your stream's lambda blocks on I/O, those few workers sit idle-but-occupied, and everything else that uses the common pool — other parallel streams, some CompletableFuture stages — is starved and stalls too. The fixes: don't do blocking work in parallel streams, submit the pipeline to your own dedicated ForkJoinPool, use a ManagedBlocker so the pool compensates, or move blocking I/O to virtual threads.",
    },
    realWorld:
      "ForkJoin underpins Arrays.parallelSort and parallel streams for CPU-bound reductions over large arrays/collections. The recurring production lesson is the opposite: don't put blocking database or HTTP calls in a parallel stream — it quietly starves the common pool and degrades the whole service, a classic senior-level gotcha.",
    interviewerExpectation: ["RecursiveTask vs RecursiveAction", "fork-one/compute-other/join order", "work-stealing for CPU-bound", "common pool is shared & core-sized", "no blocking I/O without ManagedBlocker"],
    followUps: [
      "How does work-stealing balance load across workers?",
      "How do you run a parallel stream on a custom pool?",
      "When would you use a ManagedBlocker?",
    ],
    commonMistakes: [
      "Calling join() before computing the other half",
      "Running blocking I/O on the common pool / parallel streams",
      "Setting the split threshold too low (task overhead dominates)",
    ],
    bestPractices: [
      "Fork one branch, compute the other, join last",
      "Keep the common pool for short CPU-bound tasks",
      "Use a dedicated pool or virtual threads for blocking work",
    ],
    relatedTech: ["ForkJoinPool", "parallel streams", "Arrays.parallelSort", "ManagedBlocker"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Google", "Amazon", "Microsoft", "Oracle"],
    related: ["forkjoinpool-work-stealing", "executorservice-thread-pools", "completablefuture-error-handling"],
  },
  {
    slug: "threadlocal-context-scopedvalues",
    categoryId: "advanced-java",
    topic: "ThreadLocal",
    question: "What are ThreadLocals legitimately good for, and how do ScopedValues improve on them?",
    seoTitle: "ThreadLocal vs ScopedValue Interview Questions (Java) | Full Stack Interview Guru",
    seoDescription:
      "ThreadLocal for interviews: valid uses (per-request context, non-thread-safe formatters), InheritableThreadLocal, why it's risky with pools and virtual threads, and how Java 21 ScopedValues fix it.",
    heading: "ThreadLocal vs ScopedValue — Interview Questions",
    tags: ["threadlocal", "scopedvalue", "context propagation", "virtual threads", "concurrency"],
    shortAnswer:
      "ThreadLocal gives each thread its own copy of a value — legitimately useful for per-request context (user/trace id), non-thread-safe helpers (older SimpleDateFormat), and avoiding parameter-passing through deep call stacks. But it's mutable, easy to leak in thread pools (the value outlives the request), and scales badly with millions of virtual threads. Java 21's ScopedValue is the modern answer: immutable, bounded to a dynamic scope, auto-cleaned, and cheap to inherit in structured concurrency.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Good for", v: "Request context, trace id, non-thread-safe tools" },
          { k: "InheritableThreadLocal", v: "Child threads inherit the value" },
          { k: "Risk", v: "Leaks in pools; heavy with virtual threads" },
          { k: "ScopedValue (21)", v: "Immutable, scoped, auto-cleaned" },
        ],
      },
      { type: "text", content: "The pool leak: a pooled thread is reused across requests, so a ThreadLocal set in request A and not removed is still visible in request B — a correctness AND memory issue. You must `remove()` in a finally block, ideally via a filter/interceptor." },
      { type: "text", content: "**ScopedValue** flips the model: you bind a value for the dynamic extent of a call (ScopedValue.where(V, x).run(...)); it's immutable, automatically unbound when the block exits, and designed to be inherited cheaply by structured-concurrency subtasks — perfect for virtual threads." },
      { type: "text", content: "**Key takeaway:** use ThreadLocal sparingly and always remove() it in pools; prefer ScopedValue for immutable, scope-bound context on modern (virtual-thread) Java." },
    ],
    handsOn: {
      lang: "java",
      code: `// Java 21+ ScopedValue: immutable, auto-cleaned, no leak
static final ScopedValue<String> USER = ScopedValue.newInstance();

void handle(Request req) {
    ScopedValue.where(USER, req.userId())
               .run(() -> process());       // USER bound only for this call
    // automatically unbound here — nothing to remove()
}

void process() {
    System.out.println("current user: " + USER.get());
}`,
    },
    whatIf: {
      q: "Why are millions of ThreadLocals a problem with virtual threads?",
      a: "Virtual threads make it cheap to have millions of threads, but each ThreadLocal value is stored per-thread — so a per-request ThreadLocal now means potentially millions of copies held in memory, undermining the lightweight model. ThreadLocals are also mutable and leak-prone, and they don't inherit cleanly into structured-concurrency subtasks. ScopedValue was designed for exactly this: an immutable value bound for a bounded scope, shared by reference and inherited efficiently, with no per-thread mutable storage to leak or bloat.",
    },
    realWorld:
      "ThreadLocal carries the security principal, tenant, and trace/correlation id through logging (MDC) and framework internals without threading them through every method. The perennial bug is a pooled thread leaking one request's identity into the next; teams clear it in a servlet filter's finally block, and new code on Java 21 increasingly adopts ScopedValue for safe, virtual-thread-friendly context.",
    interviewerExpectation: ["per-thread copy", "valid uses: context/non-thread-safe tools", "must remove() in pools", "InheritableThreadLocal", "ScopedValue = immutable, scoped, VT-friendly"],
    followUps: [
      "How does MDC use ThreadLocal for logging context?",
      "Why must you remove() a ThreadLocal in a pool?",
      "How does ScopedValue propagate into structured concurrency?",
    ],
    commonMistakes: [
      "Forgetting remove() so pooled threads leak state",
      "Using ThreadLocal as a general-purpose cache",
      "Assuming child threads inherit a plain ThreadLocal",
    ],
    bestPractices: [
      "Always remove() ThreadLocals in a finally block in pools",
      "Prefer ScopedValue for immutable request-scoped context",
      "Keep ThreadLocal usage minimal and well-encapsulated",
    ],
    relatedTech: ["ScopedValue", "SLF4J MDC", "structured concurrency", "virtual threads"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Netflix", "Oracle"],
    related: ["threadlocal-memory-leak", "virtual-threads-pinning-structured", "virtual-threads"],
  },

  // ==================================== Section 5 — Modern Java (17–21)
  {
    slug: "records-sealed-classes",
    categoryId: "advanced-java",
    topic: "Modern Java",
    question: "What are Records and Sealed Classes, and how do they enable data-oriented programming?",
    seoTitle: "Records & Sealed Classes Interview Questions (Java 17+) | Full Stack Interview Guru",
    seoDescription:
      "Java records and sealed classes for interviews: compact constructors, immutability, sealed hierarchies, exhaustive pattern-matching switch, and algebraic data types. Java 17/21 examples included.",
    heading: "Records & Sealed Classes — Interview Questions",
    tags: ["records", "sealed classes", "pattern matching", "java 17", "data-oriented"],
    shortAnswer:
      "A record is a concise, immutable data carrier: you declare the components and the compiler generates the constructor, accessors, equals/hashCode, and toString. A sealed class/interface restricts which types may extend or implement it (permits ...). Together they enable data-oriented programming: sealed hierarchies model a closed set of variants (algebraic data types), and pattern-matching switch handles them exhaustively — the compiler errors if you miss a case.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "record", v: "Immutable carrier; auto equals/hashCode/toString" },
          { k: "Compact constructor", v: "Validate/normalise/defensive-copy" },
          { k: "sealed + permits", v: "Closed set of allowed subtypes" },
          { k: "switch pattern", v: "Exhaustive, no default needed" },
        ],
      },
      { type: "text", content: "Records kill boilerplate for DTOs, value objects, and multiple return values. The **compact constructor** is where you validate invariants and defensively copy mutable components (records are only shallowly immutable)." },
      { type: "text", content: "**Sealed + records + switch** = algebraic data types in Java: model a fixed set of shapes (Circle, Square, Triangle), and a pattern-matching switch over the sealed type is checked for exhaustiveness — add a variant and every switch that forgot it fails to compile." },
      { type: "text", content: "**Key takeaway:** records give you cheap immutable data; sealed types give you closed hierarchies; pattern matching makes handling them exhaustive and safe. That triad is modern, data-oriented Java." },
    ],
    handsOn: {
      lang: "java",
      code: `sealed interface Shape permits Circle, Square {}
record Circle(double r) implements Shape {}
record Square(double side) implements Shape {}

static double area(Shape s) {
    return switch (s) {                      // exhaustive — no default needed
        case Circle c -> Math.PI * c.r() * c.r();
        case Square sq -> sq.side() * sq.side();
    };
}
// Add a new permitted Shape → this switch fails to compile until handled.`,
    },
    whatIf: {
      q: "How do sealed classes make a pattern-matching switch safer than a normal class hierarchy?",
      a: "Because the compiler knows the COMPLETE set of permitted subtypes, it can verify a switch covers every case — so you can omit the default branch and, crucially, when someone adds a new permitted subtype later, every switch that doesn't handle it stops compiling. With an open hierarchy the compiler can't know all subtypes, so it forces a default that silently swallows new cases at runtime. Sealed types turn 'did I handle every variant?' from a runtime hope into a compile-time guarantee.",
    },
    realWorld:
      "Records are now the default for DTOs, API request/response models, events, and value objects — less boilerplate, correct equals/hashCode for free. Sealed hierarchies model domain state machines and result types (Success/Failure), and exhaustive switches mean adding a new state is a compile error everywhere it must be handled — a big maintainability win in large codebases.",
    interviewerExpectation: ["record = immutable carrier with generated members", "compact constructor for validation/copy", "sealed restricts subtypes (permits)", "exhaustive pattern-matching switch", "algebraic data types / data-oriented programming"],
    followUps: [
      "How do you validate or defensively copy in a record?",
      "Why are records only shallowly immutable?",
      "How does record deconstruction in switch patterns work?",
    ],
    commonMistakes: [
      "Assuming a record with mutable components is deeply immutable",
      "Adding a default to a sealed switch (defeats exhaustiveness)",
      "Using records where identity/mutability is actually required",
    ],
    bestPractices: [
      "Use records for immutable DTOs and value objects",
      "Validate and defensively copy in compact constructors",
      "Model closed variant sets with sealed types + exhaustive switch",
    ],
    relatedTech: ["Java 17", "pattern matching", "algebraic data types", "DTOs"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Oracle", "Microsoft", "Google"],
    related: ["immutability-advanced", "equals-hashcode-inheritance", "serialization-vs-externalization"],
  },
  {
    slug: "virtual-threads-pinning-structured",
    categoryId: "advanced-java",
    topic: "Virtual Threads",
    question: "In production, how do virtual threads pin, why shouldn't you pool them, and how does structured concurrency help?",
    seoTitle: "Virtual Threads in Production: Pinning & Structured Concurrency | Full Stack Interview Guru",
    seoDescription:
      "Advanced virtual threads interview questions: carrier threads and pinning (synchronized/native), why not to pool virtual threads, semaphore-based limiting, and structured concurrency. Java 21 examples.",
    heading: "Virtual Threads in Production — Interview Questions",
    tags: ["virtual threads", "pinning", "structured concurrency", "carrier thread", "project loom"],
    shortAnswer:
      "Virtual threads run on a small pool of platform 'carrier' threads and unmount while blocked on I/O — so millions can exist cheaply. On Java 21–23, they 'pin' (stay mounted, blocking the carrier) inside synchronized blocks that block, or during native/JNI calls; the workaround on those versions is to replace hot synchronized blocks with ReentrantLock. As of Java 24 (JEP 491), the JVM reimplemented monitor support so synchronized no longer pins the carrier in the common case — check which JDK a codebase targets before applying the ReentrantLock workaround. Don't pool virtual threads — create one per task (they're disposable) and limit concurrency with a Semaphore instead. Structured concurrency (StructuredTaskScope) ties subtask lifetimes to the parent for clean cancellation and error propagation.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Carrier thread", v: "Platform thread that runs a virtual thread" },
          { k: "Unmount", v: "VT frees the carrier while blocked on I/O" },
          { k: "Pinning (Java 21–23)", v: "synchronized-blocking / native keeps it mounted" },
          { k: "Java 24+ (JEP 491)", v: "synchronized no longer pins the carrier in the common case" },
          { k: "Don't pool", v: "one VT per task; limit with a Semaphore" },
        ],
      },
      { type: "text", content: "**Pinning** defeats the point: a pinned virtual thread holds its carrier while blocked, so you lose the concurrency win. On Java 21–23 the usual culprit is blocking inside a `synchronized` block — swap it for a `ReentrantLock`, which lets the VT unmount. As of Java 24, JEP 491 removed this specific pinning problem for synchronized in the common case, so confirm the target JDK before assuming the ReentrantLock workaround is still necessary." },
      { type: "text", content: "Pooling virtual threads is an anti-pattern — they're cheap and disposable, so use `newVirtualThreadPerTaskExecutor()` and cap real concurrency (e.g. to a downstream connection limit) with a `Semaphore`, not a fixed pool." },
      { type: "text", content: "**Key takeaway:** virtual threads make blocking code scale — as long as you avoid pinning (prefer locks over synchronized), don't pool them, and use structured concurrency to manage subtask lifetimes." },
    ],
    handsOn: {
      lang: "java",
      code: `// One virtual thread per task; structured concurrency for subtasks (Java 21)
try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    var user   = scope.fork(() -> fetchUser(id));     // each on its own VT
    var orders = scope.fork(() -> fetchOrders(id));
    scope.join();                 // wait for both
    scope.throwIfFailed();        // propagate the first failure, cancel the rest
    return new Profile(user.get(), orders.get());
}`,
    },
    whatIf: {
      q: "You migrated to virtual threads but throughput didn't improve — what would you check first?",
      a: "Pinning. If your hot path blocks inside synchronized blocks or makes native/JNI calls, the virtual thread stays mounted on its carrier while blocked, so you're effectively back to a small fixed pool of platform threads. Enable jdk.tracePinnedThreads (or JFR's pinned-thread events) to find the offenders. On Java 21–23, replace blocking synchronized with ReentrantLock so the VT can unmount; on Java 24+, JEP 491 removed synchronized-caused pinning in the common case, so check your target JDK before assuming that fix is still needed. Also verify you're not pooling virtual threads or funnelling everything through a shared bounded resource that serialises the work.",
    },
    realWorld:
      "Virtual threads let a thread-per-request server handle huge concurrency with simple blocking code — no reactive rewrite. The real migration work is auditing for pinning (legacy synchronized around I/O, old JDBC drivers), replacing thread pools with per-task virtual threads plus Semaphore-based limits, and adopting StructuredTaskScope for clean fan-out/cancellation of downstream calls.",
    interviewerExpectation: ["carrier threads + unmount on I/O", "pinning via synchronized/native", "ReentrantLock avoids pinning", "don't pool VTs; limit with Semaphore", "structured concurrency for subtask lifecycle"],
    followUps: [
      "How do you detect pinned virtual threads?",
      "Why replace synchronized with ReentrantLock for VTs?",
      "How does StructuredTaskScope propagate cancellation?",
    ],
    commonMistakes: [
      "Pooling virtual threads like platform threads",
      "Blocking inside synchronized (causes pinning)",
      "Expecting speedups for CPU-bound work",
    ],
    bestPractices: [
      "One virtual thread per task; cap concurrency with a Semaphore",
      "Prefer ReentrantLock over synchronized on blocking paths",
      "Use StructuredTaskScope for fan-out with clean cancellation",
    ],
    relatedTech: ["Project Loom", "StructuredTaskScope", "ReentrantLock", "JFR"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Netflix", "Google", "Microsoft"],
    related: ["virtual-threads", "threadlocal-context-scopedvalues", "forkjoin-recursivetask-commonpool", "virtual-thread-synchronized-pinning"],
  },
];
