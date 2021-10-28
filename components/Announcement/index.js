import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./index.module.scss";
import PropTypes from "prop-types";

Announcement.propTypes = {
  /*
    Each announcement should get a unique id.
    When a user closes the announcement, its id will be saved
    on their computer so that it remains closed permanently.
  
    Therefore, make sure you never reuse ids, because then if someone
    closed the old announcement, they will never see the new one.
  */
  id: PropTypes.string.isRequired,
  headline: PropTypes.string.isRequired,
  description: PropTypes.string,
};

/*
  If you're developing the site and want to re-show all the announcements you've
  hidden, enter showAnnouncements() into the devtools console.
*/

export default function Announcement({ id, headline, description, link }) {
  const [closedAnnouncements, setClosedAnnouncements] = useLocalStorage(
    "closed-announcements",
    []
  );

  const isClosed = closedAnnouncements.includes(id);

  const close = () => {
    setClosedAnnouncements((closed) => [...closed, id]);
  };

  useEffect(() => {
    window.showAnnouncements = () => {
      setClosedAnnouncements([]);
    };
  }, [setClosedAnnouncements]);

  if (isClosed) {
    return null;
  }

  return (
    <Link href={link}>
      <a className={styles.announcement}>
        <div className={styles.center}>
          <div className={styles.content}>
            <div className={styles.headline}>{headline}</div>
            {description && (
              <div className={styles.description}>{description}</div>
            )}
          </div>
          <button
            className={styles.closeButton}
            onClick={(event) => {
              event.preventDefault();
              close();
            }}
          >
            <i className="fas fa-times" />
          </button>
        </div>
      </a>
    </Link>
  );
}

// Hook
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {}
  }, [key]);

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
}
