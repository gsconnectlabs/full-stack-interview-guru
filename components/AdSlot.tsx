/**
 * Google AdSense placeholder. Renders a non-intrusive slot only below articles
 * or in the sidebar — never inside the content body. Swap the inner markup for a
 * real <ins className="adsbygoogle"> unit once an AdSense account is approved.
 */
export default function AdSlot({
  label = "Advertisement",
  variant = "horizontal",
}: {
  label?: string;
  variant?: "horizontal" | "sidebar";
}) {
  const size = variant === "sidebar" ? "min-h-[600px]" : "min-h-[100px]";
  return (
    <div
      className={`card flex ${size} items-center justify-center border-dashed text-center`}
      aria-label="Advertisement placeholder"
      data-ad-slot
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">{label}</p>
        <p className="mt-1 text-[11px] text-slate-700">Google AdSense slot</p>
      </div>
    </div>
  );
}
