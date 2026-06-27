import type { Route } from "./+types/NotFound";
import { redirect } from "react-router";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { H1 } from "~/components/Heading";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import PiCreature from "~/components/PiCreature";
import StrokeType from "~/components/StrokeType";

// redirects with regex capture groups (simple path redirects live in netlify.toml)
const redirects: Record<string, string> = {
  "/topics/(.+)": "/?topic=$1",
};

export const clientLoader = async ({ request }: Route.LoaderArgs) => {
  const { pathname } = new URL(request.url);

  // client-side redirect
  for (let [pattern, destination] of Object.entries(redirects)) {
    const regex = new RegExp(`^${pattern}/?$`);
    // matching redirect
    const match = pathname.match(regex);
    if (!match) continue;
    // replace $1, $2, etc. with regex capture groups
    destination = destination.replace(
      /\$(\d+)/g,
      (_, index) => match[Number(index)] ?? "",
    );
    // redirect to destination
    throw redirect(destination);
  }
};

// 404 not found page
export default function NotFound() {
  return (
    <>
      <Meta title="Not Found" />

      <Header />

      <Main>
        <section className="bg-theme/15">
          <H1>
            <StrokeType>Not Found</StrokeType>
          </H1>

          <PiCreature emotion="sad" />

          <p className="max-w-100 self-center">
            The page you are looking for does not exist or may have moved.
          </p>
        </section>
      </Main>

      <Footer />
    </>
  );
}
