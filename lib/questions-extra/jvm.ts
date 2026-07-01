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
];
