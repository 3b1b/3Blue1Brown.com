import { createContext, useContext } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

// section wrapper component that spans entire width of screen and colors
// background in alternating white/off-white
Section.propTypes = {
  children: PropTypes.node.isRequired,
  dark: PropTypes.bool,
  width: PropTypes.oneOf(["narrow", "normal", "full"]),
  image: PropTypes.string,
};

// make sure markdown starts and ends with this component, or doesn't use it at
// all. see PageContent component.
const SectionContext = createContext({ width: "normal" });

export default function Section({
  children,
  dark = false,
  width = "normal",
  image,
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
        {image && (
          <div className={styles.background}>
            <img src={image} alt="" />
          </div>
        )}
        <div className={styles.wrapper}>{children}</div>
      </section>
    </SectionContext.Provider>
  );
}

export function useSectionWidth() {
  const { width } = useContext(SectionContext);
  return width;
}
