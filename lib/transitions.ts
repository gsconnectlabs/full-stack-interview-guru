export interface TransitionPath {
  id: string;
  background: string;
  icon: string;
  pitch: string;
  /** category ids (must match lib/categories) to form the roadmap */
  roadmap: string[];
  /** quick wins the candidate already has, to build confidence */
  strengths: string[];
}

export const transitionPaths: TransitionPath[] = [
  {
    id: "ivr",
    background: "IVR Developer",
    icon: "📞",
    pitch: "You already think in call flows and state machines — that maps cleanly onto request/response APIs and event-driven services.",
    roadmap: ["java-8", "rest-apis", "json", "git", "docker", "aws"],
    strengths: ["State-machine thinking", "Telephony & real-time flows", "Production support instincts"],
  },
  {
    id: "middleware",
    background: "Middleware Developer",
    icon: "🔌",
    pitch: "Integration is your home turf. Modern full-stack is just integration with REST, JSON and containers instead of ESB and SOAP.",
    roadmap: ["rest-apis", "json", "java-8", "docker", "kubernetes", "system-design"],
    strengths: ["Integration patterns", "Message queues", "System-to-system thinking"],
  },
  {
    id: "support",
    background: "Support Engineer",
    icon: "🛟",
    pitch: "You've debugged prod at 3am — that's gold. Channel it into reading code, writing fixes, and owning features end to end.",
    roadmap: ["core-java", "sql", "linux", "git", "rest-apis", "docker"],
    strengths: ["Debugging under pressure", "Log & SQL fluency", "Customer empathy"],
  },
  {
    id: "manual-tester",
    background: "Manual Tester",
    icon: "🧪",
    pitch: "You understand quality and edge cases deeply. Add code and you become the engineer every team wants — one who ships and verifies.",
    roadmap: ["core-java", "python", "rest-apis", "sql", "git", "coding-challenges"],
    strengths: ["Edge-case mindset", "Test design", "Requirements clarity"],
  },
  {
    id: "mainframe",
    background: "Mainframe Developer",
    icon: "🖥️",
    pitch: "You've run mission-critical systems for years. Re-platform that discipline onto Java, the cloud, and modern data stores.",
    roadmap: ["core-java", "sql", "rest-apis", "aws", "git", "system-design"],
    strengths: ["Batch & data processing", "Reliability discipline", "Domain depth"],
  },
  {
    id: "dotnet",
    background: ".NET Developer",
    icon: "🟦",
    pitch: "The concepts transfer almost 1:1 — C#→Java, ASP.NET→Spring Boot. You're closer than you think; it's mostly syntax and ecosystem.",
    roadmap: ["core-java", "java-8", "rest-apis", "sql", "docker", "azure"],
    strengths: ["OOP fluency", "Web API experience", "Strong typing comfort"],
  },
  {
    id: "python",
    background: "Python Developer",
    icon: "🐍",
    pitch: "You can ship scripts and services fast. Add Java for enterprise breadth, plus AWS and system design to scale your reach.",
    roadmap: ["python", "rest-apis", "sql", "aws", "docker", "system-design"],
    strengths: ["Rapid prototyping", "Scripting & automation", "Data fluency"],
  },
];
