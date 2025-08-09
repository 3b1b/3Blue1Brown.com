import NextLink from "next/link";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";
import {useState, useEffect} from "react";

export default function SocialIcons() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className={styles.socialIcons}>
      <div className={styles.topRow}>
        <Link
          link="https://www.youtube.com/3blue1brown"
          icon="fab fa-youtube"
          tooltip="Join over 7.5 million subscribers"
          hoverColor="#FF0000"
          label={""}
        />
        <Link
          link="https://3blue1brown.substack.com/"
          icon="fa-solid fa-envelope"
          tooltip="Mailing list"
          hoverColor="#FF6719"
          label={""}
        />
        <Link
          link="https://x.com/3blue1brown"
          icon="fa-brands fa-x-twitter"
          tooltip="Tweets"
          hoverColor="#FFFFFF"
          label={""}
        />
        <Link
          link="https://bsky.app/profile/3blue1brown.com"
          icon="fa-brands fa-bluesky"
          tooltip="Bluesky"
          hoverColor="#00A8E8"
        />
        <Link
          link="https://www.instagram.com/3blue1brown/"
          icon="fab fa-instagram"
          tooltip="Instagram"
          hoverColor="#E4405F"
        />
        <button
          className={styles.expandButton}
          onClick={() => setShowMore(!showMore)}
          title={showMore ? "Show less" : "Show more"}
        >
          <i className={showMore ? "fa-solid fa-chevron-up" : "fa-solid fa-chevron-down"}></i>
        </button>
      </div>
      {showMore && (
        <div className={styles.restRow}>
          <Link
            link="https://www.youtube.com/@grantsanderson"
            icon="fab fa-youtube"
            tooltip="Second channel"
            hoverColor="#FF0000"
          />
          <Link
            link="https://www.tiktok.com/@3blue1brown"
            icon="fab fa-tiktok"
            tooltip="TikTok"
            hoverColor="#FF0050"
          />
          <Link
            link="https://open.spotify.com/show/4MFZ3m3PIfsKBNoVR7yIf2"
            icon="fab fa-spotify"
            tooltip="Videos on spotify"
            hoverColor="#1DB954"
          />
          <Link
            link="https://space.bilibili.com/88461692"
            icon="fa-brands fa-bilibili"
            tooltip="Chinese translations"
            hoverColor="#00A1D6"
          />
          <Link
            link="https://www.facebook.com/3blue1brown"
            icon="fab fa-facebook"
            tooltip="Facebook"
            hoverColor="#1877F2"
          />
          <Link
            link="https://github.com/3b1b"
            icon="fab fa-github"
            tooltip="Source code"
            hoverColor="#FFF"
          />
          <Link
            link="https://www.reddit.com/r/3blue1brown"
            icon="fab fa-reddit"
            tooltip="Community discussions"
            hoverColor="#FF4500"
          />
          <Link
            link="https://www.patreon.com/3blue1brown"
            icon="fab fa-patreon"
            tooltip="Patreon"
            hoverColor="#F96854"
          />
          <Link
            link="https://store.dftba.com/collections/3blue1brown"
            icon="fa-solid fa-store"
            tooltip="Merchandise"
            hoverColor="#4CAF50"
          />
          <Link
            link="https://3blue1brown.substack.com/feed"
            icon="fa-solid fa-rss"
            tooltip="RSS Feed"
            hoverColor="#FF6600"
          />
        </div>
      )}
    </div>
  );
}

async function fetchFollowerCount(setter, storageKey, route) {
  const cache = localStorage.getItem(storageKey);
  const currentTime = new Date().getTime();

  if (cache) {
    const parsedCache = JSON.parse(cache);
    if (parsedCache.expiry > currentTime) {
      setter(parsedCache.followerCount);
      return;
    }
  }

  try {
    const response = await fetch(route);
    const data = await response.json();
    const expiry = currentTime + 24 * 60 * 60 * 1000; // 24 hour cache
    localStorage.setItem(storageKey, JSON.stringify({ followerCount: data.followerCount, expiry }));
    setter(data.followerCount);
  } catch (error) {
    console.error(error);
  }
}

function formatNumber(number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(2) + 'M';
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  } else {
    return number;
  }
}

function Link({ link, icon, tooltip, label = "", restingColor="inherit", hoverColor="inherit"}) {

  const [color, setColor] = useState(restingColor);

  return (
    <NextLink
      href={link} passHref
      className={styles.iconContainer}
      style={{'--hover-color': hoverColor}}
    >
      <Tooltip content={tooltip}>
          <div className={styles.iconLabelContainer}>
            <i className={icon} style={{ color: color }}/>
            {label && (
              <span className={styles.followers} >
                {label}
              </span>
            )}
          </div>
      </Tooltip>
    </NextLink>
  );
}
