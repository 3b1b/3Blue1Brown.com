import { useState, useEffect } from "react";
import NextLink from "next/link";
import { formatDate } from "../../util/locale";
import styles from "./index.module.scss";

const LessonCard = ({ id, icon, active, mini, reverse }) => {
  const [lesson, setLesson] = useState(null);

  if (!lesson) return <></>;

  let Component;
  if (active) Component = Stub;
  else Component = Link;

  let { link = "", title, description, date, video } = lesson;

  if (date) date = formatDate(date);

  return (
    <Component
      link={link}
      className={styles.lesson_card}
      data-active={active || false}
      data-mini={mini || false}
      data-reverse={reverse || false}
    >
      {icon && <i className={icon}></i>}

      <img src={`https://img.youtube.com/vi/${video}/hqdefault.jpg`} />

      <span className={styles.text}>
        <span>
          {/* chip */}
          {title && <span>{title}</span>}
        </span>

        {!mini && (
          <>
            {description && <span>{description}</span>}
            {date && <span>{date}</span>}
          </>
        )}
      </span>
    </Component>
  );
};

export default LessonCard;

const Link = ({ link, ...props }) => (
  <NextLink href={link}>
    <a {...props} />
  </NextLink>
);

const Stub = ({ ...props }) => <a {...props} />;
