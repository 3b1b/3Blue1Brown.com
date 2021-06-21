import { forwardRef } from "react";
import styles from "./index.module.scss";

// util component to flex center its children
const Center = forwardRef(({ children }, ref) => (
  <div ref={ref} className={styles.center}>
    {children}
  </div>
));

export default Center;
