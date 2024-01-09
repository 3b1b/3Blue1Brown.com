import NextLink from "next/link";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";

export default function SocialIcons() {
  return (
    <div className={styles.socialIcons}>
      <div className={styles.topRow}>
        <Link
          link="https://www.youtube.com/3blue1brown"
          icon="fab fa-youtube"
          tooltip="Join over 5 million subscribers"
          hoverColor="#ff0000"
          restingColor="#ff0000"
          label={""}
        />
        <Link
          link="https://twitter.com/3blue1brown"
          icon="fab fa-twitter"
          tooltip="Occasional animations and mathy threads"
          hoverColor="#1DA1F2"
          restingColor="#1DA1F2"
          label={""}
        />
        <Link
          link="https://www.patreon.com/3blue1brown"
          icon="fab fa-patreon"
          tooltip="Support future lessons"
          hoverColor="#f96854"
          restingColor="#f96854"
          label={""}
        />
        <Link
          link="https://www.instagram.com/3blue1brown/"
          icon="fab fa-instagram"
          tooltip="Animations and video excerpts"
          hoverColor="#FFDC80"
          restingColor="#FFDC80"
        />
      </div>
      <div className={styles.restRow}>
        <Link
          link="https://3blue1brown.substack.com/"
          icon="fas fa-envelope-open-text"
          tooltip="Mailing list for new videos"
          hoverColor="#fe5901"
        />
        <Link
          link="https://www.youtube.com/@GrantSanderson"
          icon="fab fa-youtube"
          tooltip="Second channel"
          hoverColor="#ff0000"
        />
        <Link
          link="https://www.tiktok.com/@3blue1brown"
          icon="fab fa-tiktok"
          tooltip="Excerpts from the main videos"
          hoverColor="#ff0050"
        />
        <Link
          link="https://www.reddit.com/r/3Blue1Brown/"
          icon="fab fa-reddit"
          tooltip="Discussion and community"
          hoverColor="#FF4500"
        />
        <Link
          link="https://store.dftba.com/collections/3blue1brown"
          icon="fas fa-store"
          tooltip="Store"
          hoverColor="#09f2fb"
        />
        <Link
          link="http://www.facebook.com/3blue1brown"
          icon="fab fa-facebook"
          tooltip="An unloved facebook presence"
          hoverColor="#4267B2"
        />
        <Link
          link="https://space.bilibili.com/88461692/#/"
          icon="fab fa-bilibili"
          tooltip="Chinese translations"
          hoverColor="#049ed1"
        />
        <Link
          link="https://3blue1brown.substack.com/feed"
          icon="fa-solid fa-rss"
          tooltip="RSS Feed"
          hoverColor="#ffff00"
        />
      </div>
    </div>
  );
}

function Link({
  link,
  icon,
  tooltip,
  label = "",
  restingColor = "inherit",
  hoverColor = "inherit",
}) {
  return (
    <NextLink
      href={link}
      passHref
      className={styles.iconContainer}
      style={{ "--hover-color": hoverColor }}
    >
      <Tooltip content={tooltip}>
        <div className={styles.iconLabelContainer}>
          <i className={icon} style={{ color: restingColor }} />
          {label && <span className={styles.followers}>{label}</span>}
        </div>
      </Tooltip>
    </NextLink>
  );
}
