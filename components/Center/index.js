import { forwardRef } from "react";
import styles from "./index.module.scss";

const Center = forwardRef(({ children }, ref) => (
  <div ref={ref} className={styles.center}>
    {children}
  </div>
));

export default Center;
