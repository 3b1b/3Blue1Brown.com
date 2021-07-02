import { Fragment } from "react";
import PropTypes from "prop-types";
import Markdownify from "../Markdownify";
import styles from "./index.module.scss";
import SpeechBubble from "../../public/images/pi-creatures/bubble-speech.svg";
import ThoughtBubble from "../../public/images/pi-creatures/bubble-thought.svg";
import { useSectionWidth } from "../Section";

PiCreature.propTypes = {
  emotion: PropTypes.string,
  text: PropTypes.string,
  thought: PropTypes.bool,
  placement: PropTypes.oneOf(["side", "auto", "inline"]),
  flip: PropTypes.bool,
  design: PropTypes.oneOf(["small", "big"]),
};

// pi creature/character, with "smart" positioning, and speech/thought bubble
export default function PiCreature({
  emotion = "hooray",
  text,
  thought = false,
  placement = "auto",
  flip = false,
  design,
}) {
  // bubble component
  let Bubble = Fragment;
  if (text) {
    Bubble = thought ? ThoughtBubble : SpeechBubble;
  }

  const sectionWidth = useSectionWidth();

  return (
    <div
      className={styles.pi_creature}
      data-flip={flip}
      data-placement={placement}
      data-design={design}
      data-text={text ? true : false}
      data-sectionwidth={sectionWidth}
    >
      <div className={styles.frame}>
        <img
          src={`/images/pi-creatures/${emotion}.svg`}
          alt={`${emotion} pi creature`}
        />
        <Bubble />
        {text && (
          <div className={styles.text}>
            <Markdownify>{text}</Markdownify>
          </div>
        )}
      </div>
    </div>
  );
}
