import Tooltip from "../Tooltip";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

Chip.propTypes = {
  text: requireTextOrIcon,
  icon: requireTextOrIcon,
  mini: PropTypes.bool,
  tooltip: PropTypes.node,
};

function requireTextOrIcon(props, propName, componentName) {
  if (!props.text && !props.icon) {
    return new Error(`${componentName} requires one of "text" or "icon"`);
  }

  if (propName === "text" && !props.icon && typeof props.text !== "string") {
    return new Error(`text must be a string in ${componentName}`);
  }

  if (propName === "icon" && !props.text && typeof props.icon !== "string") {
    return new Error(`icon must be a string in ${componentName}`);
  }
}

// generic chip component with text and icon
export default function Chip({ text, icon, mini = false, tooltip }) {
  return (
    <Tooltip content={tooltip}>
      <span className={styles.chip} data-mini={mini}>
        {icon && <i className={icon} />}
        {text}
      </span>
    </Tooltip>
  );
}
