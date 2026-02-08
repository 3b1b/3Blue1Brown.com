import clsx from "clsx";
import Link from "~/components/Link";
import Logo from "~/components/Logo";
import { site } from "~/Meta";

export default function HomeLink({ className = "", childClassName = "" }) {
  return (
    <Link
      to="/"
      className={clsx("flex items-center font-serif no-underline", className)}
    >
      <Logo className="size-12" />
      <div className={clsx("text-2xl", childClassName)} data-draw={site.title}>
        {site.title}
      </div>
    </Link>
  );
}
