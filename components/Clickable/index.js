import NextLink from "next/link";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";

// link/button component
const Clickable = ({
  link,
  icon,
  text,
  onClick,
  design,
  active,
  className = "",
  ...rest
}) => {
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
      onClick={(event) => {
        event.target.blur();
        onClick(event);
      }}
      link={link}
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
};

// button component, for actions
const Button = ({ tooltip, ...rest }) => (
  <Tooltip content={tooltip}>
    <button {...rest} />
  </Tooltip>
);

// link component, for navigating somewhere
const Link = ({ tooltip, link = "/", ...rest }) => (
  <NextLink href={link} passHref>
    <Tooltip content={tooltip}>
      <a {...rest} />
    </Tooltip>
  </NextLink>
);

export default Clickable;
