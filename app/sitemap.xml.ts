import { Readable } from "stream";
import { SitemapStream, streamToPromise } from "sitemap";
import site from "~/data/site.json";

// generate sitemap.xml from prerendered routes
export const loader = async () => {
  const { prerender } = await import("virtual:react-router/server-build");
  const stream = new SitemapStream({ hostname: site.url });
  const locations = prerender.map((path) => ({ url: path }));
  const sitemap = await (
    await streamToPromise(Readable.from(locations).pipe(stream))
  ).toString();
  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" },
  });
};
