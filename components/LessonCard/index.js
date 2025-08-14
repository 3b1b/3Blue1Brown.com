import { useContext } from "react";
import PropTypes from "prop-types";
import NextLink from "next/link";
import Chip from "../Chip";
import { formatDate } from "../../util/locale";
import { PageContext } from "../../pages/_app";
import { useFeaturedVideo } from "../../util/featuredVideoContext";
import styles from "./index.module.scss";
import Tooltip from "../Tooltip";
import lessonRedirects from "../../data/lesson-redirects.yaml";

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
  const { playLesson } = useFeaturedVideo();

  // find lesson with matching slug
  const lesson = lessons.find((lesson) => lesson.slug === id);

  // if couldn't find lesson, don't render
  if (!lesson) return null;

  // check if lesson has a video
  const hasVideo = lesson.video && lesson.video.trim() !== '';

  // get tag type/name for component
  let Component;
  if (active) {
    Component = Stub;
  } else if (hasVideo) {
    Component = VideoButton;
  } else {
    Component = Link;
  }

  // get lesson details
  let { slug, title, description, date, thumbnail, chapter, topic, empty } =
    lesson;
  if (date) date = formatDate(date);

  return (
    <Component
      link={lessonRedirects[slug] || `/lessons/${slug}`}
      lesson={lesson}
      playLesson={playLesson}
      className={styles.lesson_card + " " + className}
      tooltip={tooltip}
      data-active={active || false}
      data-mini={mini || false}
      data-reverse={reverse || false}
    >
      {icon && <i className={icon}></i>}

      <div className={styles.image}>
        <div className={styles.frame}>
          <img src={thumbnail} alt="" />
        </div>
      </div>

      <div className={styles.text}>
        <span>{title && <span className={styles.title}>{title}</span>}</span>

        {description && !mini && (
          <span className={styles.description}>{description}</span>
        )}

        {/* Show blog version link for lessons with video that also have text version */}
        {!empty && (
          <div className={styles.blogVersionLink}>
            <NextLink 
              href={lessonRedirects[slug] || `/lessons/${slug}#title`} 
              className={styles.blogLink}
              onClick={(e) => e.stopPropagation()}
            >
              <i className="far fa-newspaper"></i> Read
            </NextLink>
          </div>
        )}

      </div>
    </Component>
  );
}

const Link = ({ link, tooltip, ...rest }) => (
  <NextLink href={link} passHref legacyBehavior>
    <Tooltip content={tooltip}>
      <a {...rest} />
    </Tooltip>
  </NextLink>
);

const VideoButton = ({ lesson, playLesson, tooltip, ...rest }) => {
  const handleClick = (e) => {
    e.preventDefault();
    
    // Double-check lesson has video before calling playLesson
    if (!lesson || !lesson.video || lesson.video.trim() === '') {
      console.warn('VideoButton: Lesson missing video property:', lesson);
      return;
    }
    
    playLesson(lesson);
  };

  return (
    <a {...rest} onClick={handleClick} style={{ cursor: 'pointer' }} />
  );
};

const Stub = ({ ...props }) => <a {...props} />;
