import { useState, useEffect } from "react";
import Clickable from "../Clickable";
import styles from "./index.module.scss";

// floating button that jumps scroll to top
const Jump = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Clickable
      className={styles.jump}
      style={{ opacity: show ? 1 : 0, pointerEvents: show ? "" : "none" }}
      icon="fas fa-angle-up"
      design="rounded"
      tooltip="Jump to top"
      onClick={jumpToTop}
    />
  );
};

const jumpToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export default Jump;
