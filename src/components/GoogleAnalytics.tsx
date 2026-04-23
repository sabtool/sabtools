"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const GA_MEASUREMENT_ID = "G-WWFV24G99D";
const GTM_ID = "GTM-5KPJ4LPT";
const STORAGE_KEY = "sabtools_cookie_consent";

/**
 * Google Analytics + Tag Manager, gated behind cookie consent.
 *
 * - On mount, reads stored consent from localStorage. If the user has
 *   previously accepted "all", scripts load via next/script with
 *   strategy="lazyOnload" so they never touch the critical path.
 * - While consent is pending or set to "essential", no analytics script is
 *   injected at all — this matches India's DPDP Act expectations and also
 *   improves INP by keeping the main thread free on first load.
 * - Listens for a "sabtools:consent" CustomEvent so that when the user
 *   clicks Accept All, analytics start immediately without a page reload.
 */
export default function GoogleAnalytics() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return setConsentGranted(false);
        const parsed = JSON.parse(raw);
        setConsentGranted(parsed?.consent === "all");
      } catch {
        setConsentGranted(false);
      }
    };

    check();

    const onConsent = (e: Event) => {
      const detail = (e as CustomEvent<{ consent: "all" | "essential" }>).detail;
      setConsentGranted(detail?.consent === "all");
    };

    window.addEventListener("sabtools:consent", onConsent);
    return () => window.removeEventListener("sabtools:consent", onConsent);
  }, []);

  if (!consentGranted) return null;

  return (
    <>
      {/* Google Tag Manager — lazyOnload keeps it off the critical path */}
      <Script id="google-tag-manager" strategy="lazyOnload">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>

      {/* Google Analytics — lazyOnload */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_title: document.title,
            send_page_view: true,
          });
        `}
      </Script>
    </>
  );
}
