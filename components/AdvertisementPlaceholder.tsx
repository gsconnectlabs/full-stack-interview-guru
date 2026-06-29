/**
 * Non-intrusive sponsor slot shown beneath Featured Products. Reusable and inline —
 * never a popup. Later replaced by Google AdSense or a sponsored banner.
 */
export default function AdvertisementPlaceholder() {
  return (
    <aside
      aria-label="Advertisement"
      className="card flex flex-col items-center gap-4 border-dashed p-6 text-center sm:flex-row sm:justify-between sm:text-left"
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Advertisement</p>
        <p className="mt-1.5 max-w-xl text-sm text-slate-300">
          This space is available for trainers, academies, books, tools, and technology partners.
        </p>
      </div>
      <a
        href="mailto:guru@gsconnectlabs.com?subject=Advertise%20with%20Full%20Stack%20Interview%20Guru"
        className="btn-secondary shrink-0"
      >
        📣 Advertise With Us
      </a>
    </aside>
  );
}
