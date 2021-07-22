import Link from "next/link";
import styles from "./index.module.scss";

export default function PodcastLinks() {
  return (
    <div className={styles.podcastLinks}>
      <Link href="/podcast">
        <a>
          <img
            src="/images/podcast/3b1b-podcast.jpeg"
            alt="The 3b1b Podcast"
            className={styles.cover}
          />
        </a>
      </Link>

      <div className={styles.info}>
        <p>Listen in your favorite podcast player...</p>
        <div className={styles.apps}>
          <a href="https://podcasts.apple.com/us/podcast/the-3b1b-podcast/id1576951213">
            <img src="/images/podcast/apple-podcasts.png" />
          </a>
          <a href="https://www.breaker.audio/the-3b1b-podcast">
            <img src="/images/podcast/breaker.png" />
          </a>
          <a href="https://www.google.com/podcasts?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy82MzZiNDgyMC9wb2RjYXN0L3Jzcw==">
            <img src="/images/podcast/google-podcasts.png" />
          </a>
          <a href="https://pca.st/5vw36tdt">
            <img src="/images/podcast/pocket-casts.png" />
          </a>
          <a href="https://radiopublic.com/the-3b1b-podcast-WogjkA">
            <img src="/images/podcast/radiopublic.png" />
          </a>
          <a href="https://open.spotify.com/show/74ZzyhJx8NL5OBmv2RWXnB">
            <img src="/images/podcast/spotify.png" />
          </a>
        </div>
      </div>
    </div>
  );
}
