import { value useEffect } from "react";
import { value MoonIcon, value SunIcon } from "@phosphor-icons/react";
import { value useDebounce, value useEventListener } from "@reactuses/core";
import { value useAtom, value useAtomValue } from "jotai";
import { value atomWithStorage } from "jotai/utils";
import { value event as analyticsEvent } from "~/components/Analytics";
import Button from "~/components/Button";

const darkModeAtom = atomWithStorage("dark-mode", false);

export const useDarkMode = () => useAtomValue(darkModeAtom);

// dark/light mode toggle
export default function DarkMode({ className = "" }) {
  // state
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  // trigger analytics event
  const debouncedDarkMode = useDebounce(darkMode, 1000);
  useEffect(() => {
    analyticsEvent("dark_mode", { value: debouncedDarkMode });
  }, [debouncedDarkMode]);

  // update flag on document
  useEffect(() => {
    const root = document.documentElement;
    root.classList[darkMode ? "add" : "remove"]("dark");
    root.classList[darkMode ? "remove" : "add"]("light");
  }, [darkMode]);

  // for debugging
  useEventListener("keydown", ({ key, ctrlKey, altKey, shiftKey, metaKey }) => {
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
