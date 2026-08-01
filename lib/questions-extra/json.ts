import type { Question } from "../types";

/**
 * JSON — content expansion batch (25 questions, ROADMAP CE2).
 * Beginner → advanced coverage of the JSON topics interviewers ask across
 * frontend, backend and full-stack roles: basics (what/why/vs XML, data types,
 * syntax), objects & arrays (nesting, access, flattening), parsing &
 * serialization (parse/stringify, common errors, invalid input, pretty print),
 * REST usage (request/response, status codes, validation, JSON Schema), and
 * advanced topics (large-payload performance, security, JSON vs BSON, JWT
 * structure, mixed interview scenarios).
 *
 * Distinct from the base-bank `json-vs-xml` question ("why JSON replaced XML for
 * APIs") — this batch adds a complementary structural comparison
 * (`json-vs-xml-differences`) that cross-links to it, so there are no duplicate
 * questions. Difficulty mix: 14 Easy · 10 Medium · 1 Hard. Ordered by the five
 * learning sections (basics → advanced).
 *
 * Each question also sets the optional SEO overrides (`seoTitle`,
 * `seoDescription`, `heading`) introduced in the SEO CTR pass (DECISIONS #033),
 * giving keyword-led titles/descriptions/H1s while the ☕ Coffee Chat block and
 * `QAPage` structured data keep the conversational `question`.
 */
export const jsonExtra: Question[] = [
  // ============================================================ Section 1 — Basics
  {
    slug: "what-is-json",
    categoryId: "json",
    topic: "Basics",
    question: "What is JSON?",
    seoTitle: "What is JSON? Interview Questions & Answers (2026) | Full Stack Interview Guru",
    seoDescription:
      "What is JSON explained for interviews: JavaScript Object Notation, a lightweight text-based data-interchange format for APIs. Syntax, data types, and real-world use with examples.",
    heading: "What is JSON? Interview Questions",
    tags: ["json", "javascript object notation", "data format", "basics", "data interchange"],
    shortAnswer:
      "JSON (JavaScript Object Notation) is a lightweight, text-based, language-independent format for storing and exchanging data as key/value pairs and ordered lists. It grew out of JavaScript object syntax but is now used by nearly every language and is the default payload format for REST APIs.",
    mindMap: [
      { type: "text", content: "JSON is just **text that describes data** in a shape almost every language understands. Machines exchange it; humans can read it." },
      {
        type: "kv",
        rows: [
          { k: "Stands for", v: "JavaScript Object Notation" },
          { k: "Form", v: "Text — objects `{}` and arrays `[]`" },
          { k: "Used for", v: "APIs, config, logs, messaging" },
          { k: "Language", v: "Independent (not just JavaScript)" },
        ],
      },
    ],
    handsOn: {
      lang: "json",
      code: `{
  "name": "Guru",
  "age": 30,
  "isEngineer": true,
  "skills": ["Java", "AWS"],
  "address": { "city": "Chennai" }
}`,
    },
    whatIf: {
      q: "Is JSON the same thing as a JavaScript object?",
      a: "No. JSON is a text FORMAT inspired by JavaScript object literals, but it's stricter — keys must be double-quoted strings, no comments, no trailing commas, no functions or dates. A JavaScript object lives in memory; JSON is a string you parse into (or serialize from) such objects.",
    },
    realWorld:
      "Almost every API response you've ever seen is JSON — the frontend fetches it, parses it, and renders the UI. It's also everywhere in config files (package.json, tsconfig.json), log lines, and message queues.",
    interviewerExpectation: ["text-based data format", "key/value + arrays", "language-independent", "default for REST APIs", "human-readable"],
    followUps: [
      "How is JSON different from a JavaScript object?",
      "What data types does JSON support?",
      "Why did JSON become more popular than XML?",
    ],
    commonMistakes: [
      "Calling JSON a programming language",
      "Assuming it's JavaScript-only",
      "Confusing the in-memory object with the JSON string",
    ],
    bestPractices: [
      "Use JSON for interchange, not as an in-memory type",
      "Keep keys consistent (camelCase or snake_case)",
      "Validate JSON at trust boundaries",
    ],
    relatedTech: ["REST", "JavaScript", "YAML", "XML"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture", "Cognizant"],
    related: ["json-why-widely-used", "json-data-types", "json-vs-xml-differences"],
  },
  {
    slug: "json-why-widely-used",
    categoryId: "json",
    topic: "Basics",
    question: "Why is JSON so widely used?",
    seoTitle: "Why is JSON Widely Used? Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Why JSON is widely used, explained for interviews: lightweight, human-readable, language-independent, and natively parsed in browsers. Compare with XML and see real-world API examples.",
    heading: "Why JSON Is Widely Used — Interview Questions",
    tags: ["json", "advantages", "lightweight", "api", "interoperability"],
    shortAnswer:
      "JSON won because it's lightweight, human-readable, language-independent, and maps directly onto the objects/arrays every language already has. Browsers parse it natively (JSON.parse), payloads are small, and it's simpler than XML — perfect for REST APIs and mobile clients where bandwidth and simplicity matter.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Lightweight", v: "Less markup than XML → smaller payloads" },
          { k: "Readable", v: "Humans can read/debug it easily" },
          { k: "Universal", v: "Parsers in every language" },
          { k: "Native", v: "JSON.parse / JSON.stringify in browsers" },
        ],
      },
      { type: "text", content: "It maps cleanly to objects and arrays, so there's almost no translation cost between the wire format and your code." },
    ],
    handsOn: {
      lang: "javascript",
      code: `// The browser speaks JSON natively — no library needed
const res = await fetch("/api/user/1");
const user = await res.json();   // JSON text -> JS object
console.log(user.name);`,
    },
    whatIf: {
      q: "If JSON is so good, when would you still NOT use it?",
      a: "For huge binary data (use a binary format like Protocol Buffers, Avro, or BSON), for documents needing rich markup/validation (XML), or for streaming millions of records where a compact binary encoding saves bandwidth and CPU. JSON's readability costs size and parse speed at extreme scale.",
    },
    realWorld:
      "Mobile and single-page apps drove JSON's dominance: smaller payloads save battery and data, and the browser parses it for free. Config tooling (npm, VS Code, cloud IaC) leaned in for the same readability.",
    interviewerExpectation: ["lightweight/small payloads", "human-readable", "language-independent", "native browser parsing", "maps to objects/arrays"],
    followUps: [
      "What are JSON's downsides vs a binary format?",
      "Why is it better than XML for APIs?",
      "How does payload size affect API performance?",
    ],
    commonMistakes: [
      "Claiming JSON is always faster than binary formats",
      "Ignoring size/parse cost at large scale",
      "Assuming readability has no runtime price",
    ],
    bestPractices: [
      "Prefer JSON for public/web APIs",
      "Consider binary formats for high-volume internal traffic",
      "Compress large JSON responses (gzip/br)",
    ],
    relatedTech: ["REST", "Protocol Buffers", "gzip", "GraphQL"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture", "Amazon"],
    related: ["what-is-json", "json-vs-xml-differences", "json-vs-bson"],
  },
  {
    slug: "json-vs-xml-differences",
    categoryId: "json",
    topic: "JSON vs XML",
    question: "What are the key structural differences between JSON and XML?",
    seoTitle: "JSON vs XML: Differences Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "JSON vs XML compared for interviews: syntax, verbosity, data types, attributes, comments, schema validation, and when to choose each. Clear side-by-side examples for API developers.",
    heading: "JSON vs XML — Interview Questions",
    tags: ["json", "xml", "comparison", "data format", "markup"],
    shortAnswer:
      "JSON represents data as key/value objects and arrays; XML uses nested tags with optional attributes. JSON is less verbose, has native data types (number/boolean/null), and maps directly to objects, while XML supports attributes, comments, namespaces, and mature schema validation (XSD). JSON is lighter for APIs; XML suits document-centric or legacy/SOAP systems.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Structure", v: "JSON: objects/arrays · XML: nested tags" },
          { k: "Verbosity", v: "JSON lighter · XML has open/close tags" },
          { k: "Types", v: "JSON has number/bool/null · XML all text" },
          { k: "Extras", v: "XML: attributes, comments, namespaces, XSD" },
        ],
      },
    ],
    handsOn: {
      lang: "xml",
      code: `<!-- XML -->
<user id="101">
  <name>Guru</name>
  <skills>
    <skill>Java</skill>
  </skills>
</user>

<!-- JSON equivalent -->
<!-- { "id": 101, "name": "Guru", "skills": ["Java"] } -->`,
    },
    whatIf: {
      q: "XML has attributes and comments — does JSON have an equivalent?",
      a: "No. JSON has no attributes (everything is a key/value), no comments, and no namespaces. If you need those — say, rich document markup or strict enterprise schema validation — XML is a better fit. For most API payloads, JSON's simpler model is an advantage, not a limitation.",
    },
    realWorld:
      "Teams migrating SOAP/XML services to REST usually switch to JSON for smaller payloads and easier client parsing, but keep XML where a partner mandates SOAP or where documents need XSD validation.",
    interviewerExpectation: ["objects/arrays vs nested tags", "JSON less verbose", "JSON native types", "XML attributes/namespaces/XSD", "pick by use case"],
    followUps: [
      "Why did JSON replace XML for most web APIs?",
      "When is XML still the right choice?",
      "How do you validate JSON without XSD?",
    ],
    commonMistakes: [
      "Saying XML is 'obsolete' (still used in SOAP/enterprise)",
      "Forgetting JSON has no comments/attributes",
      "Assuming both have the same type support",
    ],
    bestPractices: [
      "Choose JSON for web/mobile APIs",
      "Keep XML for document markup, SOAP, or XSD needs",
      "Validate JSON with JSON Schema when structure matters",
    ],
    relatedTech: ["XML", "SOAP", "XSD", "JSON Schema"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Deloitte", "Cognizant"],
    related: ["json-vs-xml", "json-why-widely-used", "json-schema"],
  },
  {
    slug: "json-data-types",
    categoryId: "json",
    topic: "Syntax",
    question: "What data types does JSON support?",
    seoTitle: "JSON Data Types Interview Questions & Answers (2026) | Full Stack Interview Guru",
    seoDescription:
      "JSON data types explained for interviews: string, number, boolean, null, object, and array. What JSON does NOT support (dates, undefined, functions) and how to handle them, with examples.",
    heading: "JSON Data Types — Interview Questions",
    tags: ["json", "data types", "string", "number", "boolean", "null"],
    shortAnswer:
      "JSON supports six value types: string (double-quoted), number, boolean (true/false), null, object ({}), and array ([]). It has no date, integer-vs-float distinction, undefined, function, or comment types — dates are usually sent as ISO-8601 strings and big/precise numbers as strings.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Primitives", v: "string, number, boolean, null" },
          { k: "Structured", v: "object {}, array []" },
          { k: "No", v: "date, undefined, function, comment" },
          { k: "Strings", v: "must use double quotes" },
        ],
      },
    ],
    handsOn: {
      lang: "json",
      code: `{
  "name": "Guru",
  "age": 30,
  "verified": true,
  "manager": null,
  "skills": ["Java", "AWS"],
  "joined": "2026-08-01T09:00:00Z"
}`,
    },
    whatIf: {
      q: "How do you represent a date, since JSON has no date type?",
      a: "Use a string, almost always ISO-8601 (\"2026-08-01T09:00:00Z\"), and parse it on each side (new Date(str) in JS, java.time.Instant in Java). Some teams send a Unix epoch number instead. There's no native date, so both parties must agree on the string/number convention.",
    },
    realWorld:
      "The 'JSON has no date' fact bites everyone eventually — you JSON.stringify a Date and it becomes an ISO string, then forget to parse it back and end up comparing a string to a Date. Money and IDs are often sent as strings to avoid float precision loss.",
    interviewerExpectation: ["string/number/boolean/null", "object & array", "no date/undefined/function", "double-quoted strings", "dates as ISO strings"],
    followUps: [
      "Why send large numbers or money as strings?",
      "How is null different from an absent key?",
      "What happens to undefined during JSON.stringify?",
    ],
    commonMistakes: [
      "Expecting a native date type",
      "Using single quotes for strings",
      "Assuming numbers keep exact precision (float issues)",
    ],
    bestPractices: [
      "Send dates as ISO-8601 strings",
      "Send money/large IDs as strings to avoid float errors",
      "Distinguish null (known-empty) from a missing key",
    ],
    relatedTech: ["ISO-8601", "IEEE-754 floats", "JavaScript", "JSON Schema"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture", "Wipro"],
    related: ["json-syntax-rules", "what-is-json", "json-object-vs-array"],
  },
  {
    slug: "json-syntax-rules",
    categoryId: "json",
    topic: "Syntax",
    question: "What are the syntax rules of valid JSON?",
    seoTitle: "JSON Syntax Rules Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "JSON syntax rules for interviews: double-quoted keys and strings, no trailing commas, no comments, allowed value types, and nesting. Learn what makes JSON valid vs invalid with examples.",
    heading: "JSON Syntax Rules — Interview Questions",
    tags: ["json", "syntax", "valid json", "rules", "formatting"],
    shortAnswer:
      "Valid JSON: data is name/value pairs; objects use {}, arrays use []; keys and string values must use double quotes; values are string/number/boolean/null/object/array; items are comma-separated with NO trailing comma; no comments; the whole document is one value. Whitespace between tokens is ignored.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Keys", v: "double-quoted strings only" },
          { k: "Strings", v: "double quotes (not single)" },
          { k: "Separators", v: "`:` key/value, `,` between items" },
          { k: "Not allowed", v: "trailing comma, comments, functions" },
        ],
      },
    ],
    handsOn: {
      lang: "json",
      code: `// ✅ valid
{ "id": 1, "tags": ["a", "b"] }

// ❌ invalid: single quotes, trailing comma, comment
{ 'id': 1, "tags": ["a", "b",], /* note */ }`,
    },
    whatIf: {
      q: "Why does a trailing comma break JSON when JavaScript allows it?",
      a: "JSON is a strict subset of JavaScript's object syntax and the spec forbids trailing commas, comments, and single quotes to keep parsers simple and unambiguous. JS object literals are more forgiving, but JSON.parse follows the strict grammar — a trailing comma throws a SyntaxError.",
    },
    realWorld:
      "The classic 3am bug: someone hand-edits a config file, leaves a trailing comma or a comment, and the whole service fails to boot. Linters and JSON5/JSONC exist precisely because strict JSON is unforgiving of these.",
    interviewerExpectation: ["objects {} / arrays []", "double-quoted keys & strings", "comma-separated, no trailing comma", "no comments", "one root value"],
    followUps: [
      "What is JSON5 / JSONC and why do they exist?",
      "Can the top level be an array or a primitive?",
      "How do you validate JSON syntax programmatically?",
    ],
    commonMistakes: [
      "Trailing comma after the last item",
      "Single quotes or unquoted keys",
      "Adding // or /* */ comments",
    ],
    bestPractices: [
      "Lint/validate JSON in CI and editors",
      "Use JSONC/JSON5 only where the parser supports it",
      "Never hand-edit critical JSON without validation",
    ],
    relatedTech: ["JSON5", "JSONC", "linters", "JSON.parse"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Cognizant", "Accenture"],
    related: ["json-data-types", "json-common-parsing-errors", "json-handling-invalid"],
  },

  // ==================================================== Section 2 — Objects & Arrays
  {
    slug: "json-object-vs-array",
    categoryId: "json",
    topic: "Objects & Arrays",
    question: "What is the difference between a JSON object and a JSON array?",
    seoTitle: "JSON Object vs Array Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "JSON object vs array explained for interviews: {} key/value pairs vs [] ordered lists, when to use each, and how they nest. Clear examples for API request and response design.",
    heading: "JSON Object vs Array — Interview Questions",
    tags: ["json", "object", "array", "structure", "collection"],
    shortAnswer:
      "A JSON object `{}` is an unordered set of key/value pairs — use it for one entity with named fields. A JSON array `[]` is an ordered list of values — use it for a collection of items. They nest freely: arrays of objects, objects containing arrays, and so on.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Object {}", v: "key/value pairs, named fields, unordered" },
          { k: "Array []", v: "ordered list, accessed by index" },
          { k: "Use object for", v: "a single entity (a user)" },
          { k: "Use array for", v: "a list (many users)" },
        ],
      },
    ],
    handsOn: {
      lang: "json",
      code: `{
  "user": { "id": 1, "name": "Guru" },
  "roles": ["admin", "editor"],
  "orders": [
    { "id": 10, "total": 99 },
    { "id": 11, "total": 40 }
  ]
}`,
    },
    whatIf: {
      q: "Should an API return a bare array or wrap it in an object?",
      a: "Prefer wrapping: `{ \"data\": [...], \"page\": 1 }`. A top-level array is valid JSON but leaves no room to add pagination, metadata, or error fields later without a breaking change — and historically had security concerns in older browsers. Wrapping keeps the response extensible.",
    },
    realWorld:
      "Every list endpoint models this: an object for one resource (GET /users/1) and an array for the collection (GET /users). Well-designed APIs wrap the array so they can add totalCount/nextPage without breaking clients.",
    interviewerExpectation: ["object = key/value entity", "array = ordered list", "index vs key access", "they nest", "wrap arrays for extensibility"],
    followUps: [
      "How do you access element 2 of a nested array?",
      "Why wrap a list response in an object?",
      "Can object keys be duplicated?",
    ],
    commonMistakes: [
      "Using an array where named fields are clearer",
      "Returning a bare top-level array with no room to grow",
      "Relying on object key order",
    ],
    bestPractices: [
      "Object for one entity, array for many",
      "Wrap collection responses in an object",
      "Don't depend on key ordering",
    ],
    relatedTech: ["REST", "pagination", "DTO design"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture", "Amazon"],
    related: ["json-nested-objects", "json-arrays", "json-accessing-nested"],
  },
  {
    slug: "json-nested-objects",
    categoryId: "json",
    topic: "Objects & Arrays",
    question: "How do nested JSON objects work?",
    seoTitle: "Nested JSON Objects Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Nested JSON objects explained for interviews: objects inside objects, modeling relationships, depth trade-offs, and safe access. Practical examples for API payload design.",
    heading: "Nested JSON Objects — Interview Questions",
    tags: ["json", "nested", "object", "hierarchy", "structure"],
    shortAnswer:
      "A nested JSON object is an object used as the value of a key inside another object, letting you model hierarchy and relationships (a user has an address, an order has line items). Nesting can go arbitrarily deep, but very deep structures are harder to read, validate, and access safely.",
    mindMap: [
      { type: "text", content: "Nesting groups **related data together** — an object becomes the value of another object's key, forming a tree." },
      {
        type: "kv",
        rows: [
          { k: "Why", v: "model relationships / grouping" },
          { k: "Depth", v: "arbitrary, but keep it shallow" },
          { k: "Risk", v: "deep access → null/undefined errors" },
        ],
      },
    ],
    handsOn: {
      lang: "json",
      code: `{
  "id": 1,
  "name": "Guru",
  "address": {
    "city": "Chennai",
    "geo": { "lat": 13.08, "lng": 80.27 }
  }
}`,
    },
    whatIf: {
      q: "What's the downside of deeply nested JSON?",
      a: "Readability and safe access suffer — reading data.address.geo.lat throws if any level is missing, so you need optional chaining or null checks at every step. It's also harder to validate and to query. Many teams flatten or limit nesting depth to keep payloads manageable.",
    },
    realWorld:
      "API responses nest naturally — a user with an address with coordinates — but over-nesting is a real pain point. Front-end code littered with `a?.b?.c?.d` is usually a sign the payload should be flatter.",
    interviewerExpectation: ["object as a value", "models hierarchy", "arbitrary depth", "safe access needed", "avoid over-nesting"],
    followUps: [
      "How do you safely access a deep value?",
      "When would you flatten a nested structure?",
      "How does nesting affect JSON Schema validation?",
    ],
    commonMistakes: [
      "Accessing deep keys without null checks",
      "Over-nesting when a flat shape is clearer",
      "Assuming every nested branch is present",
    ],
    bestPractices: [
      "Keep nesting shallow and purposeful",
      "Use optional chaining / null checks for deep access",
      "Flatten when consumers only need leaf values",
    ],
    relatedTech: ["optional chaining", "JSON Schema", "DTO design"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Cognizant", "Deloitte"],
    related: ["json-accessing-nested", "json-flattening", "json-object-vs-array"],
  },
  {
    slug: "json-arrays",
    categoryId: "json",
    topic: "Objects & Arrays",
    question: "How are JSON arrays used and what can they contain?",
    seoTitle: "JSON Arrays Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "JSON arrays explained for interviews: ordered lists, mixed vs uniform element types, arrays of objects, and iteration. Best practices for list responses with real examples.",
    heading: "JSON Arrays — Interview Questions",
    tags: ["json", "array", "list", "collection", "iteration"],
    shortAnswer:
      "A JSON array is an ordered list in square brackets whose elements can be any JSON value — including objects and other arrays — and can technically be mixed types. In practice you keep arrays homogeneous (all the same shape) so clients can iterate and map them predictably.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Syntax", v: "[ v1, v2, v3 ] — comma-separated" },
          { k: "Ordered", v: "index 0..n-1, order preserved" },
          { k: "Elements", v: "any JSON value (usually objects)" },
          { k: "Convention", v: "keep them same-shaped" },
        ],
      },
    ],
    handsOn: {
      lang: "javascript",
      code: `const data = JSON.parse('[{"id":1},{"id":2},{"id":3}]');
const ids = data.map(o => o.id);
console.log(ids);   // [1, 2, 3]`,
      output: "[1, 2, 3]",
    },
    whatIf: {
      q: "JSON allows mixed-type arrays like [1, \"two\", true] — should you use them?",
      a: "Avoid them in API payloads. Mixed arrays are valid but force consumers to type-check every element and break simple mapping/validation. Keep arrays homogeneous; if you truly need heterogeneous items, use an array of objects with a discriminator field (e.g. a \"type\" key).",
    },
    realWorld:
      "List endpoints return arrays of objects that the UI maps into rows/cards. Keeping every element the same shape is what lets `items.map(render)` just work without defensive type checks.",
    interviewerExpectation: ["ordered list", "any value type", "usually arrays of objects", "keep homogeneous", "index access & map"],
    followUps: [
      "How do you handle an array of different item types?",
      "Why keep array elements the same shape?",
      "How do you paginate a large array?",
    ],
    commonMistakes: [
      "Mixed-type arrays that break mapping",
      "Assuming order isn't guaranteed (it is, in arrays)",
      "Returning unbounded arrays with no pagination",
    ],
    bestPractices: [
      "Keep arrays homogeneous",
      "Use a discriminator field for heterogeneous items",
      "Paginate large collections",
    ],
    relatedTech: ["Array.map", "pagination", "DTO design"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture", "Wipro"],
    related: ["json-object-vs-array", "json-accessing-nested", "json-in-rest-apis"],
  },
  {
    slug: "json-accessing-nested",
    categoryId: "json",
    topic: "Objects & Arrays",
    question: "How do you safely access values in nested JSON?",
    seoTitle: "Accessing Nested JSON Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Accessing nested JSON safely for interviews: dot vs bracket notation, optional chaining, defaults, and array index access across JavaScript and Python. Avoid null/undefined crashes.",
    heading: "Accessing Nested JSON — Interview Questions",
    tags: ["json", "nested access", "optional chaining", "dot notation", "safe access"],
    shortAnswer:
      "After parsing JSON into an object, drill in with dot or bracket notation (obj.a.b, obj[\"a\"][\"b\"]) and array indices (arr[0]). Because any level can be missing, access defensively — optional chaining (a?.b?.c) with a default in JS, or dict.get()/try-except in Python — so a missing branch returns a fallback instead of crashing.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Dot", v: "obj.address.city" },
          { k: "Bracket", v: "obj[\"address\"][\"city\"] (dynamic keys)" },
          { k: "Array", v: "obj.orders[0].id" },
          { k: "Safe", v: "obj?.address?.city ?? 'N/A'" },
        ],
      },
    ],
    handsOn: {
      lang: "javascript",
      code: `const data = JSON.parse('{"user":{"address":{"city":"Chennai"}}}');

// safe: won't throw if a level is missing
const city = data.user?.address?.city ?? "unknown";
const zip  = data.user?.address?.zip  ?? "unknown";
console.log(city, zip);`,
      output: "Chennai unknown",
    },
    whatIf: {
      q: "Why does `data.user.address.city` throw when `address` is missing?",
      a: "Reading `.city` on `undefined` throws 'Cannot read properties of undefined'. Each dot dereferences the previous result, so one missing level breaks the chain. Optional chaining (`?.`) short-circuits to undefined at the first gap, and `?? default` supplies a fallback — the safe idiom for untrusted payloads.",
    },
    realWorld:
      "Third-party and optional API fields are the top cause of 'Cannot read property of undefined' in production. Optional chaining plus sensible defaults is the everyday defense when consuming JSON you don't fully control.",
    interviewerExpectation: ["dot vs bracket notation", "array index access", "optional chaining `?.`", "defaults with `??`", "Python dict.get / try-except"],
    followUps: [
      "How do you do the same safely in Python?",
      "When would you flatten instead of deep-accessing?",
      "What tools query JSON (JSONPath, jq)?",
    ],
    commonMistakes: [
      "Chained dot access with no null checks",
      "Bracket vs dot confusion with dynamic keys",
      "Assuming optional fields are always present",
    ],
    bestPractices: [
      "Use optional chaining + defaults for untrusted data",
      "Validate shape before deep access",
      "Prefer dict.get()/JSONPath for dynamic keys",
    ],
    relatedTech: ["optional chaining", "JSONPath", "jq", "Python dict.get"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Cognizant"],
    related: ["json-nested-objects", "json-flattening", "json-parsing"],
  },
  {
    slug: "json-flattening",
    categoryId: "json",
    topic: "Objects & Arrays",
    question: "What does it mean to flatten JSON and when would you do it?",
    seoTitle: "Flattening JSON Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Flattening JSON explained for interviews: turning nested objects into single-level key paths, why (CSV, search indexing, analytics), trade-offs, and code examples in JavaScript.",
    heading: "Flattening JSON — Interview Questions",
    tags: ["json", "flatten", "nested", "transformation", "etl"],
    shortAnswer:
      "Flattening converts a nested structure into a single-level map by joining key paths (e.g. address.geo.lat → \"address.geo.lat\": 13.08). You do it to load JSON into flat stores like CSV/columns, index it for search, feed analytics, or simplify diffing — trading the natural hierarchy for a flat, uniform shape.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Input", v: "{ a: { b: 1 } }" },
          { k: "Output", v: "{ \"a.b\": 1 }" },
          { k: "Why", v: "CSV/columns, search, analytics, diffs" },
          { k: "Cost", v: "loses natural hierarchy" },
        ],
      },
    ],
    handsOn: {
      lang: "javascript",
      code: `function flatten(obj, prefix = "", out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? \`\${prefix}.\${k}\` : k;
    if (v && typeof v === "object" && !Array.isArray(v))
      flatten(v, key, out);
    else out[key] = v;
  }
  return out;
}
console.log(flatten({ a: { b: 1 }, c: 2 }));`,
      output: '{ "a.b": 1, "c": 2 }',
    },
    whatIf: {
      q: "How do you flatten arrays inside the JSON?",
      a: "There's no single answer — you either index them (items.0.name, items.1.name), explode them into multiple flat rows (common in ETL), or serialize the array as a JSON string in one column. The right choice depends on whether downstream tools need to query individual elements.",
    },
    realWorld:
      "ETL pipelines and log analytics flatten nested JSON so it fits columnar stores (BigQuery, Redshift) and is easy to query with SQL. Search indexers and config-diff tools flatten for the same reason.",
    interviewerExpectation: ["join key paths", "single-level output", "for CSV/search/analytics", "handle arrays specially", "loses hierarchy"],
    followUps: [
      "How do you handle arrays when flattening?",
      "How would you un-flatten back to nested?",
      "What tools flatten JSON (jq, pandas.json_normalize)?",
    ],
    commonMistakes: [
      "Ignoring arrays during flattening",
      "Key collisions from a bad separator choice",
      "Flattening when consumers actually need the hierarchy",
    ],
    bestPractices: [
      "Pick a clear, collision-safe path separator",
      "Decide an array strategy up front (index/explode)",
      "Flatten only at the boundary that needs it",
    ],
    relatedTech: ["ETL", "pandas.json_normalize", "jq", "BigQuery"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Cognizant", "Wipro"],
    related: ["json-nested-objects", "json-accessing-nested", "json-large-performance"],
  },

  // ============================================ Section 3 — Parsing & Serialization
  {
    slug: "json-parsing",
    categoryId: "json",
    topic: "Parsing",
    question: "What is JSON parsing?",
    seoTitle: "JSON Parsing Interview Questions & Answers (2026) | Full Stack Interview Guru",
    seoDescription:
      "JSON parsing explained for interviews: converting a JSON string into in-memory objects with JSON.parse / json.loads, why parsing can fail, and safe patterns with real examples.",
    heading: "JSON Parsing — Interview Questions",
    tags: ["json", "parsing", "json.parse", "deserialize", "loads"],
    shortAnswer:
      "Parsing is converting a JSON text string into an in-memory data structure your code can use — JSON.parse(str) in JavaScript, json.loads(str) in Python, Jackson/Gson in Java. It's the deserialization step; if the string isn't valid JSON, the parser throws, so you wrap it in error handling at trust boundaries.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Input", v: "JSON text (a string)" },
          { k: "Output", v: "objects/arrays/values in memory" },
          { k: "JS", v: "JSON.parse(str)" },
          { k: "Python / Java", v: "json.loads / Jackson·Gson" },
        ],
      },
    ],
    handsOn: {
      lang: "javascript",
      code: `const text = '{"id":1,"name":"Guru"}';
const obj = JSON.parse(text);   // string -> object
console.log(obj.name);          // "Guru"
console.log(typeof obj);        // "object"`,
      output: "Guru\nobject",
    },
    whatIf: {
      q: "What's the difference between JSON.parse and eval() for parsing JSON?",
      a: "Never use eval(). eval() executes the string as code — if the JSON is attacker-controlled, that's remote code execution. JSON.parse only accepts data and throws on anything else, so it's both safe and faster. eval-based parsing is a classic security anti-pattern.",
    },
    realWorld:
      "Every fetch/axios call parses the response body before you can use it (res.json() calls JSON.parse under the hood). Backends parse request bodies the same way — parsing is the gateway between the wire and your objects.",
    interviewerExpectation: ["string → in-memory object", "deserialization step", "JSON.parse/json.loads", "can throw on invalid input", "never use eval"],
    followUps: [
      "How is parsing different from serialization?",
      "How do you handle a parse error safely?",
      "Why is eval() dangerous for JSON?",
    ],
    commonMistakes: [
      "Using eval() to parse JSON",
      "Not wrapping parse in try/catch",
      "Parsing an already-parsed object",
    ],
    bestPractices: [
      "Always use JSON.parse / json.loads, never eval",
      "Wrap parsing in try/catch at boundaries",
      "Validate the shape after parsing",
    ],
    relatedTech: ["JSON.parse", "json.loads", "Jackson", "Gson"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture", "Amazon"],
    related: ["json-serialization-vs-deserialization", "json-common-parsing-errors", "json-handling-invalid"],
  },
  {
    slug: "json-serialization-vs-deserialization",
    categoryId: "json",
    topic: "Serialization",
    question: "What is the difference between serialization and deserialization?",
    seoTitle: "Serialization vs Deserialization Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Serialization vs deserialization in JSON explained for interviews: object → JSON string vs JSON string → object, JSON.stringify/parse, replacer/reviver, and gotchas with dates and undefined.",
    heading: "Serialization vs Deserialization — Interview Questions",
    tags: ["json", "serialization", "deserialization", "stringify", "parse"],
    shortAnswer:
      "Serialization turns an in-memory object into a JSON string (JSON.stringify, json.dumps) for storage or transmission; deserialization does the reverse, turning a JSON string back into objects (JSON.parse, json.loads). Serialize on the way out, deserialize on the way in.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Serialize", v: "object → JSON string (stringify/dumps)" },
          { k: "Deserialize", v: "JSON string → object (parse/loads)" },
          { k: "When", v: "serialize to send/store, deserialize to read" },
          { k: "Watch", v: "dates, undefined, functions drop/convert" },
        ],
      },
    ],
    handsOn: {
      lang: "javascript",
      code: `const obj = { id: 1, when: new Date("2026-08-01"), fn: () => 1 };

const text = JSON.stringify(obj);   // serialize
console.log(text);
// {"id":1,"when":"2026-08-01T00:00:00.000Z"}  (fn is dropped!)

const back = JSON.parse(text);      // deserialize
console.log(typeof back.when);      // "string" — not a Date`,
    },
    whatIf: {
      q: "What happens to a Date, a function, and undefined during JSON.stringify?",
      a: "A Date becomes its ISO string (and won't turn back into a Date on parse), while functions, undefined values, and symbols are omitted from objects (and become null inside arrays). That asymmetry is why round-tripping isn't lossless — you often need a reviver on parse or a toJSON/DTO on serialize.",
    },
    realWorld:
      "The 'my date is now a string' bug comes straight from this: you stringify an object with a Date, send it, parse it, and the field is a string. Teams add reviver functions or map to DTOs to restore types after deserialization.",
    interviewerExpectation: ["serialize = object→string", "deserialize = string→object", "stringify/parse, dumps/loads", "lossy for date/undefined/function", "reviver/replacer"],
    followUps: [
      "What do the replacer and reviver arguments do?",
      "How do you preserve types across a round-trip?",
      "How do Jackson/Gson map JSON to typed classes?",
    ],
    commonMistakes: [
      "Expecting a lossless round-trip for dates",
      "Forgetting functions/undefined are dropped",
      "Confusing which direction is which",
    ],
    bestPractices: [
      "Use a reviver/DTO to restore types",
      "Send dates as ISO strings deliberately",
      "Keep serializable objects plain (no functions)",
    ],
    relatedTech: ["JSON.stringify", "reviver/replacer", "Jackson", "DTO"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Amazon", "Deloitte"],
    related: ["json-parsing", "json-data-types", "json-pretty-printing"],
  },
  {
    slug: "json-common-parsing-errors",
    categoryId: "json",
    topic: "Parsing",
    question: "What are common JSON parsing errors and their causes?",
    seoTitle: "Common JSON Parsing Errors Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Common JSON parsing errors for interviews: 'Unexpected token', trailing commas, single quotes, BOM/encoding, unescaped characters, and 'Unexpected end of input'. Causes and fixes with examples.",
    heading: "Common JSON Parsing Errors — Interview Questions",
    tags: ["json", "parsing errors", "unexpected token", "syntax error", "debugging"],
    shortAnswer:
      "The usual culprits: trailing commas, single quotes or unquoted keys, comments, unescaped control characters or quotes inside strings, wrong encoding/BOM, and truncated payloads ('Unexpected end of input'). A frequent one is calling JSON.parse on something that isn't JSON at all — like an HTML error page ('Unexpected token < in JSON').",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Unexpected token <", v: "parsing an HTML/error page as JSON" },
          { k: "Trailing comma", v: "comma after last item" },
          { k: "Unexpected end", v: "truncated / empty body" },
          { k: "Bad quotes", v: "single quotes / unescaped chars" },
        ],
      },
    ],
    handsOn: {
      lang: "javascript",
      code: `JSON.parse("{'a':1}");        // ❌ single quotes -> SyntaxError
JSON.parse('{"a":1,}');       // ❌ trailing comma
JSON.parse('');               // ❌ Unexpected end of input
JSON.parse('<html>...');      // ❌ Unexpected token < (got HTML)
JSON.parse('{"a":1}');        // ✅ ok`,
    },
    whatIf: {
      q: "Your API call fails with 'Unexpected token < in JSON at position 0' — what happened?",
      a: "You tried to JSON.parse an HTML page, not JSON. Usually the request hit a proxy/error page or a 404/500 that returned HTML, and the client parsed the body blindly. Fix it by checking the HTTP status and Content-Type before parsing, and by logging the raw response body.",
    },
    realWorld:
      "'Unexpected token < in JSON' is one of the most-Googled front-end errors — it almost always means the endpoint returned an HTML error page. Checking status/content-type before parsing prevents it.",
    interviewerExpectation: ["trailing comma / single quotes", "unescaped chars", "truncated body", "wrong content (HTML)", "check status/content-type first"],
    followUps: [
      "How do you handle these errors gracefully?",
      "Why check Content-Type before parsing?",
      "How does encoding/BOM cause parse failures?",
    ],
    commonMistakes: [
      "Parsing before checking HTTP status/content-type",
      "Assuming a 200 always means valid JSON",
      "Not logging the raw body on failure",
    ],
    bestPractices: [
      "Verify status + Content-Type before parsing",
      "Wrap parsing in try/catch",
      "Log the raw response when parsing fails",
    ],
    relatedTech: ["HTTP", "Content-Type", "UTF-8/BOM", "JSON.parse"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Cognizant", "Deloitte"],
    related: ["json-handling-invalid", "json-syntax-rules", "json-parsing"],
  },
  {
    slug: "json-handling-invalid",
    categoryId: "json",
    topic: "Parsing",
    question: "How do you handle invalid or malformed JSON?",
    seoTitle: "Handling Invalid JSON Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Handling invalid JSON for interviews: try/catch around parsing, validating status and content-type, safe-parse helpers, schema checks, and returning clear errors instead of crashing.",
    heading: "Handling Invalid JSON — Interview Questions",
    tags: ["json", "error handling", "invalid json", "try catch", "validation"],
    shortAnswer:
      "Never assume input is valid: wrap parsing in try/catch (or a safeParse helper that returns a result/null), verify HTTP status and Content-Type first, and after parsing validate the shape (required fields/types) before use. On failure, log the raw payload and return a clear error (e.g. 400) rather than letting the parser throw uncaught.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Guard", v: "check status + Content-Type" },
          { k: "Parse", v: "try/catch or safeParse → result" },
          { k: "Validate", v: "shape/types after parse" },
          { k: "Fail", v: "log raw + return clear 400 error" },
        ],
      },
    ],
    handsOn: {
      lang: "javascript",
      code: `function safeParse(text) {
  try {
    return { ok: true, data: JSON.parse(text) };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

const r = safeParse('{bad json');
console.log(r.ok ? r.data : "Invalid JSON: " + r.error);`,
      output: "Invalid JSON: Unexpected token b ...",
    },
    whatIf: {
      q: "Should a public API crash or return a 500 when it receives malformed JSON?",
      a: "Neither — return 400 Bad Request with a clear message. Malformed input is a client error, not a server fault, so a 500 is misleading and an uncaught throw can take down the request handler. Parse defensively, and respond with 400 plus enough detail for the caller to fix their payload.",
    },
    realWorld:
      "Robust services treat every inbound body as hostile: guard, safe-parse, validate, and respond with a precise 400. This is also a security posture — malformed or oversized JSON is a common probing technique.",
    interviewerExpectation: ["try/catch / safeParse", "check status & content-type", "validate shape after parse", "return 400 not 500", "log raw payload"],
    followUps: [
      "Why is malformed input a 400 and not a 500?",
      "How does JSON Schema fit into validation?",
      "How do you guard against oversized payloads?",
    ],
    commonMistakes: [
      "Letting JSON.parse throw uncaught",
      "Returning 500 for a client's bad JSON",
      "Skipping shape validation after a successful parse",
    ],
    bestPractices: [
      "Safe-parse + validate at every boundary",
      "Return 400 with actionable messages",
      "Cap request body size",
    ],
    relatedTech: ["try/catch", "JSON Schema", "HTTP 400", "input validation"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Accenture"],
    related: ["json-common-parsing-errors", "json-validation", "json-security-best-practices"],
  },
  {
    slug: "json-pretty-printing",
    categoryId: "json",
    topic: "Serialization",
    question: "What is pretty-printing JSON and how do you do it?",
    seoTitle: "Pretty Printing JSON Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Pretty-printing JSON for interviews: JSON.stringify with indentation, json.dumps(indent=2), jq, minify vs pretty, and when each matters for logs, debugging, and payload size.",
    heading: "Pretty Printing JSON — Interview Questions",
    tags: ["json", "pretty print", "formatting", "stringify", "indent"],
    shortAnswer:
      "Pretty-printing formats JSON with indentation and line breaks for human readability — JSON.stringify(obj, null, 2), json.dumps(obj, indent=2), or piping through jq. It's for logs, debugging, and config files; for network payloads you send minified (no spaces) JSON to save bytes.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "JS", v: "JSON.stringify(obj, null, 2)" },
          { k: "Python", v: "json.dumps(obj, indent=2)" },
          { k: "CLI", v: "cat file.json | jq ." },
          { k: "Rule", v: "pretty for humans, minified on the wire" },
        ],
      },
    ],
    handsOn: {
      lang: "javascript",
      code: `const obj = { id: 1, tags: ["a", "b"] };

console.log(JSON.stringify(obj));          // minified
console.log(JSON.stringify(obj, null, 2)); // pretty (2-space indent)`,
      output: `{"id":1,"tags":["a","b"]}
{
  "id": 1,
  "tags": [
    "a",
    "b"
  ]
}`,
    },
    whatIf: {
      q: "Should an API pretty-print its JSON responses?",
      a: "By default, no — send minified JSON to reduce payload size and bandwidth (whitespace adds up at scale, and gzip handles the rest anyway). Offer pretty output only as an opt-in (e.g. ?pretty=1) for debugging. Pretty-printing is for humans reading logs/config, not for production traffic.",
    },
    realWorld:
      "Developers pretty-print constantly while debugging — jq in the terminal, formatters in the browser devtools, indent=2 in scripts. Production endpoints stay minified so responses are as small as possible.",
    interviewerExpectation: ["indentation for readability", "stringify(obj,null,2) / dumps(indent=2)", "jq for CLI", "minify on the wire", "size vs readability trade-off"],
    followUps: [
      "Why minify JSON for network responses?",
      "What is the third argument of JSON.stringify?",
      "How does gzip change the size argument?",
    ],
    commonMistakes: [
      "Pretty-printing production API responses by default",
      "Assuming whitespace is free at scale",
      "Confusing minify with compression",
    ],
    bestPractices: [
      "Minify responses; pretty-print only on opt-in",
      "Use indent for logs, config, and debugging",
      "Rely on gzip/brotli for transport size",
    ],
    relatedTech: ["JSON.stringify", "jq", "gzip", "devtools"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Cognizant", "Wipro"],
    related: ["json-serialization-vs-deserialization", "json-large-performance", "json-in-rest-apis"],
  },

  // ================================================== Section 4 — REST APIs
  {
    slug: "json-in-rest-apis",
    categoryId: "json",
    topic: "REST APIs",
    question: "How is JSON used in REST APIs?",
    seoTitle: "JSON in REST APIs Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "JSON in REST APIs explained for interviews: request/response bodies, Content-Type and Accept headers, application/json, and how clients and servers exchange JSON. Real examples included.",
    heading: "JSON in REST APIs — Interview Questions",
    tags: ["json", "rest api", "content-type", "application/json", "http"],
    shortAnswer:
      "In REST, JSON is the standard body format for both requests and responses. Clients send data as a JSON body with Content-Type: application/json (and Accept: application/json to ask for JSON back); the server parses it, does the work, and returns a JSON body plus the right status code. It's the common language between client and server.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Request body", v: "JSON for POST/PUT/PATCH" },
          { k: "Response body", v: "JSON result or error" },
          { k: "Content-Type", v: "application/json (what you send)" },
          { k: "Accept", v: "application/json (what you want back)" },
        ],
      },
    ],
    handsOn: {
      lang: "http",
      code: `POST /api/users HTTP/1.1
Content-Type: application/json
Accept: application/json

{ "name": "Guru", "email": "guru@example.com" }

HTTP/1.1 201 Created
Content-Type: application/json

{ "id": 101, "name": "Guru" }`,
    },
    whatIf: {
      q: "What happens if you POST JSON without a Content-Type: application/json header?",
      a: "The server may not know to parse the body as JSON — many frameworks only run the JSON body parser when Content-Type is application/json, so req.body ends up empty or a raw string. Always set the header; a mismatched or missing Content-Type is a very common 'why is my body undefined?' bug.",
    },
    realWorld:
      "This is the backbone of virtually every web/mobile app: the client GETs JSON to render, POSTs JSON forms, and the server returns JSON. The Content-Type/Accept headers are what make the exchange unambiguous.",
    interviewerExpectation: ["JSON request & response bodies", "Content-Type: application/json", "Accept header", "server parses & returns JSON", "status code + body"],
    followUps: [
      "What's the difference between request and response JSON?",
      "Which status codes pair with JSON error bodies?",
      "How does content negotiation work?",
    ],
    commonMistakes: [
      "Omitting Content-Type: application/json",
      "Ignoring the Accept header",
      "Returning 200 for an error with an error body",
    ],
    bestPractices: [
      "Always set Content-Type and Accept",
      "Return correct status codes with JSON bodies",
      "Keep request/response shapes documented",
    ],
    relatedTech: ["REST", "HTTP headers", "content negotiation", "OpenAPI"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Infosys", "TCS", "Accenture", "Amazon"],
    related: ["json-request-vs-response", "json-http-status-codes", "rest-waiter"],
  },
  {
    slug: "json-request-vs-response",
    categoryId: "json",
    topic: "REST APIs",
    question: "What is the difference between request JSON and response JSON?",
    seoTitle: "Request vs Response JSON Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Request JSON vs response JSON for interviews: what the client sends vs what the server returns, why their shapes differ (no server-generated fields in requests), and DTO design with examples.",
    heading: "Request JSON vs Response JSON — Interview Questions",
    tags: ["json", "request", "response", "dto", "api design"],
    shortAnswer:
      "Request JSON is the payload the client sends (the input the user controls); response JSON is what the server returns (the result). Their shapes usually differ: a request shouldn't include server-generated fields (id, createdAt, computed totals), and a response often adds them plus metadata. Modeling them as separate DTOs keeps inputs safe and outputs rich.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Request JSON", v: "client → server (input)" },
          { k: "Response JSON", v: "server → client (result)" },
          { k: "Request omits", v: "id, createdAt, computed fields" },
          { k: "Response adds", v: "ids, timestamps, links, metadata" },
        ],
      },
    ],
    handsOn: {
      lang: "json",
      code: `// Request (create a user) — no id/createdAt
{ "name": "Guru", "email": "guru@example.com" }

// Response — server-generated fields added
{ "id": 101, "name": "Guru", "email": "guru@example.com",
  "createdAt": "2026-08-01T09:00:00Z" }`,
    },
    whatIf: {
      q: "Why shouldn't the client be allowed to send fields like id, role, or isAdmin in the request?",
      a: "Because inputs are attacker-controllable. If the server blindly binds request JSON onto its entity ('mass assignment'), a user could set isAdmin=true or overwrite someone else's id. Use a request DTO with an explicit allow-list of fields, and let the server own generated/privileged fields.",
    },
    realWorld:
      "Separate request/response DTOs are standard in Spring, NestJS, etc. — the request DTO validates and allow-lists user input; the response DTO shapes output (hiding internals like password hashes). Conflating them causes mass-assignment vulnerabilities.",
    interviewerExpectation: ["request = input, response = result", "different shapes", "requests omit server-generated fields", "mass-assignment risk", "separate DTOs"],
    followUps: [
      "What is a mass-assignment vulnerability?",
      "Why hide fields like password hashes in responses?",
      "How do request/response schemas appear in OpenAPI?",
    ],
    commonMistakes: [
      "Binding request JSON directly onto entities",
      "Letting clients set privileged fields",
      "Leaking internal fields in responses",
    ],
    bestPractices: [
      "Use separate, allow-listed request DTOs",
      "Shape responses to hide internals",
      "Validate every request payload",
    ],
    relatedTech: ["DTO", "OpenAPI", "mass assignment", "input validation"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Infosys"],
    related: ["json-in-rest-apis", "json-security-best-practices", "json-validation"],
  },
  {
    slug: "json-http-status-codes",
    categoryId: "json",
    topic: "REST APIs",
    question: "How do HTTP status codes work together with JSON responses?",
    seoTitle: "HTTP Status Codes with JSON Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "HTTP status codes with JSON for interviews: pairing 2xx/4xx/5xx with JSON success and error bodies, consistent error shapes, and why you must not return 200 for errors. Examples included.",
    heading: "HTTP Status Codes with JSON — Interview Questions",
    tags: ["json", "http status codes", "error handling", "rest", "api design"],
    shortAnswer:
      "The status code carries the outcome (2xx success, 4xx client error, 5xx server error) and the JSON body carries the detail. Success bodies hold the resource; error bodies hold a consistent error shape (code, message, maybe field errors). Anti-pattern: returning 200 with {\"error\":...} — clients then can't rely on the status code.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "2xx + JSON", v: "resource / result body" },
          { k: "400/422 + JSON", v: "validation error details" },
          { k: "401/403 + JSON", v: "auth error message" },
          { k: "5xx + JSON", v: "generic error (no internals)" },
        ],
      },
      { type: "text", content: "Keep one **consistent error envelope** across the whole API so clients parse errors the same way everywhere." },
    ],
    handsOn: {
      lang: "http",
      code: `HTTP/1.1 422 Unprocessable Entity
Content-Type: application/json

{
  "error": "validation_failed",
  "message": "Email is invalid",
  "fields": { "email": "must be a valid email" }
}`,
    },
    whatIf: {
      q: "Why is returning HTTP 200 with an error body considered a bad practice?",
      a: "It breaks the contract clients, proxies, caches, and monitoring rely on. Tooling treats 2xx as success, so a 200 'error' won't trigger retries, alerts, or error handling — the failure hides. Use the correct 4xx/5xx status AND a JSON error body: the code for machines, the body for humans/details.",
    },
    realWorld:
      "Mature APIs define one error envelope (code, message, requestId) and always pair it with the right status. Front-ends branch on res.ok/status; observability tools alert on 5xx rates — all of which relies on honest status codes.",
    interviewerExpectation: ["status = outcome, body = detail", "2xx/4xx/5xx families", "consistent error envelope", "don't return 200 for errors", "hide internals in 5xx"],
    followUps: [
      "What's the difference between 400 and 422?",
      "How do you design a consistent error schema?",
      "Which errors should be retried by clients?",
    ],
    commonMistakes: [
      "Returning 200 for failures",
      "Inconsistent error shapes across endpoints",
      "Leaking stack traces in 5xx bodies",
    ],
    bestPractices: [
      "Match status code to the real outcome",
      "Standardize one error envelope",
      "Return generic 5xx bodies (no internals)",
    ],
    relatedTech: ["HTTP", "REST", "error handling", "observability"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Accenture"],
    related: ["rest-status-codes", "json-in-rest-apis", "json-handling-invalid"],
  },
  {
    slug: "json-validation",
    categoryId: "json",
    topic: "Validation",
    question: "How do you validate incoming JSON?",
    seoTitle: "JSON Validation Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "JSON validation for interviews: syntactic vs semantic validation, required fields and types, JSON Schema, validation libraries (Zod, Ajv, Bean Validation), and returning clear 400/422 errors.",
    heading: "JSON Validation — Interview Questions",
    tags: ["json", "validation", "json schema", "zod", "input validation"],
    shortAnswer:
      "Validation has two layers: syntactic (is it valid JSON at all — the parser checks this) and semantic (does it have the required fields, types, and constraints your API expects). You enforce the second with schema/validators (JSON Schema + Ajv, Zod, class-validator, Bean Validation) and reject bad input with a 400/422 listing the failures.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Syntactic", v: "valid JSON? (parser)" },
          { k: "Semantic", v: "right fields/types/ranges?" },
          { k: "Tools", v: "JSON Schema/Ajv, Zod, Bean Validation" },
          { k: "On fail", v: "400/422 + field errors" },
        ],
      },
    ],
    handsOn: {
      lang: "javascript",
      code: `import { z } from "zod";

const User = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

const result = User.safeParse(JSON.parse(body));
if (!result.success) return res.status(422).json(result.error.issues);`,
    },
    whatIf: {
      q: "Isn't a successful JSON.parse enough to trust the data?",
      a: "No. Parsing only proves the syntax is valid JSON — it says nothing about whether required fields exist, types are correct, or values are in range. Trusting parsed-but-unvalidated input leads to crashes and security holes (injection, mass assignment). Always validate the shape/semantics before using the data.",
    },
    realWorld:
      "Every serious backend validates request bodies against a schema before touching business logic — Zod/Joi in Node, class-validator in NestJS, Bean Validation in Spring. It's both a correctness and a security control at the trust boundary.",
    interviewerExpectation: ["syntactic vs semantic", "required fields/types/constraints", "schema validators", "parse ≠ valid", "reject with 400/422"],
    followUps: [
      "What is JSON Schema and how does it help?",
      "Why isn't parsing the same as validating?",
      "How do you return useful validation errors?",
    ],
    commonMistakes: [
      "Treating a successful parse as trusted data",
      "Validating in business logic instead of at the boundary",
      "Vague error responses that don't say what failed",
    ],
    bestPractices: [
      "Validate at the edge, before business logic",
      "Use a schema/validator, not ad-hoc ifs",
      "Return specific field-level errors",
    ],
    relatedTech: ["JSON Schema", "Zod/Joi/Ajv", "Bean Validation", "OpenAPI"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Cognizant"],
    related: ["json-schema", "json-handling-invalid", "json-request-vs-response"],
  },
  {
    slug: "json-schema",
    categoryId: "json",
    topic: "Schema",
    question: "What is JSON Schema and why is it useful?",
    seoTitle: "JSON Schema Interview Questions & Answers (2026) | Full Stack Interview Guru",
    seoDescription:
      "JSON Schema explained for interviews: a JSON document that describes the structure, types, and constraints of JSON data. Validation, documentation, code generation, and examples.",
    heading: "JSON Schema — Interview Questions",
    tags: ["json", "json schema", "validation", "contract", "openapi"],
    shortAnswer:
      "JSON Schema is a standard, itself written in JSON, that describes the expected structure of JSON data — types, required properties, formats, ranges, enums, and nested shapes. It's used to validate payloads, document and enforce API contracts, generate code/forms, and catch bad data automatically instead of with hand-written checks.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "What", v: "JSON that describes JSON" },
          { k: "Declares", v: "type, required, format, min/max, enum" },
          { k: "Uses", v: "validation, docs, contracts, codegen" },
          { k: "Powers", v: "OpenAPI request/response schemas" },
        ],
      },
    ],
    handsOn: {
      lang: "json",
      code: `{
  "type": "object",
  "required": ["name", "email"],
  "properties": {
    "name":  { "type": "string", "minLength": 1 },
    "email": { "type": "string", "format": "email" },
    "age":   { "type": "integer", "minimum": 0 }
  },
  "additionalProperties": false
}`,
    },
    whatIf: {
      q: "What does \"additionalProperties\": false do, and why does it matter?",
      a: "It rejects any property not listed in the schema. That's useful for security and strictness — it blocks unexpected/extra fields (helping prevent mass assignment and typos), so the payload must match the contract exactly. Leaving it true (the default) lets clients send arbitrary extra keys, which the validator will silently allow.",
    },
    realWorld:
      "JSON Schema underpins OpenAPI/Swagger: request and response bodies are described with it, driving validation, interactive docs, mocking, and client SDK generation from one source of truth.",
    interviewerExpectation: ["JSON describing JSON", "type/required/format/constraints", "validation & contracts", "additionalProperties", "backs OpenAPI"],
    followUps: [
      "How does JSON Schema relate to OpenAPI?",
      "What does additionalProperties control?",
      "How do you validate against a schema at runtime?",
    ],
    commonMistakes: [
      "Confusing JSON Schema with a JSON sample",
      "Leaving additionalProperties open when strictness is needed",
      "Duplicating schema logic in code instead of reusing it",
    ],
    bestPractices: [
      "Keep one schema as the source of truth",
      "Use additionalProperties:false for strict inputs",
      "Generate docs/clients from the schema",
    ],
    relatedTech: ["OpenAPI/Swagger", "Ajv", "codegen", "contracts"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Accenture"],
    related: ["json-validation", "json-vs-xml-differences", "json-request-vs-response"],
  },

  // ================================================ Section 5 — Advanced Topics
  {
    slug: "json-large-performance",
    categoryId: "json",
    topic: "Performance",
    question: "How do you handle large JSON payloads efficiently?",
    seoTitle: "Large JSON Performance Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Large JSON performance for interviews: streaming vs loading in memory, pagination, compression, NDJSON, streaming parsers (SAX-style), and avoiding out-of-memory errors. Practical patterns.",
    heading: "Large JSON Performance — Interview Questions",
    tags: ["json", "performance", "streaming", "memory", "pagination"],
    shortAnswer:
      "Don't load huge JSON fully into memory. Paginate or filter so responses stay small; stream large data with a streaming/SAX-style parser or line-delimited JSON (NDJSON) so you process one record at a time; compress with gzip/brotli; and for very high volume consider a binary format. The goal is bounded memory and avoiding a single giant parse.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Paginate", v: "return pages, not everything" },
          { k: "Stream", v: "streaming parser / NDJSON per record" },
          { k: "Compress", v: "gzip / brotli on the wire" },
          { k: "Binary", v: "protobuf/Avro for extreme volume" },
        ],
      },
      { type: "text", content: "A single `JSON.parse` on a multi-GB string blocks the event loop and can OOM — streaming keeps memory flat regardless of size." },
    ],
    handsOn: {
      lang: "text",
      code: `# NDJSON (newline-delimited JSON): one object per line — stream it
{"id":1,"name":"a"}
{"id":2,"name":"b"}
{"id":3,"name":"c"}

# Process line by line instead of parsing one giant array,
# so memory stays O(1) per record, not O(n) for the whole file.`,
    },
    whatIf: {
      q: "Why is `JSON.parse(hugeString)` a problem, and what do you use instead?",
      a: "It's synchronous and all-or-nothing: it must build the entire object graph in memory before returning, which spikes memory (risking OOM) and blocks the thread/event loop. Use a streaming parser (e.g. a SAX-style/JSONStream reader) or NDJSON so you handle records incrementally with bounded memory and no long pause.",
    },
    realWorld:
      "Data exports, log shipping, and analytics pipelines use NDJSON + streaming precisely so a 10GB dataset never has to fit in RAM. APIs paginate list endpoints for the same reason — bounded payloads, predictable latency.",
    interviewerExpectation: ["avoid full in-memory parse", "paginate/filter", "streaming parser / NDJSON", "gzip/brotli", "binary format at extreme scale"],
    followUps: [
      "What is NDJSON and when do you use it?",
      "How does a streaming (SAX-style) parser differ from JSON.parse?",
      "When is a binary format worth the complexity?",
    ],
    commonMistakes: [
      "Parsing a huge payload in one synchronous call",
      "Returning unbounded lists without pagination",
      "Forgetting to compress large responses",
    ],
    bestPractices: [
      "Paginate and filter server-side",
      "Stream large data (NDJSON / streaming parser)",
      "Enable gzip/brotli; consider binary at scale",
    ],
    relatedTech: ["NDJSON", "streaming parsers", "gzip/brotli", "Protocol Buffers"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["json-flattening", "json-pretty-printing", "json-vs-bson"],
  },
  {
    slug: "json-security-best-practices",
    categoryId: "json",
    topic: "Security",
    question: "What are JSON security best practices?",
    seoTitle: "JSON Security Best Practices Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "JSON security best practices for interviews: never eval, validate and size-limit input, prevent mass assignment, guard against injection and deep-nesting DoS, and avoid leaking sensitive fields.",
    heading: "JSON Security Best Practices — Interview Questions",
    tags: ["json", "security", "validation", "injection", "mass assignment"],
    shortAnswer:
      "Treat all inbound JSON as untrusted: never eval() it (use JSON.parse), validate against a schema, cap body size and nesting depth (to stop DoS), allow-list fields to prevent mass assignment, and never echo it into SQL/HTML/OS commands without escaping. On output, don't leak sensitive fields (password hashes, tokens, internal ids).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Parse safely", v: "JSON.parse, never eval()" },
          { k: "Validate + limit", v: "schema, max size & depth" },
          { k: "Allow-list", v: "block mass assignment (isAdmin)" },
          { k: "Output", v: "don't leak secrets; escape when reusing" },
        ],
      },
    ],
    handsOn: {
      lang: "javascript",
      code: `// Express: cap body size to blunt DoS via giant payloads
app.use(express.json({ limit: "100kb" }));

// Allow-list fields — never spread req.body onto the entity
const { name, email } = req.body;   // ignore id, role, isAdmin
await users.create({ name, email });`,
    },
    whatIf: {
      q: "How can a maliciously crafted JSON payload cause a denial of service?",
      a: "Several ways: an enormous body exhausts memory/bandwidth; extremely deep nesting can blow the parser's stack; and huge arrays/strings spike CPU during parse. Defenses: enforce a max request size, limit nesting depth, set parse timeouts, and reject oversized/over-deep payloads with a 413/400 before processing.",
    },
    realWorld:
      "Mass assignment (binding req.body straight onto a model so a user sets isAdmin=true) and 'parse an HTML page as JSON via eval' are real, repeatedly-exploited bugs. Size/depth limits and schema validation are standard hardening at the API edge.",
    interviewerExpectation: ["never eval", "validate + size/depth limits", "prevent mass assignment", "escape when reusing (SQLi/XSS)", "don't leak sensitive fields"],
    followUps: [
      "What is a mass-assignment vulnerability?",
      "How does deep nesting enable a DoS?",
      "Why must you escape JSON before putting it in HTML/SQL?",
    ],
    commonMistakes: [
      "Using eval() to parse JSON",
      "Spreading req.body directly onto entities",
      "No size/depth limits on request bodies",
    ],
    bestPractices: [
      "Validate, size-limit, and depth-limit input",
      "Allow-list fields; own privileged fields server-side",
      "Escape on reuse; never leak secrets in responses",
    ],
    relatedTech: ["OWASP", "mass assignment", "input validation", "rate limiting"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "Deloitte"],
    related: ["json-handling-invalid", "json-request-vs-response", "json-validation"],
  },
  {
    slug: "json-vs-bson",
    categoryId: "json",
    topic: "Advanced",
    question: "What is the difference between JSON and BSON?",
    seoTitle: "JSON vs BSON Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "JSON vs BSON for interviews: text vs binary encoding, extra BSON types (ObjectId, Date, binary), size and traversal trade-offs, and why MongoDB uses BSON. Clear comparison with examples.",
    heading: "JSON vs BSON — Interview Questions",
    tags: ["json", "bson", "mongodb", "binary", "serialization"],
    shortAnswer:
      "JSON is a text format; BSON (Binary JSON) is a binary encoding used by MongoDB. BSON adds types JSON lacks (ObjectId, native Date, binary data, Decimal128) and stores length prefixes so fields can be traversed/skipped fast. BSON is often larger than the equivalent JSON text but is quicker to parse and richer in types — you write JSON, MongoDB stores BSON.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "JSON", v: "text, human-readable, 6 types" },
          { k: "BSON", v: "binary, extra types, length-prefixed" },
          { k: "Extra types", v: "ObjectId, Date, binary, Decimal128" },
          { k: "Trade-off", v: "BSON: fast traverse, sometimes bigger" },
        ],
      },
    ],
    handsOn: {
      lang: "javascript",
      code: `// You write JSON-like documents...
db.users.insertOne({
  name: "Guru",
  createdAt: new Date(),          // stored as BSON Date
});
// ...MongoDB stores them as BSON: _id becomes an ObjectId,
// the date is a native BSON Date (not an ISO string).`,
    },
    whatIf: {
      q: "If BSON can be larger than JSON, why does MongoDB use it?",
      a: "Speed and richer types. BSON's length prefixes let the engine skip over fields without scanning byte-by-byte (fast indexing/traversal), and native types like Date, ObjectId, and Decimal128 avoid the lossy 'everything is a string/float' problem of JSON. The modest size overhead buys performance and type fidelity at the database layer.",
    },
    realWorld:
      "MongoDB is the everyday example: the driver accepts JSON-like objects and stores BSON, which is why _id is an ObjectId and dates come back as real Date types rather than strings — a common surprise for developers new to Mongo.",
    interviewerExpectation: ["JSON text vs BSON binary", "BSON extra types (ObjectId/Date/binary/Decimal128)", "length-prefixed → fast traverse", "BSON can be larger", "MongoDB storage format"],
    followUps: [
      "Which types does BSON add over JSON?",
      "Why can BSON be larger yet faster?",
      "How does this compare to protobuf/Avro?",
    ],
    commonMistakes: [
      "Assuming BSON is always smaller than JSON",
      "Thinking JSON has a native date/ObjectId type",
      "Confusing the wire format with the storage format",
    ],
    bestPractices: [
      "Use JSON for interchange, let the DB use BSON",
      "Rely on native BSON types instead of stringly-typed data",
      "Consider protobuf/Avro for compact service-to-service traffic",
    ],
    relatedTech: ["MongoDB", "ObjectId", "Protocol Buffers", "Avro"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Cognizant"],
    related: ["json-why-widely-used", "json-large-performance", "json-data-types"],
  },
  {
    slug: "json-jwt-structure",
    categoryId: "json",
    topic: "Advanced",
    question: "How does JSON structure a JWT (JSON Web Token)?",
    seoTitle: "JWT JSON Structure Interview Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "JWT JSON structure for interviews: header.payload.signature, Base64URL-encoded JSON header and claims, standard claims (iss, exp, sub), and why JWTs are signed not encrypted. Examples included.",
    heading: "JWT JSON Structure — Interview Questions",
    tags: ["json", "jwt", "token", "claims", "authentication"],
    shortAnswer:
      "A JWT is three Base64URL-encoded parts joined by dots: header.payload.signature. The header and payload are JSON objects — the header names the algorithm/type, the payload holds claims (sub, iss, exp, roles). The signature verifies integrity. It's signed, not encrypted, so anyone can decode the JSON; never put secrets in the payload.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Header (JSON)", v: "{ alg, typ } — algorithm & type" },
          { k: "Payload (JSON)", v: "claims: sub, iss, exp, roles" },
          { k: "Signature", v: "verifies integrity (not secrecy)" },
          { k: "Format", v: "base64url(header).base64url(payload).sig" },
        ],
      },
    ],
    handsOn: {
      lang: "json",
      code: `// Header (before Base64URL encoding)
{ "alg": "HS256", "typ": "JWT" }

// Payload / claims
{ "sub": "101", "role": "admin", "exp": 1735689600 }

// Token = base64url(header) . base64url(payload) . signature`,
    },
    whatIf: {
      q: "Since the JWT payload is only Base64-encoded JSON, can anyone read it?",
      a: "Yes — Base64URL is encoding, not encryption, so anyone can decode and read the header and payload JSON. The signature only guarantees the token wasn't tampered with, not confidentiality. Never store sensitive data (passwords, PII, secrets) in the payload; if you need secrecy, use an encrypted token (JWE) or keep secrets server-side.",
    },
    realWorld:
      "Paste any JWT into jwt.io and you'll see the header/payload JSON decoded instantly — a live reminder that claims are readable. That's why access tokens carry only non-sensitive claims (user id, roles, expiry) and short lifetimes.",
    interviewerExpectation: ["header.payload.signature", "header & payload are JSON", "Base64URL, not encrypted", "standard claims (sub/iss/exp)", "no secrets in payload"],
    followUps: [
      "Why is a JWT signed but not encrypted?",
      "What are registered claims like exp, iss, aud?",
      "How does the server verify the signature?",
    ],
    commonMistakes: [
      "Thinking the payload is encrypted/private",
      "Storing secrets or PII in claims",
      "Ignoring exp / not expiring tokens",
    ],
    bestPractices: [
      "Keep only non-sensitive claims in the payload",
      "Always set and check exp",
      "Use JWE if the payload must be confidential",
    ],
    relatedTech: ["JWT", "Base64URL", "OAuth2", "JWE"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Accenture"],
    related: ["what-is-jwt", "json-data-types", "json-security-best-practices"],
  },
  {
    slug: "json-interview-scenarios",
    categoryId: "json",
    topic: "Advanced",
    question: "What are common JSON interview scenarios and how do you approach them?",
    seoTitle: "Common JSON Interview Scenarios: Questions & Answers | Full Stack Interview Guru",
    seoDescription:
      "Common JSON interview scenarios and coding tasks: parse-and-transform, merge objects, deep-compare, safe access, flatten, and handle bad input. Practical patterns and example code.",
    heading: "Common JSON Interview Scenarios — Questions",
    tags: ["json", "interview scenarios", "coding", "transform", "merge"],
    shortAnswer:
      "Beyond definitions, interviewers give practical tasks: parse a JSON string then transform/filter it, safely read a deeply nested value, merge or deep-compare two objects, flatten nested JSON, or robustly handle malformed input. The winning approach is always the same: parse defensively, validate the shape, then transform with clear, null-safe code.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Parse & transform", v: "parse → map/filter → reshape" },
          { k: "Safe access", v: "optional chaining + defaults" },
          { k: "Merge / compare", v: "deep merge, deep-equal two objects" },
          { k: "Robustness", v: "try/catch, validate, handle bad input" },
        ],
      },
    ],
    handsOn: {
      lang: "javascript",
      code: `// "Parse this response and return active users' emails"
const users = JSON.parse(body);          // 1) parse (guard in real code)
const emails = users
  .filter(u => u?.status === "active")   // 2) filter safely
  .map(u => u.email);                    // 3) transform
console.log(emails);`,
    },
    whatIf: {
      q: "You're asked to merge two JSON objects — what's the catch with the spread operator or Object.assign?",
      a: "Both do a SHALLOW merge — nested objects are replaced, not combined, and shared references can be mutated. If the task needs a deep merge (recursively combining nested objects), the spread/Object.assign won't do it; you write a recursive merge (or use a vetted library) and decide how arrays and conflicting keys are handled.",
    },
    realWorld:
      "These scenarios mirror daily work: reshaping an API response for the UI, merging config layers (defaults + overrides), diffing state, and defending against malformed third-party data. Interviewers watch for defensive parsing and null-safety, not just the happy path.",
    interviewerExpectation: ["parse defensively", "validate before use", "null-safe transform", "shallow vs deep merge/compare", "handle malformed input"],
    followUps: [
      "How do you deep-merge two JSON objects?",
      "How do you deep-compare two objects for equality?",
      "How do you handle a malformed payload mid-transform?",
    ],
    commonMistakes: [
      "Assuming the happy path (no bad/missing data)",
      "Using a shallow merge where a deep merge is needed",
      "Skipping validation before transforming",
    ],
    bestPractices: [
      "Parse in try/catch and validate the shape",
      "Use optional chaining + defaults when reading",
      "Be explicit about shallow vs deep for merge/compare",
    ],
    relatedTech: ["Array.map/filter", "deep merge", "optional chaining", "lodash"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Cognizant"],
    related: ["json-accessing-nested", "json-parsing", "json-handling-invalid"],
  },
];
