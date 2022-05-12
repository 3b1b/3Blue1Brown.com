import { episodes } from "../../data/podcast.yaml";
import styles from "./index.module.scss";
import Image from "next/image";
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
      <div className={styles.thumbnail}>
        <Image
          layout="fill"
          src={`https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`}
          alt={title}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.number}>Episode {number}</div>
        <div className={styles.title}>{title}</div>
        <div className={styles.description}>{description}</div>
      </div>
    </a>
  );
}
