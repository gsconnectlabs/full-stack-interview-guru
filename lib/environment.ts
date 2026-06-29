export interface VersionCheck {
  tool: string;
  icon: string;
  command: string;
  sample: string;
  where: string;
}

export const versionChecks: VersionCheck[] = [
  {
    tool: "Java (JRE)",
    icon: "☕",
    command: "java -version",
    sample: `openjdk version "17.0.10" 2024-01-16`,
    where: "Runs the JVM. If this fails, Java isn't on your PATH.",
  },
  {
    tool: "Java (compiler)",
    icon: "🛠️",
    command: "javac -version",
    sample: "javac 17.0.10",
    where: "Comes from the JDK. If javac is missing you installed a JRE, not a JDK.",
  },
  {
    tool: "Maven",
    icon: "📦",
    command: "mvn -v",
    sample: "Apache Maven 3.9.6",
    where: "Also prints the Java version Maven itself uses — a common gotcha.",
  },
  {
    tool: "Git",
    icon: "🌿",
    command: "git --version",
    sample: "git version 2.43.0",
    where: "Pre-installed on most Macs/Linux; install from git-scm.com on Windows.",
  },
  {
    tool: "Python",
    icon: "🐍",
    command: "python --version",
    sample: "Python 3.12.2",
    where: "On some systems use python3. Check pip --version too.",
  },
  {
    tool: "Node.js",
    icon: "🟩",
    command: "node -v",
    sample: "v20.11.1",
    where: "Bundled with npm — verify with npm -v.",
  },
  {
    tool: "npm",
    icon: "📦",
    command: "npm -v",
    sample: "10.2.4",
    where: "Ships inside Node. Mismatched versions cause most 'works on my machine' bugs.",
  },
  {
    tool: "Docker",
    icon: "🐳",
    command: "docker --version",
    sample: "Docker version 25.0.3",
    where: "Needs the Docker daemon running. Try docker ps to confirm it's alive.",
  },
  {
    tool: "Spring Boot",
    icon: "🍃",
    command: "mvn spring-boot:run -version",
    sample: "Spring Boot 3.2.x (see pom.xml)",
    where: "Defined by the parent version in pom.xml / build.gradle, not a global install.",
  },
  {
    tool: "Tomcat",
    icon: "🐱",
    command: "version.sh  (catalina)",
    sample: "Server version: Apache Tomcat/10.1.x",
    where: "Run $CATALINA_HOME/bin/version.sh (or version.bat on Windows).",
  },
];

export interface ConfigGuide {
  title: string;
  icon: string;
  steps: string[];
}

export const configGuides: ConfigGuide[] = [
  {
    title: "Set JAVA_HOME",
    icon: "🏠",
    steps: [
      "Find your JDK path (e.g. /Library/Java/.../Home or C:\\Program Files\\Java\\jdk-17).",
      "macOS/Linux: export JAVA_HOME=$(/usr/libexec/java_home -v 17) in ~/.zshrc.",
      "Windows: System Properties → Environment Variables → New → JAVA_HOME.",
      "Verify with: echo $JAVA_HOME   (or echo %JAVA_HOME% on Windows).",
    ],
  },
  {
    title: "Add to PATH",
    icon: "🛣️",
    steps: [
      "PATH tells your shell where to find commands like java and mvn.",
      "macOS/Linux: export PATH=$JAVA_HOME/bin:$PATH in your shell profile.",
      "Windows: edit the Path variable and add %JAVA_HOME%\\bin.",
      "Open a NEW terminal so the change takes effect, then re-run java -version.",
    ],
  },
  {
    title: "Upgrade the JDK (8 → 17/21)",
    icon: "⬆️",
    steps: [
      "Install the new JDK (SDKMAN!, Homebrew, or the vendor installer).",
      "Point JAVA_HOME at the new version and update PATH.",
      "Bump <maven.compiler.release> (or sourceCompatibility) in your build file.",
      "Rebuild and run your tests — watch for removed APIs and reflection warnings.",
    ],
  },
  {
    title: "Configure Maven (settings.xml)",
    icon: "⚙️",
    steps: [
      "Global config lives in ~/.m2/settings.xml.",
      "Add <mirror> entries for a corporate Nexus/Artifactory proxy.",
      "Store repo credentials under <servers>, not in pom.xml.",
      "Run mvn -v to confirm Maven sees the right Java home.",
    ],
  },
];
