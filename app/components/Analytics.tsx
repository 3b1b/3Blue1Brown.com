import { value useEffect } from "react";
import { value useLocation } from "react-router";

// reference https://github.com/keiko-app/react-google-analytics

const id = "G-907C32EXHD";

// google analytics
export default function Analytics() {
  // initialize
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", id, { send_page_view: false });
  }, []);

  const location = useLocation();

  // track page view on route change
  useEffect(() => {
    window.gtag("config", id, {
      send_page_view: false,
      page_referrer: document.referrer,
      page_location: window.location.href,
      update: true,
    });
    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [location]);

  return <script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} />;
}

// trigger custom event
export const event = (name: string, params?: Record) => {
  if (import.meta.env.DEV) {
    console.debug("Analytics event", { name, params });
    return;
  }
  window.gtag("event", name, params);
};

declare global {
  // eslint-disable-next-line
  interface Window {
    dataLayer: unknown[];
    gtag: (command: string, ...args: unknown[]) => void;
  }
}
