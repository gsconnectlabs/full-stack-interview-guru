import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ContactForm from "@/components/ContactForm";
import { contactEmail } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: "Contact Us — Get in touch with FIG",
  description:
    "Contact the Full Stack Interview Guru team. Report a content issue, suggest a topic, ask a question, or share feedback. No account required — we read every message.",
  openGraph: {
    title: "Contact Full Stack Interview Guru",
    description: "Questions, corrections or ideas? Reach the FIG team — we read every message.",
    url: "/contact",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Contact Us" }]} />

      <div className="mt-6 text-center">
        <span className="chip mx-auto">✉️ Contact</span>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">Get in touch</h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-400">
          Spotted a wrong answer, want a topic added, or have a partnership question? Send us a note. We
          read every message and reply when a response is needed.
        </p>
      </div>

      {/* How the form works — stated plainly, no fake functionality. */}
      <div className="card mt-8 p-4 text-sm text-slate-300">
        {contactEmail ? (
          <p>
            Prefer email? Write to us directly at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-brand-300 underline underline-offset-2 hover:text-brand-200"
            >
              {contactEmail}
            </a>
            . The form below sends to the same inbox.
          </p>
        ) : (
          <p>
            The form below opens in your own email client with the message pre-filled, so nothing is lost.
            For content fixes and quick ideas, the{" "}
            <Link
              href="/feedback"
              className="text-brand-300 underline underline-offset-2 hover:text-brand-200"
            >
              feedback page
            </Link>{" "}
            is often faster.
          </p>
        )}
      </div>

      <div className="mt-6">
        <ContactForm />
      </div>

      {/* AD SLOT (future): an optional horizontal unit may sit here, below the form.
          Keep it out of the reading/interaction flow and preserve CLS = 0. */}

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        <Link href="/feedback" className="card card-hover p-4 text-sm">
          <span className="font-semibold text-slate-100">💬 Quick feedback</span>
          <span className="mt-1 block text-slate-400">Report a typo or content fix</span>
        </Link>
        <Link href="/about" className="card card-hover p-4 text-sm">
          <span className="font-semibold text-slate-100">🧭 About us</span>
          <span className="mt-1 block text-slate-400">Who builds FIG and why</span>
        </Link>
        <Link href="/donate" className="card card-hover p-4 text-sm">
          <span className="font-semibold text-slate-100">❤️ Support</span>
          <span className="mt-1 block text-slate-400">Help keep FIG free</span>
        </Link>
      </div>
    </div>
  );
}
