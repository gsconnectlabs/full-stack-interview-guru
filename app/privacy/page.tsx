import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/LegalPage";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy" },
  title: "Privacy Policy",
  description:
    "How Full Stack Interview Guru handles cookies, Google Analytics, Google AdSense, third-party services, and your privacy. We collect no accounts and sell no data.",
  openGraph: {
    title: "Privacy Policy — Full Stack Interview Guru",
    description:
      "How FIG handles cookies, analytics, advertising and your privacy. No accounts, no data sales.",
    url: "/privacy",
    type: "website",
  },
};

const LAST_UPDATED = "2026-07-19";

export default function PrivacyPage() {
  return (
    <LegalPage
      badge="🔒 Privacy"
      title="Privacy Policy"
      updated={LAST_UPDATED}
      intro="This policy explains what information Full Stack Interview Guru does — and does not — collect, and how third-party services we use may handle data."
    >
      <p>
        Full Stack Interview Guru (&ldquo;FIG&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a free,
        content-driven interview preparation website. We do not require an account, and we do not sell your
        personal information. This policy describes the limited data handling involved in running the site
        and the third-party services we rely on.
      </p>

      <h2>Information we collect</h2>
      <p>
        We do not ask you to register, and we do not directly collect names, email addresses, or payment
        details in order to use the site. The only information processed is:
      </p>
      <ul>
        <li>
          <strong>Anonymous usage data</strong> gathered by analytics (see below), such as pages visited,
          approximate region, device type, and referring site.
        </li>
        <li>
          <strong>Information you choose to send us</strong> through the contact or feedback forms — for
          example your name, email and message. This is used only to respond to you.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        Cookies are small text files stored by your browser. FIG&apos;s own functionality does not depend
        on tracking cookies. However, the third-party services below (analytics and advertising) may set
        cookies or similar technologies. You can block or delete cookies at any time in your browser
        settings; the core content of the site will continue to work.
      </p>

      <h2>Google Analytics</h2>
      <p>
        We may use Google Analytics to understand, in aggregate, how the site is used so we can improve
        content. Google Analytics uses cookies and collects data such as pages viewed and general location.
        We enable IP anonymization. This data is aggregated and is not used to personally identify you.
        You can opt out using Google&apos;s{" "}
        <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
          Analytics opt-out browser add-on
        </a>
        .
      </p>

      <h2>Google AdSense</h2>
      <p>
        We may display advertising through Google AdSense. As a third-party vendor, Google uses cookies —
        including the DoubleClick cookie — to serve ads based on your prior visits to this and other
        websites.
      </p>
      <ul>
        <li>
          Google&apos;s use of advertising cookies enables it and its partners to serve ads to you based on
          your visits to FIG and/or other sites on the Internet.
        </li>
        <li>
          You may opt out of personalized advertising by visiting{" "}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
            Google Ads Settings
          </a>
          .
        </li>
        <li>
          You can also opt out of a third-party vendor&apos;s use of cookies for personalized advertising at{" "}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            aboutads.info/choices
          </a>
          .
        </li>
      </ul>
      <p>
        For more detail, see{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noopener noreferrer"
        >
          how Google uses information from sites that use its services
        </a>
        .
      </p>

      <h2>Third-party services</h2>
      <p>
        Beyond Google Analytics and AdSense, the site is hosted on a third-party platform and may link to
        external services such as donation providers or affiliate product pages. These providers have their
        own privacy policies governing any data you share with them directly.
      </p>

      <h2>User privacy</h2>
      <p>
        We do not sell, rent, or trade your personal information. Information you send through a form is used
        solely to reply to your message and is not added to a marketing list. Because FIG has no login,
        there is no account profile tied to your browsing.
      </p>

      <h2>Data security</h2>
      <p>
        The site is served over HTTPS. While no method of transmission over the Internet is completely
        secure, we rely on reputable hosting and third-party providers and keep the amount of data we
        handle deliberately minimal.
      </p>

      <h2>External links</h2>
      <p>
        FIG contains links to external websites we do not control. We are not responsible for the content
        or privacy practices of those sites. We encourage you to review the privacy policy of any site you
        visit.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        FIG is intended for a general professional and student audience and is not directed at children
        under 13. We do not knowingly collect personal information from children.
      </p>

      <h2>Policy updates</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be posted on this page with a
        revised &ldquo;last updated&rdquo; date. Continued use of the site after changes are posted
        constitutes acceptance of the updated policy.
      </p>

      <h2>Contact information</h2>
      <p>
        Questions about this policy? {contactEmail ? (
          <>
            Email us at{" "}
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a> or use our{" "}
            <Link href="/contact">contact page</Link>.
          </>
        ) : (
          <>
            Reach us through our <Link href="/contact">contact page</Link>.
          </>
        )}
      </p>
    </LegalPage>
  );
}
