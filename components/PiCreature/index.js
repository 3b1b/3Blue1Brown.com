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
  dark: PropTypes.bool,
};

// pi creature/character, with "smart" positioning, and speech/thought bubble
export default function PiCreature({
  emotion = "hooray",
  text,
  thought = false,
  placement = "auto",
  flip = false,
  design,
  dark = false,
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
      data-dark={dark}
    >
      {/* Speech bubble (CSS-based) */}
      {text && !thought && (
        <div className={styles.speech_bubble}>
          <Markdownify>{text}</Markdownify>
        </div>
      )}
      
      {/* Thought bubble (SVG-based) */}
      {text && thought && (
        <div className={styles.thought_bubble}>
          <Bubble />
          <div className={styles.thought_text}>
            <Markdownify>{text}</Markdownify>
          </div>
        </div>
      )}
      
      {/* Pi creature itself */}
      <div className={styles.creature}>
        <img
          src={`/images/pi-creatures/${emotion}.svg`}
          alt={`${emotion} pi creature`}
        />
      </div>
    </div>
  );
}
