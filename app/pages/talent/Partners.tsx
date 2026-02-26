import Alert from "~/components/Alert";
import Link from "~/components/Link";
import Quote from "~/components/Quote.tsx";
import { getLogo, getPartner } from "./Partner.tsx";

// list partners in specific order
const order = [
  "janestreet",
  "stripe",
  "metr",
  "cognition",
  "0xPARC",
  "patreon",
  "prime_academics",
  "3blue1brown",
];

// gallery of partners
export default function Partners() {
  return (
    <section className="width-lg">
      <h2>Partners</h2>

      <div className="grid max-w-max grid-cols-2 gap-8 self-center max-lg:grid-cols-1">
        {order.map((id) => {
          const partner = getPartner(id);
          if (!partner) return null;
          const { name = "", tagline = "", quote = "" } = partner.frontmatter;
          return (
            <Link key={id} to={`/talent/${id}`} className="group card relative">
              <div className="flex size-full items-center gap-12 p-4 transition group-hocus:opacity-0 max-md:flex-col">
                <img src={getLogo(id)?.default} alt="" className="w-40" />
                <div className="flex flex-col gap-4 text-left font-sans max-md:items-center max-md:text-center">
                  <div className="text-xl font-bold">{name}</div>
                  <div className="text-lg">{tagline}</div>
                </div>
              </div>
              <Quote
                bg={false}
                className="absolute! inset-0 size-full opacity-0 transition group-hocus:opacity-100"
              >
                {quote}
              </Quote>
            </Link>
          );
        })}
      </div>

      <Alert>
        The organizations we partner with are selectively chosen and carefully
        vetted, but we still encourage you to research them yourself before
        applying.
      </Alert>
    </section>
  );
}
