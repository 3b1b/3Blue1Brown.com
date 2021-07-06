import NextLink from "next/link";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";

export default function SocialIcons() {
  return (
    <div className={styles.socialIcons}>
      <Link
        link="https://3blue1brown.substack.com/"
        icon="fas fa-envelope-open-text"
        tooltip="I know, I know, we all try to 
        keep our inbox clean. But what is that 
        cleanliness for if not to make room for 
        edifying math lessons?"
      />
      <Link
        link="https://www.patreon.com/3blue1brown"
        icon="fab fa-patreon"
        tooltip="Psst, on the 3b1b Patreon about page you 
        can find a secret video that may or may not include 
        me singing at a nerd comedy event."
      />
      <Link
        link="https://www.youtube.com/3blue1brown"
        icon="fab fa-youtube"
        tooltip="Maybe you're not the kind of person who 
        subscribes to YouTube channels, I get that. But 
        consider subscribing to give a gentle nod to the 
        YouTube algorithm saying you want more math in 
        your recommendations."
      />
      <Link
        link="https://store.dftba.com/collections/3blue1brown"
        icon="fas fa-store"
        tooltip="You probably didn't wake up this morning 
        planning to buy a plushie anthropomorphized pi 
        creature or a pair of differential equations themed 
        socks. But sometimes the best things in life are 
        unexpected."
      />
      <Link
        link="https://twitter.com/3blue1brown"
        icon="fab fa-twitter"
        tooltip="Honestly, we should all probably spend 
        less time on Twitter. But when you are there, 
        would you rather have more or less math in your 
        feed?"
      />
      <Link
        link="https://www.reddit.com/r/3Blue1Brown/"
        icon="fab fa-reddit"
        tooltip="Discussion, community, and all that jazz. 
        Also, this subreddit is quite literally the only 
        place I look when considering topic requests."
      />
      <Link
        link="https://www.instagram.com/3blue1brown_animations/"
        icon="fab fa-instagram"
        tooltip="Oh, the 3b1b Instagram. So unloved."
      />
      <Link
        link="http://www.facebook.com/3blue1brown"
        icon="fab fa-facebook"
        tooltip="I'll level with you, this is a very 
        scantily managed Facebook page. It's pretty much 
        just a place to throw up new videos."
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
