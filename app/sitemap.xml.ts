import { Readable } from "stream";
import type { Route } from "./+types/sitemap.xml";
import { SitemapStream, streamToPromise } from "sitemap";

// generate sitemap.xml from prerendered routes
export const loader = async ({ request }: Route.LoaderArgs) => {
  const { prerender } = await import("virtual:react-router/server-build");
  const { origin } = new URL(request.url);
  const stream = new SitemapStream({ hostname: origin });
  const locations = prerender.map((path) => ({ url: path }));
  const sitemap = await (
    await streamToPromise(Readable.from(locations).pipe(stream))
  ).toString();
  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
};
