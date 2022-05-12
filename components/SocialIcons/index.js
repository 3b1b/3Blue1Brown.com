import React from "react";
import NextLink from "next/link";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";

export default function SocialIcons() {
  return (
    <div className={styles.socialIcons}>
      <Link
        link="https://www.youtube.com/3blue1brown"
        icon="fab fa-youtube"
        tooltip="The main event"
      />
      <Link
        link="https://twitter.com/3blue1brown"
        icon="fab fa-twitter"
        tooltip="Quick animations, mathy threads"
      />
      <Link
        link="https://3blue1brown.substack.com/"
        icon="fas fa-envelope-open-text"
        tooltip="Mailing list for new videos"
      />
      <Link
        link="https://www.patreon.com/3blue1brown"
        icon="fab fa-patreon"
        tooltip="Psst, on the 3b1b Patreon about page you 
        can find a secret video that may or may not include 
        me singing at a nerd comedy event."
      />
      <Link
        link="https://www.reddit.com/r/3Blue1Brown/"
        icon="fab fa-reddit"
        tooltip="Discussion and community"
      />
      <Link
        link="https://www.youtube.com/GrantSanderson"
        icon="fab fa-youtube"
        tooltip="Second channel"
      />
      <Link
        link="https://store.dftba.com/collections/3blue1brown"
        icon="fas fa-store"
        tooltip="Store"
      />
      <Link
        link="http://www.facebook.com/3blue1brown"
        icon="fab fa-facebook"
        tooltip="An unloved facebook presence"
      />
      <Link
        link="https://www.instagram.com/randy_the_pi/"
        icon="fab fa-instagram"
        tooltip="Adventures of Randy the pi"
      />
      <Link
        link="https://www.tiktok.com/@3blue1brown"
        icon="fab fa-tiktok"
        tooltip="Excerpts from the main videos"
      />
    </div>
  );
}

const NLink = React.forwardRef((props, ref) => {
  return (
    <NextLink href={props.link} passHref>
      <a {...props} ref={ref} aria-label={props.label}>
        <i className={props.icon} />
      </a>
    </NextLink>
  );
});
NLink.displayName = "NLink";

// social link
function Link({ link, icon, tooltip, label = "" }) {
  return (
    <Tooltip content={tooltip}>
      <NLink icon={icon} link={link} label={label} />
    </Tooltip>
  );
}
