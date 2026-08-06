import { useEffect, useState } from "react";
import { H2 } from "~/components/Heading";
import { seededShuffle } from "~/util/math";
import PartnerRow from "./PartnerRow";

const partners: [string, ...string[]] = [
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

  useEffect(
    () =>
      // eslint-disable-next-line -- https://github.com/facebook/react/issues/34045#issuecomment-3801067128
      setOrder((order) => {
        const [first, ...rest] = order;
        return [
          // always keep first first
          first,
          // shuffle rest every so often
          ...seededShuffle(rest, Math.floor(Date.now() / (1000 * 60 * 60))),
        ];
      }),
    [],
  );

  return (
    <section className="width-lg">
      <H2>Partners</H2>

      <div className="flex w-full flex-col divide-y divide-current/10">
        {order.map((id) => (
          <div key={id} className="py-10 first:pt-0 last:pb-0">
            <PartnerRow id={id} />
          </div>
        ))}
      </div>
    </section>
  );
}
