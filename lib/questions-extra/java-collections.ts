import type { Question } from "../types";

/**
 * Java Collections — flagship expansion batch (20 questions).
 * Enterprise & product-company patterns: List/Set/Map selection, HashMap &
 * ConcurrentHashMap internals, iterators, performance tuning, memory overhead,
 * concurrency pitfalls and producer-consumer queues.
 *
 * Difficulty mix: 4 Easy · 10 Medium · 6 Hard. Ordered easy → hard.
 */
export const javaCollectionsExtra: Question[] = [
  // ---------------------------------------------------------------- Easy (4)
  {
    slug: "choosing-the-right-collection",
    categoryId: "java-collections",
    topic: "List vs Set vs Map",
    question: "How do you choose between List, Set and Map for a new feature?",
    tags: ["list", "set", "map", "collection choice", "data structures"],
    shortAnswer:
      "List = ordered, allows duplicates, index access. Set = unique elements, membership tests. Map = key→value lookups. Pick by the question you ask most: 'what's at position i?' (List), 'have I seen this?' (Set), 'what's the value for this key?' (Map).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "List (ArrayList)", v: "ordered, duplicates, O(1) index" },
          { k: "Set (HashSet)", v: "unique, O(1) contains" },
          { k: "Map (HashMap)", v: "key→value, O(1) get" },
          { k: "Need order?", v: "LinkedHashSet/Map or TreeSet/Map" },
        ],
      },
    ],
    whatIf: {
      q: "You need uniqueness AND insertion order — which collection?",
      a: "LinkedHashSet: it rejects duplicates like HashSet but preserves insertion order via a linked list, so iteration is predictable — ideal for de-duplicating a stream while keeping first-seen order.",
    },
    realWorld:
      "Deduplicating user roles → Set; an ordered cart of line items → List; looking up a product by SKU → Map. Picking wrong (e.g. List.contains in a hot path) is a top cause of O(n²) slowness.",
    interviewerExpectation: ["duplicates vs uniqueness", "index vs key vs membership", "ordering variants", "Big-O of contains/get"],
    followUps: [
      "When does List.contains() become a performance problem?",
      "How do you keep insertion order in a Set or Map?",
      "When would you use a sorted structure (TreeMap/TreeSet)?",
    ],
    commonMistakes: [
      "Using List.contains() for membership in a loop (O(n²))",
      "Using a Map when a Set (keys only) suffices",
      "Assuming HashMap/HashSet preserve order",
    ],
    bestPractices: [
      "Match the structure to your dominant access pattern",
      "Use a Set for membership, not List.contains",
      "Reach for Linked*/Tree* variants only when you need ordering",
    ],
    relatedTech: ["ArrayList", "HashSet", "HashMap", "LinkedHashSet", "TreeMap"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Cognizant", "Accenture", "Wipro"],
    related: ["arraylist-vs-linkedlist-choice", "set-implementations-compared"],
  },
  {
    slug: "arraylist-vs-linkedlist-choice",
    categoryId: "java-collections",
    topic: "List",
    question: "ArrayList vs LinkedList — which would you actually pick in production, and why?",
    tags: ["arraylist", "linkedlist", "performance", "cache locality"],
    shortAnswer:
      "ArrayList almost always. It has O(1) random access and contiguous memory (cache-friendly). LinkedList only wins for frequent add/remove at the ends as a Deque — its 'O(1) middle insert' is theoretical because you pay O(n) to reach the node, plus cache misses.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "ArrayList", v: "O(1) get, cache-friendly, default" },
          { k: "LinkedList", v: "O(1) ends, O(n) index, pointer chasing" },
          { k: "Reality", v: "ArrayList wins ~95% of the time" },
        ],
      },
    ],
    whatIf: {
      q: "Interviewer says 'insert in the middle is O(1) for LinkedList' — is that the whole story?",
      a: "No. The link update is O(1) only once you already hold the node. Finding the middle index is O(n) traversal, and the scattered nodes cause cache misses — so in practice ArrayList often beats LinkedList even for middle inserts.",
    },
    realWorld:
      "Teams default to ArrayList for result sets and DTO lists. LinkedList shows up mainly as a Queue/Deque (addFirst/removeFirst), and ArrayDeque usually beats it even there.",
    interviewerExpectation: ["random access vs traversal", "cache locality", "amortized resize", "ArrayDeque over LinkedList for queues"],
    followUps: [
      "How does ArrayList grow, and what is the amortized add cost?",
      "Why is ArrayDeque preferred over LinkedList for queues/stacks?",
      "When is the LinkedList memory overhead per node a problem?",
    ],
    commonMistakes: [
      "Choosing LinkedList for 'fast inserts' without measuring",
      "Calling get(i) in a loop on a LinkedList (O(n²))",
      "Ignoring per-node object overhead of LinkedList",
    ],
    bestPractices: [
      "Default to ArrayList; pre-size with initialCapacity when known",
      "Use ArrayDeque for stack/queue needs",
      "Benchmark before assuming LinkedList helps",
    ],
    relatedTech: ["ArrayList", "ArrayDeque", "List.of", "JMH"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "TCS", "Accenture"],
    related: ["choosing-the-right-collection", "collection-memory-overhead"],
  },
  {
    slug: "set-implementations-compared",
    categoryId: "java-collections",
    topic: "Set",
    question: "HashSet vs LinkedHashSet vs TreeSet — when do you use each?",
    tags: ["hashset", "linkedhashset", "treeset", "ordering"],
    shortAnswer:
      "HashSet: O(1), no order. LinkedHashSet: O(1), insertion order. TreeSet: O(log n), sorted order with range queries (NavigableSet). Choose by whether you need no order, insertion order, or sorted order.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "HashSet", v: "O(1), unordered, default" },
          { k: "LinkedHashSet", v: "O(1), insertion order" },
          { k: "TreeSet", v: "O(log n), sorted + range ops" },
        ],
      },
    ],
    whatIf: {
      q: "Your TreeSet throws ClassCastException at runtime — why?",
      a: "TreeSet orders elements via Comparable/Comparator. If the element type isn't Comparable (and no Comparator was supplied), the first add that needs comparison throws ClassCastException. Provide a Comparator or implement Comparable.",
    },
    realWorld:
      "Dedup with stable output order → LinkedHashSet; a leaderboard or 'find all scores between X and Y' → TreeSet's floor/ceiling/subSet; plain membership → HashSet.",
    interviewerExpectation: ["hashing vs tree", "ordering guarantees", "O(1) vs O(log n)", "Comparable/Comparator requirement for TreeSet"],
    followUps: [
      "What NavigableSet operations does TreeSet add?",
      "How does LinkedHashSet maintain order internally?",
      "What contract must elements satisfy for HashSet to work?",
    ],
    commonMistakes: [
      "Using TreeSet with non-Comparable elements",
      "Expecting HashSet to keep order",
      "Bad equals/hashCode causing duplicate-looking entries in HashSet",
    ],
    bestPractices: [
      "Default to HashSet; upgrade to Linked/Tree only for order needs",
      "Supply a Comparator for TreeSet of custom types",
      "Ensure correct equals/hashCode for HashSet elements",
    ],
    relatedTech: ["NavigableSet", "Comparator", "HashMap (backing)"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "Cognizant", "Capgemini", "Wipro"],
    related: ["treemap-navigablemap", "choosing-the-right-collection"],
  },
  {
    slug: "iterator-vs-listiterator",
    categoryId: "java-collections",
    topic: "Iterators",
    question: "Iterator vs ListIterator — how do you safely remove elements while iterating?",
    tags: ["iterator", "listiterator", "removeif", "concurrentmodification"],
    shortAnswer:
      "Use the Iterator's own remove() (or removeIf) — never list.remove() inside a for-each, which throws ConcurrentModificationException. ListIterator adds backward traversal and set()/add() during iteration.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Iterator", v: "forward, hasNext/next/remove" },
          { k: "ListIterator", v: "bidirectional, set/add/remove" },
          { k: "Safe remove", v: "it.remove() or coll.removeIf(...)" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `// BAD: throws ConcurrentModificationException
for (Order o : orders) if (o.isCancelled()) orders.remove(o);

// GOOD
orders.removeIf(Order::isCancelled);`,
    },
    whatIf: {
      q: "Why does removing via the for-each loop throw but iterator.remove() doesn't?",
      a: "The for-each uses an Iterator that tracks modCount. list.remove() bumps modCount behind the iterator's back → next() detects the mismatch and throws. iterator.remove() updates both the list and the iterator's expected modCount, so it stays consistent.",
    },
    realWorld:
      "Filtering a collection in place (removing cancelled/expired items) is everyday code; removeIf is the clean, correct one-liner that avoids the classic CME crash.",
    interviewerExpectation: ["iterator.remove vs collection.remove", "removeIf", "modCount/fail-fast", "ListIterator bidirectional + set/add"],
    followUps: [
      "How does modCount drive fail-fast behavior?",
      "When would you use ListIterator.set() vs add()?",
      "How do you remove during iteration on a Map?",
    ],
    commonMistakes: [
      "Calling list.remove() inside a for-each",
      "Modifying a Map's keySet while iterating without the iterator",
      "Assuming CME is guaranteed (it's best-effort)",
    ],
    bestPractices: [
      "Prefer removeIf for conditional removal",
      "Use iterator.remove() when you need custom logic",
      "Iterate Map.entrySet() and use the iterator to remove",
    ],
    relatedTech: ["removeIf", "Stream.filter", "fail-fast iterators"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["TCS", "Infosys", "Accenture", "Deloitte"],
    related: ["concurrent-modification-exception", "fail-fast-vs-fail-safe"],
  },

  // -------------------------------------------------------------- Medium (10)
  {
    slug: "hashmap-internals-java8",
    categoryId: "java-collections",
    topic: "HashMap Internals",
    question: "Walk me through what happens inside HashMap.put() in Java 8.",
    tags: ["hashmap", "internals", "treeify", "hashing", "buckets"],
    shortAnswer:
      "put() hashes the key (with a spread to mix high bits), finds the bucket via (n-1)&hash, then appends/updates in that bucket. Buckets are linked lists that convert to red-black trees once they exceed 8 entries (and the table ≥ 64), giving O(log n) worst case instead of O(n).",
    mindMap: [
      { type: "text", content: "Java 8 HashMap = array of buckets. Each bucket is a **linked list** that **treeifies** to a balanced tree under heavy collision, so a hot bucket degrades to O(log n), not O(n)." },
      {
        type: "kv",
        rows: [
          { k: "hash(key)", v: "h ^ (h >>> 16) — spreads high bits" },
          { k: "bucket", v: "(n - 1) & hash" },
          { k: "Treeify", v: "bucket > 8 entries & table ≥ 64" },
          { k: "Untreeify", v: "shrinks back below 6" },
        ],
      },
    ],
    whatIf: {
      q: "Why does HashMap mix the high bits of the hash before indexing?",
      a: "The bucket index is (n-1) & hash, which only uses the low bits. Many hashCodes differ mainly in high bits, so without spreading (h ^ (h>>>16)) they'd collide in the same bucket. Mixing reduces collisions cheaply.",
    },
    realWorld:
      "Understanding treeify explains why a HashMap keyed by objects with a poor hashCode (all colliding) is 'slow' — pre-Java 8 it was O(n) per bucket; Java 8 caps it at O(log n) via trees.",
    interviewerExpectation: ["spread function", "(n-1)&hash indexing", "treeify threshold 8 / table 64", "O(log n) worst case", "needs equals + hashCode"],
    followUps: [
      "What triggers a resize and how does it rehash?",
      "Why must keys be effectively immutable?",
      "Why is the default capacity 16 and load factor 0.75?",
    ],
    commonMistakes: [
      "Thinking collisions are always O(n) in Java 8",
      "Using mutable objects as keys",
      "Ignoring the equals/hashCode contract",
    ],
    bestPractices: [
      "Use immutable keys with well-distributed hashCode",
      "Pre-size the map when the count is known",
      "Prefer records/value objects as keys",
    ],
    relatedTech: ["red-black tree", "Objects.hash", "records"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["hashmap-resize-load-factor", "mutable-key-hashmap-bug", "hashmap-concurrency-corruption"],
  },
  {
    slug: "hashmap-resize-load-factor",
    categoryId: "java-collections",
    topic: "Performance",
    question: "How do load factor and resizing affect HashMap performance, and how do you tune it?",
    tags: ["hashmap", "load factor", "resize", "capacity", "performance tuning"],
    shortAnswer:
      "When size exceeds capacity × load factor (default 0.75), the table doubles and every entry rehashes — an O(n) spike. For known sizes, pre-size with initialCapacity = expected / 0.75 to avoid repeated resizes.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Threshold", v: "capacity × 0.75" },
          { k: "Resize", v: "double table, rehash all — O(n)" },
          { k: "Pre-size", v: "new HashMap<>(expected / 0.75 + 1)" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `// Avoid 4 resizes when loading ~1000 entries
Map<String,Order> m = new HashMap<>(1366); // 1000 / 0.75 ≈ 1334 → next pow2
records.forEach(r -> m.put(r.id(), r));`,
      time: "amortized O(1) put; pre-sizing removes resize spikes",
    },
    whatIf: {
      q: "A batch job loading 10M rows into a HashMap shows periodic latency spikes — why?",
      a: "Each time the map crosses the resize threshold it doubles capacity and rehashes all existing entries (O(n)). For 10M entries that's ~23 doublings, each more expensive. Pre-sizing the map eliminates the repeated rehash spikes.",
    },
    realWorld:
      "Pre-sizing maps/lists before bulk loads is a standard performance fix in ETL and caching code — it turns a series of O(n) rehash pauses into a single allocation.",
    interviewerExpectation: ["load factor 0.75 default", "resize = double + rehash", "pre-size formula", "amortized vs spike cost"],
    followUps: [
      "Why is the load factor 0.75 a space/time compromise?",
      "Does a higher load factor save memory? At what cost?",
      "How does this differ for ConcurrentHashMap?",
    ],
    commonMistakes: [
      "Not pre-sizing maps before known bulk loads",
      "Setting initialCapacity = expected (forgetting the 0.75 factor)",
      "Raising load factor to 1.0 and increasing collisions",
    ],
    bestPractices: [
      "Pre-size: initialCapacity ≈ expected / 0.75",
      "Keep the default 0.75 unless profiling says otherwise",
      "Use the same pattern for ArrayList/StringBuilder",
    ],
    relatedTech: ["HashMap", "Guava Maps.newHashMapWithExpectedSize", "JMH"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Wipro"],
    related: ["hashmap-internals-java8", "collection-memory-overhead"],
  },
  {
    slug: "concurrent-modification-exception",
    categoryId: "java-collections",
    topic: "Iterators",
    question: "What causes ConcurrentModificationException, and what are the correct fixes?",
    tags: ["concurrentmodificationexception", "fail-fast", "iterator", "thread-safety"],
    shortAnswer:
      "It's thrown by fail-fast iterators when a collection is structurally modified during iteration — even single-threaded (e.g. remove inside a for-each). Fix with iterator.remove()/removeIf for single-thread, or a concurrent collection (ConcurrentHashMap, CopyOnWriteArrayList) for true multi-threading.",
    mindMap: [
      { type: "text", content: "CME is **not** only a threading bug. The common case is single-threaded: mutating a list inside its own for-each loop. Fail-fast iterators detect the structural change via modCount and bail out." },
    ],
    whatIf: {
      q: "Two threads read/write a shared ArrayList and you get CME intermittently — how do you fix it?",
      a: "ArrayList isn't thread-safe. Either guard it with external synchronization, use Collections.synchronizedList (and sync the iteration block), or switch to CopyOnWriteArrayList for read-heavy workloads — its iterator works on a snapshot and never throws CME.",
    },
    realWorld:
      "CME surfaces both as a coding bug (remove in for-each) and as a concurrency smell (sharing a plain ArrayList across request threads). The fix differs: removeIf vs a concurrent collection.",
    interviewerExpectation: ["fail-fast modCount", "single-thread cause", "iterator.remove/removeIf", "concurrent collections for threads", "best-effort, not guaranteed"],
    followUps: [
      "Why is CME described as 'best-effort' and not guaranteed?",
      "How do fail-safe (snapshot) iterators avoid it?",
      "When is CopyOnWriteArrayList the right fix vs ConcurrentHashMap?",
    ],
    commonMistakes: [
      "Assuming CME always means a threading bug",
      "Catching CME instead of fixing the modification",
      "Sharing non-thread-safe collections across threads",
    ],
    bestPractices: [
      "Use removeIf/iterator.remove for in-loop removal",
      "Pick a concurrent collection for shared mutable state",
      "Never swallow CME — fix the root cause",
    ],
    relatedTech: ["CopyOnWriteArrayList", "ConcurrentHashMap", "Collections.synchronizedList"],
    difficulty: "Medium",
    experience: ["3-5 years"],
    askedIn: ["Infosys", "Cognizant", "Accenture", "Amazon"],
    related: ["iterator-vs-listiterator", "fail-fast-vs-fail-safe", "copyonwritearraylist"],
  },
  {
    slug: "linkedhashmap-lru-cache",
    categoryId: "java-collections",
    topic: "HashMap Internals",
    question: "How do you build an LRU cache using LinkedHashMap?",
    tags: ["linkedhashmap", "lru", "cache", "accessorder"],
    shortAnswer:
      "Construct LinkedHashMap with accessOrder=true (reorders on access) and override removeEldestEntry to evict when size exceeds capacity. It's O(1) get/put with automatic LRU eviction — but not thread-safe, so wrap or use Caffeine in production.",
    mindMap: [
      { type: "text", content: "`accessOrder=true` moves a touched entry to the tail, so the head is always the least-recently-used. `removeEldestEntry` returns true to evict it when over capacity." },
    ],
    handsOn: {
      lang: "java",
      code: `Map<K,V> lru = new LinkedHashMap<>(16, 0.75f, true) {
    protected boolean removeEldestEntry(Map.Entry<K,V> e) {
        return size() > MAX;
    }
};`,
      time: "O(1) get/put with LRU eviction",
    },
    whatIf: {
      q: "Why wouldn't you ship this LinkedHashMap LRU to production as-is?",
      a: "It isn't thread-safe and has no TTL, hit/miss metrics, or weak references. Under concurrency you'd wrap it (and synchronize iteration) or — better — use Caffeine/Guava which give bounded size, TTL, async loading and stats out of the box.",
    },
    realWorld:
      "LinkedHashMap LRU is a great interview demonstration and fine for small single-threaded caches, but real services use Caffeine for bounded, concurrent, observable caching.",
    interviewerExpectation: ["accessOrder=true", "removeEldestEntry", "O(1) LRU", "not thread-safe", "Caffeine for prod"],
    followUps: [
      "How would you make it thread-safe?",
      "How does Caffeine's W-TinyLFU differ from pure LRU?",
      "How do you add TTL/expiry?",
    ],
    commonMistakes: [
      "Forgetting accessOrder=true (gives insertion-order, not LRU)",
      "Using it concurrently without synchronization",
      "Reinventing caching instead of using Caffeine",
    ],
    bestPractices: [
      "Use Caffeine/Guava for production caches",
      "Bound every cache (size + TTL)",
      "Expose hit-rate metrics",
    ],
    relatedTech: ["Caffeine", "Guava Cache", "ConcurrentHashMap"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["hashmap-internals-java8", "concurrent-counter-collections"],
  },
  {
    slug: "treemap-navigablemap",
    categoryId: "java-collections",
    topic: "TreeMap",
    question: "When do you reach for TreeMap/NavigableMap instead of HashMap?",
    tags: ["treemap", "navigablemap", "sorted", "range query"],
    shortAnswer:
      "When you need sorted keys or range/nearest queries: floorKey, ceilingKey, headMap, tailMap, subMap. TreeMap is O(log n) (red-black tree) vs HashMap's O(1) — you trade speed for ordering and range operations.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "floor/ceiling", v: "nearest key ≤ / ≥ target" },
          { k: "subMap/headMap/tailMap", v: "range views" },
          { k: "firstKey/lastKey", v: "min / max" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `NavigableMap<Integer,String> tiers = new TreeMap<>();
tiers.put(0,"Bronze"); tiers.put(1000,"Silver"); tiers.put(5000,"Gold");
// which tier for 2300 points?
System.out.println(tiers.floorEntry(2300).getValue());`,
      output: "Silver",
      time: "O(log n) lookup/range",
    },
    whatIf: {
      q: "How would you find all events in a time window efficiently?",
      a: "Key a TreeMap by timestamp and call subMap(start, end) — it returns a view of just that range in O(log n + k), far better than scanning a HashMap or list and filtering.",
    },
    realWorld:
      "Pricing tiers, rate cards, time-series windows and 'nearest value' lookups (e.g. find the applicable discount band) are natural NavigableMap problems.",
    interviewerExpectation: ["sorted order", "floor/ceiling/sub-views", "O(log n)", "Comparable/Comparator", "range queries"],
    followUps: [
      "What's the cost difference vs HashMap and when does it matter?",
      "How do you do a range scan with subMap?",
      "What ordering contract must keys satisfy?",
    ],
    commonMistakes: [
      "Scanning + filtering a HashMap for range queries",
      "Using TreeMap when no ordering is needed (slower)",
      "Keys not Comparable and no Comparator supplied",
    ],
    bestPractices: [
      "Use NavigableMap for range/nearest queries",
      "Supply a Comparator for custom key ordering",
      "Stick with HashMap when you only need point lookups",
    ],
    relatedTech: ["NavigableMap", "red-black tree", "Comparator"],
    difficulty: "Medium",
    experience: ["3-5 years"],
    askedIn: ["Amazon", "Google", "Deloitte"],
    related: ["set-implementations-compared", "priorityqueue-top-k"],
  },
  {
    slug: "immutable-collections",
    categoryId: "java-collections",
    topic: "Performance",
    question: "List.of vs Collections.unmodifiableList vs Arrays.asList — what's the difference?",
    tags: ["immutable", "unmodifiable", "list.of", "defensive copy"],
    shortAnswer:
      "List.of (Java 9+) is truly immutable and rejects nulls. Collections.unmodifiableList is a read-only VIEW over a backing list — mutating the backing list still changes it. Arrays.asList is a fixed-size, array-backed view (set ok, add/remove throw).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "List.of(...)", v: "immutable, no nulls, copy-free" },
          { k: "unmodifiableList(x)", v: "read-only VIEW of x (x can still change)" },
          { k: "Arrays.asList(a)", v: "fixed-size, backed by array a" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `List<String> view = Collections.unmodifiableList(backing);
backing.add("sneaky"); // view now shows it — NOT truly immutable!

List<String> safe = List.copyOf(backing); // snapshot, immutable`,
    },
    whatIf: {
      q: "You return unmodifiableList(internal) from a getter — is your object safe?",
      a: "Callers can't mutate via the view, but YOUR class can still mutate `internal`, and the view reflects it. For a defensive snapshot return List.copyOf(internal) instead, which is an independent immutable copy.",
    },
    realWorld:
      "Defensive copies at API boundaries prevent callers from mutating internal state. List.of/List.copyOf are the modern idiom; the old unmodifiable* views are a frequent source of 'how did this list change?' bugs.",
    interviewerExpectation: ["immutable vs unmodifiable view", "Arrays.asList fixed-size + backed", "null handling", "List.copyOf for snapshots"],
    followUps: [
      "Why does Arrays.asList(arr).add() throw but set() works?",
      "How do records + List.copyOf give true immutability?",
      "What does List.of do with a null element?",
    ],
    commonMistakes: [
      "Treating unmodifiableList as a true immutable copy",
      "Calling add/remove on Arrays.asList result",
      "Passing nulls to List.of",
    ],
    bestPractices: [
      "Use List.of/Set.of/Map.of for constants",
      "Use List.copyOf for defensive snapshots",
      "Document mutability at API boundaries",
    ],
    relatedTech: ["List.of/copyOf", "records", "Guava ImmutableList"],
    difficulty: "Medium",
    experience: ["3-5 years"],
    askedIn: ["Amazon", "Microsoft", "Cognizant"],
    related: ["arrays-aslist-pitfalls", "choosing-the-right-collection"],
  },
  {
    slug: "arrays-aslist-pitfalls",
    categoryId: "java-collections",
    topic: "List",
    question: "What are the pitfalls of Arrays.asList(), and how do they bite in production?",
    tags: ["arrays.aslist", "fixed-size", "autoboxing", "backed list"],
    shortAnswer:
      "Arrays.asList returns a fixed-size list backed by the array: add/remove throw UnsupportedOperationException, and changes write through to the array. With a primitive array it returns a single-element List<int[]>, not a List<Integer>.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Fixed size", v: "add/remove → UnsupportedOperation" },
          { k: "Backed", v: "set() mutates the original array" },
          { k: "int[] trap", v: "List<int[]> of size 1, not List<Integer>" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `int[] a = {1,2,3};
List<int[]> wrong = Arrays.asList(a);      // size 1!
List<Integer> ok = Arrays.stream(a).boxed()
                         .collect(Collectors.toList());`,
      output: "wrong.size() == 1",
    },
    whatIf: {
      q: "You pass Arrays.asList(...) to a method that calls add() and it crashes — how do you fix it?",
      a: "Wrap it in a real resizable list: new ArrayList<>(Arrays.asList(...)). The fixed-size view only supports set(), not structural changes.",
    },
    realWorld:
      "The primitive-array gotcha silently produces a size-1 list (List<int[]>), causing 'why is my list empty/size 1?' bugs; and passing the fixed-size view where mutation is expected throws at runtime.",
    interviewerExpectation: ["fixed-size", "write-through to array", "int[] vs Integer[] boxing", "wrap in new ArrayList to mutate"],
    followUps: [
      "How do you convert a primitive array to a List<Integer> correctly?",
      "Why does set() work but add() throw?",
      "How does List.of differ from Arrays.asList?",
    ],
    commonMistakes: [
      "Calling add/remove on the returned list",
      "Passing a primitive array expecting autoboxing",
      "Assuming it's a defensive copy (it's a view)",
    ],
    bestPractices: [
      "Wrap with new ArrayList<>(...) when you need to mutate",
      "Use streams + boxed() for primitive arrays",
      "Prefer List.of for immutable literals",
    ],
    relatedTech: ["List.of", "IntStream.boxed", "ArrayList"],
    difficulty: "Medium",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["TCS", "Infosys", "Accenture", "Capgemini"],
    related: ["immutable-collections", "arraylist-vs-linkedlist-choice"],
  },
  {
    slug: "priorityqueue-top-k",
    categoryId: "java-collections",
    topic: "Performance",
    question: "How do you find the top-K elements from a large stream efficiently?",
    tags: ["priorityqueue", "heap", "top-k", "coding", "complexity"],
    shortAnswer:
      "Keep a min-heap (PriorityQueue) of size K: push each element, and when size exceeds K pop the smallest. You retain the K largest in O(n log K) time and O(K) space — far better than sorting everything (O(n log n)).",
    mindMap: [
      { type: "text", content: "For top-K **largest**, use a **min-heap** of size K: the smallest of your current best-K sits at the top, ready to be evicted the moment something larger arrives." },
    ],
    handsOn: {
      lang: "java",
      code: `PriorityQueue<Integer> heap = new PriorityQueue<>(); // min-heap
for (int x : stream) {
    heap.offer(x);
    if (heap.size() > k) heap.poll(); // drop smallest
}
// heap now holds the k largest`,
      output: "k largest elements",
      time: "O(n log k)",
      space: "O(k)",
    },
    whatIf: {
      q: "Why a min-heap for top-K largest, not a max-heap?",
      a: "A size-K min-heap keeps the smallest of your current top-K at the root, so you can evict it in O(log K) when a larger element arrives — using only O(K) memory. A max-heap of all n elements needs O(n) space and gains nothing.",
    },
    realWorld:
      "Top-N dashboards (highest-value orders, slowest endpoints, top customers) over huge datasets use a bounded heap so you never load or sort the whole dataset in memory.",
    interviewerExpectation: ["min-heap of size K", "O(n log k) vs O(n log n)", "O(k) space", "bounded memory"],
    followUps: [
      "How does the heap-based approach compare to full sort or QuickSelect?",
      "How would you parallelize top-K across shards?",
      "What Comparator do you use for top-K by a custom field?",
    ],
    commonMistakes: [
      "Sorting the entire dataset to take K",
      "Using a max-heap of all n elements (O(n) space)",
      "Wrong heap direction (min vs max)",
    ],
    bestPractices: [
      "Bound the heap to K for streaming top-K",
      "Use a Comparator for domain objects",
      "Consider QuickSelect for one-shot in-memory top-K",
    ],
    relatedTech: ["PriorityQueue", "Comparator", "QuickSelect", "Stream"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["treemap-navigablemap", "blockingqueue-producer-consumer"],
  },
  {
    slug: "copyonwritearraylist",
    categoryId: "java-collections",
    topic: "ConcurrentHashMap",
    question: "When is CopyOnWriteArrayList the right choice, and when is it a trap?",
    tags: ["copyonwritearraylist", "concurrency", "read-heavy", "listeners"],
    shortAnswer:
      "Use it for read-heavy, rarely-written shared lists (e.g. event listeners, config snapshots). Every write copies the whole array, so it's O(n) per write — a trap for write-heavy data. Iterators are snapshot-based and never throw CME.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Read", v: "lock-free, fast, snapshot iterator" },
          { k: "Write", v: "copies entire array — O(n)" },
          { k: "Good for", v: "many reads, rare writes" },
        ],
      },
    ],
    whatIf: {
      q: "A team uses CopyOnWriteArrayList for a high-frequency write buffer and throughput collapses — why?",
      a: "Each add() copies the entire backing array, so N writes cost O(N²) and churn memory. CopyOnWrite is only for read-mostly data; for write-heavy concurrency use ConcurrentLinkedQueue or a lock + ArrayList, or a different structure.",
    },
    realWorld:
      "Listener/observer registries and rarely-changing config lists read on every request fit CopyOnWriteArrayList perfectly — iteration is lock-free and safe even while another thread updates.",
    interviewerExpectation: ["copy-on-write semantics", "read-heavy use case", "O(n) write cost", "snapshot iterators / no CME"],
    followUps: [
      "How do its iterators avoid ConcurrentModificationException?",
      "What would you use for a write-heavy concurrent list?",
      "How does it compare to synchronizedList?",
    ],
    commonMistakes: [
      "Using it for write-heavy workloads",
      "Expecting iterators to see concurrent writes (they're snapshots)",
      "Assuming it's a general-purpose thread-safe list",
    ],
    bestPractices: [
      "Reserve for read-mostly shared lists",
      "Use ConcurrentLinkedQueue/Deque for high write rates",
      "Measure read:write ratio before choosing",
    ],
    relatedTech: ["ConcurrentLinkedQueue", "Collections.synchronizedList", "ConcurrentHashMap"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Microsoft"],
    related: ["concurrent-modification-exception", "concurrent-counter-collections"],
  },
  {
    slug: "mutable-key-hashmap-bug",
    categoryId: "java-collections",
    topic: "HashMap Internals",
    question: "What happens if you mutate an object after using it as a HashMap key?",
    tags: ["hashmap", "mutable key", "hashcode", "immutability", "bug"],
    shortAnswer:
      "The key's hashCode changes, so it now maps to a different bucket than where it was stored. get() looks in the new bucket and can't find it — the entry becomes a 'ghost': present but unretrievable, and it leaks memory.",
    mindMap: [
      { type: "text", content: "HashMap places a key by its hashCode at insert time. Mutate a field used in hashCode/equals and the key effectively moves — but the entry stays in the old bucket, now **unreachable** by lookup." },
    ],
    handsOn: {
      lang: "java",
      code: `Map<Point,String> m = new HashMap<>();
Point p = new Point(1,1);
m.put(p, "A");
p.setX(99);                 // mutated key!
System.out.println(m.get(p)); // null — wrong bucket`,
      output: "null",
    },
    whatIf: {
      q: "How does this cause a slow memory leak?",
      a: "The 'ghost' entry can never be found or removed via the key, so it stays in the map forever. In a long-lived cache keyed by mutable objects, these orphaned entries accumulate and grow the heap.",
    },
    realWorld:
      "Using mutable JPA entities or DTOs as map/set keys leads to entries 'disappearing' after a field update and to subtle leaks — the reason value objects/keys should be immutable.",
    interviewerExpectation: ["hashCode determines bucket", "mutation moves the key", "entry becomes unreachable", "use immutable keys"],
    followUps: [
      "Why are String and Integer good keys?",
      "How does this relate to JPA entity equals/hashCode?",
      "What fields should hashCode use?",
    ],
    commonMistakes: [
      "Using mutable objects as map/set keys",
      "Including mutable fields in hashCode",
      "Mutating keys held in a cache",
    ],
    bestPractices: [
      "Use immutable keys (String, records, value objects)",
      "Base hashCode on immutable fields only",
      "Never mutate an object while it's a key",
    ],
    relatedTech: ["records", "String/Integer keys", "JPA identity"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Cognizant"],
    related: ["hashmap-internals-java8", "choosing-the-right-collection"],
  },

  // ---------------------------------------------------------------- Hard (6)
  {
    slug: "concurrenthashmap-internals",
    categoryId: "java-collections",
    topic: "ConcurrentHashMap",
    question: "How does ConcurrentHashMap stay thread-safe without locking the whole map (Java 8)?",
    tags: ["concurrenthashmap", "cas", "bin locking", "concurrency", "internals"],
    shortAnswer:
      "Java 8 dropped segment locking. Reads are lock-free (volatile + happens-before). Writes use CAS to install the first node in an empty bin, and synchronize only on that single bin's head node for collisions — so concurrency scales with the number of buckets, not a fixed segment count.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Reads", v: "lock-free (volatile reads)" },
          { k: "Empty bin write", v: "CAS the first node in" },
          { k: "Collision write", v: "synchronized on that bin's head" },
          { k: "Resize", v: "cooperative, multi-thread transfer" },
        ],
      },
    ],
    whatIf: {
      q: "Why must you use compute()/merge() instead of get-then-put for a concurrent counter?",
      a: "get-then-put is a check-then-act race: two threads can read the same value and both overwrite, losing an update. compute()/merge() perform the read-modify-write atomically under the bin lock, so increments are never lost.",
    },
    realWorld:
      "ConcurrentHashMap backs most in-process caches, rate-limit counters and registries. Using merge/compute for atomic updates (not get+put) is the difference between correct and silently-wrong counters under load.",
    interviewerExpectation: ["no segments in Java 8", "CAS + per-bin synchronized", "lock-free reads", "compute/merge atomicity", "no null keys/values"],
    followUps: [
      "Why does ConcurrentHashMap forbid null keys and values?",
      "How does cooperative resizing work?",
      "When would you use LongAdder over CHM for counters?",
    ],
    commonMistakes: [
      "Using get-then-put for atomic updates (lost updates)",
      "Assuming whole-map locking like Hashtable",
      "Putting null keys/values",
    ],
    bestPractices: [
      "Use compute/merge/computeIfAbsent for atomic updates",
      "Prefer CHM over synchronizedMap for concurrency",
      "Use LongAdder for hot counters",
    ],
    relatedTech: ["LongAdder", "CAS", "VarHandle", "Caffeine"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["concurrent-counter-collections", "hashmap-concurrency-corruption"],
  },
  {
    slug: "hashmap-concurrency-corruption",
    categoryId: "java-collections",
    topic: "ConcurrentHashMap",
    question: "Why can a plain HashMap corrupt data — or even spin the CPU — under concurrent access?",
    tags: ["hashmap", "race condition", "infinite loop", "thread-safety", "production"],
    shortAnswer:
      "HashMap isn't thread-safe. Concurrent puts during a resize can lose entries or, in Java 7's linked-list transfer, create a cycle that makes get() spin forever (100% CPU). Java 8 fixed the infinite loop but concurrent use still corrupts data. Use ConcurrentHashMap.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Java 7", v: "resize could create a linked-list cycle → infinite loop" },
          { k: "Java 8", v: "no loop, but lost updates / NPE / wrong size" },
          { k: "Fix", v: "ConcurrentHashMap" },
        ],
      },
    ],
    whatIf: {
      q: "A production thread is pegged at 100% CPU inside HashMap.get() — what happened?",
      a: "Classic Java 7 symptom: two threads resized a shared HashMap concurrently, the linked-list transfer formed a cycle, and now get() traverses that cycle forever. The real fix isn't a thread dump — it's replacing the shared HashMap with ConcurrentHashMap.",
    },
    realWorld:
      "A pegged-CPU incident traced to HashMap.get() in a thread dump is a notorious real-world bug; the root cause is a HashMap shared across threads without synchronization.",
    interviewerExpectation: ["not thread-safe", "resize race", "Java 7 infinite loop", "Java 8 data corruption", "ConcurrentHashMap fix"],
    followUps: [
      "Why is Collections.synchronizedMap not always enough?",
      "How does ConcurrentHashMap avoid this?",
      "How would you detect this from a thread dump?",
    ],
    commonMistakes: [
      "Sharing a HashMap across threads",
      "Assuming synchronizedMap makes compound ops atomic",
      "Treating it as a JVM bug rather than misuse",
    ],
    bestPractices: [
      "Use ConcurrentHashMap for shared maps",
      "Never share a plain HashMap across threads",
      "Guard compound operations with atomic methods",
    ],
    relatedTech: ["ConcurrentHashMap", "Collections.synchronizedMap", "jstack"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["concurrenthashmap-internals", "hashmap-internals-java8"],
  },
  {
    slug: "fail-fast-vs-fail-safe",
    categoryId: "java-collections",
    topic: "Iterators",
    question: "Fail-fast vs fail-safe iterators — how do they work internally?",
    tags: ["fail-fast", "fail-safe", "modcount", "iterator", "snapshot"],
    shortAnswer:
      "Fail-fast iterators (ArrayList, HashMap) track a modCount and throw ConcurrentModificationException if it changes during iteration — best-effort, not guaranteed. Fail-safe iterators (CopyOnWriteArrayList, ConcurrentHashMap) iterate a snapshot/view, so they never throw but may miss recent writes.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Fail-fast", v: "modCount check → CME (best-effort)" },
          { k: "Fail-safe", v: "snapshot/weakly-consistent, no CME" },
          { k: "Trade-off", v: "consistency vs may-miss-updates" },
        ],
      },
    ],
    whatIf: {
      q: "ConcurrentHashMap's iterator is called 'weakly consistent' — what does that mean?",
      a: "It reflects the map's state at some point during iteration and tolerates concurrent modifications without throwing, but it may or may not show entries added after the iterator was created. It never throws CME, unlike fail-fast iterators.",
    },
    realWorld:
      "Choosing a concurrent collection means accepting weakly-consistent iteration (you might miss the very latest write) in exchange for never crashing with CME under concurrency.",
    interviewerExpectation: ["modCount mechanism", "best-effort CME", "snapshot vs weakly-consistent", "no thread-safety guarantee from fail-fast"],
    followUps: [
      "Why is fail-fast only 'best-effort'?",
      "How does CopyOnWriteArrayList's snapshot iterator differ from CHM's weakly-consistent one?",
      "Can a single-threaded program trigger fail-fast?",
    ],
    commonMistakes: [
      "Relying on CME to catch concurrency bugs",
      "Expecting fail-safe iterators to see all concurrent writes",
      "Assuming fail-fast implies thread safety",
    ],
    bestPractices: [
      "Use concurrent collections for shared iteration",
      "Don't depend on CME being thrown",
      "Understand weak consistency before relying on it",
    ],
    relatedTech: ["CopyOnWriteArrayList", "ConcurrentHashMap", "modCount"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["concurrent-modification-exception", "iterator-vs-listiterator"],
  },
  {
    slug: "concurrent-counter-collections",
    categoryId: "java-collections",
    topic: "Performance",
    question: "What's the best collection for high-contention counters — ConcurrentHashMap, AtomicLong, or LongAdder?",
    tags: ["longadder", "atomiclong", "concurrenthashmap", "counters", "contention"],
    shortAnswer:
      "For a single hot counter, LongAdder beats AtomicLong under high contention by striping updates across cells (less CAS retry). For many keyed counters, ConcurrentHashMap<K, LongAdder> with computeIfAbsent gives per-key striped counting.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "AtomicLong", v: "CAS one field — contention spins" },
          { k: "LongAdder", v: "striped cells — high write throughput" },
          { k: "Keyed counts", v: "CHM<K, LongAdder>" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `ConcurrentHashMap<String, LongAdder> hits = new ConcurrentHashMap<>();
hits.computeIfAbsent(endpoint, k -> new LongAdder()).increment();
// read total: hits.get(endpoint).sum();`,
    },
    whatIf: {
      q: "Why does AtomicLong degrade under many threads while LongAdder scales?",
      a: "AtomicLong funnels every increment through one memory location via CAS; under contention threads keep retrying. LongAdder spreads increments across multiple internal cells (one per contended thread), so writes rarely collide; sum() adds the cells when you read.",
    },
    realWorld:
      "Metrics like request counts, hits, and error tallies under heavy concurrency use LongAdder (it's what many metrics libraries use internally) to avoid the CAS bottleneck of AtomicLong.",
    interviewerExpectation: ["CAS contention", "LongAdder striping", "computeIfAbsent for keyed counters", "sum() read cost", "write-heavy vs read-heavy"],
    followUps: [
      "When is AtomicLong still preferable to LongAdder?",
      "Why use computeIfAbsent rather than get-then-put?",
      "How do metrics libraries (Micrometer) implement counters?",
    ],
    commonMistakes: [
      "Using AtomicLong for extremely hot counters",
      "get-then-put races losing increments",
      "Reading LongAdder.sum() in a tight loop (it's not free)",
    ],
    bestPractices: [
      "LongAdder for high-contention write-heavy counters",
      "CHM<K, LongAdder> + computeIfAbsent for keyed metrics",
      "AtomicLong when reads are frequent and contention low",
    ],
    relatedTech: ["LongAdder", "AtomicLong", "Micrometer", "ConcurrentHashMap"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["concurrenthashmap-internals", "copyonwritearraylist"],
  },
  {
    slug: "collection-memory-overhead",
    categoryId: "java-collections",
    topic: "Performance",
    question: "How do you reduce the memory overhead of very large Java collections?",
    tags: ["memory", "autoboxing", "primitive collections", "overhead", "gc"],
    shortAnswer:
      "Standard collections box primitives (an Integer is ~16 bytes vs 4) and add per-entry node/Entry overhead. For millions of primitives use primitive collections (fastutil, Eclipse Collections, Trove), pre-size to avoid waste, and prefer arrays where possible.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Boxing", v: "Integer ≈ 16B vs int 4B" },
          { k: "Per-entry", v: "HashMap.Node ≈ 32–48B each" },
          { k: "Fix", v: "primitive collections / arrays" },
        ],
      },
    ],
    whatIf: {
      q: "A Map<Integer,Integer> with 50M entries OOMs — what do you change?",
      a: "Replace it with a primitive map like fastutil's Int2IntOpenHashMap or Eclipse Collections' IntIntHashMap. You drop both the boxing (16B→4B per number) and the per-Node object overhead, often cutting memory several-fold.",
    },
    realWorld:
      "In-memory analytics, graph processing and large index structures routinely swap java.util maps for fastutil/Eclipse Collections to fit billions of primitives in heap and cut GC pressure.",
    interviewerExpectation: ["boxing cost", "per-entry object overhead", "primitive collections (fastutil/Eclipse/Trove)", "pre-sizing", "arrays where possible"],
    followUps: [
      "How much memory does a boxed Integer actually cost?",
      "When do primitive collections NOT help?",
      "How does object header + alignment affect overhead?",
    ],
    commonMistakes: [
      "Storing millions of boxed primitives in java.util maps",
      "Not pre-sizing (wasted capacity)",
      "Ignoring per-entry node overhead",
    ],
    bestPractices: [
      "Use primitive collections for large primitive datasets",
      "Pre-size to avoid over-allocation",
      "Measure with a profiler / JOL before optimizing",
    ],
    relatedTech: ["fastutil", "Eclipse Collections", "Trove", "JOL", "arrays"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Deloitte"],
    related: ["hashmap-resize-load-factor", "arraylist-vs-linkedlist-choice"],
  },
  {
    slug: "blockingqueue-producer-consumer",
    categoryId: "java-collections",
    topic: "ConcurrentHashMap",
    question: "How do you implement a bounded producer-consumer pipeline with BlockingQueue?",
    tags: ["blockingqueue", "producer-consumer", "backpressure", "concurrency"],
    shortAnswer:
      "Use a bounded ArrayBlockingQueue: producers call put() (blocks when full → backpressure), consumers call take() (blocks when empty). Bounding is the key — it prevents producers from outrunning consumers and exhausting memory. Use a poison pill or interrupt to stop.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "put()", v: "blocks when full → backpressure" },
          { k: "take()", v: "blocks when empty" },
          { k: "Bounded", v: "caps memory, applies pressure" },
          { k: "Stop", v: "poison pill / interrupt" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `BlockingQueue<Task> q = new ArrayBlockingQueue<>(1000);
// producer
q.put(task);          // blocks if full
// consumer
Task t = q.take();    // blocks if empty
if (t == POISON) break;`,
    },
    whatIf: {
      q: "Why is an UNBOUNDED LinkedBlockingQueue dangerous in a thread pool?",
      a: "An unbounded queue accepts work forever, so if consumers can't keep up the queue grows until OutOfMemoryError — and a fixed thread pool with an unbounded queue never creates more threads. Bound the queue (and set a RejectedExecutionHandler) to apply backpressure.",
    },
    realWorld:
      "Ingestion pipelines, log shippers and job processors rely on bounded BlockingQueues for backpressure; an accidental unbounded queue is a classic cause of slow-burn OOM in production.",
    interviewerExpectation: ["bounded vs unbounded", "put/take blocking", "backpressure", "poison pill / interrupt", "ThreadPoolExecutor queue choice"],
    followUps: [
      "How does this map to ThreadPoolExecutor's work queue?",
      "How do you cleanly shut down producers and consumers?",
      "When use SynchronousQueue vs ArrayBlockingQueue?",
    ],
    commonMistakes: [
      "Using an unbounded queue (OOM risk)",
      "Busy-waiting instead of blocking take()",
      "No clean shutdown signal",
    ],
    bestPractices: [
      "Bound the queue to apply backpressure",
      "Use poison pills / interrupts for shutdown",
      "Tune ThreadPoolExecutor queue + rejection policy",
    ],
    relatedTech: ["ArrayBlockingQueue", "ThreadPoolExecutor", "SynchronousQueue", "Disruptor"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "Deloitte"],
    related: ["priorityqueue-top-k", "concurrent-counter-collections"],
  },
];
