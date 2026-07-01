import type { Question } from "../types";

/**
 * Multithreading — flagship expansion batch (20 questions).
 * Enterprise & product-company patterns: threads & pools, locks, the Java Memory
 * Model, deadlocks, atomics/CAS, async composition, and production thread-dump
 * diagnosis. (Conceptual basics like synchronization/threads/virtual-threads live
 * in the Advanced Java batch; these are distinct, deeper questions.)
 *
 * Difficulty mix: 4 Easy · 10 Medium · 6 Hard. Ordered easy → hard.
 */
export const multithreadingExtra: Question[] = [
  // ---------------------------------------------------------------- Easy (4)
  {
    slug: "runnable-vs-callable-future",
    categoryId: "multithreading",
    topic: "Threads & Pools",
    question: "Runnable vs Callable vs Future — how do you run a task and get its result back?",
    tags: ["runnable", "callable", "future", "executorservice"],
    shortAnswer:
      "Runnable.run() returns void and can't throw checked exceptions. Callable.call() returns a value and can throw. Submit either to an ExecutorService; submit(Callable) returns a Future whose get() blocks until the result (or an ExecutionException wrapping the task's failure) is ready.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Runnable", v: "void run(), no checked exceptions" },
          { k: "Callable<T>", v: "T call() throws Exception" },
          { k: "Future<T>", v: "handle to a pending result; get() blocks" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `ExecutorService ex = Executors.newFixedThreadPool(4);
Future<Integer> f = ex.submit(() -> compute()); // Callable
Integer result = f.get();   // blocks until done`,
    },
    whatIf: {
      q: "Your task threw an exception but nothing was logged — why, and where did it go?",
      a: "For submit(), the exception is captured inside the Future and only surfaces (wrapped in ExecutionException) when you call get(). If you never call get(), it's silently swallowed. execute(Runnable) instead routes it to the thread's UncaughtExceptionHandler.",
    },
    realWorld:
      "Parallelizing independent calls (fan-out to several services) uses submit(Callable) + Future.get with a timeout; forgetting to call get() is a classic way exceptions vanish in async code.",
    interviewerExpectation: ["return value vs void", "checked exceptions", "Future.get blocks", "ExecutionException wrapping", "submit vs execute"],
    followUps: [
      "How do you add a timeout to Future.get()?",
      "How does CompletableFuture improve on Future?",
      "Where do exceptions go for execute() vs submit()?",
    ],
    commonMistakes: [
      "Never calling get(), so exceptions disappear",
      "Blocking on get() without a timeout",
      "Using Runnable when you need a result",
    ],
    bestPractices: [
      "Use Callable + Future.get(timeout) for results",
      "Prefer CompletableFuture for composition",
      "Always handle ExecutionException",
    ],
    relatedTech: ["ExecutorService", "CompletableFuture", "Future.get timeout"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Cognizant", "Accenture"],
    related: ["executorservice-thread-pools", "completablefuture-async"],
  },
  {
    slug: "thread-start-vs-run",
    categoryId: "multithreading",
    topic: "Threads & Pools",
    question: "What's the difference between calling thread.start() and thread.run()?",
    tags: ["thread", "start", "run", "concurrency basics"],
    shortAnswer:
      "start() creates a new OS thread and the JVM calls run() on it. Calling run() directly just executes the code on the CURRENT thread — no concurrency at all. It's a classic interview trap and a real bug.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "start()", v: "new thread → runs run() concurrently" },
          { k: "run()", v: "plain method call on current thread" },
          { k: "start() twice", v: "IllegalThreadStateException" },
        ],
      },
    ],
    whatIf: {
      q: "Code calls run() expecting parallelism but everything executes sequentially — why?",
      a: "Because run() is just a method call — no new thread is created, so the work runs on the calling thread in order. Only start() hands the run() body to a fresh thread for concurrent execution.",
    },
    realWorld:
      "A subtle production bug: someone 'starts' background work with run() and it silently blocks the request thread instead of running async — no error, just lost parallelism.",
    interviewerExpectation: ["start spawns a thread", "run is a direct call", "no concurrency with run()", "can't start() twice"],
    followUps: [
      "What happens if you call start() twice on the same Thread?",
      "Why prefer ExecutorService over new Thread().start()?",
      "How does the JVM map a Java thread to an OS thread?",
    ],
    commonMistakes: [
      "Calling run() expecting a new thread",
      "Reusing a Thread object (calling start twice)",
      "Creating raw threads instead of using a pool",
    ],
    bestPractices: [
      "Use ExecutorService instead of raw Thread",
      "Never call run() directly to 'start' work",
      "Name your threads for easier debugging",
    ],
    relatedTech: ["Thread", "ExecutorService", "Runnable"],
    difficulty: "Easy",
    experience: ["0-2 years"],
    askedIn: ["TCS", "Infosys", "Wipro", "Capgemini"],
    related: ["runnable-vs-callable-future", "executorservice-thread-pools"],
  },
  {
    slug: "thread-lifecycle-states",
    categoryId: "multithreading",
    topic: "Threads & Pools",
    question: "Walk through the thread lifecycle states — and which one signals a problem in a thread dump?",
    tags: ["thread states", "lifecycle", "blocked", "waiting", "thread dump"],
    shortAnswer:
      "NEW → RUNNABLE → (BLOCKED / WAITING / TIMED_WAITING) → TERMINATED. In a thread dump, lots of BLOCKED threads point to lock contention; many WAITING threads on the same monitor can indicate a missed notify or a stuck downstream call.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "RUNNABLE", v: "running or ready (incl. on-CPU I/O)" },
          { k: "BLOCKED", v: "waiting to acquire a monitor lock" },
          { k: "WAITING", v: "wait()/join()/park() — no timeout" },
          { k: "TIMED_WAITING", v: "sleep()/wait(ms)/await(ms)" },
        ],
      },
    ],
    whatIf: {
      q: "A thread dump shows dozens of threads BLOCKED on the same lock — what does that mean?",
      a: "They're all queued to enter a synchronized block held by one thread. That's lock contention — the holder is slow (or stuck on I/O), serializing everyone behind it. Find the lock owner and reduce the critical section or switch to a finer-grained lock.",
    },
    realWorld:
      "Reading thread states in a jstack dump is the first triage step for latency incidents: BLOCKED clusters = contention, WAITING clusters = a stalled dependency or deadlock.",
    interviewerExpectation: ["the 5 states", "BLOCKED = monitor contention", "WAITING vs TIMED_WAITING", "RUNNABLE includes I/O", "thread-dump reading"],
    followUps: [
      "Why can a thread doing socket I/O show as RUNNABLE?",
      "How do you find which thread holds the lock others are blocked on?",
      "What's the difference between BLOCKED and WAITING?",
    ],
    commonMistakes: [
      "Thinking RUNNABLE means actively using CPU",
      "Confusing BLOCKED (lock) with WAITING (wait/join)",
      "Ignoring thread states during incident triage",
    ],
    bestPractices: [
      "Capture 2–3 thread dumps a few seconds apart",
      "Correlate BLOCKED threads to the lock owner",
      "Name threads so dumps are readable",
    ],
    relatedTech: ["jstack", "Thread.State", "async-profiler"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Cognizant", "Accenture", "Deloitte", "Amazon"],
    related: ["thread-dump-diagnosis", "deadlock-prevention"],
  },
  {
    slug: "sleep-vs-wait",
    categoryId: "multithreading",
    topic: "Locks",
    question: "Thread.sleep() vs Object.wait() — what's the real difference?",
    tags: ["sleep", "wait", "notify", "monitor", "lock"],
    shortAnswer:
      "sleep() pauses the thread and KEEPS any locks it holds; it's a static Thread method. wait() RELEASES the monitor lock and parks the thread until notify()/notifyAll(); it must be called inside a synchronized block on that monitor.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "sleep(ms)", v: "keeps locks, timed, Thread static" },
          { k: "wait()", v: "releases monitor, needs synchronized" },
          { k: "wake-up", v: "sleep: time; wait: notify/notifyAll" },
        ],
      },
    ],
    whatIf: {
      q: "Calling wait() throws IllegalMonitorStateException — why?",
      a: "wait()/notify() must be called while holding the object's monitor (inside synchronized(obj)). Calling wait() without owning the monitor throws IllegalMonitorStateException — the JVM enforces that you hold the lock you're releasing.",
    },
    realWorld:
      "Holding a lock during sleep() is a frequent cause of contention (everyone waits while you nap); wait()/notify() is the low-level primitive behind guarded blocks and blocking queues.",
    interviewerExpectation: ["sleep keeps lock, wait releases", "wait needs synchronized", "notify/notifyAll wake-up", "IllegalMonitorStateException"],
    followUps: [
      "Why must wait() be in a while-loop, not an if?",
      "notify() vs notifyAll() — when each?",
      "Why hold a lock during sleep() a bad idea?",
    ],
    commonMistakes: [
      "Holding a lock across sleep()",
      "Calling wait() outside synchronized",
      "Using if instead of while around wait() (spurious wakeups)",
    ],
    bestPractices: [
      "Guard wait() with a while-loop condition",
      "Prefer high-level utilities (BlockingQueue, locks/conditions)",
      "Never sleep while holding a contended lock",
    ],
    relatedTech: ["wait/notify", "BlockingQueue", "Condition"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture"],
    related: ["wait-notify-guarded-blocks", "reentrantlock-vs-synchronized"],
  },

  // -------------------------------------------------------------- Medium (10)
  {
    slug: "volatile-visibility",
    categoryId: "multithreading",
    topic: "volatile & Memory Model",
    question: "What does the volatile keyword guarantee, and what does it NOT?",
    tags: ["volatile", "visibility", "happens-before", "memory model", "atomicity"],
    shortAnswer:
      "volatile guarantees visibility (every read sees the latest write) and ordering (no reordering across the access) via happens-before. It does NOT make compound operations like count++ atomic — for that use Atomic classes or locks.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Guarantees", v: "visibility + ordering (happens-before)" },
          { k: "Does NOT", v: "make count++ atomic" },
          { k: "Use for", v: "flags (running), safe publication" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `private volatile boolean running = true; // visible to all threads
public void stop() { running = false; }
public void loop() { while (running) { /* ... */ } }`,
    },
    whatIf: {
      q: "A worker loop never stops after you flip a non-volatile boolean from another thread — why?",
      a: "Without volatile, the JVM/JIT may cache the flag in a register, so the worker never sees the update — it loops forever. Marking the flag volatile forces a fresh read from main memory each iteration.",
    },
    realWorld:
      "The volatile stop-flag is the canonical fix for 'my background thread won't shut down'; misusing volatile for counters (count++) is a classic lost-update bug.",
    interviewerExpectation: ["visibility + ordering", "not atomic for compound ops", "happens-before", "stop-flag use case", "Atomic for increments"],
    followUps: [
      "Why isn't volatile enough for a counter?",
      "What is the happens-before relationship?",
      "How does volatile enable safe publication?",
    ],
    commonMistakes: [
      "Using volatile for count++ (not atomic)",
      "Assuming volatile is a substitute for locking",
      "Forgetting volatile on a cross-thread flag",
    ],
    bestPractices: [
      "volatile for flags / single-writer publication",
      "Atomic*/locks for read-modify-write",
      "Reason in terms of happens-before",
    ],
    relatedTech: ["AtomicInteger", "java.util.concurrent", "Java Memory Model"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["java-memory-model", "atomic-cas", "double-checked-locking"],
  },
  {
    slug: "executorservice-thread-pools",
    categoryId: "multithreading",
    topic: "Threads & Pools",
    question: "Why use an ExecutorService instead of new Thread(), and which pool type do you pick?",
    tags: ["executorservice", "thread pool", "executors", "newfixedthreadpool"],
    shortAnswer:
      "Pools reuse threads (creating threads is expensive), bound concurrency, and decouple task submission from execution. Pick fixed pools for CPU-bound work (size ≈ cores), bounded pools for I/O — and avoid Executors.newCachedThreadPool / newFixedThreadPool defaults in prod due to unbounded queues/threads.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "fixed", v: "CPU-bound, size ≈ #cores" },
          { k: "cached", v: "unbounded threads — risky" },
          { k: "single", v: "serialize tasks" },
          { k: "Prefer", v: "explicit ThreadPoolExecutor" },
        ],
      },
    ],
    whatIf: {
      q: "Why do many teams ban Executors.newFixedThreadPool / newCachedThreadPool in production?",
      a: "newFixedThreadPool uses an UNBOUNDED LinkedBlockingQueue (tasks pile up → OOM), and newCachedThreadPool can spawn unbounded threads under load. Teams build a ThreadPoolExecutor with an explicit bounded queue and rejection policy instead.",
    },
    realWorld:
      "Almost every service uses a configured ThreadPoolExecutor (or framework-managed pool) with bounded queues so a traffic spike degrades gracefully (rejections) instead of OOM-ing.",
    interviewerExpectation: ["thread reuse", "bounded concurrency", "fixed for CPU / pool sizing", "unbounded-queue OOM risk", "explicit ThreadPoolExecutor"],
    followUps: [
      "How do you size a pool for I/O-bound vs CPU-bound work?",
      "What queue + rejection policy do you choose?",
      "How do you shut a pool down cleanly?",
    ],
    commonMistakes: [
      "Using new Thread() per task",
      "newFixedThreadPool with unbounded queue in prod",
      "Never calling shutdown()",
    ],
    bestPractices: [
      "Configure ThreadPoolExecutor with a bounded queue",
      "Size pools to workload (CPU vs I/O)",
      "shutdown()/awaitTermination on stop",
    ],
    relatedTech: ["ThreadPoolExecutor", "Executors", "BlockingQueue"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Cognizant", "Wipro"],
    related: ["threadpoolexecutor-tuning", "runnable-vs-callable-future"],
  },
  {
    slug: "threadpoolexecutor-tuning",
    categoryId: "multithreading",
    topic: "Threads & Pools",
    question: "How do corePoolSize, maxPoolSize, the queue and rejection policy interact in ThreadPoolExecutor?",
    tags: ["threadpoolexecutor", "tuning", "rejectedexecutionhandler", "queue"],
    shortAnswer:
      "Tasks first fill core threads, THEN the queue, and only when the queue is full are threads grown to max — finally the RejectedExecutionHandler fires. A common surprise: with an unbounded queue, max is never reached because the queue never fills.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "1. core threads", v: "created up to corePoolSize" },
          { k: "2. queue", v: "tasks queued until full" },
          { k: "3. max threads", v: "grow core→max once queue full" },
          { k: "4. reject", v: "RejectedExecutionHandler" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `new ThreadPoolExecutor(
    10, 50,                       // core, max
    60, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(1000), // BOUNDED
    new ThreadPoolExecutor.CallerRunsPolicy()); // backpressure`,
    },
    whatIf: {
      q: "You set maxPoolSize=100 but only ever see 10 threads under heavy load — why?",
      a: "Because your queue is unbounded (or huge): the pool only grows past corePoolSize when the queue is FULL. With an unbounded queue the queue never fills, so threads never exceed core. Use a bounded queue to actually reach maxPoolSize.",
    },
    realWorld:
      "The 'max threads never used' gotcha trips many teams; pairing a bounded queue with CallerRunsPolicy gives natural backpressure (the submitter runs the task) instead of unbounded growth.",
    interviewerExpectation: ["core→queue→max ordering", "unbounded queue defeats max", "rejection handlers", "CallerRunsPolicy backpressure", "keepAlive"],
    followUps: [
      "What do the four built-in rejection policies do?",
      "How does CallerRunsPolicy create backpressure?",
      "When would you allowCoreThreadTimeOut?",
    ],
    commonMistakes: [
      "Expecting maxPoolSize to engage with an unbounded queue",
      "Using AbortPolicy and not handling rejections",
      "Oversized pools causing context-switch thrash",
    ],
    bestPractices: [
      "Use a bounded queue sized to your latency budget",
      "Pick a rejection policy intentionally (often CallerRuns)",
      "Monitor queue depth and active count",
    ],
    relatedTech: ["ThreadPoolExecutor", "ArrayBlockingQueue", "Micrometer"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Deloitte"],
    related: ["executorservice-thread-pools", "completablefuture-async"],
  },
  {
    slug: "wait-notify-guarded-blocks",
    categoryId: "multithreading",
    topic: "Locks",
    question: "Why must wait() always be called in a while-loop, not an if?",
    tags: ["wait", "notify", "guarded block", "spurious wakeup", "condition"],
    shortAnswer:
      "Because of spurious wakeups and the gap between notify and re-acquiring the lock: a thread can wake when the condition is still false. A while-loop re-checks the condition after waking; an if would proceed on a false assumption.",
    mindMap: [
      { type: "text", content: "Pattern: `synchronized(lock){ while(!ready) lock.wait(); /* act */ }`. The **while** re-tests `ready` every wake-up — guarding against spurious wakeups and another thread changing state between notify and reacquire." },
    ],
    handsOn: {
      lang: "java",
      code: `synchronized (lock) {
    while (!ready) {     // NOT if
        lock.wait();
    }
    consume();
}`,
    },
    whatIf: {
      q: "notify() vs notifyAll() — when is notify() unsafe?",
      a: "notify() wakes one arbitrary waiter. If waiters are waiting on different conditions (e.g. mixed producers/consumers on one lock), it may wake the 'wrong' one, which re-waits — and the right thread never runs (a missed-signal lockup). notifyAll() is safer unless you've proven all waiters are equivalent.",
    },
    realWorld:
      "Hand-rolled wait/notify is error-prone; most code should use BlockingQueue or Lock/Condition. But interviewers probe the while-loop rule to test memory-model understanding.",
    interviewerExpectation: ["spurious wakeups", "condition re-check", "while not if", "notify vs notifyAll", "missed signal"],
    followUps: [
      "What is a missed-signal (lost wakeup) bug?",
      "How do Lock + Condition improve on wait/notify?",
      "Why prefer BlockingQueue over hand-rolled wait/notify?",
    ],
    commonMistakes: [
      "Using if instead of while",
      "notify() when waiters have different conditions",
      "Calling wait/notify without holding the monitor",
    ],
    bestPractices: [
      "Always guard with a while-loop condition",
      "Prefer notifyAll() unless proven safe",
      "Use higher-level concurrency utilities",
    ],
    relatedTech: ["Lock/Condition", "BlockingQueue", "CountDownLatch"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["sleep-vs-wait", "reentrantlock-vs-synchronized"],
  },
  {
    slug: "reentrantlock-vs-synchronized",
    categoryId: "multithreading",
    topic: "Locks",
    question: "ReentrantLock vs synchronized — when do you reach for the explicit lock?",
    tags: ["reentrantlock", "synchronized", "trylock", "fairness", "condition"],
    shortAnswer:
      "synchronized is simpler and auto-released. ReentrantLock adds tryLock (with timeout), interruptible locking, fairness, and multiple Conditions — use it when you need those; otherwise prefer synchronized. Always unlock() in finally.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "synchronized", v: "simple, auto-release, no timeout" },
          { k: "ReentrantLock", v: "tryLock, timeout, interruptible, fair" },
          { k: "Conditions", v: "multiple wait-sets per lock" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `if (lock.tryLock(2, TimeUnit.SECONDS)) {
    try { criticalSection(); }
    finally { lock.unlock(); } // MUST unlock in finally
} else {
    // couldn't acquire in time → fail fast / fallback
}`,
    },
    whatIf: {
      q: "Why is tryLock(timeout) a useful tool against deadlock?",
      a: "Instead of blocking forever to acquire a lock (risking deadlock), tryLock with a timeout lets a thread give up, back off, release any locks it holds, and retry — breaking potential deadlock cycles and enabling graceful degradation.",
    },
    realWorld:
      "tryLock with timeout is used for lock-ordering-resistant code and to fail fast under contention (e.g. 'couldn't get the lock in 200ms → return 503') instead of piling up blocked threads.",
    interviewerExpectation: ["tryLock/timeout/interruptible", "fairness option", "multiple Conditions", "unlock in finally", "prefer synchronized when simple"],
    followUps: [
      "What does lock fairness cost in throughput?",
      "How do ReadWriteLock / StampedLock differ?",
      "Why must unlock() be in a finally block?",
    ],
    commonMistakes: [
      "Forgetting unlock() in finally (permanent lock)",
      "Using ReentrantLock where synchronized suffices",
      "Enabling fairness and tanking throughput unnecessarily",
    ],
    bestPractices: [
      "unlock() in finally, always",
      "Use synchronized unless you need Lock features",
      "Consider ReadWriteLock/StampedLock for read-heavy data",
    ],
    relatedTech: ["ReadWriteLock", "StampedLock", "Condition"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google"],
    related: ["deadlock-prevention", "wait-notify-guarded-blocks"],
  },
  {
    slug: "deadlock-prevention",
    categoryId: "multithreading",
    topic: "Deadlocks",
    question: "What causes a deadlock, and how do you prevent it in a real codebase?",
    tags: ["deadlock", "lock ordering", "trylock", "concurrency", "production"],
    shortAnswer:
      "Deadlock needs four conditions (mutual exclusion, hold-and-wait, no preemption, circular wait). The practical fix is to break circular wait with a global lock-ordering convention; tryLock-with-timeout and reducing lock scope also help.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Cause", v: "two threads lock A,B in opposite order" },
          { k: "Fix #1", v: "consistent global lock ordering" },
          { k: "Fix #2", v: "tryLock with timeout + backoff" },
          { k: "Fix #3", v: "shrink/avoid nested locks" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `// Always lock accounts in id order → no circular wait
Account first  = a.id() < b.id() ? a : b;
Account second = a.id() < b.id() ? b : a;
synchronized (first) { synchronized (second) { transfer(a, b); } }`,
    },
    whatIf: {
      q: "How do you confirm a deadlock in production?",
      a: "Take a thread dump (jstack) — the JVM explicitly reports 'Found one Java-level deadlock' and lists the threads and the locks each holds/waits-for, showing the cycle. ThreadMXBean.findDeadlockedThreads() can detect it programmatically too.",
    },
    realWorld:
      "The money-transfer 'lock both accounts' example is the textbook deadlock; the standard fix — order locks by a stable key (account id) — appears throughout real banking/ledger code.",
    interviewerExpectation: ["four Coffman conditions", "circular wait", "global lock ordering", "tryLock timeout", "thread-dump deadlock detection"],
    followUps: [
      "How does the JVM detect deadlocks in a thread dump?",
      "How does tryLock break a potential deadlock?",
      "What's the difference between deadlock and livelock?",
    ],
    commonMistakes: [
      "Acquiring multiple locks in inconsistent order",
      "Holding locks across external/blocking calls",
      "Large nested critical sections",
    ],
    bestPractices: [
      "Define and enforce a global lock order",
      "Prefer tryLock with timeout for multi-lock code",
      "Keep critical sections small; avoid I/O under locks",
    ],
    relatedTech: ["jstack", "ThreadMXBean", "ReentrantLock"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Goldman-style banking"],
    related: ["thread-dump-diagnosis", "livelock-starvation", "reentrantlock-vs-synchronized"],
  },
  {
    slug: "completablefuture-async",
    categoryId: "multithreading",
    topic: "CompletableFuture",
    question: "How does CompletableFuture let you compose async calls without blocking?",
    tags: ["completablefuture", "async", "thencompose", "allof", "non-blocking"],
    shortAnswer:
      "CompletableFuture chains stages (thenApply/thenCompose/thenCombine) and runs callbacks when results arrive — no get() blocking. Use allOf to fan-in parallel calls, supplyAsync(..., executor) to control the pool, and exceptionally/handle for errors.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "thenApply", v: "transform result (sync fn)" },
          { k: "thenCompose", v: "chain another async call (flatMap)" },
          { k: "thenCombine", v: "join two independent futures" },
          { k: "allOf", v: "wait for many in parallel" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `CompletableFuture<User> u = supplyAsync(() -> userSvc.get(id), pool);
CompletableFuture<Cart> c = supplyAsync(() -> cartSvc.get(id), pool);
u.thenCombine(c, Dashboard::new)
 .exceptionally(ex -> Dashboard.fallback());`,
    },
    whatIf: {
      q: "Why pass your own Executor to supplyAsync instead of the default?",
      a: "Without an executor, CompletableFuture uses the common ForkJoinPool — shared JVM-wide and sized to CPU cores. Blocking I/O on it starves parallel streams and other CFs. Supply a dedicated bounded pool for I/O-bound async work.",
    },
    realWorld:
      "Aggregating several microservice calls into one response (user + cart + recommendations in parallel) is the canonical CompletableFuture use; the common-pool starvation gotcha bites teams that forget the executor arg.",
    interviewerExpectation: ["non-blocking composition", "thenApply/Compose/Combine", "allOf fan-in", "custom executor vs common pool", "exceptionally/handle"],
    followUps: [
      "thenApply vs thenCompose — when each?",
      "Why is the common ForkJoinPool risky for blocking I/O?",
      "How do you add a timeout (orTimeout) to a stage?",
    ],
    commonMistakes: [
      "Calling join()/get() and re-blocking",
      "Running blocking I/O on the common pool",
      "No error handling stage (silent failures)",
    ],
    bestPractices: [
      "Supply a dedicated executor for I/O",
      "Compose with thenCompose/thenCombine, not nested gets",
      "Add exceptionally/handle and orTimeout",
    ],
    relatedTech: ["ForkJoinPool", "ExecutorService", "Reactor/WebFlux"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google"],
    related: ["forkjoinpool-work-stealing", "executorservice-thread-pools"],
  },
  {
    slug: "atomic-cas",
    categoryId: "multithreading",
    topic: "Atomics",
    question: "How do Atomic classes achieve thread-safety without locks (CAS)?",
    tags: ["atomicinteger", "cas", "compare-and-swap", "lock-free", "aba"],
    shortAnswer:
      "Atomics use compare-and-swap (CAS): read the value, compute the new one, and atomically swap only if it hasn't changed — retrying in a loop on failure. It's lock-free and fast under low contention, but can spin under high contention and is subject to the ABA problem.",
    mindMap: [
      { type: "text", content: "CAS = a CPU instruction: *'set X to new ONLY if X still equals expected'*. No lock, no blocking — just a retry loop. AtomicInteger.incrementAndGet is a CAS loop." },
    ],
    handsOn: {
      lang: "java",
      code: `AtomicInteger seq = new AtomicInteger();
int id = seq.incrementAndGet();   // lock-free CAS loop

// custom CAS update
seq.updateAndGet(v -> v < MAX ? v + 1 : 0);`,
    },
    whatIf: {
      q: "What is the ABA problem and how do you handle it?",
      a: "A value changes A→B→A; CAS sees 'still A' and succeeds, missing the intermediate change — dangerous for structures like lock-free stacks. AtomicStampedReference adds a version stamp so CAS also checks the stamp, detecting the A→B→A transition.",
    },
    realWorld:
      "Atomics back sequence generators, counters, and lock-free data structures. Under very high contention, AtomicLong is replaced by LongAdder (striping) to avoid CAS-retry spin.",
    interviewerExpectation: ["CAS read-compute-swap-retry", "lock-free", "ABA problem", "AtomicStampedReference", "LongAdder under contention"],
    followUps: [
      "Why does AtomicLong degrade under heavy contention?",
      "How does AtomicReference enable lock-free structures?",
      "What's the difference between getAndIncrement and updateAndGet?",
    ],
    commonMistakes: [
      "Assuming CAS never spins",
      "Ignoring ABA in lock-free designs",
      "Using AtomicLong for extreme write contention",
    ],
    bestPractices: [
      "Use Atomics for simple lock-free counters/flags",
      "LongAdder for high-contention counters",
      "AtomicStampedReference where ABA matters",
    ],
    relatedTech: ["AtomicInteger", "LongAdder", "AtomicStampedReference", "VarHandle"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["volatile-visibility", "false-sharing"],
  },
  {
    slug: "latch-barrier-semaphore",
    categoryId: "multithreading",
    topic: "Locks",
    question: "CountDownLatch vs CyclicBarrier vs Semaphore — which coordination tool when?",
    tags: ["countdownlatch", "cyclicbarrier", "semaphore", "coordination"],
    shortAnswer:
      "CountDownLatch: one-shot 'wait for N events' (can't reset). CyclicBarrier: N threads wait for each other, reusable each round. Semaphore: limits concurrent access to N permits (rate/resource limiting).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "CountDownLatch", v: "wait for N to finish, one-shot" },
          { k: "CyclicBarrier", v: "N threads rendezvous, reusable" },
          { k: "Semaphore", v: "N permits — throttle concurrency" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `Semaphore permits = new Semaphore(10); // max 10 concurrent calls
permits.acquire();
try { callRateLimitedApi(); }
finally { permits.release(); }`,
    },
    whatIf: {
      q: "You need to throttle calls to a downstream API to 10 concurrent — which tool?",
      a: "A Semaphore with 10 permits: each thread acquire()s before calling and release()s after (in finally). It bounds in-flight requests to protect the dependency — a simple bulkhead / concurrency limiter.",
    },
    realWorld:
      "CountDownLatch coordinates 'wait until all warm-up tasks complete'; Semaphore implements bulkheads/rate limits to protect fragile downstreams; CyclicBarrier is common in phased simulations/tests.",
    interviewerExpectation: ["one-shot vs reusable", "latch waits for events", "barrier = mutual rendezvous", "semaphore = permits/throttle"],
    followUps: [
      "Why can't a CountDownLatch be reused?",
      "How would you build a bulkhead with a Semaphore?",
      "What does CyclicBarrier's barrier action do?",
    ],
    commonMistakes: [
      "Using a latch where you need reuse (need barrier)",
      "Forgetting to release() a semaphore permit",
      "Confusing barrier (mutual) with latch (one-way)",
    ],
    bestPractices: [
      "release() permits in finally",
      "Pick the tool by reuse + direction of waiting",
      "Prefer library limiters (Resilience4j) for production throttling",
    ],
    relatedTech: ["Semaphore", "CountDownLatch", "Resilience4j bulkhead"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["deadlock-prevention", "completablefuture-async"],
  },
  {
    slug: "race-condition-check-then-act",
    categoryId: "multithreading",
    topic: "volatile & Memory Model",
    question: "What is a check-then-act race condition, and how do you fix it correctly?",
    tags: ["race condition", "check-then-act", "atomicity", "putifabsent"],
    shortAnswer:
      "Check-then-act (e.g. 'if not present, put') is two steps that aren't atomic — two threads both pass the check and both act, causing duplicates/lost updates. Fix with an atomic compound operation (putIfAbsent, computeIfAbsent, compareAndSet) or a lock.",
    mindMap: [
      { type: "text", content: "`if (!map.containsKey(k)) map.put(k, v);` — two threads can both see 'absent' and both put. The check and the act must be **one atomic step**." },
    ],
    handsOn: {
      lang: "java",
      code: `// BAD: check-then-act race
if (!cache.containsKey(k)) cache.put(k, load(k));

// GOOD: atomic
cache.computeIfAbsent(k, this::load);`,
    },
    whatIf: {
      q: "A lazy-init cache occasionally loads the same key twice under load — root cause?",
      a: "Classic check-then-act race: two threads find the key absent and both call the expensive load(). computeIfAbsent makes the check-and-insert atomic per key, so load() runs once — and on ConcurrentHashMap it's done under the bin lock.",
    },
    realWorld:
      "Duplicate inserts, double-charging, and 'singleton created twice' bugs are almost always non-atomic check-then-act; the fix is an atomic method or a unique DB constraint as a backstop.",
    interviewerExpectation: ["compound op not atomic", "two threads pass the check", "putIfAbsent/computeIfAbsent/compareAndSet", "lost update/duplicate"],
    followUps: [
      "Why isn't synchronizedMap enough for check-then-act?",
      "How does computeIfAbsent guarantee single execution?",
      "How do DB unique constraints act as a safety net?",
    ],
    commonMistakes: [
      "containsKey then put on a shared map",
      "get-then-put for increments",
      "Assuming synchronizedMap makes compound ops atomic",
    ],
    bestPractices: [
      "Use atomic compound operations",
      "Back critical invariants with DB constraints",
      "Make lazy init idempotent",
    ],
    relatedTech: ["ConcurrentHashMap", "AtomicReference.compareAndSet", "DB unique index"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Deloitte", "Cognizant"],
    related: ["atomic-cas", "double-checked-locking"],
  },

  // ---------------------------------------------------------------- Hard (6)
  {
    slug: "java-memory-model",
    categoryId: "multithreading",
    topic: "volatile & Memory Model",
    question: "What is the Java Memory Model and the happens-before relationship?",
    tags: ["jmm", "happens-before", "reordering", "visibility", "memory model"],
    shortAnswer:
      "The JMM defines when one thread's writes become visible to another, allowing the compiler/CPU to reorder operations for speed. happens-before is the ordering guarantee: if A happens-before B, A's effects are visible to B. volatile, locks, thread start/join, and final fields establish it.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "unlock → lock", v: "same monitor establishes h-b" },
          { k: "volatile write → read", v: "publishes prior writes" },
          { k: "Thread.start", v: "h-b everything in the new thread" },
          { k: "Thread.join", v: "joined thread's writes visible after" },
        ],
      },
    ],
    whatIf: {
      q: "Why can a correctly-looking program print stale or impossible values without synchronization?",
      a: "Without a happens-before edge, the JIT/CPU may reorder writes and cache values in registers, so another thread sees stale or out-of-order data. Synchronization (volatile/locks) inserts the memory barriers that forbid those reorderings.",
    },
    realWorld:
      "The JMM is why 'it works on my machine' concurrency bugs appear only under load or on different CPUs — reordering is legal until you establish happens-before with proper synchronization.",
    interviewerExpectation: ["reordering allowed", "happens-before edges", "volatile/locks/start/join/final", "visibility vs atomicity", "memory barriers"],
    followUps: [
      "How do final fields get safe-publication guarantees?",
      "What memory barriers does a volatile write insert?",
      "Why is double-checked locking broken without volatile?",
    ],
    commonMistakes: [
      "Assuming sequential consistency without synchronization",
      "Relying on timing instead of happens-before",
      "Unsafe publication of partially-constructed objects",
    ],
    bestPractices: [
      "Establish happens-before via volatile/locks for shared data",
      "Use final fields / immutability for safe publication",
      "Prefer java.util.concurrent over hand-rolled sync",
    ],
    relatedTech: ["volatile", "final fields", "VarHandle", "JCStress"],
    references: [{ label: "JSR-133 (Java Memory Model) FAQ", url: "https://www.cs.umd.edu/~pugh/java/memoryModel/jsr-133-faq.html" }],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["volatile-visibility", "double-checked-locking", "false-sharing"],
  },
  {
    slug: "double-checked-locking",
    categoryId: "multithreading",
    topic: "Locks",
    question: "Why did the double-checked locking singleton need volatile to be correct?",
    tags: ["double-checked locking", "volatile", "singleton", "safe publication", "reordering"],
    shortAnswer:
      "Object construction isn't atomic: the JIT can publish the reference BEFORE the constructor finishes. Without volatile, a second thread can see a non-null but partially-constructed instance. Marking the field volatile forbids that reordering and ensures safe publication.",
    mindMap: [
      { type: "text", content: "`instance = new Singleton()` is really: allocate → construct → assign. Reordering can make the assign visible before construct completes → another thread sees a half-built object. volatile blocks the reorder." },
    ],
    handsOn: {
      lang: "java",
      code: `private static volatile Singleton inst; // volatile is essential
static Singleton get() {
    if (inst == null) {
        synchronized (Singleton.class) {
            if (inst == null) inst = new Singleton();
        }
    }
    return inst;
}`,
    },
    whatIf: {
      q: "Is there a simpler correct lazy singleton that avoids this subtlety?",
      a: "Yes — the initialization-on-demand holder idiom: a private static holder class whose static field is the instance. The JVM's class-init guarantees lazy, thread-safe, single creation with no locking or volatile. An enum singleton is also safe.",
    },
    realWorld:
      "DCL is a favorite hard interview question because it exposes deep memory-model understanding; in practice teams use the holder idiom or enum, or a DI container, rather than hand-written DCL.",
    interviewerExpectation: ["non-atomic construction", "reordering publishes early", "volatile prevents partial publication", "holder idiom / enum alternative"],
    followUps: [
      "How does the holder idiom guarantee thread safety?",
      "Why is an enum the most robust singleton?",
      "What changed in the Java 5 memory model to make DCL fixable?",
    ],
    commonMistakes: [
      "Omitting volatile on the instance field",
      "Hand-rolling DCL instead of using the holder idiom",
      "Assuming object construction is atomic",
    ],
    bestPractices: [
      "Prefer the holder idiom or enum singleton",
      "If using DCL, the field MUST be volatile",
      "Let a DI framework manage singletons",
    ],
    relatedTech: ["holder idiom", "enum singleton", "Spring beans"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google"],
    related: ["java-memory-model", "volatile-visibility"],
  },
  {
    slug: "false-sharing",
    categoryId: "multithreading",
    topic: "Atomics",
    question: "What is false sharing, and how does it silently kill multi-threaded throughput?",
    tags: ["false sharing", "cache line", "contended", "performance", "cpu cache"],
    shortAnswer:
      "CPUs move memory in ~64-byte cache lines. If two threads update different variables that sit on the SAME line, each write invalidates the other's cached line — so independent variables ping-pong between cores. Fix with padding or @Contended.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Cache line", v: "~64 bytes moved as a unit" },
          { k: "Problem", v: "2 hot vars share one line → invalidation" },
          { k: "Fix", v: "padding / @jdk.internal.vm.annotation.Contended" },
        ],
      },
    ],
    whatIf: {
      q: "How does LongAdder relate to false sharing?",
      a: "LongAdder spreads counts across multiple Cell objects, and those cells are @Contended-padded so each sits on its own cache line. That avoids both CAS contention AND false sharing — which is why it scales far better than a single AtomicLong.",
    },
    realWorld:
      "False sharing is an invisible scalability killer in hot concurrent counters and ring buffers; high-performance libraries (LMAX Disruptor, JDK LongAdder) pad fields to cache-line boundaries specifically to avoid it.",
    interviewerExpectation: ["cache line ~64B", "independent vars same line → invalidation", "padding / @Contended", "LongAdder/Disruptor examples"],
    followUps: [
      "How do you measure/confirm false sharing?",
      "How does the LMAX Disruptor avoid it?",
      "Why is @Contended internal/guarded by a flag?",
    ],
    commonMistakes: [
      "Packing hot per-thread counters into one object",
      "Assuming independent fields can't contend",
      "Optimizing without measuring cache effects",
    ],
    bestPractices: [
      "Use LongAdder for hot counters (padded for you)",
      "Pad/@Contended only proven-hot fields",
      "Profile with perf / async-profiler before padding",
    ],
    relatedTech: ["LongAdder", "@Contended", "LMAX Disruptor", "async-profiler"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Google", "Amazon", "Microsoft"],
    related: ["atomic-cas", "java-memory-model"],
  },
  {
    slug: "livelock-starvation",
    categoryId: "multithreading",
    topic: "Deadlocks",
    question: "Deadlock vs livelock vs starvation — how do you tell them apart and fix each?",
    tags: ["livelock", "starvation", "deadlock", "fairness", "backoff"],
    shortAnswer:
      "Deadlock: threads block forever in a cycle (no progress, no CPU). Livelock: threads keep responding to each other and changing state but make no progress (busy, high CPU). Starvation: a thread never gets scheduled/the lock. Fixes: lock ordering, randomized backoff, and fairness respectively.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Deadlock", v: "stuck blocked, 0% CPU — break the cycle" },
          { k: "Livelock", v: "active but no progress — add backoff/jitter" },
          { k: "Starvation", v: "never scheduled — use fairness/priority" },
        ],
      },
    ],
    whatIf: {
      q: "Threads are at 100% CPU but throughput is zero and no deadlock is reported — what is it?",
      a: "Likely livelock: threads keep retrying/yielding in response to each other (e.g. both back off and retry in lockstep) so they never make progress. Add randomized/exponential backoff so they desynchronize, or impose ordering.",
    },
    realWorld:
      "Retry storms and politely-yielding lock-acquisition loops cause livelock; starvation shows up under unfair locks where one thread monopolizes a resource. Backoff-with-jitter and fairness are the standard cures.",
    interviewerExpectation: ["blocked vs busy", "deadlock cycle", "livelock no-progress", "starvation scheduling", "backoff/jitter/fairness fixes"],
    followUps: [
      "How does exponential backoff with jitter break livelock?",
      "How do fair locks prevent starvation (and what do they cost)?",
      "How do you distinguish these in a thread dump + CPU profile?",
    ],
    commonMistakes: [
      "Treating livelock as deadlock (different fix)",
      "Retrying without backoff (retry storms)",
      "Ignoring fairness for hot shared resources",
    ],
    bestPractices: [
      "Backoff with jitter on contention/retry",
      "Use fair locks/queues where starvation is a risk",
      "Correlate CPU usage with progress to classify",
    ],
    relatedTech: ["ReentrantLock(fair)", "exponential backoff", "Resilience4j retry"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["deadlock-prevention", "thread-dump-diagnosis"],
  },
  {
    slug: "forkjoinpool-work-stealing",
    categoryId: "multithreading",
    topic: "Threads & Pools",
    question: "How does ForkJoinPool's work-stealing work, and what's the parallel-stream pitfall?",
    tags: ["forkjoinpool", "work-stealing", "parallel stream", "common pool"],
    shortAnswer:
      "ForkJoinPool splits tasks recursively (fork) and idle worker threads steal subtasks from the tails of busy workers' deques — keeping cores busy. The pitfall: parallel streams use the shared common pool sized to cores, so blocking I/O inside them starves the whole JVM.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "fork/join", v: "recursive divide & conquer" },
          { k: "work-stealing", v: "idle workers steal from busy deques" },
          { k: "Pitfall", v: "parallelStream uses shared common pool" },
        ],
      },
    ],
    whatIf: {
      q: "A parallel stream doing remote calls makes the whole app's parallel work stall — why?",
      a: "parallelStream() runs on the common ForkJoinPool (≈ #cores threads, JVM-wide). Blocking calls inside it tie up those few threads, starving every other parallel stream/CompletableFuture. Use a dedicated pool (submit the stream to your own ForkJoinPool) or don't parallelize blocking I/O.",
    },
    realWorld:
      "Parallel streams are great for CPU-bound in-memory work but a trap for I/O; the common-pool starvation incident is well-known. Heavy concurrent I/O belongs on a dedicated bounded pool or reactive stack.",
    interviewerExpectation: ["recursive fork/join", "work-stealing deques", "common pool sizing", "blocking I/O starvation", "dedicated pool fix"],
    followUps: [
      "How do you run a parallel stream on a custom pool?",
      "When is parallelStream actually worth it?",
      "How does work-stealing differ from a fixed thread pool?",
    ],
    commonMistakes: [
      "Blocking I/O inside parallel streams",
      "Assuming parallelStream always speeds things up",
      "Saturating the shared common pool",
    ],
    bestPractices: [
      "Parallelize CPU-bound, in-memory work only",
      "Use a dedicated ForkJoinPool for isolation",
      "Measure — parallelism has overhead",
    ],
    relatedTech: ["ForkJoinPool", "parallel streams", "Reactor"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["completablefuture-async", "executorservice-thread-pools"],
  },
  {
    slug: "thread-dump-diagnosis",
    categoryId: "multithreading",
    topic: "Deadlocks",
    question: "How do you diagnose high latency or a hang from a production thread dump?",
    tags: ["thread dump", "jstack", "contention", "diagnosis", "production"],
    shortAnswer:
      "Capture 2–3 dumps a few seconds apart (jstack/jcmd). Look for: a deadlock section, clusters of BLOCKED threads (find the lock owner), many threads stuck in the same stack frame (slow dependency), and threads that don't move between dumps (hung). Correlate with CPU to separate busy from blocked.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Deadlock", v: "JVM prints it explicitly" },
          { k: "BLOCKED cluster", v: "lock contention → find owner" },
          { k: "Same frame x many", v: "slow downstream call" },
          { k: "No movement", v: "hung thread" },
        ],
      },
    ],
    handsOn: {
      lang: "bash",
      code: `jcmd <pid> Thread.print > dump1.txt    # repeat x3, ~5s apart
# or
jstack -l <pid> > dump1.txt
# analyze in fastThread.io / look for BLOCKED + lock owners`,
    },
    whatIf: {
      q: "Threads are RUNNABLE in a socketRead but latency is high — bug in your app?",
      a: "Not necessarily your CPU — a thread blocked in native socketRead shows as RUNNABLE. Many threads parked there means a slow/unresponsive downstream (DB, API). The fix is timeouts, connection-pool tuning, and circuit breakers, not app threading.",
    },
    realWorld:
      "Thread dumps are the #1 tool for 'the app is slow/hung' incidents: they reveal deadlocks, lock contention hotspots, and threads piled up waiting on a slow database or API — often pointing outside your code.",
    interviewerExpectation: ["multiple dumps over time", "deadlock section", "BLOCKED → lock owner", "socketRead shows RUNNABLE", "correlate with CPU"],
    followUps: [
      "Why take several dumps instead of one?",
      "How do you find the thread holding a contended lock?",
      "What does a thread parked in socketRead tell you?",
    ],
    commonMistakes: [
      "Taking a single dump (no movement comparison)",
      "Assuming RUNNABLE means CPU-bound",
      "Not capturing CPU usage alongside",
    ],
    bestPractices: [
      "Take 2–3 timed dumps + a CPU sample",
      "Trace BLOCKED threads to the lock owner",
      "Add timeouts/circuit breakers for slow dependencies",
    ],
    relatedTech: ["jstack", "jcmd", "async-profiler", "fastThread.io"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Google"],
    related: ["thread-lifecycle-states", "deadlock-prevention", "livelock-starvation"],
  },
];
