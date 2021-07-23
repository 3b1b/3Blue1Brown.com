import Link from "next/link";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";

export default function PodcastLinks() {
  return (
    <div className={styles.podcastLinks}>
      <Link href="/podcast">
        <a className={styles.coverLink}>
          <img
            src="/images/podcast/3b1b-podcast.svg"
            alt="The 3b1b Podcast"
            className={styles.cover}
          />
        </a>
      </Link>

      <div className={styles.info}>
        <div className={styles.apps}>
          <Tooltip content="YouTube">
            <a href="https://www.youtube.com/playlist?list=PLfx0NKbQXfNBc5n8LOXYRTMzvTofAY8d6">
              <img
                className={styles.icon}
                src="/images/podcast/youtube.png"
                alt="Listen on YouTube"
              />
            </a>
          </Tooltip>
          <Tooltip content="Apple Podcasts">
            <a href="https://podcasts.apple.com/us/podcast/the-3b1b-podcast/id1576951213">
              <img
                className={styles.icon}
                src="/images/podcast/applepodcasts.png"
                alt="Listen on Apple Podcasts"
              />
            </a>
          </Tooltip>
          <Tooltip content="Google Podcasts">
            <a href="https://www.google.com/podcasts?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy82MzZiNDgyMC9wb2RjYXN0L3Jzcw==">
              <img
                className={styles.icon}
                src="/images/podcast/googlepodcasts.png"
                alt="Listen on Google Podcasts"
              />
            </a>
          </Tooltip>
          <Tooltip content="Spotify">
            <a href="https://open.spotify.com/show/74ZzyhJx8NL5OBmv2RWXnB">
              <img
                className={styles.icon}
                src="/images/podcast/spotify.png"
                alt="Listen on Spotify"
              />
            </a>
          </Tooltip>
          <Tooltip content="Breaker">
            <a href="https://www.breaker.audio/the-3b1b-podcast">
              <img
                className={styles.icon}
                src="/images/podcast/breaker.png"
                alt="Listen on Breaker"
              />
            </a>
          </Tooltip>
          <Tooltip content="Overcast">
            <a href="https://overcast.fm/itunes1576951213/the-3b1b-podcast">
              <img
                className={styles.icon}
                src="/images/podcast/overcast.png"
                alt="Listen on Overcast"
              />
            </a>
          </Tooltip>
          <Tooltip content="Pocket Casts">
            <a href="https://pca.st/5vw36tdt">
              <img
                className={styles.icon}
                src="/images/podcast/pocketcasts.png"
                alt="Listen on Pocket Casts"
              />
            </a>
          </Tooltip>
          <Tooltip content="RadioPublic">
            <a href="https://radiopublic.com/the-3b1b-podcast-WogjkA">
              <img
                className={styles.icon}
                src="/images/podcast/radiopublic.png"
                alt="Listen on RadioPublic"
              />
            </a>
          </Tooltip>
          <Tooltip content="RSS">
            <a href="https://anchor.fm/s/636b4820/podcast/rss">
              <img
                className={styles.icon}
                src="/images/podcast/rss.png"
                alt="Subscribe via RSS"
              />
            </a>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
