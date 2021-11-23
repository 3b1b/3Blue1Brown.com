import { forwardRef } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

// util component to flex center its children
const Center = forwardRef((props, ref) => {
  if (!props.children) return null;

  return (
    <div ref={ref} className={styles.center} {...props} />
  );
});

Center.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Center;
