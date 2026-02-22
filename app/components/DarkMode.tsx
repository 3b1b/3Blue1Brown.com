import { useEffect } from "react";
import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useLocalStorage } from "@reactuses/core";
import Button from "~/components/Button";

export default function DarkMode({ className = "" }) {
  const [darkMode, setDarkMode] = useLocalStorage("dark-mode", false);

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

// set dark mode immediately to prevent FOUC
export const load = `
  const dark = localStorage.getItem("dark-mode") === "true";
  const root = document.documentElement;
  root.classList[dark ? "add" : "remove"]("dark");
`;
