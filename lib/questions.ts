import type { Question } from "./types";

export const questions: Question[] = [
  {
    slug: "what-is-hashmap",
    categoryId: "core-java",
    topic: "Collections",
    question: "What is a HashMap?",
    mindMap: [
      { type: "text", content: "Think of a HashMap as the **contacts app on your phone**. You don't scroll through every number — you type a name (the key) and instantly get the number (the value)." },
      {
        type: "kv",
        rows: [
          { k: "Name", v: "John" },
          { k: "ID", v: "101" },
          { k: "Role", v: "Engineer" },
        ],
      },
      { type: "text", content: "It stores `key → value` pairs and gives you near O(1) lookup by hashing the key to find its bucket. Keys are unique; values can repeat. It is not ordered and not thread-safe." },
    ],
    handsOn: {
      lang: "java",
      code: `HashMap<String, Integer> map = new HashMap<>();
map.put("A", 1);
map.put("B", 2);

System.out.println(map.get("A"));`,
      output: "1",
    },
    whatIf: {
      q: "What happens when two keys produce the same hashcode?",
      a: "A collision occurs. Java handles it internally by chaining entries in the same bucket (a linked list, which converts to a balanced tree once a bucket holds 8+ entries). Lookup then uses equals() to find the right key.",
    },
    realWorld: "You reach for a HashMap constantly without thinking — caching DB lookups by id, counting word frequencies, deduplicating records, grouping orders by customer. Any time you catch yourself looping to 'find the one that matches', a HashMap probably belongs there.",
    interviewerExpectation: ["O(1) average lookup", "hashing → bucket", "collision handling", "not thread-safe", "ConcurrentHashMap for concurrency"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "TCS", "Accenture"],
    related: ["hashmap-vs-hashtable", "java-equals-hashcode", "what-is-arraylist"],
  },
  {
    slug: "hashmap-vs-hashtable",
    categoryId: "core-java",
    topic: "Collections",
    question: "What is the difference between HashMap and Hashtable?",
    mindMap: [
      { type: "text", content: "Same idea — key/value storage — but built for different eras." },
      {
        type: "kv",
        rows: [
          { k: "HashMap", v: "Not synchronized, fast, allows 1 null key" },
          { k: "Hashtable", v: "Synchronized, slower, no null keys/values" },
          { k: "Modern pick", v: "ConcurrentHashMap for thread safety" },
        ],
      },
      { type: "text", content: "Rule of thumb: use HashMap by default. If you need concurrency, reach for ConcurrentHashMap — Hashtable is legacy." },
    ],
    handsOn: {
      lang: "java",
      code: `Map<String, String> map = new HashMap<>();
map.put(null, "ok"); // allowed

Map<String, String> table = new Hashtable<>();
// table.put(null, "x"); // throws NullPointerException`,
    },
    whatIf: {
      q: "Why is Hashtable considered slow?",
      a: "Every method is synchronized, so only one thread touches the table at a time. ConcurrentHashMap locks only a segment/bucket, allowing concurrent reads and writes.",
    },
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Deloitte", "Infosys", "Accenture"],
    related: ["what-is-hashmap", "java-equals-hashcode"],
  },
  {
    slug: "java-equals-hashcode",
    categoryId: "core-java",
    topic: "OOP",
    question: "Why must you override equals() and hashCode() together?",
    mindMap: [
      { type: "text", content: "They are a contract. If two objects are equal, they must return the same hashCode — otherwise hash-based collections break." },
      {
        type: "kv",
        rows: [
          { k: "equals()", v: "Are these two objects logically the same?" },
          { k: "hashCode()", v: "Which bucket does this object live in?" },
        ],
      },
      { type: "text", content: "Override only equals() and a HashSet may store duplicates. Override only hashCode() and lookups may fail to find a matching key." },
    ],
    handsOn: {
      lang: "java",
      code: `record User(int id, String name) {}
// records auto-generate equals() & hashCode()

Set<User> set = new HashSet<>();
set.add(new User(1, "John"));
System.out.println(set.contains(new User(1, "John")));`,
      output: "true",
    },
    whatIf: {
      q: "What if hashCode() always returns a constant like 1?",
      a: "It is technically valid, but every entry lands in the same bucket — the HashMap degrades to a list and lookups become O(n).",
    },
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte"],
    related: ["what-is-hashmap", "hashmap-vs-hashtable"],
  },
  {
    slug: "what-is-arraylist",
    categoryId: "core-java",
    topic: "Collections",
    question: "How does an ArrayList grow internally?",
    mindMap: [
      { type: "text", content: "An ArrayList is a row of **theatre seats** 🎭, numbered 0,1,2… You jump straight to seat 7 (index access) instantly. But when the row is full, you can't stretch it — you book a bigger hall (1.5× array) and walk everyone over to their new seats." },
      {
        type: "kv",
        rows: [
          { k: "Default capacity", v: "10" },
          { k: "Growth factor", v: "~1.5x (oldCap + oldCap/2)" },
          { k: "Access", v: "O(1) by index" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `List<String> list = new ArrayList<>();
list.add("a");
list.add("b");
System.out.println(list.get(1));`,
      output: "b",
    },
    whatIf: {
      q: "ArrayList vs LinkedList — which for frequent insertions in the middle?",
      a: "LinkedList — O(1) insert once you hold the node. But ArrayList wins on random access and cache locality, so it is the default choice most of the time.",
    },
    realWorld: "ArrayList is the default 'list' you reach for 95% of the time — collecting query results, building a response payload, iterating in order. You only switch away from it when profiling proves random insert/delete in the middle is a real bottleneck.",
    interviewerExpectation: ["resizable array", "O(1) index access", "amortized growth (1.5x)", "vs LinkedList trade-offs"],
    difficulty: "Easy",
    experience: ["0-2 years"],
    askedIn: ["Infosys", "TCS", "Accenture"],
    related: ["what-is-hashmap", "linkedlist-train", "what-is-queue"],
  },
  {
    slug: "java-stream-api",
    categoryId: "java-8",
    topic: "Stream API",
    question: "What is the Stream API and how is it different from a loop?",
    mindMap: [
      { type: "text", content: "A Stream is a pipeline for processing collections declaratively — you describe what you want, not how to iterate." },
      {
        type: "kv",
        rows: [
          { k: "Intermediate ops", v: "filter, map, sorted (lazy)" },
          { k: "Terminal ops", v: "collect, forEach, reduce (trigger work)" },
          { k: "Key trait", v: "Lazy + can be parallelized" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);
int sum = nums.stream()
              .filter(n -> n % 2 == 0)
              .mapToInt(Integer::intValue)
              .sum();
System.out.println(sum);`,
      output: "12",
    },
    whatIf: {
      q: "Can you reuse a stream after a terminal operation?",
      a: "No. A stream is consumed once. Calling another terminal op throws IllegalStateException — create a fresh stream from the source instead.",
    },
    realWorld: "Most real code uses Streams to reshape collections from a service or DB: filter active users, map them to DTOs, group by region, sum a total. It replaces the noisy for-loop + temp-list boilerplate with one readable pipeline.",
    interviewerExpectation: ["lazy evaluation", "intermediate vs terminal ops", "consumed once", "collect / reduce", "parallel streams trade-offs"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Accenture"],
    related: ["java-optional"],
  },
  {
    slug: "java-optional",
    categoryId: "java-8",
    topic: "Optional",
    question: "What problem does Optional solve?",
    mindMap: [
      { type: "text", content: "Optional is a **gift box** 🎁. It might have a present inside, it might be empty — but either way you're handed a box, never a `null`. You open it safely instead of grabbing at thin air." },
      {
        type: "kv",
        rows: [
          { k: "Optional.of(x)", v: "x must be non-null" },
          { k: "Optional.empty()", v: "no value" },
          { k: "orElse / orElseGet", v: "supply a fallback" },
        ],
      },
      { type: "text", content: "The goal is to push you to handle the 'missing' case at compile time and avoid NullPointerExceptions." },
    ],
    handsOn: {
      lang: "java",
      code: `Optional<String> name = Optional.ofNullable(null);
System.out.println(name.orElse("Guest"));`,
      output: "Guest",
    },
    whatIf: {
      q: "Should you use Optional as a field or method parameter?",
      a: "No — it is designed as a return type. As a field it adds overhead and is not serializable; as a parameter it just shifts the null check to the caller.",
    },
    realWorld: "Repository methods that 'might not find a row' return Optional<User> instead of null — the caller is forced to handle the empty case, so the dreaded NullPointerException simply stops appearing in your stack traces.",
    interviewerExpectation: ["avoids null", "orElse / orElseGet / orElseThrow", "return type not field", "map / filter chaining"],
    difficulty: "Easy",
    experience: ["3-5 years"],
    askedIn: ["Infosys", "TCS"],
    related: ["java-stream-api"],
  },
  {
    slug: "python-list-vs-tuple",
    categoryId: "python",
    topic: "Lists & Dicts",
    question: "What is the difference between a list and a tuple in Python?",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "List", v: "Mutable, [] , can grow/shrink" },
          { k: "Tuple", v: "Immutable, () , fixed once created" },
          { k: "Bonus", v: "Tuples can be dict keys; lists cannot" },
        ],
      },
      { type: "text", content: "Use a tuple when the data should not change (coordinates, DB rows). Use a list when you will modify it." },
    ],
    handsOn: {
      lang: "python",
      code: `nums = [1, 2, 3]
nums.append(4)        # ok

point = (10, 20)
# point[0] = 99       # TypeError: immutable
print(nums, point)`,
      output: "[1, 2, 3, 4] (10, 20)",
    },
    whatIf: {
      q: "Why can a tuple be a dictionary key but a list cannot?",
      a: "Dict keys must be hashable, and hashability requires immutability. Lists are mutable, so they are unhashable; tuples (of hashable items) are hashable.",
    },
    difficulty: "Easy",
    experience: ["0-2 years"],
    askedIn: ["Infosys", "TCS", "Accenture"],
    related: ["python-decorators"],
  },
  {
    slug: "python-decorators",
    categoryId: "python",
    topic: "Decorators",
    question: "What is a decorator in Python?",
    mindMap: [
      { type: "text", content: "A decorator is a function that wraps another function to add behavior — logging, timing, auth — without changing its code." },
      {
        type: "kv",
        rows: [
          { k: "Pattern", v: "Takes a function, returns a function" },
          { k: "Syntax", v: "@decorator above the def" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `def shout(fn):
    def wrapper(*a, **k):
        return fn(*a, **k).upper()
    return wrapper

@shout
def greet(name):
    return f"hi {name}"

print(greet("john"))`,
      output: "HI JOHN",
    },
    whatIf: {
      q: "How do you preserve the original function's name and docstring?",
      a: "Wrap the inner function with functools.wraps(fn). Otherwise the decorated function reports the wrapper's metadata instead of the original's.",
    },
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte"],
    related: ["python-list-vs-tuple"],
  },
  {
    slug: "rest-idempotency",
    categoryId: "rest-apis",
    topic: "Idempotency",
    question: "Which HTTP methods are idempotent and why does it matter?",
    mindMap: [
      { type: "text", content: "Idempotent = calling it once or many times has the same effect on the server. It matters for safe retries on flaky networks." },
      {
        type: "kv",
        rows: [
          { k: "GET, PUT, DELETE", v: "Idempotent ✅" },
          { k: "POST", v: "Not idempotent ❌" },
          { k: "Why", v: "Clients can safely retry idempotent calls" },
        ],
      },
    ],
    handsOn: {
      lang: "http",
      code: `PUT /users/101
{ "name": "John" }

# Call it 5 times → user 101 still just has name "John"
# POST /users called 5 times → 5 new users`,
    },
    whatIf: {
      q: "How do you make POST safe to retry?",
      a: "Use an idempotency key — the client sends a unique header (e.g. Idempotency-Key) and the server returns the original result for duplicates instead of creating a new resource.",
    },
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Accenture"],
    related: ["rest-status-codes", "what-is-jwt"],
  },
  {
    slug: "rest-status-codes",
    categoryId: "rest-apis",
    topic: "Status Codes",
    question: "Explain the main HTTP status code families.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "2xx", v: "Success — 200 OK, 201 Created, 204 No Content" },
          { k: "3xx", v: "Redirect — 301 Moved, 304 Not Modified" },
          { k: "4xx", v: "Client error — 400, 401, 403, 404, 429" },
          { k: "5xx", v: "Server error — 500, 502, 503" },
        ],
      },
      { type: "text", content: "Quick read: 4xx is 'you messed up', 5xx is 'we messed up'." },
    ],
    whatIf: {
      q: "What is the difference between 401 and 403?",
      a: "401 Unauthorized means 'we don't know who you are' (authenticate first). 403 Forbidden means 'we know who you are, but you are not allowed here'.",
    },
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture"],
    related: ["rest-idempotency", "what-is-jwt"],
  },
  {
    slug: "what-is-jwt",
    categoryId: "rest-apis",
    topic: "Auth",
    question: "What is a JWT and how does it work?",
    mindMap: [
      { type: "text", content: "A JWT is a **movie ticket** 🎬. The cinema doesn't keep a list of who bought tickets — your stub already proves you paid, and the watermark (signature) proves it's not forged. The server stays stateless." },
      {
        type: "kv",
        rows: [
          { k: "Header", v: "algorithm & type" },
          { k: "Payload", v: "claims (user id, roles, exp)" },
          { k: "Signature", v: "verifies it was not tampered with" },
        ],
      },
      { type: "text", content: "Format: header.payload.signature — three Base64 parts joined by dots." },
    ],
    handsOn: {
      lang: "text",
      code: `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMDEiLCJyb2xlIjoiYWRtaW4ifQ.S1g...
   ^header              ^payload                        ^signature`,
    },
    whatIf: {
      q: "If the payload is just Base64, can anyone read it?",
      a: "Yes — JWTs are signed, not encrypted. Never put secrets in the payload. The signature only guarantees integrity, not confidentiality.",
    },
    realWorld: "After login your API returns a JWT; the frontend stores it and sends it in the Authorization header on every request. Each microservice verifies the signature locally — no shared session store, which is exactly why JWTs scale so well across services.",
    interviewerExpectation: ["stateless auth", "header.payload.signature", "signed not encrypted", "expiry (exp)", "never store secrets in payload"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte"],
    related: ["rest-status-codes", "rest-idempotency"],
  },
  {
    slug: "sql-joins",
    categoryId: "sql",
    topic: "Joins",
    question: "Explain INNER JOIN vs LEFT JOIN.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "INNER JOIN", v: "Only rows that match in both tables" },
          { k: "LEFT JOIN", v: "All left rows + matches (NULLs if none)" },
          { k: "RIGHT JOIN", v: "Mirror of LEFT" },
        ],
      },
      { type: "text", content: "Picture two overlapping circles: INNER is the overlap, LEFT is the whole left circle plus the overlap." },
    ],
    handsOn: {
      lang: "sql",
      code: `SELECT u.name, o.id
FROM users u
LEFT JOIN orders o ON o.user_id = u.id;
-- users with no orders still appear, o.id is NULL`,
    },
    whatIf: {
      q: "How do you find users who have NO orders?",
      a: "LEFT JOIN orders and filter WHERE o.id IS NULL — the anti-join pattern that returns only unmatched left rows.",
    },
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Deloitte"],
    related: ["sql-index"],
  },
  {
    slug: "sql-index",
    categoryId: "sql",
    topic: "Indexes",
    question: "What is a database index and what is the trade-off?",
    mindMap: [
      { type: "text", content: "An index is like a book's index — instead of scanning every page (row), the DB jumps straight to the data." },
      {
        type: "kv",
        rows: [
          { k: "Speeds up", v: "SELECT / WHERE / JOIN lookups" },
          { k: "Slows down", v: "INSERT / UPDATE / DELETE (index upkeep)" },
          { k: "Costs", v: "Extra storage" },
        ],
      },
    ],
    handsOn: {
      lang: "sql",
      code: `CREATE INDEX idx_users_email ON users(email);
-- now WHERE email = ? uses a B-tree seek, not a full scan`,
    },
    whatIf: {
      q: "Why might the database ignore your index?",
      a: "If a query returns a large fraction of the table, a full scan is cheaper than many random index seeks — so the optimizer skips the index. Low-selectivity columns rarely benefit.",
    },
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte"],
    related: ["sql-joins"],
  },
  {
    slug: "aws-s3-vs-ebs",
    categoryId: "aws",
    topic: "S3",
    question: "What is the difference between S3 and EBS?",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "S3", v: "Object storage, accessed over HTTP, virtually infinite" },
          { k: "EBS", v: "Block storage, a disk attached to one EC2 instance" },
          { k: "Analogy", v: "S3 = Dropbox, EBS = your laptop's SSD" },
        ],
      },
    ],
    handsOn: {
      lang: "bash",
      code: `aws s3 cp report.pdf s3://my-bucket/reports/
aws s3 ls s3://my-bucket/reports/`,
    },
    whatIf: {
      q: "Where would you store a database's data files — S3 or EBS?",
      a: "EBS. Databases need low-latency block access and random reads/writes. S3 is for objects (backups, media, static assets), not live block I/O.",
    },
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Accenture"],
    related: ["aws-lambda"],
  },
  {
    slug: "aws-lambda",
    categoryId: "aws",
    topic: "Lambda",
    question: "What is AWS Lambda and when would you use it?",
    mindMap: [
      { type: "text", content: "Lambda is a **taxi driver** 🚕. You don't own the car or keep it idling in a garage — one shows up when you need a ride (an event), drives, and you pay only for the trip. No passengers, no cost." },
      {
        type: "kv",
        rows: [
          { k: "Triggers", v: "API Gateway, S3, DynamoDB, EventBridge" },
          { k: "Bills", v: "Per request + duration" },
          { k: "Best for", v: "Spiky, event-driven, short tasks" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `def handler(event, context):
    name = event.get("name", "world")
    return {"statusCode": 200, "body": f"Hello {name}"}`,
    },
    whatIf: {
      q: "What is a cold start and how do you reduce it?",
      a: "The first invocation after idle has to spin up the runtime — that delay is a cold start. Reduce it with provisioned concurrency, smaller packages, and lighter runtimes.",
    },
    realWorld: "Teams use Lambda for the 'glue' work: resize an image the moment it lands in S3, process a queue message, run a nightly cron, back a lightweight API. It shines for spiky, event-driven jobs where keeping a server running 24/7 would be wasteful.",
    interviewerExpectation: ["serverless", "event-driven", "pay-per-use", "cold start", "stateless", "15-min max runtime"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte"],
    related: ["aws-s3-vs-ebs"],
  },
  {
    slug: "docker-image-vs-container",
    categoryId: "docker",
    topic: "Images",
    question: "What is the difference between a Docker image and a container?",
    mindMap: [
      { type: "text", content: "Docker is the **shipping container** 📦 of software. A ship doesn't care what's inside the box — it just moves a standard container. Your app + its dependencies are sealed in an image, and it runs the same on your laptop, CI, and prod." },
      {
        type: "kv",
        rows: [
          { k: "Image", v: "The blueprint / class — read-only, layered" },
          { k: "Container", v: "A running instance of that image" },
          { k: "Analogy", v: "Image = recipe, Container = the cooked dish" },
        ],
      },
    ],
    handsOn: {
      lang: "bash",
      code: `docker build -t myapp .        # create an image
docker run -d -p 8080:80 myapp # start a container`,
    },
    whatIf: {
      q: "Why is a Dockerfile's layer order important for caching?",
      a: "Docker caches each layer. Put rarely-changing steps (installing deps) before frequently-changing ones (copying source) so a code change does not bust the dependency cache.",
    },
    realWorld: "Docker kills the 'works on my machine' excuse. The same image your teammate built runs in CI and ships to prod unchanged — no more chasing a missing library or a different JDK version across environments.",
    interviewerExpectation: ["image = template, container = instance", "layered filesystem", "portability", "isolation", "Dockerfile caching"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "Accenture", "Deloitte"],
    related: ["k8s-pod"],
  },
  {
    slug: "k8s-pod",
    categoryId: "kubernetes",
    topic: "Pods",
    question: "What is a Pod in Kubernetes?",
    mindMap: [
      { type: "text", content: "If Docker containers are dishes, **Kubernetes is the restaurant manager** 🧑‍🍳 — it decides which kitchen (node) cooks what, replaces a chef who quits, and adds chefs when the dinner rush hits. A **Pod** is one table's worth of tightly-coupled dishes served together." },
      {
        type: "kv",
        rows: [
          { k: "Shares", v: "IP, port space, volumes" },
          { k: "Usually", v: "1 main container per Pod" },
          { k: "Managed by", v: "Deployments / ReplicaSets" },
        ],
      },
    ],
    handsOn: {
      lang: "yaml",
      code: `apiVersion: v1
kind: Pod
metadata:
  name: web
spec:
  containers:
    - name: nginx
      image: nginx:1.27`,
    },
    whatIf: {
      q: "If a Pod dies, does Kubernetes bring it back?",
      a: "Not a bare Pod — but a Deployment will. Its ReplicaSet notices the desired count is off and schedules a replacement. That self-healing is why you rarely create bare Pods.",
    },
    realWorld: "You almost never write a bare Pod in practice — you write a Deployment YAML and let Kubernetes keep N replicas alive, roll out new versions with zero downtime, and restart anything that crashes at 3am so nobody gets paged.",
    interviewerExpectation: ["smallest deployable unit", "shared network/storage", "managed by Deployment/ReplicaSet", "self-healing", "desired state"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte"],
    related: ["docker-image-vs-container"],
  },
  {
    slug: "git-merge-vs-rebase",
    categoryId: "git",
    topic: "Merge vs Rebase",
    question: "What is the difference between git merge and git rebase?",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Merge", v: "Combines branches, keeps history, adds a merge commit" },
          { k: "Rebase", v: "Replays your commits on top — linear history" },
          { k: "Golden rule", v: "Never rebase shared/public branches" },
        ],
      },
    ],
    handsOn: {
      lang: "bash",
      code: `git checkout feature
git rebase main     # replay feature commits on latest main
# vs
git merge main      # creates a merge commit`,
    },
    whatIf: {
      q: "Why is rebasing a shared branch dangerous?",
      a: "Rebase rewrites commit hashes. If teammates already pulled those commits, their history diverges and they get painful conflicts on the next pull.",
    },
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Deloitte", "Accenture"],
    related: [],
  },
  {
    slug: "linux-file-permissions",
    categoryId: "linux",
    topic: "Permissions",
    question: "Explain Linux file permissions and chmod 755.",
    mindMap: [
      { type: "text", content: "Every file has three permission groups: owner, group, others — each with read(4), write(2), execute(1)." },
      {
        type: "kv",
        rows: [
          { k: "7 = 4+2+1", v: "owner: read + write + execute" },
          { k: "5 = 4+0+1", v: "group: read + execute" },
          { k: "5 = 4+0+1", v: "others: read + execute" },
        ],
      },
    ],
    handsOn: {
      lang: "bash",
      code: `chmod 755 deploy.sh
ls -l deploy.sh
# -rwxr-xr-x  owner can edit+run, everyone else can run`,
    },
    whatIf: {
      q: "What does chmod +x file actually change?",
      a: "It adds the execute bit for all three groups (owner, group, others) without touching read/write — a shortcut when you just need to make a script runnable.",
    },
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS"],
    related: [],
  },
  {
    slug: "ai-tokens-embeddings",
    categoryId: "ai-basics",
    topic: "Tokens",
    question: "What are tokens and embeddings in an LLM?",
    mindMap: [
      { type: "text", content: "A token is a chunk of text (roughly ¾ of a word). An embedding is that token turned into a list of numbers capturing its meaning." },
      {
        type: "kv",
        rows: [
          { k: "Token", v: '"interview" → maybe 1–2 tokens' },
          { k: "Embedding", v: "[0.12, -0.4, 0.9, ...] vector" },
          { k: "Why", v: "Similar meanings → nearby vectors" },
        ],
      },
    ],
    whatIf: {
      q: "Why do longer prompts cost more?",
      a: "Models bill per token for both input and output. More words means more tokens to process, which means more compute and higher cost — plus you can hit the context window limit.",
    },
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Deloitte"],
    related: ["prompt-few-shot"],
  },
  {
    slug: "prompt-few-shot",
    categoryId: "prompt-engineering",
    topic: "Few-shot",
    question: "What is few-shot prompting?",
    mindMap: [
      { type: "text", content: "Few-shot means giving the model a handful of examples in the prompt so it learns the pattern before answering — no retraining needed." },
      {
        type: "kv",
        rows: [
          { k: "Zero-shot", v: "Just ask, no examples" },
          { k: "Few-shot", v: "Show 2–5 examples first" },
          { k: "Benefit", v: "Steers format & tone reliably" },
        ],
      },
    ],
    handsOn: {
      lang: "text",
      code: `Classify sentiment.
"Loved it!" -> positive
"Waste of money" -> negative
"It was fine" ->`,
      output: "neutral",
    },
    whatIf: {
      q: "When is few-shot worse than zero-shot?",
      a: "When examples are biased or eat your context budget. Strong instruction-following models often do as well zero-shot, and bad examples can actively mislead the output.",
    },
    difficulty: "Medium",
    experience: ["3-5 years"],
    askedIn: ["Amazon"],
    related: ["ai-tokens-embeddings"],
  },
  {
    slug: "design-url-shortener",
    categoryId: "system-design",
    topic: "Scaling",
    question: "How would you design a URL shortener like bit.ly?",
    mindMap: [
      { type: "text", content: "Core job: map a short code to a long URL, then redirect. The interesting parts are the key generation and the read-heavy scale." },
      {
        type: "kv",
        rows: [
          { k: "Write", v: "Generate unique short code → store mapping" },
          { k: "Read", v: "Look up code → 301 redirect" },
          { k: "Scale", v: "Cache hot links, read replicas, CDN" },
          { k: "Keys", v: "Base62 of an ID counter, or hash + collision check" },
        ],
      },
    ],
    whatIf: {
      q: "How do you guarantee short codes are unique without a central bottleneck?",
      a: "Pre-allocate ranges of IDs to each app server (a key-generation service hands out blocks), or use a distributed counter like a ZooKeeper/Snowflake-style ID. Each server then Base62-encodes from its own range — no contention.",
    },
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Deloitte"],
    related: ["sql-index"],
  },
  {
    slug: "two-sum",
    categoryId: "coding-challenges",
    topic: "HashMaps",
    question: "Solve Two Sum — return indices of two numbers adding to a target.",
    mindMap: [
      { type: "text", content: "Brute force is O(n²) with nested loops. The trick: as you scan, remember what you have seen in a HashMap so you can look up the complement in O(1)." },
      {
        type: "kv",
        rows: [
          { k: "Need", v: "target - current" },
          { k: "Store", v: "value → index seen so far" },
          { k: "Time", v: "O(n), one pass" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i

print(two_sum([2, 7, 11, 15], 9))`,
      output: "[0, 1]",
    },
    whatIf: {
      q: "What if the array is already sorted?",
      a: "Use the two-pointer technique — one at each end, move them inward based on the sum. That is O(n) time and O(1) space, beating the HashMap on memory.",
    },
    realWorld: "Two Sum is the 'hello world' of the HashMap-for-lookup pattern. The same trick — remember what you've seen so the complement is O(1) — shows up in deduplication, caching, and detecting pairs/anagrams across real codebases.",
    interviewerExpectation: ["brute force O(n²) first", "HashMap → O(n)", "space-time trade-off", "two-pointer if sorted"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Accenture", "Deloitte"],
    related: ["what-is-hashmap"],
  },
  {
    slug: "behavioral-conflict",
    categoryId: "behavioral",
    topic: "Conflict",
    question: "Tell me about a time you disagreed with a teammate.",
    mindMap: [
      { type: "text", content: "Answer with STAR — and make sure the story ends in a constructive outcome, not in who 'won'." },
      {
        type: "kv",
        rows: [
          { k: "Situation", v: "Set the scene briefly" },
          { k: "Task", v: "What you were responsible for" },
          { k: "Action", v: "What YOU did to resolve it" },
          { k: "Result", v: "Outcome + what you learned" },
        ],
      },
    ],
    whatIf: {
      q: "What is the interviewer really listening for?",
      a: "Not the conflict itself — they want to see that you disagree respectfully, use data over ego, and prioritize the team/product outcome. Avoid blaming the other person.",
    },
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Accenture"],
    related: [],
  },
  {
    slug: "json-vs-xml",
    categoryId: "json",
    topic: "JSON vs XML",
    question: "Why did JSON largely replace XML for APIs?",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "JSON", v: "Lightweight, maps to objects, less verbose" },
          { k: "XML", v: "Verbose tags, supports schemas/namespaces" },
          { k: "Winner for APIs", v: "JSON — smaller payloads, native JS parsing" },
        ],
      },
    ],
    handsOn: {
      lang: "json",
      code: `{
  "name": "John",
  "id": 101,
  "skills": ["Java", "AWS"]
}`,
    },
    whatIf: {
      q: "When would XML still be the right choice?",
      a: "When you need rich document markup, schema validation (XSD), namespaces, or you are integrating with SOAP/legacy enterprise systems that mandate it.",
    },
    difficulty: "Easy",
    experience: ["0-2 years"],
    askedIn: ["Infosys", "TCS"],
    related: ["rest-status-codes"],
  },
  {
    slug: "what-is-queue",
    categoryId: "core-java",
    topic: "Collections",
    question: "What is a Queue and when would you use one?",
    mindMap: [
      { type: "text", content: "A Queue is the **railway ticket counter** 🎫 — first person in line is the first served. **FIFO**: First In, First Out. New people join the back; service happens at the front." },
      {
        type: "kv",
        rows: [
          { k: "offer() / add()", v: "join the back of the line" },
          { k: "poll() / remove()", v: "serve the front" },
          { k: "peek()", v: "who's next, without serving" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `Queue<String> line = new LinkedList<>();
line.offer("Alice");
line.offer("Bob");
System.out.println(line.poll());`,
      output: "Alice",
    },
    whatIf: {
      q: "How is a Deque different from a Queue?",
      a: "A Deque (double-ended queue) lets you add/remove at BOTH ends, so it can act as a queue or a stack. ArrayDeque is the modern, faster choice over Stack and LinkedList for most cases.",
    },
    realWorld: "Queues model real waiting lines in code: background job processing, rate limiting, BFS traversal, and producer–consumer pipelines where one part of the system hands work to another.",
    interviewerExpectation: ["FIFO", "offer/poll/peek", "ArrayDeque vs LinkedList", "Deque", "BFS uses a queue"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture"],
    related: ["what-is-stack", "linkedlist-train", "what-is-arraylist"],
  },
  {
    slug: "what-is-stack",
    categoryId: "core-java",
    topic: "Collections",
    question: "What is a Stack and how does it differ from a Queue?",
    mindMap: [
      { type: "text", content: "A Stack is the **pile of plates** 🍽️ in a hotel buffet. You add a clean plate on top and take the top one off. **LIFO**: Last In, First Out — the last plate placed is the first one used." },
      {
        type: "kv",
        rows: [
          { k: "push()", v: "place a plate on top" },
          { k: "pop()", v: "take the top plate" },
          { k: "peek()", v: "look at the top plate" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
stack.push(2);
System.out.println(stack.pop());`,
      output: "2",
    },
    whatIf: {
      q: "Where do you secretly use a stack every day?",
      a: "The JVM call stack — every method call pushes a frame and returns by popping it. Recursion, undo/redo, and expression evaluation all ride on stacks too.",
    },
    realWorld: "Undo/redo in editors, the browser back button, parsing brackets/JSON, and the call stack behind every recursive function are all stacks in disguise.",
    interviewerExpectation: ["LIFO", "push/pop/peek", "ArrayDeque over legacy Stack", "call stack", "recursion"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "Accenture"],
    related: ["what-is-queue", "two-sum"],
  },
  {
    slug: "linkedlist-train",
    categoryId: "core-java",
    topic: "Collections",
    question: "How does a LinkedList work, and when beats ArrayList?",
    mindMap: [
      { type: "text", content: "A LinkedList is a **train** 🚂. Each compartment (node) holds cargo and a coupling to the next. To find compartment 7 you walk from the engine — no jumping. But to insert a new compartment, you just re-hook two couplings." },
      {
        type: "kv",
        rows: [
          { k: "Access by index", v: "O(n) — walk the chain" },
          { k: "Insert/remove (with node)", v: "O(1) — re-link" },
          { k: "Memory", v: "extra pointers per node" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `LinkedList<String> train = new LinkedList<>();
train.add("A");
train.addFirst("Engine");
System.out.println(train.getFirst());`,
      output: "Engine",
    },
    whatIf: {
      q: "If LinkedList has O(1) inserts, why is ArrayList usually faster?",
      a: "CPU cache locality. An ArrayList's elements sit contiguously in memory so the CPU prefetches them; a LinkedList scatters nodes across the heap, causing cache misses that dwarf the theoretical Big-O win.",
    },
    realWorld: "In practice ArrayList wins almost always. LinkedList earns its keep as a Queue/Deque (add/remove at the ends) — which is exactly how it's most often used in real Java code.",
    interviewerExpectation: ["doubly-linked nodes", "O(1) ends, O(n) middle access", "cache locality", "good as a Deque"],
    difficulty: "Medium",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "Deloitte", "TCS"],
    related: ["what-is-arraylist", "what-is-queue"],
  },
  {
    slug: "rest-waiter",
    categoryId: "rest-apis",
    topic: "HTTP Methods",
    question: "Explain REST and the main HTTP verbs.",
    mindMap: [
      { type: "text", content: "A REST API is a **restaurant waiter** 🧑‍🍳. You (client) don't barge into the kitchen (server/DB). You give the waiter a clear order, they fetch it and bring back a result. The verbs are how you phrase the order." },
      {
        type: "kv",
        rows: [
          { k: "GET", v: "“Show me the menu” — read" },
          { k: "POST", v: "“Place a new order” — create" },
          { k: "PUT", v: "“Replace my order” — update" },
          { k: "DELETE", v: "“Cancel my order” — delete" },
        ],
      },
    ],
    handsOn: {
      lang: "http",
      code: `GET    /orders/42      -> 200 + order JSON
POST   /orders         -> 201 Created
PUT    /orders/42      -> 200 updated
DELETE /orders/42      -> 204 No Content`,
    },
    whatIf: {
      q: "What makes an API 'RESTful' beyond using HTTP verbs?",
      a: "Statelessness (each request carries everything needed), resource-based URLs (nouns, not verbs), proper status codes, and a uniform interface. Using GET/POST alone doesn't make it REST.",
    },
    realWorld: "Nearly every web/mobile app talks to its backend over a REST API: the frontend GETs data to render, POSTs forms, and the backend returns JSON. It's the lingua franca between client and server.",
    interviewerExpectation: ["stateless", "resource/noun URLs", "correct verbs & status codes", "JSON", "idempotency"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "TCS", "Accenture"],
    related: ["rest-status-codes", "rest-idempotency", "what-is-jwt"],
  },
  {
    slug: "java-synchronization",
    categoryId: "advanced-java",
    topic: "Concurrency",
    question: "What is synchronization and why do we need it?",
    mindMap: [
      { type: "text", content: "Synchronization is the **office bathroom key** 🔑. Only the person holding the key can go in; everyone else waits. The key (lock/monitor) guarantees one thread at a time touches shared state — no awkward collisions." },
      {
        type: "kv",
        rows: [
          { k: "Problem", v: "race condition on shared data" },
          { k: "Tool", v: "synchronized / Lock / atomic" },
          { k: "Cost", v: "threads block & wait" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `class Counter {
  private int n = 0;
  synchronized void inc() { n++; } // one thread at a time
  int get() { return n; }
}`,
    },
    whatIf: {
      q: "Why prefer AtomicInteger or a Lock over synchronized sometimes?",
      a: "Atomics use lock-free CAS for simple counters — faster under contention. Explicit Locks add tryLock, timeouts, and fairness that the synchronized keyword can't offer.",
    },
    realWorld: "Any time two threads touch the same cache, counter, or balance, you need synchronization — otherwise you get the classic 'lost update' bug that only appears under load and is brutal to reproduce.",
    interviewerExpectation: ["race condition", "mutual exclusion", "monitor/lock", "synchronized vs Lock vs Atomic", "deadlock awareness"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Microsoft"],
    related: ["java-threads", "virtual-threads"],
  },
  {
    slug: "java-threads",
    categoryId: "advanced-java",
    topic: "Concurrency",
    question: "What is a thread and how is it different from a process?",
    mindMap: [
      { type: "text", content: "Threads are **chefs in one kitchen** 👨‍🍳. The kitchen (process) has shared counters and fridges (memory); each chef (thread) works a dish in parallel. Faster meals — but if two chefs grab the same knife (shared data), you need rules." },
      {
        type: "kv",
        rows: [
          { k: "Process", v: "own memory — the whole kitchen" },
          { k: "Thread", v: "shares process memory — a chef" },
          { k: "Win", v: "parallelism on multi-core" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `Runnable task = () -> System.out.println(
    Thread.currentThread().getName());
new Thread(task, "chef-1").start();`,
      output: "chef-1",
    },
    whatIf: {
      q: "Why not just create thousands of threads?",
      a: "Each platform thread maps to an OS thread costing ~1MB of stack — thousands exhaust memory and thrash the scheduler. That exact problem is why Java 21 added virtual threads.",
    },
    realWorld: "Web servers run a thread pool to handle many requests at once; background workers process jobs in parallel. You rarely call new Thread() directly — you hand tasks to an ExecutorService.",
    interviewerExpectation: ["shared vs isolated memory", "parallelism", "thread pool / ExecutorService", "context switching", "thread safety"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["java-synchronization", "virtual-threads"],
  },
  {
    slug: "virtual-threads",
    categoryId: "advanced-java",
    topic: "Virtual Threads",
    question: "What are Virtual Threads (Project Loom) in Java 21?",
    mindMap: [
      { type: "text", content: "Virtual threads are a **token system at a clinic** 🎟️. Instead of one doctor (OS thread) blocked per patient, patients hold a token and free the chair while waiting for lab results. Millions can 'wait' cheaply; doctors only work when there's something to do." },
      {
        type: "kv",
        rows: [
          { k: "Platform thread", v: "heavy, ~1MB, OS-managed" },
          { k: "Virtual thread", v: "lightweight, JVM-managed, millions OK" },
          { k: "Best for", v: "blocking I/O at high concurrency" },
        ],
      },
    ],
    handsOn: {
      lang: "java",
      code: `try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
  executor.submit(() -> handleRequest());
} // each task gets its own cheap virtual thread`,
    },
    whatIf: {
      q: "Do virtual threads make CPU-bound work faster?",
      a: "No. They shine for blocking I/O (DB calls, HTTP) where threads mostly wait. CPU-bound work is still limited by your core count — virtual threads just remove the 'thread is too expensive to block' tax.",
    },
    realWorld: "They let you write simple blocking code (one thread per request) and still scale to massive concurrency — retiring much of the complexity of reactive/async frameworks for I/O-heavy services.",
    interviewerExpectation: ["lightweight JVM threads", "blocking I/O", "millions of threads", "carrier threads", "not for CPU-bound"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google"],
    related: ["java-threads", "java-synchronization"],
  },
];

export const questionMap = new Map(questions.map((q) => [q.slug, q]));

export function getQuestion(slug: string): Question | undefined {
  return questionMap.get(slug);
}

export function questionsByCategory(categoryId: string): Question[] {
  return questions.filter((q) => q.categoryId === categoryId);
}
