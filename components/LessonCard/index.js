import React, { useContext } from "react";
import PropTypes from "prop-types";
import NextLink from "next/link";
import Chip from "../Chip";
import { formatDate } from "../../util/locale";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";
import Tooltip from "../Tooltip";
import lessonRedirects from "../../data/lesson-redirects.yaml";
import Image from "next/image";

LessonCard.propTypes = {
  id: PropTypes.string.isRequired,
  icon: PropTypes.string,
  mini: PropTypes.bool,
  reverse: PropTypes.bool,
  tooltip: PropTypes.node,
  active: PropTypes.bool,
  className: PropTypes.string,
};

// button that links to a lesson, showing details like thumbnail, title, etc.
export default function LessonCard({
  id,
  icon,
  mini,
  reverse,
  tooltip,
  active,
  className = "",
}) {
  const { lessons = [] } = useContext(PageContext);

  // find lesson with matching slug
  const lesson = lessons.find((lesson) => lesson.slug === id);

  // if couldn't find lesson, don't render
  if (!lesson) return null;

  // get tag type/name for component
  let Component;
  if (active) Component = Stub;
  else Component = Link;

  // get lesson details
  let { slug, title, description, date, thumbnail, chapter, topic, empty } =
    lesson;
  if (date) date = formatDate(date);

  return (
    <Component
      link={lessonRedirects[slug] || `/lessons/${slug}`}
      className={styles.lesson_card + " " + className}
      tooltip={tooltip}
      data-active={active || false}
      data-mini={mini || false}
      data-reverse={reverse || false}
    >
      {icon && <i className={icon}></i>}

      <div className={styles.image}>
        <div
          style={{
            aspectRatio: "1 / .5625",
            position: "relative",
          }}
        >
          <Image src={thumbnail} layout="fill" />
        </div>
      </div>

      <div className={styles.text}>
        <span>{title && <span className={styles.title}>{title}</span>}</span>
        {description && !mini && (
          <span className={styles.description}>{description}</span>
        )}
        {(chapter !== undefined || !empty || date) && !mini && (
          <span>
            {chapter !== undefined && (
              <Chip
                text={(mini ? "Ch" : "Chapter") + " " + chapter}
                mini={mini}
                tooltip={`In topic "${topic}"`}
              />
            )}
            {!empty && (
              <Chip
                icon="far fa-newspaper"
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
}

const NLink = React.forwardRef((props, ref) => {
  return (
    <NextLink href={props.link} passHref>
      <a {...props} ref={ref} />
    </NextLink>
  );
});

const Link = ({ link, tooltip, ...rest }) => (
  <Tooltip content={tooltip}>
    <NLink link={link} {...rest} />
  </Tooltip>
);

const Stub = ({ ...props }) => <a {...props} />;
