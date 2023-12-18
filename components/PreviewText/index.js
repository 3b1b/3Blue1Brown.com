import React, { useState } from "react";
import Markdownify from "../Markdownify";
import Clickable from "../Clickable";
import styles from "./index.module.scss";

export default function PreviewText({ children }) {
  const [open, setOpen] = useState(false);

  if (!children) return null;

  return (
    <>
      <div className={styles.preview} data-open={open}>
        <Markdownify>{children}</Markdownify>
      </div>
      <Clickable
        text={open ? "Show Less" : "Show More"}
        icon={open ? "fas fa-angle-up" : "fas fa-angle-down"}
        onClick={() => setOpen(!open)}
      />
    </>
  );
}
