import NextLink from "next/link";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";

const Clickable = ({
  link,
  icon,
  text,
  active,
  className = "",
  design,
  ...rest
}) => {
  let Component;
  if (link) Component = Link;
  else Component = Button;

  return (
    <Component
      {...rest}
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

const Button = ({ tooltip, ...rest }) => (
  <Tooltip content={tooltip}>
    <button {...rest} />
  </Tooltip>
);

const Link = ({ tooltip, link = "/", ...rest }) => (
  <NextLink href={link} passHref>
    <Tooltip content={tooltip}>
      <a {...rest} />
    </Tooltip>
  </NextLink>
);

export default Clickable;
