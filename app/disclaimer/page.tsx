import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  alternates: { canonical: "/disclaimer" },
  title: "Disclaimer",
  description:
    "Important disclaimer for Full Stack Interview Guru: content is educational, interview questions vary, company trademarks belong to their owners, and no employment is guaranteed.",
  openGraph: {
    title: "Disclaimer — Full Stack Interview Guru",
    description: "Educational content, no guarantees, trademarks belong to their owners.",
    url: "/disclaimer",
    type: "website",
  },
};

const LAST_UPDATED = "2026-07-19";

export default function DisclaimerPage() {
  return (
    <LegalPage
      badge="⚠️ Disclaimer"
      title="Disclaimer"
      updated={LAST_UPDATED}
      intro="Please read this disclaimer carefully before relying on any content published on Full Stack Interview Guru."
    >
      <h2>Educational content only</h2>
      <p>
        All content on Full Stack Interview Guru is published for general educational and informational
        purposes only. It is intended to help you learn and prepare, and should not be treated as
        professional, legal, financial, or career advice. Always apply your own judgement and verify
        details against official documentation for the technologies you use.
      </p>

      <h2>Interview questions vary</h2>
      <p>
        The questions, answers, and formats presented here are representative examples, not a fixed script.
        Actual interviews differ significantly between companies, teams, roles, and interviewers. Do not
        assume any question here will appear in your interview, or that a real interview will match our
        wording, depth, or difficulty.
      </p>

      <h2>Accuracy of information</h2>
      <p>
        We work to keep content accurate and current, but technologies evolve quickly and mistakes can
        happen. We make no warranty as to the completeness, reliability, or accuracy of any content. If you
        spot an error, please tell us via the{" "}
        <Link href="/contact">contact page</Link> and we&apos;ll review it.
      </p>

      <h2>Company names and trademarks</h2>
      <p>
        Company names, product names, logos, and technology names referenced on this site are the property
        of their respective owners. Their use here is purely for identification, reference, and educational
        purposes, and does not imply any affiliation with, endorsement by, or sponsorship from those
        owners.
      </p>

      <h2>No employment guarantee</h2>
      <p>
        Full Stack Interview Guru does not guarantee any job, interview, offer, salary, or career outcome.
        Preparing with this site improves your readiness, but success depends on many factors outside our
        control. Nothing on this site should be interpreted as a promise of employment.
      </p>

      <h2>External links and advertising</h2>
      <p>
        This site may contain links to external websites and third-party advertisements (including via
        Google AdSense). We do not control these and are not responsible for their content, accuracy, or
        practices. See our <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/terms">Terms &amp; Conditions</Link> for more.
      </p>

      <h2>Consent</h2>
      <p>
        By using Full Stack Interview Guru, you acknowledge this disclaimer and agree to its terms. If you
        do not agree, please discontinue use of the site.
      </p>
    </LegalPage>
  );
}
