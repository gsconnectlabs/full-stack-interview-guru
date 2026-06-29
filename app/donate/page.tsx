import type { Metadata } from "next";
import Link from "next/link";
import QRCode from "qrcode";
import { donateOptions, hasDonateOptions, proPerks, upiId, upiPayUri } from "@/lib/site";
import UpiQrCard from "@/components/UpiQrCard";

export const metadata: Metadata = {
  title: "Support the Guru — Keep it free for everyone",
  description:
    "Full Stack Interview Guru is free, login-free and ad-light. If it helped you land an interview, a small tip keeps it that way and funds new content.",
};

const WHY = [
  { icon: "🆓", title: "Free for everyone", blurb: "No paywall on the core content — students and switchers included." },
  { icon: "🧘", title: "Ad-light & calm", blurb: "Your support means fewer ads and zero dark patterns." },
  { icon: "✍️", title: "More content, faster", blurb: "Funds the time to research and write new questions." },
];

export default async function DonatePage() {
  // Generate the UPI QR from the UPI id at build time — a crisp vector, no image file needed.
  const qrSvg = upiId
    ? await QRCode.toString(upiPayUri(), {
        type: "svg",
        errorCorrectionLevel: "M",
        margin: 2,
        color: { dark: "#0a0b14", light: "#ffffff" },
      })
    : "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="chip mx-auto">❤️ Support</span>
        <h1 className="mt-4 text-3xl font-black text-white sm:text-4xl">Keep the Guru free for everyone</h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-400">
          This site has no login, no newsletter traps, and barely any ads — on purpose. If it helped you walk
          into an interview with confidence, a small tip keeps it alive and funds new content. Totally optional.
        </p>
      </div>

      {/* Why */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {WHY.map((w) => (
          <div key={w.title} className="card p-5">
            <span className="text-2xl">{w.icon}</span>
            <h3 className="mt-2 font-bold text-slate-100">{w.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{w.blurb}</p>
          </div>
        ))}
      </div>

      {/* Donate options */}
      <h2 className="mt-14 text-2xl font-bold text-white">Ways to chip in</h2>

      {/* UPI QR — the quickest way to support from India */}
      <div className="mt-5">
        <UpiQrCard upiId={upiId} qrSvg={qrSvg} />
      </div>

      {hasDonateOptions && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {donateOptions.map((d) => (
            <a
              key={d.id}
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`card card-hover group flex items-center gap-4 bg-gradient-to-br ${d.accent} p-5`}
            >
              <span className="text-3xl">{d.icon}</span>
              <span className="min-w-0">
                <span className="block font-bold text-white group-hover:text-brand-100">{d.label}</span>
                <span className="block text-xs text-slate-300">{d.note}</span>
              </span>
              <span className="ml-auto text-slate-400 transition-transform group-hover:translate-x-0.5">→</span>
            </a>
          ))}
        </div>
      )}

      <p className="mt-5 text-center text-sm text-slate-500 sm:text-left">
        Prefer another method? More options (Buy Me a Coffee, Ko-fi, PayPal) can be added too — or just{" "}
        <Link href="/feedback" className="text-brand-300 underline">
          share feedback
        </Link>{" "}
        and tell a friend.
      </p>

      {/* Phase 2 Pro teaser */}
      <section className="mt-16">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold text-white">Coming in Phase 2: Guru Pro</h2>
          <span className="chip border-brand-500/40 text-brand-200">Planned</span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          The core stays free forever. Your support helps build an optional Pro tier for power users:
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {proPerks.map((p) => (
            <div key={p.title} className="card relative overflow-hidden p-5">
              <span className="absolute right-3 top-3 rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Soon
              </span>
              <span className="text-2xl">{p.icon}</span>
              <h3 className="mt-2 font-bold text-slate-100">{p.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{p.blurb}</p>
            </div>
          ))}
        </div>
        <div className="card mt-6 flex flex-col items-center justify-between gap-3 p-5 sm:flex-row">
          <p className="text-sm text-slate-300">Want a say in what Pro includes? Tell us what you&apos;d pay for.</p>
          <Link href="/feedback?context=Guru%20Pro%20wishlist" className="btn-primary">
            Shape Guru Pro →
          </Link>
        </div>
      </section>

      <p className="mt-12 text-center text-xs text-slate-600">
        Donations are voluntary and non-refundable. They don&apos;t unlock content today — the whole site is
        already free.
      </p>
    </div>
  );
}
