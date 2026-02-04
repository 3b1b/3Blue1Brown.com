import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { getDefaultStore, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// dark mode state
export const darkModeAtom = atomWithStorage("darkMode", false);

// update root element data attribute that switches css color vars
export const update = () => {
  if (getDefaultStore().get(darkModeAtom))
    document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
};

// when dark mode state changes
getDefaultStore().sub(darkModeAtom, update);
// using useEffect in toggle component causes FOUC b/c have to wait for render

export default function DarkMode() {
  const [darkMode, setDarkMode] = useAtom(darkModeAtom);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      role="switch"
      aria-checked={darkMode}
      aria-label="Toggle dark mode"
    >
      {darkMode ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
