import NextLink from "next/link";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";

export default function SocialIcons() {
  return (
    <div className={styles.socialIcons}>
      <Link
        link="https://www.patreon.com/3blue1brown"
        icon="fab fa-patreon"
        tooltip="Patreon"
      />
      <Link
        link="https://www.youtube.com/3blue1brown"
        icon="fab fa-youtube"
        tooltip="YouTube"
      />
      <Link
        link="https://www.reddit.com/r/3Blue1Brown/"
        icon="fab fa-reddit"
        tooltip="Reddit"
      />
      <Link
        link="https://twitter.com/3blue1brown"
        icon="fab fa-twitter"
        tooltip="Twitter"
      />
      <Link
        link="https://www.instagram.com/3blue1brown_animations/"
        icon="fab fa-instagram"
        tooltip="Instagram"
      />
      <Link
        link="http://www.facebook.com/3blue1brown"
        icon="fab fa-facebook"
        tooltip="Facebook"
      />
      <Link
        link="https://store.dftba.com/collections/3blue1brown"
        icon="fas fa-store"
        tooltip="Store"
      />
      <Link
        link="https://3blue1brown.substack.com/"
        icon="fas fa-envelope-open-text"
        tooltip="Mailing list"
      />
    </div>
  );
}

// social link
function Link({ link, icon, tooltip }) {
  return (
    <NextLink href={link} passHref>
      <Tooltip content={tooltip}>
        <a>
          <i className={icon} />
        </a>
      </Tooltip>
    </NextLink>
  );
}
