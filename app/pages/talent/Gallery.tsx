import { Fragment, useEffect, useState } from "react";
import { H2 } from "~/components/Heading";
import { seededShuffle } from "~/util/math";
import PartnerTile from "./PartnerTile";

// TEMP: shuffle disabled for a promo screen recording, flip back to true after
const shuffleEnabled = false;

const partners: [string, ...string[]] = [
  "janestreet",
  "oklo",
  "0xPARC",
  "doppel",
  "matx",
  "exa",
  "beam",
];

// gallery of partners
export default function Gallery() {
  const [order, setOrder] = useState(partners);

  useEffect(() => {
    if (!shuffleEnabled) return;
    // eslint-disable-next-line -- https://github.com/facebook/react/issues/34045#issuecomment-3801067128
    setOrder((order) => {
      const [first, ...rest] = order;
      return [
        // always keep first first
        first,
        // shuffle rest every so often
        ...seededShuffle(rest, Math.floor(Date.now() / (1000 * 60 * 60))),
      ];
    });
  }, []);

  return (
    <section className="width-lg">
      <H2>Partners</H2>

      {order.map((id, index) => (
        <Fragment key={index}>
          <PartnerTile id={id} />
          {index < order.length - 1 && <hr />}
        </Fragment>
      ))}
    </section>
  );
}
