import PropTypes from "prop-types";
import styles from "./index.module.scss";

const urlToIcon = (url) => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "fab fa-youtube";
  if (url.includes("instagram.com")) return "fab fa-instagram";
  if (url.includes("twitch.tv")) return "fab fa-twitch";
  if (url.includes("linkedin.com")) return "fab fa-linkedin";
  if (url.includes("spotify.com")) return "fab fa-spotify";
  if (url.includes("twitter.com") || url.includes("x.com")) return "fab fa-twitter";
  if (url.includes("github.com")) return "fab fa-github";
  if (url.includes("bandcamp.com")) return "fab fa-bandcamp";
  return "fa-solid fa-globe";
};

TeamMemberCard.propTypes = {
  name: PropTypes.string.isRequired,
  role: PropTypes.string,
  image: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(PropTypes.string),
};

export default function TeamMemberCard({ name, role, image, links = [] }) {
  return (
    <div className={styles.card} id={name.toLowerCase().split(" ").join("-")}>
      <div className={styles.headshot}>
        <img src={image} alt={name} />
      </div>
      <p className={styles.name}>{name}</p>
      {role && <p className={styles.role}>{role}</p>}
      {links.length > 0 && (
        <div className={styles.links}>
          {links.map((url, index) => (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              <i className={urlToIcon(url)}></i>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
