import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

// section wrapper component that spans entire width of screen and colors
// background in alternating white/off-white
Section.propTypes = {
  children: PropTypes.node.isRequired,
  dark: PropTypes.bool,
  gray: PropTypes.oneOf([50, 100, 200, 300, 400, 500, 600, 700, 800, 900]),
  width: PropTypes.oneOf(["narrow", "normal", "full"]),
};

// make sure markdown starts and ends with this component, or doesn't use it at
// all. see PageContent component.
const SectionContext = createContext({ width: "normal" });

export default function Section({
  children,
  dark = false,
  gray,
  width = "normal",
  ...props
}) {
  return (
    <SectionContext.Provider value={{ width }}>
      <section
        {...props}
        className={styles.section}
        data-dark={dark}
        data-gray={gray}
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
