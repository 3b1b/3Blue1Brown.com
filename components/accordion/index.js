import { useState } from "react";
import Markdownify from "../Markdownify";
import styles from "./index.module.scss";

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.accordion}>
      <button className={styles.title} onClick={() => setOpen(!open)}>
        <i className={open ? "fas fa-angle-up" : "fas fa-angle-down"} />
        {title}
      </button>
      {open && (
        <div className={styles.reveal}>
          <Markdownify>{children}</Markdownify>
        </div>
      )}
    </div>
  );
};

export default Accordion;
