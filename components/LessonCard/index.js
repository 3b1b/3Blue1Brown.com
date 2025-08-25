import { useContext, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import NextLink from "next/link";
import Chip from "../Chip";
import { formatDate } from "../../util/locale";
import { PageContext } from "../../pages/_app";
import { createVideoUrl, VIDEO_URLS } from "../../util/videoNavigation";
import { getResponsiveYouTubeThumbnails } from "../../util/youtubeThumbnails";
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
  linkToLessonPage: PropTypes.bool,
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
  linkToLessonPage = false,
}) {
  const { lessons = [] } = useContext(PageContext);

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
    Component = VideoLink;
  } else {
    Component = Link;
  }

  // get lesson details
  let { slug, title, description, date, thumbnail, chapter, topic, empty } =
    lesson;
  if (date) date = formatDate(date);

  // Generate responsive thumbnails only for video lessons using YouTube thumbnails
  // (Don't use responsive thumbnails for custom thumbnails)
  // Only use YouTube responsive thumbnails if:
  // 1. The lesson has a video
  // 2. The thumbnail URL is actually from YouTube (not a custom thumbnail path)
  const isYouTubeThumbnail = hasVideo && lesson.video && thumbnail && thumbnail.startsWith('https://img.youtube.com/');
  const responsiveThumbnails = isYouTubeThumbnail 
    ? getResponsiveYouTubeThumbnails(lesson.video)
    : null;

  // Prepare props based on component type
  const componentProps = {
    link: lessonRedirects[slug] || `/lessons/${slug}`,
    lesson: lesson,
    className: styles.lesson_card + " " + className,
    tooltip: tooltip,
    "data-active": active || false,
    "data-mini": mini || false,
    "data-reverse": reverse || false,
  };

  // Only pass linkToLessonPage to VideoLink component
  if (Component === VideoLink) {
    componentProps.linkToLessonPage = linkToLessonPage;
  }

  return (
    <Component {...componentProps}>
      {icon && <i className={icon}></i>}

      <LazyImage 
        responsiveThumbnails={responsiveThumbnails}
        thumbnail={thumbnail}
      />

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
  <Tooltip content={tooltip}>
    <NextLink href={link} {...rest} />
  </Tooltip>
);

const VideoLink = ({ lesson, tooltip, linkToLessonPage = false, ...rest }) => {
  // Double-check lesson has video
  if (!lesson || !lesson.video || lesson.video.trim() === '') {
    console.warn('VideoLink: Lesson missing video property:', lesson);
    return <Stub {...rest} />;
  }

  // Choose URL based on linkToLessonPage prop
  const href = linkToLessonPage 
    ? `${VIDEO_URLS.LESSON_WITH_TITLE(lesson.slug)}`
    : `${createVideoUrl(lesson.slug)}#video-section`;

  return (
    <Tooltip content={tooltip}>
      <NextLink href={href} {...rest} />
    </Tooltip>
  );
};

const Stub = ({ ...props }) => <a {...props} />;

// Lazy loading image component with Intersection Observer
const LazyImage = ({ responsiveThumbnails, thumbnail }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={styles.image} ref={imgRef}>
      <div className={styles.frame}>
        {!isVisible ? (
          // Placeholder while not visible
          <div className={styles.placeholder} />
        ) : responsiveThumbnails ? (
          <img 
            src={responsiveThumbnails.default}
            srcSet={`
              ${responsiveThumbnails.mobile} 480w,
              ${responsiveThumbnails.tablet} 768w,
              ${responsiveThumbnails.desktop} 1200w
            `}
            sizes="(max-width: 480px) 320px, (max-width: 768px) 400px, 500px"
            alt=""
            onLoad={handleImageLoad}
            className={isLoaded ? styles.loaded : styles.loading}
          />
        ) : (
          <img 
            src={thumbnail} 
            alt="" 
            onLoad={handleImageLoad}
            className={isLoaded ? styles.loaded : styles.loading}
          />
        )}
      </div>
    </div>
  );
};
