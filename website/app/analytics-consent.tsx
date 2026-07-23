"use client";

import { useEffect, useState } from "react";

const MEASUREMENT_ID = "G-H3RE8R3V60";
const CONSENT_KEY = "tabshow.analytics-consent";

type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

function initialiseAnalytics() {
  if (window.gtag) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer?.push(args);
  };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  window.gtag("consent", "update", {
    analytics_storage: "granted",
  });
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  script.dataset.tabshowAnalytics = "true";
  document.head.appendChild(script);
}

export function AnalyticsConsent() {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const savedChoice = window.localStorage.getItem(CONSENT_KEY) as ConsentChoice | null;
    if (savedChoice === "granted") initialiseAnalytics();

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setChoice(savedChoice);
      setShowPanel(savedChoice === null);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function saveChoice(nextChoice: ConsentChoice) {
    window.localStorage.setItem(CONSENT_KEY, nextChoice);
    setChoice(nextChoice);
    setShowPanel(false);

    if (nextChoice === "granted") {
      initialiseAnalytics();
    } else {
      window.gtag?.("consent", "update", {
        analytics_storage: "denied",
      });
    }
  }

  return (
    <>
      {showPanel && (
        <aside className="analytics-consent" aria-label="Analytics preferences">
          <div>
            <strong>Help improve TabShow</strong>
            <p>
              Allow privacy-conscious Google Analytics for this website. It never receives
              your Chrome tabs or webpage contents. Read the <a href="/privacy">privacy policy</a>.
            </p>
          </div>
          <div className="analytics-consent-actions">
            <button type="button" onClick={() => saveChoice("denied")}>No thanks</button>
            <button type="button" className="analytics-consent-accept" onClick={() => saveChoice("granted")}>
              Allow analytics
            </button>
          </div>
        </aside>
      )}
      {!showPanel && choice !== null && (
        <button
          type="button"
          className="analytics-settings"
          onClick={() => setShowPanel(true)}
          aria-label="Change analytics preferences"
        >
          Analytics settings
        </button>
      )}
    </>
  );
}
