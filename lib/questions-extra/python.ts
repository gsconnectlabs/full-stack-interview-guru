import type { Question } from "../types";

/**
 * Python — content expansion batch (25 questions, Phase 2 content).
 * Beginner → intermediate coverage of the language essentials interviewers ask:
 * data types & mutability, lists/tuples/dicts/sets, strings, functions, lambda,
 * *args/**kwargs, comprehensions, generators, iterators, exceptions, files, OOP
 * (classes, inheritance, polymorphism, encapsulation), modules, virtual
 * environments, the GIL, and multithreading vs multiprocessing.
 *
 * Distinct from the two base-bank Python questions (`python-list-vs-tuple`,
 * `python-decorators`) — no duplicate questions. Difficulty mix: 15 Easy ·
 * 9 Medium · 1 Hard. Ordered easy → hard.
 */
export const pythonExtra: Question[] = [
  // ---------------------------------------------------------------- Easy (15)
  {
    slug: "python-mutable-vs-immutable",
    categoryId: "python",
    topic: "Data Types",
    question: "What is the difference between mutable and immutable types in Python?",
    tags: ["mutable", "immutable", "data types", "python basics", "id"],
    shortAnswer:
      "Mutable objects can be changed in place after creation (list, dict, set); immutable objects cannot (int, float, str, tuple, bool, frozenset). Mutating an immutable 'value' actually creates a new object with a new identity. This affects how arguments behave and what can be a dict key.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Immutable", v: "int, float, str, tuple, bool, frozenset" },
          { k: "Mutable", v: "list, dict, set, most custom objects" },
          { k: "Why it matters", v: "hashing, dict keys, function args" },
        ],
      },
      { type: "text", content: "Only immutable (hashable) objects can be dict keys or set members. Reassigning a variable is not the same as mutating the object it points to." },
    ],
    handsOn: {
      lang: "python",
      code: `s = "cat"
print(id(s))
s += "s"          # builds a NEW string
print(id(s))      # different id

nums = [1, 2]
print(id(nums))
nums.append(3)    # same list, changed in place
print(id(nums))   # same id`,
      output: "two different ids for s; same id for nums",
    },
    whatIf: {
      q: "Since strings are immutable, what does `s += 'x'` really do?",
      a: "It doesn't modify the original string — Python creates a brand-new string object and rebinds `s` to it. The old string is left unchanged (and garbage-collected if nothing else references it). That's why building a big string in a loop with `+=` is slow; use ''.join(list) instead.",
    },
    realWorld:
      "The mutable/immutable line explains countless 'why did my variable change?' bugs — sharing one list across objects mutates them all, while ints/strings feel safe because every change makes a new object.",
    interviewerExpectation: ["immutable can't change in place", "list/dict/set mutable", "immutables are hashable", "reassign ≠ mutate", "affects dict keys & args"],
    followUps: [
      "Which built-in types are hashable and why?",
      "Why can a tuple still 'change' if it holds a list?",
      "How does this relate to the default-mutable-argument trap?",
    ],
    commonMistakes: [
      "Thinking `+=` on a string edits it in place",
      "Using a list as a dict key",
      "Assuming assignment copies the object",
    ],
    bestPractices: [
      "Use immutables (tuple/frozenset) as keys/constants",
      "Build strings with ''.join(), not += in loops",
      "Be careful sharing mutable objects between instances",
    ],
    relatedTech: ["hashing", "id()", "garbage collection"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture", "Cognizant"],
    related: ["python-list-vs-tuple", "python-is-vs-equals", "python-default-mutable-arg"],
  },
  {
    slug: "python-is-vs-equals",
    categoryId: "python",
    topic: "Data Types",
    question: "What is the difference between `is` and `==` in Python?",
    tags: ["is", "equality", "identity", "none", "python basics"],
    shortAnswer:
      "`==` compares values (are they equal?); `is` compares identity (are they the exact same object in memory?). Use `==` for value checks and reserve `is` for singletons like `None`, `True`, `False`. Two equal objects can be different objects, so `==` can be True while `is` is False.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "==", v: "value equality (calls __eq__)" },
          { k: "is", v: "same object (same id)" },
          { k: "Rule", v: "use `is None`, `==` for everything else" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `a = [1, 2, 3]
b = [1, 2, 3]
print(a == b)   # True  - same values
print(a is b)   # False - different objects

x = None
print(x is None)  # correct None check`,
      output: "True\nFalse\nTrue",
    },
    whatIf: {
      q: "Why does `a is b` sometimes return True for small integers but not large ones?",
      a: "CPython caches (interns) small integers (-5 to 256) and short strings, so identical literals may share one object — making `is` accidentally True. That's an implementation detail, not a guarantee. Never rely on `is` for value comparison; always use `==`.",
    },
    realWorld:
      "The classic bug is `if x is 0` or `if name is 'admin'` — it works in tests thanks to interning, then fails in production on a computed value. Linters flag `is` with literals for exactly this reason.",
    interviewerExpectation: ["== value, is identity", "use `is None`", "equal ≠ same object", "integer/string interning caveat", "don't use `is` for literals"],
    followUps: [
      "Why is `is None` preferred over `== None`?",
      "What is string/int interning?",
      "How does overriding __eq__ affect ==?",
    ],
    commonMistakes: [
      "Using `is` to compare values/literals",
      "Writing `== None` instead of `is None`",
      "Relying on small-int caching behavior",
    ],
    bestPractices: [
      "Use `==` for value equality",
      "Use `is` only for None/True/False/singletons",
      "Let linters catch `is` with literals",
    ],
    relatedTech: ["id()", "interning", "__eq__"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "Wipro", "Accenture", "Capgemini"],
    related: ["python-mutable-vs-immutable", "python-shallow-vs-deep-copy"],
  },
  {
    slug: "python-list-append-vs-extend",
    categoryId: "python",
    topic: "Lists",
    question: "What is the difference between append() and extend() on a list?",
    tags: ["list", "append", "extend", "python basics", "collections"],
    shortAnswer:
      "`append(x)` adds x as a single element (the list grows by one, even if x is itself a list). `extend(iterable)` adds each element of the iterable individually (the list grows by len(iterable)). Use append for one item, extend to merge another sequence in.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "append(x)", v: "adds ONE element (x itself)" },
          { k: "extend(it)", v: "adds each element of it" },
          { k: "a + b", v: "returns a NEW list (no mutation)" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `nums = [1, 2]
nums.append([3, 4])   # nested
print(nums)           # [1, 2, [3, 4]]

nums = [1, 2]
nums.extend([3, 4])   # flattened in
print(nums)           # [1, 2, 3, 4]`,
      output: "[1, 2, [3, 4]]\n[1, 2, 3, 4]",
    },
    whatIf: {
      q: "What does `nums.append([3, 4])` produce and why does it surprise people?",
      a: "It produces `[1, 2, [3, 4]]` — the whole list is added as a single nested element, not merged. People expect flattening; that's what `extend` (or `+=`) does. append always adds exactly one item, whatever its type.",
    },
    realWorld:
      "Accidentally using append where you meant extend creates nested lists that break later iteration — a very common beginner bug when building up results from multiple sources.",
    interviewerExpectation: ["append adds one element", "extend adds each element", "append([...]) nests", "+= behaves like extend"],
    followUps: [
      "How is `list += other` different from `list = list + other`?",
      "What's the time complexity of append?",
      "How do you flatten a list of lists?",
    ],
    commonMistakes: [
      "Using append when you meant extend (nesting)",
      "Assuming a + b mutates a",
      "Confusing extend with a shallow copy",
    ],
    bestPractices: [
      "append for a single item, extend to merge",
      "Use += for in-place extend",
      "Prefer list comprehension to flatten nested lists",
    ],
    relatedTech: ["list methods", "iterables", "amortized O(1) append"],
    difficulty: "Easy",
    experience: ["0-2 years"],
    askedIn: ["TCS", "Infosys", "Cognizant"],
    related: ["python-slicing-reverse", "python-list-comprehension"],
  },
  {
    slug: "python-slicing-reverse",
    categoryId: "python",
    topic: "Lists",
    question: "How does slicing work, and how do you reverse a string or list with it?",
    tags: ["slicing", "reverse", "strings", "lists", "coding"],
    shortAnswer:
      "Slicing is `seq[start:stop:step]` — start inclusive, stop exclusive, step optional. Omitted values default to the ends. A negative step walks backward, so `seq[::-1]` returns a reversed copy — the idiomatic one-liner to reverse a string or list.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "seq[a:b]", v: "from a (incl) to b (excl)" },
          { k: "seq[::2]", v: "every 2nd element" },
          { k: "seq[::-1]", v: "reversed copy" },
          { k: "seq[:]", v: "shallow copy of the whole sequence" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `s = "python"
print(s[::-1])       # reverse a string
print(s[0:3])        # 'pyt'

nums = [1, 2, 3, 4, 5]
print(nums[-2:])     # [4, 5] last two`,
      output: "nohtyp\npyt\n[4, 5]",
    },
    whatIf: {
      q: "Is `s[::-1]` the best way to check if a string is a palindrome?",
      a: "It's the most Pythonic: `s == s[::-1]`. It's O(n) time and simple to read. For huge strings where you want to avoid the reversed copy, a two-pointer loop comparing s[i] and s[-1-i] uses O(1) extra space — but for interviews the slice is the clean, expected answer.",
    },
    realWorld:
      "Slicing shows up everywhere — taking the last N items, dropping a header row, reversing, copying a list before mutating — and `[::-1]` is the reverse trick interviewers expect Python developers to know instantly.",
    interviewerExpectation: ["start:stop:step", "stop is exclusive", "negative indices/step", "[::-1] reverses", "slice makes a copy"],
    followUps: [
      "Does slicing a list create a copy or a view?",
      "How would you reverse in place without a copy?",
      "What does `nums[:]` do and why use it?",
    ],
    commonMistakes: [
      "Expecting stop to be inclusive",
      "Confusing slice copy with a reference",
      "Off-by-one errors with negative indices",
    ],
    bestPractices: [
      "Use `s[::-1]` to reverse, `s == s[::-1]` for palindrome",
      "Use `seq[:]` for a quick shallow copy",
      "Prefer slicing to manual index loops",
    ],
    relatedTech: ["sequences", "two-pointer technique", "str.reverse via reversed()"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "Accenture", "Wipro"],
    related: ["python-string-immutability", "python-list-append-vs-extend"],
  },
  {
    slug: "python-tuple-use-cases",
    categoryId: "python",
    topic: "Tuples",
    question: "When would you use a tuple, and what are packing, unpacking and namedtuple?",
    tags: ["tuple", "unpacking", "namedtuple", "immutable", "python basics"],
    shortAnswer:
      "Use a tuple for a fixed, ordered group of values that shouldn't change — coordinates, DB rows, function returns of multiple values. Packing bundles values into a tuple; unpacking spreads them into variables. `collections.namedtuple` gives tuples readable field names.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Use when", v: "fixed, heterogeneous, won't change" },
          { k: "Packing", v: "p = 10, 20" },
          { k: "Unpacking", v: "x, y = p" },
          { k: "namedtuple", v: "tuple + named fields" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `from collections import namedtuple

def min_max(xs):
    return min(xs), max(xs)   # returns a tuple

lo, hi = min_max([3, 1, 9])  # unpacking
print(lo, hi)

Point = namedtuple("Point", "x y")
p = Point(10, 20)
print(p.x, p.y)`,
      output: "1 9\n10 20",
    },
    whatIf: {
      q: "What does `a, *rest = [1, 2, 3, 4]` assign?",
      a: "`a = 1` and `rest = [2, 3, 4]`. The starred target captures the remaining items as a list — extended unpacking. It's great for 'first and the rest' or 'head/tail' patterns and works anywhere in the target list (e.g. `first, *mid, last`).",
    },
    realWorld:
      "Returning multiple values as a tuple and unpacking them (`name, age = get_user()`) is everyday Python; namedtuples make small immutable records self-documenting without a full class.",
    interviewerExpectation: ["fixed/immutable data", "multiple return via tuple", "packing/unpacking", "starred unpacking", "namedtuple for named fields"],
    followUps: [
      "Tuple vs namedtuple vs dataclass — when each?",
      "Why can a tuple of lists still be mutated?",
      "How does swapping `a, b = b, a` work?",
    ],
    commonMistakes: [
      "Forgetting a 1-tuple needs a trailing comma: (x,)",
      "Assuming tuples are always fully immutable (nested lists aren't)",
      "Using a plain tuple where named fields would be clearer",
    ],
    bestPractices: [
      "Use tuples for fixed records / multiple returns",
      "Reach for namedtuple/dataclass when fields need names",
      "Use unpacking instead of indexing",
    ],
    relatedTech: ["namedtuple", "dataclasses", "starred expressions"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Deloitte"],
    related: ["python-list-vs-tuple", "python-mutable-vs-immutable"],
  },
  {
    slug: "python-dict-get-setdefault",
    categoryId: "python",
    topic: "Dictionaries",
    question: "How do you safely read and update dictionary values (get, setdefault, Counter)?",
    tags: ["dictionary", "get", "setdefault", "defaultdict", "counter"],
    shortAnswer:
      "Use `d.get(key, default)` to read without a KeyError, `d.setdefault(key, default)` to read-or-insert, and `collections.defaultdict`/`Counter` to accumulate. Direct `d[key]` raises KeyError if the key is missing — fine when you want to catch a real error.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "d[key]", v: "raises KeyError if missing" },
          { k: "d.get(k, def)", v: "safe read, no error" },
          { k: "d.setdefault(k, [])", v: "read or insert default" },
          { k: "defaultdict/Counter", v: "clean accumulation/counting" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `from collections import Counter, defaultdict

words = ["a", "b", "a", "c", "b", "a"]
print(Counter(words))          # counts

groups = defaultdict(list)
for w in words:
    groups[w[0]].append(w)     # no KeyError
print(dict(groups))`,
      output: "Counter({'a': 3, 'b': 2, 'c': 1})\n{'a': [...], 'b': [...], 'c': [...]}",
    },
    whatIf: {
      q: "Why prefer defaultdict(list) over `if key not in d: d[key] = []` before appending?",
      a: "defaultdict auto-creates the default the first time a key is accessed, so you drop the existence check and the code reads cleaner and runs a touch faster. It's the idiomatic way to group/accumulate. Counter goes further for the common 'count occurrences' case.",
    },
    realWorld:
      "Grouping records by a key, counting frequencies, and building lookup tables are daily tasks; get/setdefault/defaultdict/Counter turn multi-line existence checks into one clear line.",
    interviewerExpectation: ["d[key] raises KeyError", "get for safe read", "setdefault read-or-insert", "defaultdict/Counter for accumulation"],
    followUps: [
      "How do you iterate keys, values, and items?",
      "How do you merge two dicts (| / update)?",
      "Are dicts ordered in modern Python?",
    ],
    commonMistakes: [
      "Using d[key] without handling missing keys",
      "Manual 'if key not in d' instead of defaultdict",
      "Mutating a dict while iterating it",
    ],
    bestPractices: [
      "Use get() with a default for safe reads",
      "Use defaultdict/Counter to accumulate",
      "Iterate with .items() for key+value",
    ],
    relatedTech: ["collections", "defaultdict", "Counter", "dict comprehension"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "TCS", "Accenture"],
    related: ["python-set-operations", "python-list-comprehension"],
  },
  {
    slug: "python-set-operations",
    categoryId: "python",
    topic: "Sets",
    question: "What is a set in Python and when should you use one?",
    tags: ["set", "deduplication", "membership", "union", "intersection"],
    shortAnswer:
      "A set is an unordered collection of unique, hashable elements with O(1) average membership tests. Use it to deduplicate, to test 'is x in this collection?' fast, and for math-style union/intersection/difference operations.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Unique", v: "duplicates dropped automatically" },
          { k: "Fast", v: "O(1) average `in` test (hashing)" },
          { k: "Ops", v: "| union, & intersection, - difference" },
          { k: "frozenset", v: "immutable, hashable set" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `a = {1, 2, 3, 3, 2}
print(a)              # {1, 2, 3} - deduped

b = {2, 3, 4}
print(a & b)          # {2, 3} intersection
print(a | b)          # {1, 2, 3, 4} union
print(a - b)          # {1} difference`,
      output: "{1, 2, 3}\n{2, 3}\n{1, 2, 3, 4}\n{1}",
    },
    whatIf: {
      q: "Why is `x in my_set` much faster than `x in my_list` for large collections?",
      a: "A set hashes x to jump straight to its bucket — O(1) average. A list has to scan element by element — O(n). For repeated membership checks on big data, converting the list to a set first is a common, big performance win.",
    },
    realWorld:
      "Deduplicating IDs, checking membership against a blocklist, and finding common/unique elements between two datasets are textbook set jobs — replacing slow nested loops with one fast operation.",
    interviewerExpectation: ["unique elements", "O(1) membership", "union/intersection/difference", "elements must be hashable", "frozenset immutable"],
    followUps: [
      "Why can't a set contain a list?",
      "How do you dedupe a list while preserving order?",
      "When is frozenset useful?",
    ],
    commonMistakes: [
      "Expecting sets to preserve insertion order",
      "Trying to store unhashable items (lists) in a set",
      "Using `{}` for an empty set (that's a dict) — use set()",
    ],
    bestPractices: [
      "Use a set for dedup and fast membership",
      "Convert lists to sets before repeated `in` checks",
      "Use set() for an empty set, not {}",
    ],
    relatedTech: ["hashing", "frozenset", "dict"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "Cognizant", "Deloitte"],
    related: ["python-dict-get-setdefault", "python-mutable-vs-immutable"],
  },
  {
    slug: "python-string-immutability",
    categoryId: "python",
    topic: "Strings",
    question: "Are Python strings mutable, and how do you build/format them efficiently?",
    tags: ["string", "immutable", "f-string", "join", "formatting"],
    shortAnswer:
      "Strings are immutable — every 'change' makes a new string. So build up big strings with ''.join(list) instead of += in a loop, and format with f-strings (fast and readable). f-strings, str.format(), and % all work; f-strings are the modern default.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Immutable", v: "methods return new strings" },
          { k: "Concatenate", v: "''.join(parts) for many pieces" },
          { k: "Format", v: "f-strings: f'{name=}' " },
          { k: "Useful", v: "split, strip, replace, startswith" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `name, n = "Guru", 3
print(f"Hi {name}, you have {n} tasks")

parts = ["a", "b", "c"]
print("-".join(parts))      # a-b-c  (efficient)

s = "  hello  "
print(s.strip().upper())    # 'HELLO' (new string)`,
      output: "Hi Guru, you have 3 tasks\na-b-c\nHELLO",
    },
    whatIf: {
      q: "Why is building a string with `s += x` inside a big loop discouraged?",
      a: "Because strings are immutable, each += allocates a whole new string and copies the old contents — turning the loop into O(n²) work. Collect the pieces in a list and call ''.join(list) once (O(n)). This is a frequent performance question.",
    },
    realWorld:
      "Generating CSV/log lines, SQL fragments, or report text is faster and cleaner with join + f-strings; the += -in-a-loop anti-pattern quietly slows down data-heavy scripts.",
    interviewerExpectation: ["strings immutable", "methods return new strings", "''.join for many pieces", "f-strings for formatting", "+= in loop is O(n²)"],
    followUps: [
      "f-string vs str.format() vs % — differences?",
      "How do split() and strip() work?",
      "How do you check substring membership?",
    ],
    commonMistakes: [
      "Trying to assign s[0] = 'x' (TypeError)",
      "Concatenating with += in large loops",
      "Manual concatenation instead of f-strings",
    ],
    bestPractices: [
      "Prefer f-strings for readability",
      "Use ''.join() to assemble many pieces",
      "Use built-in str methods over manual loops",
    ],
    relatedTech: ["f-strings", "str methods", "io.StringIO"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Wipro", "Accenture"],
    related: ["python-slicing-reverse", "python-mutable-vs-immutable"],
  },
  {
    slug: "python-lambda",
    categoryId: "python",
    topic: "Lambda",
    question: "What is a lambda function and when should you use one?",
    tags: ["lambda", "anonymous function", "sorted", "key", "functional"],
    shortAnswer:
      "A lambda is a small anonymous function written inline: `lambda args: expression`. It holds a single expression (no statements) and is handy as a short throwaway callback — e.g. the `key=` for sorted/min/max. For anything non-trivial, use a named `def`.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Syntax", v: "lambda x: x * 2" },
          { k: "Body", v: "ONE expression, no statements" },
          { k: "Best use", v: "key= in sorted/min/max, quick callbacks" },
          { k: "Avoid", v: "complex logic → use def" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `people = [("Guru", 30), ("Asha", 25), ("Ravi", 28)]
by_age = sorted(people, key=lambda p: p[1])
print(by_age)

double = lambda x: x * 2
print(double(5))`,
      output: "[('Asha', 25), ('Ravi', 28), ('Guru', 30)]\n10",
    },
    whatIf: {
      q: "When is a named `def` better than a lambda?",
      a: "When the logic spans more than one expression, needs statements (loops, try/except), or is reused — a def is clearer, testable, and shows a name in tracebacks. Assigning a lambda to a variable (`f = lambda ...`) is discouraged by PEP 8; just use def.",
    },
    realWorld:
      "Lambdas shine as the `key` for sorting or as tiny callbacks in map/filter/GUI handlers; beyond a one-liner, teams prefer named functions for readability and debugging.",
    interviewerExpectation: ["anonymous single-expression function", "no statements", "key= use case", "prefer def for complex logic", "PEP 8 note"],
    followUps: [
      "How does lambda pair with map/filter/reduce?",
      "Why does PEP 8 discourage naming a lambda?",
      "What is a closure and does lambda capture variables?",
    ],
    commonMistakes: [
      "Cramming complex logic into a lambda",
      "Assigning lambdas to names instead of using def",
      "Late-binding closure surprises in loops",
    ],
    bestPractices: [
      "Use lambda for short inline callbacks",
      "Use def for anything reusable or multi-line",
      "Common home: key= in sorted/min/max",
    ],
    relatedTech: ["map/filter", "sorted key", "closures", "functools"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "Accenture", "Deloitte", "Cognizant"],
    related: ["python-list-comprehension", "python-args-kwargs"],
  },
  {
    slug: "python-list-comprehension",
    categoryId: "python",
    topic: "Comprehensions",
    question: "What is a list comprehension and why is it preferred over a loop?",
    tags: ["list comprehension", "comprehension", "pythonic", "filter", "map"],
    shortAnswer:
      "A list comprehension builds a list in one readable expression: `[expr for item in iterable if condition]`. It's more concise and usually a bit faster than an equivalent for-loop with append, and it clearly signals 'I'm building a new list'. Dict/set/generator comprehensions follow the same shape.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Shape", v: "[f(x) for x in xs if cond]" },
          { k: "Dict", v: "{k: v for ...}" },
          { k: "Set", v: "{x for ...}" },
          { k: "Generator", v: "(x for ...) - lazy, memory-light" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `nums = [1, 2, 3, 4, 5, 6]
squares_even = [n * n for n in nums if n % 2 == 0]
print(squares_even)          # [4, 16, 36]

names = ["guru", "asha"]
lengths = {n: len(n) for n in names}
print(lengths)`,
      output: "[4, 16, 36]\n{'guru': 4, 'asha': 4}",
    },
    whatIf: {
      q: "When should you NOT use a comprehension?",
      a: "When it gets long or deeply nested (multiple for/if clauses) — readability drops fast. Also, if you only need to iterate once over a huge dataset, use a generator expression `(...)` to avoid building the whole list in memory. And if there's a side effect (not building a collection), a plain loop is clearer.",
    },
    realWorld:
      "Transforming and filtering query results — 'active users' emails', 'prices with tax' — is one clean comprehension instead of a temp list plus a loop, which is why it's everywhere in idiomatic Python.",
    interviewerExpectation: ["[expr for x in it if cond]", "more concise/faster than loop", "dict/set/generator variants", "don't overuse when unreadable", "generator for large data"],
    followUps: [
      "List comprehension vs generator expression (memory)?",
      "How do nested comprehensions read?",
      "How does it compare to map()/filter()?",
    ],
    commonMistakes: [
      "Nesting too deeply → unreadable",
      "Building a full list when a generator would do",
      "Using a comprehension purely for side effects",
    ],
    bestPractices: [
      "Use for simple map/filter into a new collection",
      "Switch to a loop when it stops being readable",
      "Use a generator expression for large/one-pass data",
    ],
    relatedTech: ["generator expressions", "map/filter", "dict/set comprehension"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "TCS", "Deloitte"],
    related: ["python-generators-yield", "python-lambda"],
  },
  {
    slug: "python-exception-handling",
    categoryId: "python",
    topic: "Exceptions",
    question: "How does exception handling work in Python (try/except/else/finally)?",
    tags: ["exception", "try except", "finally", "eafp", "error handling"],
    shortAnswer:
      "Wrap risky code in `try`, handle specific errors in `except`, put code that runs only on success in `else`, and cleanup that always runs in `finally`. Python favors EAFP ('easier to ask forgiveness than permission') — try the operation and catch the specific exception rather than pre-checking everything.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "try", v: "code that might fail" },
          { k: "except X", v: "handle a specific error" },
          { k: "else", v: "runs only if no exception" },
          { k: "finally", v: "always runs (cleanup)" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `def safe_div(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        return "cannot divide by zero"
    else:
        return result
    finally:
        print("done")

print(safe_div(10, 2))
print(safe_div(10, 0))`,
      output: "done\n5.0\ndone\ncannot divide by zero",
    },
    whatIf: {
      q: "Why is `except Exception:` (or bare `except:`) considered a bad habit?",
      a: "It swallows every error — including ones you didn't anticipate (typos, KeyboardInterrupt with bare except) — hiding real bugs and making debugging painful. Catch the specific exception you can handle, and let unexpected ones propagate or be logged with context.",
    },
    realWorld:
      "Robust services catch specific, expected failures (network timeout, missing key, bad input), clean up resources in finally, and let unknown errors bubble up to a logger — never silently pass.",
    interviewerExpectation: ["try/except/else/finally roles", "catch specific exceptions", "EAFP style", "finally for cleanup", "avoid bare except"],
    followUps: [
      "EAFP vs LBYL — which does Python prefer?",
      "How do you raise and define custom exceptions?",
      "What does `raise ... from e` do (exception chaining)?",
    ],
    commonMistakes: [
      "Bare `except:` swallowing all errors",
      "Catching Exception too broadly",
      "Using exceptions for normal control flow everywhere",
    ],
    bestPractices: [
      "Catch the narrowest exception you can handle",
      "Use finally / context managers for cleanup",
      "Log or re-raise unexpected errors, never silently pass",
    ],
    relatedTech: ["custom exceptions", "context managers", "logging"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture", "Amazon"],
    related: ["python-file-handling", "python-iterators-iterables"],
  },
  {
    slug: "python-file-handling",
    categoryId: "python",
    topic: "File Handling",
    question: "What is the right way to read and write files in Python?",
    tags: ["file handling", "with", "context manager", "open", "io"],
    shortAnswer:
      "Use `with open(path, mode) as f:` — the context manager guarantees the file is closed even if an error occurs. Modes: 'r' read, 'w' write (truncate), 'a' append, 'b' binary. Iterate a text file line by line to stay memory-efficient on large files.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "with open(...)", v: "auto-closes (context manager)" },
          { k: "'r' / 'w' / 'a'", v: "read / write(truncate) / append" },
          { k: "'b'", v: "binary mode (bytes)" },
          { k: "for line in f", v: "streams line by line (low memory)" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `with open("data.txt", "w") as f:
    f.write("line1\\n")
    f.write("line2\\n")

with open("data.txt") as f:
    for line in f:               # memory-friendly
        print(line.strip())`,
      output: "line1\nline2",
    },
    whatIf: {
      q: "Why use `with open(...)` instead of `f = open(...)` then `f.close()`?",
      a: "The `with` block (context manager) closes the file automatically at the end — even if an exception is raised mid-way. The manual approach leaks the file handle if an error skips the close() call. `with` is the safe, idiomatic pattern for any resource that needs cleanup.",
    },
    realWorld:
      "Reading config, streaming a large log line by line, or writing a report — always inside `with` — is standard; forgetting to close files causes 'too many open files' errors in long-running services.",
    interviewerExpectation: ["with = auto-close", "context manager guarantees cleanup", "r/w/a/b modes", "iterate lines for big files", "w truncates"],
    followUps: [
      "What does the context-manager protocol (__enter__/__exit__) do?",
      "How do you read/write JSON or CSV?",
      "How do you handle file encodings?",
    ],
    commonMistakes: [
      "Not closing files (no `with`)",
      "Using 'w' when you meant 'a' (data loss)",
      "Loading a huge file with read() instead of streaming",
    ],
    bestPractices: [
      "Always use `with open(...)`",
      "Stream large files line by line",
      "Specify encoding='utf-8' for text",
    ],
    relatedTech: ["context managers", "pathlib", "json/csv modules"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Cognizant", "Wipro"],
    related: ["python-exception-handling", "python-generators-yield"],
  },
  {
    slug: "python-oop-class-self",
    categoryId: "python",
    topic: "OOP",
    question: "What are __init__ and self in a Python class?",
    tags: ["oop", "class", "init", "self", "instance"],
    shortAnswer:
      "`__init__` is the initializer that runs when you create an object — it sets up instance attributes. `self` is the reference to the current instance, passed automatically as the first parameter of every instance method, so methods can read/write that object's own data.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "class", v: "blueprint for objects" },
          { k: "__init__", v: "runs on creation, sets attributes" },
          { k: "self", v: "the current instance" },
          { k: "instance vs class attr", v: "per-object vs shared" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `class Account:
    def __init__(self, owner, balance=0):
        self.owner = owner        # instance attribute
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        return self.balance

a = Account("Guru", 100)
print(a.deposit(50))`,
      output: "150",
    },
    whatIf: {
      q: "What happens if you forget `self` as the first method parameter?",
      a: "Calling the method raises a TypeError about arguments, because Python passes the instance as the first positional argument automatically — the method needs a parameter (conventionally `self`) to receive it. Without it, the counts don't match. `self` isn't a keyword, just a strong convention.",
    },
    realWorld:
      "Classes model real entities — User, Order, Account — bundling their data and behavior; `__init__` + `self` are the first things every Python developer uses when structuring an app's domain objects.",
    interviewerExpectation: ["__init__ initializes", "self = current instance", "instance attributes via self", "auto-passed first arg", "class vs instance attribute"],
    followUps: [
      "Instance vs class attribute — where does each live?",
      "What is __str__ / __repr__ for?",
      "What are @classmethod and @staticmethod?",
    ],
    commonMistakes: [
      "Forgetting self in method signatures",
      "Using a mutable class attribute as if it were per-instance",
      "Doing heavy work in __init__",
    ],
    bestPractices: [
      "Set all instance state in __init__",
      "Use self for per-object data; class attrs for shared constants",
      "Add __repr__ for debuggable objects",
    ],
    relatedTech: ["dataclasses", "__repr__", "classmethod/staticmethod"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture", "Deloitte"],
    related: ["python-inheritance-super", "python-encapsulation"],
  },
  {
    slug: "python-modules-imports",
    categoryId: "python",
    topic: "Modules",
    question: "What are modules and packages, and how does import work?",
    tags: ["module", "package", "import", "__name__", "__init__.py"],
    shortAnswer:
      "A module is a single .py file; a package is a folder of modules (traditionally with __init__.py). `import` runs the module once and caches it in sys.modules, so re-imports are cheap. Use `if __name__ == '__main__':` to separate 'run as script' code from 'imported as a module' code.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Module", v: "one .py file" },
          { k: "Package", v: "folder of modules (__init__.py)" },
          { k: "import", v: "runs once, cached in sys.modules" },
          { k: "__name__", v: "'__main__' when run directly" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `# mymath.py
def add(a, b):
    return a + b

if __name__ == "__main__":
    print(add(2, 3))     # only when run directly

# other.py
from mymath import add
print(add(10, 5))        # import doesn't run the __main__ block`,
      output: "15",
    },
    whatIf: {
      q: "What is the point of `if __name__ == '__main__':`?",
      a: "It lets a file work both as a runnable script and an importable module. When run directly, __name__ is '__main__' and the block executes; when imported, __name__ is the module name, so that block is skipped — preventing your test/CLI code from firing on import.",
    },
    realWorld:
      "Every project is organized into modules/packages; the `__main__` guard is why importing a utility file doesn't accidentally run its demo code — a detail interviewers check that beginners often miss.",
    interviewerExpectation: ["module=file, package=folder", "import runs once & caches", "__name__=='__main__' guard", "absolute vs relative imports"],
    followUps: [
      "Absolute vs relative imports?",
      "What causes a circular import and how do you fix it?",
      "How does Python find modules (sys.path)?",
    ],
    commonMistakes: [
      "Naming a file the same as a stdlib module (shadowing)",
      "Wildcard `from x import *`",
      "Creating circular imports",
    ],
    bestPractices: [
      "Guard script code with `if __name__ == '__main__'`",
      "Prefer explicit imports over `import *`",
      "Keep packages cohesive; avoid circular deps",
    ],
    relatedTech: ["sys.modules", "pip", "__init__.py", "importlib"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Wipro", "Cognizant"],
    related: ["python-virtualenv", "python-oop-class-self"],
  },
  {
    slug: "python-virtualenv",
    categoryId: "python",
    topic: "Environments",
    question: "What is a virtual environment and why does every Python project need one?",
    tags: ["virtualenv", "venv", "pip", "dependencies", "requirements"],
    shortAnswer:
      "A virtual environment is an isolated per-project Python with its own installed packages, so Project A's dependencies don't clash with Project B's or the system Python. Create one with `python -m venv .venv`, activate it, `pip install`, and freeze exact versions to requirements.txt for reproducibility.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Problem", v: "global installs clash across projects" },
          { k: "venv", v: "isolated interpreter + packages" },
          { k: "Create", v: "python -m venv .venv" },
          { k: "Reproduce", v: "pip freeze > requirements.txt" },
        ],
      },
    ],
    handsOn: {
      lang: "bash",
      code: `python -m venv .venv
source .venv/bin/activate      # Windows: .venv\\Scripts\\activate
pip install requests
pip freeze > requirements.txt
# elsewhere: pip install -r requirements.txt`,
    },
    whatIf: {
      q: "What breaks if two projects share one global Python and need different versions of the same library?",
      a: "You get a dependency conflict — installing the version one project needs breaks the other, because there's a single global site-packages. Virtual environments give each project its own isolated packages, so their requirements never collide. That's the whole reason venvs exist.",
    },
    realWorld:
      "Every real Python project ships a requirements.txt (or pyproject/poetry lock) so teammates and CI recreate the exact same environment; skipping venvs leads to 'works on my machine' dependency chaos.",
    interviewerExpectation: ["isolated per-project deps", "avoids version conflicts", "python -m venv + activate", "requirements.txt for reproducibility", "don't pollute system Python"],
    followUps: [
      "venv vs virtualenv vs conda vs poetry?",
      "Why pin exact versions in requirements.txt?",
      "How does this relate to Docker images?",
    ],
    commonMistakes: [
      "Installing everything into the global/system Python",
      "Committing the .venv folder to git",
      "Not pinning versions (non-reproducible builds)",
    ],
    bestPractices: [
      "One venv per project; gitignore it",
      "Track requirements.txt / lock file",
      "Recreate envs in CI from the lock file",
    ],
    relatedTech: ["venv", "pip", "poetry", "conda", "Docker"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture", "Amazon"],
    related: ["python-modules-imports", "python-gil"],
  },

  // -------------------------------------------------------------- Medium (9)
  {
    slug: "python-shallow-vs-deep-copy",
    categoryId: "python",
    topic: "Data Types",
    question: "What is the difference between a shallow copy and a deep copy?",
    tags: ["copy", "deepcopy", "shallow copy", "references", "mutable"],
    shortAnswer:
      "A shallow copy duplicates the outer object but shares references to the nested objects, so mutating a nested item shows up in both copies. A deep copy (`copy.deepcopy`) recursively duplicates everything, giving a fully independent object. Assignment (`b = a`) copies nothing — both names point to the same object.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "b = a", v: "same object (alias)" },
          { k: "Shallow", v: "new outer, shared inner refs" },
          { k: "Deep", v: "copy.deepcopy - fully independent" },
          { k: "Make shallow", v: "list(a), a[:], a.copy()" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `import copy
a = [[1, 2], [3, 4]]

shallow = a[:]                 # or list(a)
shallow[0][0] = 99             # affects a too!
print(a)                       # [[99, 2], [3, 4]]

deep = copy.deepcopy(a)
deep[0][0] = 0                 # a untouched
print(a)                       # [[99, 2], [3, 4]]`,
      output: "[[99, 2], [3, 4]]\n[[99, 2], [3, 4]]",
    },
    whatIf: {
      q: "You copied a list of lists with `new = old[:]` and editing new[0][0] changed old too — why?",
      a: "`old[:]` is a shallow copy: it makes a new outer list but the inner lists are the SAME objects shared by both. Editing a nested list mutates the shared object. Use copy.deepcopy(old) when you need the nested objects duplicated too.",
    },
    realWorld:
      "This bites people who copy nested config/state to 'safely' edit it and accidentally mutate the original; knowing shallow vs deep prevents subtle shared-state bugs.",
    interviewerExpectation: ["assignment is aliasing", "shallow shares nested refs", "deepcopy fully independent", "list()/[:] are shallow", "matters for nested mutables"],
    followUps: [
      "How do you shallow-copy a dict?",
      "Why is deepcopy slower / when to avoid it?",
      "How does this relate to mutable default arguments?",
    ],
    commonMistakes: [
      "Assuming [:] deep-copies nested structures",
      "Thinking `b = a` makes a copy",
      "Using deepcopy everywhere (needless cost)",
    ],
    bestPractices: [
      "Use deepcopy only when nested independence is needed",
      "Prefer immutable data to avoid copy questions",
      "Know [:]/copy()/dict() are shallow",
    ],
    relatedTech: ["copy module", "references", "immutability"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Microsoft"],
    related: ["python-mutable-vs-immutable", "python-default-mutable-arg"],
  },
  {
    slug: "python-default-mutable-arg",
    categoryId: "python",
    topic: "Functions",
    question: "Why is a mutable default argument (like def f(x, items=[])) dangerous?",
    tags: ["default argument", "mutable", "gotcha", "functions", "bug"],
    shortAnswer:
      "Default argument values are evaluated once when the function is defined, not on each call. So a mutable default like `items=[]` is shared across all calls — it accumulates data between calls. The fix is `items=None` and create a fresh list inside the function.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Cause", v: "default evaluated once at def time" },
          { k: "Symptom", v: "list/dict persists across calls" },
          { k: "Fix", v: "default None, create inside" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `def bad(x, items=[]):     # shared default!
    items.append(x)
    return items

print(bad(1))   # [1]
print(bad(2))   # [1, 2]  <- surprise

def good(x, items=None):
    items = items or []
    items.append(x)
    return items
print(good(1)); print(good(2))   # [1]  then  [1]`,
      output: "[1]\n[1, 2]\n[1]\n[1]",
    },
    whatIf: {
      q: "Why does the second call to `bad(2)` return [1, 2] instead of [2]?",
      a: "The default list is created once, when `def bad` runs — every call that doesn't pass `items` reuses that same list object, so appends accumulate. Using `items=None` and building a new list inside gives each call its own fresh list.",
    },
    realWorld:
      "This is one of the most-asked Python 'gotcha' interview questions and a real source of state-leak bugs in caches, accumulators, and config defaults — the None sentinel pattern is the standard fix.",
    interviewerExpectation: ["defaults evaluated once at def", "mutable default is shared", "state leaks across calls", "fix with None sentinel"],
    followUps: [
      "Does the same problem apply to dict/set defaults?",
      "When is a mutable default sometimes used deliberately (caching)?",
      "How do keyword-only args help API clarity?",
    ],
    commonMistakes: [
      "Using [] or {} as a default value",
      "Assuming defaults are recreated each call",
      "Mutating a shared default and blaming the caller",
    ],
    bestPractices: [
      "Default to None; build the mutable inside",
      "Keep defaults immutable",
      "Document any intentional shared default",
    ],
    relatedTech: ["None sentinel", "function objects", "closures"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Google"],
    related: ["python-shallow-vs-deep-copy", "python-args-kwargs"],
  },
  {
    slug: "python-args-kwargs",
    categoryId: "python",
    topic: "Functions",
    question: "What are *args and **kwargs, and how do you use them?",
    tags: ["args", "kwargs", "variadic", "unpacking", "functions"],
    shortAnswer:
      "`*args` collects extra positional arguments into a tuple; `**kwargs` collects extra keyword arguments into a dict. They let a function accept any number of arguments. The same `*`/`**` also unpack a list/dict back into arguments when calling — handy for forwarding args to another function.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "*args", v: "extra positional → tuple" },
          { k: "**kwargs", v: "extra keyword → dict" },
          { k: "Call side", v: "*list / **dict unpack into args" },
          { k: "Order", v: "pos, *args, kw-only, **kwargs" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `def log(level, *args, **kwargs):
    print(level, args, kwargs)

log("INFO", "a", "b", user="guru", id=7)
# INFO ('a', 'b') {'user': 'guru', 'id': 7}

def add(a, b, c): return a + b + c
nums = [1, 2, 3]
print(add(*nums))          # unpack list → 6`,
      output: "INFO ('a', 'b') {'user': 'guru', 'id': 7}\n6",
    },
    whatIf: {
      q: "How do *args/**kwargs help when writing a wrapper or decorator?",
      a: "They let the wrapper accept and forward ANY arguments to the wrapped function without knowing its signature: `def wrapper(*args, **kwargs): return fn(*args, **kwargs)`. That's exactly why decorators use them — one wrapper works for functions with any parameters.",
    },
    realWorld:
      "Decorators, logging helpers, and thin API wrappers all rely on *args/**kwargs to pass arguments through transparently; unpacking (*/** at the call site) is the flip side used to spread collected data back into calls.",
    interviewerExpectation: ["*args → tuple", "**kwargs → dict", "accept variable arity", "unpack at call site", "used by decorators/wrappers"],
    followUps: [
      "What are keyword-only and positional-only parameters?",
      "How does argument order/precedence work?",
      "How does this pair with functools.wraps in decorators?",
    ],
    commonMistakes: [
      "Confusing collect (def) vs unpack (call)",
      "Wrong parameter order in the signature",
      "Overusing **kwargs and losing a clear API",
    ],
    bestPractices: [
      "Use for wrappers/decorators and flexible APIs",
      "Prefer explicit params when the signature is known",
      "Document expected kwargs",
    ],
    relatedTech: ["decorators", "functools.wraps", "unpacking"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Microsoft", "Infosys"],
    related: ["python-decorators", "python-lambda", "python-default-mutable-arg"],
  },
  {
    slug: "python-generators-yield",
    categoryId: "python",
    topic: "Generators",
    question: "What is a generator and how does yield work?",
    tags: ["generator", "yield", "lazy", "memory", "iterator"],
    shortAnswer:
      "A generator is a function that uses `yield` to produce values lazily, one at a time, pausing and resuming its state between calls. It doesn't build the whole result in memory, so it handles huge or infinite streams cheaply. Calling it returns a generator (an iterator) you loop over.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "yield", v: "produce a value, pause, keep state" },
          { k: "Lazy", v: "computes on demand, item by item" },
          { k: "Memory", v: "O(1) — no full list built" },
          { k: "Genexpr", v: "(x for x in xs) - inline generator" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `def first_n(n):
    i = 0
    while i < n:
        yield i          # pause & resume here
        i += 1

for x in first_n(3):
    print(x)

total = sum(x * x for x in range(1_000_000))  # lazy, low memory
print(total)`,
      output: "0\n1\n2\n(large sum)",
    },
    whatIf: {
      q: "Why use a generator instead of returning a full list for a huge dataset?",
      a: "A list materializes every element in memory at once; a generator yields one at a time, using near-constant memory — essential for large files, database cursors, or infinite streams. The trade-off: a generator is single-pass (consumed once) and has no len() or indexing.",
    },
    realWorld:
      "Streaming lines from a multi-GB file, paginating an API, or building data pipelines all use generators so memory stays flat regardless of data size — a core scalability tool in Python.",
    interviewerExpectation: ["yield produces lazily", "keeps state between calls", "constant memory", "single-pass/consumed once", "generator expression"],
    followUps: [
      "Generator vs list — memory and reuse trade-offs?",
      "What does `yield from` do?",
      "How are generators related to iterators?",
    ],
    commonMistakes: [
      "Trying to reuse an exhausted generator",
      "Calling len() or indexing a generator",
      "Building a list when a generator would scale better",
    ],
    bestPractices: [
      "Use generators for large/streaming data",
      "Use generator expressions for one-pass pipelines",
      "Remember they're single-use",
    ],
    relatedTech: ["iterators", "yield from", "itertools"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft", "Deloitte"],
    related: ["python-iterators-iterables", "python-list-comprehension"],
  },
  {
    slug: "python-iterators-iterables",
    categoryId: "python",
    topic: "Iterators",
    question: "What is the difference between an iterable and an iterator?",
    tags: ["iterator", "iterable", "iter", "next", "protocol"],
    shortAnswer:
      "An iterable is anything you can loop over — it implements `__iter__` (list, str, dict, set). An iterator is the object that actually produces items one at a time via `__next__` and raises StopIteration when done. `iter(iterable)` gives you an iterator; a `for` loop does this for you.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Iterable", v: "has __iter__ (list, str, dict)" },
          { k: "Iterator", v: "has __next__, tracks position" },
          { k: "iter(x)", v: "iterable → iterator" },
          { k: "StopIteration", v: "signals 'no more items'" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `nums = [10, 20, 30]      # iterable
it = iter(nums)          # iterator
print(next(it))          # 10
print(next(it))          # 20
# for x in nums: ...     does exactly this internally`,
      output: "10\n20",
    },
    whatIf: {
      q: "What actually happens under the hood when you write `for x in my_list`?",
      a: "Python calls iter(my_list) to get an iterator, then repeatedly calls next() on it, binding each result to x, until StopIteration is raised — which the for loop catches to end. So every for loop is sugar over the iterator protocol (__iter__ + __next__).",
    },
    realWorld:
      "Understanding the protocol explains why generators, file objects, and range work in for loops, why an iterator is single-pass, and how to build custom iterable classes for your own data structures.",
    interviewerExpectation: ["iterable has __iter__", "iterator has __next__", "iter()/next()", "StopIteration ends loop", "for loop uses the protocol"],
    followUps: [
      "Is a generator an iterator?",
      "Why can you loop a list many times but a generator only once?",
      "How do you make a custom class iterable?",
    ],
    commonMistakes: [
      "Confusing iterable with iterator",
      "Expecting an iterator to restart",
      "Forgetting StopIteration in a manual __next__",
    ],
    bestPractices: [
      "Implement __iter__ to make classes loopable",
      "Prefer generators for custom iteration",
      "Remember iterators are single-pass",
    ],
    relatedTech: ["generators", "itertools", "range/enumerate/zip"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["python-generators-yield", "python-exception-handling"],
  },
  {
    slug: "python-inheritance-super",
    categoryId: "python",
    topic: "Inheritance",
    question: "How does inheritance work in Python, and what does super() do?",
    tags: ["inheritance", "super", "mro", "oop", "subclass"],
    shortAnswer:
      "A subclass inherits attributes/methods from a parent and can add or override them. `super()` calls the parent's version of a method — most often in `__init__` to initialize the inherited part before adding subclass-specific state. Python resolves method lookup via the MRO (Method Resolution Order).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Subclass", v: "class Dog(Animal)" },
          { k: "Override", v: "redefine a parent method" },
          { k: "super()", v: "call the parent's method" },
          { k: "MRO", v: "lookup order (C3 linearization)" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `class Animal:
    def __init__(self, name):
        self.name = name
    def speak(self):
        return "..."

class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)   # init parent part
        self.breed = breed
    def speak(self):
        return "Woof"

d = Dog("Rex", "Lab")
print(d.name, d.speak())`,
      output: "Rex Woof",
    },
    whatIf: {
      q: "Why call super().__init__() instead of Parent.__init__(self)?",
      a: "super() follows the MRO, so in multiple-inheritance hierarchies each parent's __init__ runs exactly once in the correct order — hard-coding Parent.__init__ can skip or double-call ancestors. super() is also refactor-safe: rename the base class and it still works.",
    },
    realWorld:
      "Framework classes (Django views, exceptions, custom errors) are extended by subclassing and calling super() to reuse base behavior while adding your own — the backbone of code reuse in OOP Python.",
    interviewerExpectation: ["subclass inherits/overrides", "super() calls parent", "init the inherited part", "MRO resolves lookup", "prefer super over hardcoding parent"],
    followUps: [
      "What is the MRO and how do you view it (__mro__)?",
      "How does Python handle multiple inheritance / diamond problem?",
      "Composition vs inheritance — when each?",
    ],
    commonMistakes: [
      "Forgetting super().__init__() (uninitialized parent state)",
      "Hardcoding Parent.__init__ in multi-inheritance",
      "Overusing deep inheritance instead of composition",
    ],
    bestPractices: [
      "Use super() for parent initialization/methods",
      "Prefer composition over deep hierarchies",
      "Keep overrides consistent with the parent contract",
    ],
    relatedTech: ["MRO", "mixins", "abstract base classes"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Accenture"],
    related: ["python-oop-class-self", "python-polymorphism-duck-typing"],
  },
  {
    slug: "python-polymorphism-duck-typing",
    categoryId: "python",
    topic: "Polymorphism",
    question: "What is polymorphism and duck typing in Python?",
    tags: ["polymorphism", "duck typing", "oop", "protocol", "interface"],
    shortAnswer:
      "Polymorphism means the same operation works on different types — the right method is chosen by the object. Python does this via duck typing: 'if it walks like a duck and quacks like a duck, it's a duck.' Code depends on behavior (methods an object supports), not on its declared class.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Polymorphism", v: "same call, type-specific behavior" },
          { k: "Duck typing", v: "care about methods, not the class" },
          { k: "Enabler", v: "override methods (e.g. __str__, speak)" },
          { k: "Formalize", v: "ABCs / typing.Protocol" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `class Dog:
    def speak(self): return "Woof"
class Cat:
    def speak(self): return "Meow"

def announce(animal):        # no type check
    print(animal.speak())    # works if it has speak()

for a in (Dog(), Cat()):
    announce(a)`,
      output: "Woof\nMeow",
    },
    whatIf: {
      q: "How does duck typing differ from Java-style interfaces?",
      a: "Java checks types at compile time — an object must explicitly implement an interface. Python checks at runtime: if the object has the method you call, it works, regardless of its class or any declared interface. It's more flexible but shifts errors to runtime; typing.Protocol adds optional static checking.",
    },
    realWorld:
      "Functions that accept 'any file-like object' or 'anything iterable' rely on duck typing — you can pass a real file, StringIO, or a custom class, and it just works as long as it has the needed methods.",
    interviewerExpectation: ["same op, different types", "duck typing = behavior over class", "runtime not compile-time", "method overriding", "Protocol/ABC to formalize"],
    followUps: [
      "How do abstract base classes fit in?",
      "What is typing.Protocol (structural typing)?",
      "How does operator overloading relate (e.g. __add__)?",
    ],
    commonMistakes: [
      "Adding unnecessary isinstance() checks",
      "Assuming compile-time interface guarantees",
      "Ignoring the runtime-error risk of duck typing",
    ],
    bestPractices: [
      "Program to behavior, not concrete types",
      "Use ABCs/Protocol where a contract must be explicit",
      "Handle the missing-method case gracefully",
    ],
    relatedTech: ["typing.Protocol", "abc module", "operator overloading"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["python-inheritance-super", "python-encapsulation"],
  },
  {
    slug: "python-encapsulation",
    categoryId: "python",
    topic: "Encapsulation",
    question: "How does encapsulation work in Python (_ , __ , and @property)?",
    tags: ["encapsulation", "private", "name mangling", "property", "oop"],
    shortAnswer:
      "Python has no truly private members — it uses convention. A single underscore `_x` means 'internal, please don't touch'; a double underscore `__x` triggers name mangling (becomes _Class__x) to avoid subclass clashes. `@property` exposes controlled getters/setters so you can validate access without changing the public API.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "_name", v: "convention: internal use" },
          { k: "__name", v: "name-mangled to _Class__name" },
          { k: "@property", v: "getter/setter with validation" },
          { k: "Philosophy", v: "'we're all adults here'" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `class Account:
    def __init__(self, balance):
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("negative balance")
        self._balance = value

a = Account(100)
a.balance = 150          # goes through the setter
print(a.balance)`,
      output: "150",
    },
    whatIf: {
      q: "Does a double underscore `__balance` make an attribute truly private?",
      a: "No — it's name mangling, not access control. `__balance` becomes `_Account__balance`, which prevents accidental clashes in subclasses but is still reachable if you use the mangled name. Python has no enforced private; it relies on the `_` convention plus @property for controlled access.",
    },
    realWorld:
      "@property lets you start with a plain attribute and later add validation, logging, or computed values without breaking callers — a widely used way to keep a clean public API while encapsulating internals.",
    interviewerExpectation: ["no true private in Python", "_ convention, __ name mangling", "@property for controlled access", "validation in setters", "public API stability"],
    followUps: [
      "When would you use a computed @property?",
      "How does name mangling actually rewrite the name?",
      "What are __slots__ and how do they relate?",
    ],
    commonMistakes: [
      "Thinking __x is enforced-private",
      "Writing Java-style getX()/setX() instead of @property",
      "Overusing double underscores",
    ],
    bestPractices: [
      "Use _ for internal, __ only to avoid subclass clashes",
      "Expose validated access with @property",
      "Keep the public attribute API stable",
    ],
    relatedTech: ["@property", "name mangling", "__slots__", "dataclasses"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Microsoft", "Infosys"],
    related: ["python-oop-class-self", "python-polymorphism-duck-typing"],
  },
  {
    slug: "python-multithreading-vs-multiprocessing",
    categoryId: "python",
    topic: "Concurrency",
    question: "When should you use multithreading vs multiprocessing in Python?",
    tags: ["multithreading", "multiprocessing", "concurrency", "gil", "asyncio"],
    shortAnswer:
      "Use threads (or asyncio) for I/O-bound work — network calls, disk, DB — where tasks mostly wait, so the GIL is released and concurrency helps. Use multiprocessing for CPU-bound work — heavy computation — because separate processes each have their own interpreter and GIL, achieving true parallelism across cores.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "I/O-bound", v: "threads / asyncio (waiting)" },
          { k: "CPU-bound", v: "multiprocessing (true parallel)" },
          { k: "Why", v: "GIL blocks parallel CPU threads" },
          { k: "Cost", v: "processes = more memory + IPC" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

# I/O-bound: threads shine (GIL released during I/O)
with ThreadPoolExecutor() as ex:
    ex.map(download, urls)

# CPU-bound: processes give real parallelism
with ProcessPoolExecutor() as ex:
    results = ex.map(crunch_numbers, big_chunks)`,
    },
    whatIf: {
      q: "Why don't Python threads speed up a CPU-heavy loop, but multiprocessing does?",
      a: "The GIL lets only one thread execute Python bytecode at a time, so CPU-bound threads just take turns — no speedup on multiple cores. Multiprocessing spawns separate processes, each with its own interpreter and GIL, so they truly run in parallel. The cost is higher memory and inter-process communication.",
    },
    realWorld:
      "Web scrapers and API aggregators (I/O-bound) use thread pools or asyncio; image processing, ML feature crunching, and numeric work (CPU-bound) use multiprocessing — matching the tool to whether the task waits or computes.",
    interviewerExpectation: ["I/O-bound → threads/asyncio", "CPU-bound → multiprocessing", "GIL blocks parallel CPU threads", "processes = own GIL", "IPC/memory cost"],
    followUps: [
      "Where does asyncio fit vs threads?",
      "What's the overhead of multiprocessing (pickling, startup)?",
      "How do NumPy/C extensions bypass the GIL?",
    ],
    commonMistakes: [
      "Using threads for CPU-bound work and seeing no gain",
      "Ignoring IPC/serialization cost of processes",
      "Sharing mutable state across processes carelessly",
    ],
    bestPractices: [
      "Match concurrency model to I/O vs CPU",
      "Use concurrent.futures executors",
      "Consider asyncio for high-concurrency I/O",
    ],
    relatedTech: ["concurrent.futures", "asyncio", "multiprocessing", "GIL"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft", "Deloitte"],
    related: ["python-gil", "python-generators-yield"],
  },

  // ---------------------------------------------------------------- Hard (1)
  {
    slug: "python-gil",
    categoryId: "python",
    topic: "GIL",
    question: "What is the GIL (Global Interpreter Lock) and what are its implications?",
    tags: ["gil", "global interpreter lock", "concurrency", "cpython", "threads"],
    shortAnswer:
      "The GIL is a mutex in CPython that allows only one thread to execute Python bytecode at a time. It makes single-threaded code and memory management simpler/safer but prevents CPU-bound threads from running Python in true parallel. I/O releases the GIL, so threads still help I/O-bound work; CPU-bound work needs multiprocessing.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "What", v: "one thread runs Python bytecode at a time" },
          { k: "Where", v: "CPython (not Jython/PyPy-STM)" },
          { k: "Hurts", v: "CPU-bound multithreading" },
          { k: "Fine for", v: "I/O-bound (GIL released on I/O)" },
        ],
      },
    ],
    handsOn: {
      lang: "python",
      code: `# Two CPU-bound threads do NOT run in parallel (GIL):
import threading
def burn():
    x = 0
    for _ in range(10_000_000):
        x += 1

t1 = threading.Thread(target=burn)
t2 = threading.Thread(target=burn)
t1.start(); t2.start(); t1.join(); t2.join()
# ~same wall time as running burn() twice sequentially
# For real parallelism use multiprocessing instead`,
    },
    whatIf: {
      q: "If the GIL limits parallelism, why does CPython keep it?",
      a: "It makes CPython's memory management (reference counting) thread-safe without fine-grained locking, keeps C extensions simpler, and makes single-threaded code fast — the common case. Removing it historically slowed single-threaded programs. Work like the optional free-threaded (no-GIL) builds aims to relax this while preserving compatibility.",
    },
    realWorld:
      "The GIL is why 'add threads' doesn't speed up number-crunching in pure Python, pushing teams to multiprocessing, C/NumPy (which releases the GIL), or async for I/O — a defining constraint interviewers probe for senior Python roles.",
    interviewerExpectation: ["one thread runs bytecode at a time", "CPython-specific", "blocks CPU-bound parallelism", "I/O releases the GIL", "workarounds: multiprocessing / C ext / async"],
    followUps: [
      "How do NumPy/C extensions release the GIL?",
      "What is the free-threaded / no-GIL CPython effort?",
      "How does asyncio achieve concurrency despite the GIL?",
    ],
    commonMistakes: [
      "Expecting threads to parallelize CPU work",
      "Thinking the GIL affects all Python implementations",
      "Believing the GIL makes all code thread-safe (it doesn't for compound ops)",
    ],
    bestPractices: [
      "Use multiprocessing for CPU-bound parallelism",
      "Use threads/asyncio for I/O-bound concurrency",
      "Offload heavy math to NumPy/C that releases the GIL",
    ],
    relatedTech: ["multiprocessing", "asyncio", "NumPy", "free-threaded CPython"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["python-multithreading-vs-multiprocessing", "python-virtualenv"],
  },
];
