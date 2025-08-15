import { useContext, useMemo, useState, useRef } from "react";
import PropTypes from "prop-types";
import Center from "../Center";
import Clickable from "../Clickable";
import LessonCard from "../LessonCard";
import topics from "../../data/topics.yaml";
import { topic_suggestion_form } from "../../data/site.yaml";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";
import PiCreature from "../PiCreature";
import { transformSrc } from "../../util/transformSrc";

// Helper function to get topic thumbnail with fallback between formats
function getTopicThumbnail(topicSlug) {
  // Try formats in order: SVG, JPEG, JPG
  const svgPath = `/images/topics/${topicSlug}.svg`;
  const jpegPath = `/images/topics/${topicSlug}.jpeg`;
  const jpgPath = `/images/topics/${topicSlug}.jpg`;
  
  const result = {
    primary: transformSrc(svgPath),
    fallback1: transformSrc(jpegPath),
    fallback2: transformSrc(jpgPath)
  };
  
  return result;
}

// Helper function to match search terms
function matchesSearch(lesson, searchText) {
  const searchStrings = [
    lesson.title,
    lesson.description,
    lesson.slug,
    lesson.topic,
    lesson.video,
    new Date(lesson.date).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  ];

  return searchStrings
    .join("\n")
    .toLowerCase()
    .includes(searchText.toLowerCase());
}

// Helper function to sort lessons by topic order
function getSortedLessons(lessons, topicNames) {
  return [...lessons].sort((a, b) => {
    const ati = topicNames.indexOf(a.topic);
    const bti = topicNames.indexOf(b.topic);
    if (ati === -1) return 1;
    if (bti === -1) return -1;
    if (ati === bti) {
      return (
        topics[ati].lessons.indexOf(a.slug) -
        topics[bti].lessons.indexOf(b.slug)
      );
    }
    return ati - bti;
  });
}

// Custom hook for gallery state management
function useGalleryState(initialShow) {
  const [tab, setTab] = useState(initialShow);
  const [searchText, setSearchText] = useState("");
  const [selectedTopicName, setSelectedTopicName] = useState(null);

  const clearFilters = () => {
    setSearchText("");
    setSelectedTopicName(null);
  };

  const setTopicView = () => {
    setTab("topic");
    clearFilters();
  };

  const setDateView = () => {
    setTab("all");
    clearFilters();
  };

  // Determine current view based on state
  const currentView = searchText ? "search" : selectedTopicName ? "topic-lessons" : tab;

  return {
    tab,
    searchText,
    selectedTopicName,
    currentView,
    setSearchText,
    setSelectedTopicName,
    setTopicView,
    setDateView,
  };
}

// TopicCard component
const TopicCard = ({ topic, onTopicClick, galleryRef }) => {
  const handleClick = () => {
    onTopicClick(topic.name);
    // Scroll to top of gallery only if currently scrolled below it
    setTimeout(() => {
      if (galleryRef?.current) {
        const galleryTop = galleryRef.current.getBoundingClientRect().top + window.scrollY;
        const currentScrollY = window.scrollY;
        
        // Only scroll up if we're currently below the gallery top
        if (currentScrollY > galleryTop) {
          galleryRef.current.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  const handleImageError = (e) => {
    // Try fallbacks in order: SVG -> JPEG -> JPG
    const thumbnail = getTopicThumbnail(topic.slug);
    console.log(`Image error for topic "${topic.slug}":`, {
      failed: e.target.src,
      primary: thumbnail.primary,
      fallback1: thumbnail.fallback1,
      fallback2: thumbnail.fallback2
    });
    
    if (e.target.src === thumbnail.primary) {
      console.log(`Trying fallback1 (.jpeg): ${thumbnail.fallback1}`);
      e.target.src = thumbnail.fallback1; // Try .jpeg
    } else if (e.target.src === thumbnail.fallback1) {
      console.log(`Trying fallback2 (.jpg): ${thumbnail.fallback2}`);
      e.target.src = thumbnail.fallback2; // Try .jpg
    } else {
      console.log('All thumbnail formats failed');
    }
  };

  const thumbnail = getTopicThumbnail(topic.slug);

  return (
    <div 
      className={styles.topic_card} 
      data-title={topic.name}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.imageContainer}>
        <img
          className={styles.image}
          src={thumbnail.primary}
          alt={topic.name}
          onError={handleImageError}
        />
        <div className={styles.gradientOverlay}></div>
        <span className={styles.overlayTitle}>{topic.name}</span>
      </div>
    </div>
  );
};

// Topic header component
const TopicHeader = ({ topic }) => {
  if (!topic) return null;
  
  const handleHeaderImageError = (e) => {
    // Try fallbacks in order: SVG -> JPEG -> JPG
    const thumbnail = getTopicThumbnail(topic.slug);
    if (e.target.src === thumbnail.primary) {
      e.target.src = thumbnail.fallback1; // Try .jpeg
    } else if (e.target.src === thumbnail.fallback1) {
      e.target.src = thumbnail.fallback2; // Try .jpg
    }
    // If fallback2 also fails, we've tried all options
  };

  const thumbnail = getTopicThumbnail(topic.slug);
  
  return (
    <div className={styles.topicHeader}>
      <img
        className={styles.topicHeaderImage}
        src={thumbnail.primary}
        alt={topic.name}
        onError={handleHeaderImageError}
      />
      <div className={styles.topicHeaderOverlay}>
        <h2 className={styles.topicHeaderTitle}>{topic.name}</h2>
      </div>
    </div>
  );
};

// Search bar component
const SearchBar = ({ searchText, onSearchChange, isActive }) => {
  return (
    <div className={styles.search} data-active={isActive}>
      <i className="fas fa-search" />
      <input
        type="text"
        placeholder="Search lessons"
        value={searchText}
        onChange={(event) => onSearchChange(event.target.value)}
      />
    </div>
  );
};

// Navigation tabs component
const NavigationTabs = ({ currentView, onTopicView, onDateView }) => {
  return (
    <div className={styles.tabs}>
      <Clickable
        text="Topics"
        design="tab"
        onClick={onTopicView}
        active={currentView === "topic"}
      />
      <Clickable
        text="By date"
        design="tab"
        onClick={onDateView}
        active={currentView === "all"}
      />
    </div>
  );
};

// No results component
const NoResults = () => {
  return (
    <div className={styles.no_results}>
      <PiCreature
        text="No lessons match your search."
        emotion="shruggie"
        placement="inline"
        design="big"
        flip={true}
        dark={true}
      />
      <Center>
        <Clickable
          link={topic_suggestion_form}
          icon="fa-solid fa-align-justify"
          text="Suggest a topic"
          design="rounded"
          style={{ width: '200px' }}
        />
      </Center>
    </div>
  );
};

LessonGallery.propTypes = {
  show: PropTypes.oneOf(["topic", "all"]),
  skipMostRecent: PropTypes.bool,
};

// Gallery that shows all lessons in various ways with tabs. Show by topic or all
export default function LessonGallery({ show = "topic", skipMostRecent = false }) {
  const { lessons } = useContext(PageContext);
  const topicNames = topics.map((topic) => topic.name);
  const sortedLessons = getSortedLessons(lessons, topicNames);
  const galleryRef = useRef(null);
  
  const {
    searchText,
    selectedTopicName,
    currentView,
    setSearchText,
    setSelectedTopicName,
    setTopicView,
    setDateView,
  } = useGalleryState(show);
  
  // Find the full topic object for the selected topic
  const selectedTopic = selectedTopicName 
    ? topics.find(topic => topic.name === selectedTopicName) 
    : null;

  const filteredLessons = useMemo(() => {
    switch (currentView) {
      case "search":
        return sortedLessons.filter((lesson) =>
          matchesSearch(lesson, searchText)
        );
      case "topic-lessons":
        // Directly use the lesson order from topics.yaml for the selected topic
        if (!selectedTopic || !selectedTopic.lessons) return [];
        
        return selectedTopic.lessons
          .map(lessonSlug => lessons.find(lesson => lesson.slug === lessonSlug))
          .filter(lesson => lesson !== undefined); // Filter out any lessons that don't exist
      case "all":
        return skipMostRecent ? lessons.slice(1) : lessons;
      default:
        return lessons;
    }
  }, [lessons, currentView, searchText, selectedTopic, skipMostRecent, sortedLessons]);

  const showLessonList = ["all", "search", "topic-lessons"].includes(currentView);
  const showTopicGrid = currentView === "topic";
  const showNoResults = showLessonList && filteredLessons.length === 0;

  return (
    <div ref={galleryRef}>
      <div className={styles.searchAndTabs}>
        <NavigationTabs
          currentView={currentView}
          onTopicView={setTopicView}
          onDateView={setDateView}
        />

        <SearchBar
          searchText={searchText}
          onSearchChange={setSearchText}
          isActive={currentView === "search"}
        />
      </div>
      
      <TopicHeader topic={selectedTopic} />
      
      {showTopicGrid && (
        <div className={styles.topicGrid}>
          {topics
            .filter(topic => topic.slug !== "miscellaneous")
            .map((topic) => (
              <TopicCard 
                key={topic.slug} 
                topic={topic}
                onTopicClick={setSelectedTopicName}
                galleryRef={galleryRef}
              />
            ))
          }
        </div>
      )}
      
      {showLessonList && filteredLessons.map((lesson) => (
        <LessonCard key={lesson.slug} id={lesson.slug} />
      ))}
      
      {showNoResults && <NoResults />}
    </div>
  );
}

