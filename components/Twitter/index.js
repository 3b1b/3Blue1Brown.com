import { useEffect, useRef } from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";

import Center from "../Center";

// https://github.com/saurabhnemade/react-twitter-embed

const width = "500px";

// twitter tweet embed
const Twitter = ({ tweet }) => {
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
    <Center ref={ref}>{tweet && <TwitterTweetEmbed tweetId={tweet} />}</Center>
  );
};

export default Twitter;
