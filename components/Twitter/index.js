import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Center from "../Center";
import { TwitterTweetEmbed } from "react-twitter-embed";

// https://github.com/saurabhnemade/react-twitter-embed

Twitter.propTypes = {
  tweet: PropTypes.string.isRequired,
};

const width = "500px";

// twitter tweet embed
export default function Twitter({ tweet }) {
  const ref = useRef();

  useEffect(() => {
    // params for mutation observer
    const container = ref.current;
    const options = { childList: true, subtree: true, attributes: true };

    // force width of widget to appropriate value
    const setWidth = () => {
      const wrapper = container.firstChild;
      wrapper.style.width = width;
      wrapper.style.maxWidth = "100%";
      wrapper.style.overflowX = "auto";
    };

    // listen for changes to container (when widget loads)
    new MutationObserver(setWidth).observe(container, options);
  }, []);

  // if no tweet provided, don't render
  if (!tweet) return null;

  return (
    <Center ref={ref}>
      <TwitterTweetEmbed tweetId={tweet} />
    </Center>
  );
}
