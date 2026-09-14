import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

const APP_NAME = "UPI QR Generator";
const PACKAGE_NAME = "com.jayamhub.upi_qr_generator";
const CONTACT_EMAIL = "jayamhub@gmail.com";

export const metadata: Metadata = {
  alternates: { canonical: "/upi-qr-generator/privacy-policy" },
  title: "UPI QR Generator — Privacy Policy",
  description:
    "Privacy Policy for the UPI QR Generator Android app: what data it stores on-device, how Google AdMob and Google Play Billing are used, and how to contact the developer.",
  openGraph: {
    title: "UPI QR Generator — Privacy Policy",
    description:
      "What UPI QR Generator stores on-device, how AdMob and Google Play Billing are used, and how to reach the developer.",
    url: "/upi-qr-generator/privacy-policy",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "2026-09-14";

export default function UpiQrGeneratorPrivacyPolicyPage() {
  return (
    <LegalPage
      badge="📱 UPI QR Generator — Android App"
      title="Privacy Policy"
      updated={LAST_UPDATED}
      intro={
        <>
          This policy covers the <strong className="text-slate-200">{APP_NAME}</strong> Android app
          (package <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-sm">{PACKAGE_NAME}</code>),
          published by JayamHub — not the FullStackInterviewGuru website you&apos;re reading it on.
        </>
      }
    >
      <p>
        Effective date: <strong>September 14, 2026</strong>. UPI QR Generator (&ldquo;the app&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;) is a utility app for small shop owners and freelancers to
        generate a UPI payment QR code with a pre-filled amount. It has no login and no account system.
        By installing or using the app, you agree to the practices described below. If you don&apos;t
        agree, please don&apos;t use the app.
      </p>

      <h2>Information you provide or enter</h2>
      <p>When you add a UPI ID inside the app, it stores, only on your own device:</p>
      <ul>
        <li>The label you give it (e.g. &ldquo;Shop Counter&rdquo;)</li>
        <li>The UPI ID / VPA itself (e.g. name@bank)</li>
        <li>The payee name shown on the generated QR code</li>
        <li>Which saved UPI ID is marked as your default</li>
      </ul>
      <p>
        When you generate a QR code, the amount and optional note you type are encoded directly into
        that QR image on your device. None of this is sent to us — the app has no server of its own to
        send it to.
      </p>

      <h2>How the QR codes work</h2>
      <p>
        UPI QR Generator only <em>creates</em> a QR code that encodes a standard UPI payment request
        (a payee UPI ID, name, and amount) — the same information you&apos;d write on an invoice. The
        app does not initiate, process, approve, or move money, and it does not track whether a payment
        was ever completed.
      </p>
      <p>
        When a customer scans the code, <strong>their own</strong> bank or UPI app opens to complete the
        payment. Our app never sees, requests, or has any access to a bank account, UPI PIN, one-time
        password (OTP), login password, or any other banking credential belonging to you or the person
        paying you. It cannot see whether the payment succeeded — you confirm that yourself in your own
        bank app or via SMS, as the app&apos;s own on-screen instructions remind you.
      </p>
      <p>
        Every generated QR code also carries a small &ldquo;Powered by UPI QR Generator&rdquo; label
        beneath it when saved or shared, purely as attribution branding — it is not additional data
        collection and is not part of the payment information encoded in the QR itself.
      </p>

      <h2>Local data storage</h2>
      <p>
        All app data — your saved UPI IDs and a simple daily counter used to enforce the free-tier
        limit — is stored using Hive, an on-device database, inside the app&apos;s private storage
        area. None of it is uploaded to any server or cloud service we operate, because none exists.
      </p>
      <ul>
        <li>Delete a saved UPI ID any time from the app&apos;s Home screen.</li>
        <li>Uninstalling the app permanently deletes everything it stored, since Android wipes an app&apos;s private storage on uninstall.</li>
        <li>QR images you choose to save go to your device&apos;s own Photos/Gallery through the standard Android media store — governed by your device&apos;s own storage settings, not by us.</li>
      </ul>

      <h2>Advertising and Google AdMob</h2>
      <p>
        Free-tier users see a single small banner ad on the Home screen, served through{" "}
        <strong>Google AdMob</strong>. Pro subscribers never see ads. AdMob is operated by Google, not
        by us, and may collect information such as your advertising ID, approximate IP-based location,
        device information, and ad interaction data, used to select and measure ads and prevent fraud —
        governed by Google&apos;s own policies, not ours.
      </p>
      <p>
        You can manage or opt out of personalized advertising for your device at{" "}
        <a href="https://myadcenter.google.com" target="_blank" rel="noopener noreferrer">
          Google&apos;s Ad Center
        </a>
        , and read more about how Google uses this data in{" "}
        <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
          how Google uses information from sites or apps that use its services
        </a>{" "}
        and the{" "}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Google Privacy Policy
        </a>
        .
      </p>

      <h2>Google Play Billing and the Premium subscription</h2>
      <p>
        UPI QR Generator offers an optional, auto-renewing Premium subscription (₹99/year) that removes
        ads and lifts the free-tier limits. All payment processing, billing, and renewal is handled
        entirely by <strong>Google Play Billing</strong> — we never see or store your card, bank, or
        other payment details. The app only reads back whether you currently hold an active
        subscription, and stores that single yes/no status on your device to unlock Premium features.
      </p>
      <p>
        You can manage, change, or cancel your subscription at any time from the Play Store app under{" "}
        <strong>Subscriptions</strong> — cancelling stops future renewals but doesn&apos;t retroactively
        refund the current period, per{" "}
        <a href="https://support.google.com/googleplay/answer/11416267" target="_blank" rel="noopener noreferrer">
          Google Play&apos;s purchase terms
        </a>
        .
      </p>

      <h2>How information is used</h2>
      <ul>
        <li>
          <strong>Locally stored data</strong> — used only to run the app itself: listing your saved UPI
          IDs, pre-filling the payee when you generate a new QR code, and enforcing the free-tier limits
          (2 saved UPI IDs, 10 QR codes per day).
        </li>
        <li>
          <strong>Advertising data</strong> — used by Google to select and measure the banner ad shown
          to free-tier users.
        </li>
        <li>
          <strong>Subscription data</strong> — used by Google Play to manage your Premium subscription;
          the app itself only reads your current entitlement status.
        </li>
      </ul>

      <h2>Information sharing and third parties</h2>
      <p>
        We do not sell your information, and we have no server of our own to share it from — the data
        described above physically exists only on your device. The only outside parties involved at all
        are Google AdMob and Google Play Billing, acting as service providers for the features described
        above, under their own privacy policies linked in this page.
      </p>

      <h2>Data retention and deletion</h2>
      <p>
        There is no account to delete, because there is no account. Your saved UPI IDs stay on your
        device until you delete them individually in the app, or uninstall the app entirely — which
        removes all app data at once, immediately and permanently.
      </p>

      <h2>Security</h2>
      <p>
        Because your saved UPI IDs and settings never leave your device, there is no server-side
        database of ours that could be breached. That data still sits in your device&apos;s normal
        app-private storage, so your device&apos;s own lock screen and operating-system security are
        what protect it — we recommend keeping your phone&apos;s screen lock enabled.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        UPI QR Generator is a business utility aimed at shop owners and freelancers and is not directed
        at children. We do not knowingly collect information from anyone under 18. If you believe a
        child has used the app and provided information covered by this policy, contact us below and
        we&apos;ll address it.
      </p>

      <h2>Changes to this Privacy Policy</h2>
      <p>
        If this policy changes, we&apos;ll update the effective date at the top of this page and, for
        material changes, note it in the app&apos;s update notes on the Play Store. Continuing to use
        the app after a change means you accept the revised policy.
      </p>

      <h2>Contact us</h2>
      <p>
        Questions about this policy or your data can be sent to{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPage>
  );
}
