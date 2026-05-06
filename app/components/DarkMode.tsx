import { useEffect } from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useEventListener } from "@reactuses/core";
import { getDefaultStore, useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { debounce } from "lodash-es";
import { event as analyticsEvent } from "~/components/Analytics";
import Button from "~/components/Button";

const darkModeAtom = atomWithStorage("dark-mode", false);

// trigger analytics event when dark mode changes
const store = getDefaultStore();
store.sub(
  darkModeAtom,
  debounce(() => {
    analyticsEvent("dark_mode", { value: store.get(darkModeAtom) });
  }, 1000),
);

export const useDarkMode = () => useAtomValue(darkModeAtom);

// dark/light mode toggle
export default function DarkMode({ className = "" }) {
  // state
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  // update flag on document
  useEffect(() => {
    const root = document.documentElement;
    root.classList[darkMode ? "add" : "remove"]("dark");
    root.classList[darkMode ? "remove" : "add"]("light");
  }, [darkMode]);

  // for debugging
  useEventListener("keydown", ({ key, ctrlKey, altKey, shiftKey, metaKey }) => {
    if (!import.meta.env.DEV) return;
    if (key.toLowerCase() === "d" && (ctrlKey || altKey || shiftKey || metaKey))
      setDarkMode((darkMode) => !darkMode);
  });

  return (
    <Button
      onClick={() => setDarkMode(!darkMode)}
      size="sm"
      role="switch"
      aria-checked={!!darkMode}
      aria-label="Toggle dark mode"
      className={className}
    >
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}

// script to set dark mode immediately to prevent FOUC
export const load = `
  const dark = localStorage.getItem("dark-mode") === "true";
  const root = document.documentElement;
  root.classList[dark ? "add" : "remove"]("dark");
`;
