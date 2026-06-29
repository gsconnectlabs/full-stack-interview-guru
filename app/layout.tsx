import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { siteUrl, siteName } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Full Stack Interview Guru — Interview Tomorrow? Start Here.",
    template: "%s · Full Stack Interview Guru",
  },
  description:
    "A distraction-free interview prep platform for candidates and interviewers. Java, Python, AWS, REST APIs, SQL, Docker, Kubernetes, System Design & AI — no login, no noise, just interviews.",
  keywords: [
    "interview questions",
    "java interview",
    "python interview",
    "aws interview",
    "system design",
    "rest api interview",
    "sql interview",
    "coding interview prep",
  ],
  authors: [{ name: siteName }],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Full Stack Interview Guru — Interview Tomorrow? Start Here.",
    description:
      "Prepare. Ask. Evaluate. Distraction-free interview prep for candidates and interviewers.",
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: "Full Stack Interview Guru",
    description: "Interview Tomorrow? Start Here. No login, no noise — just interviews.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0b14",
  width: "device-width",
  initialScale: 1,
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    alternateName: "Interview Guru",
    url: siteUrl,
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: siteUrl,
    slogan: "Interview Tomorrow? Start Here.",
  },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
