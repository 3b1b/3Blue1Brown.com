import { useState, useMemo } from "react";
import Clickable from "../Clickable";
import sitePatrons from "../../data/patrons.yaml";
import nameOverrides from "../../data/patron-name-overrides.yaml";
import { shuffle } from "../../util/math";
import styles from "./index.module.scss";

const Patrons = ({ active, pagePatrons }) => {
  const [open, setOpen] = useState(false);

  let patrons;
  // page/lesson-specific patrons
  // shuffle to not favor alphabetical, keep random shuffle order on re-renders
  if (pagePatrons)
    patrons = useMemo(
      () => shuffle(pagePatrons).filter((patron) => patron),
      []
    );
  // site-wide patrons
  // filter by amount, active status, and top 1000 for css grid limits
  else
    patrons = sitePatrons
      .filter((patron) => patron.active === active && patron.amount >= 16)
      .slice(0, 1000)
      .map((patron) => patron.name)
      .map((patron) => nameOverrides[patron] || patron)
      .filter((patron) => patron);

  if (!patrons.length) return <></>;

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
};

export default Patrons;
