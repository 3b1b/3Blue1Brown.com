import NextLink from "next/link";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";
import {useState} from "react";

export default function SocialIcons() {
  return (
    <div className={styles.socialIcons}>
      <Link
        link="https://www.youtube.com/3blue1brown"
        icon="fab fa-youtube"
        tooltip="The main event"
        hoverColor="#ff0000"
      />
      <Link
        link="https://twitter.com/3blue1brown"
        icon="fab fa-twitter"
        tooltip="Mathy threads and animations"
        hoverColor="#1DA1F2"
      />
      <Link
        link="https://www.patreon.com/3blue1brown"
        icon="fab fa-patreon"
        tooltip="Psst, the 3b1b Patreon about page links to a secret video."
        hoverColor="#f96854"
      />
      <Link
        link="https://3blue1brown.substack.com/"
        icon="fas fa-envelope-open-text"
        tooltip="Mailing list for new videos"
        hoverColor="#fe5901"
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
        link="https://www.instagram.com/3blue1brown/"
        icon="fab fa-instagram"
        tooltip="Instagram"
        hoverColor="#FFDC80"
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
        tooltip="Chinese translations on Bilibili"
        hoverColor="#049ed1"
      />
      <Link
        link="https://www.tiktok.com/@3blue1brown"
        icon="fab fa-tiktok"
        tooltip="Excerpts from the main videos"
        hoverColor="#ff0050"
      />
      </div>
  );
}

// social link
function Link({ link, icon, tooltip, label = "", hoverColor="inherit"}) {

  const [color, setColor] = useState('inherit');

  return (
    <NextLink href={link} passHref>
      <Tooltip content={tooltip}>
        <a>
          <i className={icon} style={{color: color}} onMouseEnter={() => setColor(hoverColor)} onMouseLeave={() => setColor('inherit')}/>
        </a>
      </Tooltip>
    </NextLink>
  );
}
