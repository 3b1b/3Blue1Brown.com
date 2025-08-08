import NextLink from "next/link";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";
import {useState, useEffect} from "react";

export default function SocialIcons() {
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
        <Link
          link="https://3blue1brown.substack.com/feed"
          icon="fa-solid fa-rss"
          tooltip="RSS Feed"
          hoverColor="#FF6600"
        />
      </div>
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
