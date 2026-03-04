import type { Route } from "./+types/NotFound";
import { redirect } from "react-router";
import { H1 } from "~/components/Heading";
import Meta from "~/components/Meta";
import PiCreature from "~/components/PiCreature";
import StrokeType from "~/components/StrokeType";

// redirects
export const clientLoader = async ({ request }: Route.LoaderArgs) => {
  const { pathname } = new URL(request.url);

  // old links
  if (pathname === "/faqs") throw redirect("/about");
  if (pathname === "/blog") throw redirect("/extras#blog");
  if (pathname === "/podcast") throw redirect("/extras#podcast");
  if (pathname === "/contact") throw redirect("/about#contact");
  if (pathname === "/support") throw redirect("/about#contact");

  // lessons, topics
  if (pathname === "/lessons") throw redirect("/");
  const topic = pathname.match(new RegExp(`/topics/(.+)$`))?.[1];
  if (topic) throw redirect(`/?topic=${topic}`);
};

export default function NotFound() {
  return (
    <>
      <Meta title="Not Found" />

      <section className="bg-theme/10">
        <H1>
          <StrokeType>Not Found</StrokeType>
        </H1>

        <PiCreature emotion="sad" />

        <p className="max-w-100 self-center">
          The page you are looking for does not exist or may have moved.
        </p>
      </section>
    </>
  );
}
