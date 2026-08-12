import type { Question } from "../types";

/**
 * JVM — flagship expansion batch (20 questions).
 * Enterprise & product-company patterns: memory areas, garbage collection &
 * tuning, JIT, references, class loading, and production GC/native-memory
 * troubleshooting. (Leak diagnosis / classloader-leak basics live in Core Java;
 * these are distinct, deeper JVM-internals questions.)
 *
 * Difficulty mix: 4 Easy · 10 Medium · 6 Hard. Ordered easy → hard.
 */
export const jvmExtra: Question[] = [
  // ---------------------------------------------------------------- Easy (4)
  {
    slug: "jvm-jre-jdk",
    categoryId: "jvm",
    topic: "Memory Areas",
    question: "JVM vs JRE vs JDK — what's the difference, and which do you ship in a Docker image?",
    tags: ["jvm", "jre", "jdk", "docker", "runtime"],
    shortAnswer:
      "JVM runs bytecode. JRE = JVM + core libraries (run only). JDK = JRE + compiler/tools (javac, jar, jstack — to build). For a runtime container ship a JRE (or jlink'd runtime) to keep the image small; build in a JDK stage.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "JVM", v: "executes bytecode" },
          { k: "JRE", v: "JVM + libraries (run apps)" },
          { k: "JDK", v: "JRE + javac/jar/jstack (build apps)" },
        ],
      },
    ],
    whatIf: {
      q: "Why use a multi-stage Docker build with JDK then JRE?",
      a: "Compile in a JDK stage, then copy only the artifact into a slim JRE (or jlink custom runtime) stage. The final image excludes the compiler/tools — smaller, faster to pull, and a reduced attack surface.",
    },
    realWorld:
      "Right-sizing the base image (JRE/jlink, not full JDK) is a standard container optimization — it can cut image size by hundreds of MB and trim CVEs from unused tooling.",
    interviewerExpectation: ["JVM executes bytecode", "JRE = run", "JDK = build", "ship JRE/jlink in prod", "multi-stage build"],
    followUps: [
      "What does jlink do and when would you use it?",
      "Why did Oracle stop shipping a standalone JRE in newer versions?",
      "Which JDK tools help you debug production (jstack/jcmd/jmap)?",
    ],
    commonMistakes: [
      "Shipping a full JDK as the runtime image",
      "Confusing JRE (run) with JDK (build)",
      "Assuming the JVM and JDK are the same thing",
    ],
    bestPractices: [
      "Multi-stage build: JDK to compile, JRE/jlink to run",
      "Use a slim, patched base image",
      "Keep build tools out of the runtime image",
    ],
    relatedTech: ["jlink", "Docker multi-stage", "Temurin/Eclipse Adoptium"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Cognizant", "Accenture"],
    related: ["jvm-memory-areas", "classloading-delegation"],
  },
  {
    slug: "bytecode-platform-independence",
    categoryId: "jvm",
    topic: "Memory Areas",
    question: "How does Java achieve 'write once, run anywhere' via bytecode?",
    tags: ["bytecode", "platform independence", "jvm", "class file"],
    shortAnswer:
      "javac compiles source to platform-neutral bytecode (.class). The JVM — which IS platform-specific — interprets/JIT-compiles that bytecode to native machine code at runtime. The bytecode is portable; the JVM bridges to each OS/CPU.",
    mindMap: [
      { type: "text", content: "Source → `javac` → **bytecode** (portable) → JVM for your OS/CPU → native code. The artifact is identical everywhere; only the JVM differs per platform." },
    ],
    whatIf: {
      q: "If bytecode is portable, why are there different JDK downloads per OS?",
      a: "The bytecode is portable, but the JVM that runs it is native code compiled for each OS/architecture (Linux x64, macOS ARM, Windows). You download the platform-specific JVM; your .jar/.class files stay the same.",
    },
    realWorld:
      "The same built JAR runs on a developer's Mac, a Linux CI runner, and a prod container — only the base JVM image differs. This portability is why Java dominates enterprise backends.",
    interviewerExpectation: ["javac → bytecode", "JVM is platform-specific", "interpret + JIT to native", "portable artifact"],
    followUps: [
      "What's inside a .class file (constant pool, methods)?",
      "How does the JIT turn hot bytecode into native code?",
      "How is this different from Go/Rust native binaries?",
    ],
    commonMistakes: [
      "Thinking bytecode runs directly on the CPU",
      "Believing the JVM itself is platform-independent",
      "Confusing compilation (javac) with JIT (runtime)",
    ],
    bestPractices: [
      "Build once, deploy the same artifact everywhere",
      "Match the JVM/base image to the target platform",
      "Pin the JDK version across build and run",
    ],
    relatedTech: ["javac", "JIT", "class file format"],
    difficulty: "Easy",
    experience: ["0-2 years"],
    askedIn: ["TCS", "Infosys", "Wipro", "Capgemini"],
    related: ["jit-compilation", "jvm-jre-jdk"],
  },
  {
    slug: "jvm-memory-areas",
    categoryId: "jvm",
    topic: "Memory Areas",
    question: "What are the main JVM memory areas, and which are shared vs per-thread?",
    tags: ["memory areas", "heap", "stack", "metaspace", "runtime data areas"],
    shortAnswer:
      "Shared across threads: Heap (objects) and Metaspace (class metadata). Per-thread: the JVM Stack (frames, locals), PC register, and native method stack. Most OutOfMemory issues are Heap or Metaspace; StackOverflowError is the per-thread stack.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Heap (shared)", v: "all objects + arrays" },
          { k: "Metaspace (shared)", v: "class metadata (native mem)" },
          { k: "Stack (per-thread)", v: "frames, locals, partial results" },
          { k: "PC / native stack", v: "per-thread bookkeeping" },
        ],
      },
    ],
    whatIf: {
      q: "Deep recursion throws StackOverflowError but the heap is fine — which area, and the fix?",
      a: "That's the per-thread JVM stack overflowing (too many frames). Fix the recursion (add a base case / convert to iteration) or, rarely, raise -Xss. It's unrelated to heap size — bumping -Xmx won't help.",
    },
    realWorld:
      "Knowing which area is exhausted routes the fix: Heap OOM → leak/sizing, Metaspace OOM → classloader leak/too many classes, StackOverflow → recursion. Misdiagnosing wastes incident time.",
    interviewerExpectation: ["heap & metaspace shared", "stack/PC per-thread", "StackOverflow vs OOM", "metaspace is native memory"],
    followUps: [
      "Where do String literals and static fields live?",
      "Why did PermGen become Metaspace?",
      "What does -Xss control?",
    ],
    commonMistakes: [
      "Raising -Xmx for a StackOverflowError",
      "Thinking Metaspace is part of the heap",
      "Ignoring per-thread stack cost when creating many threads",
    ],
    bestPractices: [
      "Match the fix to the exhausted area",
      "Bound recursion; prefer iteration for deep structures",
      "Monitor both heap and metaspace",
    ],
    relatedTech: ["Metaspace", "-Xss", "-Xmx", "jcmd"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "Cognizant", "Accenture", "Amazon"],
    related: ["stack-vs-heap-memory", "metaspace-vs-permgen", "outofmemoryerror-types"],
  },
  {
    slug: "stack-vs-heap-memory",
    categoryId: "jvm",
    topic: "Memory Areas",
    question: "Stack vs Heap — where do primitives, references and objects actually live?",
    tags: ["stack", "heap", "references", "primitives", "memory"],
    shortAnswer:
      "Local primitives and object references live on the per-thread stack (fast, auto-freed when the frame pops). The objects they point to live on the shared heap (GC-managed). So a reference is on the stack; the object is on the heap.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Stack", v: "local primitives + references, LIFO frames" },
          { k: "Heap", v: "the actual objects/arrays, GC-managed" },
          { k: "Lifetime", v: "stack: frame; heap: until unreachable" },
        ],
      },
    ],
    whatIf: {
      q: "Two methods hold references to the same object — how many objects exist?",
      a: "One. Each method's stack frame has its OWN reference (the references are copies), but both point to the single heap object. Mutating through one reference is visible via the other — they share the same instance.",
    },
    realWorld:
      "Understanding stack-reference vs heap-object explains aliasing bugs (two variables 'see' the same object), why pass-by-value still lets you mutate shared state, and how GC reclaims unreachable heap.",
    interviewerExpectation: ["references on stack, objects on heap", "primitives local on stack", "stack auto-freed per frame", "heap GC-managed", "aliasing"],
    followUps: [
      "How does escape analysis blur this (stack allocation)?",
      "Where do instance fields of an object live?",
      "Why is stack access faster than heap?",
    ],
    commonMistakes: [
      "Thinking objects live on the stack",
      "Assuming two references mean two objects",
      "Confusing reference copy with object copy",
    ],
    bestPractices: [
      "Reason about aliasing when sharing references",
      "Prefer immutability to avoid shared-mutation bugs",
      "Don't over-optimize; let the JIT/escape analysis help",
    ],
    relatedTech: ["escape analysis", "GC", "pass-by-value"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["TCS", "Infosys", "Deloitte"],
    related: ["jvm-memory-areas", "escape-analysis"],
  },

  // -------------------------------------------------------------- Medium (10)
  {
    slug: "heap-generations-gc",
    categoryId: "jvm",
    topic: "Garbage Collection",
    question: "Why is the heap split into young and old generations, and what's a minor vs major GC?",
    tags: ["generational gc", "young gen", "old gen", "eden", "survivor", "minor gc"],
    shortAnswer:
      "The weak generational hypothesis: most objects die young. So the heap splits into Young (Eden + 2 Survivors) collected often and cheaply (minor GC), and Old (tenured) collected rarely (major/full GC). Survivors that age past a threshold are promoted to Old.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Eden", v: "new objects allocate here" },
          { k: "Survivor S0/S1", v: "survive a minor GC, age++" },
          { k: "Old/Tenured", v: "long-lived, major/full GC" },
          { k: "Promotion", v: "age ≥ threshold → Old" },
        ],
      },
    ],
    whatIf: {
      q: "Allocation rate is huge and minor GCs are frequent — is that bad?",
      a: "Not necessarily. Minor GCs are cheap because most young objects are already dead (copying only survivors). Frequent minor GC with short pauses is fine; the problem is when objects get prematurely promoted to Old, causing expensive major GCs.",
    },
    realWorld:
      "Generational GC is why allocating lots of short-lived objects (per-request DTOs) is usually cheap — they die in Eden and never reach Old gen. Premature promotion (from undersized young gen) is a classic tuning issue.",
    interviewerExpectation: ["weak generational hypothesis", "Eden/Survivor/Old", "minor vs major/full GC", "promotion by age", "copying collector for young"],
    followUps: [
      "What is premature promotion and how do you fix it?",
      "How does the survivor-space tenuring threshold work?",
      "Why is a minor GC a 'copying' collection?",
    ],
    commonMistakes: [
      "Assuming frequent minor GC is a problem",
      "Undersized young gen causing premature promotion",
      "Confusing major GC with full GC",
    ],
    bestPractices: [
      "Size young gen to keep short-lived objects out of Old",
      "Watch promotion rate, not just GC count",
      "Profile allocation before tuning",
    ],
    relatedTech: ["G1", "Parallel GC", "GC logs"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["gc-mark-sweep-roots", "choosing-a-gc", "g1-gc-internals"],
  },
  {
    slug: "gc-mark-sweep-roots",
    categoryId: "jvm",
    topic: "Garbage Collection",
    question: "How does garbage collection decide what to free — and what are GC roots?",
    tags: ["mark-sweep", "gc roots", "reachability", "compaction"],
    shortAnswer:
      "GC frees objects that are unreachable from GC roots (stack locals, statics, JNI refs, active threads). Mark: traverse from roots marking live objects; Sweep: reclaim unmarked; Compact: defragment. Java GC is reachability-based, not reference-counting, so it handles cycles.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "GC roots", v: "stack locals, statics, threads, JNI" },
          { k: "Mark", v: "walk graph from roots → live set" },
          { k: "Sweep", v: "reclaim everything unmarked" },
          { k: "Compact", v: "defragment surviving objects" },
        ],
      },
    ],
    whatIf: {
      q: "Two objects reference each other but nothing else points to them — are they collected?",
      a: "Yes. Java uses reachability from GC roots, not reference counting, so an isolated cycle is unreachable and gets collected. This is why Java doesn't leak on reference cycles (unlike naive ref-counting).",
    },
    realWorld:
      "'Path to GC roots' in a heap analyzer (MAT) is exactly this concept — to fix a leak you find what root still references the object that should be dead.",
    interviewerExpectation: ["reachability from roots", "what GC roots are", "mark-sweep-compact", "handles cycles", "not reference counting"],
    followUps: [
      "Why doesn't Java use reference counting?",
      "What does 'path to GC roots' tell you in a heap dump?",
      "What is a safepoint and why does GC need one?",
    ],
    commonMistakes: [
      "Thinking Java uses reference counting",
      "Assuming reference cycles leak",
      "Confusing 'unreachable' with 'null'",
    ],
    bestPractices: [
      "Use MAT 'path to GC roots' for leak hunting",
      "Null out long-lived references when done (rarely needed)",
      "Understand roots to reason about retention",
    ],
    relatedTech: ["Eclipse MAT", "safepoints", "tri-color marking"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["heap-generations-gc", "reference-types", "diagnosing-gc-pauses"],
  },
  {
    slug: "metaspace-vs-permgen",
    categoryId: "jvm",
    topic: "Memory Areas",
    question: "What replaced PermGen with Metaspace, and how can you still get a Metaspace OOM?",
    tags: ["metaspace", "permgen", "class metadata", "oom", "classloader"],
    shortAnswer:
      "Java 8 replaced fixed-size PermGen with Metaspace, which lives in native memory and auto-grows by default. You still OOM if classes/classloaders leak (e.g. repeated redeploys, dynamic proxy/bytecode generation) or if you cap it with -XX:MaxMetaspaceSize.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "PermGen (≤7)", v: "fixed size in heap → frequent OOM" },
          { k: "Metaspace (8+)", v: "native memory, auto-grows" },
          { k: "Still OOMs", v: "classloader/class leak or capped size" },
        ],
      },
    ],
    whatIf: {
      q: "Metaspace usage climbs every hot redeploy until OOM — root cause?",
      a: "A classloader leak: old web-app classes can't be unloaded because something pins their ClassLoader, so each redeploy adds another full set of class metadata to Metaspace. Fix the pin (ThreadLocals, drivers, threads); restart instead of hot-redeploy in prod.",
    },
    realWorld:
      "Frameworks that generate classes at runtime (CGLIB proxies, dynamic languages, lots of lambdas/anonymous classes) and repeated redeploys are the usual Metaspace-growth culprits.",
    interviewerExpectation: ["PermGen fixed/in-heap", "Metaspace native/auto-grow", "classloader leak cause", "dynamic class generation", "MaxMetaspaceSize cap"],
    followUps: [
      "How does this relate to a ClassLoader leak?",
      "Should you cap MaxMetaspaceSize in production?",
      "How do dynamic proxies inflate Metaspace?",
    ],
    commonMistakes: [
      "Assuming Metaspace can never OOM",
      "Not monitoring Metaspace separately from heap",
      "Hot-redeploying repeatedly in production",
    ],
    bestPractices: [
      "Monitor Metaspace; alert on per-redeploy growth",
      "Prefer full restarts over hot redeploys in prod",
      "Cap MaxMetaspaceSize to fail fast on leaks (carefully)",
    ],
    relatedTech: ["Metaspace", "CGLIB", "classloaders", "jcmd VM.metaspace"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Cognizant"],
    related: ["jvm-memory-areas", "classloading-delegation", "outofmemoryerror-types"],
  },
  {
    slug: "heap-sizing-xms-xmx",
    categoryId: "jvm",
    topic: "GC Tuning",
    question: "How do you size the heap (-Xms/-Xmx), and what's special about JVMs in containers?",
    tags: ["xms", "xmx", "heap sizing", "container", "cgroups"],
    shortAnswer:
      "-Xms sets initial, -Xmx max heap. Set Xms = Xmx in servers to avoid resize pauses and commit memory upfront. In containers, modern JVMs are cgroup-aware and size to the container limit — but verify, and prefer -XX:MaxRAMPercentage over hard-coded -Xmx.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "-Xms = -Xmx", v: "no heap-resize pauses (servers)" },
          { k: "Container", v: "JVM reads cgroup limits (Java 10+)" },
          { k: "MaxRAMPercentage", v: "size heap as % of container RAM" },
        ],
      },
    ],
    handsOn: {
      lang: "bash",
      code: `# container-friendly heap sizing
-XX:InitialRAMPercentage=60 -XX:MaxRAMPercentage=60
# leaves headroom for metaspace, threads, off-heap`,
    },
    whatIf: {
      q: "A container is OOM-killed by the orchestrator though heap looks fine — why?",
      a: "Total JVM memory = heap + Metaspace + thread stacks + code cache + direct buffers. If -Xmx ≈ container limit, those off-heap areas push RSS over the limit and the kernel OOM-kills the process. Leave headroom (e.g. heap ≈ 60–75% of the limit).",
    },
    realWorld:
      "Container OOM-kills with a healthy-looking heap are extremely common — the fix is sizing heap to a percentage of the limit and leaving room for non-heap memory, not maxing -Xmx.",
    interviewerExpectation: ["Xms=Xmx avoids resize", "JVM total > heap", "cgroup awareness", "MaxRAMPercentage", "headroom for off-heap"],
    followUps: [
      "What memory does the JVM use beyond the heap?",
      "Why prefer MaxRAMPercentage over -Xmx in containers?",
      "How do you see actual RSS vs heap?",
    ],
    commonMistakes: [
      "Setting -Xmx equal to the container memory limit",
      "Forgetting Metaspace/threads/direct memory in budgeting",
      "Using old JVMs that ignore cgroup limits",
    ],
    bestPractices: [
      "Heap ≈ 60–75% of container limit",
      "Xms = Xmx for predictable servers",
      "Use Native Memory Tracking to see total usage",
    ],
    relatedTech: ["cgroups", "MaxRAMPercentage", "NMT", "Kubernetes limits"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["off-heap-direct-memory", "outofmemoryerror-types"],
  },
  {
    slug: "choosing-a-gc",
    categoryId: "jvm",
    topic: "GC Tuning",
    question: "How do you choose a garbage collector — Serial, Parallel, G1, ZGC or Shenandoah?",
    tags: ["g1", "parallel gc", "zgc", "shenandoah", "gc selection", "latency"],
    shortAnswer:
      "Parallel GC = max throughput, batch jobs (tolerates pauses). G1 = balanced default for most services (predictable pauses). ZGC/Shenandoah = very large heaps needing sub-millisecond pauses. Serial = tiny heaps/single core. Match the collector to your throughput-vs-latency goal.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Parallel", v: "throughput, batch — big pauses OK" },
          { k: "G1 (default)", v: "balanced, pause target -XX:MaxGCPauseMillis" },
          { k: "ZGC / Shenandoah", v: "huge heaps, ~sub-ms pauses" },
          { k: "Serial", v: "small heap, single core" },
        ],
      },
    ],
    whatIf: {
      q: "A low-latency API on a 64 GB heap has unacceptable G1 pauses — what do you try?",
      a: "Switch to ZGC (or Shenandoah): concurrent collectors that keep pause times in the sub-millisecond range largely independent of heap size, trading some throughput/CPU. Then measure p99 latency to confirm the improvement.",
    },
    realWorld:
      "Most services run G1 (the default since Java 9). Latency-critical, large-heap systems move to ZGC; throughput-bound batch jobs sometimes prefer Parallel. The choice is a deliberate latency/throughput trade-off.",
    interviewerExpectation: ["throughput vs latency", "G1 default + pause target", "ZGC/Shenandoah for low pause/large heap", "Parallel for batch", "measure to decide"],
    followUps: [
      "What does -XX:MaxGCPauseMillis actually do in G1?",
      "What does ZGC trade for its low pauses?",
      "How do you A/B test a GC change safely?",
    ],
    commonMistakes: [
      "Switching GCs without measuring",
      "Using Parallel for latency-sensitive APIs",
      "Assuming a GC change is free of CPU cost",
    ],
    bestPractices: [
      "Start with G1; change only with data",
      "Pick by latency vs throughput goal",
      "Validate p99 latency, not just averages",
    ],
    relatedTech: ["G1", "ZGC", "Shenandoah", "Parallel GC", "JFR"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["stop-the-world-gc-tuning", "g1-gc-internals", "zgc-low-pause"],
  },
  {
    slug: "stop-the-world-gc-tuning",
    categoryId: "jvm",
    topic: "GC Tuning",
    question: "What is a stop-the-world pause, and how do you reduce GC pause times?",
    tags: ["stop-the-world", "gc pause", "latency", "tuning", "safepoint"],
    shortAnswer:
      "A STW pause halts all application threads (at a safepoint) so GC can work safely. Reduce pauses by lowering allocation rate, sizing generations to avoid full GCs, setting a pause target (G1), or switching to a concurrent collector (ZGC/Shenandoah).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "STW", v: "all app threads paused at a safepoint" },
          { k: "Reduce", v: "less allocation, right-size gens" },
          { k: "G1", v: "MaxGCPauseMillis soft target" },
          { k: "Eliminate", v: "ZGC/Shenandoah concurrent collectors" },
        ],
      },
    ],
    whatIf: {
      q: "p99 latency spikes correlate exactly with full GCs — what's the fix path?",
      a: "Full GCs cause long STW pauses. First reduce them: cut allocation/retention, enlarge the heap/young gen to avoid promotion pressure, and ensure you're on G1 with a pause target. If pauses must be sub-ms regardless of heap, move to ZGC.",
    },
    realWorld:
      "GC pauses are a top cause of p99 latency spikes and request timeouts. Correlating GC logs with latency graphs is the standard way to prove (and then fix) GC-induced tail latency.",
    interviewerExpectation: ["STW = all threads paused", "safepoint", "reduce allocation/promotion", "pause target", "concurrent GC to eliminate"],
    followUps: [
      "Why does even a concurrent collector still have short STW phases?",
      "How does allocation rate drive pause frequency?",
      "What's a safepoint and time-to-safepoint?",
    ],
    commonMistakes: [
      "Treating GC pauses as unavoidable noise",
      "Increasing heap blindly (longer pauses with some collectors)",
      "Not correlating GC logs with latency",
    ],
    bestPractices: [
      "Correlate GC logs with p99 latency",
      "Reduce allocation/retention first",
      "Use concurrent collectors for strict pause SLAs",
    ],
    relatedTech: ["GC logs", "safepoints", "ZGC", "JFR/async-profiler"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google"],
    related: ["choosing-a-gc", "reading-gc-logs", "diagnosing-gc-pauses"],
  },
  {
    slug: "outofmemoryerror-types",
    categoryId: "jvm",
    topic: "Troubleshooting",
    question: "What are the different OutOfMemoryError types, and what does each tell you?",
    tags: ["outofmemoryerror", "heap space", "gc overhead", "metaspace", "direct buffer"],
    shortAnswer:
      "'Java heap space' = heap full (leak or under-sized). 'GC overhead limit exceeded' = GC runs constantly reclaiming little. 'Metaspace' = class/classloader growth. 'Direct buffer memory' = off-heap NIO/Netty. 'unable to create native thread' = too many threads / OS limit. Each points to a different area.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Java heap space", v: "heap leak / too small" },
          { k: "GC overhead limit", v: "thrashing GC, little freed" },
          { k: "Metaspace", v: "class/classloader leak" },
          { k: "Direct buffer memory", v: "off-heap (NIO/Netty)" },
          { k: "unable to create native thread", v: "thread/OS limit" },
        ],
      },
    ],
    whatIf: {
      q: "You hit 'unable to create native thread' but heap is healthy — what's wrong?",
      a: "It's not heap — you've exhausted OS threads or native memory for thread stacks (e.g. a thread leak, or ulimit/-Xss too high × many threads). Fix the thread leak / use a bounded pool, or raise the OS thread limit.",
    },
    realWorld:
      "The exact OOM message is a free diagnosis — it names the exhausted resource. Reading it correctly saves hours vs blindly bumping -Xmx (which only helps 'Java heap space').",
    interviewerExpectation: ["distinct OOM messages", "heap vs metaspace vs off-heap vs threads", "GC overhead meaning", "message-driven diagnosis"],
    followUps: [
      "Why is 'GC overhead limit exceeded' often a precursor to heap OOM?",
      "How do you cap and monitor direct (off-heap) memory?",
      "What causes 'unable to create native thread'?",
    ],
    commonMistakes: [
      "Always bumping -Xmx regardless of OOM type",
      "Ignoring off-heap/native OOMs",
      "Not enabling HeapDumpOnOutOfMemoryError",
    ],
    bestPractices: [
      "Read the OOM message to locate the area",
      "Enable -XX:+HeapDumpOnOutOfMemoryError",
      "Bound threads and off-heap buffers",
    ],
    relatedTech: ["HeapDumpOnOutOfMemoryError", "NMT", "Netty", "MAT"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Wipro"],
    related: ["heap-sizing-xms-xmx", "off-heap-direct-memory", "metaspace-vs-permgen"],
  },
  {
    slug: "reading-gc-logs",
    categoryId: "jvm",
    topic: "Troubleshooting",
    question: "How do you enable and read GC logs to diagnose a memory problem?",
    tags: ["gc logs", "unified logging", "xlog", "pause time", "allocation"],
    shortAnswer:
      "Enable unified logging: -Xlog:gc*:file=gc.log:time,uptime,level,tags (Java 9+). Look at pause durations, frequency, before/after heap per collection, and whether Old gen shrinks after a Full GC. Old gen that stays high post-Full-GC means a leak; long/frequent pauses mean tuning.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Enable", v: "-Xlog:gc* (Java 9+) / -XX:+PrintGCDetails (8)" },
          { k: "Pause", v: "duration + frequency = latency impact" },
          { k: "Heap after Full GC", v: "stays high → leak" },
          { k: "Reclaimed", v: "little freed → thrashing" },
        ],
      },
    ],
    handsOn: {
      lang: "bash",
      code: `-Xlog:gc*,gc+heap=info:file=/logs/gc.log:utctime,level,tags:filecount=5,filesize=20m
# analyze in GCeasy.io / GCViewer`,
    },
    whatIf: {
      q: "After a Full GC, used Old gen barely drops each time — what does that indicate?",
      a: "A memory leak: live (reachable) objects keep accumulating in Old gen, so Full GC can't reclaim them. The growing post-GC baseline is the signature. Next step: heap dump + MAT to find the retaining GC root.",
    },
    realWorld:
      "GC logs (free, low-overhead) are the first artifact to enable in prod. Tools like GCeasy/GCViewer turn them into pause and throughput charts that immediately reveal leaks vs tuning issues.",
    interviewerExpectation: ["-Xlog:gc* unified logging", "pause time + frequency", "post-Full-GC baseline = leak", "low reclaim = thrash", "GC analysis tools"],
    followUps: [
      "What changed about GC logging flags in Java 9?",
      "How do you tell a leak from under-sizing in the logs?",
      "How does JFR complement GC logs?",
    ],
    commonMistakes: [
      "Running prod without GC logging",
      "Looking only at pause time, not the heap-after-GC trend",
      "Using old -XX:+PrintGC flags on Java 9+",
    ],
    bestPractices: [
      "Always enable rotating GC logs in prod",
      "Track post-GC Old-gen occupancy as a leak signal",
      "Use GCeasy/GCViewer for analysis",
    ],
    relatedTech: ["-Xlog:gc", "GCeasy", "GCViewer", "JFR"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Google"],
    related: ["diagnosing-gc-pauses", "stop-the-world-gc-tuning", "outofmemoryerror-types"],
  },
  {
    slug: "reference-types",
    categoryId: "jvm",
    topic: "Garbage Collection",
    question: "Strong, weak, soft and phantom references — when do you use each?",
    tags: ["weakreference", "softreference", "phantomreference", "cache", "gc"],
    shortAnswer:
      "Strong = normal ref, never collected while reachable. Soft = cleared only under memory pressure (memory-sensitive caches). Weak = cleared at the next GC if only weakly reachable (canonicalizing maps, WeakHashMap). Phantom = post-mortem cleanup hook (replaces finalize, via Cleaner).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Strong", v: "default — keeps object alive" },
          { k: "Soft", v: "cleared under memory pressure (caches)" },
          { k: "Weak", v: "cleared next GC (WeakHashMap)" },
          { k: "Phantom", v: "cleanup after finalization (Cleaner)" },
        ],
      },
    ],
    whatIf: {
      q: "Why is a WeakHashMap good for metadata-by-key but bad as a general cache?",
      a: "Its keys are weakly referenced, so an entry vanishes once the key has no other strong reference — perfect for 'extra data about an object that should die with it'. As a value cache it's unpredictable: entries disappear the moment keys become unreferenced, regardless of usefulness.",
    },
    realWorld:
      "Soft refs for memory-sensitive caches, WeakHashMap for associating metadata with objects without preventing their collection, and PhantomReference/Cleaner for native-resource cleanup are the real uses; misusing weak/soft refs as a normal cache causes mysterious cache misses.",
    interviewerExpectation: ["four reference strengths", "soft = memory-sensitive cache", "weak = WeakHashMap/canonical maps", "phantom = Cleaner cleanup", "reachability levels"],
    followUps: [
      "How does a ReferenceQueue work with weak/phantom refs?",
      "Why prefer a real cache (Caffeine) over SoftReference caches?",
      "How does Cleaner use PhantomReference?",
    ],
    commonMistakes: [
      "Using SoftReference as a general-purpose cache",
      "Expecting WeakHashMap values to persist",
      "Relying on weak/soft refs for correctness",
    ],
    bestPractices: [
      "Use Caffeine/Guava for real caches",
      "WeakHashMap for object-associated metadata",
      "PhantomReference/Cleaner for native cleanup",
    ],
    relatedTech: ["WeakHashMap", "Cleaner", "ReferenceQueue", "Caffeine"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["gc-mark-sweep-roots", "diagnosing-gc-pauses"],
  },
  {
    slug: "jit-compilation",
    categoryId: "jvm",
    topic: "JIT",
    question: "How does JIT compilation work (C1/C2, tiered), and why is JVM warm-up a thing?",
    tags: ["jit", "c1", "c2", "tiered compilation", "warmup", "deoptimization"],
    shortAnswer:
      "The JVM starts by interpreting bytecode, profiles hot methods, then JIT-compiles them to optimized native code. Tiered compilation uses C1 (fast, light optimization) then C2 (slower, aggressive) for the hottest code. 'Warm-up' is the period before hot paths are C2-compiled — early requests are slower.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Interpret", v: "run bytecode + collect profiles" },
          { k: "C1", v: "quick compile, basic optimizations" },
          { k: "C2", v: "hottest methods, aggressive optimization" },
          { k: "Deopt", v: "fall back if an assumption breaks" },
        ],
      },
    ],
    whatIf: {
      q: "A benchmark shows the first 10k requests are slow, then it speeds up — why?",
      a: "JVM warm-up: early on, code is interpreted/C1-compiled while the JIT gathers profiles; once methods are hot, C2 produces optimized native code and throughput jumps. Always warm up before measuring — and consider this for latency SLAs after deploy/restart.",
    },
    realWorld:
      "Warm-up explains post-deploy latency blips and why benchmarks must warm up (JMH does this). For fast startup/low warm-up, teams use AOT/CDS, GraalVM native image, or keep instances warm.",
    interviewerExpectation: ["interpret → profile → JIT", "C1 vs C2 tiered", "warm-up period", "deoptimization", "JMH/warm-up in benchmarks"],
    followUps: [
      "What is deoptimization and when does it happen?",
      "How do CDS / AOT / GraalVM reduce warm-up?",
      "Why must JMH warm up before measuring?",
    ],
    commonMistakes: [
      "Benchmarking without warm-up",
      "Ignoring warm-up in latency SLAs after restart",
      "Assuming Java is 'always interpreted' or 'always native'",
    ],
    bestPractices: [
      "Warm up before measuring (use JMH)",
      "Account for warm-up in deploy/canary latency",
      "Consider CDS/native-image for fast startup needs",
    ],
    relatedTech: ["JMH", "AppCDS", "GraalVM native image", "JFR"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["escape-analysis", "bytecode-platform-independence"],
  },

  // ---------------------------------------------------------------- Hard (6)
  {
    slug: "g1-gc-internals",
    categoryId: "jvm",
    topic: "Garbage Collection",
    question: "How does G1 GC work internally — regions, mixed collections and humongous objects?",
    tags: ["g1", "regions", "mixed gc", "humongous", "pause target"],
    shortAnswer:
      "G1 divides the heap into equal-size regions dynamically tagged Eden/Survivor/Old. It collects the regions with the most garbage first ('garbage first') to meet a pause target. Mixed GCs collect young + some old regions; objects larger than half a region are 'humongous' and handled specially.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Regions", v: "heap split into equal regions" },
          { k: "Garbage-first", v: "collect highest-garbage regions" },
          { k: "Mixed GC", v: "young + selected old regions" },
          { k: "Humongous", v: "> 50% region → spans regions" },
        ],
      },
    ],
    whatIf: {
      q: "Frequent 'humongous allocation' and to-space exhaustion appear in G1 logs — what's happening?",
      a: "Large objects (> half a region) allocate directly into contiguous humongous regions, which fragment and pressure Old gen, triggering costly collections. Fix by increasing -XX:G1HeapRegionSize so those objects aren't humongous, or reducing large allocations.",
    },
    realWorld:
      "G1 is the default and usually fine, but big byte[]/buffers triggering humongous allocations is a known tuning gotcha; bumping region size or avoiding giant arrays resolves the GC pressure.",
    interviewerExpectation: ["region-based heap", "garbage-first selection", "pause target driven", "mixed collections", "humongous objects + region size"],
    followUps: [
      "How does MaxGCPauseMillis influence what G1 collects?",
      "What is a humongous allocation and why is it costly?",
      "When would you tune G1HeapRegionSize?",
    ],
    commonMistakes: [
      "Allocating huge arrays without considering humongous regions",
      "Treating G1 like a generational copying collector",
      "Setting an unrealistically low pause target",
    ],
    bestPractices: [
      "Tune G1HeapRegionSize for large-object workloads",
      "Set a realistic pause target and measure",
      "Watch for humongous allocations in GC logs",
    ],
    relatedTech: ["G1HeapRegionSize", "MaxGCPauseMillis", "GC logs"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["choosing-a-gc", "heap-generations-gc", "zgc-low-pause"],
  },
  {
    slug: "zgc-low-pause",
    categoryId: "jvm",
    topic: "Garbage Collection",
    question: "How do ZGC and Shenandoah achieve sub-millisecond pauses on huge heaps?",
    tags: ["zgc", "shenandoah", "concurrent gc", "colored pointers", "load barriers"],
    shortAnswer:
      "They do nearly all GC work — marking, relocation/compaction — concurrently with the application, using load/read barriers (and ZGC's colored pointers) so objects can move while threads run. Pause times stay sub-millisecond and roughly independent of heap size, at the cost of extra CPU/barrier overhead.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Concurrent", v: "mark + relocate while app runs" },
          { k: "Barriers", v: "load/read barriers fix up references" },
          { k: "ZGC", v: "colored pointers track relocation state" },
          { k: "Trade-off", v: "low pause, higher CPU/barrier cost" },
        ],
      },
    ],
    whatIf: {
      q: "Why are ZGC's pauses 'independent of heap size' while G1's grow with it?",
      a: "G1 still does significant STW work proportional to live data in a collection. ZGC moves marking and relocation into concurrent phases, leaving only tiny fixed STW operations (like root scanning), so a 16 GB and a 16 TB heap have similar (sub-ms) pauses.",
    },
    realWorld:
      "Latency-critical, large-heap systems (real-time bidding, big caches) adopt ZGC for predictable tail latency, accepting some throughput/CPU cost; it's production-ready and non-experimental in recent JDKs.",
    interviewerExpectation: ["concurrent mark + relocate", "load/read barriers", "colored pointers (ZGC)", "pause independent of heap", "CPU/throughput trade-off"],
    followUps: [
      "What are colored pointers and load barriers?",
      "What does ZGC trade away for low pauses?",
      "When is G1 still the better choice?",
    ],
    commonMistakes: [
      "Assuming ZGC is free (it costs CPU/throughput)",
      "Using it for small heaps where G1 is simpler",
      "Expecting zero pauses (it's sub-ms, not none)",
    ],
    bestPractices: [
      "Use ZGC/Shenandoah for large-heap low-latency needs",
      "Benchmark throughput cost before adopting",
      "Keep G1 for general workloads",
    ],
    relatedTech: ["ZGC", "Shenandoah", "load barriers", "colored pointers"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Google", "Amazon", "Microsoft"],
    related: ["choosing-a-gc", "g1-gc-internals", "stop-the-world-gc-tuning"],
  },
  {
    slug: "escape-analysis",
    categoryId: "jvm",
    topic: "JIT",
    question: "What is escape analysis, and how does it let the JVM allocate objects on the stack?",
    tags: ["escape analysis", "scalar replacement", "jit", "stack allocation", "lock elision"],
    shortAnswer:
      "Escape analysis is a JIT optimization that proves an object never 'escapes' its method/thread. If so, the JVM can scalar-replace it (no heap allocation at all), keep it on the stack, and even elide its locks — cutting GC pressure for short-lived objects.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "No escape", v: "object stays within a method" },
          { k: "Scalar replacement", v: "object → its fields in registers/stack" },
          { k: "Lock elision", v: "remove locks on non-escaping objects" },
          { k: "Effect", v: "less heap allocation & GC" },
        ],
      },
    ],
    whatIf: {
      q: "Does escape analysis mean you should worry less about creating small short-lived objects?",
      a: "Largely yes — the JIT often eliminates allocation for non-escaping temporaries via scalar replacement, so idiomatic small objects (e.g. a temporary Point) are frequently free. Premature 'object pooling' to avoid allocation is usually counterproductive on a modern JVM.",
    },
    realWorld:
      "Escape analysis is why modern Java doesn't need manual object pooling for short-lived objects, and why micro-optimizing away small allocations often hurts readability for no real gain.",
    interviewerExpectation: ["proves no escape", "scalar replacement / stack allocation", "lock elision", "reduces GC", "don't pool short-lived objects"],
    followUps: [
      "Why can escape analysis fail (object stored in a field/returned)?",
      "How does this interact with inlining?",
      "Why is object pooling often an anti-pattern now?",
    ],
    commonMistakes: [
      "Manually pooling short-lived objects 'for performance'",
      "Assuming every `new` is a heap allocation",
      "Returning/storing objects that defeat escape analysis",
    ],
    bestPractices: [
      "Write clear code; let the JIT optimize",
      "Avoid premature object pooling",
      "Profile real allocation before optimizing",
    ],
    relatedTech: ["C2 JIT", "inlining", "JFR allocation profiling"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Google", "Amazon", "Microsoft"],
    related: ["jit-compilation", "stack-vs-heap-memory"],
  },
  {
    slug: "diagnosing-gc-pauses",
    categoryId: "jvm",
    topic: "Troubleshooting",
    question: "Walk me through diagnosing long GC pauses / high GC CPU in production.",
    tags: ["gc pauses", "diagnosis", "jfr", "allocation rate", "production"],
    shortAnswer:
      "Enable GC logs + JFR. Distinguish the symptom: long individual pauses (collector/heap sizing) vs high GC frequency (excessive allocation) vs little reclaimed (leak). Find the allocation hot spots with JFR/async-profiler, fix retention/allocation, then tune the collector — measure p99 before/after.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Long pauses", v: "collector choice / heap & gen sizing" },
          { k: "Frequent GC", v: "high allocation rate" },
          { k: "Low reclaim", v: "leak — heap dump + MAT" },
          { k: "Find source", v: "JFR / async-profiler allocation flames" },
        ],
      },
    ],
    whatIf: {
      q: "GC CPU is 40% and minor GCs fire many times a second — where do you look first?",
      a: "That's an allocation-rate problem, not a heap-size one. Use a JFR allocation profile to find what's allocating so heavily (often logging, autoboxing, defensive copies, or big temporary collections), reduce it, and GC frequency drops — usually more effective than enlarging the heap.",
    },
    realWorld:
      "The most common GC fix isn't a flag — it's reducing allocation rate (cut logging churn, autoboxing, per-request large collections). JFR/async-profiler allocation flame graphs point straight at the culprit.",
    interviewerExpectation: ["classify symptom", "GC logs + JFR", "allocation rate vs heap size", "leak signature", "measure p99 before/after"],
    followUps: [
      "How do you capture an allocation flame graph?",
      "How do you tell allocation pressure from a leak?",
      "Why is reducing allocation often better than enlarging heap?",
    ],
    commonMistakes: [
      "Jumping to GC flags before profiling allocation",
      "Enlarging heap to mask high allocation rate",
      "Not separating pause length from pause frequency",
    ],
    bestPractices: [
      "Profile allocation (JFR) before tuning flags",
      "Fix retention/allocation first",
      "Validate with p99 latency, not averages",
    ],
    relatedTech: ["JFR", "async-profiler", "Eclipse MAT", "GCeasy"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft", "Deloitte"],
    related: ["reading-gc-logs", "stop-the-world-gc-tuning", "outofmemoryerror-types"],
  },
  {
    slug: "off-heap-direct-memory",
    categoryId: "jvm",
    topic: "Troubleshooting",
    question: "What is off-heap / direct memory, and how do you track and bound it?",
    tags: ["direct memory", "off-heap", "directbytebuffer", "native memory tracking", "netty"],
    shortAnswer:
      "Direct (off-heap) memory is native memory outside the GC heap, allocated via DirectByteBuffer / Unsafe (used by NIO, Netty, caches). It avoids copy/GC overhead for I/O but isn't reclaimed by normal GC — bound it with -XX:MaxDirectMemorySize and watch it via Native Memory Tracking.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Direct buffer", v: "native memory, GC-free I/O" },
          { k: "Freed when", v: "buffer's Cleaner runs (GC-triggered)" },
          { k: "Bound", v: "-XX:MaxDirectMemorySize" },
          { k: "Track", v: "Native Memory Tracking (NMT)" },
        ],
      },
    ],
    whatIf: {
      q: "Container RSS keeps climbing but heap is flat and GC is healthy — prime suspect?",
      a: "Off-heap/native growth: leaking DirectByteBuffers (Netty/NIO), mmapped files, or thread stacks. Heap metrics won't show it. Enable Native Memory Tracking (-XX:NativeMemoryTracking) and inspect with jcmd VM.native_memory to find the growing category.",
    },
    realWorld:
      "Native-memory growth with a flat heap is a notoriously hard production problem (often Netty direct buffers); NMT and jcmd are the tools that make off-heap usage visible.",
    interviewerExpectation: ["off-heap = native, not GC heap", "DirectByteBuffer/NIO/Netty", "MaxDirectMemorySize bound", "NMT/jcmd tracking", "RSS > heap symptom"],
    followUps: [
      "How is a DirectByteBuffer eventually freed?",
      "How do you read jcmd VM.native_memory output?",
      "Why does Netty pool direct buffers?",
    ],
    commonMistakes: [
      "Assuming heap metrics capture all JVM memory",
      "Not bounding MaxDirectMemorySize",
      "Ignoring native memory in container sizing",
    ],
    bestPractices: [
      "Enable NMT to see native memory",
      "Bound direct memory explicitly",
      "Budget off-heap in container limits",
    ],
    relatedTech: ["DirectByteBuffer", "Netty", "NMT", "jcmd"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["heap-sizing-xms-xmx", "outofmemoryerror-types"],
  },
  {
    slug: "classloading-delegation",
    categoryId: "jvm",
    topic: "Class Loading",
    question: "How does the class loading delegation model work, and why do enterprise apps customize it?",
    tags: ["classloader", "parent delegation", "custom classloader", "jar hell", "isolation"],
    shortAnswer:
      "By default each classloader delegates to its parent first (bootstrap → platform → application), so core classes load once and can't be spoofed. App servers and plugin systems invert or isolate this (child-first / per-module loaders) to give each app/plugin its own dependency versions and isolation.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Bootstrap", v: "core JDK classes" },
          { k: "Platform/App", v: "platform libs, then your classpath" },
          { k: "Parent-first", v: "delegate up before loading yourself" },
          { k: "Child-first", v: "app-server/plugin isolation" },
        ],
      },
    ],
    whatIf: {
      q: "Two modules need different versions of the same library ('jar hell') — how do classloaders help?",
      a: "Give each module its own (child-first) classloader so each loads its own version in isolation — the same class name can exist twice, loaded by different loaders, and they won't conflict. This is exactly how app servers, OSGi and plugin frameworks solve version clashes.",
    },
    realWorld:
      "Parent delegation prevents a malicious 'java.lang.String' from overriding the real one; child-first/isolated loaders power Tomcat web-app isolation, OSGi, and plugin architectures — and also cause the ClassLoader leaks seen on redeploy.",
    interviewerExpectation: ["bootstrap/platform/app hierarchy", "parent-first delegation + why (security/consistency)", "child-first isolation", "jar-hell / version isolation", "custom loaders"],
    followUps: [
      "Why is parent-first important for security?",
      "How does class identity = (name + classloader)?",
      "How does this connect to ClassLoader leaks on redeploy?",
    ],
    commonMistakes: [
      "Assuming a class name alone identifies a class (it's name + loader)",
      "Fighting delegation instead of isolating with a child loader",
      "Ignoring classloader identity in leak analysis",
    ],
    bestPractices: [
      "Use isolated loaders for plugins/modules",
      "Understand class identity = name + loader",
      "Clean up custom loaders to avoid leaks",
    ],
    relatedTech: ["Tomcat WebappClassLoader", "OSGi", "Java Platform Module System"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["metaspace-vs-permgen", "jvm-jre-jdk"],
  },

  // ---------------------------------------------------- CE4 additions (2026-08)
  {
    slug: "jvm-cds-appcds-startup",
    categoryId: "jvm",
    topic: "Troubleshooting",
    question: "How does Class-Data Sharing (CDS/AppCDS) cut JVM startup time, and why does it matter for containers and serverless?",
    seoTitle: "Class-Data Sharing (CDS/AppCDS) Explained: Interview Q&A | Full Stack Interview Guru",
    seoDescription:
      "How Class-Data Sharing and AppCDS cut JVM startup and reduce memory by pre-parsing class metadata into a shareable archive — and why cold-start time matters for containers and serverless Java.",
    heading: "Class-Data Sharing (CDS/AppCDS) — Interview Questions",
    tags: ["cds", "appcds", "startup time", "cold start", "containers"],
    shortAnswer:
      "Every JVM start normally has to parse and verify the bytecode of every class it loads, including java.lang.String and the rest of the core library, from scratch. Class-Data Sharing pre-parses core-library classes once into a shareable archive file that the JVM can memory-map directly on subsequent starts, skipping that parsing/verification work; AppCDS extends the same mechanism to your own application and third-party library classes. The practical payoff is faster startup and lower memory (the archive can be shared across JVM processes on the same machine) — which matters far more for short-lived containers and serverless functions, where startup time is a direct cost, than for a long-running server where a slower start is a one-time, amortized expense.",
    mindMap: [
      { type: "text", content: "CDS attacks a cost that's easy to overlook when you're used to long-running servers: **class loading and verification is real, repeated work** the JVM redoes on every single process start, for the same core classes every time. A pre-built, memory-mapped archive turns that repeated parse into a fast mmap." },
      {
        type: "kv",
        rows: [
          { k: "CDS (base)", v: "Shares core JDK class metadata via a pre-built archive" },
          { k: "AppCDS", v: "Extends sharing to your app + library classes" },
          { k: "Dynamic CDS", v: "Auto-generates the app archive at JVM exit — less manual setup" },
          { k: "Matters most for", v: "Containers/serverless — many short-lived JVM starts" },
        ],
      },
      { type: "text", content: "**Key takeaway:** CDS is a startup/memory optimization, not a throughput one — it doesn't make a long-running service faster once it's warmed up, it makes getting to 'started' faster and cheaper, which is exactly the cost that dominates in scale-to-zero, per-request-cold-start environments." },
    ],
    handsOn: {
      lang: "bash",
      code: `# Dynamic CDS (JDK 13+): generate an app-class archive automatically at exit
java -XX:ArchiveClassesAtExit=app-cds.jsa -jar app.jar

# Reuse the archive on subsequent starts for faster startup
java -XX:SharedArchiveFile=app-cds.jsa -jar app.jar

# Base CDS is on by default in modern JDKs for core classes;
# AppCDS/dynamic CDS is what you opt into for your own application classes.`,
    },
    whatIf: {
      q: "Does CDS help a long-running microservice the same way it helps a serverless function?",
      a: "It still shaves real time off startup either way, but the impact is proportionally much smaller for a service that runs for hours or days — the one-time startup cost is amortized. For a serverless function or an autoscaling pod that starts fresh per invocation or per scale-up event, that same fixed startup cost is paid repeatedly and directly affects cold-start latency and cost.",
    },
    realWorld:
      "Teams moving Java workloads to Lambda, Cloud Run, or Kubernetes with aggressive autoscaling specifically chase startup time because it's on the critical path for user-facing latency (cold start) or billed compute time — CDS/AppCDS is one of the lower-effort levers available before reaching for heavier options like GraalVM Native Image, and Spring Boot's own CDS support exists precisely because of this pressure.",
    guruTake:
      "I'd frame CDS as 'the JVM startup optimization you get for a config flag, before you consider Native Image.' It's a good sign of practical cloud-native Java awareness if a candidate brings it up unprompted when discussing container startup latency.",
    interviewerExpectation: [
      "Explains CDS pre-parses/shares class metadata to skip repeated work",
      "Distinguishes base CDS (JDK classes) from AppCDS (app classes)",
      "Connects the benefit specifically to startup time, not steady-state throughput",
      "Names containers/serverless as the environments where this matters most",
    ],
    followUps: [
      "How does dynamic CDS differ from the older, more manual AppCDS workflow?",
      "How does CDS compare to GraalVM Native Image for solving the same cold-start problem?",
      "Why can a CDS archive be shared in memory across multiple JVM processes on the same host?",
    ],
    commonMistakes: [
      "Assuming CDS speeds up steady-state throughput, not just startup",
      "Not knowing the difference between base CDS and AppCDS",
      "Overlooking CDS in favor of jumping straight to Native Image",
    ],
    bestPractices: [
      "Enable dynamic CDS for app classes on startup-sensitive deployments",
      "Measure actual cold-start improvement before adding complexity",
      "Consider CDS before reaching for Native Image's larger trade-offs",
    ],
    relatedTech: ["GraalVM", "jlink", "Spring Boot"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google"],
    related: ["jdk-jre-jvm-internals", "graalvm-native-image-tradeoffs"],
  },
  {
    slug: "graalvm-native-image-tradeoffs",
    categoryId: "jvm",
    topic: "JIT",
    question: "GraalVM Native Image vs a jlink'd JVM runtime — what do you actually give up for instant startup?",
    seoTitle: "GraalVM Native Image Trade-offs: Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "GraalVM Native Image AOT compilation vs a jlink'd JVM: instant startup and lower memory vs no JIT warm-up ceiling, closed-world reflection limits, and longer build times.",
    heading: "GraalVM Native Image Trade-offs — Interview Questions",
    tags: ["graalvm", "native image", "aot", "jit", "reflection"],
    shortAnswer:
      "Native Image ahead-of-time compiles your application and a closed-world analysis of everything it can prove is reachable into a standalone native executable — no JVM startup, no class loading, no JIT warm-up, so it starts in milliseconds and uses less memory. The trade-off is real: the closed-world assumption means reflection, dynamic class loading, and JNI have to be explicitly configured (or they silently fail at runtime, not compile time), build times are much longer, and because there's no JIT profiling hot paths at runtime, peak throughput after a long warm-up can be lower than a traditional JVM that's had time to tier up to C2-optimized code.",
    mindMap: [
      { type: "text", content: "The JIT's advantage is that it optimizes based on **actual runtime behavior** — which branches are hot, which types actually show up at a call site. Native Image's AOT compilation has to make those decisions at build time with only static analysis, which is why it trades away the JIT's peak-throughput ceiling for the startup speed a JIT can never match." },
      {
        type: "kv",
        rows: [
          { k: "Startup", v: "Native Image: milliseconds. JVM (even jlink'd): still has JIT warm-up" },
          { k: "Peak throughput", v: "JVM/JIT usually wins after sufficient warm-up" },
          { k: "Reflection/dynamic loading", v: "Must be explicitly configured for Native Image (closed-world)" },
          { k: "Build time", v: "Native Image builds are significantly slower than a normal compile" },
        ],
      },
      { type: "text", content: "**Key takeaway:** Native Image isn't strictly 'better' — it's a different point on the startup-vs-peak-throughput curve, and the closed-world reflection constraint is a real engineering cost, not a footnote, for any codebase leaning on Spring/Jackson-style runtime reflection." },
    ],
    handsOn: {
      lang: "bash",
      code: `# Build a native executable (requires GraalVM + native-image tool)
native-image -jar app.jar

# Reflection needs explicit configuration or it fails at runtime, not compile time
native-image -H:ReflectionConfigurationFiles=reflect-config.json -jar app.jar

# Frameworks like Spring Boot 3 / Quarkus generate this config automatically
# at build time via their own native-image support`,
    },
    whatIf: {
      q: "Why would reflection that works fine on a normal JVM silently fail in a Native Image build?",
      a: "Native Image performs a closed-world static analysis at build time to decide exactly which classes/methods to include in the executable — anything reached only through reflection (a class name built from a string, a Jackson deserializer discovered dynamically) isn't visible to that analysis unless you explicitly declare it in a reflection-config file, so it's simply missing from the binary and throws at runtime instead of failing to compile.",
    },
    realWorld:
      "This is exactly why Spring Boot 3+ and Quarkus invested heavily in Native Image support — they generate the required reflection/resource configuration automatically from framework metadata, because hand-writing it for a typical Spring app's dependency-injection and serialization reflection usage would be impractical. Teams evaluating Native Image for cold-start-sensitive deployments (serverless, fast-autoscaling pods) need a framework with that tooling, not just GraalVM itself.",
    guruTake:
      "I'd position it as: Native Image is the right call when startup latency is directly on the user- or cost-critical path and the framework has mature native support — otherwise a jlink'd runtime with CDS gets you most of the startup win with far less build complexity and no closed-world reflection tax.",
    interviewerExpectation: [
      "Explains AOT vs JIT and the resulting startup-vs-peak-throughput trade-off",
      "Knows the closed-world assumption and its reflection/dynamic-loading implications",
      "Mentions framework-level native support (Spring Boot, Quarkus) as a practical requirement",
      "Doesn't present Native Image as a strictly superior replacement for the JVM",
    ],
    followUps: [
      "How do Spring Boot and Quarkus generate the reflection configuration automatically?",
      "Why might a long-running, high-throughput service actually be worse off on Native Image?",
      "How does Native Image's approach compare to CDS for solving cold-start?",
    ],
    commonMistakes: [
      "Assuming Native Image is a drop-in replacement with no trade-offs",
      "Not accounting for reflection-config maintenance overhead",
      "Ignoring the peak-throughput difference for long-running services",
    ],
    bestPractices: [
      "Reach for Native Image when startup latency is genuinely on the critical path",
      "Rely on framework-generated reflection config rather than hand-writing it",
      "Benchmark peak throughput, not just startup, before committing",
    ],
    relatedTech: ["Spring Boot", "Quarkus", "CDS"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Oracle"],
    related: ["jvm-cds-appcds-startup", "jdk-jre-jvm-internals"],
  },
  {
    slug: "jmh-microbenchmarking-pitfalls",
    categoryId: "jvm",
    topic: "JIT",
    question: "Why does timing a loop with System.currentTimeMillis() lie to you, and how does JMH avoid those traps?",
    seoTitle: "JMH Microbenchmarking Pitfalls: Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Why hand-rolled Java micro-benchmarks lie: JIT warm-up, dead-code elimination, and constant folding — and how JMH's forking, warm-up iterations and blackholes produce trustworthy numbers.",
    heading: "JMH Microbenchmarking Pitfalls — Interview Questions",
    tags: ["jmh", "microbenchmark", "jit warmup", "dead code elimination", "performance"],
    shortAnswer:
      "A hand-written loop timed with System.currentTimeMillis() gets skewed by at least three JIT-related effects: the code runs interpreted or under low-tier C1 compilation for the first many iterations before C2 kicks in, so early iterations are much slower than steady-state; the JIT can eliminate 'dead' code whose result is never used, silently benchmarking nothing; and constant folding can pre-compute a result at compile time if inputs look constant to the optimizer, again measuring nothing real. JMH (Java Microbenchmark Harness) exists specifically to defeat these: it runs dedicated warm-up iterations before measuring, forks a fresh JVM process per benchmark to avoid cross-benchmark JIT pollution, and uses Blackhole to consume results so the JIT can't optimize the 'unused' computation away.",
    mindMap: [
      { type: "text", content: "The core problem is that **modern JVMs are adaptive optimizers**, and a naive timing loop measures the optimizer warming up, not the code's steady-state cost — plus the optimizer is smart enough to delete work it can prove is pointless, which a benchmark's whole purpose is to avoid." },
      {
        type: "kv",
        rows: [
          { k: "JIT warm-up", v: "Early iterations run interpreted/C1 — much slower than C2 steady-state" },
          { k: "Dead-code elimination", v: "Unused results get optimized away — you benchmark nothing" },
          { k: "Constant folding", v: "Compile-time-constant-looking inputs get pre-computed away" },
          { k: "JMH's fix", v: "Warm-up iterations, forked JVMs, Blackhole to consume results" },
        ],
      },
      { type: "text", content: "**Key takeaway:** 'I benchmarked it and it's faster' is only credible with a methodology that accounts for JIT warm-up and prevents dead-code elimination — naming JMH by name, and why it's needed, is what separates a real performance claim from a guess." },
    ],
    handsOn: {
      lang: "java",
      code: `@Benchmark
@Warmup(iterations = 5)
@Measurement(iterations = 5)
@Fork(1)
public void stringConcat(Blackhole bh) {
    String result = "a" + "b" + counter++;
    bh.consume(result);   // prevents dead-code elimination of "result"
}

// Naive (misleading) alternative:
long start = System.currentTimeMillis();
for (int i = 0; i < 1_000_000; i++) {
    String s = "a" + "b" + i;   // JIT may eliminate this — result is unused
}
long elapsed = System.currentTimeMillis() - start; // measures ~nothing reliable`,
    },
    whatIf: {
      q: "If you just print the result inside the loop, does that fix dead-code elimination?",
      a: "It helps but isn't sufficient or standardized — printing has its own I/O overhead that pollutes the measurement, and the JIT can still optimize surrounding code in ways a manual loop doesn't control for. Blackhole.consume() is specifically designed to force the JIT to treat the value as used without the side effects of real I/O, which is why JMH is the accepted standard rather than ad-hoc print statements.",
    },
    realWorld:
      "This comes up whenever a PR claims a performance improvement backed only by 'I timed it before and after with System.currentTimeMillis()' — without JMH, that claim could easily be measuring JIT warm-up noise, dead-code elimination artifacts, or just JVM-to-JVM variance, and a careful reviewer will ask for a JMH benchmark before trusting a performance-motivated code change, especially one that trades off readability for speed.",
    guruTake:
      "If someone shows me a 'proof' with a manual timing loop, my first question is whether the JIT could have eliminated the work being measured — it's not pedantry, it's the single most common way well-intentioned benchmarks lie. I'd reach for JMH before making any performance claim I actually plan to defend.",
    interviewerExpectation: [
      "Names JIT warm-up as a source of skew in naive timing",
      "Explains dead-code elimination and constant folding as measurement risks",
      "Knows JMH's mitigations: warm-up iterations, forking, Blackhole",
      "Treats unverified performance claims with appropriate skepticism",
    ],
    followUps: [
      "Why does JMH fork a separate JVM process per benchmark instead of running them all in one?",
      "What does Blackhole.consume() actually do to prevent dead-code elimination?",
      "How would you benchmark code that has side effects, where JMH's isolation doesn't neatly apply?",
    ],
    commonMistakes: [
      "Trusting a System.currentTimeMillis() loop as a real performance measurement",
      "Not accounting for JIT warm-up before measuring",
      "Writing benchmark code whose result is never consumed, inviting dead-code elimination",
    ],
    bestPractices: [
      "Use JMH for any performance claim meant to be trusted or defended",
      "Always include warm-up iterations before measuring",
      "Consume benchmark results (Blackhole) to prevent the JIT from eliminating them",
    ],
    relatedTech: ["JIT", "Escape Analysis", "Tiered Compilation"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Oracle"],
    related: ["jit-compilation", "stream-pipeline-vs-loop-hot-path"],
  },
  {
    slug: "diagnosing-high-cpu-production-jvm",
    categoryId: "jvm",
    topic: "Troubleshooting",
    question: "A Java service is pegging CPU with no errors logged — how do you find out why?",
    seoTitle: "Diagnosing High CPU in Production Java (JFR/async-profiler) | Full Stack Interview Guru",
    seoDescription:
      "A practical, tool-by-tool method for diagnosing high CPU in a production JVM: distinguishing hot application code, GC overhead, and lock contention using async-profiler flame graphs and JFR.",
    heading: "Diagnosing High CPU in Production Java — Interview Questions",
    tags: ["cpu profiling", "async-profiler", "jfr", "flame graph", "production troubleshooting"],
    shortAnswer:
      "High CPU with no errors means the JVM is legitimately busy doing something — the diagnostic job is figuring out whether that something is your application's hot code, garbage collection, or threads spinning on lock contention, because each has a completely different fix. The modern, low-overhead approach is a CPU flame graph from async-profiler (or JDK Flight Recorder, which ships in the JDK itself) taken directly against the running production process — it samples native and Java stack frames together and renders where CPU time is actually going, which is far more reliable than guessing from a thread dump alone.",
    mindMap: [
      { type: "text", content: "'High CPU' isn't one problem — it's a symptom with **at least three different root causes** that look identical from a CPU graph alone: your own code doing real (or wasteful) work, the GC running more than expected, or threads burning cycles spinning on a contended lock instead of blocking. A flame graph is how you tell them apart without guessing." },
      {
        type: "kv",
        rows: [
          { k: "Hot application code", v: "Flame graph shows wide bars in your own method stacks" },
          { k: "GC overhead", v: "Wide bars in GC threads/frames — points to heap/allocation tuning" },
          { k: "Lock contention", v: "Threads spinning/blocked — pair CPU profile with thread dumps" },
          { k: "Tools", v: "async-profiler (flame graphs), JFR (built into the JDK), jstack" },
        ],
      },
      { type: "text", content: "**Key takeaway:** the methodology matters more than any single tool — capture a CPU profile first to see WHERE the cycles go (app code vs GC vs lock spin), then drill into that specific area, rather than starting with a thread dump and guessing." },
    ],
    handsOn: {
      lang: "bash",
      code: `# async-profiler: attach to a running JVM, produce a CPU flame graph
./profiler.sh -d 30 -f cpu-profile.html <pid>

# Or use JDK Flight Recorder — built into the JDK, low overhead, safe for prod
jcmd <pid> JFR.start duration=60s filename=recording.jfr
jcmd <pid> JFR.dump filename=recording.jfr

# Open recording.jfr in JDK Mission Control to see CPU, GC and lock-contention views`,
    },
    whatIf: {
      q: "What if the flame graph shows most CPU time inside JVM/GC frames rather than your own code?",
      a: "That points you toward GC tuning rather than application code — check the allocation rate (are you creating far more short-lived objects than expected?), the collector's pause/CPU behavior, and heap sizing, using the same diagnostic path as a dedicated GC-pause investigation rather than treating it as an application logic bug.",
    },
    realWorld:
      "This is a standard on-call runbook step at companies running JVM services at scale: CPU alerts fire, and instead of guessing, the responder pulls a 30-60 second async-profiler or JFR CPU profile directly from the affected pod/instance — safe to do in production because both tools are designed for low overhead — and the flame graph usually points immediately at either a specific hot method, an unexpectedly GC-heavy period, or a lock a thread dump can then confirm.",
    guruTake:
      "My answer to 'how do you debug high CPU' is never 'add print statements and redeploy' — it's 'take a profile of the process that's actually having the problem, right now, in production, with a tool built for that.' That distinction — profiling live instead of trying to reproduce locally — is usually what separates a senior answer here.",
    interviewerExpectation: [
      "Distinguishes hot code, GC overhead, and lock contention as separate causes",
      "Names async-profiler and/or JFR as the tools, not just 'add logging'",
      "Knows these tools are low-overhead enough for production use",
      "Describes a methodology (profile first, then drill in), not a single trick",
    ],
    followUps: [
      "How does async-profiler capture native frames that a pure-Java profiler would miss?",
      "How would you distinguish GC-caused CPU from application-caused CPU in a flame graph?",
      "What's the difference between a CPU profile and a wall-clock (latency) profile?",
    ],
    commonMistakes: [
      "Jumping straight to a thread dump without a CPU profile for context",
      "Assuming high CPU always means inefficient application code",
      "Avoiding profiling tools in production due to overhead concerns that don't apply to modern low-overhead profilers",
    ],
    bestPractices: [
      "Take a CPU flame graph (async-profiler or JFR) as the first diagnostic step",
      "Correlate CPU profiles with thread dumps for lock-contention cases",
      "Use JFR for its built-in, always-available low overhead in production",
    ],
    relatedTech: ["JDK Mission Control", "jstack", "async-profiler"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "Deloitte"],
    related: ["diagnosing-gc-pauses", "thread-dump-diagnosis", "reading-gc-logs"],
  },
  {
    slug: "lambda-stream-closure-memory-leak",
    categoryId: "jvm",
    topic: "Troubleshooting",
    question: "How can a Stream or lambda closure quietly leak memory in a long-lived cache?",
    seoTitle: "Lambda/Stream Closure Memory Leaks: Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "How a lambda's captured variables can keep a large object graph reachable far longer than intended in caches, callback registries, and CompletableFuture chains — with a fix pattern.",
    heading: "Lambda & Stream Closure Memory Leaks — Interview Questions",
    tags: ["lambda", "closure", "memory leak", "cache", "gc roots"],
    shortAnswer:
      "A Java lambda captures the effectively-final local variables it references by holding a reference to them inside the generated implementation object — if that lambda is itself long-lived (stored in a cache, registered as a callback, held by a CompletableFuture chain that hasn't completed), everything it captured stays reachable from a GC-roots perspective for exactly as long as the lambda does, even if the capturing method returned long ago. The classic leak shape is a lambda that only needed one small field off a large object but captured the whole object (or 'this') by reference, keeping the entire object graph alive.",
    mindMap: [
      { type: "text", content: "A lambda isn't magic — it's a generated object with fields for whatever it captured, same as an old-school anonymous inner class. **Capturing 'this' or a large object when you only need one small piece of it** is the same mistake as any other object holding a reference longer than necessary — lambdas just make it easy to do without noticing." },
      {
        type: "kv",
        rows: [
          { k: "What's captured", v: "Effectively-final locals referenced inside the lambda body" },
          { k: "Leak shape", v: "Long-lived lambda (cache, callback, pending future) capturing a large/rooted object" },
          { k: "Common trigger", v: "Capturing 'this' inside an instance method for one small field" },
          { k: "Fix", v: "Capture only the specific value needed, not the enclosing object" },
        ],
      },
      { type: "text", content: "**Key takeaway:** ask 'how long does this lambda live, and what does it hold onto?' the same way you'd ask it about any object reference — closures don't get a free pass from normal Java reachability rules." },
    ],
    handsOn: {
      lang: "java",
      code: `class ReportService {
    private final byte[] largeTemplateBuffer = loadTemplate();  // several MB

    // LEAK: captures 'this' (and therefore largeTemplateBuffer) just to read one field
    Runnable buildCallback(String reportId) {
        return () -> logger.info("Report {} done, template size {}", reportId, largeTemplateBuffer.length);
    }
    // If this Runnable ends up in a long-lived callback registry, largeTemplateBuffer
    // — and the whole ReportService instance — stays reachable indefinitely.

    // FIX: capture only what's actually needed
    Runnable buildCallbackFixed(String reportId) {
        int templateSize = largeTemplateBuffer.length;   // capture a primitive, not 'this'
        return () -> logger.info("Report {} done, template size {}", reportId, templateSize);
    }
}`,
    },
    whatIf: {
      q: "Does this apply to Stream pipelines the same way it applies to a stored Runnable/Callback?",
      a: "A Stream pipeline's lambdas are typically short-lived — created and consumed within one pipeline execution — so they rarely leak on their own. The risk is specifically when a lambda (whether it came from a Stream pipeline or not) is stored somewhere long-lived: a cache value, a static callback registry, or a CompletableFuture that's still pending, because that's what extends the captured references' lifetime beyond the enclosing method call.",
    },
    realWorld:
      "This is a genuinely hard leak to spot in a heap dump at first — the dominator tree shows a huge retained-size object, and tracing back through 'referenced by a Runnable, referenced by an event-bus subscriber list' eventually leads to a lambda that captured way more than it needed. Event-driven and reactive codebases (subscriber registries, pending CompletableFuture chains that never complete) are especially prone to this because 'register a callback and forget about it' is the exact pattern that creates it.",
    guruTake:
      "When I review code registering a lambda as a long-lived callback, I specifically check what it closes over — if it's capturing 'this' or a large object just for convenience, I'll ask whether it actually needs the whole thing or just one value, because that's the difference between a clean callback and a slow leak nobody notices until a heap dump six months later.",
    interviewerExpectation: [
      "Explains that lambdas capture references, same as any object field",
      "Identifies long-lived storage (cache/callback registry/pending future) as the actual leak trigger",
      "Recognizes 'capturing this for one field' as the classic mistake",
      "Suggests capturing minimal state instead of the enclosing object",
    ],
    followUps: [
      "How would you find this kind of leak in a heap dump using the dominator tree?",
      "Does this differ between a lambda and an equivalent anonymous inner class?",
      "How does this relate to ThreadLocal-based memory leaks in a thread pool?",
    ],
    commonMistakes: [
      "Capturing 'this' or a large object for a single field's worth of data",
      "Registering long-lived callbacks without considering what they retain",
      "Assuming lambdas are exempt from normal Java reachability/GC rules",
    ],
    bestPractices: [
      "Capture the minimal specific value a long-lived lambda needs",
      "Audit callback/subscriber registries for what their lambdas close over",
      "Use a heap dump's dominator tree to trace unexpectedly large retained sizes back to a capturing lambda",
    ],
    relatedTech: ["Eclipse MAT", "GC Roots", "Event Bus"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft"],
    related: ["threadlocal-memory-leak", "java-memory-leak-diagnosis"],
  },
];
