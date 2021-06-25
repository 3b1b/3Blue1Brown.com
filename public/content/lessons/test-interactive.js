import { useState } from "react";
import styles from "./test-interactive.module.scss";

const TestInteractive = ({ startValue = 1 }) => {
  const [count, setCount] = useState(startValue);

  return (
    <div className={styles.test_interactive}>
      <button className={styles.button} onClick={() => setCount(count + 1)}>
        Click me: {count}
      </button>
    </div>
  );
};

export default TestInteractive;
