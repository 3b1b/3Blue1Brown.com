import DarkMode from "~/components/DarkMode";

export default function Footer() {
  return (
    <footer className="dark z-20 flex items-center justify-between gap-8 bg-white p-8 font-sans text-black max-md:grid-cols-[auto_auto]">
      <DarkMode />
      <span>&copy; 2026 Grant Sanderson</span>
      <div className="size-10 max-md:hidden" />
    </footer>
  );
}
