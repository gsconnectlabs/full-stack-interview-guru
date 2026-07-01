import type { Question } from "../types";

/**
 * AWS — flagship expansion batch (20 questions).
 * Enterprise & product-company patterns: IAM/security, VPC networking, scaling &
 * HA, data stores (RDS/DynamoDB), serverless & messaging, cost optimization, and
 * the Well-Architected framework. (Basic S3-vs-EBS / what-is-Lambda live in the
 * base bank; these are distinct, deeper questions.)
 *
 * Difficulty mix: 4 Easy · 10 Medium · 6 Hard. Ordered easy → hard.
 */
export const awsExtra: Question[] = [
  // ---------------------------------------------------------------- Easy (4)
  {
    slug: "regions-vs-azs",
    categoryId: "aws",
    topic: "VPC",
    question: "Region vs Availability Zone — what's the difference and why does it matter for uptime?",
    tags: ["region", "availability zone", "high availability", "latency"],
    shortAnswer:
      "A Region is a geographic area (e.g. ap-south-1); an Availability Zone (AZ) is one or more isolated data centers within a Region, connected by low-latency links. Deploy across multiple AZs so a single data-center failure doesn't take your app down; use multiple Regions for DR and low global latency.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Region", v: "geographic area (many AZs)" },
          { k: "AZ", v: "isolated DC(s) in a Region" },
          { k: "Multi-AZ", v: "survive a data-center failure" },
          { k: "Multi-Region", v: "DR + global low latency" },
        ],
      },
    ],
    whatIf: {
      q: "Your app runs in one AZ and that AZ has an outage — what happens, and how do you prevent it?",
      a: "Everything in that AZ goes down. Spread instances across ≥2 AZs behind a load balancer (and use Multi-AZ for RDS) so the healthy AZ keeps serving. AZ-level redundancy is the baseline for production HA.",
    },
    realWorld:
      "Single-AZ deployments are a classic availability risk; production systems run multi-AZ by default and reserve multi-Region for disaster recovery and latency-sensitive global users.",
    interviewerExpectation: ["Region = geography, AZ = isolated DC", "multi-AZ for HA", "multi-Region for DR/latency", "AZs low-latency linked"],
    followUps: [
      "When do you go multi-Region vs multi-AZ?",
      "How does data residency affect Region choice?",
      "What is an edge location vs an AZ?",
    ],
    commonMistakes: [
      "Deploying everything in a single AZ",
      "Confusing Regions with AZs",
      "Assuming multi-AZ gives cross-Region DR",
    ],
    bestPractices: [
      "Run multi-AZ by default for production",
      "Choose Region by latency + compliance",
      "Use multi-Region for DR/global reach",
    ],
    relatedTech: ["Multi-AZ RDS", "Route 53", "edge locations"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "TCS", "Accenture"],
    related: ["aws-high-availability", "vpc-design"],
  },
  {
    slug: "iam-roles-users-policies",
    categoryId: "aws",
    topic: "IAM",
    question: "IAM users vs roles vs policies — how do you grant an app access to AWS without hardcoding keys?",
    tags: ["iam", "roles", "policies", "least privilege", "credentials"],
    shortAnswer:
      "A user is a long-lived identity with credentials (for humans). A role is an identity apps/services ASSUME to get temporary credentials — no stored keys. A policy is the JSON that grants permissions. Give EC2/Lambda an IAM role, never embed access keys.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "User", v: "long-lived identity (humans/CI)" },
          { k: "Role", v: "assumed → temporary creds (apps)" },
          { k: "Policy", v: "JSON permissions (allow/deny)" },
        ],
      },
    ],
    handsOn: {
      lang: "json",
      code: `{ "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::my-bucket/*"
  }] }`,
    },
    whatIf: {
      q: "Why is attaching an IAM role to EC2/Lambda better than storing an access key in config?",
      a: "A role delivers short-lived, auto-rotating temporary credentials via the instance/execution environment — nothing to leak or rotate manually. Hardcoded keys get committed to repos, logged, and never expire, which is a top cause of AWS breaches.",
    },
    realWorld:
      "Leaked long-lived access keys (in git) are one of the most common AWS security incidents; roles + least-privilege policies are the standard, credential-free way to grant access.",
    interviewerExpectation: ["user vs role vs policy", "roles = temporary creds", "attach role to service", "least privilege", "no hardcoded keys"],
    followUps: [
      "What is least privilege and how do you achieve it?",
      "How do temporary credentials from a role rotate?",
      "Difference between identity-based and resource-based policies?",
    ],
    commonMistakes: [
      "Hardcoding access keys in code/config",
      "Over-broad policies (Action: '*')",
      "Using the root account for daily work",
    ],
    bestPractices: [
      "Use roles for services; least-privilege policies",
      "No long-lived keys in apps",
      "Lock down and MFA the root account",
    ],
    relatedTech: ["STS", "instance profile", "IAM Access Analyzer"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "TCS", "Cognizant", "Wipro"],
    related: ["s3-security", "aws-secrets-kms"],
  },
  {
    slug: "s3-storage-classes",
    categoryId: "aws",
    topic: "S3",
    question: "What are the S3 storage classes, and how do you use them to cut storage cost?",
    tags: ["s3", "storage classes", "glacier", "lifecycle", "cost"],
    shortAnswer:
      "Standard (hot, frequent access), Standard-IA / One Zone-IA (infrequent), Glacier Instant/Flexible/Deep Archive (cold, cheapest but retrieval latency/cost), and Intelligent-Tiering (auto-moves objects by access pattern). Use lifecycle rules to transition/expire objects automatically.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Standard", v: "hot, frequent access" },
          { k: "Standard-IA", v: "infrequent, cheaper storage" },
          { k: "Glacier / Deep Archive", v: "cold/archival, cheapest" },
          { k: "Intelligent-Tiering", v: "auto-tier by access pattern" },
        ],
      },
    ],
    whatIf: {
      q: "You have logs accessed heavily for 30 days then rarely — how do you minimize cost automatically?",
      a: "Add an S3 lifecycle policy: keep objects in Standard for 30 days, transition to Standard-IA (or Glacier) after, and expire/delete after the retention period. Or use Intelligent-Tiering if access is unpredictable. It's hands-off cost optimization.",
    },
    realWorld:
      "Lifecycle policies moving old logs/backups to Glacier and expiring them is a standard, high-ROI cost lever; Intelligent-Tiering suits unpredictable access without manual rules.",
    interviewerExpectation: ["Standard vs IA vs Glacier tiers", "retrieval latency/cost trade-off", "lifecycle transitions/expiry", "Intelligent-Tiering"],
    followUps: [
      "When is One Zone-IA acceptable (durability trade-off)?",
      "Glacier retrieval tiers — instant vs bulk?",
      "How do lifecycle rules automate transitions?",
    ],
    commonMistakes: [
      "Keeping cold data in Standard (overpaying)",
      "Glacier for data needing instant access",
      "No lifecycle/expiry on ever-growing buckets",
    ],
    bestPractices: [
      "Lifecycle-transition cold data automatically",
      "Intelligent-Tiering for unpredictable access",
      "Expire data past its retention",
    ],
    relatedTech: ["S3 Lifecycle", "Glacier", "Intelligent-Tiering"],
    difficulty: "Easy",
    experience: ["0-2 years", "3-5 years"],
    askedIn: ["Amazon", "Infosys", "Deloitte"],
    related: ["s3-security", "aws-cost-optimization"],
  },
  {
    slug: "security-groups-vs-nacls",
    categoryId: "aws",
    topic: "VPC",
    question: "Security Groups vs Network ACLs — how do they differ, and when do you use each?",
    tags: ["security group", "nacl", "stateful", "stateless", "vpc security"],
    shortAnswer:
      "Security Groups are stateful, instance-level firewalls (return traffic auto-allowed, allow rules only). NACLs are stateless, subnet-level (evaluate inbound AND outbound separately, support explicit deny). SGs are your primary control; NACLs add coarse subnet-level allow/deny (e.g. block an IP range).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Security Group", v: "stateful, instance-level, allow-only" },
          { k: "NACL", v: "stateless, subnet-level, allow + deny" },
          { k: "Primary", v: "SGs for most control" },
          { k: "NACL for", v: "coarse subnet deny (block IP range)" },
        ],
      },
    ],
    whatIf: {
      q: "You open an inbound port in a NACL but traffic still fails — why?",
      a: "NACLs are stateless: you must also allow the OUTBOUND return traffic (ephemeral ports), unlike stateful Security Groups which auto-allow return traffic. Forgetting the ephemeral-port outbound rule is the classic NACL gotcha.",
    },
    realWorld:
      "Teams manage access mostly with Security Groups (referencing other SGs); NACLs are used sparingly for subnet-wide deny rules. The stateless ephemeral-port trap is a common debugging snag.",
    interviewerExpectation: ["SG stateful/instance/allow-only", "NACL stateless/subnet/allow+deny", "SG primary", "ephemeral ports for NACL return traffic"],
    followUps: [
      "Why can a Security Group reference another Security Group?",
      "What are ephemeral ports and why do NACLs need them?",
      "Default SG and NACL behavior?",
    ],
    commonMistakes: [
      "Forgetting NACL outbound/ephemeral rules",
      "Using NACLs where SGs suffice",
      "Overly-broad 0.0.0.0/0 inbound rules",
    ],
    bestPractices: [
      "Use SGs as the primary control; reference SGs",
      "NACLs for coarse subnet deny only",
      "Least-privilege ingress; avoid open 0.0.0.0/0",
    ],
    relatedTech: ["VPC", "ephemeral ports", "SG references"],
    difficulty: "Easy",
    experience: ["3-5 years"],
    askedIn: ["Amazon", "Cognizant", "Accenture", "Deloitte"],
    related: ["vpc-design", "iam-roles-users-policies"],
  },

  // -------------------------------------------------------------- Medium (10)
  {
    slug: "vpc-design",
    categoryId: "aws",
    topic: "VPC",
    question: "How do you design a VPC with public and private subnets?",
    tags: ["vpc", "subnets", "nat gateway", "internet gateway", "network design"],
    shortAnswer:
      "Split into public subnets (route to an Internet Gateway — for load balancers/bastions) and private subnets (no direct internet; outbound via a NAT Gateway — for app servers/DBs). Spread subnets across AZs. Keep databases in private subnets, reachable only from the app tier's Security Group.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Public subnet", v: "route to IGW — ALB, bastion" },
          { k: "Private subnet", v: "no inbound internet — app, DB" },
          { k: "NAT Gateway", v: "private → outbound internet only" },
          { k: "Multi-AZ", v: "subnets in each AZ" },
        ],
      },
    ],
    whatIf: {
      q: "A private-subnet service needs to call an external API but has no internet route — how?",
      a: "Route its outbound traffic through a NAT Gateway in a public subnet — it gets internet egress without being reachable from the internet. For AWS services specifically (S3/DynamoDB), a VPC endpoint keeps traffic on the AWS network and avoids NAT cost.",
    },
    realWorld:
      "The public/private subnet + NAT + multi-AZ layout is the canonical VPC design; putting databases in private subnets with SG-restricted access is baseline security.",
    interviewerExpectation: ["public vs private subnets", "IGW vs NAT Gateway", "DBs in private subnets", "multi-AZ subnets", "VPC endpoints"],
    followUps: [
      "NAT Gateway vs VPC endpoint for S3 access?",
      "Why place databases in private subnets?",
      "How do route tables enforce this?",
    ],
    commonMistakes: [
      "Databases in public subnets",
      "No NAT for private outbound",
      "Single-AZ subnets (no HA)",
    ],
    bestPractices: [
      "Private subnets for app/data tiers",
      "NAT for egress; VPC endpoints for AWS services",
      "Subnets across multiple AZs",
    ],
    relatedTech: ["NAT Gateway", "Internet Gateway", "VPC endpoints", "route tables"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["security-groups-vs-nacls", "vpc-connectivity", "aws-high-availability"],
  },
  {
    slug: "autoscaling-load-balancing",
    categoryId: "aws",
    topic: "Lambda",
    question: "How do Auto Scaling and load balancing work together for elastic, resilient apps?",
    tags: ["auto scaling", "alb", "nlb", "target group", "health checks"],
    shortAnswer:
      "An Auto Scaling Group adds/removes instances based on metrics (CPU, request count) across AZs; a load balancer (ALB for HTTP/L7, NLB for TCP/L4) spreads traffic to healthy targets and deregisters unhealthy ones via health checks. Together they give elasticity + self-healing.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "ASG", v: "scale in/out on metrics, across AZs" },
          { k: "ALB (L7)", v: "HTTP routing, path/host rules" },
          { k: "NLB (L4)", v: "TCP, ultra-low latency, static IP" },
          { k: "Health checks", v: "route only to healthy targets" },
        ],
      },
    ],
    whatIf: {
      q: "New instances launch but users still hit errors during a scale-out — why?",
      a: "Likely health-check / warm-up timing: the LB registers instances before the app is ready, or health checks are too lenient. Tune the health-check path, grace period, and connection draining so traffic only flows to fully-ready instances and drains cleanly on scale-in.",
    },
    realWorld:
      "ASG + ALB across AZs is the standard elastic web tier; misconfigured health checks / missing connection draining cause the 'errors during deploy/scale' class of incidents.",
    interviewerExpectation: ["ASG scaling policies", "ALB L7 vs NLB L4", "health checks + draining", "multi-AZ", "target groups"],
    followUps: [
      "ALB vs NLB — when each?",
      "What is connection draining / deregistration delay?",
      "Target tracking vs step scaling policies?",
    ],
    commonMistakes: [
      "Lenient/wrong health-check paths",
      "No connection draining on scale-in",
      "Scaling on the wrong metric",
    ],
    bestPractices: [
      "Meaningful health checks + warm-up grace",
      "Enable connection draining",
      "Scale on a metric that reflects load",
    ],
    relatedTech: ["Auto Scaling Group", "ALB/NLB", "target groups", "CloudWatch"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "Wipro"],
    related: ["aws-high-availability", "regions-vs-azs"],
  },
  {
    slug: "rds-vs-dynamodb",
    categoryId: "aws",
    topic: "DynamoDB",
    question: "RDS vs DynamoDB — how do you choose between them?",
    tags: ["rds", "dynamodb", "sql vs nosql", "scaling", "access patterns"],
    shortAnswer:
      "RDS (relational) for complex queries, joins, transactions, and flexible ad-hoc access — scales vertically + read replicas. DynamoDB (NoSQL key-value) for predictable access patterns needing single-digit-ms latency at massive scale — but you must model around known queries (no ad-hoc joins). Choose by query flexibility vs scale.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "RDS", v: "joins, transactions, ad-hoc queries" },
          { k: "DynamoDB", v: "known access patterns, huge scale, ms latency" },
          { k: "Scale", v: "RDS vertical+replicas; DDB horizontal" },
          { k: "Trap", v: "DDB with unknown/ad-hoc queries" },
        ],
      },
    ],
    whatIf: {
      q: "When does DynamoDB become painful?",
      a: "When your access patterns change or need ad-hoc queries/joins — DynamoDB requires you to design tables (and GSIs) around specific queries up front. New query needs may force a new index or a full redesign. If flexibility matters more than extreme scale, RDS is the safer choice.",
    },
    realWorld:
      "Teams pick RDS for rich transactional/reporting workloads and DynamoDB for high-scale, well-understood access (sessions, carts, event stores); the mistake is choosing DynamoDB for evolving, query-flexible domains.",
    interviewerExpectation: ["relational vs key-value", "joins/transactions vs scale/latency", "known access patterns for DDB", "scaling models", "GSIs"],
    followUps: [
      "What is a Global Secondary Index?",
      "How does DynamoDB scale vs RDS?",
      "When would you use both together?",
    ],
    commonMistakes: [
      "DynamoDB for ad-hoc/unknown queries",
      "RDS for extreme write scale without sharding",
      "Ignoring access-pattern modeling for DDB",
    ],
    bestPractices: [
      "RDS for query flexibility/transactions",
      "DynamoDB for scale + known patterns",
      "Model DynamoDB around queries first",
    ],
    relatedTech: ["Aurora", "DynamoDB GSI", "read replicas"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["dynamodb-partition-key", "dynamodb-single-table", "rds-multiaz-read-replicas"],
  },
  {
    slug: "dynamodb-partition-key",
    categoryId: "aws",
    topic: "DynamoDB",
    question: "How does the DynamoDB partition key affect performance, and what is a hot partition?",
    tags: ["dynamodb", "partition key", "hot partition", "throughput", "scaling"],
    shortAnswer:
      "DynamoDB distributes data across partitions by the partition key's hash. If many requests target one key (or a low-cardinality key), that partition gets 'hot' — throttling even when total capacity is fine. Choose a high-cardinality, evenly-accessed key; add a suffix/sharding for hot keys.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Partition key", v: "hashed → decides the partition" },
          { k: "Hot partition", v: "skewed access → throttling" },
          { k: "Fix", v: "high-cardinality key / write sharding" },
        ],
      },
    ],
    whatIf: {
      q: "A table partitioned by 'status' (only 3 values) throttles under load — why and fix?",
      a: "Only 3 partition-key values means traffic concentrates on 3 partitions → hot partitions and throttling regardless of provisioned capacity. Use a high-cardinality key (e.g. entity id) and put status in a GSI/sort key, or shard the hot key with a suffix.",
    },
    realWorld:
      "Hot-partition throttling from low-cardinality or skewed keys is the #1 DynamoDB performance pitfall; key design (and write sharding for hotspots) is the fix, not raising capacity.",
    interviewerExpectation: ["hash-based distribution", "hot partition from skew/low cardinality", "high-cardinality key", "write sharding", "adaptive capacity limits"],
    followUps: [
      "How does adaptive capacity help (and not)?",
      "How do you shard a hot write key?",
      "Partition key vs sort key roles?",
    ],
    commonMistakes: [
      "Low-cardinality partition keys",
      "Time-based keys causing hot 'current' partition",
      "Raising capacity to fix skew (doesn't)",
    ],
    bestPractices: [
      "Choose high-cardinality, evenly-accessed keys",
      "Shard hot keys with a suffix",
      "Design keys around access patterns",
    ],
    relatedTech: ["DynamoDB", "GSI", "write sharding", "adaptive capacity"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["dynamodb-single-table", "rds-vs-dynamodb"],
  },
  {
    slug: "sqs-sns-eventbridge",
    categoryId: "aws",
    topic: "Lambda",
    question: "SQS vs SNS vs EventBridge — which messaging service for which job?",
    tags: ["sqs", "sns", "eventbridge", "messaging", "pub-sub", "decoupling"],
    shortAnswer:
      "SQS = a queue (one consumer group pulls, decouples + buffers work). SNS = pub/sub fan-out (push one message to many subscribers). EventBridge = event bus with content-based routing rules, schema registry, and SaaS/AWS event integrations. Pattern: SNS/EventBridge fan-out → SQS per consumer.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "SQS", v: "queue, pull, decouple + buffer" },
          { k: "SNS", v: "pub/sub fan-out, push to many" },
          { k: "EventBridge", v: "event bus + routing rules + schemas" },
          { k: "Combo", v: "SNS/EB fan-out → SQS per consumer" },
        ],
      },
    ],
    whatIf: {
      q: "Why is the 'SNS → SQS' fan-out pattern so common?",
      a: "SNS pushes each event to multiple subscribers, but push delivery can drop if a consumer is down. Subscribing an SQS queue per consumer buffers events durably so each consumer processes at its own pace with retries/DLQ — combining fan-out with reliable, decoupled consumption.",
    },
    realWorld:
      "SNS→SQS fan-out and EventBridge routing are the backbone of event-driven AWS; picking SQS vs SNS vs EventBridge by fan-out/routing/buffering needs is a routine design decision.",
    interviewerExpectation: ["SQS queue/pull", "SNS pub-sub push", "EventBridge routing/schema", "SNS→SQS fan-out", "buffering + DLQ"],
    followUps: [
      "SQS standard vs FIFO?",
      "When EventBridge over SNS?",
      "How does a DLQ fit in?",
    ],
    commonMistakes: [
      "SNS-only fan-out without SQS buffering",
      "Using SQS where you need fan-out",
      "Ignoring FIFO/ordering needs",
    ],
    bestPractices: [
      "SNS/EventBridge fan-out → SQS per consumer",
      "Add DLQs for poison messages",
      "EventBridge for content-based routing",
    ],
    relatedTech: ["SQS FIFO", "SNS", "EventBridge", "DLQ"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["serverless-event-driven-dlq", "lambda-concurrency"],
  },
  {
    slug: "lambda-concurrency",
    categoryId: "aws",
    topic: "Lambda",
    question: "How does Lambda concurrency work, and how do you handle throttling and downstream limits?",
    tags: ["lambda", "concurrency", "throttling", "reserved concurrency", "provisioned"],
    shortAnswer:
      "Each concurrent invocation uses one execution environment. Account concurrency is capped; exceeding it throttles (429). Use reserved concurrency to guarantee/limit a function's share (and protect a fragile downstream DB), and provisioned concurrency to pre-warm environments and avoid cold-start latency for spiky/latency-sensitive functions.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Concurrency", v: "1 env per concurrent invocation" },
          { k: "Reserved", v: "guarantee/cap a function's share" },
          { k: "Provisioned", v: "pre-warmed → no cold start" },
          { k: "Exceed", v: "throttle (429) → retry/DLQ" },
        ],
      },
    ],
    whatIf: {
      q: "A Lambda scales to 1000 concurrent and overwhelms an RDS with limited connections — fix?",
      a: "Lambda can scale faster than a database can handle connections. Cap the function with reserved concurrency (e.g. 50) to bound simultaneous DB connections, and/or use RDS Proxy to pool/multiplex connections. Unbounded Lambda concurrency crushing a downstream is a classic serverless anti-pattern.",
    },
    realWorld:
      "Reserved concurrency to protect databases and provisioned concurrency for latency-sensitive endpoints are standard Lambda tuning; the 'Lambda stampede overwhelms RDS' incident is common without RDS Proxy or concurrency caps.",
    interviewerExpectation: ["1 env per concurrent invoke", "reserved vs provisioned", "throttling 429", "protect downstream (RDS Proxy)", "cold start mitigation"],
    followUps: [
      "Reserved vs provisioned concurrency — difference?",
      "How does RDS Proxy help serverless?",
      "How do you reduce cold starts?",
    ],
    commonMistakes: [
      "Unbounded Lambda concurrency crushing a DB",
      "No provisioned concurrency for latency-sensitive functions",
      "Ignoring the account concurrency cap",
    ],
    bestPractices: [
      "Reserved concurrency to protect downstreams",
      "Provisioned concurrency for latency SLAs",
      "RDS Proxy for DB connection pooling",
    ],
    relatedTech: ["reserved/provisioned concurrency", "RDS Proxy", "CloudWatch"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google"],
    related: ["serverless-event-driven-dlq", "sqs-sns-eventbridge"],
  },
  {
    slug: "s3-security",
    categoryId: "aws",
    topic: "S3",
    question: "How do you secure an S3 bucket and prevent accidental public exposure?",
    tags: ["s3", "bucket policy", "block public access", "encryption", "security"],
    shortAnswer:
      "Enable S3 Block Public Access (account + bucket), grant access via IAM roles/bucket policies with least privilege, enforce encryption at rest (SSE-S3/SSE-KMS) and TLS in transit, turn on versioning + access logging, and use VPC endpoints/presigned URLs instead of making objects public.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Block Public Access", v: "on at account + bucket level" },
          { k: "Access", v: "IAM/bucket policy, least privilege" },
          { k: "Encrypt", v: "SSE-S3/KMS at rest, TLS in transit" },
          { k: "Share safely", v: "presigned URLs, not public objects" },
        ],
      },
    ],
    whatIf: {
      q: "You need to let a user download one private object temporarily — public bucket?",
      a: "No — never make the bucket/object public for that. Generate a presigned URL: a time-limited, signed link that grants temporary access to that specific object without changing bucket permissions. It expires automatically, keeping the bucket private.",
    },
    realWorld:
      "Public-bucket data leaks are among the most publicized cloud breaches; Block Public Access + presigned URLs + default encryption is the standard secure baseline.",
    interviewerExpectation: ["Block Public Access", "least-privilege policies", "encryption at rest/in transit", "presigned URLs", "versioning + logging"],
    followUps: [
      "SSE-S3 vs SSE-KMS?",
      "How do presigned URLs work?",
      "How does Block Public Access override policies?",
    ],
    commonMistakes: [
      "Public buckets for sharing",
      "No default encryption",
      "Over-permissive bucket policies",
    ],
    bestPractices: [
      "Block Public Access on by default",
      "Presigned URLs for temporary access",
      "Enforce encryption + enable logging/versioning",
    ],
    relatedTech: ["Block Public Access", "SSE-KMS", "presigned URLs", "CloudTrail"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "banking"],
    related: ["iam-roles-users-policies", "aws-secrets-kms"],
  },
  {
    slug: "cloudfront-cdn",
    categoryId: "aws",
    topic: "S3",
    question: "How does CloudFront (CDN) improve performance, and what do you cache vs not?",
    tags: ["cloudfront", "cdn", "caching", "edge", "ttl"],
    shortAnswer:
      "CloudFront caches content at edge locations near users, cutting latency and offloading origin traffic. Cache static assets aggressively (long TTL + cache-busting filenames); use short/no cache for dynamic/personalized responses. Control behavior with cache policies (TTLs, which headers/cookies/query strings form the cache key).",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Edge cache", v: "content near users → low latency" },
          { k: "Static", v: "long TTL + versioned filenames" },
          { k: "Dynamic", v: "short/no cache, forward needed headers" },
          { k: "Cache key", v: "headers/cookies/query params" },
        ],
      },
    ],
    whatIf: {
      q: "Users see stale content after a deploy — how do you avoid it without manual invalidations?",
      a: "Use content-hashed filenames (app.a1b2c3.js) so each deploy produces new URLs the CDN treats as new objects — old cached files just age out. This 'cache-busting' avoids costly/global invalidations and eliminates stale-asset bugs.",
    },
    realWorld:
      "CDN in front of S3/ALB with hashed asset filenames is standard for web performance; relying on manual invalidations instead of cache-busting is a common source of stale-content incidents.",
    interviewerExpectation: ["edge caching/latency", "static long-TTL + cache busting", "dynamic short/no cache", "cache key config", "invalidation vs versioning"],
    followUps: [
      "How does the cache key affect hit rate?",
      "When do you invalidate vs version?",
      "Origin Access Control for private S3 origins?",
    ],
    commonMistakes: [
      "Caching personalized/dynamic responses",
      "Relying on manual invalidations",
      "Cache key including too many varying headers (low hit rate)",
    ],
    bestPractices: [
      "Cache-bust static assets with hashed names",
      "Short/no cache for dynamic content",
      "Tune the cache key for a high hit rate",
    ],
    relatedTech: ["CloudFront", "cache policies", "Origin Access Control"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["s3-security", "aws-cost-optimization"],
  },
  {
    slug: "aws-secrets-kms",
    categoryId: "aws",
    topic: "IAM",
    question: "Secrets Manager vs Parameter Store vs KMS — how do you handle secrets and encryption?",
    tags: ["secrets manager", "parameter store", "kms", "encryption", "rotation"],
    shortAnswer:
      "KMS manages encryption keys (envelope encryption for S3/RDS/EBS etc.). Secrets Manager stores secrets with built-in rotation (DB credentials, API keys) — paid per secret. SSM Parameter Store holds config + secrets (SecureString via KMS) cheaply, without native rotation. Never store secrets in code/env files committed to git.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "KMS", v: "manages encryption keys" },
          { k: "Secrets Manager", v: "secrets + auto-rotation (paid)" },
          { k: "Parameter Store", v: "config + SecureString, cheaper" },
        ],
      },
    ],
    whatIf: {
      q: "You need DB credentials that rotate automatically every 30 days — which service?",
      a: "Secrets Manager: it natively rotates supported credentials (e.g. RDS) on a schedule via a rotation Lambda, and apps fetch the current value at runtime. Parameter Store is cheaper but has no built-in rotation, so it's better for static config/secrets.",
    },
    realWorld:
      "Secrets Manager for rotating DB creds, Parameter Store for cheaper config/secrets, KMS underpinning encryption everywhere — apps fetch secrets at runtime via an IAM role, never bake them into images.",
    interviewerExpectation: ["KMS = keys", "Secrets Manager = rotation (paid)", "Parameter Store = cheap config/SecureString", "runtime fetch via role", "no secrets in git"],
    followUps: [
      "What is envelope encryption (KMS)?",
      "When Parameter Store over Secrets Manager?",
      "How does automatic rotation work?",
    ],
    commonMistakes: [
      "Secrets in env vars / images / git",
      "Using Secrets Manager for large amounts of static config (cost)",
      "No rotation for long-lived credentials",
    ],
    bestPractices: [
      "Secrets Manager for rotating credentials",
      "Parameter Store for cheap config/secrets",
      "Fetch at runtime via IAM role; enable rotation",
    ],
    relatedTech: ["KMS", "Secrets Manager", "SSM Parameter Store"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte", "banking"],
    related: ["iam-roles-users-policies", "s3-security"],
  },
  {
    slug: "aws-cost-optimization",
    categoryId: "aws",
    topic: "S3",
    question: "What are the main levers for optimizing AWS cost without hurting reliability?",
    tags: ["cost optimization", "reserved instances", "savings plans", "spot", "right-sizing"],
    shortAnswer:
      "Right-size (match instance/DB size to real usage), use Savings Plans / Reserved Instances for steady baseline load, Spot for fault-tolerant/batch workloads, auto-scale to demand, tier storage (S3 lifecycle), delete idle/orphaned resources, and tag + monitor with Cost Explorer/budgets to catch waste.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Right-size", v: "match capacity to real usage" },
          { k: "Savings Plans/RIs", v: "discount steady baseline" },
          { k: "Spot", v: "cheap, interruptible batch/stateless" },
          { k: "Cleanup + tiering", v: "kill idle, S3 lifecycle" },
        ],
      },
    ],
    whatIf: {
      q: "Where do you look first to cut a surprising AWS bill?",
      a: "Cost Explorer to find the top drivers, then: idle/oversized instances and unattached EBS/EIPs, un-lifecycle'd S3, over-provisioned RDS, and NAT/data-transfer charges. Right-sizing + Savings Plans on steady compute + storage tiering usually capture the biggest wins fast.",
    },
    realWorld:
      "FinOps practice: tag resources, monitor Cost Explorer/budgets, right-size, commit Savings Plans for baseline, Spot for batch, and lifecycle storage — reliability stays intact while cost drops.",
    interviewerExpectation: ["right-sizing", "Savings Plans/RIs for baseline", "Spot for fault-tolerant", "auto-scaling", "storage tiering + cleanup", "tagging/monitoring"],
    followUps: [
      "Savings Plans vs Reserved Instances?",
      "What workloads suit Spot?",
      "How do you catch data-transfer/NAT costs?",
    ],
    commonMistakes: [
      "Over-provisioned always-on instances",
      "Spot for stateful/critical workloads",
      "Untagged resources → no cost visibility",
    ],
    bestPractices: [
      "Right-size + Savings Plans for baseline",
      "Spot for interruptible batch",
      "Tag + monitor; lifecycle storage; delete idle",
    ],
    relatedTech: ["Cost Explorer", "Savings Plans", "Spot", "AWS Budgets"],
    difficulty: "Medium",
    experience: ["3-5 years", "8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Microsoft", "Wipro"],
    related: ["s3-storage-classes", "autoscaling-load-balancing"],
  },

  // ---------------------------------------------------------------- Hard (6)
  {
    slug: "rds-multiaz-read-replicas",
    categoryId: "aws",
    topic: "DynamoDB",
    question: "Multi-AZ vs read replicas in RDS — what does each solve?",
    tags: ["rds", "multi-az", "read replica", "high availability", "scaling"],
    shortAnswer:
      "Multi-AZ is for HA/failover: a synchronous standby in another AZ that auto-promotes on failure (not for read scaling — the standby serves no traffic). Read replicas are for read scaling: asynchronous copies you route read queries to (eventually consistent, can be cross-Region). They solve different problems and are often combined.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Multi-AZ", v: "sync standby, auto-failover, HA" },
          { k: "Read replica", v: "async copies, scale reads" },
          { k: "Standby", v: "serves NO traffic (just failover)" },
          { k: "Combine", v: "Multi-AZ + replicas for HA + read scale" },
        ],
      },
    ],
    whatIf: {
      q: "A team adds Multi-AZ hoping to offload read traffic and sees no improvement — why?",
      a: "Multi-AZ's standby is passive — it exists only for failover and serves zero queries. To scale reads you need read replicas (which you explicitly route SELECTs to). Multi-AZ = availability; read replicas = read throughput. They're different tools.",
    },
    realWorld:
      "Confusing Multi-AZ (HA) with read replicas (read scaling) is a common misconception; production DBs use Multi-AZ for failover and add read replicas when read load grows.",
    interviewerExpectation: ["Multi-AZ = HA/sync/failover", "standby serves no traffic", "read replicas = async read scaling", "replica lag/eventual consistency", "combine both"],
    followUps: [
      "How does replica lag affect read-after-write?",
      "Cross-Region read replicas — use case?",
      "How does Aurora differ (shared storage)?",
    ],
    commonMistakes: [
      "Expecting Multi-AZ standby to serve reads",
      "Reading from a lagging replica for read-after-write",
      "Single-AZ production databases",
    ],
    bestPractices: [
      "Multi-AZ for HA; read replicas for read scale",
      "Handle replica lag in read-after-write flows",
      "Consider Aurora for scale + HA",
    ],
    relatedTech: ["RDS Multi-AZ", "read replicas", "Aurora"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["rds-vs-dynamodb", "aws-high-availability"],
  },
  {
    slug: "aws-high-availability",
    categoryId: "aws",
    topic: "VPC",
    question: "How do you architect a highly available, fault-tolerant application on AWS?",
    tags: ["high availability", "fault tolerance", "multi-az", "failover", "resilience"],
    shortAnswer:
      "Eliminate single points of failure: run stateless app tiers across ≥2 AZs behind a load balancer with auto scaling, use Multi-AZ managed data stores, decouple with queues, add health checks + automated failover (Route 53), design for graceful degradation, and test failure (chaos/game days). Multi-Region for the strictest RTO/RPO.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "No SPOF", v: "redundancy at every tier" },
          { k: "Multi-AZ", v: "app + data across AZs" },
          { k: "Decouple", v: "queues absorb spikes/failures" },
          { k: "Failover", v: "health checks + Route 53" },
        ],
      },
    ],
    whatIf: {
      q: "What's the difference between high availability and fault tolerance here?",
      a: "HA minimizes downtime (fast recovery, brief blips acceptable) — e.g. multi-AZ with auto-failover. Fault tolerance means NO interruption even during a failure (full redundancy, more expensive). Most systems target HA; true fault tolerance is reserved for the most critical paths due to cost.",
    },
    realWorld:
      "Multi-AZ, stateless auto-scaled tiers, queue decoupling, and Route 53 failover are the HA playbook; chaos/game-day testing validates that failover actually works before a real outage.",
    interviewerExpectation: ["remove SPOFs", "multi-AZ + LB + auto scaling", "Multi-AZ data", "decouple with queues", "Route 53 failover", "HA vs FT", "test failure"],
    followUps: [
      "RTO vs RPO — how do they drive design?",
      "When do you go multi-Region?",
      "How do you test failover safely?",
    ],
    commonMistakes: [
      "Hidden single points of failure",
      "Stateful app tiers (can't fail over cleanly)",
      "Never testing failover",
    ],
    bestPractices: [
      "Redundancy at every tier across AZs",
      "Stateless tiers + queue decoupling",
      "Automate + regularly test failover",
    ],
    relatedTech: ["Route 53 failover", "Multi-AZ", "Auto Scaling", "chaos engineering"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google", "banking"],
    related: ["regions-vs-azs", "autoscaling-load-balancing", "well-architected-framework"],
  },
  {
    slug: "dynamodb-single-table",
    categoryId: "aws",
    topic: "DynamoDB",
    question: "What is DynamoDB single-table design, and why do experts use it?",
    tags: ["dynamodb", "single-table design", "access patterns", "gsi", "nosql modeling"],
    shortAnswer:
      "Single-table design stores multiple entity types in ONE table, using composite keys (PK/SK) and GSIs crafted so each known access pattern is served by a single efficient query — no joins, no multiple round-trips. It trades modeling complexity and rigidity for low latency and cost at scale.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "One table", v: "many entity types together" },
          { k: "Composite keys", v: "PK/SK model relationships" },
          { k: "GSIs", v: "serve additional access patterns" },
          { k: "Goal", v: "one query per access pattern, no joins" },
        ],
      },
    ],
    whatIf: {
      q: "Why is single-table design controversial / risky?",
      a: "You must know ALL access patterns up front — the key/GSI design is baked around them. New, unforeseen query needs can require painful migrations or extra GSIs, and the schema is hard for newcomers to read. It maximizes performance/cost but sacrifices flexibility, so it's not always the right call.",
    },
    realWorld:
      "AWS/Alex DeBrie advocate single-table design for high-scale DynamoDB apps to hit single-digit-ms latency and minimize cost; teams with evolving requirements often prefer simpler multi-table or a relational DB.",
    interviewerExpectation: ["multiple entities in one table", "composite PK/SK + GSIs", "one query per access pattern", "must know patterns upfront", "flexibility trade-off"],
    followUps: [
      "How do overloaded GSIs work?",
      "When would you NOT use single-table design?",
      "How do you add a new access pattern later?",
    ],
    commonMistakes: [
      "Single-table design with unknown/evolving patterns",
      "Relational thinking (joins) on DynamoDB",
      "Not planning GSIs for all patterns",
    ],
    bestPractices: [
      "Enumerate all access patterns first",
      "Model keys/GSIs per pattern",
      "Prefer simpler designs when flexibility matters",
    ],
    relatedTech: ["DynamoDB", "GSI/LSI", "composite keys"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Google", "Microsoft"],
    related: ["dynamodb-partition-key", "rds-vs-dynamodb"],
  },
  {
    slug: "well-architected-framework",
    categoryId: "aws",
    topic: "VPC",
    question: "What are the AWS Well-Architected Framework pillars, and how do you use them?",
    tags: ["well-architected", "pillars", "reliability", "security", "cost", "review"],
    shortAnswer:
      "Six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability. It's a review lens — you run a Well-Architected Review to surface risks and trade-offs against these pillars, then prioritize remediations. It frames design decisions, not a checklist to pass.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Op Excellence", v: "run + improve operations" },
          { k: "Security", v: "least privilege, defense in depth" },
          { k: "Reliability", v: "recover from failure, scale" },
          { k: "Perf / Cost / Sustainability", v: "efficient, economical, green" },
        ],
      },
    ],
    whatIf: {
      q: "How do you use Well-Architected in a real design review?",
      a: "Walk the architecture against each pillar's questions, identify risks (e.g. no multi-AZ = reliability risk, over-broad IAM = security risk), record trade-offs the team accepts, and prioritize high-risk items. It's a structured way to make design gaps and trade-offs explicit — not a certification.",
    },
    realWorld:
      "Enterprises run Well-Architected Reviews (via the AWS tool or with partners) before major launches to catch reliability/security/cost gaps early; it's a shared vocabulary for architecture trade-offs.",
    interviewerExpectation: ["six pillars named", "review/trade-off lens", "surfaces risks", "prioritize remediation", "not a pass/fail checklist"],
    followUps: [
      "Give an example trade-off between two pillars.",
      "How does the Well-Architected Tool work?",
      "Which pillar is most often neglected?",
    ],
    commonMistakes: [
      "Treating it as a checkbox certification",
      "Optimizing one pillar (cost) at another's expense (reliability)",
      "Reviewing only at the end",
    ],
    bestPractices: [
      "Review against all pillars early + periodically",
      "Make trade-offs explicit and owned",
      "Prioritize by risk",
    ],
    relatedTech: ["Well-Architected Tool", "Trusted Advisor", "AWS Config"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Deloitte", "Microsoft"],
    related: ["aws-high-availability", "aws-cost-optimization"],
  },
  {
    slug: "serverless-event-driven-dlq",
    categoryId: "aws",
    topic: "Lambda",
    question: "How do you build a reliable event-driven serverless pipeline (and handle poison messages)?",
    tags: ["serverless", "event-driven", "dlq", "lambda", "sqs", "retries"],
    shortAnswer:
      "Decouple with SQS/EventBridge between stages, process with Lambda, and configure retries with a Dead Letter Queue (DLQ) so messages that keep failing (poison messages) are moved aside instead of blocking the queue or retrying forever. Make handlers idempotent, and alert/replay from the DLQ.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Decouple", v: "SQS/EventBridge between stages" },
          { k: "Retry", v: "bounded retries on failure" },
          { k: "DLQ", v: "park poison messages after N tries" },
          { k: "Idempotent", v: "safe reprocessing on redelivery" },
        ],
      },
    ],
    whatIf: {
      q: "One malformed message keeps failing and blocks an SQS→Lambda pipeline — what's the fix?",
      a: "A poison message. Set a redrive policy with maxReceiveCount so after N failed attempts SQS moves it to a DLQ, unblocking the queue. Alert on DLQ depth, inspect/fix the bad message, and replay it. Without a DLQ, it retries forever and stalls processing.",
    },
    realWorld:
      "SQS→Lambda with a DLQ + idempotent handlers is the standard reliable serverless pattern; missing DLQs cause stuck queues and infinite retries on bad messages.",
    interviewerExpectation: ["decouple with SQS/EventBridge", "bounded retries", "DLQ for poison messages (maxReceiveCount)", "idempotent handlers", "alert + replay DLQ"],
    followUps: [
      "How does maxReceiveCount / redrive work?",
      "Why must the handler be idempotent?",
      "How do you monitor and replay a DLQ?",
    ],
    commonMistakes: [
      "No DLQ → poison messages block the queue",
      "Non-idempotent handlers (duplicate effects)",
      "Unbounded retries",
    ],
    bestPractices: [
      "Configure DLQs with a sensible maxReceiveCount",
      "Make handlers idempotent",
      "Alert on DLQ depth; support replay",
    ],
    relatedTech: ["SQS DLQ", "Lambda", "EventBridge", "CloudWatch alarms"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Google"],
    related: ["sqs-sns-eventbridge", "lambda-concurrency"],
  },
  {
    slug: "vpc-connectivity",
    categoryId: "aws",
    topic: "VPC",
    question: "How do you connect VPCs and on-prem networks — peering, Transit Gateway, PrivateLink?",
    tags: ["vpc peering", "transit gateway", "privatelink", "direct connect", "hybrid"],
    shortAnswer:
      "VPC Peering: 1:1 VPC connection (non-transitive — doesn't scale to many VPCs). Transit Gateway: a hub that routes between many VPCs + on-prem (the scalable choice). PrivateLink: expose/consume a specific service privately without exposing whole networks. Direct Connect/VPN link on-prem to AWS.",
    mindMap: [
      {
        type: "kv",
        rows: [
          { k: "Peering", v: "1:1, non-transitive, few VPCs" },
          { k: "Transit Gateway", v: "hub-and-spoke, many VPCs + on-prem" },
          { k: "PrivateLink", v: "private access to ONE service" },
          { k: "Direct Connect/VPN", v: "on-prem ↔ AWS" },
        ],
      },
    ],
    whatIf: {
      q: "You have 20 VPCs that all need to talk to each other — peering or Transit Gateway?",
      a: "Transit Gateway. VPC peering is non-transitive, so 20 VPCs would need ~190 individual peering connections (n·(n-1)/2) — unmanageable. Transit Gateway acts as a central hub: each VPC attaches once and routes to the others, scaling cleanly.",
    },
    realWorld:
      "Peering suits a couple of VPCs; at scale, Transit Gateway is the hub for many-VPC + hybrid connectivity, and PrivateLink exposes SaaS/internal services privately without broad network access.",
    interviewerExpectation: ["peering 1:1 non-transitive", "Transit Gateway hub for scale", "PrivateLink per-service", "Direct Connect/VPN hybrid", "mesh explosion problem"],
    followUps: [
      "Why is VPC peering non-transitive a problem at scale?",
      "PrivateLink vs peering for exposing a service?",
      "Direct Connect vs VPN trade-offs?",
    ],
    commonMistakes: [
      "Full-mesh peering for many VPCs",
      "Exposing whole VPCs when PrivateLink (one service) fits",
      "Assuming peering is transitive",
    ],
    bestPractices: [
      "Transit Gateway for many-VPC/hybrid",
      "PrivateLink for private per-service access",
      "Peering only for a small number of VPCs",
    ],
    relatedTech: ["Transit Gateway", "PrivateLink", "Direct Connect", "VPN"],
    difficulty: "Hard",
    experience: ["8-15 years"],
    askedIn: ["Amazon", "Microsoft", "Deloitte"],
    related: ["vpc-design", "aws-high-availability"],
  },
];
