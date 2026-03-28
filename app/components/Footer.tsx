import DarkMode from "~/components/DarkMode";

export default function Footer() {
  return (
    <footer className="dark z-20 flex items-center justify-center gap-8 bg-white px-8 py-12 font-sans text-black max-md:gap-4 max-md:p-6">
      <DarkMode />
      <span>&copy; 2026 Grant Sanderson</span>
    </footer>
  );
}
