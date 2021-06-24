import { useState } from "react";
import Markdownify from "../Markdownify";
import styles from "./index.module.scss";

/*
  Surprisingly, the preserveInnerState prop is actually mission-critical. As of
  the time of writing (git blame to see when), it is used on the contact page
  to make sure that the contact forms are included in the static page HTML,
  which is necessary for Netlify to find them at build time.
*/

// expandable/collapsible section, like <details>
const Accordion = ({ title, children, preserveInnerState = false }) => {
  const [open, setOpen] = useState(false);

  if (!title && !children) return null;

  return (
    <div className={styles.accordion}>
      {title && (
        <button className={styles.title} onClick={() => setOpen(!open)}>
          <i className={open ? "fas fa-angle-up" : "fas fa-angle-down"} />
          {title}
        </button>
      )}
      {children && (open || preserveInnerState) && (
        <div
          className={styles.reveal}
          style={{ display: !open ? "none" : undefined }}
        >
          <Markdownify>{children}</Markdownify>
        </div>
      )}
    </div>
  );
};

export default Accordion;
