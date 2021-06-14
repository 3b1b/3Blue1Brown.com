import { useEffect } from "react";
import { glowElement } from "../../util/animation";
import { toDashCase } from "../../util/string";
import styles from "./index.module.scss";

// function to make heading components based on level
const Heading =
  (level) =>
  ({ children }) => {
    const id = toDashCase(children);
    const Tag = "h" + level;
    return (
      <Tag id={id} className={styles[Tag]}>
        {children}
        <a className={styles.anchor} href={`#${id}`}>
          <i className="fas fa-link" />
        </a>
      </Tag>
    );
  };

export const H1 = Heading(1);
export const H2 = Heading(2);
export const H3 = Heading(3);
export const H4 = Heading(4);
