import { useState, useEffect } from "react";
import Clickable from "../Clickable";
import sitePatrons from "../../data/patrons.yaml";
import nameOverrides from "../../data/patron-name-overrides.yaml";
import { shuffle } from "../../util/math";
import styles from "./index.module.scss";

const Patrons = ({ active, pagePatrons = [] }) => {
  const [open, setOpen] = useState(false);
  const [shuffledPagePatrons, setShuffledPagePatrons] = useState(pagePatrons);

  // shuffle to not favor alphabetical
  useEffect(() => {
    setShuffledPagePatrons(shuffle(pagePatrons.filter((patron) => patron)));
  }, [pagePatrons]);

  let patrons;
  // page specific patrons
  if (shuffledPagePatrons.length) patrons = shuffledPagePatrons;
  // site-wide patrons
  else
    patrons =
      // filter by amount, active status, and top 1000 for css grid limits
      sitePatrons
        .filter((patron) => patron.amount >= 16)
        .filter((patron) => patron.active === active)
        .map((patron) => patron.name)
        .map((patron) => nameOverrides[patron] || patron)
        .filter((patron) => patron)
        .slice(0, 1000);

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
