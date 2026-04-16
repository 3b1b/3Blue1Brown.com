import type { Route } from ".react-router/types/app/pages/+types/NotFound";
import { redirect } from "react-router";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { H1 } from "~/components/Heading";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import PiCreature from "~/components/PiCreature";
import StrokeType from "~/components/StrokeType";

// redirects
const redirects: Record<string, string> = {
  "/faq": "/about#faqs",
  "/faqs": "/about#faqs",
  "/contact": "/about#contact",
  "/blog": "/extras#blog",
  "/podcast": "/extras#podcast",
  "/home": "/",
  "/lessons": "/",
  "/lessons/": "/",
  "/video": "/",
  "/live": "/",
  "/store": "https://store.dftba.com/collections/3blue1brown",
  "/plushie": "/store",
  "/thanks": "/about#thanks",
  "/recommendations": "/blog/recommendations",
  "/some1-results": "/blog/some1-results",
  "/poems": "/blog/poems",
  "/videos": "https://www.youtube.com/3blue1brown",
  "/support": "https://www.patreon.com/3blue1brown",
  "/early-attention": "https://www.patreon.com/3blue1brown",
  "/subscribe": "https://www.youtube.com/c/3blue1brown?sub_confirmation=1",
  "/brilliant": "https://brilliant.org/3b1b",
  "/quaternion-explorable": "https://eater.net/quaternions",
  "/mail": "https://3blue1brown.substack.com/",
  "/some": "https://some.3b1b.co",
  "/some1": "https://some.3b1b.co",
  "/recommended": "/?topic=best-of",
  "/eola": "/?topic=linear-algebra",
  "/neural-networks": "/?topic=neural-networks",
  "/nn": "/?topic=neural-networks",
  "/calculus": "/?topic=calculus",
  "/eoc": "/?topic=calculus",
};

export const clientLoader = async ({ request }: Route.LoaderArgs) => {
  const { pathname } = new URL(request.url);

  const dest = redirects[pathname];
  if (dest) throw redirect(dest);

  // topic paths like /topics/linear-algebra
  const topic = pathname.match(/^\/topics\/(.+)$/)?.[1];
  if (topic) throw redirect(`/?topic=${topic}`);
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
