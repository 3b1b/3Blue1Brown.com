import type { Location, NavigateOptions } from "react-router";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useEventListener } from "@reactuses/core";

// adapter to allow interfacing with react router from outside react
export default function Navigate() {
  // reactive navigator
  const navigate = useNavigate();

  // call useNavigate on useNavigate window event
  useEventListener(
    navigateEvent,
    ({ detail: { to, options } }: NavigateEvent) => navigate(to, options),
  );

  // reactive location
  const location = useLocation();

  // dispatch window useLocation event on location change
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent<Location>(locationEvent, { detail: location }),
    );
  }, [location]);

  return null;
}

// navigate react router from outside react
export const navigate = (to: string, options?: NavigateOptions) =>
  window.dispatchEvent(
    new CustomEvent<Navigate>(navigateEvent, { detail: { to, options } }),
  );

// add location listener from outside react
export const addListen = (func: (event: LocationEvent) => void) =>
  window.addEventListener(locationEvent, func);

// remove location listener from outside react
export const removeListen = (func: (event: LocationEvent) => void) =>
  window.removeEventListener(locationEvent, func);

// custom event names
const navigateEvent = "useNavigate";
const locationEvent = "useLocation";

// custom event types
type Navigate = { to: string; options?: NavigateOptions };
type NavigateEvent = CustomEvent<Navigate>;
type LocationEvent = CustomEvent<Location>;

// define custom events on window
declare global {
  // eslint-disable-next-line
  interface WindowEventMap {
    [locationEvent]: LocationEvent;
    [navigateEvent]: NavigateEvent;
  }
}
