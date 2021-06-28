import { createContext, useContext } from "react";
import styles from "./index.module.scss";

// section wrapper component that spans entire width of screen and colors
// background in alternating white/off-white

// make sure markdown starts and ends with this component, or doesn't use it at
// all. see PageContent component.
const SectionContext = createContext({ width: "normal" });

const Section = ({ children, dark, width = "normal", ...props }) => (
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

export default Section;

export function useSectionWidth() {
  const { width } = useContext(SectionContext);
  return width;
}
