import { useRouter } from "next/router";
import { useContext } from "react";
import { PageContext } from "../../pages/_app";
import PropTypes from "prop-types";
import Clickable from "../Clickable";
import SocialIcons from "../SocialIcons";
import styles from "./index.module.scss";

ShareButtons.propTypes = {
  url: PropTypes.string,
  text: PropTypes.string,
};

export default function ShareButtons({ url, text = "" }) {
  const router = useRouter();
  const { description } = useContext(PageContext);

  if (!text && description) {
    text = description + "\n\n";
  }

  const via = "3Blue1Brown"

  if (!url) {
    url = "https://www.3blue1brown.com" + router.asPath;
  }

  const twitterURL = new URL("https://twitter.com/share");
  if (url) twitterURL.searchParams.append("url", url);
  if (text) twitterURL.searchParams.append("text", text);
  if (via) twitterURL.searchParams.append("via", via);

  const facebookURL = new URL("https://www.facebook.com/sharer/sharer.php");
  if (url) facebookURL.searchParams.append("u", url);

  const redditURL = new URL("https://www.reddit.com/submit");
  if (url) redditURL.searchParams.append("url", url);
  if (text) redditURL.searchParams.append("title", text);

  return (
    <div>
      <div className={styles.header}>
        Enjoy this lesson? Consider sharing it.
      </div>
      <Clickable
        link={twitterURL.href}
        text="Twitter"
        icon="fab fa-twitter"
        target="_blank"
      />
      <Clickable
        link={redditURL.href}
        text="Reddit"
        icon="fab fa-reddit"
        target="_blank"
      />
      <Clickable
        link={facebookURL}
        text="Facebook"
        icon="fab fa-facebook"
        target="_blank"
      />

      <div className={styles.header}>Want more math in your life?</div>
      <SocialIcons />
    </div>
  );
}
