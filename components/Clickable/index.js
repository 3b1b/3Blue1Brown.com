import NextLink from "next/link";
import PropTypes from "prop-types";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";
import React from "react";
Clickable.propTypes = {
  link: requireLinkOrOnClick,
  onClick: requireLinkOrOnClick,
  icon: requireTextOrIcon,
  text: requireTextOrIcon,
  design: PropTypes.oneOf(["normal", "rounded"]),
  active: PropTypes.bool,
  className: PropTypes.string,
};

function requireLinkOrOnClick(props, propName, componentName) {
  if (!props.link && !props.onClick) {
    return new Error(`${componentName} requires one of "link" or "onClick"`);
  }

  if (propName === "link" && !props.onClick && typeof props.link !== "string") {
    return new Error(`link must be a string in ${componentName}`);
  }

  if (
    propName === "onClick" &&
    !props.link &&
    typeof props.onClick !== "function"
  ) {
    return new Error(`onClick must be a function in ${componentName}`);
  }
}

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

// link/button component
export default function Clickable({
  link,
  onClick,
  label = "",
  icon,
  text,
  design,
  active,
  className = "",
  ...rest
}) {
  // decide whether to use button or link
  let Component;
  if (link) Component = Link;
  else Component = Button;

  // if no contents, don't render
  if (!text && !icon) return null;
  // if no actions, don't render
  if (!link && !onClick) return null;

  return (
    <Component
      {...rest}
      link={link}
      onClick={(event) => {
        event.target.blur();
        if (onClick) {
          onClick(event);
        }
      }}
      data-icon={icon ? true : false}
      data-text={text ? true : false}
      data-active={active}
      data-design={design}
      className={styles.clickable + " " + className}
    >
      {icon && (
        <span className={styles.icon}>
          <i className={icon}></i>
        </span>
      )}
      {text && <span className={styles.text}>{text}</span>}
    </Component>
  );
}

// button component, for actions
const Button = ({ tooltip, ...rest }) => (
  <Tooltip content={tooltip}>
    <button {...rest} />
  </Tooltip>
);

/**
 * Next link that forwards the ref to the inner <a>.
 * Required for React 18+.
 */
const NLink = React.forwardRef((props, ref) => {
  return (
    <NextLink href={props.link} passHref>
      <a href={props.link} {...props} ref={ref} aria-label={props.label} />
    </NextLink>
  );
});

// link component, for navigating somewhere
const Link = ({ tooltip, label = "", link = "/", ...rest }) => (
  <Tooltip content={tooltip}>
    <NLink link={link} {...rest} label={label} />
  </Tooltip>
);
