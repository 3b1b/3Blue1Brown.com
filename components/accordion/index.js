import { useState } from "react";
import styles from "./index.module.scss";

const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.accordion}>
      <button className={styles.title} onClick={() => setOpen(!open)}>
        <i className={open ? "fas fa-angle-down" : "fas fa-angle-up"} />
        {title}
      </button>
      {open && <div className={styles.reveal}>{children}</div>}
    </div>
  );
};

export default Accordion;
