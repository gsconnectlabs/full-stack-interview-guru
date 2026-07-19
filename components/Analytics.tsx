import Script from "next/script";
import { adsenseClientId } from "@/lib/site";

/**
 * Google Analytics (GA4) + AdSense loader.
 * GA activates when NEXT_PUBLIC_GA_ID is set. AdSense loads on every page using the
 * publisher id from lib/site (env NEXT_PUBLIC_ADSENSE_ID, defaulting to the prod account).
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const adsenseId = adsenseClientId;

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

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
