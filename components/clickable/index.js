import NextLink from "next/link";
import styles from "./index.module.scss";

const Clickable = ({
  link,
  icon,
  text,
  active,
  onClick,
  className,
  design,
  tooltip,
}) => {
  let Component;
  if (link) Component = Link;
  else Component = Button;

  return (
    <Component
      link={link}
      data-icon={icon ? true : false}
      data-text={text ? true : false}
      data-active={active}
      onClick={onClick}
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

const Button = ({ ...props }) => <button {...props} />;

const Link = ({ link, ...props }) => (
  <NextLink href={link}>
    <a {...props} />
  </NextLink>
);

export default Clickable;
