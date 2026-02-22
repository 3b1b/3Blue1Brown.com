import type { MDXContent } from "mdx/types";
import type { Route } from "./+types/Org";
import Alert from "~/components/Alert";
import Link from "~/components/Link";

type Frontmatter = {
  name?: string;
  tagline?: string;
  quote?: string;
};

type Org = {
  default: MDXContent;
  frontmatter: Frontmatter;
};

// import all orgs
const orgs = import.meta.glob<Org>("./**/*.mdx", { eager: true });

export const loader = ({ params: { orgId } }: Route.LoaderArgs) => {
  // path to mdx source file
  const path = `./${orgId}/index.mdx`;
  const org = orgs[path];
  if (!org) throw new Response("Not found", { status: 404 });
  return { path };
};

// gallery of orgs
export default function Gallery() {
  return (
    <section>
      <h2>Partners</h2>

      <div className="grid grid-cols-2 gap-8 max-sm:grid-cols-1">
        {Object.entries(orgs).map(
          ([
            route,
            {
              frontmatter: { name = "", tagline = "", quote = "" },
            },
          ]) => (
            <Link
              key={route}
              to={`/blog/${route.replace("./", "").replace("/index.mdx", "")}`}
              className="card bg-gray/10 p-4"
            >
              <div className="font-sans font-medium">{name}</div>
              <div>{tagline}</div>
              <div>{quote}</div>
            </Link>
          ),
        )}
      </div>

      <Alert className="max-w-300 self-center">
        The organizations we partner with are selectively chosen and carefully
        vetted. Even so, we encourage you to research them yourself before
        applying.
      </Alert>
    </section>
  );
}
