import { useEffect } from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useEventListener } from "@reactuses/core";
import { useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { event as analyticsEvent } from "~/components/Analytics";
import Button from "~/components/Button";

const darkModeAtom = atomWithStorage("dark-mode", false);

export const useDarkMode = () => useAtomValue(darkModeAtom);

// dark/light mode toggle
export default function DarkMode({ className = "" }) {
  // state
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  // update flag on document
  useEffect(() => {
    document.documentElement.classList[darkMode ? "add" : "remove"]("dark");
  }, [darkMode]);

  // keyboard shortcut
  useEventListener("keydown", ({ key }) => {
    if (key.toLowerCase() === "d" && document.activeElement === document.body)
      setDarkMode(!darkMode);
  });

  return (
    <Button
      onClick={() => {
        setDarkMode(!darkMode);
        // track analytics event
        analyticsEvent("dark_mode", { value: !darkMode });
      }}
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
