import { useEffect, useState } from "react";
import { href } from "react-router";
import { H2 } from "~/components/Heading";
import Link from "~/components/Link";
import { seededShuffle } from "~/util/math";
import { getLogo, getPartner } from "./Partner";

const partners = [
  "janestreet",
  "cognition",
  "doppel",
  "metr",
  "kiso",
  "shopify",
  "transluce",
  "0xPARC",
  "beam",
];

// gallery of partners
export default function Partners() {
  const [order, setOrder] = useState(partners);

  // randomize on client
  useEffect(
    () =>
      // https://github.com/facebook/react/issues/34045#issuecomment-3801067128
      // eslint-disable-next-line
      setOrder((order) => {
        // always keep first first
        let [first, ...rest] = order;
        // shuffle rest every so often
        rest = seededShuffle(rest!, Math.floor(Date.now() / (1000 * 60 * 60)));
        return [first!, ...rest];
      }),
    [],
  );

  return (
    <section className="width-lg">
      <H2>Partners</H2>

      <div className="mx-auto grid max-w-4xl grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {order.map((id) => {
          const partner = getPartner(id);
          if (!partner) return null;
          const { name = "", tagline = "" } = partner.frontmatter;
          const logo = getLogo(id) ?? "";
          return (
            <Link
              key={id}
              to={href("/talent/:id", { id })}
              arrow={false}
              className="group flex flex-col items-center gap-2 rounded-md p-4 text-black no-underline hocus:bg-theme/15"
            >
              <img src={logo} alt="" className="h-32 w-full object-contain" />
              <div className="mt-2 font-sans text-2xl font-bold">{name}</div>
              <div className="text-center text-gray opacity-0 transition group-hocus:opacity-100">
                {tagline}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
