import DarkMode from "~/components/DarkMode";
import { usePrinting } from "~/util/hooks";

export default function Footer() {
  if (usePrinting()) return null;

  return (
    <footer className="dark z-20 flex items-center justify-between gap-8 bg-white p-8 font-sans text-black max-md:grid-cols-[auto_auto] print:hidden">
      <DarkMode />
      <div>&copy; 2026 Grant Sanderson</div>
      <div className="size-10 max-md:hidden" />
    </footer>
  );
}
