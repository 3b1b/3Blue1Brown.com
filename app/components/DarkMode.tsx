import { useEffect } from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import Button from "~/components/Button";

const darkModeAtom = atomWithStorage("dark-mode", false);

// dark/light mode toggle
export default function DarkMode({ className = "" }) {
  // state
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  // update flag on document
  useEffect(() => {
    const root = document.documentElement;
    root.classList[darkMode ? "add" : "remove"]("dark");
  }, [darkMode]);

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
