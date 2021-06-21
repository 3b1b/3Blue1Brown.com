import { useContext } from "react";
import NextLink from "next/link";
import Chip from "../Chip";
import { formatDate } from "../../util/locale";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";
import Tooltip from "../Tooltip";

// button that links to a lesson, showing details like thumbnail, title, etc.
const LessonCard = ({
  id,
  icon,
  mini,
  reverse,
  tooltip,
  active,
  className = "",
}) => {
  const { lessons = [] } = useContext(PageContext);

  const lesson = lessons.find((lesson) => lesson.slug === id);

  if (!lesson) return <></>;

  let Component;
  if (active) Component = Stub;
  else Component = Link;

  let { slug, title, description, date, video, chapter, topic, empty } = lesson;

  if (date) date = formatDate(date);

  return (
    <Component
      link={`/lessons/${slug}`}
      className={styles.lesson_card + " " + className}
      tooltip={tooltip}
      data-active={active || false}
      data-mini={mini || false}
      data-reverse={reverse || false}
      data-fade
    >
      {icon && <i className={icon}></i>}

      <div className={styles.image}>
        <div className={styles.frame}>
          <img src={`https://img.youtube.com/vi/${video}/hqdefault.jpg`} />
        </div>
      </div>

      <div className={styles.text}>
        <span>{title && <span>{title}</span>}</span>
        {description && !mini && <span>{description}</span>}
        {(chapter || !empty || date) && !mini && (
          <span>
            {chapter && (
              <Chip
                text={(mini ? "Ch" : "Chapter") + " " + chapter}
                mini={mini}
                tooltip={`In topic "${topic}"`}
              />
            )}
            {!empty && (
              <Chip
                icon="fas fa-pencil-alt"
                mini={mini}
                tooltip="This lesson has a text version"
              />
            )}
            {date && <span>{date}</span>}{" "}
          </span>
        )}
      </div>
    </Component>
  );
};

export default LessonCard;

const Link = ({ link, tooltip, ...rest }) => (
  <NextLink href={link} passHref>
    <Tooltip content={tooltip}>
      <a {...rest} />
    </Tooltip>
  </NextLink>
);

const Stub = ({ ...props }) => <a {...props} />;
