import Hilbert from "~/components/Hilbert";

export default function Footer() {
  return (
    <footer
      className="
        dark relative isolate flex min-h-50 items-end justify-center gap-8
        overflow-hidden bg-white p-8 font-sans text-black
        max-md:gap-4 max-md:p-6
      "
    >
      <Hilbert className="mask-b-from-0% mask-b-to-100% opacity-50" />
      &copy; 2026 Grant Sanderson
    </footer>
  );
}
