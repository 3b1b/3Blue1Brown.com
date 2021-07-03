import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Markdownify from "../Markdownify";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

/*
  Surprisingly, the preserveInnerState prop is actually mission-critical. As of
  the time of writing (git blame to see when), it is used on the contact page
  to make sure that the contact forms are included in the static page HTML,
  which is necessary for Netlify to find them at build time.
*/

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  preserveInnerState: PropTypes.bool,
  id: PropTypes.string,
};

// expandable/collapsible section, like <details>
export default function Accordion({
  title,
  children,
  preserveInnerState = false,
  id,
}) {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const ref = useRef();

  useEffect(() => {
    // Once on mount, check if url #hash matches id, and if so, open
    if (id && router.asPath.split("#")[1] === id) {
      setOpen(true);
    }
  }, []);

  const toggleOpen = () => {
    if (open) {
      setOpen(false);
      if (id && router.asPath.split("#")[1] !== undefined) {
        router.replace(router.asPath.split("#")[0]);
      }
    } else {
      setOpen(true);
      if (id) {
        ref.current.removeAttribute("id");
        router.replace(`#${id}`);
        setTimeout(() => {
          ref.current.id = id;
        }, 1);
      }
    }
  };

  if (!title && !children) return null;

  return (
    <div className={styles.accordion} id={id} ref={ref}>
      {title && (
        <button className={styles.title} onClick={toggleOpen}>
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
}
