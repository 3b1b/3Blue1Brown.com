import Hilbert from "~/components/Hilbert";

export default function Footer() {
  return (
    <footer
      className="
        dark flex min-h-50 items-end justify-center font-sans
        max-md:p-6
      "
    >
      <Hilbert />
      &copy; 2026 Grant Sanderson
    </footer>
  );
}
