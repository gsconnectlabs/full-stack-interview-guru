import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms & Conditions",
  description:
    "The terms governing your use of Full Stack Interview Guru: educational purpose, intellectual property, acceptable use, limitation of liability, external links and governing law.",
  openGraph: {
    title: "Terms & Conditions — Full Stack Interview Guru",
    description: "The terms that govern your use of the FIG website.",
    url: "/terms",
    type: "website",
  },
};

const LAST_UPDATED = "2026-07-19";

export default function TermsPage() {
  return (
    <LegalPage
      badge="📜 Terms"
      title="Terms & Conditions"
      updated={LAST_UPDATED}
      intro="By accessing or using Full Stack Interview Guru, you agree to these terms. Please read them carefully."
    >
      <p>
        These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to and use of the Full Stack
        Interview Guru website (&ldquo;FIG&rdquo;, the &ldquo;site&rdquo;). By using the site you accept
        these Terms in full. If you do not agree, please do not use the site.
      </p>

      <h2>Educational purpose</h2>
      <p>
        FIG is an educational resource. All content — including interview questions, explanations, code
        samples and rubrics — is provided for learning and preparation purposes only. It does not
        constitute professional, legal, financial, or career advice.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The content, layout, design, and original text on FIG are owned by Full Stack Interview Guru and
        are protected by applicable intellectual property laws. You may read, share links to, and reference
        our content for personal, non-commercial study. You may not republish, resell, or redistribute
        substantial portions of the content as your own without prior written permission.
      </p>
      <p>
        Technology names, product names, and company names referenced on the site are the trademarks of
        their respective owners and are used only for identification and educational purposes.
      </p>

      <h2>Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Use the site in any way that breaks applicable laws or regulations.</li>
        <li>
          Attempt to disrupt, overload, scrape at scale, or gain unauthorized access to the site or its
          infrastructure.
        </li>
        <li>Introduce malware or attempt to compromise the security of the site or its users.</li>
        <li>Misrepresent our content as your own or use it to mislead others.</li>
      </ul>

      <h2>No interview or employment guarantee</h2>
      <p>
        FIG helps you prepare, but it cannot and does not guarantee any particular outcome. Using the site
        does not guarantee that you will pass an interview, receive a job offer, or achieve any specific
        result. Interview questions and formats vary widely by company and role.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        The site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
        warranties of any kind, express or implied. To the fullest extent permitted by law, Full Stack
        Interview Guru shall not be liable for any direct, indirect, incidental, or consequential damages
        arising from your use of, or inability to use, the site or its content.
      </p>

      <h2>External links</h2>
      <p>
        The site may contain links to third-party websites and advertisements. We do not control and are
        not responsible for the content, products, or practices of any third-party sites. Accessing them is
        at your own risk and subject to their terms.
      </p>

      <h2>Advertising</h2>
      <p>
        FIG may display advertising, including through Google AdSense, to help keep the content free. Ads
        are intended to be non-intrusive. See our <Link href="/privacy">Privacy Policy</Link> for how
        advertising cookies are used.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may revise these Terms from time to time. The current version is always posted on this page with
        a revised &ldquo;last updated&rdquo; date. Your continued use of the site after changes are posted
        means you accept the updated Terms.
      </p>

      <h2>Governing law</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of India, without regard to
        conflict-of-law principles. Any disputes arising in connection with the site shall be subject to the
        exclusive jurisdiction of the competent courts located in India.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these Terms? Reach us through our <Link href="/contact">contact page</Link>.
      </p>
    </LegalPage>
  );
}
