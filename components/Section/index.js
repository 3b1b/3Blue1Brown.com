import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

// section wrapper component that spans entire width of screen and colors
// background in alternating white/off-white
Section.propTypes = {
  children: PropTypes.node.isRequired,
  dark: PropTypes.bool,
  width: PropTypes.oneOf(["narrow", "normal", "full"]),
};

// make sure markdown starts and ends with this component, or doesn't use it at
// all. see PageContent component.
const SectionContext = createContext({ width: "normal" });

export default function Section({
  children,
  dark = false,
  width = "normal",
  ...props
}) {
  return (
    <SectionContext.Provider value={{ width }}>
      <section
        {...props}
        className={styles.section}
        data-dark={dark}
        data-width={width}
      >
        <div className={styles.wrapper}>{children}</div>
      </section>
    </SectionContext.Provider>
  );
}

export function useSectionWidth() {
  const { width } = useContext(SectionContext);
  return width;
}
