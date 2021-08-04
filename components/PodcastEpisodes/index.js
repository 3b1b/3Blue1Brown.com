import { episodes } from "../../data/podcast.yaml";
import styles from "./index.module.scss";

export default function PodcastEpisodes() {
  return (
    <div>
      {episodes.map((episode, index) => (
        <PodcastEpisode
          key={episode.youtubeId}
          number={episodes.length - index}
          title={episode.title}
          description={episode.description}
          youtubeId={episode.youtubeId}
        />
      ))}
    </div>
  );
}

function PodcastEpisode({ number, title, description, youtubeId }) {
  return (
    <a
      className={styles.podcastEpisode}
      href={`https://www.youtube.com/watch?v=${youtubeId}&list=PLfx0NKbQXfNBc5n8LOXYRTMzvTofAY8d6`}
    >
      <img
        className={styles.thumbnail}
        src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
        alt={title}
      />

      <div className={styles.info}>
        <div className={styles.number}>Episode {number}</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </a>
  );
}
