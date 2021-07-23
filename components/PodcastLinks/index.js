import Link from "next/link";
import Clickable from "../Clickable";
import styles from "./index.module.scss";
import PropTypes from "prop-types";

PodcastLinks.propTypes = {
  design: PropTypes.oneOf(["embedded", "full"]),
};

export default function PodcastLinks({ design = "embedded" }) {
  return (
    <div className={styles.podcastLinks} data-design={design}>
      <Link href="/podcast">
        <a className={styles.coverLink}>
          <img
            src="/images/podcast/3b1b-podcast.jpeg"
            alt="The 3b1b Podcast"
            className={styles.cover}
          />
        </a>
      </Link>

      <div className={styles.info}>
        <div className={styles.apps}>
          <a href="https://www.youtube.com/playlist?list=PLfx0NKbQXfNBc5n8LOXYRTMzvTofAY8d6">
            <img
              src="/images/podcast/badges/youtube-badge.svg"
              alt="Listen on YouTube"
            />
          </a>
          <a href="https://podcasts.apple.com/us/podcast/the-3b1b-podcast/id1576951213">
            <img
              src="/images/podcast/badges/applepodcasts-badge.svg"
              alt="Listen on Apple Podcasts"
            />
          </a>
          <a href="https://www.google.com/podcasts?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy82MzZiNDgyMC9wb2RjYXN0L3Jzcw==">
            <img
              src="/images/podcast/badges/googlepodcasts-badge.svg"
              alt="Listen on Google Podcasts"
            />
          </a>
          <a href="https://open.spotify.com/show/74ZzyhJx8NL5OBmv2RWXnB">
            <img
              src="/images/podcast/badges/spotify-badge.svg"
              alt="Listen on Spotify"
            />
          </a>
          <a href="https://www.breaker.audio/the-3b1b-podcast">
            <img
              src="/images/podcast/badges/breaker-badge.svg"
              alt="Listen on Breaker"
            />
          </a>
          <a href="https://overcast.fm/itunes1576951213/the-3b1b-podcast">
            <img
              src="/images/podcast/badges/overcast-badge.svg"
              alt="Listen on Overcast"
            />
          </a>
          <a href="https://pca.st/5vw36tdt">
            <img
              src="/images/podcast/badges/pocketcasts-badge.svg"
              alt="Listen on Pocket Casts"
            />
          </a>
          <a href="https://radiopublic.com/the-3b1b-podcast-WogjkA">
            <img
              src="/images/podcast/badges/radiopublic-badge.svg"
              alt="Listen on RadioPublic"
            />
          </a>
          <a href="https://anchor.fm/s/636b4820/podcast/rss">
            <img
              src="/images/podcast/badges/rss-badge.svg"
              alt="Subscribe via RSS"
            />
          </a>
        </div>
        {design === "embedded" && (
          <div>
            <Clickable
              icon="fas fa-podcast"
              link="/podcast"
              text="Learn more..."
              design="rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}
