import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import { gaId, adsenseClientId } from "@/lib/site";

/**
 * Google Analytics (GA4) + AdSense loader.
 * GA uses the official @next/third-parties integration (<GoogleAnalytics>), which loads
 * gtag.js once and tracks App Router route changes as page_views — it activates only when
 * NEXT_PUBLIC_GA_ID is set (gaId from lib/site; no committed default, see DECISIONS #031).
 * GA4 anonymizes IP by default, so no explicit flag is needed. AdSense is unchanged: it loads
 * on every page from adsenseClientId (env NEXT_PUBLIC_ADSENSE_ID, defaulting to the prod account).
 */
export default function Analytics() {
  const adsenseId = adsenseClientId;

  return (
    <>
      {gaId && <GoogleAnalytics gaId={gaId} />}

      {adsenseId && (
        <Script
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
