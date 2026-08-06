import { Fragment, useEffect, useState } from "react";
import clsx from "clsx";
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

      {order.map((id, index) => (
        <Fragment key={index}>
          <PartnerRow
            id={id}
            className={clsx(index % 2 === 1 && "flex-row-reverse")}
          />
          {index < order.length - 1 && <hr />}
        </Fragment>
      ))}
    </section>
  );
}
