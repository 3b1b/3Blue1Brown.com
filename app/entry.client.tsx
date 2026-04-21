import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { event as analyticsEvent } from "~/components/Analytics";

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <HydratedRouter
        onError={(...props) => {
          // track analytics event
          analyticsEvent("hydration_error", {
            url: window.location.href,
            ...props,
          });
        }}
      />
    </StrictMode>,
  );
});
