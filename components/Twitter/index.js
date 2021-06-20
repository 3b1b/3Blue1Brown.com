import { useEffect, useRef } from "react";
import { TwitterTweetEmbed, TwitterShareButton } from "react-twitter-embed";

import Center from "../Center";

// https://github.com/saurabhnemade/react-twitter-embed

const width = "500px";
const options = {
  height: 400,
  via: "3blue1brown",
};

// twitter embed
const Twitter = ({ tweet, share }) => {
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

  return (
    <Center ref={ref}>
      {tweet && <TwitterTweetEmbed tweetId={tweet} />}
      {share && typeof window !== "undefined" && (
        <TwitterShareButton
          url={window.location.href}
          options={{ ...options, text: share }}
        />
      )}
    </Center>
  );
};

export default Twitter;
