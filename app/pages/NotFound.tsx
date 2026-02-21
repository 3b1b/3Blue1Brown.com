import type { Route } from "./+types/NotFound";
import { redirect } from "react-router";
import Meta from "~/components/Meta";
import StrokeType from "~/components/StrokeType";

// redirects
export const clientLoader = async ({ request }: Route.LoaderArgs) => {
  const { pathname } = new URL(request.url);
  if (pathname === "/faqs") throw redirect("/about");
  if (pathname === "/blog") throw redirect("/extras");
  const topic = pathname.match(new RegExp(`/topics/(.+)$`))?.[1];
  if (topic) throw redirect(`/?topic=${topic}`);
};

export default function NotFound() {
  return (
    <>
      <Meta title="Not Found" />

      <section className="bg-theme/10">
        <h1>
          <StrokeType>Not Found</StrokeType>
        </h1>
        <p className="max-w-100 self-center">
          The page you are looking for does not exist or may have moved.
        </p>
      </section>
    </>
  );
}
