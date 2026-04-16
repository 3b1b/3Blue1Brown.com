import { useEffect, useState } from "react";
import { href } from "react-router";
import Card from "~/components/Card";
import { useDarkMode } from "~/components/DarkMode";
import { H2 } from "~/components/Heading";
import { seededShuffle } from "~/util/math";
import { getLogo, getLogoDark, getPartner } from "./Partner";

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

  const darkMode = useDarkMode();

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

      <div className="grid grid-cols-3 gap-12 self-center max-lg:grid-cols-2 max-sm:grid-cols-1">
        {order.map((id) => {
          const partner = getPartner(id);
          if (!partner) return null;
          const { name = "", tagline = "" } = partner.frontmatter;
          const logo = getLogo(id) ?? "";
          const logoDark = getLogoDark(id) ?? "";
          return (
            <Card key={id} to={href("/talent/:id", { id })}>
              <div className="aspect-square max-h-32">
                <img
                  src={darkMode ? logoDark || logo : logo}
                  alt=""
                  className="size-full object-contain"
                />
              </div>
              <div className="mt-4 font-sans text-2xl font-medium">{name}</div>
              <div className="text-center text-balance text-gray">
                {tagline}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
