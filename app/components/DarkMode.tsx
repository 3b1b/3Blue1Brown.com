import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { useLocalStorage } from "@reactuses/core";
import { useEffect } from "react";

export default function DarkMode({ className = "" }) {
  const [darkMode, setDarkMode] = useLocalStorage("dark-mode", false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList[darkMode ? "add" : "remove"]("dark");
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      role="switch"
      aria-checked={!!darkMode}
      aria-label="Toggle dark mode"
      className={className}
    >
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
