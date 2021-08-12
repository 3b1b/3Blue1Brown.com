import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Clickable from "../Clickable";
import sitePatrons from "../../data/patrons.yaml";
import nameOverrides from "../../data/patron-name-overrides.yaml";
import { shuffle } from "../../util/math";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";

Patrons.propTypes = {
  active: PropTypes.bool,
};

// component to display expandable/collapsible list of patrons, either site-wide
// or page-specific
export default function Patrons({ active }) {
  const [open, setOpen] = useState(false);
  const { patrons: pagePatrons = [] } = useContext(PageContext);
  const [shuffledPagePatrons, setShuffledPagePatrons] = useState(pagePatrons);

  // shuffle to not favor alphabetical
  useEffect(() => {
    setShuffledPagePatrons(shuffle(pagePatrons.filter((patron) => patron)));
  }, [pagePatrons]);

  let patrons;
  if (shuffledPagePatrons.length) {
    // page specific patrons
    patrons = shuffledPagePatrons;
  } else {
    // site-wide patrons
    patrons =
      // filter by active status, and top 1000 for css grid limits
      sitePatrons
        .filter((patron) => patron.active === active)
        .map((patron) => patron.name)
        .map((patron) => nameOverrides[patron] || patron)
        .filter((patron) => patron)
        .slice(0, 1000);
  }

  if (!patrons.length) return null;

  return (
    <>
      <div className={styles.patrons} data-open={open}>
        {patrons.map((patron, index) => (
          <span key={index}>{patron}</span>
        ))}
      </div>
      <Clickable
        text={open ? "Show Less" : "Show More"}
        icon={open ? "fas fa-angle-up" : "fas fa-angle-down"}
        onClick={() => setOpen(!open)}
      />
    </>
  );
}
