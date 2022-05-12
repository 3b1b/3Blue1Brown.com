import Image from "next/image";
import Link from "next/link";
import PodcastAnimation from "../PodcastAnimation";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";

const links = [
  {
    content: "YouTube",
    href: "https://www.youtube.com/playlist?list=PLfx0NKbQXfNBc5n8LOXYRTMzvTofAY8d6",
    src: "/images/podcast/youtube.png",
    alt: "Listen on YouTube",
  },
  {
    content: "Apple Podcasts",
    href: "https://podcasts.apple.com/us/podcast/the-3b1b-podcast/id1576951213",
    src: "/images/podcast/applepodcasts.png",
    alt: "Listen on Apple Podcasts",
  },
  {
    content: "Google Podcasts",
    href: "https://www.google.com/podcasts?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy82MzZiNDgyMC9wb2RjYXN0L3Jzcw==",
    src: "/images/podcast/googlepodcasts.png",
    alt: "Listen on Google Podcasts",
  },
  {
    content: "Spotify",
    href: "https://open.spotify.com/show/74ZzyhJx8NL5OBmv2RWXnB",
    src: "/images/podcast/spotify.png",
    alt: "Listen on Spotify",
  },
  {
    content: "Breaker",
    href: "https://www.breaker.audio/the-3b1b-podcast",
    src: "/images/podcast/breaker.png",
    alt: "Listen on Breaker",
  },
  {
    content: "Overcast",
    href: "https://overcast.fm/itunes1576951213/the-3b1b-podcast",
    src: "/images/podcast/overcast.png",
    alt: "Listen on Overcast",
  },
  {
    content: "Pocket Casts",
    href: "https://pca.st/5vw36tdt",
    src: "/images/podcast/pocketcasts.png",
    alt: "Listen on Pocket Casts",
  },
  {
    content: "RadioPublic",
    href: "https://radiopublic.com/the-3b1b-podcast-WogjkA",
    src: "/images/podcast/radiopublic.png",
    alt: "Listen on RadioPublic",
  },
  {
    content: "RSS",
    href: "https://anchor.fm/s/636b4820/podcast/rss",
    src: "/images/podcast/rss.png",
    alt: "Subscribe via RSS",
  },
];

export default function PodcastLinks() {
  return (
    <div className={styles.podcastLinks}>
      <Link href="/podcast">
        <a className={styles.coverLink} aria-label="Podcast Link">
          <PodcastAnimation />
        </a>
      </Link>

      <div className={styles.info}>
        <div className={styles.apps}>
          {links.map((link, idx) => (
            <Tooltip content={link.content} key={idx}>
              <a href={link.href}>
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    position: "relative",
                  }}
                >
                  <Image layout="fill" src={link.src} alt={link.alt} />
                </div>
              </a>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
