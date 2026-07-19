import type { MetadataRoute } from "next";

// Web app manifest — Next auto-links this at /manifest.webmanifest.
// Colors match the current dark UI; revisit theme_color when the light/dark
// theme system (ROADMAP H3) lands.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FullStackInterviewGuru (FIG)",
    short_name: "FIG",
    description:
      "Trusted, fast interview preparation — Core Java, Multithreading, JVM, SQL, REST APIs, Microservices, AWS & System Design.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0b14",
    theme_color: "#0a0b14",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
