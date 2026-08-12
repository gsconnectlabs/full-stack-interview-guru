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

  // ---------------------------------------------------- CE4 additions (2026-08)
  {
    slug: "stampedlock-optimistic-reads",
    categoryId: "multithreading",
    topic: "Locks",
    question: "When would you reach for StampedLock's optimistic locking over ReentrantReadWriteLock?",
    seoTitle: "StampedLock Optimistic Reads: Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "StampedLock's optimistic read mode vs ReentrantReadWriteLock: how the stamp/validate() pattern avoids taking a lock at all for the common case, and its non-reentrant trade-offs.",
    heading: "StampedLock Optimistic Reads — Interview Questions",
    tags: ["stampedlock", "optimistic locking", "reentrantreadwritelock", "concurrency"],
    shortAnswer:
      "ReentrantReadWriteLock lets multiple readers proceed concurrently but still requires every reader to acquire and release an actual lock, which costs coordination even when writes are rare. StampedLock adds a third mode — optimistic read — where a reader takes a stamp, reads the data without blocking anyone, and then calls validate(stamp) to check whether a writer interleaved; if validation fails, it falls back to a real read lock and retries. For read-heavy, write-rare data, this avoids lock acquisition overhead entirely in the common case, at the cost of StampedLock being non-reentrant and considerably trickier to use correctly.",
    mindMap: [
      { type: "text", content: "Optimistic reads bet that **nothing changes during the read** and only pay the cost of verifying that bet, not the cost of preventing writes outright. It's the same philosophy as optimistic concurrency control in databases, applied to an in-memory lock." },
      {
        type: "kv",
        rows: [
          { k: "ReentrantReadWriteLock", v: "Readers always acquire a real (shared) lock" },
          { k: "StampedLock optimistic", v: "Read without locking, then validate(stamp) after" },
          { k: "Validation fails", v: "Fall back to a real readLock() and re-read" },
          { k: "Trade-off", v: "Not reentrant; easy to misuse; no Condition support" },
        ],
      },
      { type: "text", content: "**Key takeaway:** StampedLock trades ReentrantReadWriteLock's simplicity for lower read-path overhead — only reach for it once profiling shows read-lock acquisition itself is the bottleneck on a hot, read-dominated path." },
    ],
    handsOn: {
      lang: "java",
      code: `class Point {
    private double x, y;
    private final StampedLock lock = new StampedLock();

    double distanceFromOrigin() {
        long stamp = lock.tryOptimisticRead();       // no blocking, no lock taken
        double curX = x, curY = y;                    // read without synchronization
        if (!lock.validate(stamp)) {                   // did a writer interleave?
            stamp = lock.readLock();                    // fall back to a real lock
            try { curX = x; curY = y; }
            finally { lock.unlockRead(stamp); }
        }
        return Math.sqrt(curX * curX + curY * curY);
    }

    void move(double dx, double dy) {
        long stamp = lock.writeLock();
        try { x += dx; y += dy; }
        finally { lock.unlockWrite(stamp); }
    }
}`,
    },
    whatIf: {
      q: "Why is StampedLock non-reentrant, and what breaks if you call writeLock() twice on the same thread?",
      a: "StampedLock trades reentrancy for a lighter-weight stamp-based implementation — calling writeLock() again from a thread that already holds it will deadlock, since the lock has no concept of 'the same thread already owns this.' This makes it unsuitable for code paths that might recursively re-enter the locked method, unlike ReentrantLock/ReentrantReadWriteLock which explicitly support that.",
    },
    realWorld:
      "StampedLock earns its complexity in narrow, hot, read-dominated data structures — a coordinate/geometry cache, a frequently-read configuration snapshot — where profiling shows readLock() acquisition itself in the flame graph. Most application code never needs it; reaching for it by default over the simpler, reentrant, better-understood ReentrantReadWriteLock is a common over-engineering mistake.",
    guruTake:
      "I'd tell an interviewer: I don't start with StampedLock — I start with ReentrantReadWriteLock, or even just synchronized, and only move to optimistic reads when a profiler points at the read-lock acquisition itself as the cost. Its non-reentrancy has bitten teams that reached for it too early.",
    interviewerExpectation: [
      "Explains the stamp/validate() optimistic-read pattern",
      "Knows StampedLock is non-reentrant, unlike ReentrantLock",
      "Frames it as an optimization for measured read-heavy hot paths",
      "Knows optimistic reads must fall back to a real lock on validation failure",
    ],
    followUps: [
      "What happens if you forget to call validate() after an optimistic read?",
      "Why doesn't StampedLock support Condition objects?",
      "How does StampedLock's write lock differ from ReentrantReadWriteLock's?",
    ],
    commonMistakes: [
      "Forgetting to validate() after an optimistic read",
      "Assuming StampedLock is reentrant like ReentrantLock",
      "Reaching for StampedLock without profiling data showing it's needed",
    ],
    bestPractices: [
      "Default to ReentrantReadWriteLock; move to StampedLock only when profiling justifies it",
      "Always validate() after an optimistic read and fall back on failure",
      "Never call StampedLock methods recursively from the same thread",
    ],
    relatedTech: ["ReentrantReadWriteLock", "ReentrantLock", "Optimistic Concurrency Control"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google"],
    related: ["reentrantlock-vs-synchronized"],
  },
  {
    slug: "thread-pool-exhaustion-cascading-failure",
    categoryId: "multithreading",
    topic: "Threads & Pools",
    question: "How does thread-pool exhaustion in one service cascade into a system-wide outage, and how does the bulkhead pattern prevent it?",
    seoTitle: "Thread Pool Exhaustion & Bulkhead Pattern: Interview Q&A | Full Stack Interview Guru",
    seoDescription:
      "How a slow downstream dependency exhausts a shared thread pool and cascades into a system-wide outage, and how dedicating a separate ExecutorService per dependency (the bulkhead pattern) contains the blast radius.",
    heading: "Thread Pool Exhaustion & the Bulkhead Pattern — Interview Questions",
    tags: ["thread pool", "bulkhead", "cascading failure", "production", "resilience"],
    shortAnswer:
      "If every downstream call — fast and slow — shares one thread pool, a single slow or hanging dependency ties up threads waiting on it until the pool is fully occupied; requests to entirely unrelated, healthy dependencies then queue behind those stuck threads and start timing out too, turning one slow dependency into a full outage. The bulkhead pattern fixes this by giving each dependency (or dependency class) its own dedicated, bounded ExecutorService, so exhaustion in one pool can't consume threads earmarked for another.",
    mindMap: [
      { type: "text", content: "This is a **thread pool sizing problem disguised as a downstream-service problem** — the failure isn't really that dependency B is slow, it's that dependency A's slowness was allowed to consume resources that dependency B's requests also needed. Named after ship bulkheads: compartmentalize so one breach doesn't sink the whole vessel." },
      {
        type: "kv",
        rows: [
          { k: "Shared pool", v: "One slow dependency starves threads for all dependencies" },
          { k: "Bulkhead pattern", v: "One bounded ExecutorService per dependency/category" },
          { k: "Blast radius", v: "A stuck dependency only exhausts ITS OWN pool" },
          { k: "Pairs with", v: "Timeouts + circuit breakers on each isolated pool" },
        ],
      },
      { type: "text", content: "**Key takeaway:** a thread pool is a shared resource with a hard capacity — the moment two independent things compete for it, one's failure becomes both's failure. Isolation is the fix, not just a bigger pool." },
    ],
    handsOn: {
      lang: "java",
      code: `// Before: one shared pool — a slow inventory service can starve payment calls
ExecutorService shared = Executors.newFixedThreadPool(50);

// Bulkhead: isolated, bounded pools per dependency
ExecutorService paymentPool   = new ThreadPoolExecutor(10, 10, 0, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(20), new ThreadPoolExecutor.CallerRunsPolicy());
ExecutorService inventoryPool = new ThreadPoolExecutor(10, 10, 0, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(20), new ThreadPoolExecutor.CallerRunsPolicy());

// A hang in inventoryPool can never starve paymentPool's 10 threads`,
    },
    whatIf: {
      q: "Why not just make the shared pool bigger instead of splitting it?",
      a: "A bigger pool delays the symptom but doesn't fix the coupling — enough concurrent slow calls will still exhaust any finite pool, and a larger pool also means more threads blocked waiting (more memory, more context-switch overhead) before the failure becomes visible. Isolation bounds the blast radius regardless of size; a bigger shared pool just raises the threshold at which the same cascading failure happens.",
    },
    realWorld:
      "This is a textbook cause of multi-hour outages: a downstream service starts timing out, its calls pile up in a shared connection/thread pool, and completely unrelated features that happen to share the same executor start failing minutes later — on-call engineers chase the wrong service because the visible symptom (unrelated endpoint failing) doesn't obviously point at the real, slow dependency. Frameworks like Resilience4j formalize this as a Bulkhead alongside CircuitBreaker and TimeLimiter.",
    guruTake:
      "In an incident retro I'd say: the root cause usually isn't 'service X was slow' — services get slow sometimes, that's expected. The real bug is that we let X's slowness consume a resource Y also depended on. Bulkheads turn an inevitable slow dependency into a contained, single-feature degradation instead of an outage.",
    interviewerExpectation: [
      "Explains how a shared pool couples unrelated dependencies' reliability",
      "Names the bulkhead pattern and can describe the isolation mechanism",
      "Connects it to timeouts/circuit breakers as complementary patterns",
      "Gives a concrete cascading-failure scenario, not just a definition",
    ],
    followUps: [
      "How do you decide how many isolated pools to create without over-fragmenting resources?",
      "How does a circuit breaker complement a bulkhead?",
      "How would you size a per-dependency pool relative to that dependency's expected latency and your target throughput?",
    ],
    commonMistakes: [
      "Sharing one thread pool across unrelated downstream dependencies",
      "Treating 'increase pool size' as a fix for cascading failure",
      "Not pairing isolation with timeouts, so threads still block indefinitely",
    ],
    bestPractices: [
      "Dedicate a bounded pool per dependency or dependency class",
      "Always pair pool isolation with a timeout on the call itself",
      "Combine with circuit breakers to fail fast once a dependency is clearly unhealthy",
    ],
    relatedTech: ["Resilience4j", "Circuit Breaker", "ThreadPoolExecutor"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["threadpoolexecutor-tuning", "executor-shutdown-rejection"],
  },
  {
    slug: "completablefuture-callback-thread-semantics",
    categoryId: "multithreading",
    topic: "CompletableFuture",
    question: "thenApply vs thenApplyAsync — which thread actually runs your callback, and why does that matter?",
    seoTitle: "thenApply vs thenApplyAsync Thread Semantics: Interview Q&A | Full Stack Interview Guru",
    seoDescription:
      "CompletableFuture's thenApply/thenCompose/thenCombine vs their Async variants: which thread runs each callback, why that matters for blocking work, and the executor-overload pitfall.",
    heading: "thenApply vs thenApplyAsync — Interview Questions",
    tags: ["completablefuture", "thenapply", "thenapplyasync", "forkjoinpool", "async"],
    shortAnswer:
      "The non-Async variant (thenApply, thenCompose, thenCombine) runs its callback on whichever thread completes the preceding stage — if the future is already complete when you attach the callback, that's the calling thread; if it completes later, it's whatever thread finished the async work, which for the default executor is a ForkJoinPool.commonPool() thread. The Async variant (thenApplyAsync, etc.) always dispatches to an executor — the commonPool by default, or one you explicitly pass — decoupling the callback from whichever thread happened to finish the prior stage. This matters because a non-Async callback can silently execute on a thread you didn't plan for, including the very thread that called .complete() on the future.",
    mindMap: [
      { type: "text", content: "The naming is a giveaway once you know it: **no 'Async' suffix means 'run inline if possible'**, Async suffix means 'always hop to an executor.' The subtlety is that 'inline if possible' has two different outcomes depending on timing — same-thread execution if the future is already done, or completing-thread execution if it isn't." },
      {
        type: "kv",
        rows: [
          { k: "thenApply()", v: "Runs on caller's thread (if done) or completing thread" },
          { k: "thenApplyAsync()", v: "Always submitted to commonPool() (or your executor)" },
          { k: "thenApplyAsync(fn, exec)", v: "Always submitted to YOUR executor — full control" },
          { k: "Risk", v: "Blocking work in a non-Async callback can run on a shared pool thread" },
        ],
      },
      { type: "text", content: "**Key takeaway:** if your callback does anything blocking or expensive, use the Async variant with an explicit executor — don't let it silently inherit whatever thread happened to complete the prior stage." },
    ],
    handsOn: {
      lang: "java",
      code: `CompletableFuture<Integer> future = CompletableFuture.supplyAsync(() -> slowCall());

// Non-Async: runs on whatever thread completes supplyAsync's task (commonPool by default)
future.thenApply(result -> result * 2);

// Async, default executor: submitted fresh to commonPool()
future.thenApplyAsync(result -> result * 2);

// Async, explicit executor: full control over where blocking work runs
future.thenApplyAsync(result -> blockingDbCall(result), dbExecutor);`,
    },
    whatIf: {
      q: "If the future is already complete when you call thenApply(), which thread runs the callback?",
      a: "The calling thread runs it synchronously, right there, before thenApply() even returns — there's no thread hop at all in that case. That's the subtle part: thenApply()'s execution thread isn't fixed, it depends entirely on timing relative to when the prior stage completes.",
    },
    realWorld:
      "This causes real production incidents when a chain of thenApply() calls ends with a blocking database or HTTP call, and under load that blocking work lands on ForkJoinPool.commonPool() — the same pool backing every parallelStream() and default-executor CompletableFuture in the JVM — starving unrelated async work across the entire application, not just the one request.",
    guruTake:
      "My interview answer: I treat the Async suffix as the 'I want this on MY executor, not wherever it happens to land' signal, and I always pass an explicit executor to the Async variant for anything that blocks. Relying on the default commonPool for blocking work is the same mistake as putting blocking I/O inside parallelStream().",
    interviewerExpectation: [
      "Explains that non-Async runs on the completing/calling thread, not a fixed thread",
      "Knows Async variants default to commonPool() unless given an explicit executor",
      "Connects this to the shared commonPool() starvation risk",
      "Recommends explicit executors for blocking callback work",
    ],
    followUps: [
      "Why would you ever choose the non-Async variant deliberately?",
      "What executor does supplyAsync() use if you don't pass one?",
      "How does this thread-semantics question relate to virtual threads replacing CompletableFuture chains?",
    ],
    commonMistakes: [
      "Assuming thenApply() always runs on a fixed, predictable thread",
      "Putting blocking work in a non-Async callback that lands on commonPool()",
      "Using the Async variant without passing an explicit executor for blocking work",
    ],
    bestPractices: [
      "Use non-Async variants only for cheap, non-blocking transformations",
      "Pass an explicit executor to Async variants for blocking or heavy work",
      "Never assume a specific thread runs a non-Async callback",
    ],
    relatedTech: ["ForkJoinPool", "Executor", "parallelStream"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google"],
    related: ["completablefuture-async", "completablefuture-timeout-ortimeout", "parallel-stream-production-pitfalls"],
  },
  {
    slug: "threadlocal-caching-virtual-threads",
    categoryId: "multithreading",
    topic: "Virtual Threads",
    question: "Does the 'one thread per request' mental model still hold with virtual threads — and why can ThreadLocal-based caching patterns silently stop working?",
    seoTitle: "ThreadLocal Caching & Virtual Threads: Interview Q&A | Full Stack Interview Guru",
    seoDescription:
      "Why virtual threads keep ThreadLocal's per-request correctness but silently defeat ThreadLocal-based object-reuse caching — the 'one thread per request' mental model, explained accurately for interviews.",
    heading: "ThreadLocal Caching & the Virtual-Thread Mental Model — Interview Questions",
    tags: ["threadlocal", "virtual threads", "per-request state", "caching", "java 21"],
    shortAnswer:
      "Virtual threads don't break ThreadLocal's core guarantee — each virtual thread still gets its own isolated ThreadLocal storage, so per-request context (a request ID, security principal, MDC logging fields) still isolates correctly, one virtual thread per request, just like the old one-platform-thread-per-request model. What breaks is a different, easy-to-miss assumption: code that uses ThreadLocal as a reuse cache for an expensive object (a ThreadLocal<SimpleDateFormat>, a scratch buffer) relied on the same underlying OS thread being reused across many requests from a small, fixed pool. Executors.newVirtualThreadPerTaskExecutor() creates a brand-new, disposable virtual thread per task and never reuses it — so that ThreadLocal.get() misses every time, and the 'cache' silently re-creates the expensive object on every call. Nothing throws; it just quietly stops caching.",
    mindMap: [
      { type: "text", content: "ThreadLocal has always done **two different jobs** that happened to both work under a bounded platform-thread pool: request-scoped **isolation**, and thread-**reuse caching**. Virtual threads keep the first and quietly remove the second, because a virtual thread is never handed a second, unrelated task." },
      {
        type: "kv",
        rows: [
          { k: "Per-request context (MDC, security)", v: "Still correct — each virtual thread has its own isolated ThreadLocal storage" },
          { k: "Reuse cache (SimpleDateFormat, buffers)", v: "Silently defeated — no OS-thread reuse to amortize the cost across" },
          { k: "Root cause", v: "newVirtualThreadPerTaskExecutor() creates one disposable virtual thread per task, never reused" },
          { k: "Detection", v: "A ThreadLocal-backed pool's hit-rate metric quietly drops toward 0% after migrating" },
        ],
      },
      { type: "text", content: "**Key takeaway:** the 'one thread per request' mental model is still accurate for correctness — it was never a guarantee that the SAME thread would come back for the next request, which is the (implicit, never-promised) assumption a ThreadLocal reuse cache depended on." },
    ],
    handsOn: {
      lang: "java",
      code: `// Platform-thread-pool era: this amortizes construction cost because the
// SAME OS thread (and its ThreadLocal storage) serves many requests over time
private static final ThreadLocal<SimpleDateFormat> FORMATTER =
    ThreadLocal.withInitial(() -> new SimpleDateFormat("yyyy-MM-dd"));

String format(Date d) {
    return FORMATTER.get().format(d);   // reused across requests on a pooled platform thread
}

// Under Executors.newVirtualThreadPerTaskExecutor(): each request gets a
// brand-new virtual thread, so FORMATTER.get() misses EVERY time — the
// "cache" now just constructs a fresh SimpleDateFormat per request, silently.`,
    },
    whatIf: {
      q: "If ThreadLocal is still correct per virtual thread, why does this feel like a regression?",
      a: "Because correctness and the platform-thread-pool-era reuse optimization happened to both hold under a bounded thread pool, and only correctness survives under the virtual-thread model. The reuse assumption was always implicit — ThreadLocal's contract never promised the same thread would come back for your next task, a bounded pool just made that true in practice.",
    },
    realWorld:
      "Teams migrating a Spring MVC app to a virtual-thread executor (e.g. Tomcat's virtual-thread support) sometimes see a ThreadLocal-based formatter or buffer pool show a hit-rate metric quietly drop toward 0% after the switch — allocation and GC pressure creep up even though nothing threw an exception or otherwise 'broke.' The regression is invisible without dedicated cache-hit-rate observability, which is exactly what makes it a good interview question: it rewards knowing to look for a silent behavior change, not just a crash.",
    guruTake:
      "I'd tell an interviewer: ThreadLocal has always quietly done two jobs — isolation and reuse-caching — that only diverge once threads stop being reused. If your ThreadLocal is a cache, ask what it's actually caching against now that there's no 'same thread, next request' to reuse; if it's request-scoped context, it's still exactly as correct as it always was.",
    interviewerExpectation: [
      "Distinguishes context-propagation use of ThreadLocal from reuse-cache use",
      "Explains why virtual threads defeat the cache pattern specifically (no thread reuse), not correctness",
      "Names a concrete detection signal (cache hit-rate metric), not just a theoretical concern",
      "Knows virtual threads are deliberately not pooled/reused by design",
    ],
    followUps: [
      "How would you replace a ThreadLocal-based object pool for code that now runs on virtual threads?",
      "Does this same issue affect ThreadLocal-based security or logging context propagation?",
      "How does this interact with structured concurrency subtasks that need the same request-scoped context?",
    ],
    commonMistakes: [
      "Assuming a ThreadLocal-based cache still amortizes cost under virtual threads",
      "Not distinguishing per-request context from a per-thread reuse cache",
      "Blaming virtual threads for a 'bug' that's actually an expected, silent behavior change",
    ],
    bestPractices: [
      "Before migrating, classify each ThreadLocal as context-propagation (fine) or reuse-cache (needs rethinking)",
      "For genuinely expensive-to-construct objects, use a real bounded object pool instead of ThreadLocal if avoiding allocation still matters",
      "Add cache-hit-rate observability so a silent regression like this is visible, not invisible",
    ],
    relatedTech: ["ThreadLocal", "SimpleDateFormat", "MDC", "newVirtualThreadPerTaskExecutor"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google"],
    related: ["threadlocal-memory-leak", "threadlocal-context-scopedvalues", "virtual-threads-pinning-structured"],
  },
  {
    slug: "structured-concurrency-deep-dive",
    categoryId: "multithreading",
    topic: "Threads & Pools",
    question: "How does StructuredTaskScope let you treat a family of subtasks as a single unit of work?",
    seoTitle: "Structured Concurrency (StructuredTaskScope): Interview Q&A | Full Stack Interview Guru",
    seoDescription:
      "Java's StructuredTaskScope (structured concurrency): still a preview API through JDK 26 (JEP 525), with the API shape itself changed in JDK 25 (JEP 505) — constructors replaced by open() + Joiner. An accurate, current preview-status explanation for interviews.",
    heading: "Structured Concurrency with StructuredTaskScope — Interview Questions",
    tags: ["structured concurrency", "structuredtaskscope", "virtual threads", "preview api", "jdk 25"],
    shortAnswer:
      "Structured concurrency ties the lifetime of a set of concurrent subtasks to a single enclosing scope — fork a few subtasks inside a try-with-resources StructuredTaskScope, join them, and the scope guarantees none of them can outlive the block. The API itself is still moving, which matters for an interview answer: JDK 21 (JEP 453) introduced it as a preview with constructor-based scopes (new StructuredTaskScope.ShutdownOnFailure()); JDK 25 (JEP 505, fifth preview) replaced those constructors with a static StructuredTaskScope.open() factory and a new Joiner interface, removing ShutdownOnFailure/ShutdownOnSuccess as separate types. It remains a preview feature with no finalized version — JDK 26 (JEP 525) previews it again as a sixth iteration — so verify the exact API shape against whichever JDK you actually target rather than assuming either version's syntax, or a GA date, without checking.",
    mindMap: [
      { type: "text", content: "Plain `CompletableFuture`/`ExecutorService` code can easily leak tasks — fire off three async calls, one fails, and the other two keep running with no one waiting on or cancelling them. Structured concurrency borrows the discipline of structured programming (a block has one entry, one exit) and applies it to concurrency: **a scope's subtasks can't outlive the scope**. That guarantee has stayed stable across previews even as the surrounding API syntax hasn't." },
      {
        type: "kv",
        rows: [
          { k: "fork()", v: "Start a subtask, tracked by the enclosing scope — stable across previews" },
          { k: "join()", v: "Wait for subtasks per the active Joiner's policy" },
          { k: "Joiner (JDK 25+, JEP 505)", v: "Replaces ShutdownOnFailure/ShutdownOnSuccess; controls result combination + failure handling" },
          { k: "Status", v: "Preview since JDK 21 (JEP 453); API reshaped in JDK 25 (JEP 505); still preview in JDK 26 (JEP 525) — no finalized version" },
        ],
      },
      { type: "text", content: "**Key takeaway:** the value isn't the exact syntax — it's an actual safety guarantee (no orphaned subtasks) that hand-rolled ExecutorService/CompletableFuture code has to reimplement manually every time. Being an evolving preview API matters for interview credibility — cite the guarantee confidently and the exact syntax cautiously." },
    ],
    handsOn: {
      lang: "java",
      code: `// JDK 25+ (JEP 505): constructors were replaced by the open() factory
// and a Joiner interface. JDK 21-24 previews used
// "new StructuredTaskScope.ShutdownOnFailure()" instead — confirm the
// shape for your actual target JDK before shipping code against it.
try (var scope = StructuredTaskScope.open()) {   // default joiner: all-success-or-throw
    Subtask<User> userTask   = scope.fork(() -> fetchUser(id));
    Subtask<Order> orderTask = scope.fork(() -> fetchOrders(id));

    scope.join();   // throws StructuredTaskScope.FailedException if any subtask failed

    return new Profile(userTask.get(), orderTask.get());
}   // scope close guarantees no subtask can outlive this block`,
    },
    whatIf: {
      q: "How is this different from just using CompletableFuture.allOf() with two futures?",
      a: "allOf() waits for both futures but doesn't cancel the other one if one fails — the failed future's exception has to be checked separately, and the still-running future keeps consuming resources with nothing tying its lifetime to the failure. A StructuredTaskScope's Joiner (or, on JDK 21-24, a ShutdownOnFailure policy) makes cancellation-on-failure automatic and ties every subtask's lifetime to the enclosing block — the exact type name for that policy has changed across previews, but the guarantee itself hasn't.",
    },
    realWorld:
      "This targets a real, common bug class: a request handler fans out to two or three downstream calls with CompletableFuture, one times out, and the others keep running to completion anyway — burning threads/connections on work whose result nobody needs anymore because the overall request already failed. Structured concurrency is aimed squarely at eliminating that leak by construction rather than requiring every call site to remember manual cleanup.",
    guruTake:
      "If this comes up, I'd be upfront that it's still a preview feature — and not just in name. The API shape itself changed between JDK 21 and JDK 25, which is exactly why I wouldn't ship production code against it without pinning to a specific JDK and re-checking on every upgrade. The concept — scoped subtask lifetimes, automatic cancellation on failure — is what's worth understanding deeply; the exact method names are what I'd double-check before writing real code.",
    interviewerExpectation: [
      "Explains the core guarantee: subtasks can't outlive their scope",
      "Names fork()/join() and knows a Joiner (or pre-JDK-25 shutdown policy) controls failure handling",
      "Correctly states this is a preview API with no finalized version, without guessing a GA date",
      "Knows the API shape itself changed in JDK 25 (JEP 505) — not just a version-number curiosity",
    ],
    followUps: [
      "Why did JEP 505 replace ShutdownOnFailure/ShutdownOnSuccess with the Joiner interface?",
      "How does structured concurrency relate to virtual threads — do you need one for the other?",
      "Why does needing --enable-preview matter for a team deciding whether to adopt this now?",
    ],
    commonMistakes: [
      "Presenting StructuredTaskScope as a finalized, stable API without checking",
      "Assuming the JDK 21-24 constructor-based API (ShutdownOnFailure) is still current on JDK 25+",
      "Confusing it with plain ExecutorService.invokeAll(), which has no failure-cancellation guarantee",
    ],
    bestPractices: [
      "Verify the API's preview/finalization status against the exact JDK version you target",
      "Confirm the exact API shape (constructors vs open()+Joiner) before writing code against it",
      "Prefer it over hand-rolled CompletableFuture fan-out once it's stable for your target JDK",
    ],
    relatedTech: ["Virtual Threads", "ExecutorService", "CompletableFuture"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Google", "Amazon"],
    related: ["virtual-threads-pinning-structured"],
  },
  {
    slug: "virtual-thread-synchronized-pinning",
    categoryId: "multithreading",
    topic: "Threads & Pools",
    question: "How does synchronized interact with virtual-thread carrier pinning, and how did that change in Java 24?",
    seoTitle: "Virtual Threads & synchronized Pinning (JEP 491): Interview Q&A | Full Stack Interview Guru",
    seoDescription:
      "Java 21-23 vs Java 24+: how blocking inside synchronized pinned a virtual thread's carrier thread, and how JEP 491 removed that pinning for the common case — an accurate, version-aware explanation for interviews.",
    heading: "Virtual Threads & synchronized Pinning (JEP 491) — Interview Questions",
    tags: ["virtual threads", "synchronized", "pinning", "jep 491", "java 24"],
    shortAnswer:
      "This behavior is genuinely version-dependent, and stating it accurately matters: in Java 21 through 23, a virtual thread that blocked while holding a monitor acquired via synchronized could not unmount from its carrier platform thread — it 'pinned' the carrier for the duration, so blocking I/O inside a synchronized block or method effectively lost virtual threads' scalability benefit for that stretch of code, and the JDK-recommended workaround was to replace hot synchronized blocks with java.util.concurrent.locks.ReentrantLock. JEP 491, delivered in Java 24, reimplemented monitor support so that synchronized no longer pins the carrier thread in the common case — meaning on Java 24+, this specific problem is largely resolved and the ReentrantLock workaround is no longer necessary purely for pinning reasons. Always confirm which JDK a codebase targets before giving blanket advice here.",
    mindMap: [
      { type: "text", content: "Virtual threads work by **unmounting from their carrier platform thread whenever they block**, freeing the carrier to run other virtual threads. Before JEP 491, the JVM's monitor implementation (backing `synchronized`) couldn't safely unmount a virtual thread mid-block — so the carrier stayed pinned, unable to serve anyone else, for as long as that blocking call lasted." },
      {
        type: "kv",
        rows: [
          { k: "Java 21–23", v: "Blocking inside synchronized pins the carrier thread" },
          { k: "Workaround (21–23)", v: "Prefer ReentrantLock over synchronized in VT hot paths" },
          { k: "Java 24+ (JEP 491)", v: "synchronized no longer pins the carrier in the common case" },
          { k: "Detection tool", v: "-Djdk.tracePinnedThreads, JFR jdk.VirtualThreadPinned events" },
        ],
      },
      { type: "text", content: "**Key takeaway:** this is exactly the kind of Java-version nuance that separates a candidate who read one blog post from one who tracks the JDK release notes — the correct answer depends on which JDK the codebase actually runs, not on a single blanket rule." },
    ],
    handsOn: {
      lang: "java",
      code: `// On Java 21-23: this pins the carrier thread for the duration of blockingCall()
synchronized (lock) {
    blockingCall();     // carrier thread can't serve other virtual threads meanwhile
}

// 21-23 workaround: swap to ReentrantLock, which doesn't pin
private final ReentrantLock lock = new ReentrantLock();
lock.lock();
try {
    blockingCall();     // carrier CAN unmount and serve other virtual threads
} finally {
    lock.unlock();
}

// On Java 24+ (JEP 491): the original synchronized version no longer pins
// in the common case — verify against your actual target JDK before relying on this.`,
    },
    whatIf: {
      q: "If a team is still on Java 21 LTS, is the ReentrantLock workaround still relevant advice?",
      a: "Yes — JEP 491 shipped in Java 24, so any codebase pinned to Java 21, 22, or 23 (a very common position for teams on the current LTS) still has the pinning behavior and should still prefer ReentrantLock over synchronized in code that virtual threads execute and that blocks. The fix only applies once a team actually upgrades to 24 or later.",
    },
    realWorld:
      "This is a real migration-planning question, not trivia: a team adopting virtual threads on Java 21 has to audit synchronized usage (including inherited from legacy libraries they don't control) in any code path virtual threads execute, using -Djdk.tracePinnedThreads to find pinning hotspots — and that audit's urgency changes materially once (and if) the team can move to Java 24+.",
    guruTake:
      "I'd answer this by anchoring on the JDK version first: 'depends whether you're on 21-23 or 24+' — then explain the mechanism. Giving a single unversioned answer here is exactly the kind of outdated-information mistake that makes an interviewer question whether the rest of my Java 21+ knowledge is current.",
    interviewerExpectation: [
      "Correctly separates Java 21–23 behavior from Java 24+ (JEP 491) behavior",
      "Names ReentrantLock as the pre-JEP-491 workaround",
      "Knows -Djdk.tracePinnedThreads / JFR as detection tools",
      "Doesn't state either version's behavior as universally true",
    ],
    followUps: [
      "What other operations besides synchronized can still pin a virtual thread's carrier?",
      "How would you audit a large legacy codebase for pinning-prone synchronized usage before adopting virtual threads on Java 21?",
      "Why couldn't the JVM safely unmount a virtual thread mid-monitor before JEP 491?",
    ],
    commonMistakes: [
      "Stating synchronized 'always pins virtual threads' without a version caveat",
      "Not knowing JEP 491 (Java 24) changed this behavior at all",
      "Assuming every team is already on the latest JDK",
    ],
    bestPractices: [
      "Anchor pinning advice to the target JDK version explicitly",
      "Use -Djdk.tracePinnedThreads or JFR to find pinning in an existing codebase",
      "Prefer ReentrantLock over synchronized in virtual-thread hot paths only while on Java 21–23",
    ],
    relatedTech: ["ReentrantLock", "JFR", "Virtual Threads"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google"],
    related: ["virtual-threads-pinning-structured", "reentrantlock-vs-synchronized"],
  },
  {
    slug: "completablefuture-timeout-ortimeout",
    categoryId: "multithreading",
    topic: "CompletableFuture",
    question: "What actually happens to the underlying work when CompletableFuture.orTimeout() fires?",
    seoTitle: "What Happens When CompletableFuture.orTimeout() Fires? | Full Stack Interview Guru",
    seoDescription:
      "orTimeout() completes the CompletableFuture with a TimeoutException but never cancels the underlying computation — why abandoned work keeps running, why cancel(true) doesn't help, and the real production resource-leak risk.",
    heading: "What Happens When orTimeout() Fires? — Interview Questions",
    tags: ["completablefuture", "ortimeout", "cancellation", "resource leak", "production"],
    shortAnswer:
      "orTimeout() only changes the CompletableFuture object's own completion state — at the deadline, it marks the future as completed exceptionally with a TimeoutException. It does not cancel, interrupt, or stop whatever computation is actually running underneath: if the value was being produced by supplyAsync(supplier, executor), that supplier keeps executing on its executor thread to completion (or failure) regardless, because CompletableFuture has no way to reach into and stop arbitrary running code. Calling future.cancel(true) doesn't help either — CompletableFuture's cancel() is documented to ignore the mayInterruptIfRunning flag entirely; it never interrupts the underlying thread. The caller moves on with a TimeoutException (or a fallback), but the real work can keep consuming a thread, a database connection, or CPU well after anyone is listening for its result.",
    mindMap: [
      { type: "text", content: "orTimeout() controls **the future's logical state** — what the caller sees. It has no reach into **the actual running computation** underneath. Those are two separate things, and conflating them is the core misconception this question tests." },
      {
        type: "kv",
        rows: [
          { k: "orTimeout() fires", v: "CompletableFuture completes exceptionally with TimeoutException" },
          { k: "Underlying task", v: "Keeps running to completion on its executor — NOT stopped" },
          { k: "future.cancel(true)", v: "mayInterruptIfRunning is documented to have NO EFFECT on CompletableFuture" },
          { k: "Real cancellation", v: "Needs cooperative support in the task itself, or a raw ExecutorService Future" },
        ],
      },
      { type: "text", content: "**Key takeaway:** orTimeout() is a promise about what the caller experiences, not a promise about what the work does. Timing out a call doesn't stop it — it just stops you from waiting on it." },
    ],
    handsOn: {
      lang: "java",
      code: `CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    try {
        Thread.sleep(5000);              // simulates a slow downstream call
    } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    System.out.println("Still ran to completion!");  // prints even after the caller times out
    return "result";
}, executor);

future.orTimeout(1, TimeUnit.SECONDS)
    .exceptionally(ex -> "fallback");
// The caller gets "fallback" after 1s — but sleep(5000) keeps running on its
// executor thread for the full 5s, printing the line above regardless.`,
    },
    whatIf: {
      q: "Does calling future.cancel(true) after orTimeout() fires stop the underlying work?",
      a: "No — CompletableFuture.cancel()'s mayInterruptIfRunning parameter is documented to have no effect; it never interrupts. To actually stop work you'd need the task itself to check Thread.interrupted() cooperatively, or you'd need to hold onto the raw java.util.concurrent.Future from an ExecutorService.submit() call directly — that Future's cancel(true) genuinely does interrupt the running thread, unlike CompletableFuture's.",
    },
    realWorld:
      "Under load, this shows up as silent resource exhaustion: a service times out slow downstream calls with orTimeout() and returns fallbacks to keep p99 latency low, but the abandoned downstream calls keep running and keep holding their thread-pool threads and DB connections until they finish naturally — so the pool can still exhaust even though every individual caller 'timed out' correctly. Teams discover this via thread-pool/connection-pool metrics staying elevated well past what request-level timeout metrics would suggest.",
    guruTake:
      "I'd tell an interviewer: orTimeout() is optimistic on the caller's side and does nothing on the callee's side. If I actually need to stop wasted work, I either build cooperative cancellation into the task or use a client library that supports real cancellation — like an HTTP client's own cancellable request object — not just wrap a call in a CompletableFuture and assume the timeout stops it.",
    interviewerExpectation: [
      "Knows orTimeout() only changes the future's completion state, not the underlying computation",
      "Knows CompletableFuture.cancel()'s mayInterruptIfRunning is documented to have no effect",
      "Distinguishes this from ExecutorService's own Future, which does support real interruption",
      "Names a concrete production consequence (thread/connection pool staying occupied past the caller's timeout)",
    ],
    followUps: [
      "How would you build genuine cancellation into a long-running task used with CompletableFuture?",
      "Why does ExecutorService's Future.cancel(true) behave differently from CompletableFuture's cancel()?",
      "How would you detect that abandoned work is still consuming resources after callers have timed out?",
    ],
    commonMistakes: [
      "Assuming orTimeout() or cancel() actually stops the underlying computation",
      "Not realizing CompletableFuture.cancel(true) ignores mayInterruptIfRunning",
      "Timing out calls without checking whether the abandoned work still holds a thread or connection",
    ],
    bestPractices: [
      "Treat orTimeout() as a caller-side latency control, not a resource-cleanup mechanism",
      "Build cooperative cancellation into long-running tasks, or use a client with real cancellation support",
      "Monitor thread-pool/connection-pool occupancy separately from request-level timeout metrics to catch orphaned work",
    ],
    relatedTech: ["ExecutorService", "Future", "InterruptedException"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft"],
    related: ["completablefuture-async", "completablefuture-callback-thread-semantics"],
  },
];
