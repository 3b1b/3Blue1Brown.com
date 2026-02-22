import { QuotesIcon } from "@phosphor-icons/react";
import Alert from "~/components/Alert";
import Link from "~/components/Link";
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
    <section>
      <h2>Partners</h2>

      <div className="grid grid-cols-2 gap-8 max-md:grid-cols-1">
        {order.map((id) => {
          const partner = getPartner(id);
          if (!partner) return null;
          const {
            name = "",
            tagline = "",
            quote = "",
            color = "",
          } = partner.frontmatter;
          return (
            <Link
              key={id}
              to={`/talent/${id}`}
              className="group card relative isolate items-stretch p-8"
            >
              <div
                className="absolute inset-0 -z-10 border-l-2"
                style={{
                  borderColor: `oklch(55% 0.15 ${color} )`,
                  backgroundColor: `oklch(55% 0.15 ${color} / 0.1)`,
                }}
              />
              <div className="grid grid-cols-[auto_1fr] items-center gap-12 p-4 transition group-hocus:opacity-0 max-lg:grid-cols-1 max-lg:justify-items-center">
                <img src={getLogo(id)?.default} alt="" className="size-40" />
                <div className="flex flex-col gap-4 text-left font-sans max-lg:items-center">
                  <div className="text-xl font-bold">{name}</div>
                  <div className="text-lg">{tagline}</div>
                </div>
              </div>
              <div className="absolute inset-0 col-span-full grid place-items-center p-4 italic opacity-0 transition group-hocus:opacity-100">
                <p className="text-center text-balance">
                  <QuotesIcon className="absolute top-4 left-4 icon rotate-180 text-2xl opacity-25" />
                  {quote}
                  <QuotesIcon className="absolute right-4 bottom-4 icon text-2xl opacity-25" />
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      <Alert className="self-center">
        The organizations we partner with are selectively chosen and carefully
        vetted, but we still encourage you to research them yourself before
        applying.
      </Alert>
    </section>
  );
}
