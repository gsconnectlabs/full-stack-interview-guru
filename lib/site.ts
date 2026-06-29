/**
 * Central, env-driven site config. All values are NEXT_PUBLIC_* so they inline at
 * build time and are safe to read from client components. Nothing here is a secret —
 * donation links and a form endpoint are public by nature.
 */

export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
export const feedbackEndpoint = process.env.NEXT_PUBLIC_FEEDBACK_ENDPOINT || "";
export const upiId = process.env.NEXT_PUBLIC_UPI_ID || "mgurusankar21@pingpay";

/** Standard UPI deep link / QR payload. Payee id left raw (as UPI QRs expect); name encoded. */
export function upiPayUri(id: string = upiId, payee = "Full Stack Interview Guru"): string {
  if (!id) return "";
  return `upi://pay?pa=${id}&pn=${encodeURIComponent(payee)}&cu=INR`;
}

export interface DonateOption {
  id: string;
  label: string;
  icon: string;
  href: string;
  note: string;
  accent: string;
}

const raw = {
  bmc: process.env.NEXT_PUBLIC_BMC_URL || "",
  kofi: process.env.NEXT_PUBLIC_KOFI_URL || "",
  github: process.env.NEXT_PUBLIC_GITHUB_SPONSORS || "",
  paypal: process.env.NEXT_PUBLIC_PAYPAL_URL || "",
  upi: process.env.NEXT_PUBLIC_UPI_ID || "",
};

/** Build the list of donation options that are actually configured. */
export const donateOptions: DonateOption[] = [
  raw.bmc && {
    id: "bmc",
    label: "Buy Me a Coffee",
    icon: "☕",
    href: raw.bmc,
    note: "One-off support, no account needed",
    accent: "from-amber-500/20 to-yellow-500/10",
  },
  raw.kofi && {
    id: "kofi",
    label: "Ko-fi",
    icon: "🧋",
    href: raw.kofi,
    note: "Tip once or monthly",
    accent: "from-sky-500/20 to-blue-500/10",
  },
  raw.github && {
    id: "github",
    label: "GitHub Sponsors",
    icon: "💙",
    href: raw.github,
    note: "Recurring support for ongoing work",
    accent: "from-violet-500/20 to-fuchsia-500/10",
  },
  raw.paypal && {
    id: "paypal",
    label: "PayPal",
    icon: "🅿️",
    href: raw.paypal,
    note: "International cards welcome",
    accent: "from-blue-500/20 to-indigo-500/10",
  },
  raw.upi && {
    id: "upi",
    label: "UPI",
    icon: "📲",
    href: `upi://pay?pa=${encodeURIComponent(raw.upi)}&pn=Interview%20Guru&cu=INR`,
    note: `Scan or pay to ${raw.upi}`,
    accent: "from-emerald-500/20 to-teal-500/10",
  },
].filter(Boolean) as DonateOption[];

export const hasDonateOptions = donateOptions.length > 0;

/** Future Pro perks (Phase 2) — teaser only, intentionally not implemented. */
export const proPerks: { icon: string; title: string; blurb: string }[] = [
  { icon: "🔖", title: "Bookmarks & Progress", blurb: "Save questions and track what you've mastered." },
  { icon: "📄", title: "PDF Export", blurb: "Download topic packs for offline, night-before cramming." },
  { icon: "🎤", title: "Mock Interviews", blurb: "Timed, scored practice rounds with model answers." },
  { icon: "🤖", title: "AI Interviewer", blurb: "Adaptive follow-ups that probe like a real panel." },
  { icon: "📝", title: "Resume Analyzer", blurb: "Match your resume to a role and surface gaps." },
  { icon: "🗣️", title: "Voice Interview", blurb: "Practice speaking answers out loud, hands-free." },
];
